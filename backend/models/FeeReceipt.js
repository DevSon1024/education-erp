const mongoose = require("mongoose");

const feeReceiptSchema = new mongoose.Schema(
  {
    receiptNo: { type: String, required: true, unique: true },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amountPaid: { type: Number, required: true },
    // Standardized to 3 receipt types: Cash, Cheque, Online/UPI
    paymentMode: {
      type: String,
      enum: ["Cash", "Cheque", "Online/UPI"],
      required: true,
    },
    installmentNumber: { type: Number, default: 1 }, // For tracking EMI payments
    transactionId: { type: String }, // For Online/UPI payments
    remarks: { type: String },
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Indexes
feeReceiptSchema.index({ student: 1 });
feeReceiptSchema.index({ receiptNo: 1 });
feeReceiptSchema.index({ date: -1 });

module.exports = mongoose.model("FeeReceipt", feeReceiptSchema);
