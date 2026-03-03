const cron = require('node-cron');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Runs every 15 minutes
cron.schedule('*/15 * * * *', async () => {
    console.log('Running Reservation Cron Job...');
    const now = new Date();

    try {
        // 1. Auto-cancel if not checked-in within 1 hour after reservation time
        const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const expiredReservations = await Reservation.updateMany(
            {
                status: 'Confirmed',
                reservationTime: { $lt: hourAgo }
            },
            { status: 'NoShow' }
        );
        if (expiredReservations.modifiedCount > 0) {
            console.log(`Auto-cancelled ${expiredReservations.modifiedCount} no-show reservations.`);
        }

        // 2. Auto-complete if 2 hours passed since reservation time and status is CheckedIn
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        const reservationsToComplete = await Reservation.find({
            status: 'CheckedIn',
            reservationTime: { $lt: twoHoursAgo }
        });

        for (const res of reservationsToComplete) {
            res.status = 'Completed';
            res.completionTime = now;
            await res.save();
            await Table.findByIdAndUpdate(res.tableId, { status: 'Available' });
        }

        if (reservationsToComplete.length > 0) {
            console.log(`Auto-completed ${reservationsToComplete.length} reservations.`);
        }

    } catch (error) {
        console.error('Cron job error:', error);
    }
});
