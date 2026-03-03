const User = require('../models/User');
const Staff = require('../models/Staff');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Customer Auth
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, password });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: 'user',
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: 'user',
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Staff Auth
exports.loginStaff = async (req, res) => {
    try {
        const { email, password } = req.body;
        const staff = await Staff.findOne({ email }).populate('restaurantId');
        if (staff && (await staff.comparePassword(password))) {
            const token = generateToken(staff._id);
            res.json({
                token,
                role: 'staff',
                restaurantId: staff.restaurantId?._id || null,
                staff: {
                    _id: staff._id,
                    name: staff.name,
                    email: staff.email
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid staff credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        let user = await User.findById(req.user._id);
        if (!user) user = await Staff.findById(req.user._id).populate('restaurantId');

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.favorites.indexOf(req.params.restaurantId);
        if (index > -1) {
            user.favorites.splice(index, 1);
        } else {
            user.favorites.push(req.params.restaurantId);
        }
        await user.save();
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
