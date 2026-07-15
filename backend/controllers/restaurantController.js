const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');
const Reservation = require('../models/Reservation');

exports.getRestaurants = async (req, res) => {
    try {
        const { location, cuisine, search } = req.query;
        let query = {};

        if (location) query.location = new RegExp(location, 'i');
        if (cuisine) query.cuisine = new RegExp(cuisine, 'i');
        if (search) {
            query.$or = [
                { name: new RegExp(search, 'i') },
                { location: new RegExp(search, 'i') },
                { cuisine: new RegExp(search, 'i') }
            ];
        }

        const restaurants = await Restaurant.find(query);

        // Sort logic: seeded sorted by specific city list, manually added at end sorted by createdAt ascending
        const cityOrder = ['Rajahmundry', 'Kakinada', 'Amalapuram', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Tirupati', 'Hyderabad', 'Bangalore', 'Chennai'];
        
        restaurants.sort((a, b) => {
            // Manually added ones are placed at the end
            if (a.isManuallyAdded && !b.isManuallyAdded) return 1;
            if (!a.isManuallyAdded && b.isManuallyAdded) return -1;
            
            if (a.isManuallyAdded && b.isManuallyAdded) {
                // Both are manually added, sort by createdAt ascending
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
            
            // Both are seeded (not manually added)
            const cityA = a.location ? a.location.trim().toLowerCase() : '';
            const cityB = b.location ? b.location.trim().toLowerCase() : '';
            
            const indexA = cityOrder.findIndex(c => c.toLowerCase() === cityA);
            const indexB = cityOrder.findIndex(c => c.toLowerCase() === cityB);
            
            if (indexA !== -1 && indexB !== -1) {
                if (indexA !== indexB) {
                    return indexA - indexB;
                }
            } else if (indexA !== -1) {
                return -1;
            } else if (indexB !== -1) {
                return 1;
            }
            
            // Fallback to name comparison
            return (a.name || '').localeCompare(b.name || '');
        });

        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        const menu = await MenuItem.find({ restaurantId: req.params.id });
        const tables = await Table.find({ restaurantId: req.params.id });

        res.json({ restaurant, menu, tables });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.user.restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.create({ ...req.body, isManuallyAdded: true });
        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAvailableTables = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, time, guests, preference, reservationTime } = req.query;

        let resTime;
        if (reservationTime) {
            resTime = new Date(reservationTime);
        } else if (date && time) {
            resTime = new Date(`${date}T${time}`);
        } else {
            return res.status(400).json({ message: 'Reservation date and time are required' });
        }

        if (isNaN(resTime.getTime())) {
            return res.status(400).json({ message: 'Invalid reservation time' });
        }

        const endTime = new Date(resTime.getTime() + 2 * 60 * 60 * 1000);

        let tableQuery = { restaurantId: id };
        if (guests) {
            tableQuery.capacity = { $gte: Number(guests) };
        }

        const allTables = await Table.find(tableQuery);
        const availableTables = [];

        for (const table of allTables) {
            if (preference && preference !== 'None' && preference !== '') {
                const pLower = preference.toLowerCase();
                const tablePref = (table.preference || '').toLowerCase();
                const tableView = (table.viewType || '').toLowerCase();
                
                if (!tablePref.includes(pLower) && !tableView.includes(pLower)) {
                    continue;
                }
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
                availableTables.push(table);
            }
        }

        res.json(availableTables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
