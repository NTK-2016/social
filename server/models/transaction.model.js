import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  eventId: { type: String },
  amount: { type: Number },
  ownerAmount: { type: Number },
  referAmount: { type: Number },
  approvalStatus: { type: Number },
  tranStatus: { type: Number },//0-credit , 1-debit
  userId: { type: mongoose.Schema.ObjectId, ref: "User" },
  payoutId: { type: String },
  transactionId: { type: String },
  fromId: { type: mongoose.Schema.ObjectId, ref: "User" },
  toId: { type: mongoose.Schema.ObjectId, ref: "User" },
  vat: { type: Number },
  processFee: { type: Number },
  type: { type: String },
  withdrawId: { type: String },
  created: { type: Date, default: Date.now }
});
export default mongoose.model("Transaction", TransactionSchema);
