const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Employee = require('../models/Employee');
const Subject = require('../models/Subject');
const asyncHandler = require('express-async-handler');
// --- COURSE CONTROLLERS ---

// @desc Get all courses
// @route GET /api/master/course
const getCourses = asyncHandler(async (req, res) => {
    const { courseId, courseType } = req.query;
    let query = { isDeleted: false };

    if (courseId) {
        query._id = courseId;
    }
    if (courseType) {
        query.courseType = courseType;
    }

    const courses = await Course.find(query)
        .populate('subjects', 'name') // Populate subject names
        .sort({ sorting: 1, createdAt: -1 }); // Sort by user defined order

    res.json(courses);
});

// @desc Create course
// @route POST /api/master/course
const createCourse = asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
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

// @desc Get All Subjects
const getSubjects = asyncHandler(async (req, res) => {
    const { searchBy, searchValue } = req.query;
    let query = { isDeleted: false };

    // Search Logic
    if (searchBy && searchValue) {
        if (searchBy === 'Subject Name') {
            query.name = { $regex: searchValue, $options: 'i' };
        } else if (searchBy === 'Printed Name') {
            query.printedName = { $regex: searchValue, $options: 'i' };
        }
    }

    const subjects = await Subject.find(query).sort({ createdAt: -1 });
    res.json(subjects);
});

// @desc Create Dummy Subject (For seeding)
const createSubject = asyncHandler(async (req, res) => {
    // Basic validation could go here
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
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
    getBatches,getSubjects, createSubject,
    createBatch, deleteBatch,
    createEmployee, getEmployees 
};