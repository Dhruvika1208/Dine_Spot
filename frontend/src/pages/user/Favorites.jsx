import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, ArrowRight, Loader2, Sparkles, Heart, Utensils, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useFavorites } from '../../context/FavoritesContext';
import SafeImage from '../../components/SafeImage';

const Favorites = () => {
    const navigate = useNavigate();
    const { favorites, loading, toggleFavorite } = useFavorites();

    const defaultImage = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';

    return (
        <div className="bg-transparent min-h-screen py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate('/restaurants');
                        }
                    }}
                    className="inline-flex items-center text-slate-500 dark:text-slate-500 hover:text-orange-700 font-black text-[10px] uppercase tracking-widest mb-10 transition-all group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>
            </div>

            {/* Header */}
            <div className="max-w-6xl mx-auto mb-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800">
                    <div>
                        <div className="flex items-center space-x-2 text-rose-500 dark:text-rose-400 mb-2 font-black uppercase tracking-widest text-[10px]">
                            <Heart className="h-4 w-4 fill-rose-500" />
                            <span>Your Curated Selection</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter italic uppercase">Saved Spots</h1>
                        <p className="text-slate-400 dark:text-slate-400 font-bold italic mt-1 text-sm">Your personally bookmarked elite dining destinations.</p>
                    </div>
                </div>
            </div>

            {/* List Grid */}
            <main className="max-w-6xl mx-auto">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs italic">Syncing Saved Grid...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {favorites.length > 0 ? favorites.map((res, i) => (
                                <motion.div
                                    key={res._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                                    whileHover={{ y: -8 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 dark:hover:shadow-none p-5 group border border-slate-100 dark:border-slate-800/80 flex flex-col h-full relative transition-all duration-300"
                                >
                                    {/* Image Container */}
                                    <div className="h-52 rounded-[2rem] overflow-hidden relative mb-6">
                                        <SafeImage
                                            src={res.image}
                                            type="restaurant"
                                            keyword={res.cuisine}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            alt={res.name}
                                        />
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleFavorite(res);
                                            }}
                                            className="absolute top-4 left-4 p-2.5 rounded-full bg-rose-500 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-md hover:bg-rose-600"
                                            aria-label="Remove from favorites"
                                        >
                                            <Heart className="h-4 w-4 fill-white" />
                                        </button>
                                        <div className="absolute top-4 right-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-slate-800 dark:text-slate-200 flex items-center shadow-sm border border-white/20 dark:border-slate-800/50">
                                            <Star className="h-3 w-3 text-amber-500 mr-2 fill-amber-500" /> {res.rating || '4.5'}
                                        </div>
                                    </div>

                                    <div className="px-2 space-y-4 flex-grow flex flex-col">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest italic">{res.cuisine}</span>
                                            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tighter uppercase italic">{res.name}</h3>
                                        </div>

                                        <div className="flex items-center text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                            <MapPin className="h-3.5 w-3.5 mr-2 text-rose-500" /> {res.location}
                                        </div>

                                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-bold italic line-clamp-2">
                                            "{res.description || 'Access an unmatchable culinary experience at our elite destination.'}"
                                        </p>

                                        <div className="pt-6 mt-auto">
                                            <Link
                                                to={`/restaurant/${res._id}`}
                                                className="w-full bg-slate-50 dark:bg-slate-800 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-slate-900 text-slate-800 dark:text-slate-200 py-4 rounded-xl font-black transition-all uppercase tracking-widest text-[10px] flex items-center justify-center space-x-2 border border-slate-100 dark:border-slate-700 group-hover:border-slate-900 dark:group-hover:border-white"
                                            >
                                                <span>View Details</span>
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-full py-40 text-center space-y-8 bg-white dark:bg-slate-900 rounded-[4rem] border border-orange-100/50 dark:border-slate-800">
                                    <div className="w-24 h-24 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                        <Heart className="h-10 w-10 text-rose-300 dark:text-rose-900/50 animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">No favorite restaurants yet</h3>
                                        <p className="text-slate-400 dark:text-slate-500 font-bold italic text-sm">Explore elite restaurants and bookmark your favorites to fill this list.</p>
                                    </div>
                                    <div className="pt-4">
                                        <Link
                                            to="/restaurants"
                                            className="inline-flex items-center bg-slate-900 text-white dark:bg-orange-600 dark:hover:bg-orange-700 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-xl shadow-slate-200 dark:shadow-none space-x-2"
                                        >
                                            <span>Explore Directory</span>
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Favorites;
