const mongoose = require('mongoose');

const feeReceiptSchema = new mongoose.Schema({
    receiptNo: { type: String, required: true, unique: true }, // Auto-gen: REC-1001
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    amountPaid: { type: Number, required: true },
    paymentMode: { type: String, enum: ['Cash', 'UPI', 'Bank Transfer', 'Cheque'], required: true },
    transactionId: { type: String }, // For UPI/Bank
    remarks: { type: String },
    date: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('FeeReceipt', feeReceiptSchema);