const mongoose = require('mongoose');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const Restaurant = require('../models/Restaurant');
const { generateQRCode } = require('../utils/generateQR');
const { sendEmail } = require('../utils/sendEmail');

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

exports.createReservation = async (req, res) => {
    const {
        restaurantId,
        reservationTime,
        guests,
        fullName,
        email,
        phone,
        specialRequests,
        occasion,
        seatingPreference,
        tableId
    } = req.body;

    console.log(`Reservation: New request from ${email} for restaurant ${restaurantId}`);

    try {
        // 1. Validation
        if (!restaurantId || !reservationTime || !guests || !fullName || !email) {
            return res.status(400).json({ message: 'All reservation fields are required' });
        }

        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'Invalid restaurant ID' });
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const resTime = new Date(reservationTime);
        if (isNaN(resTime.getTime())) {
            return res.status(400).json({ message: 'Invalid reservation time' });
        }

        const timeStr = resTime.getHours().toString().padStart(2, '0') + ':' + resTime.getMinutes().toString().padStart(2, '0');
        if (timeStr < restaurant.openingTime || timeStr > restaurant.closingTime) {
            return res.status(400).json({ message: 'Reservation time is outside business hours' });
        }

        // 2. Table Selection
        const endTime = new Date(resTime.getTime() + 2 * 60 * 60 * 1000);
        let selectedTable = null;

        if (tableId) {
            const table = await Table.findById(tableId);
            if (table && table.restaurantId.toString() === restaurantId) {
                if (table.capacity < guests) {
                    return res.status(400).json({ message: 'Selected table capacity is smaller than guest size' });
                }
                const overlapping = await Reservation.findOne({
                    tableId: table._id,
                    status: { $in: ['Confirmed', 'CheckedIn'] },
                    $or: [
                        { reservationTime: { $lt: endTime, $gte: resTime } },
                        {
                            $expr: {
                                $and: [
                                    { $lt: ["$reservationTime", resTime] },
                                    { $gt: [{ $add: ["$reservationTime", 2 * 60 * 60 * 1000] }, resTime] }
                                ]
                            }
                        }
                    ]
                });
                if (!overlapping) {
                    selectedTable = table;
                }
            }
        }

        if (!selectedTable) {
            const tables = await Table.find({ restaurantId, capacity: { $gte: guests } }).sort({ capacity: 1 });
            for (const table of tables) {
                const overlapping = await Reservation.findOne({
                    tableId: table._id,
                    status: { $in: ['Confirmed', 'CheckedIn'] },
                    $or: [
                        { reservationTime: { $lt: endTime, $gte: resTime } },
                        {
                            $expr: {
                                $and: [
                                    { $lt: ["$reservationTime", resTime] },
                                    { $gt: [{ $add: ["$reservationTime", 2 * 60 * 60 * 1000] }, resTime] }
                                ]
                            }
                        }
                    ]
                });
                if (!overlapping) {
                    selectedTable = table;
                    break;
                }
            }
        }

        if (!selectedTable) {
            return res.status(400).json({ message: 'No tables available for the selected time and party size' });
        }

        // 3. QR Code Generation
        const tempResId = new mongoose.Types.ObjectId();
        let qrCode = '';
        try {
            qrCode = await generateQRCode(JSON.stringify({ reservationId: tempResId }));
        } catch (qrErr) {
            console.error('QR Generation Failed:', qrErr);
        }

        // 4. Save Reservation
        const reservation = await Reservation.create({
            _id: tempResId,
            fullName,
            email,
            phone,
            userId: req.user?._id,
            restaurantId,
            tableId: selectedTable._id,
            reservationTime: resTime,
            guests,
            specialRequests,
            occasion,
            seatingPreference,
            status: 'Confirmed',
            qrCode
        });

        console.log(`Reservation: Saved successfully ID: ${reservation._id}`);

        // 5. Upgrade Email Notification
        try {
            // A. Send to Customer (Primary)
            await sendEmail({
                email: email,
                subject: `Your Reservation is Confirmed 🎉 – ${restaurant.name}`,
                message: `
                    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; color: #111827; line-height: 1.5;">
                        <div style="background-color: #111827; padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">DineSpot Reservation Confirmation</h1>
                        </div>
                        
                        <div style="padding: 40px 30px;">
                            <h2 style="font-size: 22px; margin-bottom: 25px; color: #111827;">Hello ${fullName},</h2>
                            <p style="font-size: 16px; margin-bottom: 30px; color: #111827;">Your reservation at <strong>${restaurant.name}</strong> has been successfully secured. We look forward to serving you.</p>
                            
                            <div style="border: 2px solid #f1f5f9; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                            <span style="font-weight: bold; color: #4b5563; font-size: 13px; text-transform: uppercase; display: block; margin-bottom: 4px;">Date & Time:</span>
                                            <span style="color: #f97316; font-size: 18px; font-weight: 800;">${resTime.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                            <span style="font-weight: bold; color: #4b5563; font-size: 13px; text-transform: uppercase; display: block; margin-bottom: 4px;">Party Size:</span>
                                            <span style="color: #111827; font-size: 16px; font-weight: bold;">${guests} Guests</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                            <span style="font-weight: bold; color: #4b5563; font-size: 13px; text-transform: uppercase; display: block; margin-bottom: 4px;">Location:</span>
                                            <span style="color: #111827; font-size: 16px; font-weight: bold;">${restaurant.location}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                                            <span style="font-weight: bold; color: #4b5563; font-size: 13px; text-transform: uppercase; display: block; margin-bottom: 4px;">Occasion:</span>
                                            <span style="color: #111827; font-size: 16px; font-weight: bold;">${occasion || 'Casual Dining'}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="font-weight: bold; color: #4b5563; font-size: 13px; text-transform: uppercase; display: block; margin-bottom: 4px;">Seating:</span>
                                            <span style="color: #111827; font-size: 16px; font-weight: bold;">${seatingPreference || 'Standard'}</span>
                                        </td>
                                    </tr>
                                    ${specialRequests ? `
                                    <tr>
                                        <td style="padding: 20px 0 0 0; border-top: 2px solid #f1f5f9; margin-top: 20px;">
                                            <span style="font-weight: bold; color: #4b5563; font-size: 13px; text-transform: uppercase; display: block; margin-bottom: 8px;">Special Requests:</span>
                                            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; font-style: italic; color: #111827;">"${specialRequests}"</div>
                                        </td>
                                    </tr>
                                    ` : ''}
                                </table>
                            </div>

                            <div style="text-align: center; background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
                                <p style="font-size: 14px; color: #111827; margin: 0; font-weight: bold;">Please present the attached Access QR Code upon arrival.</p>
                                <p style="font-size: 11px; color: #64748b; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px;">Reservation ID: ${tempResId}</p>
                            </div>

                            <div style="border-top: 2px solid #f1f5f9; padding-top: 30px;">
                                <p style="font-size: 13px; color: #111827; margin-bottom: 8px;"><strong>Cancellation Policy:</strong> Free cancellation up to 24 hours before your visit.</p>
                                <p style="font-size: 13px; color: #4b5563;">Need help? Contact us at support@dinespot.com</p>
                            </div>
                        </div>

                        <div style="background-color: #111827; padding: 30px; text-align: center; color: #ffffff; font-size: 12px;">
                            &copy; ${new Date().getFullYear()} DineSpot. All rights reserved.
                        </div>
                    </div>
                `,
                attachments: qrCode ? [{
                    filename: 'dinespot-access-pass.png',
                    content: qrCode.split('base64,')[1],
                    encoding: 'base64'
                }] : []
            });

            // B. Send to Restaurant Staff (Secondary & Isolated)
            try {
                let staffTarget = restaurant.staffEmail;

                if (process.env.NODE_ENV === 'development' || !staffTarget || !validateEmail(staffTarget) || staffTarget.includes('example.com')) {
                    staffTarget = process.env.EMAIL_USER;
                }

                if (staffTarget && validateEmail(staffTarget)) {
                    await sendEmail({
                        email: staffTarget,
                        subject: `New Reservation Received 📥 – ${restaurant.name}`,
                        message: `
                            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 16px; overflow: hidden;">
                                <div style="background-color: #0f172a; padding: 20px; text-align: center;">
                                    <h3 style="color: #ffffff; margin: 0; font-size: 16px; text-transform: uppercase; letter-spacing: 2px;">Manifest Update</h3>
                                </div>
                                <div style="padding: 40px;">
                                    <h2 style="color: #0f172a; font-size: 20px; margin-bottom: 25px;">New Booking Alert</h2>
                                    
                                    <div style="border-left: 4px solid #ea580c; padding-left: 20px; margin-bottom: 30px;">
                                        <p style="margin: 5px 0;"><strong>Guest:</strong> ${fullName}</p>
                                        <p style="margin: 5px 0;"><strong>Time:</strong> ${resTime.toLocaleString()}</p>
                                        <p style="margin: 5px 0;"><strong>Guests:</strong> ${guests}</p>
                                        <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
                                    </div>

                                    <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px;">
                                        <p style="margin: 0; font-size: 12px; color: #64748b;"><strong>Requests:</strong> ${specialRequests || 'None'}</p>
                                        <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;"><strong>Seating:</strong> ${seatingPreference}</p>
                                    </div>
                                    
                                    <p style="font-size: 10px; color: #94a3b8; margin-top: 30px; text-align: center;">
                                        Internal System Notification | ID: ${tempResId}
                                    </p>
                                </div>
                            </div>
                        `
                    });
                }
            } catch (staffEmailErr) {
                console.error('Staff Email Dispatch Error:', staffEmailErr.message);
            }

            console.log('Customer notification sent successfully.');
            return res.status(201).json({
                success: true,
                data: reservation,
                message: 'Reservation secured and premium confirmation dispatched'
            });

        } catch (emailErr) {
            console.error('Customer Email Dispatch Error:', emailErr.message);
            return res.status(201).json({
                success: true,
                data: reservation,
                message: 'Reservation recorded but email delivery failed'
            });
        }
    } catch (err) {
        console.error('Reservation Error:', err.message);
        res.status(500).json({ message: 'Internal server error while processing reservation', error: err.message });
    }
};


