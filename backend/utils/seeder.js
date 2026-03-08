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
    indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    mexican: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    japanese: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    french: 'https://images.unsplash.com/photo-1525193612562-0ec53b0e5d7c?auto=format&fit=crop&w=800&q=60',
    thai: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    chinese: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    mediterranean: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=800&q=80',
    american: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
    korean: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80'
};

const restaurantsData = [
    {
        name: 'The Italian Villa',
        location: 'Downtown Core',
        cuisine: 'Italian',
        description: 'Authentic wood-fired pizzas and homemade pasta since 1985.',
        openingTime: '11:00',
        closingTime: '23:00',
        staffEmail: 'manager@italianvilla.com',
        image: images.italian,
        rating: 4.8
    },
    {
        name: 'Royal India',
        location: 'West End',
        cuisine: 'Indian',
        description: 'Experience the rich tapestry of Indian spices in a regal setting.',
        openingTime: '12:00',
        closingTime: '22:30',
        staffEmail: 'manager@royalindia.com',
        image: images.indian,
        rating: 4.7
    },
    {
        name: 'Dragon Palace',
        location: 'Chinatown',
        cuisine: 'Chinese',
        description: 'Tradition meets modernity with our award-winning dim sum and peking duck.',
        openingTime: '10:00',
        closingTime: '22:00',
        staffEmail: 'manager@dragonpalace.com',
        image: images.chinese,
        rating: 4.6
    },
    {
        name: 'El Mariachi',
        location: 'Old Town',
        cuisine: 'Mexican',
        description: 'Spirited Mexican dining with hand-pressed tortillas and elite tequilas.',
        openingTime: '11:00',
        closingTime: '00:00',
        staffEmail: 'manager@elmariachi.com',
        image: images.mexican,
        rating: 4.5
    },
    {
        name: 'Sushi Zen',
        location: 'Harbor District',
        cuisine: 'Japanese',
        description: 'Minimalist Japanese dining focusing on the pristine quality of seasonal fish.',
        openingTime: '12:00',
        closingTime: '22:00',
        staffEmail: 'manager@sushizen.com',
        image: images.japanese,
        rating: 4.9
    },
    {
        name: 'Olive Grove',
        location: 'Bayside',
        cuisine: 'Mediterranean',
        description: 'Fresh, sun-drenched flavors from the coasts of Greece and Italy.',
        openingTime: '11:00',
        closingTime: '23:00',
        staffEmail: 'manager@olivegrove.com',
        image: images.mediterranean,
        rating: 4.6
    },
    {
        name: 'Siam Garden',
        location: 'Parkside',
        cuisine: 'Thai',
        description: 'Harmonious Thai cuisine balancing sweet, sour, salty, and spicy notes.',
        openingTime: '11:30',
        closingTime: '22:30',
        staffEmail: 'manager@siamgarden.com',
        image: images.thai,
        rating: 4.7
    },
    {
        name: 'The Burger Lab',
        location: 'Tech Hub',
        cuisine: 'American',
        description: 'Gourmet sliders and craft shakes in a modern, upbeat environment.',
        openingTime: '11:00',
        closingTime: '23:00',
        staffEmail: 'manager@burgerlab.com',
        image: images.american,
        rating: 4.4
    },
    {
        name: 'Le Bistro Lumier',
        location: 'Museum District',
        cuisine: 'French',
        description: 'Intimate French dining with classic techniques and local ingredients.',
        openingTime: '17:00',
        closingTime: '23:00',
        staffEmail: 'manager@bistrolumier.com',
        image: images.french,
        rating: 4.8
    },
    {
        name: 'Seoul BBQ',
        location: 'Koreatown',
        cuisine: 'Korean',
        description: 'Interactive tabletop grilling with premium meats and traditional banchan.',
        openingTime: '12:00',
        closingTime: '01:00',
        staffEmail: 'manager@seoulbbq.com',
        image: images.korean,
        rating: 4.7
    },
    {
        name: 'Steak & Co',
        location: 'Financial District',
        cuisine: 'Steakhouse',
        description: 'Dry-aged prime cuts served in a sophisticated mahogany-clad dining room.',
        openingTime: '12:00',
        closingTime: '23:00',
        staffEmail: 'manager@steakco.com',
        image: images.steak,
        rating: 4.7
    },
    {
        name: 'Ocean Pearl',
        location: 'Marina',
        cuisine: 'Seafood',
        description: 'The finest catch from local waters, served with ocean views.',
        openingTime: '12:00',
        closingTime: '22:00',
        staffEmail: 'manager@oceanpearl.com',
        image: images.seafood,
        rating: 4.9
    },
    {
        name: 'The Urban Cafe',
        location: 'Uptown',
        cuisine: 'Cafe',
        description: 'Artisanal coffee and healthy brunch options for urban explorers.',
        openingTime: '07:00',
        closingTime: '18:00',
        staffEmail: 'manager@urbancafe.com',
        image: images.cafe,
        rating: 4.5
    },
    {
        name: 'Spice Route',
        location: 'Silk Road Plaza',
        cuisine: 'Fusion',
        description: 'A bold fusion of Asian and Middle Eastern flavor profiles.',
        openingTime: '11:30',
        closingTime: '23:00',
        staffEmail: 'manager@spiceroute.com',
        image: images.asian,
        rating: 4.6
    },
    {
        name: 'Venice Bistro',
        location: 'Canal Side',
        cuisine: 'Italian',
        description: 'Venetian-style tapas and sparkling Italian wines.',
        openingTime: '12:00',
        closingTime: '00:00',
        staffEmail: 'manager@venicebistro.com',
        image: images.italian,
        rating: 4.7
    }
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
                {
                    restaurantId: res._id,
                    name: 'Signature Starter',
                    description: 'Chef special starter',
                    price: 14,
                    category: 'Starter',
                    available: true
                },
                {
                    restaurantId: res._id,
                    name: 'Signature Main',
                    description: 'Most popular dish',
                    price: 30,
                    category: 'Main Course',
                    available: true
                }
            ]);
        }

        await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
        });

        console.log('Seed data created successfully with 15 curated restaurants');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedData();