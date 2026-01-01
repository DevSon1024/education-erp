const Student = require('../models/Student');
const asyncHandler = require('express-async-handler');

// @desc    Get all students (with pagination & search)
// @route   GET /api/students
const getStudents = asyncHandler(async (req, res) => {
    const { keyword, pageNumber, courseId } = req.query;
    
    // 1. Explicit Filter: Only fetch non-deleted students
    let query = { isDeleted: false };

    // 2. Add Search Filters
    if (keyword) {
        query.name = { $regex: keyword, $options: 'i' };
    }
    if (courseId) {
        query.course = courseId;
    }

    // 3. Pagination Logic
    const pageSize = 10;
    const page = Number(pageNumber) || 1;
    const count = await Student.countDocuments(query);

    const students = await Student.find(query)
        .populate('course', 'name') // Fetch Course Name
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ createdAt: -1 });

    console.log(`Sending ${students.length} students to Frontend`); // Server Log

    res.json({ students, page, pages: Math.ceil(count / pageSize), count });
});

// @desc    Register new student
// @route   POST /api/students
const createStudent = asyncHandler(async (req, res) => {
    // Generate Reg No (e.g., 2026-1001)
    const count = await Student.countDocuments();
    const regNo = `${new Date().getFullYear()}-${1001 + count}`;
    
    const student = await Student.create({
        ...req.body,
        regNo
    });
    console.log("New Student Created:", student.name); // Server Log
    res.status(201).json(student);
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