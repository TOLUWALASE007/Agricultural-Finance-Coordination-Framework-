import mongoose, { Document, Schema } from 'mongoose';

type NullableString = string | undefined;

type PersonalDetails = {
  fullName: NullableString;
  position: NullableString;
  gender: NullableString;
  birthDate: NullableString;
};

type ContactInformation = {
  email: NullableString;
  phone: NullableString;
  whatsapp: NullableString;
  address: NullableString;
  city: NullableString;
  state: NullableString;
  country: NullableString;
};

type VerificationEmergency = {
  idType: NullableString;
  idNumber: NullableString;
  idDocument: NullableString;
  emergencyContactName: NullableString;
  emergencyContactPhone: NullableString;
  emergencyRelationship: NullableString;
};

type ContactInfo = {
  personalDetails: PersonalDetails;
  contactInformation: ContactInformation;
  verificationEmergency: VerificationEmergency;
};

type BasicInformation = {
  organizationName: NullableString;
  registrationNumber: NullableString;
  organizationType: NullableString;
  yearEstablished: NullableString;
  industry: NullableString;
  missionStatement: NullableString;
};

type AddressContactInfo = {
  headquartersAddress: NullableString;
  hqCity: NullableString;
  hqState: NullableString;
  hqCountry: NullableString;
  officePhone: NullableString;
  officialEmail: NullableString;
  website: NullableString;
  facebook: NullableString;
  linkedin: NullableString;
  twitter: NullableString;
  instagram: NullableString;
};

type OperationsDocumentation = {
  numEmployees: NullableString;
  areasOfOperation: NullableString;
  organizationLogo: NullableString;
  certificateOfIncorporation: NullableString;
  hasPartnership: NullableString;
  partnershipDetails: NullableString;
};

type OrganizationInfo = {
  basicInformation: BasicInformation;
  addressContactInfo: AddressContactInfo;
  operationsDocumentation: OperationsDocumentation;
};

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: string;
  organizationName?: string;
  contactInfo: ContactInfo;
  organizationInfo: OrganizationInfo;
  isActive: boolean;
  isVerified: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PersonalDetailsSchema = new Schema<PersonalDetails>({
  fullName: { type: String, default: '' },
  position: { type: String, default: '' },
  gender: { type: String, default: '' },
  birthDate: { type: String, default: '' }
}, { _id: false });

const ContactInformationSchema = new Schema<ContactInformation>({
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: '' }
}, { _id: false });

const VerificationEmergencySchema = new Schema<VerificationEmergency>({
  idType: { type: String, default: '' },
  idNumber: { type: String, default: '' },
  idDocument: { type: String, default: '' },
  emergencyContactName: { type: String, default: '' },
  emergencyContactPhone: { type: String, default: '' },
  emergencyRelationship: { type: String, default: '' }
}, { _id: false });

const ContactInfoSchema = new Schema<ContactInfo>({
  personalDetails: { type: PersonalDetailsSchema, required: true },
  contactInformation: { type: ContactInformationSchema, required: true },
  verificationEmergency: { type: VerificationEmergencySchema, required: true }
}, { _id: false });

const BasicInformationSchema = new Schema<BasicInformation>({
  organizationName: { type: String, default: '' },
  registrationNumber: { type: String, default: '' },
  organizationType: { type: String, default: '' },
  yearEstablished: { type: String, default: '' },
  industry: { type: String, default: '' },
  missionStatement: { type: String, default: '' }
}, { _id: false });

const AddressContactInfoSchema = new Schema<AddressContactInfo>({
  headquartersAddress: { type: String, default: '' },
  hqCity: { type: String, default: '' },
  hqState: { type: String, default: '' },
  hqCountry: { type: String, default: '' },
  officePhone: { type: String, default: '' },
  officialEmail: { type: String, default: '' },
  website: { type: String, default: '' },
  facebook: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  twitter: { type: String, default: '' },
  instagram: { type: String, default: '' }
}, { _id: false });

const OperationsDocumentationSchema = new Schema<OperationsDocumentation>({
  numEmployees: { type: String, default: '' },
  areasOfOperation: { type: String, default: '' },
  organizationLogo: { type: String, default: '' },
  certificateOfIncorporation: { type: String, default: '' },
  hasPartnership: { type: String, default: '' },
  partnershipDetails: { type: String, default: '' }
}, { _id: false });

const OrganizationInfoSchema = new Schema<OrganizationInfo>({
  basicInformation: { type: BasicInformationSchema, required: true },
  addressContactInfo: { type: AddressContactInfoSchema, required: true },
  operationsDocumentation: { type: OperationsDocumentationSchema, required: true }
}, { _id: false });

const allowedRoles = [
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
] as const;

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  userType: {
    type: String,
    required: true,
    index: true,
    enum: allowedRoles
  },
  organizationName: { type: String },
  contactInfo: { type: ContactInfoSchema, required: true },
  organizationInfo: { type: OrganizationInfoSchema, required: true },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  emailVerifiedAt: { type: Date },
  lastLoginAt: { type: Date },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
