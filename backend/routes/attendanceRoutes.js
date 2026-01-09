const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
// Permission middleware can be added later if needed
// const { checkPermission } = require('../middlewares/permissionMiddleware');

const { 
    getAttendance, 
    createAttendance, 
    updateAttendance, 
    deleteAttendance 
} = require('../controllers/attendanceController');

router.route('/student')
    .get(protect, getAttendance)
    .post(protect, createAttendance);

router.route('/student/:id')
    .put(protect, updateAttendance)
    .delete(protect, deleteAttendance);

module.exports = router;
