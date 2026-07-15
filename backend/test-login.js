const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Staff = require('./models/Staff');
const bcrypt = require('bcryptjs');

dotenv.config();

const runTest = async () => {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dinespot');
        console.log('Connected.');

        const user = await User.findOne({ email: 'john@example.com' });
        if (!user) {
            console.log('Error: User john@example.com not found in database.');
            process.exit(1);
        }

        console.log('User found:', user.email);
        console.log('Stored hashed password:', user.password);

        const match = await user.comparePassword('password123');
        console.log('Password match test for "password123":', match);

        // Test staff
        const staff = await Staff.findOne({ email: 'manager.daspalla@dinespot.com' });
        if (staff) {
            console.log('Staff found:', staff.email);
            console.log('Stored hashed password:', staff.password);
            const staffMatch = await staff.comparePassword('password123');
            console.log('Staff password match test for "password123":', staffMatch);
        } else {
            console.log('Staff manager.daspalla@dinespot.com not found.');
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Test error:', err);
    }
};

runTest();
