import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  loanId: mongoose.Types.ObjectId;
  transactionType: string;
  amount: number;
  transactionDate: Date;
  description?: string;
  reference?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  loanId: { type: Schema.Types.ObjectId, ref: 'Loan', required: true, index: true },
  transactionType: {
    type: String,
    required: true,
    enum: ['disbursement', 'repayment', 'interest_payment', 'penalty', 'refund', 'other']
  },
  amount: { type: Number, required: true },
  transactionDate: { type: Date, required: true, default: Date.now },
  description: { type: String },
  reference: { type: String, index: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
