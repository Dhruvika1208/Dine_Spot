const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
    reservationTime: { type: Date, required: true },
    guests: { type: Number, required: true },
    specialRequests: { type: String },
    occasion: { type: String },
    seatingPreference: { type: String },
    status: {
        type: String,
        enum: ['Confirmed', 'CheckedIn', 'Completed', 'Cancelled', 'NoShow'],
        default: 'Confirmed'
    },
    qrCode: { type: String },
    checkInTime: { type: Date },
    completionTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);
