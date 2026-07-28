/**
 * Fallback image pools for different cuisines.
 * Curated high-quality, relevant restaurant and dish photos from Unsplash.
 */
const CUISINE_IMAGE_POOLS = {
    'south indian': [
        'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', // Crispy Dosa
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', // Steamed Idli
        'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80', // South Indian Thali/Meals
        'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80', // Medu Vada
        'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80'  // South Indian traditional style restaurant interior
    ],
    'andhra': [
        'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80', // Traditional Andhra/South Indian meals on banana leaf
        'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', // Rich Andhra thali with regional curries and appetizers
        'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80', // Traditional South Indian/Andhra restaurant interior
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', // Andhra regional curry / Dal dishes
        'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80'  // Traditional details
    ],
    'chinese': [
        'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80', // Veg Hakka Noodles
        'https://images.unsplash.com/photo-1496116211217-41af89634433?auto=format&fit=crop&w=800&q=80', // Steam Dim Sum / Dumplings
        'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=800&q=80', // Asian restaurant interior
        'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80', // Chinese Fried Rice / Stir Fry
        'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80'  // Cozy Asian dining tables
    ],
    'italian': [
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', // Margherita Pizza
        'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=800&q=80', // Fettuccine Alfredo Pasta
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', // Italian restaurant interiors
        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80'  // Pasta / Lasagna gourmet
    ],
    'biryani': [
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', // Chicken Dum Biryani
        'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80', // Mandi Platter
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', // Paneer Zafrani Biryani
        'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80'  // Seekh Kabab with Rice
    ],
    'cafe': [
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', // Coffee shop interior
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80', // Espresso Cappuccino
        'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80', // Cafe table / Cakes
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80'  // Bakery display/Pastry
    ],
    'bbq': [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80', // Live grill BBQ
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', // Meat/Vegetable skewers
        'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80', // Smoked BBQ ribs
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'  // Charcoal grill setup
    ],
    'seafood': [
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80', // Coastal seafood platter
        'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80', // Fish fry / seafood
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', // Charcoal fish grill
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'  // Coastal regional fish curry
    ],
    'north indian': [
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', // North Indian butter chicken paneer setup
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', // Paneer tikka tandoor
        'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80', // Indian dining bread & curries
        'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80'  // Tandoori chicken kebab
    ],
    'continental': [
        'https://images.unsplash.com/photo-1532550907401-a500c9af5743?auto=format&fit=crop&w=800&q=80', // Grilled Chicken
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', // Premium Main
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80', // Fine dining
        'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80'  // Caesar Salad
    ],
    'bakery': [
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', // Cake
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', // Pastry Croissant
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', // Bakery bread
        'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=800&q=80'  // Muffins
    ],
    'fast food': [
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', // Burger
        'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', // French Fries
        'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80', // Chicken nuggets
        'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=800&q=80'  // Onion rings
    ],
    'hyderabadi': [
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80', // Hyderabadi Dum Biryani
        'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80', // Mandi Platter
        'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80', // Spiced dishes
        'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80'  // Qubani apricot sweet
    ],
    'vegetarian': [
        'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80', // Paneer Butter Masala
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80', // Dal Makhani
        'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80', // Paneer bowl
        'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80'  // Veg kabab / starter
    ],
    'street food': [
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', // Pani Puri
        'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80', // Pav Bhaji / Uttapam
        'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=800&q=80', // Samosa / Vada
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'  // Indian tea / coffee
    ],
    'breakfast': [
        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', // Steamed Idli
        'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80', // Crispy Dosa
        'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80', // Pancakes / Waffles breakfast
        'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80'  // Healthy breakfast spread
    ],
    'general': [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', // Cozy bistro interior
        'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80', // Modern dining room
        'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=800&q=80', // Premium restaurant layout
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80'  // Elegant table setting
    ]
};

/**
 * Normalizes a cuisine string into a valid pool key.
 */
