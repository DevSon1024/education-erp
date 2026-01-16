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
    // FIXED: Added "Online" and "EMI" to match Student model and Frontend options
    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Cheque", "Online", "EMI"],
      required: true,
    },
    transactionId: { type: String }, // For UPI/Bank
    remarks: { type: String },
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FeeReceipt", feeReceiptSchema);
