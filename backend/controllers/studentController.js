const Student = require('../models/Student');
const User = require('../models/User'); 
const FeeReceipt = require('../models/FeeReceipt'); 
const Course = require('../models/Course');
const Batch = require('../models/Batch'); 
const Branch = require('../models/Branch'); 
const sendSMS = require('../utils/smsSender');
const asyncHandler = require('express-async-handler');
const Counter = require('../models/Counter');
const generateEnrollmentNumber = require('../utils/enrollmentGenerator');

// @desc    Get Students
const getStudents = asyncHandler(async (req, res) => {
    const {
        page = 1, pageSize = 10, courseFilter, studentName,
        hasPendingFees, reference, startDate, endDate,
        isRegistered, isAdmissionFeesPaid, batch,
        sortBy = '-createdAt'
    } = req.query;
    
    let query = { isDeleted: false };

    // Branch-based filtering: Non-Super Admins only see their branch students
    if (req.user.role !== 'Super Admin' && req.user.branchId) {
        query.branchId = req.user.branchId;
    }

    // Other filters
    if (courseFilter) query.course = courseFilter;
    if (studentName) {
        const nameRegex = new RegExp(studentName, 'i');
        query.$or = [
            { firstName: nameRegex },
            { lastName: nameRegex },
            { regNo: nameRegex },
            { enrollmentNo: nameRegex }
        ];
    }
    if (hasPendingFees === 'true') query.pendingFees = { $gt: 0 };
    if (reference) query.reference = { $regex: reference, $options: 'i' };
    if (batch) query.batch = { $regex: batch, $options: 'i' };
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
    const pageNum = Number(page) || 1;
    const count = await Student.countDocuments(query);

    const students = await Student.find(query)
        .populate('course', 'name duration shortName durationType')
        .limit(limit)
        .skip(limit * (pageNum - 1))
        .sort({ createdAt: -1 });

    res.json({ students, page: pageNum, pages: Math.ceil(count / limit), count });
});

// @desc    Get Single Student
const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id)
        .populate('course', 'name courseFees monthlyFees totalInstallment registrationFees admissionFees') // Explicitly select fee fields
        .populate('userId', 'username email');
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
        
        // CHANGED: Always calculate pending fees based on amount paid, even for "One Time"
        pendingFees = totalFees - admissionFeeAmount;
    }

    try {
        // 1. Create Student
        // Resolve Branch ID and Name
        let finalBranchId = req.body.branchId;
        let finalBranchName = 'Main Branch'; // Default

        if (!finalBranchId && req.user && req.user.branchId) {
            finalBranchId = req.user.branchId;
        }

        if (finalBranchId) {
            const branchDoc = await Branch.findById(finalBranchId);
            if (branchDoc) {
                finalBranchName = branchDoc.name;
            }
        }

        const studentData = {
            ...req.body,
            branchId: finalBranchId, // Ensure resolved ID is used
            branchName: finalBranchName, // Ensure correct name is saved
            studentPhoto: req.file ? req.file.path.replace(/\\/g, "/") : (req.body.studentPhoto || null), 
            pendingFees,
            isAdmissionFeesPaid,
            admissionFeeAmount,
            isRegistered: false 
        };

        // NEW: Generate Enrollment Number if paying admission fee immediately
        if (isAdmissionFeesPaid && finalBranchId) {
            studentData.enrollmentNo = await generateEnrollmentNumber(finalBranchId);
        }

        const student = await Student.create(studentData);

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

        // 3. Send SMS (Only if admission fees are paid)
        if (isAdmissionFeesPaid) {
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
        }

        res.status(201).json(student);
    } catch (error) {
        res.status(400);
        throw new Error('Invalid Student Data: ' + error.message);
    }
});

// @desc    Confirm Student Registration (Final Phase)
const confirmStudentRegistration = asyncHandler(async (req, res) => {
    console.log("Confirm Registration Request Recieved for ID:", req.params.id);
    const student = await Student.findById(req.params.id);
    if (!student) {
        console.error("Student Not Found");
        res.status(404); throw new Error('Student not found');
    }
    console.log("Student Found:", student.firstName);


    const { 
        regNo, 
        username, password, 
        feeDetails 
    } = req.body;

    let finalRegNo = regNo;
    if (!finalRegNo) {
        // --- New Logic: <GlobalSequence>-<BranchCode> ---
        // Dynamically find the maximum existing Registration Number across ALL branches
        
        const lastStudent = await Student.aggregate([
            { 
               $match: { 
                   regNo: { $exists: true, $ne: null, $ne: "" },
                   isRegistered: true 
               } 
            },
            {
               $project: {
                   regNo: 1,
                   seq: {
                       $convert: {
                           input: { $arrayElemAt: [{ $split: ["$regNo", "-"] }, 0] },
                           to: "int",
                           onError: 0,
                           onNull: 0
                       }
                   }
               }
            },
            { $sort: { seq: -1 } },
            { $limit: 1 }
        ]);

        let nextSequence = 1;
        if (lastStudent.length > 0 && lastStudent[0].seq > 0) {
            nextSequence = lastStudent[0].seq + 1;
        }

        // 2. Get Branch Short Code
        let branchCode = 'MN'; // Default
        if (student.branchId) {
             const branch = await Branch.findById(student.branchId);
             if (branch && branch.shortCode) {
                 branchCode = branch.shortCode;
             }
        }

        finalRegNo = `${nextSequence}-${branchCode}`;
    }

    const newUser = await User.create({
        name: `${student.firstName} ${student.lastName}`,
        email: student.email || `${finalRegNo}@institute.com`, 
        username: username,
        password: password,
        role: 'Student',
        branchId: student.branchId // Link user to the same branch
    });
    console.log("User Created for Student:", newUser._id);


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
    console.log("Student Registration Updated Successfully. RegNo:", finalRegNo);


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