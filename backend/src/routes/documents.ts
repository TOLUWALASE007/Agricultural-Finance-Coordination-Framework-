import express, { Response, Router } from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import Document from '../models/Document';
import { authenticateToken, AuthRequest } from './auth';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

const fileFilter = (_req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  cb(null, allowedTypes.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800') } });

// Optional authentication middleware - allows both authenticated and unauthenticated requests
const optionalAuth = (req: AuthRequest, _res: Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = decoded as { userId: string; email: string; userType: string };
    } catch (err) {
      // Token invalid, but we allow the request to proceed without user info
      logger.warn('Invalid token provided for optional auth endpoint');
    }
  }
  next();
};

router.post('/upload', optionalAuth, upload.single('document'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const { documentType, description, relatedEntityType, relatedEntityId } = req.body;

    if (!documentType) {
      res.status(400).json({ error: 'Document type is required' });
      return;
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'document-' + uniqueSuffix + '-' + req.file.originalname.replace(/\s+/g, '_');

    // Store file data in MongoDB
    const doc = await Document.create({
      userId: req.user?.userId ? req.user.userId as any : null,
      filename,
      originalName: req.file.originalname,
      fileData: req.file.buffer, // Store the actual file data
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      documentType,
      description,
      relatedEntityType,
      relatedEntityId: relatedEntityId ? relatedEntityId as any : undefined
    });

    const logMessage = req.user?.userId
      ? `Document uploaded to MongoDB: ${req.file.originalname} by user ${req.user.userId}`
      : `Document uploaded to MongoDB: ${req.file.originalname} (unauthenticated - registration)`;
    logger.info(logMessage);

    res.status(201).json({ success: true, message: 'Document uploaded successfully', data: { id: String(doc._id), filename, originalName: req.file.originalname, fileSize: req.file.size, mimeType: req.file.mimetype, documentType, uploadDate: new Date() } });
  } catch (error: any) {
    logger.error('Upload document error:', error);
    res.status(500).json({ error: 'Server error during file upload' });
  }
});

router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, documentType, relatedEntityType, relatedEntityId, dateFrom, dateTo } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const filter: any = { userId: req.user!.userId };

    if (documentType) filter.documentType = documentType;
    if (relatedEntityType) filter.relatedEntityType = relatedEntityType;
    if (relatedEntityId) filter.relatedEntityId = relatedEntityId;
    if (dateFrom || dateTo) {
      filter.uploadDate = {};
      if (dateFrom) filter.uploadDate.$gte = new Date(dateFrom as string);
      if (dateTo) filter.uploadDate.$lte = new Date(dateTo as string);
    }

    const count = await Document.countDocuments(filter);
    const documents = await Document.find(filter).select('-fileData').sort({ uploadDate: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean();

    res.json({ success: true, data: documents.map(d => ({ id: String(d._id), ...d })), pagination: { page: pageNum, limit: limitNum, total: count, pages: Math.ceil(count / limitNum) } });
  } catch (error: any) {
    logger.error('Get documents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const document = await Document.findOne({ _id: id, userId: req.user!.userId }).select('-fileData');

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    res.json({ success: true, data: { id: String(document._id), ...document.toObject() } });
  } catch (error: any) {
    logger.error('Get document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/download', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const document = await Document.findOne({ _id: id, userId: req.user!.userId });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (!document.fileData) {
      res.status(404).json({ error: 'File data not found' });
      return;
    }

    res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Length', document.fileSize.toString());
    res.send(document.fileData);

    logger.info(`Document downloaded from MongoDB: ${document.originalName} by user ${req.user!.userId}`);
  } catch (error: any) {
    logger.error('Download document error:', error);
    res.status(500).json({ error: 'Server error during download' });
  }
});

router.put('/:id', [authenticateToken, body('documentType').optional().trim(), body('description').optional().trim()], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { documentType, description } = req.body;
    const document = await Document.findOne({ _id: id, userId: req.user!.userId });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    if (documentType) document.documentType = documentType;
    if (description !== undefined) document.description = description;
    await document.save();

    logger.info(`Document updated: ${id} by user ${req.user!.userId}`);
    res.json({ success: true, message: 'Document updated successfully', data: document.toObject() });
  } catch (error: any) {
    logger.error('Update document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const document = await Document.findOne({ _id: id, userId: req.user!.userId });

    if (!document) {
      res.status(404).json({ error: 'Document not found' });
      return;
    }

    await Document.findByIdAndDelete(id);
    logger.info(`Document deleted from MongoDB: ${document.originalName} by user ${req.user!.userId}`);
    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error: any) {
    logger.error('Delete document error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/types/list', authenticateToken, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({
      success: true, data: [
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
      ]
    });
  } catch (error: any) {
    logger.error('Get document types error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Link documents uploaded with an email to a userId
router.post('/link-to-user', async (req: express.Request, res: Response): Promise<void> => {
  try {
    const { documentIds, userId } = req.body;

    if (!documentIds || !userId || !Array.isArray(documentIds)) {
      res.status(400).json({ error: 'documentIds (array) and userId are required' });
      return;
    }

    const result = await Document.updateMany(
      {
        _id: { $in: documentIds },
        $or: [{ userId: null }, { userId: { $exists: false } }]
      },
      { $set: { userId: userId } }
    );

    logger.info(`Linked ${result.modifiedCount} documents to user ${userId} by document IDs`);

    res.json({
      success: true,
      message: `Linked ${result.modifiedCount} documents to user`,
      count: result.modifiedCount
    });
  } catch (error: any) {
    logger.error('Link documents error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
