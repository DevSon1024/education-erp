const Inquiry = require("../models/Inquiry");
const FeeReceipt = require("../models/FeeReceipt");
const Student = require("../models/Student");
const Batch = require("../models/Batch");
const asyncHandler = require("express-async-handler");
const generateEnrollmentNumber = require("../utils/enrollmentGenerator");

// --- INQUIRY ---

// @desc Get Inquiries with Filters
const getInquiries = asyncHandler(async (req, res) => {
  const { startDate, endDate, status, studentName, source, dateFilterType } =
    req.query;

  let query = { isDeleted: false };

  // Date Filters
  if (startDate && endDate) {
    const dateField = dateFilterType || "inquiryDate";
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query[dateField] = { $gte: new Date(startDate), $lte: end };
  }

  // Status Filter
  if (status) query.status = status;

  // Source Filter
  if (source) query.source = source;

  // Student Name Search (Regex)
  if (studentName) {
    query.$or = [
      { firstName: { $regex: studentName, $options: "i" } },
      { lastName: { $regex: studentName, $options: "i" } },
    ];
  }

  // --- BRANCH SCOPING ---
  // If user is a Branch Director OR Branch Admin, restrict to their branch
  if (req.user && (req.user.role === 'Branch Director' || req.user.role === 'Branch Admin') && req.user.branchId) {
      query.branchId = req.user.branchId;
  }
  // If Super Admin specifically requests a branch (future proofing), allow it
  if (req.query.branchId) {
      query.branchId = req.query.branchId;
  }
  // ----------------------

  const inquiries = await Inquiry.find(query)
    .populate("interestedCourse", "name")
    .populate("allocatedTo", "name")
    .populate("branchId", "name shortCode") // Populate branch details
    .sort({ createdAt: -1 });

  res.json(inquiries);
});

// @desc Create Inquiry
const createInquiry = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.studentPhoto = req.file.path.replace(/\\/g, "/"); // Normalize path
  }

  if (data.referenceDetail && typeof data.referenceDetail === "string") {
    try {
      data.referenceDetail = JSON.parse(data.referenceDetail);
    } catch (e) {
      console.error("Error parsing referenceDetail", e);
    }
  }

  const inquiry = await Inquiry.create(data);

  if (req.body.visitorId) {
    const Visitor = require("../models/Visitor");
    await Visitor.findByIdAndUpdate(req.body.visitorId, {
      inquiryId: inquiry._id,
    });
  }

  res.status(201).json(inquiry);
});

// @desc Update Inquiry
const updateInquiryStatus = asyncHandler(async (req, res) => {
  const inquiry = await Inquiry.findById(req.params.id);
  if (inquiry) {
    if (req.body.isDeleted === true) {
      await Inquiry.findByIdAndDelete(req.params.id);
      return res.json({
        id: req.params.id,
        message: "Inquiry Removed Permanently",
      });
    }

    const fields = [
      "status",
      "source",
      "remarks",
      "allocatedTo",
      "referenceBy",
      "firstName",
      "middleName",
      "lastName",
      "email",
      "gender",
      "dob",
      "contactStudent",
      "contactParent",
      "contactHome",
      "address",
      "city",
      "state",
      "education",
      "qualification",
      "interestedCourse",
      "inquiryDate",
      "followUpDetails",
      "followUpDate",
      "nextVisitingDate",
      "visitReason",
      "relationType",
      "customEducation",
      "referenceDetail",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (
          field === "referenceDetail" &&
          typeof req.body[field] === "string"
        ) {
          try {
            inquiry[field] = JSON.parse(req.body[field]);
          } catch (e) {
            /* ignore parse error */
          }
        } else {
          inquiry[field] = req.body[field];
        }
      }
    });

    if (req.file) {
      inquiry.studentPhoto = req.file.path.replace(/\\/g, "/");
    }

    await inquiry.save();
    res.json(inquiry);
  } else {
    res.status(404);
    throw new Error("Inquiry not found");
  }
});

// --- FEES (Standard) ---
// @desc Get Fee Receipts with Filters
const getFeeReceipts = asyncHandler(async (req, res) => {
  const { startDate, endDate, receiptNo, paymentMode, studentId } = req.query;

  let query = {};

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  if (receiptNo) query.receiptNo = { $regex: receiptNo, $options: "i" };
  if (paymentMode) query.paymentMode = paymentMode;
  if (studentId) query.student = studentId;

  const receipts = await FeeReceipt.find(query)
    .populate("student", "firstName lastName regNo enrollmentNo middleName mobileStudent mobileParent batch totalFees pendingFees branchName emiDetails")
    .populate("course", "name")
    .sort({ createdAt: -1 });

  res.json(receipts);
});

