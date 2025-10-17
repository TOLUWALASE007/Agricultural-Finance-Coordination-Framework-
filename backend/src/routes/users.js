const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('./auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { page = 1, limit = 10, userType, isActive, isVerified } = req.query;
    const offset = (page - 1) * limit;

    let query = db('users')
      .select('id', 'email', 'first_name', 'last_name', 'user_type', 'is_active', 'is_verified', 'created_at', 'last_login_at')
      .orderBy('created_at', 'desc');

    // Apply filters
    if (userType) {
      query = query.where('user_type', userType);
    }
    if (isActive !== undefined) {
      query = query.where('is_active', isActive === 'true');
    }
    if (isVerified !== undefined) {
      query = query.where('is_verified', isVerified === 'true');
    }

    // Get total count
    const totalQuery = query.clone();
    const [{ count }] = await totalQuery.count('* as count');

    // Apply pagination
    const users = await query.limit(limit).offset(offset);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin
    if (req.user.userId !== parseInt(id) && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await db('users')
      .select('id', 'email', 'first_name', 'last_name', 'user_type', 'phone', 'organization_name', 'is_active', 'is_verified', 'created_at', 'last_login_at')
      .where({ id })
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    logger.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private
router.put('/:id', [
  authenticateToken,
  body('firstName').optional().trim().isLength({ min: 2 }),
  body('lastName').optional().trim().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone(),
  body('organizationName').optional().trim().isLength({ min: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { firstName, lastName, phone, organizationName } = req.body;

    // Users can only update their own profile unless they're admin
    if (req.user.userId !== parseInt(id) && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {};
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (phone) updateData.phone = phone;
    if (organizationName) updateData.organization_name = organizationName;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const updated = await db('users')
      .where({ id })
      .update(updateData)
      .returning(['id', 'email', 'first_name', 'last_name', 'user_type', 'phone', 'organization_name']);

    if (updated.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info(`User updated: ${id}`);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updated[0]
    });

  } catch (error) {
    logger.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id/verify
// @desc    Verify user account (admin only)
// @access  Private
router.put('/:id/verify', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { id } = req.params;

    const updated = await db('users')
      .where({ id })
      .update({ 
        is_verified: true,
        email_verified_at: new Date()
      })
      .returning(['id', 'email', 'is_verified', 'email_verified_at']);

    if (updated.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info(`User verified: ${id}`);

    res.json({
      success: true,
      message: 'User verified successfully',
      data: updated[0]
    });

  } catch (error) {
    logger.error('Verify user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id/deactivate
// @desc    Deactivate user account (admin only)
// @access  Private
router.put('/:id/deactivate', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { id } = req.params;

    // Prevent admin from deactivating themselves
    if (req.user.userId === parseInt(id)) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }

    const updated = await db('users')
      .where({ id })
      .update({ is_active: false })
      .returning(['id', 'email', 'is_active']);

    if (updated.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info(`User deactivated: ${id}`);

    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: updated[0]
    });

  } catch (error) {
    logger.error('Deactivate user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id/activate
// @desc    Activate user account (admin only)
// @access  Private
router.put('/:id/activate', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    const { id } = req.params;

    const updated = await db('users')
      .where({ id })
      .update({ is_active: true })
      .returning(['id', 'email', 'is_active']);

    if (updated.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info(`User activated: ${id}`);

    res.json({
      success: true,
      message: 'User activated successfully',
      data: updated[0]
    });

  } catch (error) {
    logger.error('Activate user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id/activity
// @desc    Get user activity log
// @access  Private
router.get('/:id/activity', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own activity unless they're admin
    if (req.user.userId !== parseInt(id) && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // TODO: Implement activity logging system
    // For now, return mock data
    const activities = [
      {
        id: 1,
        action: 'login',
        description: 'User logged in successfully',
        timestamp: new Date(),
        ip_address: '192.168.1.1'
      },
      {
        id: 2,
        action: 'profile_update',
        description: 'Profile information updated',
        timestamp: new Date(Date.now() - 3600000),
        ip_address: '192.168.1.1'
      }
    ];

    res.json({
      success: true,
      data: activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: activities.length,
        pages: Math.ceil(activities.length / limit)
      }
    });

  } catch (error) {
    logger.error('Get user activity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
