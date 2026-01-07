const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const { 
    getCourses, createCourse, deleteCourse,
    getBatches, createBatch, deleteBatch, 
    createEmployee, getEmployees,
    getSubjects, createSubject, updateSubject, deleteSubject
} = require('../controllers/masterController');
const { getExamRequests, cancelExamRequest, createExamRequest, getPendingExams } = require('../controllers/examController');
const { getExamSchedules, createExamSchedule, updateExamSchedule, deleteExamSchedule, getExamScheduleDetails } = require('../controllers/examScheduleController');
const { getExamResults, createExamResult, updateExamResult } = require('../controllers/examResultController');

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

router.route('/subject/:id')
    .put(protect, checkPermission('Subject', 'edit'), updateSubject)
    .delete(protect, checkPermission('Subject', 'delete'), deleteSubject);

// --- Employee Routes ---
router.route('/employee')
    .get(protect, checkPermission('Employee', 'view'), getEmployees)
    .post(protect, checkPermission('Employee', 'add'), createEmployee);
    
// --- Exam Request Routes ---
router.route('/exam-request')
    .get(protect, getExamRequests)
    .post(protect, createExamRequest);

router.put('/exam-request/:id/cancel', protect, cancelExamRequest);
router.get('/exam-pending', protect, getPendingExams);

// --- Exam Schedule Routes ---
router.route('/exam-schedule')
    .get(protect, getExamSchedules)
    .post(protect, createExamSchedule);

router.route('/exam-schedule/:id')
    .put(protect, updateExamSchedule)
    .delete(protect, deleteExamSchedule);

router.get('/exam-schedule/:id/details', protect, getExamScheduleDetails);

// --- Exam Results ---
router.route('/exam-result')
    .get(protect, getExamResults) 
    .post(protect, createExamResult); 

module.exports = router;