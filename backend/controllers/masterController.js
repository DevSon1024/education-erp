const Course = require('../models/Course');
const Batch = require('../models/Batch');
const Employee = require('../models/Employee');
const Subject = require('../models/Subject');
const asyncHandler = require('express-async-handler');

// --- COURSE CONTROLLERS --- (Kept as is)
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

// --- BATCH CONTROLLERS --- (Kept as is)
const getBatches = asyncHandler(async (req, res) => {
    const { startDate, endDate, searchBy, searchValue } = req.query;
    let query = { isDeleted: false };
    if (startDate && endDate) {
        query.startDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (searchBy && searchValue) {
        if (searchBy === 'Batch Name') {
            query.name = { $regex: searchValue, $options: 'i' };
        } else if (searchBy === 'Employee Name') {
            const employees = await Employee.find({ name: { $regex: searchValue, $options: 'i' } }).select('_id');
            const empIds = employees.map(e => e._id);
            query.faculty = { $in: empIds };
        }
    }
    const batches = await Batch.find(query).populate('course', 'name').populate('faculty', 'name').sort({ createdAt: -1 });
    res.json(batches);
});

const createBatch = asyncHandler(async (req, res) => {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
});

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

// --- SUBJECT CONTROLLERS ---

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

// @desc Create Subject
const createSubject = asyncHandler(async (req, res) => {
    const subject = await Subject.create(req.body);
    res.status(201).json(subject);
});

// @desc Update Subject
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

// @desc Delete Subject (Soft Delete)
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
    getBatches, createBatch, deleteBatch,
    getSubjects, createSubject, updateSubject, deleteSubject,
    createEmployee, getEmployees 
};