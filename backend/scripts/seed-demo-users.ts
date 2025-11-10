import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User, { IUser } from '../src/models/User';
import Stakeholder from '../src/models/Stakeholder';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/afcf_database';

const demoUsers: Array<{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: IUser['userType'];
  organizationName?: string;
}> = [
  {
    email: 'ca@email.com',
    password: '123456',
    firstName: 'Coordinating',
    lastName: 'Agency',
    userType: 'coordinating-agency',
    organizationName: 'AFCF Coordinating Agency'
  },
  {
    email: 'fp@email.com',
    password: '123456',
    firstName: 'Fund',
    lastName: 'Provider',
    userType: 'fund-provider',
    organizationName: 'AFCF Fund Provider'
  },
  {
    email: 'pfi@email.com',
    password: '123456',
    firstName: 'PFI',
    lastName: 'Bank',
    userType: 'pfi',
    organizationName: 'AFCF Participating Bank'
  },
  {
    email: 'anchor@email.com',
    password: '123456',
    firstName: 'Anchor',
    lastName: 'Company',
    userType: 'anchor',
    organizationName: 'AFCF Anchor Company'
  },
  {
    email: 'leadfirm@email.com',
    password: '123456',
    firstName: 'Lead',
    lastName: 'Firm',
    userType: 'lead-firm',
    organizationName: 'AFCF Lead Firm'
  },
  {
    email: 'farmer@email.com',
    password: '123456',
    firstName: 'Producer',
    lastName: 'Farmer',
    userType: 'producer'
  },
  {
    email: 'insurance@email.com',
    password: '123456',
    firstName: 'Insurance',
    lastName: 'Company',
    userType: 'insurance',
    organizationName: 'AFCF Insurance Company'
  },
  {
    email: 'cooperative@email.com',
    password: '123456',
    firstName: 'Cooperative',
    lastName: 'Group',
    userType: 'cooperative',
    organizationName: 'AFCF Cooperative Group'
  },
  {
    email: 'extension@email.com',
    password: '123456',
    firstName: 'Extension',
    lastName: 'Org',
    userType: 'extension',
    organizationName: 'AFCF Extension Organization'
  },
  {
    email: 'researcher@email.com',
    password: '123456',
    firstName: 'Researcher',
    lastName: 'Student',
    userType: 'researcher'
  }
];

const defaultContactInfo = {
  personalDetails: {
    fullName: '',
    position: '',
    gender: '',
    birthDate: ''
  },
  contactInformation: {
    email: '',
    phone: '',
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

const defaultOrganizationInfo = {
  basicInformation: {
    organizationName: '',
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

async function upsertDemoUsers() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    for (const userConfig of demoUsers) {
      const { email, password, firstName, lastName, userType, organizationName } = userConfig;
      const passwordHash = await bcrypt.hash(password, 12);

      let user = await User.findOne({ email });

      if (user) {
        user.passwordHash = passwordHash;
        user.firstName = firstName;
        user.lastName = lastName;
        user.userType = userType;
        user.organizationName = organizationName;
        user.isActive = true;
        user.isVerified = true;
        if (!user.contactInfo) {
          user.contactInfo = {
            ...defaultContactInfo,
            contactInformation: {
              ...defaultContactInfo.contactInformation,
              email
            }
          } as any;
        } else if (!user.contactInfo.contactInformation?.email) {
          user.contactInfo.contactInformation.email = email;
        }
        if (!user.organizationInfo) {
          user.organizationInfo = defaultOrganizationInfo as any;
        }
        await user.save();
        console.log(`🔁 Updated user: ${email}`);
      } else {
        user = await User.create({
          email,
          passwordHash,
          firstName,
          lastName,
          userType,
          organizationName,
          contactInfo: {
            ...defaultContactInfo,
            contactInformation: {
              ...defaultContactInfo.contactInformation,
              email
            }
          },
          organizationInfo: defaultOrganizationInfo,
          isActive: true,
          isVerified: true
        });
        console.log(`✅ Created user: ${email}`);
      }

      await Stakeholder.findOneAndUpdate(
        { userId: user._id },
        {
          userId: user._id,
          stakeholderType: userType,
          organizationName: organizationName,
          verificationStatus: 'verified'
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log('🎉 Demo users seeded successfully');
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', (error as Error).message);
    process.exit(1);
  }
}

upsertDemoUsers();

