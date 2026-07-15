const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    cuisine: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    openingTime: { type: String, required: true }, // HH:mm
    closingTime: { type: String, required: true }, // HH:mm
    staffEmail: { type: String, required: true }, // For notification alerts
    rating: { type: Number, default: 4.5 },
    highlightMessage: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    gallery: [{ type: String }],
    galleryImages: [{ type: String }],
    latitude: { type: Number },
    longitude: { type: Number },
    googleMapsUrl: { type: String },
    isAvailable: { type: Boolean, default: true },
    isManuallyAdded: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
