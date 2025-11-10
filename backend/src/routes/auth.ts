import express, { Request, Response, NextFunction, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import Stakeholder from '../models/Stakeholder';
import { logger } from '../utils/logger';

const router: Router = express.Router();

const ROLE_VALUES = [
  'fund-provider',
  'coordinating-agency',
  'pfi',
  'insurance',
  'anchor',
  'lead-firm',
  'producer',
  'cooperative',
  'extension',
  'researcher',
  'admin'
];

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    userType: string;
  };
}

// Middleware to verify JWT token
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) {
      logger.error('Token verification failed:', err);
      res.status(403).json({ error: 'Invalid or expired token' });
      return;
    }
    req.user = user as { userId: string; email: string; userType: string };
    next();
  });
};

const requiredContactFields = [
  'contactInfo.personalDetails.fullName',
  'contactInfo.personalDetails.position',
  'contactInfo.personalDetails.gender',
  'contactInfo.personalDetails.birthDate',
  'contactInfo.contactInformation.email',
  'contactInfo.contactInformation.phone',
  'contactInfo.contactInformation.address',
  'contactInfo.contactInformation.city',
  'contactInfo.contactInformation.state',
  'contactInfo.contactInformation.country',
  'contactInfo.verificationEmergency.emergencyContactName',
  'contactInfo.verificationEmergency.emergencyContactPhone'
];

const requiredOrganizationFields = [
  'organizationInfo.basicInformation.organizationName',
  'organizationInfo.basicInformation.organizationType',
  'organizationInfo.basicInformation.yearEstablished',
  'organizationInfo.addressContactInfo.headquartersAddress',
  'organizationInfo.addressContactInfo.hqCity',
  'organizationInfo.addressContactInfo.hqState',
  'organizationInfo.addressContactInfo.hqCountry'
];

const buildNameParts = (fullName: string) => {
  if (!fullName) {
    return { firstName: 'Portal', lastName: 'User' };
  }
  const parts = fullName.trim().split(' ');
  const firstName = parts.shift() || fullName;
  const lastName = parts.length > 0 ? parts.join(' ') : firstName;
  return { firstName, lastName };
};

const sanitizeString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
};

const sanitizeContactInfo = (payload: any) => ({
  personalDetails: {
    fullName: sanitizeString(payload?.personalDetails?.fullName),
    position: sanitizeString(payload?.personalDetails?.position),
    gender: sanitizeString(payload?.personalDetails?.gender),
    birthDate: sanitizeString(payload?.personalDetails?.birthDate)
  },
  contactInformation: {
    email: sanitizeString(payload?.contactInformation?.email),
    phone: sanitizeString(payload?.contactInformation?.phone),
    whatsapp: sanitizeString(payload?.contactInformation?.whatsapp),
    address: sanitizeString(payload?.contactInformation?.address),
    city: sanitizeString(payload?.contactInformation?.city),
    state: sanitizeString(payload?.contactInformation?.state),
    country: sanitizeString(payload?.contactInformation?.country)
  },
  verificationEmergency: {
    idType: sanitizeString(payload?.verificationEmergency?.idType),
    idNumber: sanitizeString(payload?.verificationEmergency?.idNumber),
    idDocument: sanitizeString(payload?.verificationEmergency?.idDocument),
    emergencyContactName: sanitizeString(payload?.verificationEmergency?.emergencyContactName),
    emergencyContactPhone: sanitizeString(payload?.verificationEmergency?.emergencyContactPhone),
    emergencyRelationship: sanitizeString(payload?.verificationEmergency?.emergencyRelationship)
  }
});

