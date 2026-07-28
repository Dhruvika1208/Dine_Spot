const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Restaurant = require('../models/Restaurant');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dinespot';

const restaurantsData = [
    // ==========================================
    // VISAKHAPATNAM (10 Unique Restaurants)
    // ==========================================
    {
        name: 'Hotel Daspalla Grand',
        location: 'Visakhapatnam',
        cuisine: 'Andhra',
        description: 'Authentic local Andhra thalis, spiced natukodi chicken, and traditional gongura pacchadi.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:00',
        closingTime: '22:30',
        email: 'daspalla.vzg@daspallahotels.com',
        staffEmail: 'manager.daspalla@dinespot.com',
        phoneNumber: '+91 891 2564551',
        rating: 4.6
    },
    {
        name: 'The Fisherman’s Wharf Coastal',
        location: 'Visakhapatnam',
        cuisine: 'Seafood',
        description: 'Fresh coastal crab masala, butter garlic tiger prawns, and traditional Konaseema fish pulusu.',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '23:30',
        email: 'fishermanswharf.vzg@wharfgroup.com',
        staffEmail: 'manager.fishermanswharf@dinespot.com',
        phoneNumber: '+91 891 6689121',
        rating: 4.8
    },
    {
        name: 'Barbeque Nation Beach Road',
        location: 'Visakhapatnam',
        cuisine: 'BBQ',
        description: 'Live grill experience with unlimited skewered starters, marinated chicken, and grilled pineapple.',
        image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '23:00',
        email: 'bbqn.vzg@barbequenation.com',
        staffEmail: 'manager.bbqn@dinespot.com',
        phoneNumber: '+91 891 6632488',
        rating: 4.5
    },
    {
        name: 'Paradise Biryani Dwaraka Nagar',
        location: 'Visakhapatnam',
        cuisine: 'Hyderabadi',
        description: 'Classic Hyderabad style dum biryani made with premium basmati rice, tender mutton, and rich spices.',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:00',
        closingTime: '23:00',
        email: 'paradise.vzg@paradisebiryani.com',
        staffEmail: 'manager.paradise@dinespot.com',
        phoneNumber: '+91 891 2781442',
        rating: 4.3
    },
    {
        name: 'Cream Stone Premium Icecreams',
        location: 'Visakhapatnam',
        cuisine: 'Bakery',
        description: 'Stirred premium ice cream creations on a cold stone slab with fresh nuts, chocolates, and fruits.',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:00',
        closingTime: '01:00',
        email: 'creamstone.vzg@creamstone.com',
        staffEmail: 'manager.creamstone@dinespot.com',
        phoneNumber: '+91 891 2548891',
        rating: 4.4
    },
    {
        name: 'Dakshin Spice Heritage',
        location: 'Visakhapatnam',
        cuisine: 'South Indian',
        description: 'Authentic idlis, crispy ghee roast dosas, wada with ginger chutney, and fresh filter coffee.',
        image: 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?q=80&w=600&auto=format&fit=crop',
        openingTime: '07:00',
        closingTime: '22:00',
        email: 'dakshinspice.vzg@dakshin.com',
        staffEmail: 'manager.dakshinspice@dinespot.com',
        phoneNumber: '+91 891 2547790',
        rating: 4.6
    },
    {
        name: 'Olive Bistro Bayview',
        location: 'Visakhapatnam',
        cuisine: 'Continental',
        description: 'Premium grilled herb chicken, classic fish and chips, and fresh salads served oceanfront.',
        image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:30',
        closingTime: '22:30',
        email: 'olivebistro.vzg@olivegroup.com',
        staffEmail: 'manager.olivebistro@dinespot.com',
        phoneNumber: '+91 891 6689033',
        rating: 4.7
    },
    {
        name: 'Urban Tadka Kitchen',
        location: 'Visakhapatnam',
        cuisine: 'North Indian',
        description: 'Rich butter chicken, paneer tikka masala, garlic naan, and traditional Punjabi lassi.',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:30',
        closingTime: '23:00',
        email: 'urbantadka.vzg@urbantadka.com',
        staffEmail: 'manager.urbantadka@dinespot.com',
        phoneNumber: '+91 891 2548811',
        rating: 4.4
    },
    {
        name: 'Mekong Asian Bistro',
        location: 'Visakhapatnam',
        cuisine: 'Chinese',
        description: 'Authentic pan-Asian dim sum, hakka noodles, hot pepper chicken, and sushi options.',
        image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '23:00',
        email: 'mekong.vzg@mekongdining.com',
        staffEmail: 'manager.mekong@dinespot.com',
        phoneNumber: '+91 891 6625890',
        rating: 4.5
    },
    {
        name: 'Brewberrys Coffee Bar',
        location: 'Visakhapatnam',
        cuisine: 'Cafe',
        description: 'Artesian espresso drinks, chocolate shakes, vegetarian paninis, and study-friendly ambiance.',
        image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=600&auto=format&fit=crop',
        openingTime: '08:00',
        closingTime: '22:30',
        email: 'brewberrys.vzg@brewberrys.com',
        staffEmail: 'manager.brewberrys@dinespot.com',
        phoneNumber: '+91 891 2541299',
        rating: 4.2
    },

    // ==========================================
    // VIJAYAWADA (10 Unique Restaurants)
    // ==========================================
    {
        name: 'Gadiraju Palace Diner',
        location: 'Vijayawada',
        cuisine: 'Andhra',
        description: 'Royal Andhra dining, spicy Nellore chepala pulusu, and local Ulavacharu biryani.',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:00',
        closingTime: '22:30',
        email: 'gadiraju.vj@gadirajuhotels.com',
        staffEmail: 'manager.gadiraju@dinespot.com',
        phoneNumber: '+91 866 2445581',
        rating: 4.7
    },
    {
        name: 'Sea Inn Seafood Cove',
        location: 'Vijayawada',
        cuisine: 'Seafood',
        description: 'Coastal Andhra seafood favorites, marinated river fish fry, and clay-pot crab curries.',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:30',
        closingTime: '23:00',
        email: 'seainn.vj@seainngroup.com',
        staffEmail: 'manager.seainn@dinespot.com',
        phoneNumber: '+91 866 6692211',
        rating: 4.6
    },
    {
        name: 'Absolute Barbecues Benz Circle',
        location: 'Vijayawada',
        cuisine: 'BBQ',
        description: 'Wish grill concept featuring exotic meats, standard paneer skewers, and dynamic buffet.',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '23:00',
        email: 'ab.vj@absolutebarbecues.com',
        staffEmail: 'manager.ab@dinespot.com',
        phoneNumber: '+91 866 6699881',
        rating: 4.6
    },
    {
        name: 'Arabian Mandi House Palace',
        location: 'Vijayawada',
        cuisine: 'Biryani',
        description: 'Authentic Yemeni Mandi, delicious Khabsa rice with charcoal grilled lamb, served in floor seating.',
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '00:00',
        email: 'arabianmandi.vj@mandi.com',
        staffEmail: 'manager.arabianmandi@dinespot.com',
        phoneNumber: '+91 866 2548812',
        rating: 4.5
    },
    {
        name: 'Sweet Magic Pastry Shop',
        location: 'Vijayawada',
        cuisine: 'Bakery',
        description: 'Premium cakes, artisan breads, traditional sweets, and custom birthday pastries.',
        image: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?q=80&w=600&auto=format&fit=crop',
        openingTime: '09:00',
        closingTime: '22:00',
        email: 'sweetmagic.vj@sweetmagic.com',
        staffEmail: 'manager.sweetmagic@dinespot.com',
        phoneNumber: '+91 866 2448899',
        rating: 4.4
    },
    {
        name: 'Southern Spice Villa',
        location: 'Vijayawada',
        cuisine: 'South Indian',
        description: 'Crispy paper dosas, sambar vada, authentic filter coffee, and traditional meals on banana leaves.',
        image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=600&auto=format&fit=crop',
        openingTime: '07:00',
        closingTime: '22:00',
        email: 'southernspice.vj@spicevilla.com',
        staffEmail: 'manager.southernspice@dinespot.com',
        phoneNumber: '+91 866 2547711',
        rating: 4.5
    },
    {
        name: 'Little Italy Gourmet',
        location: 'Vijayawada',
        cuisine: 'Italian',
        description: 'Fine dining Italian vegetarian pasta, wood-fired marinara pizza, and classic minestrone.',
        image: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '23:00',
        email: 'littleitaly.vj@gourmet.com',
        staffEmail: 'manager.littleitaly@dinespot.com',
        phoneNumber: '+91 866 6632400',
        rating: 4.6
    },
    {
        name: 'The Gateway Kitchen Restaurant',
        location: 'Vijayawada',
        cuisine: 'North Indian',
        description: 'Spiced kadai paneer, buttery dal makhani, Peshawari naans, and rich kulfi.',
        image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '23:00',
        email: 'gateway.vj@gatewayhotels.com',
        staffEmail: 'manager.gateway@dinespot.com',
        phoneNumber: '+91 866 6644112',
        rating: 4.6
    },
    {
        name: 'Vibe Burger Express',
        location: 'Vijayawada',
        cuisine: 'Fast Food',
        description: 'Crispy double cheese veggie burgers, crunchy chicken nuggets, french fries, and creamy oreo milkshakes.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:30',
        closingTime: '22:30',
        email: 'beijingbites.vj@bitesexpress.com',
        staffEmail: 'manager.beijingbitesvj@dinespot.com',
        phoneNumber: '+91 866 2548810',
        rating: 4.1
    },
    {
        name: 'Coffee Day Square Café',
        location: 'Vijayawada',
        cuisine: 'Cafe',
        description: 'Single-origin filter coffee, mocktails, continental snacks, and cozy study spaces.',
        image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?q=80&w=600&auto=format&fit=crop',
        openingTime: '08:00',
        closingTime: '23:00',
        email: 'ccd.vj@coffeeday.com',
        staffEmail: 'manager.ccd@dinespot.com',
        phoneNumber: '+91 866 2549921',
        rating: 4.2
    },

    // ==========================================
    // GUNTUR (10 Unique Restaurants)
    // ==========================================
    {
        name: 'Amaravathi Spices Court',
        location: 'Guntur',
        cuisine: 'Andhra',
        description: 'Fiery red Guntur chili chicken, traditional thali with avakaya, and gongura mutton fry.',
        image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:00',
        closingTime: '22:30',
        email: 'amaravathispices.gnt@gmail.com',
        staffEmail: 'manager.amaravathispices@dinespot.com',
        phoneNumber: '+91 863 2244581',
        rating: 4.5
    },
    {
        name: 'Coastal Currents Fish House',
        location: 'Guntur',
        cuisine: 'Seafood',
        description: 'Delicious Andhra style fish fry, spiced crab masala, and fresh shrimp biryani.',
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:30',
        closingTime: '23:00',
        email: 'coastalcurrents.gnt@gmail.com',
        staffEmail: 'manager.coastalcurrents@dinespot.com',
        phoneNumber: '+91 863 6692233',
        rating: 4.4
    },
    {
        name: 'Coal Spark Tandoor',
        location: 'Guntur',
        cuisine: 'BBQ',
        description: 'Charcoal grilled kebabs, tandoori rotis, special seekh kebabs, and mint chutney.',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=600&auto=format&fit=crop',
        openingTime: '17:00',
        closingTime: '23:30',
        email: 'coalspark.gnt@gmail.com',
        staffEmail: 'manager.coalspark@dinespot.com',
        phoneNumber: '+91 863 6632481',
        rating: 4.3
    },
    {
        name: 'Viceroy Biryani House Palace',
        location: 'Guntur',
        cuisine: 'Biryani',
        description: 'Flavored mutton dum biryani, classic chicken biryani, and mirchi ka salan.',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:00',
        closingTime: '23:00',
        email: 'viceroy.gnt@gmail.com',
        staffEmail: 'manager.viceroy@dinespot.com',
        phoneNumber: '+91 863 2281441',
        rating: 4.5
    },
    {
        name: 'Crust & Crumb Bakery',
        location: 'Guntur',
        cuisine: 'Bakery',
        description: 'Freshly baked local breads, customized chocolate pastries, puffs, and sweet cookies.',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=600&auto=format&fit=crop',
        openingTime: '08:00',
        closingTime: '22:00',
        email: 'crustcrumb.gnt@gmail.com',
        staffEmail: 'manager.crustcrumb@dinespot.com',
        phoneNumber: '+91 863 2548892',
        rating: 4.2
    },
    {
        name: 'Sankar Vilas Classic',
        location: 'Guntur',
        cuisine: 'South Indian',
        description: 'Iconic Guntur restaurant famous for pure ghee dosas, vada, upma, and filter coffee.',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop',
        openingTime: '06:30',
        closingTime: '21:30',
        email: 'sankarvilas.gnt@gmail.com',
        staffEmail: 'manager.sankarvilas@dinespot.com',
        phoneNumber: '+91 863 2247790',
        rating: 4.8
    },
    {
        name: 'Tuscan Grill House',
        location: 'Guntur',
        cuisine: 'Italian',
        description: 'Fresh pasta, handcrafted thin-crust vegetable pizzas, and classic garlic breads.',
        image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '22:30',
        email: 'tuscangrill.gnt@gmail.com',
        staffEmail: 'manager.tuscangrill@dinespot.com',
        phoneNumber: '+91 863 6689022',
        rating: 4.4
    },
    {
        name: 'Guntur Club Dining Room',
        location: 'Guntur',
        cuisine: 'North Indian',
        description: 'Classic dal makhani, shahi paneer, butter naan, and spiced chicken tikka gravy.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:30',
        closingTime: '23:00',
        email: 'gunturclub.dining@gmail.com',
        staffEmail: 'manager.gunturclub@dinespot.com',
        phoneNumber: '+91 863 2548821',
        rating: 4.3
    },
    {
        name: 'Chaat Chatore Junction',
        location: 'Guntur',
        cuisine: 'Street Food',
        description: 'Special pav bhaji, premium pani puris, hot samosa chaats, and fresh masala chai.',
        image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '22:30',
        email: 'redwok.gnt@gmail.com',
        staffEmail: 'manager.redwok@dinespot.com',
        phoneNumber: '+91 863 6625881',
        rating: 4.2
    },
    {
        name: 'The Coffee Club Guntur',
        location: 'Guntur',
        cuisine: 'Cafe',
        description: 'Gourmet filter coffee, custom milkshakes, fast food burgers, and cold brews.',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600&auto=format&fit=crop',
        openingTime: '08:00',
        closingTime: '22:00',
        email: 'coffeeclub.gnt@gmail.com',
        staffEmail: 'manager.coffeeclub@dinespot.com',
        phoneNumber: '+91 863 2541298',
        rating: 4.3
    },

    // ==========================================
    // TIRUPATI (10 Unique Restaurants)
    // ==========================================
    {
        name: 'Saptagiri Woodlands Pure Veg',
        location: 'Tirupati',
        cuisine: 'Vegetarian',
        description: 'Special pure vegetarian thalis, paneer butter masala, dal makhani, and warm gulab jamuns.',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop',
        openingTime: '10:30',
        closingTime: '22:00',
        email: 'saptagiri.tpt@woodlands.com',
        staffEmail: 'manager.saptagiri@dinespot.com',
        phoneNumber: '+91 877 2244582',
        rating: 4.8
    },
    {
        name: 'Coastal Bounty Seafood',
        location: 'Tirupati',
        cuisine: 'Seafood',
        description: 'Traditional style fish curries, masala prawns, and fresh catches from Nelapattu lake.',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:00',
        closingTime: '22:30',
        email: 'coastalbounty.tpt@gmail.com',
        staffEmail: 'manager.coastalbounty@dinespot.com',
        phoneNumber: '+91 877 6692244',
        rating: 4.4
    },
    {
        name: 'Tandoor & Grill Garden',
        location: 'Tirupati',
        cuisine: 'BBQ',
        description: 'Open air barbecue concept, marinated paneer tikka, hot skewers, and delicious gravies.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop',
        openingTime: '17:30',
        closingTime: '23:30',
        email: 'tandoorgrill.tpt@gmail.com',
        staffEmail: 'manager.tandoorgrill@dinespot.com',
        phoneNumber: '+91 877 6632482',
        rating: 4.5
    },
    {
        name: 'Maurya Restaurant Biryani Hub',
        location: 'Tirupati',
        cuisine: 'Biryani',
        description: 'Authentic Hyderabadi Dum Biryani, double ka meetha, and spiced chicken appetizers.',
        image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:00',
        closingTime: '23:00',
        email: 'maurya.tpt@mauryahotels.com',
        staffEmail: 'manager.maurya@dinespot.com',
        phoneNumber: '+91 877 2281442',
        rating: 4.4
    },
    {
        name: 'Baker’s Street Confectionery',
        location: 'Tirupati',
        cuisine: 'Bakery',
        description: 'Locally famous bakery with vegetarian cakes, custom muffins, fresh buns, and sweet rusks.',
        image: 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?q=80&w=600&auto=format&fit=crop',
        openingTime: '08:00',
        closingTime: '22:00',
        email: 'bakersstreet.tpt@gmail.com',
        staffEmail: 'manager.bakersstreet@dinespot.com',
        phoneNumber: '+91 877 2548893',
        rating: 4.6
    },
    {
        name: 'Bhimas Deluxe Diner',
        location: 'Tirupati',
        cuisine: 'South Indian',
        description: 'Iconic ghee dosas, mini idlis, rava khara bhath, and traditional South Indian filter coffee.',
        image: 'https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=600&auto=format&fit=crop',
        openingTime: '06:00',
        closingTime: '22:00',
        email: 'bhimasdeluxe.tpt@bhimas.com',
        staffEmail: 'manager.bhimas@dinespot.com',
        phoneNumber: '+91 877 2247791',
        rating: 4.8
    },
    {
        name: 'Romeo Pizzeria & Pasta',
        location: 'Tirupati',
        cuisine: 'Italian',
        description: 'Cheesy Margherita pizzas, creamy pasta, garlic bread rolls, and tiramisu dessert.',
        image: 'https://images.unsplash.com/photo-1547928500-30018c1752b0?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '22:30',
        email: 'romeopizza.tpt@gmail.com',
        staffEmail: 'manager.romeopizza@dinespot.com',
        phoneNumber: '+91 877 6689011',
        rating: 4.5
    },
    {
        name: 'Minerva Grand Royal',
        location: 'Tirupati',
        cuisine: 'North Indian',
        description: 'Fine dining paneer lababdar, spiced kadai chicken, butter naans, and rich basundi.',
        image: 'https://images.unsplash.com/photo-1536184902485-8356843964d5?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:30',
        closingTime: '23:00',
        email: 'minerva.tpt@minervagrand.com',
        staffEmail: 'manager.minerva@dinespot.com',
        phoneNumber: '+91 877 2548831',
        rating: 4.7
    },
    {
        name: 'Nanking Chinese Corner',
        location: 'Tirupati',
        cuisine: 'Chinese',
        description: 'Authentic fried rice, spring rolls, sweet chili potatoes, and chicken fried momos.',
        image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '22:30',
        email: 'nanking.tpt@gmail.com',
        staffEmail: 'manager.nanking@dinespot.com',
        phoneNumber: '+91 877 6625882',
        rating: 4.3
    },
    {
        name: 'Cafe Coffee Day Alipiri',
        location: 'Tirupati',
        cuisine: 'Cafe',
        description: 'Premium coffee blends, burgers, sandwiches, and rich chocolate brownies at the foothill.',
        image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=600&auto=format&fit=crop',
        openingTime: '08:00',
        closingTime: '23:00',
        email: 'ccd.alipiri@coffeeday.com',
        staffEmail: 'manager.ccdalipiri@dinespot.com',
        phoneNumber: '+91 877 2541297',
        rating: 4.4
    },

    // ==========================================
    // RAJAHMUNDRY (10 Unique Restaurants)
    // ==========================================
    {
        name: 'GVR Signature Restaurant',
        location: 'Rajahmundry',
        cuisine: 'Andhra',
        description: 'Luxury fine dining, royal Godavari specialties, Pulasa fish curry, and signature natukodi biryani.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:00',
        closingTime: '23:00',
        email: 'gvr.signature@dinespot.com',
        staffEmail: 'manager.gvrsignature@dinespot.com',
        phoneNumber: '+91 883 2244583',
        rating: 4.9
    },
    {
        name: 'River Bay Seafood Restaurant',
        location: 'Rajahmundry',
        cuisine: 'Seafood',
        description: 'Godavari river prawns, grilled fish, crab masala, and beautiful views of Havelock bridge.',
        image: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:30',
        closingTime: '23:00',
        email: 'riverbayseafood.rj@riverbay.com',
        staffEmail: 'manager.riverbayseafood@dinespot.com',
        phoneNumber: '+91 883 6692255',
        rating: 4.7
    },
    {
        name: 'Smokey’s BBQ Grill',
        location: 'Rajahmundry',
        cuisine: 'BBQ',
        description: 'Live table grill with non-vegetarian starters, glazed chicken wings, and unlimited desserts.',
        image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=600&auto=format&fit=crop',
        openingTime: '17:00',
        closingTime: '23:30',
        email: 'smokeysbbq.rj@gmail.com',
        staffEmail: 'manager.smokeysbbq@dinespot.com',
        phoneNumber: '+91 883 6632483',
        rating: 4.4
    },
    {
        name: 'Konaseema Mandi House',
        location: 'Rajahmundry',
        cuisine: 'Biryani',
        description: 'Special Arabian Mandi with a unique Konaseema twist, served with seasoned basmati and nuts.',
        image: 'https://images.unsplash.com/photo-1481070797333-e1337fb8714a?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '00:00',
        email: 'konaseemamandi.rj@gmail.com',
        staffEmail: 'manager.konaseemamandi@dinespot.com',
        phoneNumber: '+91 883 2281443',
        rating: 4.6
    },
    {
        name: 'The Baker’s Lounge RJ',
        location: 'Rajahmundry',
        cuisine: 'Bakery',
        description: 'Freshly baked pastries, cupcakes, chicken patties, and specialty wedding cakes.',
        image: 'https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?q=80&w=600&auto=format&fit=crop',
        openingTime: '08:00',
        closingTime: '22:00',
        email: 'bakerslounge.rj@gmail.com',
        staffEmail: 'manager.bakerslounge@dinespot.com',
        phoneNumber: '+91 883 2548894',
        rating: 4.3
    },
    {
        name: 'Sri Kanya Comfort Diner',
        location: 'Rajahmundry',
        cuisine: 'South Indian',
        description: 'Ghee roast dosas, idli with coconut chutney, traditional Andhra pesarettu with upma.',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=600&auto=format&fit=crop',
        openingTime: '06:30',
        closingTime: '22:00',
        email: 'srikanya.rj@comfortdiner.com',
        staffEmail: 'manager.srikanya@dinespot.com',
        phoneNumber: '+91 883 2247792',
        rating: 4.7
    },
    {
        name: 'Bella Italia Rajahmundry',
        location: 'Rajahmundry',
        cuisine: 'Italian',
        description: 'Focaccia, homemade penne arrabbiata, thin crust vegetable supreme pizza, and panacotta.',
        image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '22:30',
        email: 'bellaitalia.rj@gmail.com',
        staffEmail: 'manager.bellaitalia@dinespot.com',
        phoneNumber: '+91 883 6689055',
        rating: 4.5
    },
    {
        name: 'Sitara Grand Restaurant',
        location: 'Rajahmundry',
        cuisine: 'North Indian',
        description: 'Buttery paneer tikka masala, garlic butter naans, dal tadka, and chicken handi.',
        image: 'https://images.unsplash.com/photo-1564759974727-414003977b85?q=80&w=600&auto=format&fit=crop',
        openingTime: '11:30',
        closingTime: '23:00',
        email: 'sitaragrand.rj@sitarahotels.com',
        staffEmail: 'manager.sitaragrand@dinespot.com',
        phoneNumber: '+91 883 2548832',
        rating: 4.6
    },
    {
        name: 'China Town RJ',
        location: 'Rajahmundry',
        cuisine: 'Chinese',
        description: 'Authentic fried rice, spring rolls, dry Manchurian balls, and hot garlic chicken.',
        image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=600&auto=format&fit=crop',
        openingTime: '12:00',
        closingTime: '22:30',
        email: 'chinatown.rj@gmail.com',
        staffEmail: 'manager.chinatownrj@dinespot.com',
        phoneNumber: '+91 883 6625883',
        rating: 4.3
    },
    {
        name: 'Brewed Awakenings Café',
        location: 'Rajahmundry',
        cuisine: 'Cafe',
        description: 'Artisanal coffee brews, hazelnut frappes, fresh bagels, and customized dessert waffles.',
        image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=600&auto=format&fit=crop',
        openingTime: '08:00',
        closingTime: '22:00',
        email: 'brewedawakenings.rj@gmail.com',
        staffEmail: 'manager.brewedawakenings@dinespot.com',
        phoneNumber: '+91 883 2541296',
        rating: 4.5
    }
];

