const Inquiry = require('../models/Inquiry');
const FeeReceipt = require('../models/FeeReceipt');
const Student = require('../models/Student');
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

        // Follow Up Updates
        if(req.body.followUpDetails) inquiry.followUpDetails = req.body.followUpDetails;
        if(req.body.followUpDate) inquiry.followUpDate = req.body.followUpDate;
        if(req.body.nextVisitingDate) inquiry.nextVisitingDate = req.body.nextVisitingDate;
        if(req.body.visitReason) inquiry.visitReason = req.body.visitReason;

        // Permanent Delete Signal
        if(req.body.isDeleted === true) {
             await Inquiry.findByIdAndDelete(req.params.id);
             return res.json({ id: req.params.id, message: 'Inquiry Removed Permanently' });
        }

        await inquiry.save();
        res.json(inquiry);
    } else {
        res.status(404); throw new Error('Inquiry not found');
    }
});

// --- FEES (Standard) ---
// @desc Get Fee Receipts with Filters
const getFeeReceipts = asyncHandler(async (req, res) => {
    const { 
        startDate, 
        endDate, 
        receiptNo,
        paymentMode,
        studentId
    } = req.query;

    let query = { };

    // Date Filters
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date = { $gte: start, $lte: end };
    }

    // Receipt No Filter
    if (receiptNo) {
        query.receiptNo = { $regex: receiptNo, $options: 'i' };
    }

    // Payment Mode Filter
    if (paymentMode) {
        query.paymentMode = paymentMode;
    }

    // Student Filter
    if (studentId) {
        query.student = studentId;
    }

    const receipts = await FeeReceipt.find(query)
        .populate('student', 'firstName lastName') // Adjust fields based on Student model
        .populate('course', 'name')
        .sort({ createdAt: -1 });

    res.json(receipts);
});

const createFeeReceipt = asyncHandler(async (req, res) => {
    const { studentId, courseId, amountPaid, paymentMode, remarks, date } = req.body;
    
    // 1. Validation
    const student = await Student.findById(studentId);
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // 2. Generate Receipt No
    const count = await FeeReceipt.countDocuments();
    const receiptNo = String(count + 1);

    // 3. Create Receipt
    const receipt = await FeeReceipt.create({
        receiptNo,
        student: studentId,
        course: courseId,
        amountPaid,
        paymentMode,
        remarks,
        date: date || Date.now(),
        createdBy: req.user._id
    });

// 4. Update Student Pending Fees & Status
    student.pendingFees = student.pendingFees - Number(amountPaid);
    
    let admissionCompletedNow = false;
    if (!student.isAdmissionFeesPaid) {
        student.isAdmissionFeesPaid = true;
        admissionCompletedNow = true;
    }

    await student.save();

    // 5. Send Admission SMS if applicable
    if (admissionCompletedNow) {
        try {
             // We need to fetch Course and Batch names which might not be populated in 'student' object
             // 'student.course' is an ObjectId, 'student.batch' is a String Name (usually) or ID?
             // In Student Model: batch is String. course is ObjectId.
             const Course = require('../models/Course');
             const Batch = require('../models/Batch');
             const sendSMS = require('../utils/smsSender');

             const courseDoc = await Course.findById(courseId); // courseId is from body, or use student.course
             const batchDoc = await Batch.findOne({ name: student.batch });
             
             const courseName = courseDoc ? courseDoc.name : 'N/A';
             const batchTime = batchDoc ? `${batchDoc.startTime} to ${batchDoc.endTime}` : 'N/A';
             const fullName = `${student.firstName} ${student.lastName}`;

             const smsMessage = `Welcome to Smart Institute, Dear, ${fullName}. your admission has been successfully completed. Enrollment No. ${student.enrollmentNo}, course ${courseName}, Batch Time ${batchTime}`;
             
             const contacts = [student.mobileStudent, student.mobileParent, student.contactHome].filter(Boolean);
             await Promise.all(contacts.map(num => sendSMS(num, smsMessage)));
             console.log('Admission SMS sent via Fee Receipt');
        } catch (error) {
            console.error('Failed to send Admission SMS via Receipt', error);
        }
    }

    res.status(201).json(receipt);
});

// @desc Update Fee Receipt
const updateFeeReceipt = asyncHandler(async (req, res) => {
    const receipt = await FeeReceipt.findById(req.params.id);

    if (receipt) {
        // We need to adjust the student's pending fees if the amount changes
        // This is complex. 
        // Old Amount: 500, New Amount: 600 -> Student Paid 100 more -> Pending fees decreases by 100
        // Old Amount: 500, New Amount: 400 -> Student Paid 100 less -> Pending fees increases by 100
        
        if (req.body.amountPaid && req.body.amountPaid !== receipt.amountPaid) {
            const student = await Student.findById(receipt.student);
            if(student) {
                const diff = Number(req.body.amountPaid) - Number(receipt.amountPaid);
                student.pendingFees = student.pendingFees - diff;
                await student.save();
            }
        }

        receipt.amountPaid = req.body.amountPaid || receipt.amountPaid;
        receipt.paymentMode = req.body.paymentMode || receipt.paymentMode;
        receipt.remarks = req.body.remarks || receipt.remarks;
        receipt.date = req.body.date || receipt.date;

        await receipt.save();
        res.json(receipt);
    } else {
        res.status(404);
        throw new Error('Receipt not found');
    }
});

// @desc Delete Fee Receipt
const deleteFeeReceipt = asyncHandler(async (req, res) => {
    const receipt = await FeeReceipt.findById(req.params.id);

    if (receipt) {
        // Revert student balance
        const student = await Student.findById(receipt.student);
        if (student) {
            student.pendingFees = student.pendingFees + Number(receipt.amountPaid);
            await student.save();
        }

        await receipt.deleteOne(); 
        res.json({ message: 'Receipt removed' });
    } else {
        res.status(404);
        throw new Error('Receipt not found');
    }
});

const getStudentFees = asyncHandler(async (req, res) => {
    const receipts = await FeeReceipt.find({ student: req.params.studentId }).sort({ createdAt: -1 });
    res.json(receipts);
});

module.exports = { 
    getInquiries, 
    createInquiry, 
    updateInquiryStatus, 
    createFeeReceipt, 
    getStudentFees,
    getFeeReceipts,
    updateFeeReceipt,
    deleteFeeReceipt
};