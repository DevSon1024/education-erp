const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getCourses, createCourse, deleteCourse,
    getBatches, createBatch, deleteBatch
} = require('../controllers/masterController');

// Course Routes
router.route('/course')
    .get(protect, getCourses)
    .post(protect, createCourse);
router.delete('/course/:id', protect, deleteCourse);

// Batch Routes
router.route('/batch')
    .get(protect, getBatches)
    .post(protect, createBatch);
router.delete('/batch/:id', protect, deleteBatch);

module.exports = router;