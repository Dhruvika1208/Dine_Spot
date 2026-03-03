const mongoose = require('mongoose');

const menuItemSchema = mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true }, // e.g., Starter, Main, Dessert
        image: { type: String },
        available: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
