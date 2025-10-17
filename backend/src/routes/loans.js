const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('./auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// @route   GET /api/loans
// @desc    Get all loans
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      borrowerId,
      lenderId,
      loanPurpose,
      dateFrom,
      dateTo
    } = req.query;
    const offset = (page - 1) * limit;

    let query = db('loans as l')
      .select(
        'l.*',
        'b.organization_name as borrower_name',
        'b.stakeholder_type as borrower_type',
        'len.organization_name as lender_name',
        'len.stakeholder_type as lender_type'
      )
      .join('stakeholders as b', 'l.borrower_id', 'b.id')
      .join('stakeholders as len', 'l.lender_id', 'len.id')
      .orderBy('l.created_at', 'desc');

    // Apply filters
    if (status) {
      query = query.where('l.status', status);
    }
    if (borrowerId) {
      query = query.where('l.borrower_id', borrowerId);
    }
    if (lenderId) {
      query = query.where('l.lender_id', lenderId);
    }
    if (loanPurpose) {
      query = query.where('l.loan_purpose', loanPurpose);
    }
    if (dateFrom) {
      query = query.where('l.application_date', '>=', dateFrom);
    }
    if (dateTo) {
      query = query.where('l.application_date', '<=', dateTo);
    }

    // Get total count
    const totalQuery = query.clone();
    const [{ count }] = await totalQuery.count('* as count');

    // Apply pagination
    const loans = await query.limit(limit).offset(offset);

    res.json({
      success: true,
      data: loans,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    logger.error('Get loans error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/loans/:id
// @desc    Get loan by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const loan = await db('loans as l')
      .select(
        'l.*',
        'b.organization_name as borrower_name',
        'b.stakeholder_type as borrower_type',
        'b.user_id as borrower_user_id',
        'len.organization_name as lender_name',
        'len.stakeholder_type as lender_type',
        'len.user_id as lender_user_id',
        'ca.organization_name as coordinating_agency_name',
        'ip.organization_name as insurance_provider_name',
        'dp.organization_name as derisking_provider_name'
      )
      .join('stakeholders as b', 'l.borrower_id', 'b.id')
      .join('stakeholders as len', 'l.lender_id', 'len.id')
      .leftJoin('stakeholders as ca', 'l.coordinating_agency_id', 'ca.id')
      .leftJoin('stakeholders as ip', 'l.insurance_provider_id', 'ip.id')
      .leftJoin('stakeholders as dp', 'l.derisking_provider_id', 'dp.id')
      .where('l.id', id)
      .first();

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check access permissions
    const hasAccess = req.user.userType === 'admin' ||
                     req.user.userId === loan.borrower_user_id ||
                     req.user.userId === loan.lender_user_id ||
                     req.user.userType === 'coordinating_agency';

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      data: loan
    });

  } catch (error) {
    logger.error('Get loan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/loans
// @desc    Create new loan application
// @access  Private
router.post('/', [
  authenticateToken,
  body('borrowerId').isInt(),
  body('lenderId').isInt(),
  body('principalAmount').isFloat({ min: 1 }),
  body('interestRate').isFloat({ min: 0, max: 100 }),
  body('tenorMonths').isInt({ min: 1 }),
  body('loanPurpose').isIn([
    'crop_production', 'livestock', 'machinery_purchase', 'input_purchase',
    'infrastructure', 'working_capital', 'other'
  ])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      borrowerId,
      lenderId,
      coordinatingAgencyId,
      principalAmount,
      interestRate,
      interestType = 'fixed',
      tenorMonths,
      loanPurpose,
      purposeDescription,
      hasInsurance = false,
      insurancePremium,
      insuranceProviderId,
      hasDerisking = false,
      deriskingAmount,
      deriskingProviderId,
      collateralDescription,
      collateralValue
    } = req.body;

    // Check if borrower and lender exist
    const [borrower, lender] = await Promise.all([
      db('stakeholders').where({ id: borrowerId }).first(),
      db('stakeholders').where({ id: lenderId }).first()
    ]);

    if (!borrower) {
      return res.status(400).json({ error: 'Borrower not found' });
    }
    if (!lender) {
      return res.status(400).json({ error: 'Lender not found' });
    }

    // Check if borrower is verified
    if (borrower.verification_status !== 'verified') {
      return res.status(400).json({ error: 'Borrower must be verified to apply for loans' });
    }

    // Generate loan reference
    const loanReference = `AFCF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate total amount and monthly payment
    const monthlyRate = interestRate / 100 / 12;
    const totalAmount = principalAmount * Math.pow(1 + monthlyRate, tenorMonths);
    const monthlyPayment = principalAmount * (monthlyRate * Math.pow(1 + monthlyRate, tenorMonths)) / 
                          (Math.pow(1 + monthlyRate, tenorMonths) - 1);

    const [loanId] = await db('loans').insert({
      loan_reference: loanReference,
      borrower_id: borrowerId,
      lender_id: lenderId,
      coordinating_agency_id: coordinatingAgencyId,
      principal_amount: principalAmount,
      interest_rate: interestRate,
      interest_type: interestType,
      tenor_months: tenorMonths,
      monthly_payment: monthlyPayment,
      total_amount: totalAmount,
      loan_purpose: loanPurpose,
      purpose_description: purposeDescription,
      has_insurance: hasInsurance,
      insurance_premium: insurancePremium,
      insurance_provider_id: insuranceProviderId,
      has_derisking: hasDerisking,
      derisking_amount: deriskingAmount,
      derisking_provider_id: deriskingProviderId,
      collateral_description: collateralDescription,
      collateral_value: collateralValue,
      outstanding_balance: totalAmount,
      payments_due: tenorMonths,
      status: 'submitted'
    });

    logger.info(`Loan application created: ${loanReference}`);

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: { 
        id: loanId, 
        loanReference,
        status: 'submitted'
      }
    });

  } catch (error) {
    logger.error('Create loan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/loans/:id/approve
// @desc    Approve loan application
// @access  Private
router.put('/:id/approve', [
  authenticateToken,
  body('approvalNotes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { approvalNotes } = req.body;

    // Check if user has permission to approve loans
    if (!['admin', 'coordinating_agency', 'pfi'].includes(req.user.userType)) {
      return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
    }

    const loan = await db('loans').where({ id }).first();
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.status !== 'submitted' && loan.status !== 'under_review') {
      return res.status(400).json({ error: 'Loan cannot be approved in current status' });
    }

    const updated = await db('loans')
      .where({ id })
      .update({
        status: 'approved',
        approval_date: new Date(),
        approved_by: req.user.userId,
        approval_notes: approvalNotes
      })
      .returning('*');

    logger.info(`Loan approved: ${loan.loan_reference}`);

    res.json({
      success: true,
      message: 'Loan approved successfully',
      data: updated[0]
    });

  } catch (error) {
    logger.error('Approve loan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/loans/:id/reject
// @desc    Reject loan application
// @access  Private
router.put('/:id/reject', [
  authenticateToken,
  body('rejectionReason').trim().isLength({ min: 10 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rejectionReason } = req.body;

    // Check if user has permission to reject loans
    if (!['admin', 'coordinating_agency', 'pfi'].includes(req.user.userType)) {
      return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
    }

    const loan = await db('loans').where({ id }).first();
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.status !== 'submitted' && loan.status !== 'under_review') {
      return res.status(400).json({ error: 'Loan cannot be rejected in current status' });
    }

    const updated = await db('loans')
      .where({ id })
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason
      })
      .returning('*');

    logger.info(`Loan rejected: ${loan.loan_reference}`);

    res.json({
      success: true,
      message: 'Loan rejected successfully',
      data: updated[0]
    });

  } catch (error) {
    logger.error('Reject loan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/loans/:id/disburse
// @desc    Disburse approved loan
// @access  Private
router.put('/:id/disburse', authenticateToken, async (req, res) => {
  try {
    // Check if user has permission to disburse loans
    if (!['admin', 'coordinating_agency', 'pfi'].includes(req.user.userType)) {
      return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
    }

    const { id } = req.params;

    const loan = await db('loans').where({ id }).first();
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    if (loan.status !== 'approved') {
      return res.status(400).json({ error: 'Only approved loans can be disbursed' });
    }

    const updated = await db('loans')
      .where({ id })
      .update({
        status: 'disbursed',
        disbursement_date: new Date()
      })
      .returning('*');

    logger.info(`Loan disbursed: ${loan.loan_reference}`);

    res.json({
      success: true,
      message: 'Loan disbursed successfully',
      data: updated[0]
    });

  } catch (error) {
    logger.error('Disburse loan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/loans/stats/overview
// @desc    Get loan statistics overview
// @access  Private
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin or coordinating agency
    if (!['admin', 'coordinating_agency'].includes(req.user.userType)) {
      return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
    }

    const [
      totalLoans,
      totalAmount,
      approvedLoans,
      disbursedLoans,
      activeLoans,
      completedLoans,
      defaultedLoans,
      statusStats,
      purposeStats
    ] = await Promise.all([
      db('loans').count('* as count').first(),
      db('loans').sum('principal_amount as total').first(),
      db('loans').where('status', 'approved').count('* as count').first(),
      db('loans').where('status', 'disbursed').count('* as count').first(),
      db('loans').where('status', 'active').count('* as count').first(),
      db('loans').where('status', 'completed').count('* as count').first(),
      db('loans').where('status', 'defaulted').count('* as count').first(),
      db('loans')
        .select('status')
        .count('* as count')
        .groupBy('status'),
      db('loans')
        .select('loan_purpose')
        .count('* as count')
        .groupBy('loan_purpose')
    ]);

    res.json({
      success: true,
      data: {
        total: totalLoans.count,
        totalAmount: totalAmount.total || 0,
        approved: approvedLoans.count,
        disbursed: disbursedLoans.count,
        active: activeLoans.count,
        completed: completedLoans.count,
        defaulted: defaultedLoans.count,
        byStatus: statusStats,
        byPurpose: purposeStats
      }
    });

  } catch (error) {
    logger.error('Get loan stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/loans/:id/status
// @desc    Update loan status
// @access  Private
router.put('/:id/status', [
  authenticateToken,
  body('status').isIn([
    'draft', 'submitted', 'under_review', 'approved', 'disbursed',
    'active', 'completed', 'defaulted', 'cancelled'
  ])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Check if user has permission to update loan status
    if (!['admin', 'coordinating_agency', 'pfi'].includes(req.user.userType)) {
      return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
    }

    const loan = await db('loans').where({ id }).first();
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    const updated = await db('loans')
      .where({ id })
      .update({ status })
      .returning('*');

    logger.info(`Loan status updated: ${loan.loan_reference} - ${status}`);

    res.json({
      success: true,
      message: 'Loan status updated successfully',
      data: updated[0]
    });

  } catch (error) {
    logger.error('Update loan status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