const sanitizeOrganizationInfo = (payload: any) => ({
  basicInformation: {
    organizationName: sanitizeString(payload?.basicInformation?.organizationName),
    registrationNumber: sanitizeString(payload?.basicInformation?.registrationNumber),
    organizationType: sanitizeString(payload?.basicInformation?.organizationType),
    yearEstablished: sanitizeString(payload?.basicInformation?.yearEstablished),
    industry: sanitizeString(payload?.basicInformation?.industry),
    missionStatement: sanitizeString(payload?.basicInformation?.missionStatement)
  },
  addressContactInfo: {
    headquartersAddress: sanitizeString(payload?.addressContactInfo?.headquartersAddress),
    hqCity: sanitizeString(payload?.addressContactInfo?.hqCity),
    hqState: sanitizeString(payload?.addressContactInfo?.hqState),
    hqCountry: sanitizeString(payload?.addressContactInfo?.hqCountry),
    officePhone: sanitizeString(payload?.addressContactInfo?.officePhone),
    officialEmail: sanitizeString(payload?.addressContactInfo?.officialEmail),
    website: sanitizeString(payload?.addressContactInfo?.website),
    facebook: sanitizeString(payload?.addressContactInfo?.facebook),
    linkedin: sanitizeString(payload?.addressContactInfo?.linkedin),
    twitter: sanitizeString(payload?.addressContactInfo?.twitter),
    instagram: sanitizeString(payload?.addressContactInfo?.instagram)
  },
  operationsDocumentation: {
    numEmployees: sanitizeString(payload?.operationsDocumentation?.numEmployees),
    areasOfOperation: sanitizeString(payload?.operationsDocumentation?.areasOfOperation),
    organizationLogo: sanitizeString(payload?.operationsDocumentation?.organizationLogo),
    certificateOfIncorporation: sanitizeString(payload?.operationsDocumentation?.certificateOfIncorporation),
    hasPartnership: sanitizeString(payload?.operationsDocumentation?.hasPartnership),
    partnershipDetails: sanitizeString(payload?.operationsDocumentation?.partnershipDetails)
  }
});

// @route   POST /api/auth/register
// @desc    Register a new portal user
// @access  Public
router.post('/register', [
  body('role').isIn(ROLE_VALUES),
  body('password').isLength({ min: 6 }),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  body('contactInfo.contactInformation.email').isEmail().normalizeEmail(),
  ...requiredContactFields.map(field => body(field).optional().isString({ min: 1 })),
  ...requiredOrganizationFields.map(field => body(field).optional().isString({ min: 1 }))
], async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { role, password } = req.body;
    const contactInfo = sanitizeContactInfo(req.body.contactInfo || {});
    const organizationInfo = sanitizeOrganizationInfo(req.body.organizationInfo || {});

    const email = contactInfo.contactInformation.email;

    // Validate required top-level fields after sanitization
    if (!email) {
      res.status(400).json({ error: 'Contact email is required' });
      return;
    }

    if (!organizationInfo.basicInformation.organizationName) {
      res.status(400).json({ error: 'Organization name is required' });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists with this email' });
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const { firstName, lastName } = buildNameParts(contactInfo.personalDetails.fullName || 'Portal User');

    const userDoc = await User.create({
      email,
      passwordHash,
      firstName,
      lastName,
      phone: contactInfo.contactInformation.phone || undefined,
      userType: role,
      organizationName: organizationInfo.basicInformation.organizationName || undefined,
      contactInfo,
      organizationInfo
    });

    try {
      await Stakeholder.create({
        userId: userDoc._id,
        stakeholderType: role,
        organizationName: organizationInfo.basicInformation.organizationName || undefined,
        registrationNumber: organizationInfo.basicInformation.registrationNumber || undefined,
        contactPersonName: contactInfo.personalDetails.fullName || undefined,
        contactPersonEmail: email,
        contactPersonPhone: contactInfo.contactInformation.phone || undefined,
        verificationStatus: 'pending'
      });
    } catch (stakeholderErr) {
      logger.error('Failed to create stakeholder profile:', stakeholderErr);
    }

    logger.info(`New portal user registered: ${email} (${role})`);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please log in to continue.'
    });

  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    if (user.isActive === false) {
      res.status(400).json({ error: 'Account is deactivated' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const lastLoginAt = new Date();
    const normalizedUserType = (user.userType || '').replace(/_/g, '-');

    const updatePayload: Record<string, unknown> = { lastLoginAt };
    if (normalizedUserType && normalizedUserType !== user.userType) {
      updatePayload.userType = normalizedUserType;
      user.userType = normalizedUserType;
    }

    try {
      await User.updateOne({ _id: user._id }, updatePayload, { runValidators: false }).exec();
      user.lastLoginAt = lastLoginAt;
    } catch (updateError) {
      logger.error('Failed to update last login timestamp:', updateError);
    }

    const fallbackContactInfo = {
      personalDetails: {
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        position: '',
        gender: '',
        birthDate: ''
      },
      contactInformation: {
        email: user.email,
        phone: user.phone || '',
        whatsapp: '',
        address: '',
        city: '',
        state: '',
        country: ''
      },
      verificationEmergency: {
        idType: '',
        idNumber: '',
        idDocument: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyRelationship: ''
      }
    };

    const fallbackOrganizationInfo = {
      basicInformation: {
        organizationName: user.organizationName || '',
        registrationNumber: '',
        organizationType: '',
        yearEstablished: '',
        industry: '',
        missionStatement: ''
      },
      addressContactInfo: {
        headquartersAddress: '',
        hqCity: '',
        hqState: '',
        hqCountry: '',
        officePhone: '',
        officialEmail: '',
        website: '',
        facebook: '',
        linkedin: '',
        twitter: '',
        instagram: ''
      },
      operationsDocumentation: {
        numEmployees: '',
        areasOfOperation: '',
        organizationLogo: '',
        certificateOfIncorporation: '',
        hasPartnership: '',
        partnershipDetails: ''
      }
    };

    const contactInfo = (user as any).contactInfo || fallbackContactInfo;
    const organizationInfo = (user as any).organizationInfo || fallbackOrganizationInfo;

    const jwtSecret = (process.env.JWT_SECRET || 'secret') as Secret;
    const payload = { userId: String(user._id), email: user.email, userType: user.userType };
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const token = jwt.sign(payload, jwtSecret, { expiresIn } as SignOptions);

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: String(user._id),
        email: user.email,
        role: user.userType,
        isVerified: user.isVerified,
        lastLogin: user.lastLoginAt,
        contactInfo,
        organizationInfo
      }
    });

  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile summary
