const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');
const Restaurant = require('../models/Restaurant');
const { generateMenuForRestaurant } = require('../utils/menuGenerator');

// Verify backend is loading dotenv correctly
console.log('DEBUG: [Dotenv Verification] Starting require("dotenv").config()...');
const dotenvResult = require('dotenv').config({ path: path.join(__dirname, '../.env') });
if (dotenvResult.error) {
    console.error('DEBUG: [Dotenv Verification] ERROR: Failed to load .env file:', dotenvResult.error.message);
} else {
    console.log('DEBUG: [Dotenv Verification] SUCCESS: .env file loaded successfully.');
    console.log('DEBUG: [Dotenv Verification] Parsed keys:', Object.keys(dotenvResult.parsed || {}));
}
console.log('DEBUG: [Dotenv Verification] process.env.PORT =', process.env.PORT);
console.log('DEBUG: [Dotenv Verification] process.env.GOOGLE_PLACES_API_KEY =', process.env.GOOGLE_PLACES_API_KEY);

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dinespot';
const CITIES = ['Vijayawada', 'Visakhapatnam', 'Guntur', 'Tirupati', 'Rajahmundry'];

// High quality fallback images from Unsplash to ensure no repetition if Google doesn't return photos
const fallbackImages = [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&w=800&q=80'
];

/**
 * Infers cuisine based on restaurant name keywords
 */
function inferCuisine(name) {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('biryani') || lowerName.includes('mandi') || lowerName.includes('kabab') || lowerName.includes('kebab')) {
        return 'Biryani';
    }
    if (lowerName.includes('pizza') || lowerName.includes('pasta') || lowerName.includes('italian') || lowerName.includes('pizzeria')) {
        return 'Italian';
    }
    if (lowerName.includes('chinese') || lowerName.includes('noodles') || lowerName.includes('wok') || lowerName.includes('nanking')) {
        return 'Chinese';
    }
    if (lowerName.includes('south indian') || lowerName.includes('dosa') || lowerName.includes('idli') || lowerName.includes('tiffin') || lowerName.includes('woodlands') || lowerName.includes('bhimas')) {
        return 'South Indian';
    }
    if (lowerName.includes('north indian') || lowerName.includes('tadka') || lowerName.includes('dhaba') || lowerName.includes('punjabi') || lowerName.includes('tandoor')) {
        return 'North Indian';
    }
    if (lowerName.includes('burger') || lowerName.includes('cafe') || lowerName.includes('coffee') || lowerName.includes('bakery') || lowerName.includes('bites') || lowerName.includes('brew')) {
        return 'Cafe';
    }
    if (lowerName.includes('seafood') || lowerName.includes('fish') || lowerName.includes('crab') || lowerName.includes('harbour') || lowerName.includes('wharf')) {
        return 'Seafood';
    }
    if (lowerName.includes('barbeque') || lowerName.includes('bbq') || lowerName.includes('grill') || lowerName.includes('coal')) {
        return 'BBQ';
    }
    if (lowerName.includes('andhra') || lowerName.includes('spicy') || lowerName.includes('ruchulu') || lowerName.includes('daspalla') || lowerName.includes('amaravathi')) {
        return 'Andhra';
    }
    return 'Multi Cuisine';
}

/**
 * Fetches real restaurants from Google Places API for Visakhapatnam, Vijayawada, Guntur, Tirupati, Rajahmundry
 */
