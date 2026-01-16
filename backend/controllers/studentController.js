const Student = require('../models/Student');
const User = require('../models/User'); 
const FeeReceipt = require('../models/FeeReceipt'); 
const Course = require('../models/Course');
const Batch = require('../models/Batch'); 
const sendSMS = require('../utils/smsSender');
const asyncHandler = require('express-async-handler');

// @desc    Get Students
const getStudents = asyncHandler(async (req, res) => {
    const { 
        pageNumber, pageSize, 
        courseId, studentName, batch,
        hasPendingFees, reference, startDate, endDate,
        isRegistered, isAdmissionFeesPaid 
    } = req.query;
    
    let query = { isDeleted: false };

    if (courseId) query.course = courseId;
    if (batch) query.batch = { $regex: batch, $options: 'i' };
    if (studentName) {
        query.$or = [
            { firstName: { $regex: studentName, $options: 'i' } },
            { lastName: { $regex: studentName, $options: 'i' } },
            { enrollmentNo: { $regex: studentName, $options: 'i' } }
        ];
    }
    if (hasPendingFees === 'true') query.pendingFees = { $gt: 0 };
    if (reference) query.reference = { $regex: reference, $options: 'i' };
    if (startDate && endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.admissionDate = { $gte: new Date(startDate), $lte: end };
    }

    if (isRegistered !== undefined) {
        query.isRegistered = isRegistered === 'true';
    }

    if (isAdmissionFeesPaid !== undefined) {
        query.isAdmissionFeesPaid = isAdmissionFeesPaid === 'true';
    }

    const limit = Number(pageSize) || 10;
    const page = Number(pageNumber) || 1;
    const count = await Student.countDocuments(query);

    const students = await Student.find(query)
        .populate('course', 'name duration shortName durationType')
        .limit(limit)
        .skip(limit * (page - 1))
        .sort({ createdAt: -1 });

    res.json({ students, page, pages: Math.ceil(count / limit), count });
});

// @desc    Get Single Student
const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id).populate('course', 'name admissionFees registrationFees');
    if (student) res.json(student);
    else { res.status(404); throw new Error('Student not found'); }
});

// @desc    Create Student (Admission Phase)
const createStudent = asyncHandler(async (req, res) => {
    const { totalFees, feeDetails, paymentPlan } = req.body;
    
    let pendingFees = totalFees;
    let isAdmissionFeesPaid = false;
    let admissionFeeAmount = 0;

    if (feeDetails && feeDetails.amount > 0) {
        admissionFeeAmount = Number(feeDetails.amount);
        isAdmissionFeesPaid = true;
        
        if (paymentPlan === 'One Time') {
            pendingFees = 0; 
        } else {
            pendingFees = totalFees - admissionFeeAmount;
        }
    }

    try {
        // 1. Create Student
        const student = await Student.create({
            ...req.body,
            studentPhoto: req.file ? req.file.path.replace(/\\/g, "/") : null, 
            pendingFees,
            isAdmissionFeesPaid,
            admissionFeeAmount,
            isRegistered: false 
        });

        // 2. Create Receipt if paying now
        if (feeDetails && feeDetails.amount > 0) {
            const lastReceipt = await FeeReceipt.findOne().sort({ createdAt: -1 });
            let nextNum = 1;
            if (lastReceipt && lastReceipt.receiptNo && !isNaN(lastReceipt.receiptNo)) {
                nextNum = Number(lastReceipt.receiptNo) + 1;
            }
            const receiptNo = String(nextNum);

            // FIXED: Remarks Logic - Strictly use user input or default to 'Admission Fee'
            const receiptRemarks = feeDetails.remarks || 'Admission Fee';

            await FeeReceipt.create({
                receiptNo,
                student: student._id,
                course: student.course,
                amountPaid: feeDetails.amount,
                paymentMode: feeDetails.paymentMode,
                remarks: receiptRemarks,
                date: feeDetails.date || new Date(),
                createdBy: req.user._id
            });
        }

        // 3. Send SMS
        const courseDoc = await Course.findById(student.course);
        const batchDoc = await Batch.findOne({ name: student.batch }); 
        
        const courseName = courseDoc ? courseDoc.name : 'N/A';
        const batchTime = batchDoc ? `${batchDoc.startTime} to ${batchDoc.endTime}` : 'N/A';
        const fullName = `${student.firstName} ${student.lastName}`;

        const smsMessage = `Welcome to Smart Institute, Dear, ${fullName}. your admission has been successfully completed. Enrollment No. ${student.enrollmentNo}, course ${courseName}, Batch Time ${batchTime}`;

        const contacts = [...new Set([student.mobileStudent, student.mobileParent, student.contactHome].filter(Boolean))]; 
        Promise.all(contacts.map(num => sendSMS(num, smsMessage)))
            .then(() => console.log('Admission SMS sent successfully'))
            .catch(err => console.error('Admission SMS failed', err));

        res.status(201).json(student);
    } catch (error) {
        res.status(400);
        throw new Error('Invalid Student Data: ' + error.message);
    }
});