async function seedRestaurants() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected successfully!');

        // Wipe old records as requested to ensure a clean overhaul
        console.log('Cleaning up existing restaurants...');
        await Restaurant.deleteMany({});
        console.log('Existing restaurants deleted.');

        let insertedCount = 0;

        for (const restaurantData of restaurantsData) {
            // Assign custom seating preferences based on name or cuisine
            let prefs = ['Window View', 'Family Area', 'Quiet Corner', 'Near Entrance', 'Premium Seating'];
            
            const name = restaurantData.name.toLowerCase();
            const cuisine = (restaurantData.cuisine || '').toLowerCase();

            if (name.includes('daspalla')) {
                prefs = ['Window View', 'Family Hall', 'AC Section'];
            } else if (name.includes('fisherman')) {
                prefs = ['Lake View', 'Outdoor Garden', 'Balcony'];
            } else if (name.includes('paradise')) {
                prefs = ['Rooftop', 'Candle Light', 'Private Dining'];
            } else if (name.includes('olive')) {
                prefs = ['Beach View', 'Open Terrace'];
            } else if (cuisine.includes('south indian') || cuisine.includes('andhra')) {
                prefs = ['AC Section', 'Family Section', 'Window View', 'Quiet Corner'];
            } else if (cuisine.includes('seafood') || cuisine.includes('continental')) {
                prefs = ['Lake View', 'Outdoor Deck', 'Window Seating'];
            } else if (cuisine.includes('bbq') || cuisine.includes('grill')) {
                prefs = ['Live Grill Side', 'Rooftop Deck', 'Family Zone'];
            } else if (cuisine.includes('cafe') || cuisine.includes('bakery')) {
                prefs = ['Quiet Corner', 'Window View', 'Outdoor Patio'];
            } else if (cuisine.includes('chinese') || cuisine.includes('north indian') || cuisine.includes('hyderabadi')) {
                prefs = ['Premium Booth', 'Family Hall', 'Main Dining Room'];
            }

            restaurantData.seatingPreferences = prefs;

            await Restaurant.create(restaurantData);
            console.log(`Inserted restaurant: ${restaurantData.name} (${restaurantData.location})`);
            insertedCount++;
        }

        console.log('\n--- Seeding Process Finished ---');
        console.log(`New Restaurants Inserted: ${insertedCount}`);
        process.exit(0);

    } catch (error) {
        console.error('Error during restaurant seeding:', error);
        process.exit(1);
    }
}

if (require.main === module) {
    seedRestaurants();
}

module.exports = { restaurantsData };
