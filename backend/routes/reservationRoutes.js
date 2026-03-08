const express = require('express');
const router = express.Router();
const {
    createReservation,
    getUserReservations,
    getRestaurantReservations,
    getReservationsByRestaurant,
    checkIn,
    completeReservation,
    noShowReservation,
    deleteReservation
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createReservation);
router.get('/my', protect, getUserReservations);
router.get('/restaurant', protect, authorize('staff'), getRestaurantReservations);
router.get('/restaurant/:restaurantId', protect, authorize('staff'), getReservationsByRestaurant);
router.post('/checkin', protect, authorize('staff'), checkIn);
router.put('/:id/complete', protect, authorize('staff'), completeReservation);
router.put('/:id/noshow', protect, authorize('staff'), noShowReservation);
router.delete('/:id', protect, deleteReservation);

module.exports = router;
