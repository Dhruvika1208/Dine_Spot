const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, createRestaurant, updateRestaurant } = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', protect, authorize('staff'), createRestaurant);
router.put('/:id', protect, authorize('staff'), updateRestaurant);

module.exports = router;
