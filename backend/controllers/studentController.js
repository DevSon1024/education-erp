const Student = require('../models/Student');
const asyncHandler = require('express-async-handler');

// @desc    Get Students with Advanced Filters
// @route   GET /api/students
const getStudents = asyncHandler(async (req, res) => {
    const { 
        pageNumber, pageSize, 
        fromDate, toDate, 
        courseId, studentName, batch 
    } = req.query;
    
    let query = { isDeleted: false };

    // 1. Date Range Filter (Admission Date)
    if (fromDate && toDate) {
        query.admissionDate = { 
            $gte: new Date(fromDate), 
            $lte: new Date(toDate) 
        };
    }

    // 2. Course Filter
    if (courseId) {
        query.course = courseId;
    }

    // 3. Name Search (Checks First, Middle, or Last Name)
    if (studentName) {
        query.$or = [
            { firstName: { $regex: studentName, $options: 'i' } },
            { middleName: { $regex: studentName, $options: 'i' } },
            { lastName: { $regex: studentName, $options: 'i' } }
        ];
    }

    // 4. Batch Filter
    if (batch) {
        query.batch = { $regex: batch, $options: 'i' };
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

// @desc    Create Student (Updated for new fields)
const createStudent = asyncHandler(async (req, res) => {
    // Generate Reg No
    const count = await Student.countDocuments();
    const regNo = `${new Date().getFullYear()}-${1001 + count}`;
    
    // Calculate pending fees initially = total fees
    const pendingFees = req.body.totalFees;

    const student = await Student.create({
        ...req.body,
        regNo,
        pendingFees
    });
    res.status(201).json(student);
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
// @route   DELETE /api/students/:id
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

module.exports = { getStudents, createStudent, deleteStudent };