// @desc    Confirm Student Registration (Final Phase)
const confirmStudentRegistration = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) {
        res.status(404); throw new Error('Student not found');
    }

    const { 
        regNo, 
        username, password, 
        feeDetails 
    } = req.body;

    let finalRegNo = regNo;
    if (!finalRegNo) {
        const count = await Student.countDocuments({ isRegistered: true });
        finalRegNo = `${new Date().getFullYear()}-${1001 + count}`;
    }

    const newUser = await User.create({
        name: `${student.firstName} ${student.lastName}`,
        email: student.email || `${finalRegNo}@institute.com`, 
        username: username,
        password: password,
        role: 'Student'
    });

    if (student.paymentPlan !== 'One Time' && feeDetails && feeDetails.amount > 0) {
        const lastReceipt = await FeeReceipt.findOne().sort({ createdAt: -1 });
        let nextNum = 1;
        if (lastReceipt && lastReceipt.receiptNo && !isNaN(lastReceipt.receiptNo)) {
            nextNum = Number(lastReceipt.receiptNo) + 1;
        }
        const receiptNo = String(nextNum);
        
        await FeeReceipt.create({
            receiptNo,  
            student: student._id,
            course: student.course,
            amountPaid: feeDetails.amount,
            paymentMode: feeDetails.paymentMode,
            remarks: feeDetails.remarks || 'Registration Fee',
            date: feeDetails.date || new Date(),
            createdBy: req.user._id
        });

        student.pendingFees = Math.max(0, student.pendingFees - feeDetails.amount);
    }

    student.regNo = finalRegNo;
    student.isRegistered = true;
    student.registrationDate = new Date();
    student.userId = newUser._id;
    await student.save();

    if (student.mobileStudent) {
        const regMessage = `Dear, ${student.firstName} ${student.lastName}. Your Registration process has been successfully completed. Reg.No. ${finalRegNo}, User ID-${username}, Password-${password}, smart institute.`;
        sendSMS(student.mobileStudent, regMessage)
            .then(() => console.log('Registration SMS sent'))
            .catch(err => console.error('Registration SMS failed', err));
    }

    res.json({ message: 'Student Registration Completed', student });
});

// @desc    Permanent Delete Student
const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (student) {
        if(student.userId) {
            await User.findByIdAndDelete(student.userId);
        }
        res.json({ message: 'Student removed permanently' });
    } else {
        res.status(404); throw new Error('Student not found');
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

// @desc    Update Student
const updateStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id);

    if (student) {
        student.firstName = req.body.firstName || student.firstName;
        student.middleName = req.body.middleName || student.middleName;
        student.lastName = req.body.lastName || student.lastName;
        student.email = req.body.email || student.email;
        student.dob = req.body.dob || student.dob;
        student.gender = req.body.gender || student.gender;
        student.address = req.body.address || student.address;
        student.state = req.body.state || student.state;
        student.city = req.body.city || student.city;
        student.pincode = req.body.pincode || student.pincode;
        student.mobileStudent = req.body.mobileStudent || student.mobileStudent;
        student.mobileParent = req.body.mobileParent || student.mobileParent;
        student.contactHome = req.body.contactHome || student.contactHome;
        student.education = req.body.education || student.education;
        
        student.relationType = req.body.relationType || student.relationType;
        student.occupationType = req.body.occupationType || student.occupationType;
        student.occupationName = req.body.occupationName || student.occupationName;
        student.motherName = req.body.motherName || student.motherName;
        
        if(req.body.batch) {
            student.batch = req.body.batch;
        }

        if (req.file) {
            student.studentPhoto = req.file.path.replace(/\\/g, "/");
        }

        if(req.body.admissionDate) {
            student.admissionDate = req.body.admissionDate;
        }

        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } else {
        res.status(404); throw new Error('Student not found');
    }
});

// @desc    Reset Student Login (Username/Password)
const resetStudentLogin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const student = await Student.findById(req.params.id);

    if (!student) {
        res.status(404); throw new Error('Student not found');
    }

    if (!student.userId) {
        res.status(400); throw new Error('Student is not registered yet. Please confirm registration first.');
    }

    const user = await User.findById(student.userId);
    if (!user) {
        res.status(404); throw new Error('Associated User account not found');
    }

    user.username = username || user.username;
    if (password) {
        user.password = password; 
    }
    await user.save();

    if (student.mobileStudent) {
        const msg = `Dear ${student.firstName}, your login details have been updated. User ID: ${user.username}, Password: ${password || '(Unchanged)'}. Smart Institute.`;
        sendSMS(student.mobileStudent, msg).catch(err => console.error('Reset Login SMS failed', err));
    }

    res.json({ message: 'Login details updated successfully', username: user.username });
});

module.exports = { getStudents, getStudentById, createStudent, updateStudent, confirmStudentRegistration, deleteStudent, toggleStudentStatus, resetStudentLogin };