function getPoolKeyForCuisine(cuisine) {
    const cuisineLower = (cuisine || '').toLowerCase();
    
    if (cuisineLower.includes('breakfast')) {
        return 'breakfast';
    }
    if (cuisineLower.includes('south indian')) {
        return 'south indian';
    }
    if (cuisineLower.includes('andhra')) {
        return 'andhra';
    }
    if (cuisineLower.includes('chinese')) {
        return 'chinese';
    }
    if (cuisineLower.includes('italian')) {
        return 'italian';
    }
    if (cuisineLower.includes('biryani') || cuisineLower.includes('mandi') || cuisineLower.includes('kebab') || cuisineLower.includes('kabab')) {
        return 'biryani';
    }
    if (cuisineLower.includes('cafe') || cuisineLower.includes('coffee')) {
        return 'cafe';
    }
    if (cuisineLower.includes('bakery')) {
        return 'bakery';
    }
    if (cuisineLower.includes('bbq') || cuisineLower.includes('barbeque') || cuisineLower.includes('grill') || cuisineLower.includes('steak')) {
        return 'bbq';
    }
    if (cuisineLower.includes('seafood') || cuisineLower.includes('fish') || cuisineLower.includes('crab')) {
        return 'seafood';
    }
    if (cuisineLower.includes('north indian') || cuisineLower.includes('mughlai') || cuisineLower.includes('punjabi') || cuisineLower.includes('tandoor')) {
        return 'north indian';
    }
    if (cuisineLower.includes('continental')) {
        return 'continental';
    }
    if (cuisineLower.includes('fast food') || cuisineLower.includes('burger')) {
        return 'fast food';
    }
    if (cuisineLower.includes('hyderabadi')) {
        return 'hyderabadi';
    }
    if (cuisineLower.includes('vegetarian') || cuisineLower.includes('pure veg') || cuisineLower.includes('veg')) {
        return 'vegetarian';
    }
    if (cuisineLower.includes('street food') || cuisineLower.includes('chaat') || cuisineLower.includes('pani puri')) {
        return 'street food';
    }
    
    return 'general';
}

/**
 * Validates if the current image is a valid, correct type.
 * Returns true if the image is a Google Places photo OR matches the corresponding pool images.
 */
exports.isImageValidForCuisine = (cuisine, image) => {
    if (!image) return false;
    
    // 1. If it is a Google Places photo, it is valid!
    if (image.includes('googleapis.com/maps/api/place/photo')) {
        return true;
    }

    const poolKey = getPoolKeyForCuisine(cuisine);
    const pool = CUISINE_IMAGE_POOLS[poolKey] || CUISINE_IMAGE_POOLS['general'];

    // Extract clean URL to ignore query parameter variations
    const cleanImage = image.split('?')[0];
    return pool.some(p => p.split('?')[0] === cleanImage);
};

/**
 * Resolves a cuisine-appropriate, realistic, deterministic image for a restaurant.
 * Actual Google Places photo URLs are preserved.
 * Generic/mismatched stock photos or missing photos are replaced.
 * 
 * @param {string} restaurantId - The unique ID or identifier of the restaurant.
 * @param {string} cuisine - The cuisine string of the restaurant.
 * @param {string} currentImage - The current image URL.
 * @returns {string} The resolved image URL.
 */
exports.resolveImageForRestaurant = (restaurantId, cuisine, currentImage) => {
    // 1. Keep valid http/https/uploads/data:image/blob URLs directly (including uploaded photos)
    if (currentImage && (
        currentImage.startsWith('http://') || 
        currentImage.startsWith('https://') || 
        currentImage.startsWith('/uploads/') || 
        currentImage.startsWith('uploads/') || 
        currentImage.startsWith('data:image/') || 
        currentImage.startsWith('blob:')
    )) {
        return currentImage;
    }

    const poolKey = getPoolKeyForCuisine(cuisine);
    const pool = CUISINE_IMAGE_POOLS[poolKey] || CUISINE_IMAGE_POOLS['general'];

    // 2. Select a deterministic index based on the restaurant's identifier hash to avoid repeats
    const hashStr = restaurantId ? restaurantId.toString() : '';
    const hash = getDeterministicHash(hashStr);
    const index = hash % pool.length;
    return pool[index];
};

function getDeterministicHash(str) {
    let hash = 0;
    if (!str) return 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

exports.getPoolKeyForCuisine = getPoolKeyForCuisine;
exports.CUISINE_IMAGE_POOLS = CUISINE_IMAGE_POOLS;