exports.getUserReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({
            $or: [
                { userId: req.user._id },
                { email: req.user.email }
            ]
        })
            .populate('restaurantId')
            .populate('tableId')
            .sort({ reservationTime: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRestaurantReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ restaurantId: new mongoose.Types.ObjectId(req.user.restaurantId) })
            .populate('tableId')
            .sort({ reservationTime: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReservationsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const reservations = await Reservation.find({ restaurantId: new mongoose.Types.ObjectId(restaurantId) })
            .populate('tableId')
            .sort({ reservationTime: -1 });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.checkIn = async (req, res) => {
    try {
        const { reservationId } = req.body;
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) return res.status(404).json({ message: 'Target reservation not found' });

        const now = new Date();
        const resTime = new Date(reservation.reservationTime);
        if (now > new Date(resTime.getTime() + 60 * 60 * 1000)) {
            reservation.status = 'NoShow';
            await reservation.save();
            return res.status(400).json({ message: 'Reservation window expired (Max 1 hour past)' });
        }

        reservation.status = 'CheckedIn';
        reservation.checkInTime = now;
        await reservation.save();
        await Table.findByIdAndUpdate(reservation.tableId, { status: 'Occupied' });
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.completeReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Target reservation not found' });

        reservation.status = 'Completed';
        reservation.completionTime = new Date();
        await reservation.save();
        await Table.findByIdAndUpdate(reservation.tableId, { status: 'Available' });
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.noShowReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Target reservation not found' });

        reservation.status = 'NoShow';
        await reservation.save();
        res.json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) return res.status(404).json({ message: 'Reservation not found' });

        const ownerId = reservation.userId?.toString();
        const requesterId = req.user._id?.toString() || req.user.id?.toString();

        if (ownerId !== requesterId && req.user.role !== 'staff') {
            return res.status(401).json({ message: 'Not authorized to cancel this reservation' });
        }

        const isPast = new Date(reservation.reservationTime) < new Date();
        const statusLower = reservation.status?.toLowerCase();

        if (statusLower === 'cancelled') {
            return res.status(400).json({ message: 'Reservation is already cancelled.' });
        }

        if (['completed', 'checkedin', 'noshow'].includes(statusLower)) {
            return res.status(400).json({ message: `Cannot cancel a reservation with status: ${reservation.status}` });
        }

        if (isPast) {
            return res.status(400).json({ message: 'Cannot cancel a reservation after the reservation time has passed.' });
        }

        reservation.status = 'Cancelled';
        await reservation.save();
        res.json({ message: 'Reservation cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