// @desc Create Fee Receipt (FIXED: Improved Receipt No Logic)
const createFeeReceipt = asyncHandler(async (req, res) => {
  const { 
    studentId, courseId, amountPaid, paymentMode, remarks, date,
    bankName, chequeNumber, chequeDate, transactionId, transactionDate 
  } = req.body;

  // 1. Validation
  const student = await Student.findById(studentId);
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  // 2. Generate Receipt No (FIXED: Safe sequential numbering)
  // Find the last receipt created to determine the next number
  const lastReceipt = await FeeReceipt.findOne().sort({ createdAt: -1 });
  let nextNum = 1;
  if (lastReceipt && lastReceipt.receiptNo && !isNaN(lastReceipt.receiptNo)) {
    nextNum = Number(lastReceipt.receiptNo) + 1;
  }
  const receiptNo = String(nextNum);

  // 2.5. Calculate Installment Number for Monthly Payment Students
  let installmentNumber = 1;
  
  // Count existing receipts for this student to determine installment sequence
  const existingReceipts = await FeeReceipt.find({ student: studentId }).sort({ createdAt: 1 });
  
  if (existingReceipts.length > 0) {
    // Next installment is one more than the count of existing receipts
    installmentNumber = existingReceipts.length + 1;
  }
  // For the first receipt:
  // - If student hasn't paid admission fees yet, this is installment 1 (Admission)
  // - If student is registered, this is their first monthly payment
  if (installmentNumber === 1 && student.isRegistered) {
    // If already registered, this should be their first monthly installment
    installmentNumber = 3; // Since 1=Admission, 2=Registration, so monthly starts at 3
  }

  // 3. Create Receipt
  const receipt = await FeeReceipt.create({
    receiptNo,
    student: studentId,
    course: courseId,
    amountPaid,
    paymentMode,
    remarks,
    date: date || Date.now(),
    createdBy: req.user._id,
    installmentNumber, // Auto-calculated installment number
    bankName,
    chequeNumber,
    chequeDate,
    transactionId,
    transactionDate
  });

  // 4. Update Student Pending Fees & Status
  let admissionCompletedNow = false;

  // CRITICAL LOGIC: 
  // If admission fees weren't paid, this payment is treated as Admission Fee
  // Admission Fee is ADDITIVE to the course fee, so we do NOT reduce pendingFees (Tuition).
  if (!student.isAdmissionFeesPaid) {
    student.isAdmissionFeesPaid = true;
    student.admissionFeeAmount = Number(amountPaid); // Track the actual amount paid for admission
    admissionCompletedNow = true;
    
    // NEW: Generate Enrollment No if not present
    if (!student.enrollmentNo && student.branchId) {
        student.enrollmentNo = await generateEnrollmentNumber(student.branchId);
    }
  } else {
    // Regular Tuition Fee Payment -> Reduce Pending Fees
    student.pendingFees = student.pendingFees - Number(amountPaid);
  }

  await student.save();

  // 5. Send Admission SMS
  if (admissionCompletedNow) {
    try {
      const Course = require("../models/Course");
      const sendSMS = require("../utils/smsSender");

      const courseDoc = await Course.findById(courseId);
      const batchDoc = await Batch.findOne({ name: student.batch });

      const courseName = courseDoc ? courseDoc.name : "N/A";
      const batchTime = batchDoc
        ? `${batchDoc.startTime} to ${batchDoc.endTime}`
        : "N/A";
      const fullName = `${student.firstName} ${student.lastName}`;

      const smsMessage = `Welcome to Smart Institute, Dear, ${fullName}. your admission has been successfully completed. Enrollment No. ${student.enrollmentNo}, course ${courseName}, Batch Time ${batchTime}`;

      const contacts = [
        ...new Set(
          [
            student.mobileStudent,
            student.mobileParent,
            student.contactHome,
          ].filter(Boolean)
        ),
      ];
      await Promise.all(contacts.map((num) => sendSMS(num, smsMessage)));
    } catch (error) {
      console.error("Failed to send Admission SMS via Receipt", error);
    }
  }

  res.status(201).json(receipt);
});

