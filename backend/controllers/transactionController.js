const Inquiry = require('../models/Inquiry');
const FeeReceipt = require('../models/FeeReceipt');
const Student = require('../models/Student');
const asyncHandler = require('express-async-handler');

// --- INQUIRY ---

// @desc Get Inquiries
const getInquiries = asyncHandler(async (req, res) => {
    const inquiries = await Inquiry.find({ isDeleted: false })
        .populate('interestedCourse', 'name')
        .sort({ createdAt: -1 });
    res.json(inquiries);
});

// @desc Create Inquiry
const createInquiry = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json(inquiry);
});

// @desc Update Inquiry Status
const updateInquiryStatus = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
        inquiry.status = req.body.status || inquiry.status;
        inquiry.remarks = req.body.remarks || inquiry.remarks;
        await inquiry.save();
        res.json(inquiry);
    } else {
        res.status(404); throw new Error('Inquiry not found');
    }
});

// --- FEES ---

// @desc Collect Fees
const createFeeReceipt = asyncHandler(async (req, res) => {
    const { studentId, courseId, amountPaid, paymentMode, remarks } = req.body;

    // Generate Receipt No (Simple logic)
    const count = await FeeReceipt.countDocuments();
    const receiptNo = `REC-${1000 + count + 1}`;

    const receipt = await FeeReceipt.create({
        receiptNo,
        student: studentId,
        course: courseId,
        amountPaid,
        paymentMode,
        remarks,
        createdBy: req.user._id
    });

    res.status(201).json(receipt);
});

// @desc Get Receipts for a Student
const getStudentFees = asyncHandler(async (req, res) => {
    const receipts = await FeeReceipt.find({ student: req.params.studentId }).sort({ createdAt: -1 });
    res.json(receipts);
});

module.exports = { getInquiries, createInquiry, updateInquiryStatus, createFeeReceipt, getStudentFees };