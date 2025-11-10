import express, { Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import Stakeholder from '../models/Stakeholder';
import { authenticateToken, AuthRequest } from './auth';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// @route   GET /api/stakeholders
// @desc    Get all stakeholders
// @access  Private
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      stakeholderType, 
      verificationStatus, 
      portalAccess,
      search 
    } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const filter: any = {};
    if (stakeholderType) filter.stakeholderType = stakeholderType;
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (portalAccess) filter.portalAccess = portalAccess;

    let query = Stakeholder.find(filter).populate('userId', 'email firstName lastName phone');

    if (search) {
      query = Stakeholder.find({
        ...filter,
        $or: [
          { organizationName: { $regex: search as string, $options: 'i' } }
        ]
      }).populate({
        path: 'userId',
        match: {
          $or: [
            { email: { $regex: search as string, $options: 'i' } },
            { firstName: { $regex: search as string, $options: 'i' } },
            { lastName: { $regex: search as string, $options: 'i' } }
          ]
        },
        select: 'email firstName lastName phone'
      });
    }

    const count = await Stakeholder.countDocuments(filter);
    const stakeholders = await query
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      data: stakeholders.map(s => ({ id: String(s._id), ...s })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum)
      }
    });

  } catch (error: any) {
    logger.error('Get stakeholders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/stakeholders/:id
// @desc    Get stakeholder by ID
// @access  Private
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const stakeholder = await Stakeholder.findById(id).populate('userId', 'email firstName lastName phone userType');

    if (!stakeholder) {
      res.status(404).json({ error: 'Stakeholder not found' });
      return;
    }

    // Check access permissions
    const userIdStr = String(stakeholder.userId);
    if (req.user!.userId !== userIdStr && req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({
      success: true,
      data: { id: String(stakeholder._id), ...stakeholder.toObject() }
    });

  } catch (error: any) {
    logger.error('Get stakeholder error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/stakeholders
// @desc    Create new stakeholder profile
// @access  Private
router.post('/', [
  authenticateToken,
  body('stakeholderType').isIn([
    'fund_provider', 'coordinating_agency', 'pfi', 'insurance', 'pmt',
    'anchor', 'lead_firm', 'farmer', 'cooperative_group',
    'extension_organization', 'researcher_student'
  ]),
  body('organizationName').optional().trim().isLength({ min: 2 }),
  body('registrationNumber').optional().trim(),
  body('contactPersonName').optional().trim().isLength({ min: 2 }),
  body('contactPersonEmail').optional().isEmail()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const {
      stakeholderType,
      organizationName,
      registrationNumber,
      taxId,
      legalStatus,
      businessField,
      registeredAddress,
      city,
      state,
      postalCode,
      website,
      staffStrength,
      contactPersonName,
      contactPersonTitle,
      contactPersonEmail,
      contactPersonDesignation,
      contactPersonPhone,
      portalAccess,
      permissions
    } = req.body;

    // Check if stakeholder profile already exists for this user
    const existingStakeholder = await Stakeholder.findOne({ userId: req.user!.userId });

    if (existingStakeholder) {
      res.status(400).json({ error: 'Stakeholder profile already exists for this user' });
      return;
    }

    const stakeholder = await Stakeholder.create({
      userId: req.user!.userId,
      stakeholderType,
      organizationName,
      registrationNumber,
      taxId,
      legalStatus,
      businessField,
      registeredAddress,
      city,
      state,
      postalCode,
      website,
      staffStrength,
      contactPersonName,
      contactPersonTitle,
      contactPersonEmail,
      contactPersonDesignation,
      contactPersonPhone,
      portalAccess,
      permissions,
      verificationStatus: 'pending'
    });

    logger.info(`Stakeholder profile created: ${stakeholder._id}`);

    res.status(201).json({
      success: true,
      message: 'Stakeholder profile created successfully',
      data: { id: String(stakeholder._id) }
    });

  } catch (error: any) {
    logger.error('Create stakeholder error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/stakeholders/:id
// @desc    Update stakeholder profile
// @access  Private
router.put('/:id', [
  authenticateToken,
  body('organizationName').optional().trim().isLength({ min: 2 }),
  body('contactPersonEmail').optional().isEmail()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;

    // Check if stakeholder exists and user has access
    const stakeholder = await Stakeholder.findById(id);

    if (!stakeholder) {
      res.status(404).json({ error: 'Stakeholder not found' });
      return;
    }

    // Check access permissions
    const userIdStr = String(stakeholder.userId);
    if (req.user!.userId !== userIdStr && req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const {
      organizationName,
      registrationNumber,
      taxId,
      legalStatus,
      businessField,
      registeredAddress,
      city,
      state,
      postalCode,
      website,
      staffStrength,
      contactPersonName,
      contactPersonTitle,
      contactPersonEmail,
      contactPersonDesignation,
      contactPersonPhone,
      portalAccess,
      permissions
    } = req.body;

    if (organizationName !== undefined) stakeholder.organizationName = organizationName;
    if (registrationNumber !== undefined) stakeholder.registrationNumber = registrationNumber;
    if (taxId !== undefined) stakeholder.taxId = taxId;
    if (legalStatus !== undefined) stakeholder.legalStatus = legalStatus;
    if (businessField !== undefined) stakeholder.businessField = businessField;
    if (registeredAddress !== undefined) stakeholder.registeredAddress = registeredAddress;
    if (city !== undefined) stakeholder.city = city;
    if (state !== undefined) stakeholder.state = state;
    if (postalCode !== undefined) stakeholder.postalCode = postalCode;
    if (website !== undefined) stakeholder.website = website;
    if (staffStrength !== undefined) stakeholder.staffStrength = staffStrength;
    if (contactPersonName !== undefined) stakeholder.contactPersonName = contactPersonName;
    if (contactPersonTitle !== undefined) stakeholder.contactPersonTitle = contactPersonTitle;
    if (contactPersonEmail !== undefined) stakeholder.contactPersonEmail = contactPersonEmail;
    if (contactPersonDesignation !== undefined) stakeholder.contactPersonDesignation = contactPersonDesignation;
    if (contactPersonPhone !== undefined) stakeholder.contactPersonPhone = contactPersonPhone;
    if (portalAccess !== undefined) stakeholder.portalAccess = portalAccess;
    if (permissions !== undefined) stakeholder.permissions = permissions;

    await stakeholder.save();

    logger.info(`Stakeholder updated: ${id}`);

    res.json({
      success: true,
      message: 'Stakeholder updated successfully',
      data: stakeholder.toObject()
    });

  } catch (error: any) {
    logger.error('Update stakeholder error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/stakeholders/:id/verify
// @desc    Verify stakeholder (admin only)
// @access  Private
router.put('/:id/verify', [
  authenticateToken,
  body('verificationStatus').isIn(['pending', 'verified', 'rejected']),
  body('verificationNotes').optional().trim()
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { verificationStatus, verificationNotes } = req.body;

    const stakeholder = await Stakeholder.findById(id);
    if (!stakeholder) {
      res.status(404).json({ error: 'Stakeholder not found' });
      return;
    }

    stakeholder.verificationStatus = verificationStatus;
    if (verificationNotes) stakeholder.verificationNotes = verificationNotes;
    stakeholder.verifiedBy = req.user!.userId as any;
    stakeholder.verifiedAt = new Date();
    await stakeholder.save();

    logger.info(`Stakeholder verification updated: ${id} - ${verificationStatus}`);

    res.json({
      success: true,
      message: 'Stakeholder verification updated successfully',
      data: stakeholder.toObject()
    });

  } catch (error: any) {
    logger.error('Verify stakeholder error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/stakeholders/stats/overview
// @desc    Get stakeholder statistics overview
// @access  Private
router.get('/stats/overview', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      return;
    }

    const [
      totalStakeholders,
      verifiedStakeholders,
      pendingStakeholders,
      rejectedStakeholders,
      stakeholderTypeStats,
      portalAccessStats
    ] = await Promise.all([
      Stakeholder.countDocuments(),
      Stakeholder.countDocuments({ verificationStatus: 'verified' }),
      Stakeholder.countDocuments({ verificationStatus: 'pending' }),
      Stakeholder.countDocuments({ verificationStatus: 'rejected' }),
      Stakeholder.aggregate([
        { $group: { _id: '$stakeholderType', count: { $sum: 1 } } }
      ]),
      Stakeholder.aggregate([
        { $match: { portalAccess: { $ne: null } } },
        { $group: { _id: '$portalAccess', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        total: totalStakeholders,
        verified: verifiedStakeholders,
        pending: pendingStakeholders,
        rejected: rejectedStakeholders,
        byType: stakeholderTypeStats,
        byPortal: portalAccessStats
      }
    });

  } catch (error: any) {
    logger.error('Get stakeholder stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/stakeholders/:id
// @desc    Delete stakeholder profile
// @access  Private
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if stakeholder exists and user has access
    const stakeholder = await Stakeholder.findById(id);

    if (!stakeholder) {
      res.status(404).json({ error: 'Stakeholder not found' });
      return;
    }

    // Only admin or the stakeholder owner can delete
    const userIdStr = String(stakeholder.userId);
    if (req.user!.userId !== userIdStr && req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Stakeholder.findByIdAndDelete(id);

    logger.info(`Stakeholder deleted: ${id}`);

    res.json({
      success: true,
      message: 'Stakeholder profile deleted successfully'
    });

  } catch (error: any) {
    logger.error('Delete stakeholder error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
