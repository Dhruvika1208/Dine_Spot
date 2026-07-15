const Table = require('../models/Table');
const Reservation = require('../models/Reservation');

/**
 * Synchronizes all table statuses in MongoDB based on active reservations.
 * - booking created: table remains 'Available'
 * - 30 mins before reservation: table becomes 'Reserved'
 * - QR check-in: table becomes 'Occupied'
 * - no-show/completed/cancelled: table becomes 'Available'
 */
const syncTableStatuses = async () => {
    try {
        const now = new Date();

        // Retrieve all tables in the system
        const tables = await Table.find({});

        for (const table of tables) {
            // Rule 1: QR check-in -> table is Occupied (active for up to 2 hours)
            const activeOccupied = await Reservation.findOne({
                tableId: table._id,
                status: 'CheckedIn',
                reservationTime: { $gte: new Date(now.getTime() - 2 * 60 * 60 * 1000) }
            });

            if (activeOccupied) {
                if (table.status !== 'Occupied') {
                    table.status = 'Occupied';
                    await table.save();
                }
                continue;
            }

            // Rule 2: 30 minutes before reservation -> table is Reserved
            // (reservationTime between now - 1 hour and now + 30 mins)
            const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000);
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

            const activeReserved = await Reservation.findOne({
                tableId: table._id,
                status: 'Confirmed',
                reservationTime: { $gte: oneHourAgo, $lte: thirtyMinsFromNow }
            });

            if (activeReserved) {
                if (table.status !== 'Reserved') {
                    table.status = 'Reserved';
                    await table.save();
                }
                continue;
            }

            // Rule 3: No-show, completed, cancelled, or future booking -> table is Available
            if (table.status !== 'Available') {
                table.status = 'Available';
                await table.save();
            }
        }
    } catch (error) {
        console.error('Error syncing table statuses:', error);
    }
};

module.exports = { syncTableStatuses };
