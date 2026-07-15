const Table = require('../models/Table');
const Restaurant = require('../models/Restaurant');

/**
 * Automatically generates 10-20 tables for a given restaurant.
 * Includes a realistic mix of 2-seater, 4-seater, 6-seater, and family tables (8-seater).
 * Safe against duplicate execution.
 * 
 * @param {string} restaurantId - The MongoDB ObjectId of the restaurant.
 * @returns {Promise<Array>} The generated tables.
 */
exports.generateTablesForRestaurant = async (restaurantId) => {
    try {
        console.log(`[Table Generator] Generating tables for Restaurant ID: ${restaurantId}`);
        
        // Prevent duplicate generation by checking if tables already exist
        const existingCount = await Table.countDocuments({ restaurantId });
        if (existingCount > 0) {
            console.log(`[Table Generator] Tables already exist for restaurant ${restaurantId}. Returning existing ones.`);
            return await Table.find({ restaurantId });
        }

        // Fetch the restaurant to get its unique seating preferences
        const restaurant = await Restaurant.findById(restaurantId);
        const prefs = restaurant?.seatingPreferences || [];

        const tablesToInsert = [];
        // Generate between 10 and 20 tables randomly
        const numTables = Math.floor(Math.random() * 11) + 10; // 10 to 20

        // Define a mix of capacities
        // 2-seater, 4-seater, 6-seater, family (8-seater) tables
        const capacities = [2, 2, 2, 4, 4, 4, 6, 6, 8];

        for (let i = 1; i <= numTables; i++) {
            const capacity = capacities[Math.floor(Math.random() * capacities.length)];
            
            const tags = [];
            if (prefs.length > 0 && Math.random() < 0.7) {
                // Select a random seating preference from the restaurant's options
                const randomPref = prefs[Math.floor(Math.random() * prefs.length)];
                tags.push(randomPref);
            }

            tablesToInsert.push({
                restaurantId,
                tableNumber: `T${i}`,
                capacity,
                status: 'Available',
                tags
            });
        }

        const inserted = await Table.insertMany(tablesToInsert);
        console.log(`[Table Generator] SUCCESS: Created ${inserted.length} tables for restaurant ${restaurantId}.`);
        return inserted;
    } catch (error) {
        console.error(`[Table Generator] ERROR: Failed to generate tables for restaurant ${restaurantId}:`, error.message);
        throw error;
    }
};
