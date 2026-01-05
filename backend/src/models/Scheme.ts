import mongoose, { Document, Schema } from 'mongoose';

export interface IScheme extends Document {
  schemeName: string;
  schemeId: string;
  description: string;
  amount: string;
  states: string[];
  startDate: Date;
  applicationDeadline: Date;
  status: 'Active' | 'Inactive' | 'Completed';
  createdBy: mongoose.Types.ObjectId;
  fundProvider?: string;
  beneficiaries?: number;
  recoveryRate?: string;
  metadata?: any;
  workflowStage?: string;
  selectedInsuranceCompanyIds?: string[];
  insuranceCompanySubmissions?: any[];
  approvedInsuranceCompanyId?: string;
  insuranceCompanyRequirements?: string;
  insuranceCompanyPremiumType?: string;
  pfiApplications?: any[];
  selectedPFIIds?: string[];
  beneficiaryApplications?: any[];
  openToBeneficiaries?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SchemeSchema = new Schema<IScheme>({
  schemeName: { type: String, required: true, index: true },
  schemeId: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  amount: { type: String, required: true },
  states: { type: [String], required: true, default: [] },
  startDate: { type: Date, required: true },
  applicationDeadline: { type: Date, required: true },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Completed'],
    default: 'Active',
    index: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fundProvider: { type: String },
  beneficiaries: { type: Number, default: 0 },
  recoveryRate: { type: String },
  metadata: { type: Schema.Types.Mixed },
  workflowStage: { type: String, default: 'initial' },
  selectedInsuranceCompanyIds: { type: [String], default: [] },
  insuranceCompanySubmissions: { type: [Schema.Types.Mixed], default: [] },
  approvedInsuranceCompanyId: { type: String },
  insuranceCompanyRequirements: { type: String },
  insuranceCompanyPremiumType: { type: String },
  pfiApplications: { type: [Schema.Types.Mixed], default: [] },
  selectedPFIIds: { type: [String], default: [] },
  beneficiaryApplications: { type: [Schema.Types.Mixed], default: [] },
  openToBeneficiaries: { type: Boolean, default: false }
}, { timestamps: true });

// Index for searching
SchemeSchema.index({ schemeName: 'text', description: 'text' });

export default mongoose.model<IScheme>('Scheme', SchemeSchema);

