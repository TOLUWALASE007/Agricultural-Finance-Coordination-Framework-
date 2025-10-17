const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('./auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// @route   GET /api/stakeholders
// @desc    Get all stakeholders
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      stakeholderType, 
      verificationStatus, 
      portalAccess,
      search 
    } = req.query;
    const offset = (page - 1) * limit;

    let query = db('stakeholders as s')
      .select(
        's.*',
        'u.email',
        'u.first_name',
        'u.last_name',
        'u.phone',
        'u.created_at as user_created_at'
      )
      .join('users as u', 's.user_id', 'u.id')
      .orderBy('s.created_at', 'desc');

    // Apply filters
    if (stakeholderType) {
      query = query.where('s.stakeholder_type', stakeholderType);
    }
    if (verificationStatus) {
      query = query.where('s.verification_status', verificationStatus);
    }
    if (portalAccess) {
      query = query.where('s.portal_access', portalAccess);
    }
    if (search) {
      query = query.where(function() {
        this.where('s.organization_name', 'like', `%${search}%`)
            .orWhere('u.email', 'like', `%${search}%`)
            .orWhere('u.first_name', 'like', `%${search}%`)
            .orWhere('u.last_name', 'like', `%${search}%`);
      });
    }

    // Get total count
    const totalQuery = query.clone();
    const [{ count }] = await totalQuery.count('* as count');

    // Apply pagination
    const stakeholders = await query.limit(limit).offset(offset);

    res.json({
      success: true,
      data: stakeholders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    logger.error('Get stakeholders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/stakeholders/:id
// @desc    Get stakeholder by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const stakeholder = await db('stakeholders as s')
      .select(
        's.*',
        'u.email',
        'u.first_name',
        'u.last_name',
        'u.phone',
        'u.user_type',
        'u.created_at as user_created_at'
      )
      .join('users as u', 's.user_id', 'u.id')
      .where('s.id', id)
      .first();

    if (!stakeholder) {
      return res.status(404).json({ error: 'Stakeholder not found' });
    }

    // Check access permissions
    if (req.user.userId !== stakeholder.user_id && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      data: stakeholder
    });

  } catch (error) {
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
    'anchor', 'lead_firm', 'farmer', 'cooperative_group', 'derisking_institution',
    'extension_organization', 'researcher_student'
  ]),
  body('organizationName').optional().trim().isLength({ min: 2 }),
  body('registrationNumber').optional().trim(),
  body('contactPersonName').optional().trim().isLength({ min: 2 }),
  body('contactPersonEmail').optional().isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
    const existingStakeholder = await db('stakeholders')
      .where({ user_id: req.user.userId })
      .first();

    if (existingStakeholder) {
      return res.status(400).json({ error: 'Stakeholder profile already exists for this user' });
    }

    const [stakeholderId] = await db('stakeholders').insert({
      user_id: req.user.userId,
      stakeholder_type: stakeholderType,
      organization_name: organizationName,
      registration_number: registrationNumber,
      tax_id: taxId,
      legal_status: legalStatus,
      business_field: businessField,
      registered_address: registeredAddress,
      city,
      state,
      postal_code: postalCode,
      website,
      staff_strength: staffStrength,
      contact_person_name: contactPersonName,
      contact_person_title: contactPersonTitle,
      contact_person_email: contactPersonEmail,
      contact_person_designation: contactPersonDesignation,
      contact_person_phone: contactPersonPhone,
      portal_access: portalAccess,
      permissions: permissions ? JSON.stringify(permissions) : null
    });

    logger.info(`Stakeholder profile created: ${stakeholderId}`);

    res.status(201).json({
      success: true,
      message: 'Stakeholder profile created successfully',
      data: { id: stakeholderId }
    });

  } catch (error) {
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
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    // Check if stakeholder exists and user has access
    const stakeholder = await db('stakeholders')
      .where({ id })
      .first();

    if (!stakeholder) {
      return res.status(404).json({ error: 'Stakeholder not found' });
    }

    // Check access permissions
    if (req.user.userId !== stakeholder.user_id && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
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

    const updateData = {};
    if (organizationName !== undefined) updateData.organization_name = organizationName;
    if (registrationNumber !== undefined) updateData.registration_number = registrationNumber;
    if (taxId !== undefined) updateData.tax_id = taxId;
    if (legalStatus !== undefined) updateData.legal_status = legalStatus;
    if (businessField !== undefined) updateData.business_field = businessField;
    if (registeredAddress !== undefined) updateData.registered_address = registeredAddress;
    if (city !== undefined) updateData.city = city;
    if (state !== undefined) updateData.state = state;
    if (postalCode !== undefined) updateData.postal_code = postalCode;
    if (website !== undefined) updateData.website = website;
    if (staffStrength !== undefined) updateData.staff_strength = staffStrength;
    if (contactPersonName !== undefined) updateData.contact_person_name = contactPersonName;
    if (contactPersonTitle !== undefined) updateData.contact_person_title = contactPersonTitle;
    if (contactPersonEmail !== undefined) updateData.contact_person_email = contactPersonEmail;
    if (contactPersonDesignation !== undefined) updateData.contact_person_designation = contactPersonDesignation;
    if (contactPersonPhone !== undefined) updateData.contact_person_phone = contactPersonPhone;
    if (portalAccess !== undefined) updateData.portal_access = portalAccess;
    if (permissions !== undefined) updateData.permissions = JSON.stringify(permissions);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updated = await db('stakeholders')
      .where({ id })
      .update(updateData)
      .returning('*');

    logger.info(`Stakeholder updated: ${id}`);

    res.json({
      success: true,
      message: 'Stakeholder updated successfully',
      data: updated[0]
    });

  } catch (error) {
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
], async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { verificationStatus, verificationNotes } = req.body;

    const updateData = {
      verification_status: verificationStatus,
      verification_notes: verificationNotes,
      verified_by: req.user.userId,
      verified_at: new Date()
    };

    const updated = await db('stakeholders')
      .where({ id })
      .update(updateData)
      .returning('*');

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Stakeholder not found' });
    }

    logger.info(`Stakeholder verification updated: ${id} - ${verificationStatus}`);

    res.json({
      success: true,
      message: 'Stakeholder verification updated successfully',
      data: updated[0]
    });

  } catch (error) {
    logger.error('Verify stakeholder error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/stakeholders/stats/overview
// @desc    Get stakeholder statistics overview
// @access  Private
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const [
      totalStakeholders,
      verifiedStakeholders,
      pendingStakeholders,
      rejectedStakeholders,
      stakeholderTypeStats,
      portalAccessStats
    ] = await Promise.all([
      db('stakeholders').count('* as count').first(),
      db('stakeholders').where('verification_status', 'verified').count('* as count').first(),
      db('stakeholders').where('verification_status', 'pending').count('* as count').first(),
      db('stakeholders').where('verification_status', 'rejected').count('* as count').first(),
      db('stakeholders')
        .select('stakeholder_type')
        .count('* as count')
        .groupBy('stakeholder_type'),
      db('stakeholders')
        .select('portal_access')
        .count('* as count')
        .groupBy('portal_access')
        .whereNotNull('portal_access')
    ]);

    res.json({
      success: true,
      data: {
        total: totalStakeholders.count,
        verified: verifiedStakeholders.count,
        pending: pendingStakeholders.count,
        rejected: rejectedStakeholders.count,
        byType: stakeholderTypeStats,
        byPortal: portalAccessStats
      }
    });

  } catch (error) {
    logger.error('Get stakeholder stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/stakeholders/:id
// @desc    Delete stakeholder profile
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if stakeholder exists and user has access
    const stakeholder = await db('stakeholders')
      .where({ id })
      .first();

    if (!stakeholder) {
      return res.status(404).json({ error: 'Stakeholder not found' });
    }

    // Only admin or the stakeholder owner can delete
    if (req.user.userId !== stakeholder.user_id && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db('stakeholders')
      .where({ id })
      .del();

    logger.info(`Stakeholder deleted: ${id}`);

    res.json({
      success: true,
      message: 'Stakeholder profile deleted successfully'
    });

  } catch (error) {
    logger.error('Delete stakeholder error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
