const express = require('express');
const router = express.Router();
const { getRestaurants, getRestaurantById, getMyRestaurant, getAvailableTables, createRestaurant, updateRestaurant } = require('../controllers/restaurantController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getRestaurants);
router.get('/my', protect, authorize('staff'), getMyRestaurant);
router.get('/:id', getRestaurantById);
router.get('/:id/available-tables', getAvailableTables);
router.post('/', protect, authorize('staff'), createRestaurant);
router.put('/:id', protect, authorize('staff'), updateRestaurant);

module.exports = router;
