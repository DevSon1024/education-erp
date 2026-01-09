const Student = require('../models/Student');
const User = require('../models/User'); 
const FeeReceipt = require('../models/FeeReceipt'); 
const Course = require('../models/Course');
const Batch = require('../models/Batch'); // Import Batch for time details
const sendSMS = require('../utils/smsSender');
const asyncHandler = require('express-async-handler');

// @desc    Get Students
const getStudents = asyncHandler(async (req, res) => {
    const { 
        pageNumber, pageSize, 
        courseId, studentName, batch,
        hasPendingFees, reference, startDate, endDate,
        isRegistered, isAdmissionFeesPaid 
    } = req.query;
    
    let query = { isDeleted: false };

    if (courseId) query.course = courseId;
    if (batch) query.batch = { $regex: batch, $options: 'i' };
    if (studentName) {
        query.$or = [
            { firstName: { $regex: studentName, $options: 'i' } },
            { lastName: { $regex: studentName, $options: 'i' } },
            { enrollmentNo: { $regex: studentName, $options: 'i' } }
        ];
    }
    if (hasPendingFees === 'true') query.pendingFees = { $gt: 0 };
    if (reference) query.reference = { $regex: reference, $options: 'i' };
    if (startDate && endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.admissionDate = { $gte: new Date(startDate), $lte: end };
    }

    // Filter by Registration Status
    if (isRegistered !== undefined) {
        query.isRegistered = isRegistered === 'true';
    }

    // Filter by Admission Fees Payment Status
    if (isAdmissionFeesPaid !== undefined) {
        query.isAdmissionFeesPaid = isAdmissionFeesPaid === 'true';
    }

    const limit = Number(pageSize) || 10;
    const page = Number(pageNumber) || 1;
    const count = await Student.countDocuments(query);

    const students = await Student.find(query)
        .populate('course', 'name duration')
        .limit(limit)
        .skip(limit * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ students, page, pages: Math.ceil(count / limit), count });
});

// @desc    Get Single Student
const getStudentById = asyncHandler(async (req, res) => {
    // UPDATED: Added admissionFees to populate so it can be used in fee payment page
    const student = await Student.findById(req.params.id).populate('course', 'name admissionFees');
    if (student) res.json(student);
    else { res.status(404); throw new Error('Student not found'); }
});

// @desc    Create Student (Admission Phase)
const createStudent = asyncHandler(async (req, res) => {
    const { totalFees, feeDetails } = req.body;
    
    let pendingFees = totalFees;
    let isAdmissionFeesPaid = false;

    // If paying immediately, calculate pending fees
    if (feeDetails && feeDetails.amount > 0) {
        pendingFees = totalFees - Number(feeDetails.amount);
        isAdmissionFeesPaid = true; // Assuming any payment at this stage covers admission
    }

    try {
        // 1. Create Student
        const student = await Student.create({
            ...req.body,
            pendingFees,
            isAdmissionFeesPaid,
            isRegistered: false 
        });

        // 2. Create Receipt if paying now
        if (feeDetails && feeDetails.amount > 0) {
            const feeCount = await FeeReceipt.countDocuments();
            // Use Transaction Logic for Receipt No (Standardized)
            const receiptNo = `REC-${1000 + feeCount + 1}`; // Ensure this logic matches transactionController

            await FeeReceipt.create({
                receiptNo,
                student: student._id,
                course: student.course,
                amountPaid: feeDetails.amount,
                paymentMode: feeDetails.paymentMode,
                remarks: feeDetails.remarks || 'Admission Fee',
                date: feeDetails.date || new Date(),
                createdBy: req.user._id
            });
        }

        // 3. Prepare Data for SMS
        const courseDoc = await Course.findById(student.course);
        const batchDoc = await Batch.findOne({ name: student.batch }); 
        
        const courseName = courseDoc ? courseDoc.name : 'N/A';
        const batchTime = batchDoc ? `${batchDoc.startTime} to ${batchDoc.endTime}` : 'N/A';
        const fullName = `${student.firstName} ${student.lastName}`;

        // 4. Construct Message
        const smsMessage = `Welcome to Smart Institute, Dear, ${fullName}. Your admission has been successfully completed. Enrollment No. ${student.enrollmentNo}, Course ${courseName}, Batch Time ${batchTime}`;

        // 5. Send SMS to All Contacts
        const contacts = [student.mobileStudent, student.mobileParent, student.contactHome].filter(Boolean); 
        
        Promise.all(contacts.map(num => sendSMS(num, smsMessage)))
            .then(() => console.log('Admission SMS sent successfully'))
            .catch(err => console.error('Admission SMS failed', err));

        res.status(201).json(student);
    } catch (error) {
        res.status(400);
        throw new Error('Invalid Student Data: ' + error.message);
    }
});

// @desc    Confirm Student Registration (Final Phase)
const confirmStudentRegistration = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) {
        res.status(404); throw new Error('Student not found');
    }

    const { 
        regNo, 
        username, password, 
        feeDetails 
    } = req.body;

    // 1. Generate Reg No
    let finalRegNo = regNo;
    if (!finalRegNo) {
        const count = await Student.countDocuments({ isRegistered: true });
        finalRegNo = `${new Date().getFullYear()}-${1001 + count}`;
    }

    // 2. Create User Login
    const newUser = await User.create({
        name: `${student.firstName} ${student.lastName}`,
        email: student.email || `${finalRegNo}@institute.com`, 
        username: username,
        password: password,
        role: 'Student'
    });

    // 3. Create Fee Receipt
    if (feeDetails && feeDetails.amount > 0) {
        const feeCount = await FeeReceipt.countDocuments();
        await FeeReceipt.create({
            receiptNo: `REC-${2000 + feeCount + 1}`, 
            student: student._id,
            course: student.course,
            amountPaid: feeDetails.amount,
            paymentMode: feeDetails.paymentMode,
            remarks: feeDetails.remarks || 'Registration Fee',
            date: feeDetails.date || new Date(),
            createdBy: req.user._id
        });
    }

    // 4. Update Student
    student.regNo = finalRegNo;
    student.isRegistered = true;
    student.registrationDate = new Date();
    student.userId = newUser._id;
    await student.save();

    // 5. Send Registration SMS
    if (student.mobileStudent) {
        const regMessage = `Dear, ${student.firstName} ${student.lastName}. Your Registration process has been successfully completed. Reg.No. ${finalRegNo}, User ID-${username}, Password-${password}, Smart Institute.`;
        
        sendSMS(student.mobileStudent, regMessage)
            .then(() => console.log('Registration SMS sent'))
            .catch(err => console.error('Registration SMS failed', err));
    }

    res.json({ message: 'Registration Confirmed', student });
});

// @desc    Soft Delete Student
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (student) {
        student.isDeleted = true;
        await student.save();
        res.json({ message: 'Student removed' });
    } else {
        res.status(404); throw new Error('Student not found');
    }
});

// @desc    Toggle Active Status
const toggleStudentStatus = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if(student) {
        student.isActive = !student.isActive;
        await student.save();
        res.json({ message: 'Status updated', isActive: student.isActive });
    } else {
        res.status(404); throw new Error('Student not found');
    }
});

module.exports = { getStudents, getStudentById, createStudent, confirmStudentRegistration, deleteStudent, toggleStudentStatus };