exports.fetchAndStoreGoogleRestaurants = async () => {
    try {
        const count = await Restaurant.countDocuments();
        if (count > 0) {
            console.log(`DEBUG: [Fetch Skip] Database already contains ${count} restaurants. Skipping Google Places API call.`);
            return await Restaurant.find();
        }
    } catch (err) {
        console.error('DEBUG: [Fetch Skip] Error checking database restaurant count:', err.message);
    }

    // 1. Log process.env.GOOGLE_PLACES_API_KEY
    console.log('DEBUG: [API Key Log] process.env.GOOGLE_PLACES_API_KEY =', process.env.GOOGLE_PLACES_API_KEY);

    const apiKey = process.env.GOOGLE_PLACES_API_KEY || GOOGLE_API_KEY;

    if (!apiKey) {
        const errMessage = 'GOOGLE_PLACES_API_KEY is not configured in environment variables';
        console.error('DEBUG: [API Key Log] ERROR -', errMessage);
        throw new Error(errMessage);
    }

    const insertedRestaurants = [];

    for (const city of CITIES) {
        try {
            const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+${encodeURIComponent(city)}&key=${apiKey}`;
            
            // 6. Add console logs before API request
            console.log(`\nDEBUG: [Pre-Request] --- Sending Google Places API Request for city: ${city} ---`);
            console.log(`DEBUG: [Pre-Request] Target URL: ${url.replace(apiKey, 'REDACTED_API_KEY')}`);
            console.log(`DEBUG: [Pre-Request] Initiating axios GET request...`);
            
            const response = await axios.get(url);

            // 6. Add console logs after API request
            console.log(`DEBUG: [Post-Request] --- Received Google Places API Response for city: ${city} (HTTP Status: ${response.status}) ---`);
            
            // 2. Log full Google API response
            console.log('DEBUG: [Full Response] Google API Response Data:', JSON.stringify(response.data, null, 2));

            const apiStatus = response.data.status;
            const errorMessage = response.data.error_message || '';

            // 4. Handle: REQUEST_DENIED, API_KEY_INVALID, quota exceeded, billing issues
            if (apiStatus === 'REQUEST_DENIED') {
                console.error('DEBUG: [Status Check] Google Places API Status is REQUEST_DENIED');
                let specificReason = 'Request was denied by Google.';
                
                // Check for API key invalidity
                if (errorMessage.toLowerCase().includes('key is invalid') || errorMessage.toLowerCase().includes('api key')) {
                    specificReason = 'API_KEY_INVALID: The provided Google Places API key is invalid or not registered.';
                    console.error(`DEBUG: [Status Check] Specific issue identified: API_KEY_INVALID`);
                } 
                // Check for billing issues
                else if (errorMessage.toLowerCase().includes('billing') || errorMessage.toLowerCase().includes('enable billing')) {
                    specificReason = 'BILLING_ISSUES: Billing is not enabled on this Google Cloud project. You must enable billing to use Places API.';
                    console.error(`DEBUG: [Status Check] Specific issue identified: billing issues`);
                }
                
                const detailedErrorMsg = `Google Places API Request Denied: ${specificReason} (Google message: "${errorMessage}")`;
                console.error('DEBUG: [Status Check] ERROR -', detailedErrorMsg);
                throw new Error(detailedErrorMsg);
            }

            if (apiStatus === 'OVER_QUERY_LIMIT') {
                console.error('DEBUG: [Status Check] Google Places API Status is OVER_QUERY_LIMIT');
                const quotaErrorMsg = `Google Places API Error: quota exceeded / daily request limit reached. (Google message: "${errorMessage}")`;
                console.error('DEBUG: [Status Check] ERROR -', quotaErrorMsg);
                throw new Error(quotaErrorMsg);
            }

            if (apiStatus === 'INVALID_REQUEST') {
                console.error('DEBUG: [Status Check] Google Places API Status is INVALID_REQUEST');
                const invalidMsg = `Google Places API Error: Invalid request parameter structure. (Google message: "${errorMessage}")`;
                console.error('DEBUG: [Status Check] ERROR -', invalidMsg);
                throw new Error(invalidMsg);
            }

            if (apiStatus === 'UNKNOWN_ERROR') {
                console.error('DEBUG: [Status Check] Google Places API Status is UNKNOWN_ERROR');
                const unknownMsg = `Google Places API Error: An unknown error occurred on Google servers. (Google message: "${errorMessage}")`;
                console.error('DEBUG: [Status Check] ERROR -', unknownMsg);
                throw new Error(unknownMsg);
            }

            // Also check if errorMessage itself indicates quota/billing/key issues even if status is not explicitly set to expected value
            if (errorMessage.toLowerCase().includes('quota exceeded') || errorMessage.toLowerCase().includes('limit exceeded')) {
                console.error('DEBUG: [Status Check] Detected quota limit in error message.');
                const quotaErrorMsg = `Google Places API Error: quota exceeded / daily request limit reached. (Google message: "${errorMessage}")`;
                console.error('DEBUG: [Status Check] ERROR -', quotaErrorMsg);
                throw new Error(quotaErrorMsg);
            }

            const results = response.data.results || [];
            console.log(`DEBUG: [Process Results] Found ${results.length} results. Processing top 10...`);
            
            // Limit to top 10 restaurants per city
            const top10 = results.slice(0, 10);

            for (let i = 0; i < top10.length; i++) {
                const place = top10[i];

                // 3. Verify restaurant-city mapping before insertion
                const formattedAddress = place.formatted_address || '';
                if (!formattedAddress.toLowerCase().includes(city.toLowerCase())) {
                    console.log(`DEBUG: [Verify Map] Skipping ${place.name} - address "${formattedAddress}" does not match target city "${city}".`);
                    continue;
                }

                // 6. Prevent duplicates using place_id and name + location
                let existing = null;
                if (place.place_id) {
                    existing = await Restaurant.findOne({ place_id: place.place_id });
                }
                if (!existing) {
                    existing = await Restaurant.findOne({ 
                        name: place.name, 
                        location: formattedAddress || `${city}, Andhra Pradesh` 
                    });
                }
                if (existing) {
                    console.log(`DEBUG: [Process Results] Skipping duplicate: ${place.name} (${formattedAddress})`);
                    continue;
                }

                // Construct image URL using Google Places Photo API if photos are available
                let imageUrl = '';
                if (place.photos && place.photos.length > 0) {
                    imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`;
                }

                const mappedCuisine = inferCuisine(place.name);
                
                // Resolve correct cuisine-specific or Google Places photo image
                const { resolveImageForRestaurant } = require('../utils/imageResolver');
                const finalImage = resolveImageForRestaurant(place.place_id || place.name, mappedCuisine, imageUrl);

                const safeSlug = (place.name || 'restaurant').toLowerCase().replace(/[^a-z0-9]/g, '');

                const isOpeningHoursMissing = !place.opening_hours;
                const restaurantDoc = {
                    place_id: place.place_id,
                    name: place.name,
                    location: formattedAddress || `${city}, Andhra Pradesh`,
                    cuisine: mappedCuisine,
                    rating: place.rating || 4.0,
                    image: finalImage,
                    openingHours: isOpeningHoursMissing ? '10:00' : (place.opening_hours.open_now ? 'Open Now' : 'Closed'),
                    closingHours: '23:00',
                    // Mongoose required fields mapping:
                    openingTime: isOpeningHoursMissing ? '10:00' : '11:00',
                    closingTime: '23:00',
                    email: `contact@${safeSlug || 'restaurant'}.com`,
                    staffEmail: `manager@${safeSlug || 'restaurant'}.com`,
                    phoneNumber: '+91 866 555 0100',
                    description: `A highly rated dining spot: ${place.name} in ${city}, offering authentic ${mappedCuisine} culinary delights. Rated ${place.rating || 4.0}/5 stars by Google Places users.`
                };

                const saved = await Restaurant.create(restaurantDoc);
                console.log(`DEBUG: [Save Success] Successfully saved real restaurant to MongoDB: ${saved.name} (${city})`);

                // Automatically generate a Staff account for this restaurant so they can log in
                try {
                    const Staff = require('../models/Staff');
                    const existingStaff = await Staff.findOne({ email: saved.staffEmail });
                    if (!existingStaff) {
                        await Staff.create({
                            name: `${saved.name} Manager`,
                            email: saved.staffEmail,
                            password: 'password123',
                            restaurantId: saved._id,
                            role: 'staff'
                        });
                        console.log(`DEBUG: [Staff Created] Created staff login for ${saved.name}: ${saved.staffEmail} / password123`);
                    }
                } catch (staffErr) {
                    console.error(`DEBUG: [Staff Creation Failed] Failed to create staff for ${saved.name}:`, staffErr.message);
                }
                
                // Automatically generate realistic menu items for this restaurant
                try {
                    await generateMenuForRestaurant(saved._id, saved.cuisine);
                } catch (menuErr) {
                    console.error(`DEBUG: [Menu Generation Failed] Failed to generate menu for ${saved.name}:`, menuErr.message);
                }

                // Automatically generate realistic tables for this restaurant
                try {
                    const { generateTablesForRestaurant } = require('../utils/tableGenerator');
                    await generateTablesForRestaurant(saved._id);
                } catch (tableErr) {
                    console.error(`DEBUG: [Table Generation Failed] Failed to generate tables for ${saved.name}:`, tableErr.message);
                }

                insertedRestaurants.push(saved);
            }

            console.log(`DEBUG: --- Finished processing Google Places request for city: ${city} ---\n`);

        } catch (error) {
            // 3. Log exact error message if request fails
            console.error(`\nDEBUG: [Execution Failure] Google Places API request or processing failed for city ${city}:`);
            console.error(`DEBUG: [Execution Failure] Exact Error Message: ${error.message}`);
            if (error.stack) {
                console.error(`DEBUG: [Execution Failure] Stack Trace:\n`, error.stack);
            }
            if (error.response) {
                console.error('DEBUG: [Execution Failure] HTTP Response Status:', error.response.status);
                console.error('DEBUG: [Execution Failure] HTTP Response Data:', JSON.stringify(error.response.data, null, 2));
            }
            // Re-throw so controller returns 500
            throw error;
        }
    }

    return insertedRestaurants;
};
