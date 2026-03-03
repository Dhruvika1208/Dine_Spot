const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('staff'), getDashboardStats);

module.exports = router;
