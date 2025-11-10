import express, { Response, Router } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { authenticateToken, AuthRequest } from './auth';
import { logger } from '../utils/logger';

const router: Router = express.Router();

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private
router.get('/', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      return;
    }

    const { page = 1, limit = 10, userType, isActive, isVerified } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const filter: any = {};
    if (userType) filter.userType = userType;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isVerified !== undefined) filter.isVerified = isVerified === 'true';

    const count = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('email firstName lastName userType isActive isVerified createdAt lastLoginAt')
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    res.json({
      success: true,
      data: users.map(u => ({ id: String(u._id), ...u })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count,
        pages: Math.ceil(count / limitNum)
      }
    });

  } catch (error: any) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin
    if (req.user!.userId !== id && req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const user = await User.findById(id)
      .select('email firstName lastName userType phone organizationName isActive isVerified createdAt lastLoginAt')
      .lean();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: { id: String(user._id), ...user }
    });

  } catch (error: any) {
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
  body('phone').optional().isMobilePhone('any'),
  body('organizationName').optional().trim().isLength({ min: 2 })
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { id } = req.params;
    const { firstName, lastName, phone, organizationName } = req.body;

    // Users can only update their own profile unless they're admin
    if (req.user!.userId !== id && req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (organizationName) user.organizationName = organizationName;

    await user.save();
    logger.info(`User updated: ${id}`);

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: user.userType,
        phone: user.phone,
        organizationName: user.organizationName
      }
    });

  } catch (error: any) {
    logger.error('Update user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id/verify
// @desc    Verify user account (admin only)
// @access  Private
router.put('/:id/verify', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      return;
    }

    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.isVerified = true;
    user.emailVerifiedAt = new Date();
    await user.save();

    logger.info(`User verified: ${id}`);

    res.json({
      success: true,
      message: 'User verified successfully',
      data: {
        id,
        email: user.email,
        isVerified: user.isVerified,
        emailVerifiedAt: user.emailVerifiedAt
      }
    });

  } catch (error: any) {
    logger.error('Verify user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id/deactivate
// @desc    Deactivate user account (admin only)
// @access  Private
router.put('/:id/deactivate', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      return;
    }

    const { id } = req.params;

    // Prevent admin from deactivating themselves
    if (req.user!.userId === id) {
      res.status(400).json({ error: 'Cannot deactivate your own account' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.isActive = false;
    await user.save();

    logger.info(`User deactivated: ${id}`);

    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: {
        id,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (error: any) {
    logger.error('Deactivate user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/users/:id/activate
// @desc    Activate user account (admin only)
// @access  Private
router.put('/:id/activate', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is admin
    if (req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      return;
    }

    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    user.isActive = true;
    await user.save();

    logger.info(`User activated: ${id}`);

    res.json({
      success: true,
      message: 'User activated successfully',
      data: {
        id,
        email: user.email,
        isActive: user.isActive
      }
    });

  } catch (error: any) {
    logger.error('Activate user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/users/:id/activity
// @desc    Get user activity log
// @access  Private
router.get('/:id/activity', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Users can only view their own activity unless they're admin
    if (req.user!.userId !== id && req.user!.userType !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const { page = 1, limit = 10 } = req.query;

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
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: activities.length,
        pages: Math.ceil(activities.length / parseInt(limit as string))
      }
    });

  } catch (error: any) {
    logger.error('Get user activity error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
