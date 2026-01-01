const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getCourses, createCourse, deleteCourse,
    getBatches, createBatch, deleteBatch, createEmployee, getEmployees,
    getSubjects, createSubject
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

// Employee Routes (For Dropdown)
router.route('/employee')
    .get(protect, getEmployees)
    .post(protect, createEmployee);

// Subject Routes
router.route('/subject')
    .get(protect, getSubjects)
    .post(protect, createSubject);
    
module.exports = router;