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

        // Sort logic: 1. GVR Signature, 2. China Town RJ, 3. Other Rajahmundry, 4. Remaining cities
        const getPriorityScore = (resObj) => {
            const name = (resObj.name || '').toLowerCase();
            const loc = (resObj.location || '').toLowerCase();
            const desc = (resObj.description || '').toLowerCase();
            const text = `${name} ${loc} ${desc}`;

            // #1: GVR Signature
            if (name.includes('gvr signature') || name.includes('gvr')) {
                return 1;
            }

            // #2: China Town RJ
            if (name.includes('china town') || name.includes('chinatown')) {
                return 2;
            }

            // #3: Other Rajahmundry restaurants
            if (text.includes('rajahmundry') || text.includes('rajamahendravaram') || text.includes('rjy')) {
                return 3;
            }

            // #4: Other cities
            return 4;
        };

        restaurants.sort((a, b) => {
            const scoreA = getPriorityScore(a);
            const scoreB = getPriorityScore(b);

            if (scoreA !== scoreB) {
                return scoreA - scoreB;
            }

            // 2. City order prioritization for remaining spots (score 4)
            const cityOrder = ['kakinada', 'amalapuram', 'visakhapatnam', 'vijayawada', 'guntur', 'tirupati', 'hyderabad', 'bangalore', 'chennai'];
            const findCityIndex = (loc) => cityOrder.findIndex(c => (loc || '').toLowerCase().includes(c));

            const idxA = findCityIndex(a.location);
            const idxB = findCityIndex(b.location);

            if (idxA !== -1 && idxB !== -1) {
                if (idxA !== idxB) return idxA - idxB;
            } else if (idxA !== -1) {
                return -1;
            } else if (idxB !== -1) {
                return 1;
            }

            // 3. Higher rating first
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            if (ratingB !== ratingA) {
                return ratingB - ratingA;
            }

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
