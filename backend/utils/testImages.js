const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Restaurant = require('../models/Restaurant');
const { resolveImageForRestaurant, isImageValidForCuisine } = require('./imageResolver');

async function testImages() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dinespot');
        console.log('Database connected.');

        console.log('\n--- 1. Testing imageResolver.js directly ---');

        // Test 1.1: Google Places Photo API URL preservation
        const googleUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=CoqBcgAA&key=AIzaSy';
        const resGoogle = resolveImageForRestaurant('r1', 'Andhra', googleUrl);
        console.log('Google URL preservation:');
        console.log('  Input: ', googleUrl);
        console.log('  Output:', resGoogle);
        if (resGoogle !== googleUrl) {
            throw new Error('Google URL was not preserved!');
        }
        console.log('  -> PASS');

        // Test 1.2: Incorrect/Unrelated image fallback replacement
        const sushiUrl = 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop'; // Sushi image
        const resAndhra = resolveImageForRestaurant('r2', 'Andhra', sushiUrl);
        console.log('\nSushi/Unrelated URL replacement for Andhra:');
        console.log('  Input: ', sushiUrl);
        console.log('  Output:', resAndhra);
        if (resAndhra === sushiUrl) {
            throw new Error('Sushi URL was not replaced for Andhra cuisine!');
        }
        console.log('  -> PASS');

        // Test 1.3: Valid fallback preservation
        const validAndhraUrl = 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80'; // Andhra meals
        const resValidAndhra = resolveImageForRestaurant('r3', 'Andhra', validAndhraUrl);
        console.log('\nValid Fallback URL preservation for Andhra:');
        console.log('  Input: ', validAndhraUrl);
        console.log('  Output:', resValidAndhra);
        if (resValidAndhra !== validAndhraUrl) {
            throw new Error('Valid Andhra URL was incorrectly modified!');
        }
        console.log('  -> PASS');

        // Test 1.4: Different cuisine-specific validation
        console.log('\nCuisine Specific Validations:');
        const pizzaUrl = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80'; // Pizza
        const isPizzaValidForItalian = isImageValidForCuisine('Italian', pizzaUrl);
        const isPizzaValidForChinese = isImageValidForCuisine('Chinese', pizzaUrl);
        console.log('  Is Pizza valid for Italian?', isPizzaValidForItalian);
        console.log('  Is Pizza valid for Chinese?', isPizzaValidForChinese);
        if (!isPizzaValidForItalian || isPizzaValidForChinese) {
            throw new Error('Cuisine image relevance checking is incorrect!');
        }
        console.log('  -> PASS');

        console.log('\n--- 2. Testing model pre-save hook auto-correction ---');
        
        // Remove test restaurant if exists
        await Restaurant.deleteMany({ email: 'image_test@dinespot.com' });

        // Save a new restaurant with an invalid image (sushi URL for Andhra restaurant)
        const testRes = await Restaurant.create({
            name: 'Andhra Spice Garden Test',
            location: 'Vijayawada, Andhra Pradesh',
            cuisine: 'Andhra',
            description: 'Delicious Andhra thalis.',
            image: sushiUrl, // Invalid sushi URL
            openingTime: '11:00',
            closingTime: '23:00',
            email: 'image_test@dinespot.com',
            staffEmail: 'staff_image_test@dinespot.com',
            phoneNumber: '+91 866 555 0100'
        });

        console.log('Stored Restaurant Image URL:');
        console.log('  Expected: One of the Andhra fallback images (thali/meals/interior)');
        console.log('  Actual:  ', testRes.image);
        if (testRes.image === sushiUrl) {
            throw new Error('The pre-save hook failed to correct the invalid image before storing!');
        }
        console.log('  -> PASS');

        // Clean up
        await Restaurant.deleteMany({ email: 'image_test@dinespot.com' });
        console.log('\nCleaned up test data.');
        
        console.log('\nALL IMAGE LOGIC VERIFIED SUCCESSFULLY!');
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
}

testImages();
