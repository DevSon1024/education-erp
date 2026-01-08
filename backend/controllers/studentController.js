const Student = require('../models/Student');
const Course = require('../models/Course');
const sendSMS = require('../utils/smsSender');
const asyncHandler = require('express-async-handler');

// @desc    Get Students (With Filters)
// @route   GET /api/students
const getStudents = asyncHandler(async (req, res) => {
    const { 
        pageNumber, pageSize, 
        courseId, studentName, batch,
        hasPendingFees, // Filter for students with pending fees
        reference,      // Filter by reference (Employee/Faculty)
        startDate,      // Admission Date From
        endDate         // Admission Date To
    } = req.query;
    
    // Base Query
    let query = { isDeleted: false };

    // --- Filters ---
    if (courseId) query.course = courseId;
    if (batch) query.batch = { $regex: batch, $options: 'i' };
    
    // Name Search
    if (studentName) {
        query.$or = [
            { firstName: { $regex: studentName, $options: 'i' } },
            { lastName: { $regex: studentName, $options: 'i' } },
            { enrollmentNo: { $regex: studentName, $options: 'i' } } // Added search by Enrollment
        ];
    }

    // Pending Fees Filter
    if (hasPendingFees === 'true') {
        query.pendingFees = { $gt: 0 };
    }

    // Reference Filter
    if (reference) {
        query.reference = { $regex: reference, $options: 'i' };
    }

    // Admission Date Filter
    if (startDate && endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.admissionDate = { $gte: new Date(startDate), $lte: end };
    }

    // Pagination
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

// @desc    Get Single Student by ID
// @route   GET /api/students/:id
const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id).populate('course', 'name');
    if (student) {
        res.json(student);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Create Student
const createStudent = asyncHandler(async (req, res) => {
    // 1. Generate Reg No
    const count = await Student.countDocuments();
    const regNo = `${new Date().getFullYear()}-${1001 + count}`;
    
    // 2. Set Fees
    const pendingFees = req.body.totalFees;

    try {
        const student = await Student.create({
            ...req.body,
            regNo,
            pendingFees
        });
        
        // SMS Logic (Simplified for brevity, keep your existing SMS logic here)
        try {
            const courseData = await Course.findById(student.course);
            const message = `Welcome ${student.firstName}. Enrollment ${student.enrollmentNo}.`;
            // sendSMS(student.mobileParent, message); 
        } catch (e) { console.error(e); }

        res.status(201).json(student);
    } catch (error) {
        res.status(400);
        throw new Error('Invalid Student Data: ' + error.message);
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

module.exports = { getStudents, getStudentById, createStudent, deleteStudent, toggleStudentStatus };