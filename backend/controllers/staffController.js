const Reservation = require('../models/Reservation');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');
const mongoose = require('mongoose');

// Business Rule: Revenue is calculated as $40 per guest for completed reservations
const REVENUE_PER_GUEST = 40;

exports.getDashboardStats = async (req, res) => {
    try {
        const restaurantId = req.user.restaurantId;
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        console.log(`Staff Stats: Calculating for Restaurant: ${restaurantId}`);

        const stats = await Reservation.aggregate([
            { $match: { restaurantId: new mongoose.Types.ObjectId(restaurantId) } },
            {
                $facet: {
                    today: [
                        { $match: { reservationTime: { $gte: startOfToday, $lte: endOfToday } } },
                        { $count: "count" }
                    ],
                    upcoming: [
                        { $match: { reservationTime: { $gt: now }, status: 'Confirmed' } },
                        { $count: "count" }
                    ],
                    noShow: [
                        { $match: { status: 'NoShow' } },
                        { $count: "count" }
                    ],
                    revenue: [
                        { $match: { status: 'Completed' } },
                        { $group: { _id: null, total: { $sum: { $multiply: ["$guests", REVENUE_PER_GUEST] } } } }
                    ],
                    chartData: [
                        { $sort: { reservationTime: -1 } },
                        { $limit: 100 },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$reservationTime" } },
                                count: { $sum: 1 }
                            }
                        },
                        { $sort: { _id: 1 } },
                        { $limit: 7 }
                    ]
                }
            }
        ]);

        const todayReservations = await Reservation.find({
            restaurantId: new mongoose.Types.ObjectId(restaurantId),
            reservationTime: { $gte: startOfToday, $lte: endOfToday }
        }).populate('userId', 'name').sort({ reservationTime: 1 });

        const result = stats[0];

        const finalStats = {
            totalToday: result.today[0]?.count || 0,
            upcoming: result.upcoming[0]?.count || 0,
            noShows: result.noShow[0]?.count || 0,
            revenue: result.revenue[0]?.total || 0
        };

        console.log(`Staff Stats: Calculation COMPLETE. Revenue: $${finalStats.revenue}`);

        res.json({
            todayReservations,
            stats: finalStats,
            chartData: result.chartData.map(item => ({
                date: new Date(item._id).toLocaleDateString('en-US', { weekday: 'short' }),
                rawDate: item._id,
                count: item.count
            }))
        });
    } catch (error) {
        console.error('Staff Stats: CRITICAL ERROR IN AGGREGATION:', error.message);
        res.status(500).json({ message: 'Internal server error during analysis generation.', error: error.message });
    }
};
