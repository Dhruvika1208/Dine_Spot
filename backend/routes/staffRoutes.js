const express = require('express');
const router = express.Router();
const { getDashboardStats, changePassword } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('staff'), getDashboardStats);
router.put('/change-password', protect, authorize('staff'), changePassword);

module.exports = router;
