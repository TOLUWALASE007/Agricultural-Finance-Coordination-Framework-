import express, { Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import Loan from '../models/Loan';
import Stakeholder from '../models/Stakeholder';
import { authenticateToken, AuthRequest } from './auth';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// @route   GET /api/loans
// @desc    Get all loans
// @access  Private
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, borrowerId, lenderId, loanPurpose, dateFrom, dateTo } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const filter: any = {};
    if (status) filter.status = status;
    if (borrowerId) filter.borrowerId = borrowerId;
    if (lenderId) filter.lenderId = lenderId;
    if (loanPurpose) filter.loanPurpose = loanPurpose;
    if (dateFrom || dateTo) {
      filter.applicationDate = {};
      if (dateFrom) filter.applicationDate.$gte = new Date(dateFrom as string);
      if (dateTo) filter.applicationDate.$lte = new Date(dateTo as string);
    }

    const count = await Loan.countDocuments(filter);
    const loans = await Loan.find(filter)
      .populate('borrowerId', 'organizationName stakeholderType')
      .populate('lenderId', 'organizationName stakeholderType')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      data: loans.map(l => ({ id: String(l._id), ...l })),
      pagination: { page: pageNum, limit: limitNum, total: count, pages: Math.ceil(count / limitNum) }
    });
  } catch (error: any) {
    logger.error('Get loans error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/loans/:id
// @desc    Get loan by ID
// @access  Private
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const loan = await Loan.findById(id)
      .populate('borrowerId', 'organizationName stakeholderType userId')
      .populate('lenderId', 'organizationName stakeholderType userId')
      .populate('coordinatingAgencyId', 'organizationName')
      .populate('insuranceProviderId', 'organizationName');

    if (!loan) {
      res.status(404).json({ error: 'Loan not found' });
      return;
    }

    const borrower = loan.borrowerId as any;
    const lender = loan.lenderId as any;
    const hasAccess = req.user!.userType === 'admin' ||
      req.user!.userId === String(borrower?.userId) ||
      req.user!.userId === String(lender?.userId) ||
      req.user!.userType === 'coordinating_agency';

    if (!hasAccess) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({ success: true, data: { id: String(loan._id), ...loan.toObject() } });
  } catch (error: any) {
    logger.error('Get loan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/loans
// @desc    Create new loan application
// @access  Private
router.post('/', [
  authenticateToken,
  body('borrowerId').isMongoId(),
  body('lenderId').isMongoId(),
  body('principalAmount').isFloat({ min: 1 }),
  body('interestRate').isFloat({ min: 0, max: 100 }),
  body('tenorMonths').isInt({ min: 1 }),
  body('loanPurpose').isIn(['crop_production', 'livestock', 'machinery_purchase', 'input_purchase', 'infrastructure', 'working_capital', 'other'])
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { borrowerId, lenderId, coordinatingAgencyId, principalAmount, interestRate, interestType = 'fixed', tenorMonths, loanPurpose, purposeDescription, hasInsurance = false, insurancePremium, insuranceProviderId, collateralDescription, collateralValue } = req.body;

    const [borrower, lender] = await Promise.all([
      Stakeholder.findById(borrowerId),
      Stakeholder.findById(lenderId)
    ]);

    if (!borrower || !lender) {
      res.status(400).json({ error: 'Borrower or lender not found' });
      return;
    }

    if (borrower.verificationStatus !== 'verified') {
      res.status(400).json({ error: 'Borrower must be verified to apply for loans' });
      return;
    }

    const loanReference = `AFCF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const monthlyRate = interestRate / 100 / 12;
    const totalAmount = principalAmount * Math.pow(1 + monthlyRate, tenorMonths);
    const monthlyPayment = principalAmount * (monthlyRate * Math.pow(1 + monthlyRate, tenorMonths)) / (Math.pow(1 + monthlyRate, tenorMonths) - 1);

    const loan = await Loan.create({
      loanReference,
      borrowerId,
      lenderId,
      coordinatingAgencyId,
      principalAmount,
      interestRate,
      interestType,
      tenorMonths,
      monthlyPayment,
      totalAmount,
      loanPurpose,
      purposeDescription,
      hasInsurance,
      insurancePremium,
      insuranceProviderId,
      collateralDescription,
      collateralValue,
      outstandingBalance: totalAmount,
      paymentsDue: tenorMonths,
      status: 'submitted'
    });

    logger.info(`Loan application created: ${loanReference}`);
    res.status(201).json({ success: true, message: 'Loan application submitted successfully', data: { id: String(loan._id), loanReference, status: 'submitted' } });
  } catch (error: any) {
    logger.error('Create loan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/loans/:id/approve
// @desc    Approve loan application
// @access  Private
router.put('/:id/approve', [authenticateToken, body('approvalNotes').optional().trim()], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!['admin', 'coordinating_agency', 'pfi'].includes(req.user!.userType)) {
      res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
      return;
    }

    const { id } = req.params;
    const { approvalNotes } = req.body;
    const loan = await Loan.findById(id);

    if (!loan || !['submitted', 'under_review'].includes(loan.status)) {
      res.status(400).json({ error: 'Loan cannot be approved in current status' });
      return;
    }

    loan.status = 'approved';
    loan.approvalDate = new Date();
    loan.approvedBy = req.user!.userId as any;
    loan.approvalNotes = approvalNotes;
    await loan.save();

    logger.info(`Loan approved: ${loan.loanReference}`);
    res.json({ success: true, message: 'Loan approved successfully', data: loan.toObject() });
  } catch (error: any) {
    logger.error('Approve loan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/loans/:id/reject
// @desc    Reject loan application
// @access  Private
router.put('/:id/reject', [authenticateToken, body('rejectionReason').trim().isLength({ min: 10 })], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!['admin', 'coordinating_agency', 'pfi'].includes(req.user!.userType)) {
      res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
      return;
    }

    const { id } = req.params;
    const { rejectionReason } = req.body;
    const loan = await Loan.findById(id);

    if (!loan || !['submitted', 'under_review'].includes(loan.status)) {
      res.status(400).json({ error: 'Loan cannot be rejected in current status' });
      return;
    }

    loan.status = 'rejected';
    loan.rejectionReason = rejectionReason;
    await loan.save();

    logger.info(`Loan rejected: ${loan.loanReference}`);
    res.json({ success: true, message: 'Loan rejected successfully', data: loan.toObject() });
  } catch (error: any) {
    logger.error('Reject loan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/loans/:id/disburse
// @desc    Disburse approved loan
// @access  Private
router.put('/:id/disburse', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!['admin', 'coordinating_agency', 'pfi'].includes(req.user!.userType)) {
      res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
      return;
    }

    const { id } = req.params;
    const loan = await Loan.findById(id);

    if (!loan || loan.status !== 'approved') {
      res.status(400).json({ error: 'Only approved loans can be disbursed' });
      return;
    }

    loan.status = 'disbursed';
    loan.disbursementDate = new Date();
    await loan.save();

    logger.info(`Loan disbursed: ${loan.loanReference}`);
    res.json({ success: true, message: 'Loan disbursed successfully', data: loan.toObject() });
  } catch (error: any) {
    logger.error('Disburse loan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/loans/stats/overview
// @desc    Get loan statistics overview
// @access  Private
router.get('/stats/overview', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!['admin', 'coordinating_agency'].includes(req.user!.userType)) {
      res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
      return;
    }

    const [totalLoans, totalAmount, statusStats, purposeStats] = await Promise.all([
      Loan.countDocuments(),
      Loan.aggregate([{ $group: { _id: null, total: { $sum: '$principalAmount' } } }]),
      Loan.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Loan.aggregate([{ $group: { _id: '$loanPurpose', count: { $sum: 1 } } }])
    ]);

    res.json({
      success: true,
      data: {
        total: totalLoans,
        totalAmount: totalAmount[0]?.total || 0,
        byStatus: statusStats,
        byPurpose: purposeStats
      }
    });
  } catch (error: any) {
    logger.error('Get loan stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
