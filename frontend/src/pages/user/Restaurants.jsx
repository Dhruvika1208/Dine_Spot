import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, Loader2, Sparkles, Filter, Heart, X, Clock, Coffee, UtensilsCrossed, Sofa, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '../../components/SafeImage';
import { useFavorites } from '../../context/FavoritesContext';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // Drawer visibility and 17 combined filters state
    const [showFilters, setShowFilters] = useState(false);
    const [userCoords, setUserCoords] = useState(null);
    const [filters, setFilters] = useState({
        city: '',
        cuisine: '',
        rating: '',
        category: '',
        priceRange: ''
    });
    
    const { toggleFavorite, isFavorite } = useFavorites();

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const params = { search };
            // Let's pass the base search parameter to the backend
            const { data } = await axiosInstance.get(`/api/restaurants`, { params });
            setRestaurants(data);
        } catch (error) {
            console.error('Discovery Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    // Geolocation tracker for Nearby filter
    useEffect(() => {
        if (filters.nearby && !userCoords) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserCoords({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (err) => {
                    console.error('Geolocation failed:', err);
                    alert('Could not obtain your physical location. Please check browser permissions.');
                    setFilters(prev => ({ ...prev, nearby: false }));
                }
            );
        }
    }, [filters.nearby, userCoords]);

    // Haversine formula for distance calculation in kilometers
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        if (!lat1 || !lon1 || !lat2 || !lon2) return 5; // Fallback to 5km for seeded restaurants to prevent hiding them
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Helper function to parse 12h/24h time to minutes from midnight
    const parseTimeToMinutes = (timeStr) => {
        if (!timeStr) return null;
        const str = String(timeStr).trim().toUpperCase();
        const isPM = str.includes('PM');
        const isAM = str.includes('AM');
        const clean = str.replace(/[^0-9:]/g, '');
        const parts = clean.split(':');
        let hours = parseInt(parts[0], 10) || 0;
        const minutes = parseInt(parts[1], 10) || 0;

        if (isPM && hours < 12) hours += 12;
        if (isAM && hours === 12) hours = 0;
        return hours * 60 + minutes;
    };

    // Client-side filtering logic for core parameters
    const applyFilters = (list) => {
        return list.filter(res => {
            const text = `${res.name || ''} ${res.cuisine || ''} ${res.location || ''} ${res.description || ''} ${res.highlightMessage || ''}`.toLowerCase();

            // 1. Search Query
            if (search.trim()) {
                const query = search.trim().toLowerCase();
                if (!text.includes(query)) return false;
            }

            // 2. City
            if (filters.city && res.location && !res.location.toLowerCase().includes(filters.city.toLowerCase())) {
                return false;
            }

            // 3. Cuisine
            if (filters.cuisine && res.cuisine && !res.cuisine.toLowerCase().includes(filters.cuisine.toLowerCase())) {
                return false;
            }

            // 4. Rating
            if (filters.rating) {
                const minRating = parseFloat(filters.rating);
                if ((res.rating || 0) < minRating) return false;
            }

            // 5. Category
            if (filters.category) {
                const cat = filters.category.toLowerCase();
                const matchesCategory = 
                    (res.cuisine && res.cuisine.toLowerCase().includes(cat)) ||
                    (res.description && res.description.toLowerCase().includes(cat)) ||
                    (res.category && res.category.toLowerCase().includes(cat)) ||
                    text.includes(cat);
                if (!matchesCategory) return false;
            }

            // 6. Price Range
            if (filters.priceRange) {
                const targetPrice = filters.priceRange;
                const resPrice = res.priceRange || '$';
                if (resPrice !== targetPrice && !resPrice.includes(targetPrice)) {
                    return false;
                }
            }

            return true;
        });
    };

    const sortRajahmundryFirst = (list) => {
        const getPriorityScore = (resObj) => {
            const name = (resObj.name || '').toLowerCase();
            const loc = (resObj.location || '').toLowerCase();
            const desc = (resObj.description || '').toLowerCase();
            const text = `${name} ${loc} ${desc}`;

            // #1: GVR Signature
            if (name.includes('gvr signature') || name.includes('gvr')) {
                return 1;
            }

            // #2: China Town RJ
            if (name.includes('china town') || name.includes('chinatown')) {
                return 2;
            }

            // #3: Other Rajahmundry restaurants
            if (text.includes('rajahmundry') || text.includes('rajamahendravaram') || text.includes('rjy')) {
                return 3;
            }

            // #4: Other cities
            return 4;
        };

        return [...list].sort((a, b) => {
            const scoreA = getPriorityScore(a);
            const scoreB = getPriorityScore(b);

            if (scoreA !== scoreB) {
                return scoreA - scoreB;
            }

            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            if (ratingB !== ratingA) {
                return ratingB - ratingA;
            }

            return (a.name || '').localeCompare(b.name || '');
        });
    };

    const filteredRestaurants = sortRajahmundryFirst(applyFilters(restaurants));
    const activeFiltersCount = Object.entries(filters).filter(([k, v]) => v === true || (typeof v === 'string' && v !== '')).length;

    return (
        <div className="bg-transparent min-h-screen py-10 text-slate-800 dark:text-slate-100 transition-colors duration-200">
            {/* Search Header */}
            <div className="max-w-6xl mx-auto px-6 mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="flex-grow max-w-2xl">
                        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-2 font-black uppercase tracking-widest text-[10px]">
                            <Search className="h-4 w-4" />
                            <span>Discovery Matrix</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase">The Global Grid</h1>
                        <p className="text-slate-400 dark:text-slate-400 font-bold italic mt-1 text-sm">Scan and secure tables across our elite establishments.</p>

                        <div className="mt-8 flex gap-4 relative group">
                            <div className="relative flex-grow">
                                <input
                                    type="text"
                                    placeholder="Search by name, cuisine or location..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 pl-8 pr-16 font-bold text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 outline-none transition-all placeholder:italic placeholder:font-medium text-sm"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchRestaurants()}
                                />
                                <button
                                    onClick={fetchRestaurants}
                                    className="absolute right-3 top-3 bottom-3 bg-slate-900 dark:bg-slate-700 text-white px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center shadow-lg"
                                >
                                    Scan
                                </button>
                            </div>

                            {/* Filter Button */}
                            <button
                                onClick={() => setShowFilters(true)}
                                className={`px-5 rounded-2xl flex items-center gap-2 border transition-all ${
                                    activeFiltersCount > 0
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-500'
                                }`}
                            >
                                <Filter className="h-5 w-5" />
                                <span className="font-bold text-xs uppercase tracking-widest hidden md:block">
                                    Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Container */}
            <main className="max-w-6xl mx-auto px-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">Syncing Establishment Data...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredRestaurants.length > 0 ? filteredRestaurants.map((res, i) => (
                                <motion.div
                                    key={res._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-4 group border border-slate-50 dark:border-slate-800/60 flex flex-col h-full transition-colors duration-200"
                                >
                                    {/* Image Container */}
                                    <div className="h-48 rounded-xl overflow-hidden relative mb-6">
                                        <SafeImage
                                            src={res.image}
                                            type="restaurant"
                                            keyword={res.cuisine}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            alt={res.name}
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavorite(res);
                                            }}
                                            className="absolute top-4 left-4 p-2.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform flex items-center justify-center z-10 border border-slate-100 dark:border-slate-700"
                                            aria-label={isFavorite(res._id) ? "Remove from favorites" : "Add to favorites"}
                                        >
                                            <Heart className={`h-4 w-4 transition-colors ${isFavorite(res._id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400 dark:text-slate-300 hover:text-rose-500'}`} />
                                        </button>
                                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-slate-800 dark:text-white flex items-center shadow-sm">
                                            <Star className="h-3 w-3 text-amber-500 mr-2 fill-amber-500" /> {res.rating || '4.5'}
                                        </div>
                                    </div>

                                    <div className="px-2 space-y-4 flex-grow flex flex-col justify-between">
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest italic">{res.cuisine}</span>
                                            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter uppercase italic line-clamp-1">{res.name}</h3>
                                            <div className="flex items-center text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-widest">
                                                <MapPin className="h-3.5 w-3.5 mr-1 text-indigo-500" /> {res.location}
                                            </div>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-bold italic line-clamp-2 mt-2">
                                                "{res.description || 'Access an unmatchable culinary experience at our elite destination.'}"
                                            </p>
                                        </div>

                                        <div className="pt-6">
                                            <Link
                                                to={`/restaurant/${res._id}`}
                                                className="w-full bg-slate-50 dark:bg-slate-800 group-hover:bg-slate-900 dark:group-hover:bg-slate-100 group-hover:text-white dark:group-hover:text-slate-900 text-slate-800 dark:text-slate-200 py-4 rounded-xl font-black transition-all uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2 border border-slate-100 dark:border-slate-800 group-hover:border-slate-900 dark:group-hover:border-slate-100"
                                            >
                                                <span>View Details</span>
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-full py-40 text-center space-y-6">
                                    <div className="bg-slate-100 dark:bg-slate-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                        <Filter className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest italic">No Establishments Found</h3>
                                    <p className="text-slate-400 dark:text-slate-500 font-bold italic text-sm">Attempt a different search parameter to re-index the grid.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </main>

            {/* Premium Sliding Side Drawer for Filters */}
            <AnimatePresence>
                {showFilters && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowFilters(false)}
                            className="fixed inset-0 bg-black z-50 cursor-pointer"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl z-50 overflow-y-auto flex flex-col transition-colors duration-200"
                        >
                            {/* Drawer Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-900 text-white">
                                <div>
                                    <h2 className="text-xl font-black uppercase tracking-tight italic">Filter Grid</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configure discovery parameters</p>
                                </div>
                                <button 
                                    onClick={() => setShowFilters(false)}
                                    className="p-2 hover:bg-white/10 rounded-xl text-white font-bold text-xs uppercase tracking-widest transition-all"
                                >
                                    Close
                                </button>
                            </div>

                            {/* Drawer Body */}
                            <div className="flex-grow p-6 space-y-8 overflow-y-auto">
                                {/* Basic Selection fields */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">Core Parameters</h3>
                                    
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 font-bold text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                                            value={filters.city}
                                            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                                        >
                                            <option value="">All Cities</option>
                                            <option value="Rajahmundry">Rajahmundry</option>
                                            <option value="Kakinada">Kakinada</option>
                                            <option value="Amalapuram">Amalapuram</option>
                                            <option value="Visakhapatnam">Visakhapatnam</option>
                                            <option value="Vijayawada">Vijayawada</option>
                                            <option value="Guntur">Guntur</option>
                                            <option value="Tirupati">Tirupati</option>
                                            <option value="Hyderabad">Hyderabad</option>
                                            <option value="Bangalore">Bangalore</option>
                                            <option value="Chennai">Chennai</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Cuisine</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 font-bold text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                                            value={filters.cuisine}
                                            onChange={(e) => setFilters(prev => ({ ...prev, cuisine: e.target.value }))}
                                        >
                                            <option value="">All Cuisines</option>
                                            <option value="Andhra">Andhra</option>
                                            <option value="South Indian">South Indian</option>
                                            <option value="North Indian">North Indian</option>
                                            <option value="Chinese">Chinese</option>
                                            <option value="Italian">Italian</option>
                                            <option value="Continental">Continental</option>
                                            <option value="Cafe">Cafe / Bakery</option>
                                            <option value="BBQ">BBQ / Grill</option>
                                            <option value="Seafood">Seafood</option>
                                            <option value="Biryani">Biryani / Hyderabadi</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 font-bold text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                                            value={filters.category}
                                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                        >
                                            <option value="">All Categories</option>
                                            <option value="Dine-in">Fine Dining</option>
                                            <option value="Buffet">Buffet / Grill</option>
                                            <option value="Cafe">Cafe & Bakery</option>
                                            <option value="Bar">Bar & Bistro</option>
                                            <option value="Vegetarian">Pure Veg</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Rating</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 font-bold text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                                            value={filters.rating}
                                            onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                                        >
                                            <option value="">All Ratings</option>
                                            <option value="4.5">4.5+ Stars</option>
                                            <option value="4.0">4.0+ Stars</option>
                                            <option value="3.5">3.5+ Stars</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Range</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 font-bold text-xs text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                                            value={filters.priceRange}
                                            onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                                        >
                                            <option value="">All Price Ranges</option>
                                            <option value="$">Low (₹)</option>
                                            <option value="$$">Medium (₹₹)</option>
                                            <option value="$$$">High (₹₹₹)</option>
                                            <option value="$$$$">Luxury (₹₹₹₹)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex gap-4">
                                <button
                                    onClick={() => setFilters({
                                        city: '',
                                        cuisine: '',
                                        rating: '',
                                        category: '',
                                        priceRange: ''
                                    })}
                                    className="flex-1 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                >
                                    Reset All
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="flex-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all hover:bg-indigo-600 hover:text-white shadow-lg"
                                >
                                    Apply Grid
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Restaurants;
