const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('./auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, and Office documents are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  }
});

// @route   POST /api/documents/upload
// @desc    Upload document
// @access  Private
router.post('/upload', authenticateToken, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { documentType, description, relatedEntityType, relatedEntityId } = req.body;

    if (!documentType) {
      // Delete uploaded file if validation fails
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Document type is required' });
    }

    const [documentId] = await db('documents').insert({
      user_id: req.user.userId,
      filename: req.file.filename,
      original_name: req.file.originalname,
      file_path: req.file.path,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      document_type: documentType,
      description: description || null,
      related_entity_type: relatedEntityType || null,
      related_entity_id: relatedEntityId || null,
      upload_date: new Date()
    });

    logger.info(`Document uploaded: ${req.file.originalname} by user ${req.user.userId}`);

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        id: documentId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        documentType,
        uploadDate: new Date()
      }
    });

  } catch (error) {
    logger.error('Upload document error:', error);
    
    // Clean up uploaded file if database insert fails
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        logger.error('Failed to clean up uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({ error: 'Server error during file upload' });
  }
});

// @route   GET /api/documents
// @desc    Get user documents
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      documentType, 
      relatedEntityType,
      relatedEntityId,
      dateFrom,
      dateTo
    } = req.query;
    const offset = (page - 1) * limit;

    let query = db('documents')
      .select('*')
      .where({ user_id: req.user.userId })
      .orderBy('upload_date', 'desc');

    // Apply filters
    if (documentType) {
      query = query.where('document_type', documentType);
    }
    if (relatedEntityType) {
      query = query.where('related_entity_type', relatedEntityType);
    }
    if (relatedEntityId) {
      query = query.where('related_entity_id', relatedEntityId);
    }
    if (dateFrom) {
      query = query.where('upload_date', '>=', dateFrom);
    }
    if (dateTo) {
      query = query.where('upload_date', '<=', dateTo);
    }

    // Get total count
    const totalQuery = query.clone();
    const [{ count }] = await totalQuery.count('* as count');

    // Apply pagination
    const documents = await query.limit(limit).offset(offset);

    res.json({
      success: true,
      data: documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    logger.error('Get documents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/documents/:id
// @desc    Get document details
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await db('documents')
      .where({ id, user_id: req.user.userId })
      .first();

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      success: true,
      data: document
    });

  } catch (error) {
    logger.error('Get document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/documents/:id/download
// @desc    Download document
// @access  Private
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await db('documents')
      .where({ id, user_id: req.user.userId })
      .first();

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Check if file exists
    try {
      await fs.access(document.file_path);
    } catch (error) {
      logger.error(`File not found: ${document.file_path}`);
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${document.original_name}"`);
    res.setHeader('Content-Type', document.mime_type);
    res.setHeader('Content-Length', document.file_size);

    // Stream the file
    const fileStream = require('fs').createReadStream(document.file_path);
    fileStream.pipe(res);

    logger.info(`Document downloaded: ${document.original_name} by user ${req.user.userId}`);

  } catch (error) {
    logger.error('Download document error:', error);
    res.status(500).json({ error: 'Server error during download' });
  }
});

// @route   PUT /api/documents/:id
// @desc    Update document details
// @access  Private
router.put('/:id', [
  authenticateToken,
  body('documentType').optional().trim(),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { documentType, description } = req.body;

    const document = await db('documents')
      .where({ id, user_id: req.user.userId })
      .first();

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const updateData = {};
    if (documentType) updateData.document_type = documentType;
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updated = await db('documents')
      .where({ id })
      .update(updateData)
      .returning('*');

    logger.info(`Document updated: ${id} by user ${req.user.userId}`);

    res.json({
      success: true,
      message: 'Document updated successfully',
      data: updated[0]
    });

  } catch (error) {
    logger.error('Update document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const document = await db('documents')
      .where({ id, user_id: req.user.userId })
      .first();

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Delete file from filesystem
    try {
      await fs.unlink(document.file_path);
    } catch (error) {
      logger.warn(`Failed to delete file from filesystem: ${document.file_path}`, error);
    }

    // Delete record from database
    await db('documents')
      .where({ id })
      .del();

    logger.info(`Document deleted: ${document.original_name} by user ${req.user.userId}`);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    logger.error('Delete document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/documents/types/list
// @desc    Get list of document types
// @access  Private
router.get('/types/list', authenticateToken, async (req, res) => {
  try {
    const documentTypes = [
      { value: 'identification', label: 'Identification Document' },
      { value: 'business_registration', label: 'Business Registration' },
      { value: 'tax_certificate', label: 'Tax Certificate' },
      { value: 'financial_statement', label: 'Financial Statement' },
      { value: 'bank_statement', label: 'Bank Statement' },
      { value: 'collateral_document', label: 'Collateral Document' },
      { value: 'insurance_certificate', label: 'Insurance Certificate' },
      { value: 'loan_application', label: 'Loan Application' },
      { value: 'loan_agreement', label: 'Loan Agreement' },
      { value: 'repayment_schedule', label: 'Repayment Schedule' },
      { value: 'farm_registration', label: 'Farm Registration' },
      { value: 'anchor_agreement', label: 'Anchor Agreement' },
      { value: 'produce_certificate', label: 'Produce Certificate' },
      { value: 'other', label: 'Other' }
    ];

    res.json({
      success: true,
      data: documentTypes
    });

  } catch (error) {
    logger.error('Get document types error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/documents/stats/overview
// @desc    Get document statistics for user
// @access  Private
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const [
      totalDocuments,
      totalSize,
      typeStats
    ] = await Promise.all([
      db('documents').where('user_id', req.user.userId).count('* as count').first(),
      db('documents').where('user_id', req.user.userId).sum('file_size as total').first(),
      db('documents')
        .select('document_type')
        .count('* as count')
        .sum('file_size as total_size')
        .where('user_id', req.user.userId)
        .groupBy('document_type')
    ]);

    res.json({
      success: true,
      data: {
        total: totalDocuments.count,
        totalSize: totalSize.total || 0,
        byType: typeStats
      }
    });

  } catch (error) {
    logger.error('Get document stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
