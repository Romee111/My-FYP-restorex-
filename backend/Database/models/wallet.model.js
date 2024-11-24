import mongoose, { Schema } from 'mongoose';

const walletTransactionSchema = new Schema({
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true,
  },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
});

const walletSchema = new Schema({
  userId: { type: Schema.ObjectId, ref: 'user', required: true, unique: true },  // Reference to User
  balance: { type: Number, default: 0 },  // Current balance in the wallet
  transactions: [walletTransactionSchema],  // History of all transactions
});

const WalletModel = mongoose.model('Wallet', walletSchema);

export { WalletModel };