// @desc Update Fee Receipt
const updateFeeReceipt = asyncHandler(async (req, res) => {
  const receipt = await FeeReceipt.findById(req.params.id);

  if (receipt) {
    if (req.body.amountPaid && req.body.amountPaid !== receipt.amountPaid) {
      const student = await Student.findById(receipt.student);
      if (student) {
        const diff = Number(req.body.amountPaid) - Number(receipt.amountPaid);
        student.pendingFees = student.pendingFees - diff;
        await student.save();
      }
    }

    receipt.amountPaid = req.body.amountPaid || receipt.amountPaid;
    receipt.paymentMode = req.body.paymentMode || receipt.paymentMode;
    receipt.remarks = req.body.remarks || receipt.remarks;
    receipt.date = req.body.date || receipt.date;
    
    // Update dynamic fields
    if (req.body.bankName !== undefined) receipt.bankName = req.body.bankName;
    if (req.body.chequeNumber !== undefined) receipt.chequeNumber = req.body.chequeNumber;
    if (req.body.chequeDate !== undefined) receipt.chequeDate = req.body.chequeDate;
    if (req.body.transactionId !== undefined) receipt.transactionId = req.body.transactionId;
    if (req.body.transactionDate !== undefined) receipt.transactionDate = req.body.transactionDate;

    await receipt.save();
    res.json(receipt);
  } else {
    res.status(404);
    throw new Error("Receipt not found");
  }
});

// @desc Delete Fee Receipt
const deleteFeeReceipt = asyncHandler(async (req, res) => {
  const receipt = await FeeReceipt.findById(req.params.id);

  if (receipt) {
    const student = await Student.findById(receipt.student);
    if (student) {
      student.pendingFees = student.pendingFees + Number(receipt.amountPaid);
      await student.save();
    }

    await receipt.deleteOne();
    res.json({ message: "Receipt removed" });
  } else {
    res.status(404);
    throw new Error("Receipt not found");
  }
});

const getStudentFees = asyncHandler(async (req, res) => {
  const receipts = await FeeReceipt.find({
    student: req.params.studentId,
  })
    .populate("student", "firstName lastName regNo enrollmentNo middleName mobileStudent mobileParent batch totalFees pendingFees branchName emiDetails")
    .populate("course", "name")
    .sort({ createdAt: -1 });
  res.json(receipts);
});

// --- LEDGER REPORT ---
const getStudentLedger = asyncHandler(async (req, res) => {
  const { studentId, regNo } = req.query;

  let student = null;
  if (studentId) {
    student = await Student.findById(studentId).populate("course");
  } else if (regNo) {
    student = await Student.findOne({ regNo }).populate("course");
  }

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  const batchDoc = await Batch.findOne({ name: student.batch });
  const receipts = await FeeReceipt.find({ student: student._id }).sort({
    date: 1,
  });

  const totalCourseFees =
    (student.totalFees || 0) + (student.admissionFeeAmount || 0);
  const totalPaid = receipts.reduce((acc, curr) => acc + curr.amountPaid, 0);
  const dueAmount = totalCourseFees - totalPaid;

  res.json({
    student,
    course: student.course,
    batch: batchDoc,
    receipts,
    summary: { totalCourseFees, totalPaid, dueAmount },
  });
});

