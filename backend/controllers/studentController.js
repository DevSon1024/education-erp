const Student = require('../models/Student');
const Course = require('../models/Course');
const sendSMS = require('../utils/smsSender');
const asyncHandler = require('express-async-handler');

// @desc    Get Students (With Debugging)
// @route   GET /api/students
const getStudents = asyncHandler(async (req, res) => {
    const { 
        pageNumber, pageSize, 
        courseId, studentName, batch 
    } = req.query;
    
    // Base Query
    let query = { isDeleted: false };

    // --- Filters ---
    if (courseId) query.course = courseId;
    if (batch) query.batch = { $regex: batch, $options: 'i' };
    if (studentName) {
        query.$or = [
            { firstName: { $regex: studentName, $options: 'i' } },
            { lastName: { $regex: studentName, $options: 'i' } }
        ];
    }

    console.log("GET STUDENTS QUERY:", query); // <--- DEBUG LOG

    // Pagination
    const limit = Number(pageSize) || 10;
    const page = Number(pageNumber) || 1;
    const count = await Student.countDocuments(query);

    const students = await Student.find(query)
        .populate('course', 'name duration')
        .limit(limit)
        .skip(limit * (page - 1))
        .sort({ createdAt: -1 });

    console.log(`Found ${students.length} students`); // <--- DEBUG LOG

    res.json({ students, page, pages: Math.ceil(count / limit), count });
});

// @desc    Create Student (With Validation Logs)
// @route   POST /api/students
const createStudent = asyncHandler(async (req, res) => {
    console.log("RECEIVED STUDENT DATA:", req.body);

    // 1. Generate Reg No
    const count = await Student.countDocuments();
    const regNo = `${new Date().getFullYear()}-${1001 + count}`;
    
    // 2. Set Fees
    const pendingFees = req.body.totalFees;

    try {
        // Create the student
        const student = await Student.create({
            ...req.body,
            regNo,
            pendingFees
        });
        
        console.log("STUDENT SAVED SUCCESSFULLY:", student._id);

        // --- SMS LOGIC START ---
        try {
            // 1. Fetch Course Name (since we only have courseId)
            const courseData = await Course.findById(student.course);
            const courseName = courseData ? courseData.name : 'Course';

            // 2. Prepare Variables
            const studentName = `${student.firstName} ${student.lastName}`;
            const enrollmentNo = student.enrollmentNo; // Populated by pre-save hook in Model
            const batchTime = student.batch;
            const mobileNumber = student.mobileStudent || student.mobileParent; // Fallback to parent if student has no mobile

            // 3. Construct Message
            const message = `Welcome to Smart Institute, Dear ${studentName}. your admission has been successfully completed. Enrollment No. ${enrollmentNo}, course ${courseName}, Batch Time ${batchTime}.`;

            // 4. Send SMS (Non-blocking: we don't await strictly if we don't want to delay response)
            sendSMS(mobileNumber, message);

        } catch (smsError) {
            console.error("Error preparing SMS:", smsError.message);
        }
        // --- SMS LOGIC END ---

        res.status(201).json(student);

    } catch (error) {
        console.error("STUDENT SAVE ERROR:", error.message);
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

module.exports = { getStudents, createStudent, deleteStudent, toggleStudentStatus };