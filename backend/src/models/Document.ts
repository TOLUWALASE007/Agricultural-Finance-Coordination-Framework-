import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentType: string;
  description?: string;
  relatedEntityType?: string;
  relatedEntityId?: mongoose.Types.ObjectId;
  uploadDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  documentType: {
    type: String,
    required: true,
    enum: [
      'identification',
      'business_registration',
      'tax_certificate',
      'financial_statement',
      'bank_statement',
      'collateral_document',
      'insurance_certificate',
      'loan_application',
      'loan_agreement',
      'repayment_schedule',
      'farm_registration',
      'anchor_agreement',
      'produce_certificate',
      'other'
    ]
  },
  description: { type: String },
  relatedEntityType: { type: String },
  relatedEntityId: { type: Schema.Types.ObjectId },
  uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IDocument>('Document', DocumentSchema);
