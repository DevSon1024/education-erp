const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Employee = require('../models/Employee');
const Subject = require('../models/Subject');
const asyncHandler = require('express-async-handler');

// --- COURSE CONTROLLERS --- 
const getCourses = asyncHandler(async (req, res) => {
    const { courseId, courseType } = req.query;
    let query = { isDeleted: false };
    if (courseId) query._id = courseId;
    if (courseType) query.courseType = courseType;
    const courses = await Course.find(query).populate('subjects', 'name').sort({ sorting: 1, createdAt: -1 });
    res.json(courses);
});

const createCourse = asyncHandler(async (req, res) => {
    const course = await Course.create(req.body);
    res.status(201).json(course);
});

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
const getBatches = asyncHandler(async (req, res) => {
    const { startDate, endDate, searchBy, searchValue } = req.query;
    let query = { isDeleted: false };

    // Date Filter
    if (startDate && endDate) {
        // Find batches active within this range (overlap logic or strict range)
        // Here we stick to strict start/end as per typical ERP needs
        query.startDate = { $gte: new Date(startDate) };
        query.endDate = { $lte: new Date(endDate) };
    }

    // Search Logic
    if (searchBy && searchValue) {
        if (searchBy === 'Batch Name') {
            query.name = { $regex: searchValue, $options: 'i' };
        } else if (searchBy === 'Faculty Name') {
            const employees = await Employee.find({ name: { $regex: searchValue, $options: 'i' } }).select('_id');
            const empIds = employees.map(e => e._id);
            query.faculty = { $in: empIds };
        }
    }

    const batches = await Batch.find(query)
        .populate('courses', 'name') // Changed to plural
        .populate('faculty', 'name')
        .sort({ createdAt: -1 });
    res.json(batches);
});

const createBatch = asyncHandler(async (req, res) => {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
});

const updateBatch = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const batch = await Batch.findById(id);

    if (batch) {
        const updatedBatch = await Batch.findByIdAndUpdate(id, req.body, { new: true })
            .populate('courses', 'name')
            .populate('faculty', 'name');
        res.json(updatedBatch);
    } else {
        res.status(404); throw new Error('Batch not found');
    }
});

const deleteBatch = asyncHandler(async (req, res) => {
    const batch = await Batch.findById(req.params.id);
    if (batch) {
        batch.isDeleted = true;
        await batch.save();
        res.json({ id: req.params.id, message: 'Batch removed' });
    } else {
        res.status(404); throw new Error('Batch not found');
    }
});

// --- SUBJECT CONTROLLERS ---
const getSubjects = asyncHandler(async (req, res) => {
    const { searchBy, searchValue } = req.query;
    let query = { isDeleted: false };
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

const createSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
});

const updateSubject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (subject) {
        const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedSubject);
    } else {
        res.status(404); throw new Error('Subject not found');
    }
});

const deleteSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
        subject.isDeleted = true;
        await subject.save();
        res.json({ id: req.params.id, message: 'Subject Removed' });
    } else {
        res.status(404); throw new Error('Subject not found');
    }
});

// --- EMPLOYEE HELPERS ---
const createEmployee = asyncHandler(async (req, res) => {
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
});

const getEmployees = asyncHandler(async (req, res) => {
    const emps = await Employee.find({ isDeleted: false });
    res.json(emps);
});

module.exports = { 
    getCourses, createCourse, deleteCourse, 
    getBatches, createBatch, updateBatch, deleteBatch,
    getSubjects, createSubject, updateSubject, deleteSubject,
    createEmployee, getEmployees 
};