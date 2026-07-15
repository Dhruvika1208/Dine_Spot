const mongoose = require('mongoose');

const tableSchema = mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        tableNumber: { type: String, required: true },
        capacity: { type: Number, required: true },
        status: { type: String, enum: ['Available', 'Reserved', 'Occupied'], default: 'Available' },
        viewType: { type: String, default: 'Indoor' },
        preference: { type: String, default: 'None' },
        description: { type: String, default: '' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Table', tableSchema);
