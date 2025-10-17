const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authenticateToken } = require('./auth');
const { logger } = require('../utils/logger');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user notifications
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      isRead, 
      type,
      priority,
      dateFrom,
      dateTo
    } = req.query;
    const offset = (page - 1) * limit;

    let query = db('notifications')
      .select('*')
      .where({ user_id: req.user.userId })
      .orderBy('created_at', 'desc');

    // Apply filters
    if (isRead !== undefined) {
      query = query.where('is_read', isRead === 'true');
    }
    if (type) {
      query = query.where('type', type);
    }
    if (priority) {
      query = query.where('priority', priority);
    }
    if (dateFrom) {
      query = query.where('created_at', '>=', dateFrom);
    }
    if (dateTo) {
      query = query.where('created_at', '<=', dateTo);
    }

    // Get total count
    const totalQuery = query.clone();
    const [{ count }] = await totalQuery.count('* as count');

    // Apply pagination
    const notifications = await query.limit(limit).offset(offset);

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    logger.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notifications count
// @access  Private
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const [{ count }] = await db('notifications')
      .where({ user_id: req.user.userId, is_read: false })
      .count('* as count');

    res.json({
      success: true,
      data: { unreadCount: count }
    });

  } catch (error) {
    logger.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/notifications/:id
// @desc    Get notification by ID
// @access  Private
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await db('notifications')
      .where({ id, user_id: req.user.userId })
      .first();

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      success: true,
      data: notification
    });

  } catch (error) {
    logger.error('Get notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await db('notifications')
      .where({ id, user_id: req.user.userId })
      .update({ 
        is_read: true,
        read_at: new Date()
      })
      .returning('*');

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: updated[0]
    });

  } catch (error) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Mark all notifications as read
// @access  Private
router.put('/mark-all-read', authenticateToken, async (req, res) => {
  try {
    const updated = await db('notifications')
      .where({ user_id: req.user.userId, is_read: false })
      .update({ 
        is_read: true,
        read_at: new Date()
      });

    res.json({
      success: true,
      message: `${updated} notifications marked as read`,
      data: { updatedCount: updated }
    });

  } catch (error) {
    logger.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db('notifications')
      .where({ id, user_id: req.user.userId })
      .del();

    if (deleted === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    logger.error('Delete notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/notifications/delete-all-read
// @desc    Delete all read notifications
// @access  Private
router.delete('/delete-all-read', authenticateToken, async (req, res) => {
  try {
    const deleted = await db('notifications')
      .where({ user_id: req.user.userId, is_read: true })
      .del();

    res.json({
      success: true,
      message: `${deleted} read notifications deleted`,
      data: { deletedCount: deleted }
    });

  } catch (error) {
    logger.error('Delete all read notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/notifications/send
// @desc    Send notification to user (admin/system only)
// @access  Private
router.post('/send', [
  authenticateToken,
  body('userId').isInt(),
  body('title').trim().isLength({ min: 1 }),
  body('message').trim().isLength({ min: 1 }),
  body('type').isIn(['info', 'warning', 'error', 'success']),
  body('priority').isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    // Check if user has permission to send notifications
    if (!['admin', 'coordinating_agency', 'system'].includes(req.user.userType)) {
      return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, title, message, type, priority, actionUrl, metadata } = req.body;

    // Check if target user exists
    const targetUser = await db('users').where({ id: userId }).first();
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    const [notificationId] = await db('notifications').insert({
      user_id: userId,
      title,
      message,
      type,
      priority,
      action_url: actionUrl || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      is_read: false,
      created_by: req.user.userId
    });

    logger.info(`Notification sent to user ${userId}: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      data: { id: notificationId }
    });

  } catch (error) {
    logger.error('Send notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/notifications/broadcast
// @desc    Broadcast notification to multiple users (admin/system only)
// @access  Private
router.post('/broadcast', [
  authenticateToken,
  body('userIds').isArray({ min: 1 }),
  body('title').trim().isLength({ min: 1 }),
  body('message').trim().isLength({ min: 1 }),
  body('type').isIn(['info', 'warning', 'error', 'success']),
  body('priority').isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res) => {
  try {
    // Check if user has permission to broadcast notifications
    if (!['admin', 'coordinating_agency', 'system'].includes(req.user.userType)) {
      return res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userIds, title, message, type, priority, actionUrl, metadata } = req.body;

    // Validate that all target users exist
    const existingUsers = await db('users')
      .whereIn('id', userIds)
      .select('id');

    const existingUserIds = existingUsers.map(user => user.id);
    const invalidUserIds = userIds.filter(id => !existingUserIds.includes(id));

    if (invalidUserIds.length > 0) {
      return res.status(400).json({ 
        error: 'Some target users not found',
        invalidUserIds 
      });
    }

    // Create notifications for all users
    const notifications = userIds.map(userId => ({
      user_id: userId,
      title,
      message,
      type,
      priority,
      action_url: actionUrl || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
      is_read: false,
      created_by: req.user.userId
    }));

    await db('notifications').insert(notifications);

    logger.info(`Notification broadcasted to ${userIds.length} users: ${title}`);

    res.status(201).json({
      success: true,
      message: `Notification broadcasted to ${userIds.length} users`,
      data: { sentCount: userIds.length }
    });

  } catch (error) {
    logger.error('Broadcast notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/notifications/types/list
// @desc    Get list of notification types
// @access  Private
router.get('/types/list', authenticateToken, async (req, res) => {
  try {
    const notificationTypes = [
      { value: 'info', label: 'Information', color: 'blue' },
      { value: 'warning', label: 'Warning', color: 'yellow' },
      { value: 'error', label: 'Error', color: 'red' },
      { value: 'success', label: 'Success', color: 'green' }
    ];

    const priorities = [
      { value: 'low', label: 'Low', color: 'gray' },
      { value: 'medium', label: 'Medium', color: 'blue' },
      { value: 'high', label: 'High', color: 'orange' },
      { value: 'urgent', label: 'Urgent', color: 'red' }
    ];

    res.json({
      success: true,
      data: {
        types: notificationTypes,
        priorities
      }
    });

  } catch (error) {
    logger.error('Get notification types error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
