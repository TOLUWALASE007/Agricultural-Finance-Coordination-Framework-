import mongoose, { Document, Schema } from 'mongoose';

export interface ILoan extends Document {
  loanReference: string;
  borrowerId: mongoose.Types.ObjectId;
  lenderId: mongoose.Types.ObjectId;
  coordinatingAgencyId?: mongoose.Types.ObjectId;
  principalAmount: number;
  interestRate: number;
  interestType: string;
  tenorMonths: number;
  monthlyPayment: number;
  totalAmount: number;
  loanPurpose: string;
  purposeDescription?: string;
  hasInsurance: boolean;
  insurancePremium?: number;
  insuranceProviderId?: mongoose.Types.ObjectId;
  collateralDescription?: string;
  collateralValue?: number;
  outstandingBalance: number;
  paymentsDue: number;
  status: string;
  applicationDate: Date;
  approvalDate?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvalNotes?: string;
  rejectionReason?: string;
  disbursementDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LoanSchema = new Schema<ILoan>({
  loanReference: { type: String, required: true, unique: true, index: true },
  borrowerId: { type: Schema.Types.ObjectId, ref: 'Stakeholder', required: true },
  lenderId: { type: Schema.Types.ObjectId, ref: 'Stakeholder', required: true },
  coordinatingAgencyId: { type: Schema.Types.ObjectId, ref: 'Stakeholder' },
  principalAmount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  interestType: { type: String, default: 'fixed', enum: ['fixed', 'variable'] },
  tenorMonths: { type: Number, required: true },
  monthlyPayment: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  loanPurpose: { 
    type: String, 
    required: true,
    enum: [
      'crop_production',
      'livestock',
      'machinery_purchase',
      'input_purchase',
      'infrastructure',
      'working_capital',
      'other'
    ]
  },
  purposeDescription: { type: String },
  hasInsurance: { type: Boolean, default: false },
  insurancePremium: { type: Number },
  insuranceProviderId: { type: Schema.Types.ObjectId, ref: 'Stakeholder' },
  collateralDescription: { type: String },
  collateralValue: { type: Number },
  outstandingBalance: { type: Number, required: true },
  paymentsDue: { type: Number, required: true },
  status: {
    type: String,
    required: true,
    enum: [
      'draft',
      'submitted',
      'under_review',
      'approved',
      'disbursed',
      'active',
      'completed',
      'defaulted',
      'cancelled'
    ],
    default: 'submitted',
    index: true
  },
  applicationDate: { type: Date, default: Date.now },
  approvalDate: { type: Date },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvalNotes: { type: String },
  rejectionReason: { type: String },
  disbursementDate: { type: Date }
}, { timestamps: true });

export default mongoose.model<ILoan>('Loan', LoanSchema);
