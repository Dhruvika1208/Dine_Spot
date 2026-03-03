import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, ArrowRight, Loader2, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const defaultImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get(`/api/restaurants`, {
                params: { search }
            });
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

    return (
        <div className="bg-transparent min-h-screen py-10">
            {/* Search Header */}
            <div className="max-w-6xl mx-auto px-6 mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                    <div className="flex-grow max-w-2xl">
                        <div className="flex items-center space-x-2 text-indigo-600 mb-2 font-black uppercase tracking-widest text-[10px]">
                            <Search className="h-4 w-4" />
                            <span>Discovery Matrix</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic uppercase">The Global Grid</h1>
                        <p className="text-slate-400 font-bold italic mt-1 text-sm">Scan and secure tables across our elite establishments.</p>

                        <div className="mt-8 relative group">
                            <input
                                type="text"
                                placeholder="Search by name, cuisine or location..."
                                className="w-full bg-slate-50 border-none rounded-2xl py-5 pl-8 pr-16 font-bold text-slate-700 focus:ring-4 focus:ring-indigo-100 outline-none transition-all placeholder:italic placeholder:font-medium text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && fetchRestaurants()}
                            />
                            <button
                                onClick={fetchRestaurants}
                                className="absolute right-3 top-3 bottom-3 bg-slate-900 text-white px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center shadow-lg"
                            >
                                Scan
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
                            {restaurants.length > 0 ? restaurants.map((res, i) => (
                                <motion.div
                                    key={res._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    className="bg-white rounded-2xl shadow-lg p-4 group border border-slate-50 flex flex-col h-full"
                                >
                                    {/* Image Container */}
                                    <div className="h-48 rounded-xl overflow-hidden relative mb-6">
                                        <img
                                            src={res.image || defaultImage}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            alt={res.name}
                                        />
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-slate-800 flex items-center shadow-sm">
                                            <Star className="h-3 w-3 text-amber-500 mr-2 fill-amber-500" /> {res.rating || '4.5'}
                                        </div>
                                    </div>

                                    <div className="px-2 space-y-4 flex-grow flex flex-col">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest italic">{res.cuisine}</span>
                                            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic">{res.name}</h3>
                                        </div>

                                        <div className="flex items-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                            <MapPin className="h-3.5 w-3.5 mr-2 text-indigo-500" /> {res.location}
                                        </div>

                                        <p className="text-slate-500 text-xs leading-relaxed font-bold italic line-clamp-2">
                                            "{res.description || 'Access an unmatchable culinary experience at our elite destination.'}"
                                        </p>

                                        <div className="pt-6 mt-auto">
                                            <Link
                                                to={`/restaurant/${res._id}`}
                                                className="w-full bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-800 py-4 rounded-xl font-black transition-all uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2 border border-slate-100 group-hover:border-slate-900"
                                            >
                                                <span>View Details</span>
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-full py-40 text-center space-y-6">
                                    <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                        <Filter className="h-10 w-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-300 uppercase tracking-widest italic">No Establishments Found</h3>
                                    <p className="text-slate-400 font-bold italic text-sm">Attempt a different search parameter to re-index the grid.</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Restaurants;
