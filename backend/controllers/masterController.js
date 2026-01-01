const Course = require('../models/Course');
const Batch = require('../models/Batch');
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
    const batches = await Batch.find({}).sort({ createdAt: -1 });
    res.json(batches);
});

// @desc Create batch
// @route POST /api/master/batch
const createBatch = asyncHandler(async (req, res) => {
    const batch = await Batch.create(req.body);
    res.status(201).json(batch);
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

module.exports = { getCourses, createCourse, deleteCourse, getBatches, createBatch, deleteBatch };