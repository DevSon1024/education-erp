const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { 
    getInquiries, createInquiry, updateInquiryStatus,
    createFeeReceipt, getStudentFees 
} = require('../controllers/transactionController');

// --- Inquiry Routes ---
router.route('/inquiry')
    .get(protect, checkPermission('Inquiry', 'view'), getInquiries)
    .post(protect, checkPermission('Inquiry', 'add'), createInquiry);

router.route('/inquiry/:id')
    .put(protect, checkPermission('Inquiry', 'edit'), updateInquiryStatus);

// --- Fees Receipt Routes ---
router.route('/fees')
    .post(protect, checkPermission('Fees Receipt', 'add'), createFeeReceipt);

router.route('/fees/:studentId')
    // Viewing fees requires 'view' permission on Fees Receipt
    .get(protect, checkPermission('Fees Receipt', 'view'), getStudentFees);

module.exports = router;