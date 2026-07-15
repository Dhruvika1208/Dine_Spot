const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const dotenv = require('dotenv');

dotenv.config();

const cities = ['Visakhapatnam', 'Vijayawada', 'Rajahmundry', 'Guntur', 'Tirupati'];

// We will scrape Swiggy or simply use a generic directory approach.
// Since real scraping might be blocked or CAPTCHA'd, we use Puppeteer to simulate a real browser.
async function scrapeRestaurants() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dinespot');
    console.log('Connected to MongoDB.');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const city of cities) {
        console.log(`Scraping restaurants in ${city}...`);
        const page = await browser.newPage();
        
        try {
            // We'll use a directory site like justdial or a generic search if Swiggy is blocked.
            // For stability in this automated script, we'll try to fetch from Dineout.
            const url = `https://www.dineout.co.in/${city.toLowerCase()}-restaurants`;
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            // Extract data from the page
            const fetchedRestaurants = await page.evaluate((city) => {
                const restaurants = [];
                const cards = document.querySelectorAll('.restnt-card');
                
                cards.forEach((card, index) => {
                    if (index >= 5) return; // limit to 5 per city for now
                    
                    const nameEl = card.querySelector('.restnt-name');
                    const locEl = card.querySelector('.restnt-loc');
                    const cuisineEl = card.querySelector('.double-line-ellipsis');
                    const ratingEl = card.querySelector('.restnt-rating');
                    const imgEl = card.querySelector('.no-img'); // dineout uses .no-img for lazy loaded images, wait, it might be img
                    
                    let name = nameEl ? nameEl.innerText.trim() : `Restaurant ${index + 1}`;
                    let location = locEl ? locEl.innerText.trim() : `${city} Central`;
                    let cuisineText = cuisineEl ? cuisineEl.innerText.trim() : 'North Indian, Chinese';
                    // Clean up cuisine text (often looks like "₹ 1,200 for 2 (approx) | North Indian, Chinese")
                    let cuisine = cuisineText.includes('|') ? cuisineText.split('|')[1].trim() : cuisineText;
                    let rating = ratingEl ? parseFloat(ratingEl.innerText.trim()) : 4.2;
                    if (isNaN(rating)) rating = 4.0;
                    
                    let img = imgEl && imgEl.dataset.src ? imgEl.dataset.src : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80';

                    restaurants.push({
                        name,
                        location: location + `, ${city}`,
                        cuisine,
                        rating,
                        image: img,
                        openingTime: '10:00',
                        closingTime: '23:00',
                        email: `contact@${name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`,
                        staffEmail: `staff@${name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.com`,
                        description: `A fantastic dining experience at ${name} in the heart of ${city}.`
                    });
                });
                
                return restaurants;
            }, city);

            console.log(`Fetched ${fetchedRestaurants.length} restaurants for ${city}`);
            
            // If scraping fails or page structure changes, fallback to mock data generation using real city context
            if (fetchedRestaurants.length === 0) {
                console.log(`No restaurants found for ${city} using selector. Using fallback generation...`);
                for (let i = 1; i <= 3; i++) {
                    fetchedRestaurants.push({
                        name: `${city} Grand Dine ${i}`,
                        location: `Downtown, ${city}`,
                        cuisine: 'South Indian, Multi-Cuisine',
                        rating: 4.0 + (i * 0.2),
                        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
                        openingTime: '11:00',
                        closingTime: '22:30',
                        email: `info@citygrand${i}.com`,
                        staffEmail: `staff@citygrand${i}.com`,
                        description: `Best authentic food in ${city}.`
                    });
                }
            }

            // Save to DB
            for (const r of fetchedRestaurants) {
                const existing = await Restaurant.findOne({ name: r.name, location: r.location });
                if (!existing) {
                    await Restaurant.create(r);
                    console.log(`Saved: ${r.name}`);
                } else {
                    console.log(`Skipped existing: ${r.name}`);
                }
            }

        } catch (error) {
            console.error(`Error scraping ${city}:`, error.message);
        } finally {
            await page.close();
        }
    }

    await browser.close();
    mongoose.connection.close();
    console.log('Scraping completed.');
}

scrapeRestaurants().catch(console.error);
