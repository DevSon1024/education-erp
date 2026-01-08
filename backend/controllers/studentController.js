const Student = require('../models/Student');
const User = require('../models/User'); 
const FeeReceipt = require('../models/FeeReceipt'); 
const asyncHandler = require('express-async-handler');

// @desc    Get Students
const getStudents = asyncHandler(async (req, res) => {
    const { 
        pageNumber, pageSize, 
        courseId, studentName, batch,
        hasPendingFees, reference, startDate, endDate,
        isRegistered 
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

    if (isRegistered !== undefined) {
        query.isRegistered = isRegistered === 'true';
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
    const student = await Student.findById(req.params.id).populate('course', 'name');
    if (student) res.json(student);
    else { res.status(404); throw new Error('Student not found'); }
});

// @desc    Create Student (Admission Phase)
const createStudent = asyncHandler(async (req, res) => {
    const { feeDetails, ...studentData } = req.body;

    try {
        // 1. Create Student
        const student = await Student.create({
            ...studentData,
            isRegistered: false // Initially false until final registration step
        });

        // 2. Handle Conditional Admission Fee Payment
        if (student && feeDetails && feeDetails.amount > 0) {
            
            // Generate Receipt Number
            const feeCount = await FeeReceipt.countDocuments();
            const receiptNo = `REC-${new Date().getFullYear()}-${1000 + feeCount + 1}`;

            // Create Receipt
            await FeeReceipt.create({
                receiptNo,
                student: student._id,
                course: student.course,
                amountPaid: feeDetails.amount,
                paymentMode: feeDetails.paymentMode || 'Cash',
                remarks: feeDetails.remarks || 'Admission Fee (At Admission)',
                date: feeDetails.date || new Date(),
                createdBy: req.user?._id // Requires Auth Middleware
            });

            // Update Student Status
            student.pendingFees = student.totalFees - feeDetails.amount;
            student.isAdmissionFeesPaid = true; 
            await student.save();
        }

        res.status(201).json(student);
    } catch (error) {
        res.status(400);
        throw new Error('Admission Failed: ' + error.message);
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
        feeDetails // Optional if admission fee wasn't paid earlier
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

    // 3. Create Fee Receipt (Only if paying now)
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