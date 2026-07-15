const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const run = async () => {
    try {
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/dinespot';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('Connected.');

        const db = mongoose.connection.db;
        
        const collections = await db.listCollections().toArray();
        console.log('Collections in database:', collections.map(c => c.name));

        const counts = {};
        for (const col of collections) {
            counts[col.name] = await db.collection(col.name).countDocuments({});
        }
        console.log('Document counts:', counts);

        // Print staff list
        if (counts['staffs']) {
            const staffs = await db.collection('staffs').find({}).toArray();
            console.log('Staff Accounts:', staffs.map(s => ({ name: s.name, email: s.email, restaurantId: s.restaurantId })));
        }
        
        // Print restaurant list
        if (counts['restaurants']) {
            const restaurants = await db.collection('restaurants').find({}).toArray();
            console.log('Restaurants:', restaurants.map(r => ({ id: r._id, name: r.name, email: r.email, staffEmail: r.staffEmail })));
        }

        // Print users list
        if (counts['users']) {
            const users = await db.collection('users').find({}).toArray();
            console.log('User Accounts:', users.map(u => ({ name: u.name, email: u.email })));
        }

        mongoose.connection.close();
    } catch (err) {
        console.error('Inspection error:', err);
    }
};

run();
