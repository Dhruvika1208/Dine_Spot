const axios = require('axios');
const Restaurant = require('../models/Restaurant');

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const CITIES = ['Visakhapatnam', 'Vijayawada', 'Tirupati', 'Guntur', 'Rajahmundry'];

/**
 * Fetches restaurants from Google Places API for specified cities in Andhra Pradesh
 */
exports.fetchAndStoreRestaurants = async () => {
    if (!GOOGLE_API_KEY) {
        console.warn('GOOGLE_PLACES_API_KEY not found in .env. Falling back to simulated API response for demo.');
    }

    let allSaved = [];

    for (const city of CITIES) {
        try {
            let restaurants = [];

            if (GOOGLE_API_KEY) {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${city}&key=${GOOGLE_API_KEY}`
                );
                
                if (response.data.results) {
                    restaurants = response.data.results.map(place => ({
                        name: place.name,
                        location: place.formatted_address,
                        rating: place.rating || 4.0,
                        image: place.photos 
                            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
                            : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
                        cuisine: 'Multi-Cuisine', // Google Places doesn't return cuisine directly in basic search
                        openingHours: place.opening_hours ? (place.opening_hours.open_now ? 'Open Now' : 'Closed') : '10:00 - 22:00',
                        email: `info@${place.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
                        staffEmail: `staff@${place.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
                    }));
                }
            } else {
                // Simulated API Response if no key provided
                restaurants = [
                    {
                        name: `${city} Heritage Kitchen`,
                        location: `Main Road, ${city}, Andhra Pradesh`,
                        rating: 4.5,
                        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
                        cuisine: 'South Indian Authentic',
                        openingHours: '09:00 - 22:00',
                        email: `contact@${city.toLowerCase()}heritage.com`,
                        staffEmail: `staff@${city.toLowerCase()}heritage.com`
                    },
                    {
                        name: `${city} Spice Route`,
                        location: `Gachibowli Area, ${city}, Andhra Pradesh`,
                        rating: 4.2,
                        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&q=80',
                        cuisine: 'Andhra Spicy, Biryani',
                        openingHours: '11:00 - 23:00',
                        email: `info@${city.toLowerCase()}spice.com`,
                        staffEmail: `staff@${city.toLowerCase()}spice.com`
                    }
                ];
            }

            for (const r of restaurants) {
                const existing = await Restaurant.findOne({ name: r.name, location: r.location });
                if (!existing) {
                    const saved = await Restaurant.create(r);
                    allSaved.push(saved);
                }
            }

        } catch (error) {
            console.error(`Error fetching restaurants for ${city}:`, error.message);
        }
    }

    return allSaved;
};
