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
        source, 
        dateFilterType 
    } = req.query;

    let query = { isDeleted: false };

    // Date Filters
    if (startDate && endDate) {
        const dateField = dateFilterType || 'inquiryDate';
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query[dateField] = { $gte: new Date(startDate), $lte: end };
    }

    // Status Filter
    if (status) query.status = status;

    // Source Filter
    if (source) query.source = source;

    // Student Name Search (Regex)
    if (studentName) {
        query.$or = [
            { firstName: { $regex: studentName, $options: 'i' } },
            { lastName: { $regex: studentName, $options: 'i' } }
        ];
    }
    
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

// @desc Update Inquiry
const updateInquiryStatus = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
        // Core updates
        if(req.body.status) inquiry.status = req.body.status;
        if(req.body.source) inquiry.source = req.body.source;
        if(req.body.remarks) inquiry.remarks = req.body.remarks;
        if(req.body.allocatedTo) inquiry.allocatedTo = req.body.allocatedTo;
        
        // Field updates
        if(req.body.referenceBy !== undefined) inquiry.referenceBy = req.body.referenceBy;
        if(req.body.firstName) inquiry.firstName = req.body.firstName;
        if(req.body.lastName) inquiry.lastName = req.body.lastName;
        // ... (Other fields can be added as needed, or use Object.assign for full updates if safe)

        // Follow Up Updates
        if(req.body.followUpDetails) inquiry.followUpDetails = req.body.followUpDetails;
        if(req.body.followUpDate) inquiry.followUpDate = req.body.followUpDate;
        if(req.body.nextVisitingDate) inquiry.nextVisitingDate = req.body.nextVisitingDate;
        if(req.body.visitReason) inquiry.visitReason = req.body.visitReason;

        // Soft Delete
        if(req.body.isDeleted !== undefined) inquiry.isDeleted = req.body.isDeleted;

        await inquiry.save();
        res.json(inquiry);
    } else {
        res.status(404); throw new Error('Inquiry not found');
    }
});

// --- FEES (Standard) ---
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