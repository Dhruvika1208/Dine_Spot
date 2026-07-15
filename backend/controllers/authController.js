const User = require('../models/User');
const Staff = require('../models/Staff');
const Restaurant = require('../models/Restaurant');
const jwt = require('jsonwebtoken');
const axios = require('axios');

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
        const normalizedEmail = email ? email.toLowerCase().trim() : '';
        const staff = await Staff.findOne({ email: normalizedEmail }).populate('restaurantId');
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

exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: 'Google credential token is required' });
        }

        // Verify the ID token using Google API
        const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        const payload = googleRes.data;

        if (!payload || !payload.email) {
            return res.status(400).json({ message: 'Invalid Google token' });
        }

        const { name, email, picture } = payload;

        // Find or create user
        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            // Generate a random password since they login via Google
            const randomPassword = Math.random().toString(36).slice(-10) + 'A1!';
            user = await User.create({
                name,
                email: email.toLowerCase().trim(),
                password: randomPassword,
                image: picture
            });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: 'user',
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Google Auth Error:', error.message);
        res.status(500).json({ message: 'Google authentication failed', error: error.message });
    }
};

exports.registerStaff = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            isNewRestaurant,
            restaurantId,
            restaurantName,
            location,
            cuisine,
            phoneNumber,
            openingTime,
            closingTime,
            image,
            gallery
        } = req.body;

        const normalizedEmail = email ? email.toLowerCase().trim() : '';

        // Check if staff already exists
        const staffExists = await Staff.findOne({ email: normalizedEmail });
        if (staffExists) return res.status(400).json({ message: 'Staff email already registered' });

        let finalRestaurantId = restaurantId;

        // If registering a new restaurant, create it first
        if (isNewRestaurant) {
            if (!restaurantName || !location || !cuisine) {
                return res.status(400).json({ message: 'Required restaurant fields are missing' });
            }
            const restaurant = await Restaurant.create({
                name: restaurantName,
                location,
                cuisine,
                openingTime: openingTime || '09:00',
                closingTime: closingTime || '22:00',
                staffEmail: normalizedEmail,
                phoneNumber: phoneNumber || '',
                image: image || '',
                gallery: gallery || [],
                isManuallyAdded: true
            });
            finalRestaurantId = restaurant._id;
        }

        if (!finalRestaurantId) {
            return res.status(400).json({ message: 'A valid restaurant is required' });
        }

        // Create the staff member
        const staff = await Staff.create({
            name,
            email: normalizedEmail,
            password,
            restaurantId: finalRestaurantId
        });

        const token = generateToken(staff._id);

        res.status(201).json({
            token,
            role: 'staff',
            restaurantId: finalRestaurantId,
            staff: {
                _id: staff._id,
                name: staff.name,
                email: staff.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
