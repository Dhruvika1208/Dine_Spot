const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginStaff, getMe, toggleFavorite, getFavorites } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/staff-login', loginStaff);
router.get('/me', protect, getMe);
router.post('/favorites/:restaurantId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

module.exports = router;
