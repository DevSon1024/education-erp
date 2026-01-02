const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getUserRights, saveUserRights, getMyRights } = require('../controllers/userRightController');

// All routes protected
router.use(protect);

router.get('/me', getMyRights);
router.get('/:userId', getUserRights);
router.post('/', saveUserRights);

module.exports = router;