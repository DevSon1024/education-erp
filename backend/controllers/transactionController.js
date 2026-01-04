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
        source, // ADDED: Filter by source (Online, Walk-in, etc.)
        dateFilterType 
    } = req.query;

    let query = { isDeleted: false };

    // Date Filters
    if (startDate && endDate) {
        const dateField = dateFilterType || 'inquiryDate';
        // Set end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        query[dateField] = {
            $gte: new Date(startDate),
            $lte: end
        };
    }

    // Status Filter
    if (status) {
        query.status = status;
    }

    // Source Filter (e.g., 'Online')
    if (source) {
        query.source = source;
    }

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

// @desc Update Inquiry Status/Follow-up
const updateInquiryStatus = asyncHandler(async (req, res) => {
    const inquiry = await Inquiry.findById(req.params.id);
    if (inquiry) {
        inquiry.status = req.body.status || inquiry.status;
        inquiry.remarks = req.body.remarks || inquiry.remarks;
        inquiry.followUpDate = req.body.followUpDate || inquiry.followUpDate;
        inquiry.followUpDetails = req.body.followUpDetails || inquiry.followUpDetails;
        inquiry.allocatedTo = req.body.allocatedTo || inquiry.allocatedTo;
        
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