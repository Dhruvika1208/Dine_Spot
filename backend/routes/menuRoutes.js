const express = require('express');
const router = express.Router();
const {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getRestaurantMenu
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/authMiddleware');

// User Fetch: Based on specific restaurant ID
router.get('/restaurant/:restaurantId', getRestaurantMenu);

// Staff Fetch: Fetch their own restaurant menu
router.get('/my', protect, authorize('staff'), getRestaurantMenu);

// CRUD operations for staff
router.post('/', protect, authorize('staff'), addMenuItem);
router.put('/:id', protect, authorize('staff'), updateMenuItem);
router.delete('/:id', protect, authorize('staff'), deleteMenuItem);

module.exports = router;