// @desc    Get Student Payment Summary
// @route   GET /api/transaction/student/:studentId/payment-summary
const getStudentPaymentSummary = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.studentId).populate("course");
  
  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  // Calculate total received amount
  const receipts = await FeeReceipt.find({ student: student._id });
  const totalReceived = receipts.reduce((acc, curr) => acc + curr.amountPaid, 0);

  // Calculate amounts
  // Calculate amounts
  // Total Expected = Tuition (student.totalFees) + Admission (student.course.admissionFees or paid amount if higher?)
  // Actually, let's trust the course admission fee as the 'Required' amount. 
  // If student paid MORE, it's fine. If less, they owe.
  const courseAdmissionFee = student.course && student.course.admissionFees ? student.course.admissionFees : 0;
  const paidAdmissionFee = student.admissionFeeAmount || 0;
  
  // Pending Admission = Expected - Paid. (Ensure not negative if they overpaid)
  const pendingAdmission = Math.max(0, courseAdmissionFee - paidAdmissionFee);

  // Total Fees for Calculation = Tuition (pending + paid_tuition) + Admission (pending + paid)
  // But easier: Total Expected = Student.totalFees (Tuition) + MAX(courseAdmissionFee, paidAdmissionFee)
  // Using MAX ensures if they paid 600 (vs 500), the total reflects 600.
  const effectiveAdmissionFee = Math.max(courseAdmissionFee, paidAdmissionFee);
  const totalFees = (student.totalFees || 0) + effectiveAdmissionFee;
  
  // Due Amount = Total Fees - Total Received
  const dueAmount = totalFees - totalReceived;

  // --- NEW OUTSTANDING AMOUNT LOGIC ---
  // Start with Pending Admission Fees
  let outstandingAmount = pendingAdmission;
  
  let emiStructure = null;
  let feesMethod = student.paymentPlan || "One Time";

  if (student.paymentPlan === "Monthly" && student.emiDetails) {
    const monthlyInstallment = student.emiDetails.monthlyInstallment || 0;
    const months = student.emiDetails.months || 0;
    const regFees = student.emiDetails.registrationFees || 0;

    if (monthlyInstallment && months) {
      emiStructure = `₹${monthlyInstallment} x ${months} months`;
    }

    // 1. Calculate how much Registration Fee has been paid
    const regReceipts = receipts.filter(r => {
        const rem = (r.remarks || "").toLowerCase();
        return rem.includes("registration") || r.installmentNumber === 2;
    });
    const totalRegPaid = regReceipts.reduce((acc, curr) => acc + curr.amountPaid, 0);

    // 2. Calculate Pending Registration Fee
    const pendingReg = Math.max(0, regFees - totalRegPaid);

    // 3. Determine Next Installment Amount
    let nextInstallment = monthlyInstallment;
    if (nextInstallment > student.pendingFees) { // pendingFees is Tuition Only
        nextInstallment = student.pendingFees;
    }

    // 4. Add to Outstanding
    // Outstanding = Pending Admission + Pending Registration + Next Installment
    outstandingAmount += pendingReg;
    
    // Only add installment if there is tuition pending
    if (student.pendingFees > 0) {
        outstandingAmount += nextInstallment;
    }
  } else {
      // For One Time: Outstanding = Pending Admission + Pending Tuition
      outstandingAmount += (student.pendingFees || 0);
  }

  res.json({
    totalReceived,
    dueAmount,
    outstandingAmount,
    feesMethod,
    emiStructure,
    totalFees,
  });
});

// @desc    Get Student Payment History
// @route   GET /api/transaction/student/:studentId/payment-history
const getStudentPaymentHistory = asyncHandler(async (req, res) => {
  const receipts = await FeeReceipt.find({ student: req.params.studentId })
    .populate({
      path: "student",
      select: "firstName lastName regNo enrollmentNo middleName mobileStudent mobileParent batch totalFees pendingFees branchName emiDetails branchId",
      populate: {
        path: "branchId",
        select: "name address city state phone mobile email"
      }
    })
    .populate("course", "name")
    .sort({ date: 1 }); // Changed to ascending order (1) - oldest first, latest last

  res.json(receipts);
});

// @desc    Generate Receipt Report with Filters
// @route   GET /api/transaction/fees/report
const generateReceiptReport = asyncHandler(async (req, res) => {
  const { startDate, endDate, receiptNo, paymentMode, studentId } = req.query;

  let query = {};

  // Apply filters
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  if (receiptNo) query.receiptNo = { $regex: receiptNo, $options: "i" };
  if (paymentMode) query.paymentMode = paymentMode;
  if (studentId) query.student = studentId;

  const receipts = await FeeReceipt.find(query)
    .populate("student", "firstName lastName regNo enrollmentNo middleName mobileStudent mobileParent batch totalFees pendingFees branchName emiDetails")
    .populate("course", "name")
    .sort({ date: -1 });

  // Calculate total amount
  const totalAmount = receipts.reduce((acc, curr) => acc + curr.amountPaid, 0);

  res.json({
    receipts,
    totalAmount,
    count: receipts.length,
  });
});

// @desc    Get Next Receipt Number

const getNextReceiptNo = asyncHandler(async (req, res) => {
    const lastReceipt = await FeeReceipt.findOne().sort({ createdAt: -1 });
    let nextNum = 1;
    if (lastReceipt && lastReceipt.receiptNo && !isNaN(lastReceipt.receiptNo)) {
        nextNum = Number(lastReceipt.receiptNo) + 1;
    }
    res.json(String(nextNum));
});

module.exports = {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  createFeeReceipt,
  getStudentFees,
  getFeeReceipts,
  updateFeeReceipt,
  deleteFeeReceipt,
  getStudentLedger,
  getNextReceiptNo,
  getStudentPaymentSummary,
  getStudentPaymentHistory,
  generateReceiptReport,
};
