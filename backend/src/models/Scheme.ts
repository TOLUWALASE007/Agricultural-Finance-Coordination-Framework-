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
  recoveryRate: { type: String }
}, { timestamps: true });

// Index for searching
SchemeSchema.index({ schemeName: 'text', description: 'text' });

export default mongoose.model<IScheme>('Scheme', SchemeSchema);

