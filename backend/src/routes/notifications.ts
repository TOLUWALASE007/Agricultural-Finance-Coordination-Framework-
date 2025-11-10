import express, { Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import Notification from '../models/Notification';
import User from '../models/User';
import { authenticateToken, AuthRequest } from './auth';
import { logger } from '../utils/logger';

const router: Router = express.Router();

router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, isRead, type, priority, dateFrom, dateTo } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const filter: any = { userId: req.user!.userId };

    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom as string);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo as string);
    }

    const count = await Notification.countDocuments(filter);
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean();

    res.json({ success: true, data: notifications.map(n => ({ id: String(n._id), ...n })), pagination: { page: pageNum, limit: limitNum, total: count, pages: Math.ceil(count / limitNum) } });
  } catch (error: any) {
    logger.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/unread-count', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const count = await Notification.countDocuments({ userId: req.user!.userId, isRead: false });
    res.json({ success: true, data: { unreadCount: count } });
  } catch (error: any) {
    logger.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id, userId: req.user!.userId });

    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    res.json({ success: true, data: { id: String(notification._id), ...notification.toObject() } });
  } catch (error: any) {
    logger.error('Get notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/read', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id, userId: req.user!.userId });

    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ success: true, message: 'Notification marked as read', data: notification.toObject() });
  } catch (error: any) {
    logger.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/mark-all-read', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await Notification.updateMany({ userId: req.user!.userId, isRead: false }, { isRead: true, readAt: new Date() });
    res.json({ success: true, message: `${result.modifiedCount} notifications marked as read`, data: { updatedCount: result.modifiedCount } });
  } catch (error: any) {
    logger.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Notification.deleteOne({ _id: id, userId: req.user!.userId });

    if (deleted.deletedCount === 0) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error: any) {
    logger.error('Delete notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/delete-all-read', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const result = await Notification.deleteMany({ userId: req.user!.userId, isRead: true });
    res.json({ success: true, message: `${result.deletedCount} read notifications deleted`, data: { deletedCount: result.deletedCount } });
  } catch (error: any) {
    logger.error('Delete all read notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/send', [
  authenticateToken,
  body('userId').isMongoId(),
  body('title').trim().isLength({ min: 1 }),
  body('message').trim().isLength({ min: 1 }),
  body('type').isIn(['info', 'warning', 'error', 'success']),
  body('priority').isIn(['low', 'medium', 'high', 'urgent'])
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!['admin', 'coordinating_agency', 'system'].includes(req.user!.userType)) {
      res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { userId, title, message, type, priority, actionUrl, metadata } = req.body;

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      res.status(404).json({ error: 'Target user not found' });
      return;
    }

    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      priority,
      actionUrl,
      metadata,
      isRead: false,
      createdBy: req.user!.userId
    });

    logger.info(`Notification sent to user ${userId}: ${title}`);
    res.status(201).json({ success: true, message: 'Notification sent successfully', data: { id: String(notification._id) } });
  } catch (error: any) {
    logger.error('Send notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/broadcast', [
  authenticateToken,
  body('userIds').isArray({ min: 1 }),
  body('title').trim().isLength({ min: 1 }),
  body('message').trim().isLength({ min: 1 }),
  body('type').isIn(['info', 'warning', 'error', 'success']),
  body('priority').isIn(['low', 'medium', 'high', 'urgent'])
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!['admin', 'coordinating_agency', 'system'].includes(req.user!.userType)) {
      res.status(403).json({ error: 'Access denied. Insufficient privileges.' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { userIds, title, message, type, priority, actionUrl, metadata } = req.body;
    const existingUsers = await User.find({ _id: { $in: userIds } }).select('_id');
    const existingUserIds = existingUsers.map(u => String(u._id));
    const invalidUserIds = userIds.filter((id: string) => !existingUserIds.includes(id));

    if (invalidUserIds.length > 0) {
      res.status(400).json({ error: 'Some target users not found', invalidUserIds });
      return;
    }

    const notifications = userIds.map((userId: string) => ({
      userId,
      title,
      message,
      type,
      priority,
      actionUrl,
      metadata,
      isRead: false,
      createdBy: req.user!.userId
    }));

    await Notification.insertMany(notifications);
    logger.info(`Notification broadcasted to ${userIds.length} users: ${title}`);
    res.status(201).json({ success: true, message: `Notification broadcasted to ${userIds.length} users`, data: { sentCount: userIds.length } });
  } catch (error: any) {
    logger.error('Broadcast notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
