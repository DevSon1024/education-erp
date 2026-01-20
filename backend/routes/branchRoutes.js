const express = require('express');
const router = express.Router();
const {
    createBranch,
    getBranches,
    getBranchById,
    updateBranch,
    deleteBranch
} = require('../controllers/branchController');
const { protect, admin } = require('../middlewares/authMiddleware'); // Assuming these exist

// Apply protect middleware to all routes
router.use(protect);

// Apply admin middleware to all routes (Only Super Admin can manage branches)
// If we want read access for others, we might need to adjust this
router.route('/')
    .get(getBranches) // Maybe allow read for others? For now, let's keep it robust.
    .post(admin, createBranch);

router.route('/:id')
    .get(getBranchById)
    .put(admin, updateBranch)
    .delete(admin, deleteBranch);

module.exports = router;
