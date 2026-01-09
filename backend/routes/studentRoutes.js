const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { checkPermission } = require('../middlewares/permissionMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { 
    getStudents, 
    getStudentById,
    createStudent, 
    updateStudent,
    deleteStudent, 
    toggleStudentStatus,
    confirmStudentRegistration // Imported
} = require('../controllers/studentController');

router.route('/')
    .get(protect, checkPermission('Student', 'view'), getStudents)
    .post(protect, checkPermission('Student', 'add'), upload.single('studentPhoto'), createStudent);

router.route('/:id')
    .get(protect, checkPermission('Student', 'view'), getStudentById)
    .put(protect, checkPermission('Student', 'edit'), upload.single('studentPhoto'), updateStudent)
    .delete(protect, checkPermission('Student', 'delete'), deleteStudent);

// Registration Confirmation Route
router.route('/:id/confirm-registration')
    .post(protect, checkPermission('Student', 'edit'), confirmStudentRegistration);

router.route('/:id/toggle')
    .put(protect, checkPermission('Student', 'edit'), toggleStudentStatus);

module.exports = router;