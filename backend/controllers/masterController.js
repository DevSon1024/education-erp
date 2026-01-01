const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Employee = require('../models/Employee');
const asyncHandler = require('express-async-handler');

// --- COURSE CONTROLLERS ---

// @desc Get all courses
// @route GET /api/master/course
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({}).sort({ createdAt: -1 });
    res.json(courses);
});

// @desc Create course
// @route POST /api/master/course
const createCourse = asyncHandler(async (req, res) => {
    const { name, code, duration, fees } = req.body;
    
    const courseExists = await Course.findOne({ code });
    if (courseExists) {
        res.status(400); throw new Error('Course code already exists');
    }

    const course = await Course.create({ name, code, duration, fees });
    res.status(201).json(course);
});

// @desc Delete course
// @route DELETE /api/master/course/:id
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (course) {
        course.isDeleted = true;
        await course.save();
        res.json({ message: 'Course removed' });
    } else {
        res.status(404); throw new Error('Course not found');
    }
});

// --- BATCH CONTROLLERS ---

// @desc Get all batches
// @route GET /api/master/batch
const getBatches = asyncHandler(async (req, res) => {
    const { startDate, endDate, searchBy, searchValue } = req.query;

    let query = { isDeleted: false };

    // 1. Date Filter (Batches starting in this range)
    if (startDate && endDate) {
        query.startDate = { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
        };
    }

    // 2. Search Logic
    if (searchBy && searchValue) {
        if (searchBy === 'Batch Name') {
            query.name = { $regex: searchValue, $options: 'i' };
        } else if (searchBy === 'Employee Name') {
            // Find employees matching the name first
            const employees = await Employee.find({ name: { $regex: searchValue, $options: 'i' } }).select('_id');
            const empIds = employees.map(e => e._id);
            query.faculty = { $in: empIds };
        }
    }

    const batches = await Batch.find(query)
        .populate('course', 'name')
        .populate('faculty', 'name')
        .sort({ createdAt: -1 });

    res.json(batches);
});

// @desc Create batch
// @route POST /api/master/batch
const createBatch = asyncHandler(async (req, res) => {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
});

// @desc Create Dummy Employee (Helper for testing)
const createEmployee = asyncHandler(async (req, res) => {
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
});

// @desc Get All Employees (For Dropdown)
const getEmployees = asyncHandler(async (req, res) => {
    const emps = await Employee.find({ isDeleted: false });
    res.json(emps);
});

// @desc Delete batch
// @route DELETE /api/master/batch/:id
const deleteBatch = asyncHandler(async (req, res) => {
    const batch = await Batch.findById(req.params.id);
    if (batch) {
        batch.isDeleted = true;
        await batch.save();
        res.json({ message: 'Batch removed' });
    } else {
        res.status(404); throw new Error('Batch not found');
    }
});

module.exports = { 
    getCourses, createCourse, deleteCourse, 
    getBatches, createBatch, deleteBatch,
    createEmployee, getEmployees 
};