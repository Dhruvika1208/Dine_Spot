import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin, Clock, Star, Utensils, ArrowLeft,
    ArrowRight, Loader2, Sparkles, AlertCircle, Info, ShieldCheck, Heart, Share2
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import RestaurantCarousel from '../../components/RestaurantCarousel';

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { toggleFavorite, isFavorite } = useFavorites();

    const handleShare = async () => {
        const shareData = {
            title: data?.name || 'DineSpot',
            text: `Check out ${data?.name} on DineSpot!`,
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            }
        } catch (err) {
            console.error('Share Error:', err);
        }
    };

    const handleDirections = (e) => {
        e.preventDefault();
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            const fallbackUrl = data.latitude && data.longitude
                ? `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`
                : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.location)}`;
            window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const url = data.latitude && data.longitude
                    ? `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${data.latitude},${data.longitude}`
                    : `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${encodeURIComponent(data.location)}`;
                window.open(url, '_blank', 'noopener,noreferrer');
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Please enable location access to get directions from your current location.");
                const fallbackUrl = data.latitude && data.longitude
                    ? `https://www.google.com/maps/dir/?api=1&destination=${data.latitude},${data.longitude}`
                    : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(data.location)}`;
                window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
            }
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const resDetails = await axiosInstance.get(`/api/restaurants/${id}`);
                setData(resDetails.data.restaurant);

                const resMenu = await axiosInstance.get(`/api/menu/restaurant/${id}`);
                setMenu(Array.isArray(resMenu.data) ? resMenu.data : []);
            } catch (err) {
                console.error('Restaurant Load Error:', err);
                setError('Failed to load restaurant details.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const goToReservation = () => {
        navigate(`/reserve/${id}`);
    };

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-20 gap-6 transition-colors duration-200">
            <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Experience...</p>
        </div>
    );

    if (error || !data) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-12 text-center bg-[#FFFCFA] dark:bg-slate-950 transition-colors duration-200">
            <div className="p-12 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-orange-100 dark:border-slate-800 max-w-lg space-y-6">
                <AlertCircle className="h-16 w-16 text-rose-500 mx-auto" />
                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Restaurant Not Found</h2>
                <Link to="/restaurants" className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-orange-700 transition-all">
                    <ArrowLeft className="h-4 w-4 mr-3" /> Explore Other Spots
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pb-32 bg-[#FDFCFB] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
            {/* Navigation Header */}
            <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
                <button
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate('/restaurants');
                        }
                    }}
                    className="flex items-center space-x-3 text-slate-400 hover:text-orange-600 transition-all group"
                >
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-orange-50 dark:border-slate-800 group-hover:bg-orange-50 dark:group-hover:bg-slate-800 transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-400">Back to Directory</span>
                </button>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => toggleFavorite(data)}
                        className={`p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-orange-50 dark:border-slate-800 transition-all hover:scale-110 active:scale-95 ${isFavorite(id) ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                        <Heart className={`h-5 w-5 ${isFavorite(id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                    <button
                        onClick={handleShare}
                        className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-orange-50 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-orange-600 transition-all hover:scale-110 active:scale-95"
                    >
                        <Share2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 mb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-7 relative"
                    >
                        <div className="relative h-[500px] lg:h-[650px] w-full rounded-[3.5rem] overflow-hidden shadow-2xl border-[12px] border-white dark:border-slate-900 bg-slate-50 dark:bg-slate-900">
                            <RestaurantCarousel 
                                coverImage={data.image}
                                gallery={data.gallery}
                                galleryImages={data.galleryImages}
                                cuisine={data.cuisine}
                            />
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl border border-orange-50 dark:border-slate-800 animate-bounce-slow">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl">
                                    <Sparkles className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Top Rated</p>
                                    <p className="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">Chef's Choice</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-5 space-y-10"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/30 px-4 py-1.5 rounded-xl border border-amber-100 dark:border-amber-900">
                                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                                    <span className="font-black text-amber-700 dark:text-amber-400 text-sm">{data.rating || '4.9'}</span>
                                </div>
                                <span className="text-slate-400">|</span>
                                <div className="flex items-center space-x-1 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    <span>Verified Spot</span>
                                </div>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.9] uppercase italic">{data.name}</h1>
                        </div>

                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed max-w-md">
                            {data.description || 'Enjoy a refined culinary showcase with our handpicked delicacies, served with warmth and absolute excellence.'}
                        </p>

                        <div className="grid grid-cols-2 gap-4 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-orange-100/50 dark:border-slate-800">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-slate-400 dark:text-slate-500 font-black uppercase text-[9px] tracking-widest">
                                        <MapPin className="h-3 w-3 mr-2 text-orange-600" /> Location
                                    </div>
                                    <button
                                        onClick={handleDirections}
                                        className="text-[9px] font-black text-orange-600 hover:underline uppercase tracking-widest flex items-center"
                                    >
                                        Directions
                                    </button>
                                </div>
                                <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{data.location}</p>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center text-slate-400 dark:text-slate-500 font-black uppercase text-[9px] tracking-widest">
                                    <Clock className="h-3 w-3 mr-2 text-orange-600" /> Open Hours
                                </div>
                                <p className="font-bold text-slate-800 dark:text-white text-sm">{data.openingTime} - {data.closingTime}</p>
                            </div>
                        </div>

                        <button
                            onClick={goToReservation}
                            className="w-full bg-orange-600 text-white p-7 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-2xl shadow-orange-100 dark:shadow-none flex items-center justify-between group"
                        >
                            <span>Book Your Table</span>
                            <ArrowRight className="h-6 w-6 group-hover:translate-x-3 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Menu Section */}
            <section className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-16">
                    <div className="space-y-2">
                        <div className="h-2 w-16 bg-orange-600 rounded-full" />
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Culinary Highlights</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {menu && menu.length > 0 ? menu.map((item, i) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-orange-100/50 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col h-full group"
                        >
                            {item.image && (
                                <div className="h-48 w-full rounded-2xl overflow-hidden mb-6">
                                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                                </div>
                            )}
                            <div className="flex justify-between items-start mb-6">
                                <span className="bg-orange-50/40 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-orange-100 dark:border-slate-800">
                                    {item.category}
                                </span>
                                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">${item.price}</p>
                            </div>
                            <h4 className="text-2xl font-black text-slate-800 dark:text-white mb-3 tracking-tight uppercase italic">{item.name}</h4>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-8 flex-grow">{item.description}</p>
                            <div className="pt-6 border-t border-orange-50 dark:border-slate-800">
                                <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase border ${item.available ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900'}`}>
                                    {item.available ? 'Ready to Serve' : 'Currently Unavailable'}
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-24 text-center bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-dashed border-orange-100 dark:border-slate-800 p-8">
                            <Utensils className="h-12 w-12 text-orange-200 dark:text-slate-700 mx-auto mb-4" />
                            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">Menu coming soon...</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default RestaurantDetails;
