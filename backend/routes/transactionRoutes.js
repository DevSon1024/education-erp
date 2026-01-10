const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { 
    getInquiries, createInquiry, updateInquiryStatus,
    createFeeReceipt, getStudentFees,
    getFeeReceipts, updateFeeReceipt, deleteFeeReceipt
} = require('../controllers/transactionController');

// --- Inquiry Routes ---
// --- Inquiry Routes ---
router.route('/inquiry')
    .get(protect, checkPermission('Inquiry', 'view'), getInquiries)
    .post(createInquiry); // Public Access for Quick Contact

router.route('/inquiry/:id')
    .put(protect, checkPermission('Inquiry', 'edit'), updateInquiryStatus);

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

module.exports = router;