// @access  Private
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId)
      .select('email userType isVerified createdAt contactInfo organizationInfo lastLoginAt')
      .lean();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        id: req.user!.userId,
        email: user.email,
        role: user.userType,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLoginAt,
        contactInfo: user.contactInfo,
        organizationInfo: user.organizationInfo
      }
    });

  } catch (error: any) {
    logger.error('Get current user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/auth/profile
// @desc    Get detailed profile for the logged in user
// @access  Private
router.get('/profile', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.userId)
      .select('email userType contactInfo organizationInfo')
      .lean();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      success: true,
      data: {
        email: user.email,
        role: user.userType,
        contactInfo: user.contactInfo,
        organizationInfo: user.organizationInfo
      }
    });
  } catch (error: any) {
    logger.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update profile for the logged in user
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('contactInfo').notEmpty(),
  body('organizationInfo').notEmpty(),
  body('password').optional().isLength({ min: 6 }),
  body('confirmPassword').optional().custom((value, { req }) => {
    if (value && value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const user = await User.findById(req.user!.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const contactInfo = sanitizeContactInfo(req.body.contactInfo || {});
    const organizationInfo = sanitizeOrganizationInfo(req.body.organizationInfo || {});

    user.contactInfo = contactInfo;
    user.organizationInfo = organizationInfo;
    user.organizationName = organizationInfo.basicInformation.organizationName || user.organizationName;
    user.phone = contactInfo.contactInformation.phone || user.phone;

    const { firstName, lastName } = buildNameParts(contactInfo.personalDetails.fullName || `${user.firstName} ${user.lastName}`);
    user.firstName = firstName;
    user.lastName = lastName;

    if (req.body.password) {
      const saltRounds = 12;
      user.passwordHash = await bcrypt.hash(req.body.password, saltRounds);
    }

    await user.save();

    logger.info(`Profile updated for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        email: user.email,
        role: user.userType,
        contactInfo: user.contactInfo,
        organizationInfo: user.organizationInfo
      }
    });

  } catch (error: any) {
    logger.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error while updating profile' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists or not
      res.json({ 
        success: true, 
        message: 'If email exists, reset instructions have been sent' 
      });
      return;
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: String(user._id) },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    );

    // Save reset token to database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // TODO: Send email with reset link
    logger.info(`Password reset requested for: ${email}`);

    res.json({
      success: true,
      message: 'If email exists, reset instructions have been sent'
    });

  } catch (error: any) {
    logger.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').exists(),
  body('password').isLength({ min: 6 })
], async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { token, password } = req.body;

    // Verify token
    const jwtSecret = (process.env.JWT_SECRET || 'secret') as Secret;
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    
    // Check if token exists in database and is not expired
    const user = await User.findOne({
      _id: decoded.userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update password and clear reset token
    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logger.info(`Password reset completed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error: any) {
    logger.error('Reset password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
