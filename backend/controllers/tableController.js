const Table = require('../models/Table');

exports.addTable = async (req, res) => {
    try {
        const { tableNumber, capacity } = req.body;
        const table = await Table.create({
            restaurantId: req.user.restaurantId,
            tableNumber,
            capacity
        });
        res.status(201).json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(table);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTable = async (req, res) => {
    try {
        await Table.findByIdAndDelete(req.params.id);
        res.json({ message: 'Table removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRestaurantTables = async (req, res) => {
    try {
        const tables = await Table.find({ restaurantId: req.user.restaurantId });
        res.json(tables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
