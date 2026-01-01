const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getInquiries, createInquiry, updateInquiryStatus,
    createFeeReceipt, getStudentFees 
} = require('../controllers/transactionController');

// Inquiry
router.route('/inquiry').get(protect, getInquiries).post(protect, createInquiry);
router.route('/inquiry/:id').put(protect, updateInquiryStatus);

// Fees
router.route('/fees').post(protect, createFeeReceipt);
router.route('/fees/:studentId').get(protect, getStudentFees);

module.exports = router;