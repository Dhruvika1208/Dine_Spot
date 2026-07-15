const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginStaff, registerStaff, getMe, toggleFavorite, getFavorites, googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/staff-login', loginStaff);
router.post('/staff-register', registerStaff);
router.get('/me', protect, getMe);
router.post('/favorites/:restaurantId', protect, toggleFavorite);
router.get('/favorites', protect, getFavorites);

module.exports = router;
