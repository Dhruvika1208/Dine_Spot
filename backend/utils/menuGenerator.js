const MenuItem = require('../models/MenuItem');

const CUISINE_DISHES = {
    'Biryani': [
        {
            name: 'Chicken Dum Biryani',
            description: 'Fragrant long-grain basmati rice cooked with juicy chicken, aromatic spices, and saffron.',
            category: 'Main Course',
            price: 290,
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Special Mutton Juicy Mandi',
            description: 'Traditional Arabian styled rice platter served with tender mutton pieces and special hot sauce.',
            category: 'Main Course',
            price: 480,
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Paneer Zafrani Biryani',
            description: 'Saffron flavored basmati rice layered with marinated paneer cubes and fried onions.',
            category: 'Main Course',
            price: 240,
            image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Chicken Fry Piece Biryani',
            description: 'Basmati rice cooked in rich spices, topped with crispy spiced chicken fry pieces.',
            category: 'Main Course',
            price: 320,
            image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Chicken Lollipop (6 Pcs)',
            description: 'Crispy fried chicken wings coated in a spicy red Indo-Chinese marinade.',
            category: 'Starter',
            price: 260,
            image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Chilli Chicken Dry',
            description: 'Diced chicken tossed with fresh bell peppers, onions, and green chillies in a soy-chilli sauce.',
            category: 'Starter',
            price: 240,
            image: 'https://images.unsplash.com/photo-1603496988941-d020ff61aa31?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Double Ka Meetha',
            description: 'Andhra style bread pudding soaked in saffron milk, cardamoms, and topped with dry fruits.',
            category: 'Dessert',
            price: 130,
            image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Qubani Ka Meetha',
            description: 'Classic Hyderabadi sweet dish made from dried apricots, served with fresh cream.',
            category: 'Dessert',
            price: 150,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Tangdi Kabab (3 Pcs)',
            description: 'Juicy chicken drumsticks marinated in rich yogurt, cashew paste, and charcoal grilled.',
            category: 'Starter',
            price: 280,
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Mint Lime Mocktail',
            description: 'Refreshing summer drink with fresh lime juice, crushed mint leaves, and a splash of club soda.',
            category: 'Beverage',
            price: 120,
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'Italian': [
        {
            name: 'Margherita Pizza',
            description: 'Classic hand-tossed crust topped with rich tomato sauce, fresh mozzarella cheese, and fresh basil.',
            category: 'Main Course',
            price: 240,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Fettuccine Alfredo Pasta',
            description: 'Rich fettuccine pasta tossed in a creamy parmesan cheese sauce with fresh parsley.',
            category: 'Main Course',
            price: 280,
            image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Garlic Bread with Cheese',
            description: 'Freshly baked baguette slices spread with garlic butter and loaded with melted mozzarella.',
            category: 'Starter',
            price: 150,
            image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Penne Arrabiata',
            description: 'Penne pasta in a spicy tomato sauce seasoned with fresh garlic, red chilli flakes, and olive oil.',
            category: 'Main Course',
            price: 260,
            image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Classic Bruschetta (4 Pcs)',
            description: 'Toasted Italian bread topped with ripe diced tomatoes, garlic, extra virgin olive oil, and balsamic glaze.',
            category: 'Starter',
            price: 160,
            image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Spinach & Ricotta Ravioli',
            description: 'Handmade ravioli filled with fresh spinach and creamy ricotta cheese in a light sage butter sauce.',
            category: 'Main Course',
            price: 340,
            image: 'https://images.unsplash.com/photo-1587740908075-9e245a707a6d?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Classic Tiramisu',
            description: 'Layered Italian dessert made with coffee-soaked ladyfingers, whipped mascarpone cream, and cocoa powder.',
            category: 'Dessert',
            price: 220,
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Panna Cotta with Berries',
            description: 'Silky, chilled Italian cream custard topped with a sweet mixed berry coulis.',
            category: 'Dessert',
            price: 180,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Minestrone Soup',
            description: 'A thick Italian soup made with seasonal vegetables, beans, and pasta in a rich tomato broth.',
            category: 'Starter',
            price: 140,
            image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Italian Iced Soda',
            description: 'Chilled mineral water mixed with raspberry syrup, cream, and crushed ice.',
            category: 'Beverage',
            price: 130,
            image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'Chinese': [
        {
            name: 'Veg Hakka Noodles',
            description: 'Stir-fried noodles tossed with crisp cabbage, carrots, bell peppers, spring onions, and light soy sauce.',
            category: 'Main Course',
            price: 180,
            image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Schezwan Fried Rice',
            description: 'Spicy wok-tossed rice flavored with fiery homemade Schezwan sauce, garlic, and fresh vegetables.',
            category: 'Main Course',
            price: 190,
            image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Veg Manchurian Gravy',
            description: 'Deep-fried mixed vegetable dumplings simmered in a tangy, savory ginger-garlic sauce.',
            category: 'Main Course',
            price: 210,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Crispy Spring Rolls (4 Pcs)',
            description: 'Golden fried wrappers stuffed with seasoned shredded vegetables, served with sweet chilli dip.',
            category: 'Starter',
            price: 150,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Gobi Manchurian Dry',
            description: 'Crisp fried cauliflower florets tossed in a spicy, sweet, and sour Indo-Chinese glaze.',
            category: 'Starter',
            price: 170,
            image: 'https://images.unsplash.com/photo-1603496988941-d020ff61aa31?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Hot & Sour Chicken Soup',
            description: 'Fiery, tangy soup packed with shredded chicken, bamboo shoots, mushrooms, and tofu.',
            category: 'Starter',
            price: 130,
            image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Kung Pao Chicken',
            description: 'Stir-fried chicken cubes with peanuts, bell peppers, and dried red chillies in a savory-sweet glaze.',
            category: 'Main Course',
            price: 290,
            image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Fried Darsaan with Vanilla Ice Cream',
            description: 'Flat Chinese honey noodles fried crisp, sprinkled with sesame seeds, served with vanilla ice cream.',
            category: 'Dessert',
            price: 160,
            image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Steam Dim Sum (6 Pcs)',
            description: 'Delicate steamed dumplings stuffed with minced fresh garden vegetables and water chestnuts.',
            category: 'Starter',
            price: 180,
            image: 'https://images.unsplash.com/photo-1496116211217-41af89634433?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Jasmine Green Tea',
            description: 'Freshly brewed floral Chinese tea, served warm in a ceramic pot.',
            category: 'Beverage',
            price: 120,
            image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'South Indian': [
        {
            name: 'Ghee Karam Masala Dosa',
            description: 'Crispy rice and lentil crepe smeared with spicy red chutney, loaded with potato mash and ghee.',
            category: 'Starter',
            price: 140,
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Steamed Ghee Idli (3 Pcs)',
            description: 'Soft, pillowy steamed rice cakes served hot with sambar, peanut chutney, and coconut chutney.',
            category: 'Starter',
            price: 120,
            image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Crispy Medu Vada (3 Pcs)',
            description: 'Deep-fried savory lentil doughnuts with black pepper and ginger, served crispy with chutney.',
            category: 'Starter',
            price: 130,
            image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'South Indian Special Royal Meals',
            description: 'A massive traditional banana-leaf platter with rice, sambar, rasam, curd, 3 veg curries, papad, and sweet.',
            category: 'Main Course',
            price: 280,
            image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Onion Rava Dosa',
            description: 'Semolina based thin crispy crepe sprinkled with chopped onions, green chillies, and cumin seeds.',
            category: 'Starter',
            price: 150,
            image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Tomato Onion Uttapam',
            description: 'Thick savory pancake topped with freshly chopped tomatoes, red onions, and green coriander.',
            category: 'Starter',
            price: 140,
            image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Malabar Parotta with Veg Kurma',
            description: 'Multi-layered flakey flatbread served with a delicious, coconut-based seasonal mixed vegetable gravy.',
            category: 'Main Course',
            price: 190,
            image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Creamy Elaneer Payasam',
            description: 'Delightful dessert made with tender coconut pulp, condensed milk, and fresh cardamom.',
            category: 'Dessert',
            price: 160,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Andhra Pesarattu Upma Dosa',
            description: 'Green gram crepe stuffed with flavorful suji upma, served with ginger chutney.',
            category: 'Starter',
            price: 160,
            image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Filter Coffee & Sweet Combo',
            description: 'Traditional frothy South Indian drip-brew coffee served hot in brass davara along with a sweet laddu.',
            category: 'Beverage',
            price: 120,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'North Indian': [
        {
            name: 'Murgh Makhani (Butter Chicken)',
            description: 'Tender tandoori chicken cooked in a rich, creamy, and mildly sweet tomato butter gravy.',
            category: 'Main Course',
            price: 340,
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Paneer Tikka (6 Pcs)',
            description: 'Cottage cheese cubes marinated in yogurt spices and grilled with bell peppers in a tandoor clay oven.',
            category: 'Starter',
            price: 240,
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Dal Makhani',
            description: 'Slow-cooked black lentils and red kidney beans cooked with fresh butter, cream, and rich ground spices.',
            category: 'Main Course',
            price: 210,
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Butter Naan Basket',
            description: 'Assortment of freshly baked plain naan, butter naan, and garlic naan from the tandoor.',
            category: 'Main Course',
            price: 150,
            image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Shahi Paneer',
            description: 'Paneer cubes cooked in a thick, rich, aromatic gravy of cashew paste, onions, tomatoes, and cream.',
            category: 'Main Course',
            price: 260,
            image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Kadhai Chicken',
            description: 'Diced chicken cooked with freshly ground spices, bell peppers, tomatoes, and red onions in a kadhai wok.',
            category: 'Main Course',
            price: 320,
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Warm Gulab Jamun (3 Pcs)',
            description: 'Soft golden milk solid dumplings soaked in sweet cardamom-flavored sugar syrup, served hot.',
            category: 'Dessert',
            price: 120,
            image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Rasmalai (2 Pcs)',
            description: 'Chilled soft cottage cheese dumplings soaked in sweet, saffron, and pistachio flavored milk.',
            category: 'Dessert',
            price: 130,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Tandoori Murgh (Half)',
            description: 'Spring chicken marinated in a spice-heavy yogurt blend and roasted in a traditional clay oven.',
            category: 'Starter',
            price: 290,
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Special Masala Chaas',
            description: 'Chilled buttermilk flavored with roasted cumin seeds, fresh coriander, ginger, and black salt.',
            category: 'Beverage',
            price: 120,
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'Andhra': [
        {
            name: 'Andhra Kodi Curry',
            description: 'Fiery Andhra-style chicken curry cooked with dry spices, coconut, and fresh coriander leaves.',
            category: 'Main Course',
            price: 310,
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Gongura Mutton Curry',
            description: 'Tender mutton cooked in a tangy sauce made of fresh sorrel leaves (Gongura) and green chillies.',
            category: 'Main Course',
            price: 430,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Royyala Vepudu (Prawns Fry)',
            description: 'Juicy prawns tossed with curry leaves, crushed black pepper, onions, and local spices.',
            category: 'Starter',
            price: 380,
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Chepala Pulusu (Nellore Fish Curry)',
            description: 'Tangy and spicy fish curry prepared in a tamarind base with raw mango slices.',
            category: 'Main Course',
            price: 350,
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Andhra Pappu & Ghee with Rice',
            description: 'Comforting yellow lentils (Pappu) served with hot steamed rice, pure ghee, and spicy avakaya pickle.',
            category: 'Main Course',
            price: 180,
            image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Mirchi Bajji (4 Pcs)',
            description: 'Large local green chillies stuffed with onion masala, battered, deep fried, and topped with chaat masala.',
            category: 'Starter',
            price: 130,
            image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Sweet Pootharekulu (4 Pcs)',
            description: 'Andhra special paper-thin sweet sheets folded with pure ghee, sugar powder, and crushed dry fruits.',
            category: 'Dessert',
            price: 150,
            image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Spicy Natu Kodi Pulusu',
            description: 'Country chicken cooked in a rustic, fiery country-style broth filled with ground chillies.',
            category: 'Main Course',
            price: 360,
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Special Nimmakaya (Lemon) Soda',
            description: 'Refreshing sweet and salty lemon juice mixed with carbonated soda water and black salt.',
            category: 'Beverage',
            price: 120,
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'Seafood': [
        {
            name: 'Grilled Tiger Prawns',
            description: 'Fresh giant tiger prawns marinated in herbs, lemon juice, and grilled over charcoal.',
            category: 'Main Course',
            price: 590,
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Tandoori Fish Tikka',
            description: 'Chunky fish fillets marinated in tandoori yogurt spices and barbecued in the clay oven.',
            category: 'Starter',
            price: 380,
            image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Crispy Fried Calamari rings',
            description: 'Golden, crispy, batter-fried squid rings served with spicy garlic aioli sauce.',
            category: 'Starter',
            price: 340,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Goan Fish Curry with Steamed Rice',
            description: 'Local fish cooked in coconut milk gravy flavored with tamarind, coriander, and red chillies.',
            category: 'Main Course',
            price: 390,
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Crab Masala (Dry)',
            description: 'Crab cooked in a rich onion-tomato paste seasoned with local spices and green chillies.',
            category: 'Main Course',
            price: 490,
            image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Golden Prawn Biryani',
            description: 'Fragrant basmati rice layered with spiced prawns, fried onions, coriander, and pure ghee.',
            category: 'Main Course',
            price: 360,
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Chilled Coconut Water',
            description: 'Fresh tender coconut water served chilled with soft coconut meat slices.',
            category: 'Beverage',
            price: 120,
            image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Baked Apple Pie',
            description: 'Warm spiced apple filling baked in flaky crust, served with fresh whipped cream.',
            category: 'Dessert',
            price: 180,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'BBQ': [
        {
            name: 'BBQ Chicken Wings (8 Pcs)',
            description: 'Juicy chicken wings coated in sweet, sticky, and smoky hickory barbecue glaze.',
            category: 'Starter',
            price: 260,
            image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Smoked Pork Ribs',
            description: 'Slow-smoked baby back ribs brushed with apple cider glaze, falling off the bone.',
            category: 'Main Course',
            price: 580,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Grilled BBQ Paneer Tikka',
            description: 'Thick cottage cheese cubes glazed in barbecue sauce, grilled with fresh bell peppers.',
            category: 'Starter',
            price: 220,
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Pulled Chicken Burger',
            description: 'Slow cooked pulled smoked chicken breast layered with coleslaw, pickles, and hickory sauce on a brioche bun.',
            category: 'Main Course',
            price: 260,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Smoked Beef Brisket Platter',
            description: 'Slow oak-wood smoked tender beef brisket slices, served with corn bread and potato salad.',
            category: 'Main Course',
            price: 680,
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Charcoal Grilled Pineapple',
            description: 'Pineapple slices marinated in cinnamon sugar, grilled and served warm with a scoop of coconut ice cream.',
            category: 'Dessert',
            price: 150,
            image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Classic Lemon Iced Tea',
            description: 'Freshly brewed black tea infused with sweet syrup, fresh lemon, and ice.',
            category: 'Beverage',
            price: 120,
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'Cafe': [
        {
            name: 'Classic Cheese Burger',
            description: 'Flame-grilled prime beef patty, melted cheddar cheese, lettuce, tomato, and chef sauce on a toasted bun.',
            category: 'Main Course',
            price: 240,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Grilled Club Sandwich',
            description: 'Double decker toasted bread stuffed with smoked chicken breast, boiled egg, cheese, lettuce, and mayo.',
            category: 'Starter',
            price: 190,
            image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Salted French Fries',
            description: 'Crispy golden fried potato batons seasoned with sea salt, served with garlic mayo dip.',
            category: 'Starter',
            price: 120,
            image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Hot Cappuccino',
            description: 'Espresso shot with steamed milk, topped with a thick layer of silky milk foam.',
            category: 'Beverage',
            price: 140,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'New York Blueberry Cheesecake',
            description: 'Classic rich and creamy cheesecake topped with sweet wild blueberry compote.',
            category: 'Dessert',
            price: 220,
            image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Iced Caramel Macchiato',
            description: 'Espresso mixed with vanilla syrup, milk, and ice, drizzled with sweet caramel sauce.',
            category: 'Beverage',
            price: 180,
            image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Hot Fudgy Brownie with Ice Cream',
            description: 'Rich dark chocolate brownie served warm with a scoop of vanilla bean ice cream and hot chocolate sauce.',
            category: 'Dessert',
            price: 160,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Waffles with Chocolate Syrup',
            description: 'Freshly baked golden waffle dusted with powdered sugar, served with chocolate syrup and butter.',
            category: 'Dessert',
            price: 210,
            image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'Continental': [
        {
            name: 'Grilled Herb Chicken Breast',
            description: 'Juicy chicken breast marinated in olive oil and rosemary, served with sautéed vegetables and mushroom sauce.',
            category: 'Main Course',
            price: 360,
            image: 'https://images.unsplash.com/photo-1532550907401-a500c9af5743?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Classic Fish and Chips',
            description: 'Crispy batter-fried fish fillets served with golden French fries and tartar sauce.',
            category: 'Main Course',
            price: 380,
            image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Creamy Mushroom Stroganoff',
            description: 'Assorted mushrooms cooked in a rich, creamy sour cream sauce, served over buttered rice.',
            category: 'Main Course',
            price: 290,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Caesar Salad with Grilled Chicken',
            description: 'Crisp romaine lettuce tossed in Caesar dressing, topped with croutons, parmesan, and chicken strips.',
            category: 'Starter',
            price: 240,
            image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Garlic Butter Sautéed Mushrooms',
            description: 'Button mushrooms tossed in fresh garlic, herbs, and premium unsalted butter.',
            category: 'Starter',
            price: 180,
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Crème Brûlée',
            description: 'Rich custard base topped with a contrasting layer of hardened caramelized sugar.',
            category: 'Dessert',
            price: 160,
            image: 'https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Fresh Iced Peach Tea',
            description: 'Chilled black tea base infused with sweet peach syrup and mint leaves.',
            category: 'Beverage',
            price: 110,
            image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'Bakery': [
        {
            name: 'Black Forest Cake Slice',
            description: 'Rich chocolate sponge layers filled with whipped cream, cherries, and shaved chocolate.',
            category: 'Dessert',
            price: 120,
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Chocolate Croissant',
            description: 'Flaky, buttery pastry filled with rich dark chocolate, baked golden brown.',
            category: 'Dessert',
            price: 90,
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Savory Paneer Puff',
            description: 'Flaky puff pastry stuffed with spiced cottage cheese filling, baked fresh.',
            category: 'Starter',
            price: 60,
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Red Velvet Cupcake',
            description: 'Moist red velvet cupcake topped with smooth vanilla cream cheese frosting.',
            category: 'Dessert',
            price: 80,
            image: 'https://images.unsplash.com/photo-1614707267537-b85acf00c4b8?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Fresh Blueberry Muffin',
            description: 'Soft muffin packed with sweet blueberries, finished with a sugar-dust crumble.',
            category: 'Dessert',
            price: 80,
            image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Hot Café Latte',
            description: 'Freshly pulled espresso shot topped with steamed milk and a thin layer of foam.',
            category: 'Beverage',
            price: 110,
            image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'Fast Food': [
        {
            name: 'Double Cheese Veggie Burger',
            description: 'Crispy vegetable patty layered with double cheddar, lettuce, onions, and burger sauce.',
            category: 'Main Course',
            price: 160,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Crunchy Chicken Burger',
            description: 'Batter-fried chicken breast fillet served with fresh mayonnaise and lettuce on sesame bun.',
            category: 'Main Course',
            price: 190,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Classic Salted French Fries',
            description: 'Thick-cut golden potato fries seasoned with fine sea salt, served with ketchup.',
            category: 'Starter',
            price: 100,
            image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Crispy Chicken Nuggets (6 Pcs)',
            description: 'Tender chicken pieces coated in seasoned breadcrumbs and fried to golden perfection.',
            category: 'Starter',
            price: 140,
            image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Golden Onion Rings (8 Pcs)',
            description: 'Sweet white onion slices coated in seasoned batter and fried crispy.',
            category: 'Starter',
            price: 110,
            image: 'https://images.unsplash.com/photo-1639024471283-2bc7b3c6a267?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Creamy Oreo Milkshake',
            description: 'Thick vanilla ice cream blended with crushed Oreo cookies, milk, and chocolate syrup.',
            category: 'Beverage',
            price: 130,
            image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'Hyderabadi': [
        {
            name: 'Special Hyderabadi Chicken Biryani',
            description: 'World-famous slow-cooked basmati rice layered with raw marinated chicken, saffron, and mint.',
            category: 'Main Course',
            price: 310,
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Royal Hyderabadi Mutton Biryani',
            description: 'Traditional dum-cooked long grain rice with tender lamb pieces, cooked with local spices.',
            category: 'Main Course',
            price: 450,
            image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Hyderabadi Mutton Haleem',
            description: 'Slow-cooked stew of wheat, barley, lentils, minced mutton, and spices, topped with fried onions and lime.',
            category: 'Starter',
            price: 290,
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Spicy Chicken 65',
            description: 'Deep-fried chicken pieces marinated in local spices and tossed with curry leaves and green chillies.',
            category: 'Starter',
            price: 240,
            image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Qubani Ka Meetha with Cream',
            description: 'Classic compote made from dried apricots, served with thick fresh cream.',
            category: 'Dessert',
            price: 150,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Double Ka Meetha',
            description: 'Deep-fried bread slices soaked in cardamom milk, saffron, and garnished with roasted cashews.',
            category: 'Dessert',
            price: 130,
            image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'Vegetarian': [
        {
            name: 'Paneer Butter Masala',
            description: 'Soft cottage cheese cubes cooked in a rich, creamy, tomato-onion butter gravy.',
            category: 'Main Course',
            price: 240,
            image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Dal Makhani Special',
            description: 'Black lentils slow-cooked overnight with fresh cream, butter, and authentic spices.',
            category: 'Main Course',
            price: 200,
            image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Kadhai Paneer',
            description: 'Cottage cheese cooked with bell peppers, tomatoes, and freshly ground kadhai spices.',
            category: 'Main Course',
            price: 250,
            image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Crispy Veg Spring Rolls (4 Pcs)',
            description: 'Deep-fried wrappers stuffed with seasoned cabbage, carrots, and spring onion, served with sweet chilli dip.',
            category: 'Starter',
            price: 130,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Melt-in-mouth Veg Hara Bhara Kabab',
            description: 'Deep-fried patties made of spinach, green peas, and potatoes, seasoned with local spices.',
            category: 'Starter',
            price: 160,
            image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Warm Gulab Jamun (3 Pcs)',
            description: 'Soft milk solids dumplings fried and soaked in sugar syrup flavored with cardamoms.',
            category: 'Dessert',
            price: 110,
            image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Sweet Mango Lassi',
            description: 'Chilled yogurt drink blended with fresh sweet mango pulp and sugar.',
            category: 'Beverage',
            price: 120,
            image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80'
        }
    ],
    'Street Food': [
        {
            name: 'Premium Pani Puri (8 Pcs)',
            description: 'Crispy hollow puris filled with potatoes and chickpeas, served with sweet and spicy flavored water.',
            category: 'Starter',
            price: 90,
            image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Special Pav Bhaji',
            description: 'Spiced thick vegetable mash cooked in butter, served hot with toasted buttered soft bread rolls.',
            category: 'Main Course',
            price: 140,
            image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Samosa Chaat',
            description: 'Crushed potato samosas topped with warm chickpeas, sweetened yogurt, tamarind and mint chutneys.',
            category: 'Starter',
            price: 110,
            image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Dahi Puri (6 Pcs)',
            description: 'Puris filled with potatoes, chana, topped with sweet yogurt, tamarind sauce, and sev.',
            category: 'Starter',
            price: 100,
            image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Chilled Kulfi Falooda',
            description: 'Traditional Indian cardamom flavored ice cream served with vermicelli and rose syrup.',
            category: 'Dessert',
            price: 120,
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80'
        },
        {
            name: 'Special Masala Chai',
            description: 'Brewed black tea infused with ginger, green cardamoms, and milk, served hot.',
            category: 'Beverage',
            price: 50,
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
        }
    ]
};

// Fallback for Multi Cuisine
const MULTI_CUISINE_POOL = [
    ...CUISINE_DISHES['Biryani'],
    ...CUISINE_DISHES['Italian'],
    ...CUISINE_DISHES['Chinese'],
    ...CUISINE_DISHES['South Indian'],
    ...CUISINE_DISHES['North Indian'],
    ...CUISINE_DISHES['Andhra'],
    ...CUISINE_DISHES['Seafood'],
    ...CUISINE_DISHES['BBQ'],
    ...CUISINE_DISHES['Cafe'],
    ...CUISINE_DISHES['Continental'],
    ...CUISINE_DISHES['Bakery'],
    ...CUISINE_DISHES['Fast Food'],
    ...CUISINE_DISHES['Hyderabadi'],
    ...CUISINE_DISHES['Vegetarian'],
    ...CUISINE_DISHES['Street Food']
];

/**
 * Automatically generates 8-15 realistic dishes for a newly inserted restaurant.
 * @param {string} restaurantId - The MongoDB ObjectId of the restaurant.
 * @param {string} cuisineType - The inferred cuisine type of the restaurant.
 */
/**
 * Calculates a realistic Indian Rupee price for a dish based on category, restaurant rating, and cuisine.
 * @param {string} category - Starter, Main Course, Dessert, Beverage, etc.
 * @param {string} cuisine - e.g. Andhra, Seafood, Italian, Biryani
 * @param {number} rating - 1.0 to 5.0 (default 4.0)
 * @returns {number} The calculated price in INR.
 */
function calculateRealisticPrice(category, cuisine, rating = 4.0) {
    const cuisineLower = (cuisine || '').toLowerCase();
    const catLower = (category || '').toLowerCase();

    // 1. Establish base price range by category
    let minPrice = 150;
    let maxPrice = 300;

    if (catLower.includes('beverage') || catLower.includes('water') || catLower.includes('drink') || catLower.includes('soda') || catLower.includes('tea') || catLower.includes('coffee')) {
        minPrice = 20;
        maxPrice = 80;
    } else if (catLower.includes('starter') || catLower.includes('appetizer')) {
        minPrice = 120;
        maxPrice = 350;
    } else if (catLower.includes('main') || catLower.includes('course')) {
        minPrice = 180;
        maxPrice = 600;
    } else if (catLower.includes('dessert') || catLower.includes('sweet')) {
        minPrice = 80;
        maxPrice = 250;
    }

    // 2. Adjust base range for premium cuisines/categories (e.g. Seafood, BBQ, Italian fine dining)
    if (cuisineLower.includes('seafood') || cuisineLower.includes('bbq') || cuisineLower.includes('barbeque') || cuisineLower.includes('grill') || cuisineLower.includes('steak')) {
        if (catLower.includes('main')) {
            minPrice = 400;
            maxPrice = 1200;
        } else if (catLower.includes('starter')) {
            minPrice = 250;
            maxPrice = 500;
        }
    } else if (cuisineLower.includes('italian')) {
        // Italian fine dining is slightly premium
        minPrice = Math.round(minPrice * 1.2);
        maxPrice = Math.round(maxPrice * 1.3);
    } else if (cuisineLower.includes('andhra') || cuisineLower.includes('south indian')) {
        // Local/Andhra/South Indian restaurants are very affordable
        minPrice = Math.round(minPrice * 0.85);
        maxPrice = Math.round(maxPrice * 0.9);
    }

    // 3. Multiplier based on restaurant rating (higher rating = fine dining/higher quality = slightly higher pricing)
    const ratingFactor = 1 + (rating - 4.0) * 0.25;

    // 4. Calculate deterministic price within the range
    let targetPrice = minPrice + Math.random() * (maxPrice - minPrice);
    targetPrice = targetPrice * ratingFactor;

    // Round to nearest 10 for neat Indian pricing (e.g., ₹220 instead of ₹223.5)
    return Math.max(Math.round(targetPrice / 10) * 10, minPrice);
}

exports.generateMenuForRestaurant = async (restaurantId, cuisineType) => {
    try {
        console.log(`\nDEBUG: [Menu Generation] Generating menu for Restaurant ID: ${restaurantId} (Cuisine: ${cuisineType})`);
        
        // Fetch restaurant rating dynamically
        const Restaurant = require('../models/Restaurant');
        const restaurant = await Restaurant.findById(restaurantId);
        const rating = restaurant ? restaurant.rating : 4.0;

        let pool = null;
        if (cuisineType && typeof cuisineType === 'string') {
            const keys = Object.keys(CUISINE_DISHES);
            for (const k of keys) {
                if (cuisineType.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(cuisineType.toLowerCase())) {
                    pool = CUISINE_DISHES[k];
                    break;
                }
            }
        }
        
        if (!pool || pool.length === 0) {
            console.log(`DEBUG: [Menu Generation] No exact pool for "${cuisineType}". Using Multi Cuisine pool.`);
            pool = MULTI_CUISINE_POOL;
        }

        // Determine how many dishes to generate (randomly 8 to 15, capped at the pool size if pool is smaller)
        const minDishes = Math.min(8, pool.length);
        const maxDishes = Math.min(15, pool.length);
        const numDishes = Math.floor(Math.random() * (maxDishes - minDishes + 1)) + minDishes;

        console.log(`DEBUG: [Menu Generation] Randomly chosen menu size: ${numDishes} items`);

        // Shuffle the pool to get unique random items
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selectedDishes = shuffled.slice(0, numDishes);

        // Prep the dish documents
        const menuItemsToInsert = selectedDishes.map((dish, index) => {
            const calculatedPrice = calculateRealisticPrice(dish.category, cuisineType, rating);
            return {
                restaurantId: restaurantId,
                name: dish.name,
                description: dish.description,
                price: calculatedPrice,
                category: dish.category,
                // Ensure unique images by adding a unique query parameter or using the dish's distinct image
                image: dish.image ? `${dish.image}&sig=${restaurantId}_${index}` : undefined,
                available: true,
                availability: true // Support both keys for compliance
            };
        });

        // Insert into database
        const inserted = await MenuItem.insertMany(menuItemsToInsert);
        console.log(`DEBUG: [Menu Generation] SUCCESS: Inserted ${inserted.length} menu items into database.`);
        return inserted;
    } catch (error) {
        console.error('DEBUG: [Menu Generation] ERROR: Failed to generate menu items:', error.message);
        throw error;
    }
};
