import mongoose, { Document, Schema } from 'mongoose';

export interface IStakeholder extends Document {
  userId: mongoose.Types.ObjectId;
  stakeholderType: string;
  organizationName?: string;
  registrationNumber?: string;
  taxId?: string;
  legalStatus?: string;
  businessField?: string;
  registeredAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  website?: string;
  staffStrength?: number;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactPersonEmail?: string;
  contactPersonDesignation?: string;
  contactPersonPhone?: string;
  portalAccess?: string;
  permissions?: any;
  verificationStatus: string;
  verificationNotes?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StakeholderSchema = new Schema<IStakeholder>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  stakeholderType: { type: String, required: true },
  organizationName: { type: String },
  registrationNumber: { type: String },
  taxId: { type: String },
  legalStatus: { type: String },
  businessField: { type: String },
  registeredAddress: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  website: { type: String },
  staffStrength: { type: Number },
  contactPersonName: { type: String },
  contactPersonTitle: { type: String },
  contactPersonEmail: { type: String },
  contactPersonDesignation: { type: String },
  contactPersonPhone: { type: String },
  portalAccess: { type: String },
  permissions: { type: Schema.Types.Mixed },
  verificationStatus: { type: String, default: 'pending', enum: ['pending', 'verified', 'rejected'] },
  verificationNotes: { type: String },
  verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date }
}, { timestamps: true });

export default mongoose.model<IStakeholder>('Stakeholder', StakeholderSchema);
