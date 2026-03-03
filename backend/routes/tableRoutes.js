const express = require('express');
const router = express.Router();
const {
    addTable,
    updateTable,
    deleteTable,
    getRestaurantTables
} = require('../controllers/tableController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('staff'), getRestaurantTables);
router.post('/', protect, authorize('staff'), addTable);
router.put('/:id', protect, authorize('staff'), updateTable);
router.delete('/:id', protect, authorize('staff'), deleteTable);

module.exports = router;
