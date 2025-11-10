import express, { Request, Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Scheme from '../models/Scheme';
import { authenticateToken, AuthRequest } from './auth';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// @route   POST /api/schemes
// @desc    Create a new scheme
// @access  Private (Coordinating Agency only)
router.post('/', 
  authenticateToken,
  [
    body('schemeName').trim().notEmpty().withMessage('Scheme name is required'),
    body('schemeId').trim().notEmpty().withMessage('Scheme ID is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('amount').trim().notEmpty().withMessage('Amount is required'),
    body('states').isArray({ min: 1 }).withMessage('At least one state must be selected'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('applicationDeadline').isISO8601().withMessage('Valid application deadline is required')
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Check if user is coordinating agency
      if (req.user!.userType !== 'coordinating_agency') {
        res.status(403).json({ error: 'Access denied. Only Coordinating Agency can create schemes.' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { schemeName, schemeId, description, amount, states, startDate, applicationDeadline, fundProvider } = req.body;

      // Check if scheme ID already exists
      const existingScheme = await Scheme.findOne({ schemeId });
      if (existingScheme) {
        res.status(400).json({ error: 'Scheme ID already exists' });
        return;
      }

      const scheme = new Scheme({
        schemeName,
        schemeId,
        description,
        amount,
        states,
        startDate: new Date(startDate),
        applicationDeadline: new Date(applicationDeadline),
        status: 'Active',
        createdBy: new mongoose.Types.ObjectId(req.user!.userId),
        fundProvider: fundProvider || undefined,
        beneficiaries: 0,
        recoveryRate: '0%'
      });

      await scheme.save();

      logger.info(`Scheme created: ${schemeId} by user ${req.user!.userId}`);

      res.status(201).json({
        success: true,
        message: 'Scheme created successfully',
        data: {
          id: scheme._id,
          schemeName: scheme.schemeName,
          schemeId: scheme.schemeId,
          description: scheme.description,
          amount: scheme.amount,
          states: scheme.states,
          startDate: scheme.startDate,
          applicationDeadline: scheme.applicationDeadline,
          status: scheme.status,
          fundProvider: scheme.fundProvider,
          beneficiaries: scheme.beneficiaries,
          recoveryRate: scheme.recoveryRate,
          createdAt: scheme.createdAt,
          updatedAt: scheme.updatedAt
        }
      });

    } catch (error: any) {
      logger.error('Create scheme error:', error);
      if (error.code === 11000) {
        res.status(400).json({ error: 'Scheme ID already exists' });
        return;
      }
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   GET /api/schemes
// @desc    Get all schemes (public - viewable by all)
// @access  Public
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, state, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (state && state !== 'All') {
      filter.states = { $in: [state] };
    }

    if (search) {
      filter.$or = [
        { schemeName: { $regex: search as string, $options: 'i' } },
        { schemeId: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } }
      ];
    }

    const count = await Scheme.countDocuments(filter);
    const schemes = await Scheme.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      data: schemes.map(scheme => ({
        id: String(scheme._id),
        schemeName: scheme.schemeName,
        schemeId: scheme.schemeId,
        description: scheme.description,
        amount: scheme.amount,
        states: scheme.states,
        state: scheme.states.length > 3 ? 'Multi-State' : scheme.states.join(', '),
        startDate: scheme.startDate,
        applicationDeadline: scheme.applicationDeadline,
        status: scheme.status,
        fundProvider: scheme.fundProvider,
        beneficiaries: scheme.beneficiaries || 0,
        recoveryRate: scheme.recoveryRate || '0%',
        createdAt: scheme.createdAt,
        updatedAt: scheme.updatedAt
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum)
      }
    });

  } catch (error: any) {
    logger.error('Get schemes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/schemes/:id
// @desc    Get a single scheme by ID (public - viewable by all)
// @access  Public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const scheme = await Scheme.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .lean();

    if (!scheme) {
      res.status(404).json({ error: 'Scheme not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: String(scheme._id),
        schemeName: scheme.schemeName,
        schemeId: scheme.schemeId,
        description: scheme.description,
        amount: scheme.amount,
        states: scheme.states,
        state: scheme.states.length > 3 ? 'Multi-State' : scheme.states.join(', '),
        startDate: scheme.startDate,
        applicationDeadline: scheme.applicationDeadline,
        status: scheme.status,
        fundProvider: scheme.fundProvider,
        beneficiaries: scheme.beneficiaries || 0,
        recoveryRate: scheme.recoveryRate || '0%',
        createdBy: scheme.createdBy,
        createdAt: scheme.createdAt,
        updatedAt: scheme.updatedAt
      }
    });

  } catch (error: any) {
    logger.error('Get scheme error:', error);
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid scheme ID' });
      return;
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PATCH /api/schemes/:id/status
// @desc    Update scheme status (activate/deactivate)
// @access  Private (Coordinating Agency only)
router.patch('/:id/status',
  authenticateToken,
  [
    body('status').isIn(['Active', 'Inactive', 'Completed']).withMessage('Invalid status')
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Check if user is coordinating agency
      if (req.user!.userType !== 'coordinating_agency') {
        res.status(403).json({ error: 'Access denied. Only Coordinating Agency can update scheme status.' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { status } = req.body;
      const scheme = await Scheme.findById(req.params.id);

      if (!scheme) {
        res.status(404).json({ error: 'Scheme not found' });
        return;
      }

      scheme.status = status;
      await scheme.save();

      logger.info(`Scheme ${scheme.schemeId} status updated to ${status} by user ${req.user!.userId}`);

      res.json({
        success: true,
        message: `Scheme ${status === 'Inactive' ? 'deactivated' : 'activated'} successfully`,
        data: {
          id: String(scheme._id),
          schemeId: scheme.schemeId,
          schemeName: scheme.schemeName,
          status: scheme.status
        }
      });

    } catch (error: any) {
      logger.error('Update scheme status error:', error);
      if (error.name === 'CastError') {
        res.status(400).json({ error: 'Invalid scheme ID' });
        return;
      }
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// @route   PUT /api/schemes/:id
// @desc    Update scheme details
// @access  Private (Coordinating Agency only)
router.put('/:id',
  authenticateToken,
  [
    body('schemeName').optional().trim().notEmpty().withMessage('Scheme name cannot be empty'),
    body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
    body('amount').optional().trim().notEmpty().withMessage('Amount cannot be empty'),
    body('states').optional().isArray({ min: 1 }).withMessage('At least one state must be selected'),
    body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
    body('applicationDeadline').optional().isISO8601().withMessage('Valid application deadline is required')
  ],
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      // Check if user is coordinating agency
      if (req.user!.userType !== 'coordinating_agency') {
        res.status(403).json({ error: 'Access denied. Only Coordinating Agency can update schemes.' });
        return;
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const scheme = await Scheme.findById(req.params.id);

      if (!scheme) {
        res.status(404).json({ error: 'Scheme not found' });
        return;
      }

      // Update allowed fields
      const { schemeName, description, amount, states, startDate, applicationDeadline, fundProvider } = req.body;

      if (schemeName) scheme.schemeName = schemeName;
      if (description) scheme.description = description;
      if (amount) scheme.amount = amount;
      if (states) scheme.states = states;
      if (startDate) scheme.startDate = new Date(startDate);
      if (applicationDeadline) scheme.applicationDeadline = new Date(applicationDeadline);
      if (fundProvider !== undefined) scheme.fundProvider = fundProvider;

      await scheme.save();

      logger.info(`Scheme ${scheme.schemeId} updated by user ${req.user!.userId}`);

      res.json({
        success: true,
        message: 'Scheme updated successfully',
        data: {
          id: String(scheme._id),
          schemeName: scheme.schemeName,
          schemeId: scheme.schemeId,
          description: scheme.description,
          amount: scheme.amount,
          states: scheme.states,
          startDate: scheme.startDate,
          applicationDeadline: scheme.applicationDeadline,
          status: scheme.status,
          fundProvider: scheme.fundProvider,
          beneficiaries: scheme.beneficiaries,
          recoveryRate: scheme.recoveryRate,
          updatedAt: scheme.updatedAt
        }
      });

    } catch (error: any) {
      logger.error('Update scheme error:', error);
      if (error.name === 'CastError') {
        res.status(400).json({ error: 'Invalid scheme ID' });
        return;
      }
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;

