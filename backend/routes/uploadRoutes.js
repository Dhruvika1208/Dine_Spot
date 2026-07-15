const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/uploadController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('staff'), uploadImage);
router.post('/public', uploadImage);

module.exports = router;
