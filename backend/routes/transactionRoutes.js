const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { 
    getInquiries, createInquiry, updateInquiryStatus,
    createFeeReceipt, getStudentFees,
    getFeeReceipts, updateFeeReceipt, deleteFeeReceipt,
    getStudentLedger
} = require('../controllers/transactionController');
const upload = require('../middlewares/uploadMiddleware'); // Import Upload Middleware

// --- Inquiry Routes ---
router.route('/inquiry')
    .get(protect, checkPermission('Inquiry', 'view'), getInquiries)
    .post(upload.single('studentPhoto'), createInquiry); // Added Middleware

router.route('/inquiry/:id')
    .put(protect, checkPermission('Inquiry', 'edit'), upload.single('studentPhoto'), updateInquiryStatus); // Added Middleware

// --- Fees Receipt Routes ---
router.route('/fees')
    .get(protect, checkPermission('Fees Receipt', 'view'), getFeeReceipts)
    .post(protect, checkPermission('Fees Receipt', 'add'), createFeeReceipt);

router.route('/fees/:id')
    .put(protect, checkPermission('Fees Receipt', 'edit'), updateFeeReceipt)
    .delete(protect, checkPermission('Fees Receipt', 'delete'), deleteFeeReceipt);

router.route('/fees/student/:studentId')
    // Viewing fees requires 'view' permission on Fees Receipt
    .get(protect, checkPermission('Fees Receipt', 'view'), getStudentFees);

// --- Ledger Route ---
router.route('/ledger')
    // Using 'Fees Receipt' view permission as Ledger is financial data
    // Or if 'Ledger' is a specific page in permissions, use checkPermission('Ledger', 'view')
    .get(protect, checkPermission('Ledger', 'view'), getStudentLedger);

module.exports = router;