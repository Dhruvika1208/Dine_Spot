import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, QrCode, Utensils, ArrowRight, Loader2, Star, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const [favorites, setFavorites] = useState([]);

    const fetchReservations = async () => {
        try {
            const { data } = await axiosInstance.get('/api/reservations/my');
            setReservations(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('UserDashboard Error:', err);
        } finally { setLoading(false); }
    };

    const fetchFavorites = async () => {
        try {
            const { data } = await axiosInstance.get('/api/auth/favorites');
            setFavorites(data.map(f => f._id));
        } catch (err) {
            console.error('Favorites Error:', err);
        }
    };

    useEffect(() => {
        fetchReservations();
        fetchFavorites();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
        try {
            await axiosInstance.delete(`/api/reservations/${id}`);
            fetchReservations();
        } catch (err) {
            alert(err.response?.data?.message || 'Cancellation failed');
        }
    };

    const toggleFavorite = async (restaurantId) => {
        try {
            const { data } = await axiosInstance.post(`/api/auth/favorites/${restaurantId}`);
            setFavorites(data);
        } catch (err) {
            console.error('Toggle Favorite Error:', err);
        }
    };

    const handleShare = async (restaurant) => {
        const shareData = {
            title: restaurant?.name || 'DineSpot',
            text: `Check out ${restaurant?.name} on DineSpot!`,
            url: window.location.origin + `/restaurant/${restaurant?._id}`
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

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFCFA] py-16 px-6 sm:px-12">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4 inline-block"
                        >
                            Member Dashboard
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight"
                        >
                            Your <span className="text-orange-600">Culinary Journey</span>
                        </motion.h1>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Link
                            to="/restaurants"
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center space-x-3 hover:bg-black transition-all shadow-xl shadow-slate-200"
                        >
                            <span>Book New Table</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center py-40">
                        <Loader2 className="h-12 w-12 text-orange-600 animate-spin mb-6" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Preparing your table list...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8">
                        <AnimatePresence>
                            {reservations.length > 0 ? reservations.map((res, i) => (
                                <motion.div
                                    key={res._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-white p-8 rounded-[3rem] border border-orange-100/50 flex flex-col lg:flex-row items-center gap-10 shadow-sm hover:shadow-xl transition-all"
                                >
                                    <div className="w-full lg:w-48 h-48 rounded-[2.5rem] overflow-hidden border-4 border-orange-50 relative shrink-0 shadow-inner">
                                        <img src={res.restaurantId?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=500'} className="w-full h-full object-cover" alt="Restaurant" />
                                        <button
                                            onClick={() => toggleFavorite(res.restaurantId?._id)}
                                            className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm flex items-center border border-white hover:scale-110 transition-transform active:scale-95"
                                        >
                                            <Star className={`h-3 w-3 mr-1 ${favorites.includes(res.restaurantId?._id) ? 'fill-orange-600 text-orange-600' : 'text-slate-400'}`} />
                                            <span className={favorites.includes(res.restaurantId?._id) ? 'text-orange-600' : 'text-slate-400'}>
                                                {favorites.includes(res.restaurantId?._id) ? 'Saved' : 'Save'}
                                            </span>
                                        </button>
                                    </div>

                                    <div className="flex-1 w-full">
                                        <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                                            <div>
                                                <h3 className="text-3xl font-black text-slate-800 tracking-tight mb-2">{res.restaurantId?.name}</h3>
                                                <div className="flex items-center text-slate-400 text-sm font-bold">
                                                    <MapPin className="h-4 w-4 mr-2 text-orange-600" />
                                                    {res.restaurantId?.address || 'Premium Location, City Center'}
                                                </div>
                                            </div>
                                            <span className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusColor(res.status)} shadow-sm`}>
                                                {res.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 bg-orange-50/30 p-6 rounded-[2rem] border border-orange-100/20">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2.5 bg-white rounded-xl shadow-sm"><Calendar className="h-4 w-4 text-orange-600" /></div>
                                                <div>
                                                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Date</p>
                                                    <p className="text-sm font-bold text-slate-700">{new Date(res.reservationTime).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2.5 bg-white rounded-xl shadow-sm"><Clock className="h-4 w-4 text-orange-600" /></div>
                                                <div>
                                                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Time</p>
                                                    <p className="text-sm font-bold text-slate-700">{new Date(res.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2.5 bg-white rounded-xl shadow-sm"><Users className="h-4 w-4 text-orange-600" /></div>
                                                <div>
                                                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Guests</p>
                                                    <p className="text-sm font-bold text-slate-700">{res.guests} People</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-8 w-8 bg-slate-900 rounded-full flex items-center justify-center text-[10px] font-bold text-white uppercase italic">DS</div>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Confirmed via DineSpot Protocol</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleShare(res.restaurantId)}
                                                    className="p-3 bg-white rounded-2xl shadow-sm border border-orange-50 text-slate-400 hover:text-orange-600 transition-all hover:scale-110 active:scale-95"
                                                >
                                                    <Share2 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(res._id)}
                                                    disabled={res.status === 'Cancelled'}
                                                    className="text-sm font-black uppercase text-slate-400 hover:text-rose-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-all flex items-center px-4"
                                                >
                                                    {res.status === 'Cancelled' ? 'Cancelled' : 'Cancel Reservation'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {res.qrCode && (
                                        <div className="shrink-0 p-5 border-[8px] border-slate-50 rounded-[3rem] bg-white shadow-2xl relative group/qr">
                                            <img src={res.qrCode} className="w-24 h-24 sm:w-32 sm:h-32 opacity-80 group-hover:opacity-100 transition-opacity" alt="QR Code" />
                                            <div className="absolute -top-3 -right-3 bg-orange-600 text-white p-2.5 rounded-2xl shadow-lg border-2 border-white">
                                                <QrCode className="h-4 w-4" />
                                            </div>
                                            <p className="text-center text-[8px] font-black uppercase text-slate-300 tracking-[0.3em] mt-4">Security Pass</p>
                                        </div>
                                    )}
                                </motion.div>
                            )) : (
                                <div className="text-center py-40 space-y-8 bg-white rounded-[4rem] border border-orange-100/50">
                                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
                                        <Utensils className="h-10 w-10 text-orange-200" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">No reservations yet</h2>
                                    <Link
                                        to="/restaurants"
                                        className="inline-flex items-center text-orange-600 font-black uppercase tracking-widest text-xs border-b-2 border-orange-200 pb-1 hover:border-orange-600 transition-all"
                                    >
                                        Explore elite restaurants
                                    </Link>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;

