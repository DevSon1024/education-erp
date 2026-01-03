const asyncHandler = require('express-async-handler');
const ExamRequest = require('../models/ExamRequest');
const Student = require('../models/Student');

// @desc    Get Exam Requests with Filters
// @route   GET /api/master/exam-request
const getExamRequests = asyncHandler(async (req, res) => {
    const { studentId, courseId } = req.query;

    let query = { isDeleted: false, status: { $ne: 'Cancelled' } };

    // Filter by Student directly
    if (studentId) {
        query.student = studentId;
    } 
    // Filter by Course (Indirect relationship)
    else if (courseId) {
        const studentsInCourse = await Student.find({ course: courseId }).select('_id');
        query.student = { $in: studentsInCourse };
    }

    const requests = await ExamRequest.find(query)
        .populate({
            path: 'student',
            populate: { path: 'course', select: 'name duration' },
            select: 'firstName lastName regNo admissionDate mobileParent mobileStudent'
        })
        .sort({ createdAt: -1 });

    res.json(requests);
});

// @desc    Cancel Exam Request
// @route   PUT /api/master/exam-request/:id/cancel
const cancelExamRequest = asyncHandler(async (req, res) => {
    const request = await ExamRequest.findById(req.params.id);
    if (request) {
        request.status = 'Cancelled';
        await request.save();
        res.json({ message: 'Exam request cancelled successfully', id: req.params.id });
    } else {
        res.status(404); throw new Error('Exam Request not found');
    }
});

// @desc    Create Manual Request (Helper for testing)
// @route   POST /api/master/exam-request
const createExamRequest = asyncHandler(async (req, res) => {
    const { studentId } = req.body;
    const request = await ExamRequest.create({ student: studentId });
    res.status(201).json(request);
});

module.exports = { getExamRequests, cancelExamRequest, createExamRequest };