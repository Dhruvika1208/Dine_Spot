const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Staff = require('../models/Staff');
const Restaurant = require('../models/Restaurant');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');

dotenv.config({ path: path.join(__dirname, '../.env') });

mongoose.connect(process.env.MONGO_URI);

const images = {
    italian: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    steak: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80',
    cafe: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    asian: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    seafood: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    continental: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    vegan: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    mughlai: 'https://images.unsplash.com/photo-1631515233367-289a478acca?auto=format&fit=crop&w=800&q=80',
    french: 'https://images.unsplash.com/photo-1550966841-3ee7adac1668?auto=format&fit=crop&w=800&q=80',
    pasta: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80',
    pub: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    street: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80'
};

const restaurantsData = [
    { name: 'Italian Villa', location: 'Downtown', cuisine: 'Italian', description: 'Experience the soul of Italy with our wood-fired pizzas and artisanal pasta.', openingTime: '11:00', closingTime: '23:00', staffEmail: process.env.EMAIL_USER, image: images.italian, rating: 4.8 },
    { name: 'BBQ House', location: 'Midtown', cuisine: 'Steakhouse', description: 'Slow-smoked perfection and premium cuts of aged beef.', openingTime: '12:00', closingTime: '22:00', staffEmail: process.env.EMAIL_USER, image: images.steak, rating: 4.6 },
    { name: 'Coffee Corner', location: 'Uptown', cuisine: 'Cafe', description: 'Your daily sanctuary for specialty brews and hand-crafted pastries.', openingTime: '08:00', closingTime: '20:00', staffEmail: process.env.EMAIL_USER, image: images.cafe, rating: 4.5 },
    { name: 'Urban Spice', location: 'City Center', cuisine: 'Fusion', description: 'A bold, modern interpretation of diverse Asian culinary traditions.', openingTime: '11:30', closingTime: '23:30', staffEmail: process.env.EMAIL_USER, image: images.asian, rating: 4.7 },
    { name: 'Ocean Grill', location: 'Bayfront', cuisine: 'Seafood', description: 'Pristine seafood caught daily, served with a side of ocean breezes.', openingTime: '12:00', closingTime: '23:00', staffEmail: process.env.EMAIL_USER, image: images.seafood, rating: 4.9 },
    { name: 'Golden Fork', location: 'West End', cuisine: 'Continental', description: 'Sophisticated dining where classic French meets modern European.', openingTime: '18:00', closingTime: '23:00', staffEmail: process.env.EMAIL_USER, image: images.continental, rating: 4.4 },
    { name: 'Spice Symphony', location: 'East Side', cuisine: 'Indian', description: 'A rhythmic blend of traditional spices and contemporary flavors.', openingTime: '12:00', closingTime: '22:30', staffEmail: process.env.EMAIL_USER, image: images.indian, rating: 4.6 },
    { name: 'The Green Bowl', location: 'South Plaza', cuisine: 'Vegan', description: 'Plant-based magic that nourishes the body and the soul.', openingTime: '10:00', closingTime: '21:00', staffEmail: process.env.EMAIL_USER, image: images.vegan, rating: 4.3 },
    { name: 'Royal Tandoor', location: 'Old Town', cuisine: 'Mughlai', description: 'Regal recipes from the royal kitchens of ancient India.', openingTime: '12:30', closingTime: '23:00', staffEmail: process.env.EMAIL_USER, image: images.mughlai, rating: 4.7 },
    { name: 'Sunset Bistro', location: 'Harbor', cuisine: 'French', description: 'Charming riverside dining with romantic French appetizers.', openingTime: '17:00', closingTime: '23:30', staffEmail: process.env.EMAIL_USER, image: images.french, rating: 4.8 },
    { name: 'The Pasta Room', location: 'Little Italy', cuisine: 'Italian', description: 'Hand-rolled pasta made by our nonna every single morning.', openingTime: '11:00', closingTime: '22:00', staffEmail: process.env.EMAIL_USER, image: images.pasta, rating: 4.5 },
    { name: 'Brew Haven', location: 'Industrial Park', cuisine: 'GastroPub', description: 'Where artisanal burgers meet locally crafted micro-brews.', openingTime: '16:00', closingTime: '01:00', staffEmail: process.env.EMAIL_USER, image: images.pub, rating: 4.2 },
    { name: 'Midnight Bites', location: 'Night Market', cuisine: 'Street Food', description: 'The ultimate destination for late-night culinary adventures.', openingTime: '20:00', closingTime: '04:00', staffEmail: process.env.EMAIL_USER, image: images.street, rating: 4.4 }
];


const seedData = async () => {
    try {
        await User.deleteMany();
        await Staff.deleteMany();
        await Restaurant.deleteMany();
        await Table.deleteMany();
        await MenuItem.deleteMany();

        const restaurants = await Restaurant.insertMany(restaurantsData);

        for (const res of restaurants) {
            await Staff.create({
                name: `${res.name} Manager`,
                email: res.staffEmail,
                password: 'password123',
                restaurantId: res._id,
                role: 'staff'
            });

            await Table.insertMany([
                { restaurantId: res._id, tableNumber: '1', capacity: 2, status: 'Available' },
                { restaurantId: res._id, tableNumber: '2', capacity: 4, status: 'Available' },
                { restaurantId: res._id, tableNumber: '3', capacity: 6, status: 'Available' },
                { restaurantId: res._id, tableNumber: '4', capacity: 2, status: 'Available' }
            ]);

            await MenuItem.insertMany([
                { restaurantId: res._id, name: 'Symphony Starter', description: 'A delicate opening to your meal.', price: 14, category: 'Starter', available: true },
                { restaurantId: res._id, name: 'Signature Main', description: 'Our most requested culinary masterpiece.', price: 32, category: 'Main Course', available: true },
                { restaurantId: res._id, name: 'Velvet Finale', description: 'A rich, decadent end to your journey.', price: 12, category: 'Dessert', available: true }
            ]);
        }

        await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
        });

        console.log('Premium Unified Seed Data Created (13 Restaurants with Images).');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();
