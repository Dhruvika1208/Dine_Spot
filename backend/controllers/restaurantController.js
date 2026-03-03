const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');

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

exports.createRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.create(req.body);
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
