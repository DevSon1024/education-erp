const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { 
    getCourses, createCourse, deleteCourse,
    getBatches, createBatch, deleteBatch, 
    createEmployee, getEmployees,
    getSubjects, createSubject
} = require('../controllers/masterController');

// --- Course Routes ---
router.route('/course')
    .get(protect, checkPermission('Course', 'view'), getCourses)
    .post(protect, checkPermission('Course', 'add'), createCourse);
router.delete('/course/:id', protect, checkPermission('Course', 'delete'), deleteCourse);

// --- Batch Routes ---
router.route('/batch')
    .get(protect, checkPermission('Batch', 'view'), getBatches)
    .post(protect, checkPermission('Batch', 'add'), createBatch);
router.delete('/batch/:id', protect, checkPermission('Batch', 'delete'), deleteBatch);

// --- Subject Routes ---
router.route('/subject')
    .get(protect, checkPermission('Subject', 'view'), getSubjects)
    .post(protect, checkPermission('Subject', 'add'), createSubject);

// --- Employee Routes (Dropdown Support) ---
// Note: We use 'Employee' page permissions here to maintain consistency.
router.route('/employee')
    .get(protect, checkPermission('Employee', 'view'), getEmployees)
    .post(protect, checkPermission('Employee', 'add'), createEmployee);
    
module.exports = router;