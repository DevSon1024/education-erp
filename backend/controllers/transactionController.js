const Inquiry = require('../models/Inquiry');
const FeeReceipt = require('../models/FeeReceipt');
const asyncHandler = require('express-async-handler');

// --- INQUIRY ---

// @desc Get Inquiries with Filters
const getInquiries = asyncHandler(async (req, res) => {
    const { 
        startDate, 
        endDate, 
        status, 
        studentName, 
        dateFilterType // 'inquiryDate', 'followUpDate', 'createdAt'
    } = req.query;

    let query = { isDeleted: false };

    // Date Filters
    if (startDate && endDate) {
        const dateField = dateFilterType || 'inquiryDate';
        query[dateField] = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
        };
    }

    // Status Filter
    if (status) {
        query.status = status;
    }

    // Student Name Search (Regex)
    if (studentName) {
        query.$or = [
            { firstName: { $regex: studentName, $options: 'i' } },
            { lastName: { $regex: studentName, $options: 'i' } }
        ];
    }

    // Exclude completed if filtering for dropdown lists usually, 
    // but for main table we might want them unless specified.
    
    const inquiries = await Inquiry.find(query)
        .populate('interestedCourse', 'name')
        .populate('allocatedTo', 'name')
        .sort({ createdAt: -1 });

    res.json(inquiries);
});

// @desc Create Inquiry
const createInquiry = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json(inquiry);
});

// @desc Update Inquiry (Status, Follow-up, etc.)
const updateInquiryStatus = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
        inquiry.status = req.body.status || inquiry.status;
        inquiry.followUpDetails = req.body.followUpDetails || inquiry.followUpDetails;
        inquiry.followUpDate = req.body.followUpDate || inquiry.followUpDate;
        inquiry.allocatedTo = req.body.allocatedTo || inquiry.allocatedTo;
        
        // Update other fields if edited
        if(req.body.firstName) inquiry.firstName = req.body.firstName;
        if(req.body.lastName) inquiry.lastName = req.body.lastName;
        if(req.body.contactStudent) inquiry.contactStudent = req.body.contactStudent;
        
        await inquiry.save();
        res.json(inquiry);
    } else {
        res.status(404); throw new Error('Inquiry not found');
    }
});

// --- FEES (Unchanged) ---
const createFeeReceipt = asyncHandler(async (req, res) => {
    const { studentId, courseId, amountPaid, paymentMode, remarks } = req.body;
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

const getStudentFees = asyncHandler(async (req, res) => {
    const receipts = await FeeReceipt.find({ student: req.params.studentId }).sort({ createdAt: -1 });
    res.json(receipts);
});

module.exports = { getInquiries, createInquiry, updateInquiryStatus, createFeeReceipt, getStudentFees };