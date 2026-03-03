const MenuItem = require('../models/MenuItem');

exports.addMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, image, available } = req.body;

        console.log(`Menu Logic: Adding item to Restaurant: ${req.user.restaurantId}`);

        const menuItem = await MenuItem.create({
            restaurantId: req.user.restaurantId,
            name,
            description,
            price: Number(price),
            category,
            image,
            available: available !== undefined ? available : true
        });

        console.log(`Menu Logic: Item ADDED. ID: ${menuItem._id}`);
        res.status(201).json(menuItem);
    } catch (error) {
        console.error('Menu Logic: Item creation failed:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!menuItem) return res.status(404).json({ message: 'Target item not found' });

        console.log(`Menu Logic: Item UPDATED. ID: ${menuItem._id}`);
        res.json(menuItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
        if (!menuItem) return res.status(404).json({ message: 'Target item not found' });

        console.log(`Menu Logic: Item DELETED. ID: ${req.params.id}`);
        res.json({ message: 'Culinary entry removed successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRestaurantMenu = async (req, res) => {
    try {
        // Handle BOTH staff fetching their own AND user fetching a restaurant's
        const rId = req.params.restaurantId || req.user?.restaurantId;

        if (!rId) return res.status(400).json({ message: 'Invalid restaurant association' });

        console.log(`Menu Logic: Fetching catalog for Restaurant: ${rId}`);

        const menu = await MenuItem.find({ restaurantId: rId });
        res.json(menu);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
