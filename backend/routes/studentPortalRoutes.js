const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getDashboardStats, 
    getCourseDetails, 
    submitFeedback 
} = require('../controllers/studentPortalController');

router.get('/dashboard', protect, getDashboardStats);
router.get('/course', protect, getCourseDetails);
router.post('/feedback', protect, submitFeedback);

module.exports = router;
