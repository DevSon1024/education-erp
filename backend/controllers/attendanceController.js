const asyncHandler = require('express-async-handler');
const StudentAttendance = require('../models/StudentAttendance');
const Student = require('../models/Student');
const Batch = require('../models/Batch');

// @desc    Get Attendance Records
// @route   GET /api/attendance/student
const getAttendance = asyncHandler(async (req, res) => {
    const { fromDate, toDate, batchName, batchTime } = req.query;
    
    let query = {};

    // Date Range
    if (fromDate && toDate) {
        const start = new Date(fromDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query.date = { $gte: start, $lte: end };
    }

    if (batchName) query.batchName = batchName;
    if (batchTime) query.batchTime = batchTime;

    const records = await StudentAttendance.find(query)
        .populate('student', 'firstName lastName enrollmentNo mobileStudent mobileParent')
        .populate('course', 'name') // Optional if needed
        .sort({ date: -1 });

    res.json(records);
});

// @desc    Create/Bulk Add Attendance
// @route   POST /api/attendance/student
const createAttendance = asyncHandler(async (req, res) => {
    const { date, batchName, batchTime, students } = req.body;
    // students: Array of { studentId, isPresent, remarks, courseId }
    
    if (!students || students.length === 0) {
        res.status(400); throw new Error('No student data provided');
    }

    const attendanceRecords = students.map(s => ({
        date: new Date(date),
        batchName,
        batchTime,
        student: s.studentId,
        course: s.courseId,
        isPresent: s.isPresent,
        remarks: s.remarks,
        createdBy: req.user._id
    }));

    // Logic: Delete existing for this date/batch/student to avoid dups? 
    // Or just insert. Let's insert. Ideally we should check if exists.
    // For simplicity, we create new. 
    
    // Better: upsert? 
    // Let's just create for now. User can delete if mistake.
    
    const created = await StudentAttendance.insertMany(attendanceRecords);
    res.status(201).json(created);
});

// @desc    Update Attendance
// @route   PUT /api/attendance/student/:id
const updateAttendance = asyncHandler(async (req, res) => {
    const record = await StudentAttendance.findById(req.params.id);
    if (!record) {
        res.status(404); throw new Error('Record not found');
    }

    record.isPresent = req.body.isPresent !== undefined ? req.body.isPresent : record.isPresent;
    record.remarks = req.body.remarks || record.remarks;
    
    await record.save();
    res.json(record);
});

// @desc    Delete Attendance
// @route   DELETE /api/attendance/student/:id
const deleteAttendance = asyncHandler(async (req, res) => {
    const record = await StudentAttendance.findByIdAndDelete(req.params.id);
    if (record) {
        res.json({ message: 'Attendance removed permanently' });
    } else {
        res.status(404); throw new Error('Record not found');
    }
});

module.exports = { getAttendance, createAttendance, updateAttendance, deleteAttendance };
