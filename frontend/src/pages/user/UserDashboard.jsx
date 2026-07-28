import { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, QrCode, Utensils, ArrowRight, Loader2, Heart, Share2, Star, CalendarDays, Filter, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import SafeImage from '../../components/SafeImage';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loadingReservations, setLoadingReservations] = useState(true);
    const [activeTab, setActiveTab] = useState('reservations'); // 'reservations' | 'favorites'
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const { favorites, toggleFavorite, isFavorite, loading: loadingFavorites } = useFavorites();

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            setLoadingReservations(true);
            const { data } = await axiosInstance.get('/api/reservations/my');
            setReservations(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('UserDashboard Error:', err);
        } finally {
            setLoadingReservations(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
        try {
            await axiosInstance.delete(`/api/reservations/${id}`);
            fetchReservations();
        } catch (err) {
            alert(err.response?.data?.message || 'Cancellation failed');
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
            case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
            case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
            default: return 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800/20 dark:text-slate-400 dark:border-slate-800/30';
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] dark:bg-slate-950 py-16 px-6 sm:px-12 text-slate-800 dark:text-slate-100 transition-colors duration-200">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate('/restaurants');
                        }
                    }}
                    className="inline-flex items-center text-slate-500 dark:text-slate-500 hover:text-orange-600 font-black text-[10px] uppercase tracking-widest mb-10 transition-all group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>

                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-orange-100 dark:bg-orange-950/35 text-orange-700 dark:text-orange-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block border border-orange-200 dark:border-orange-900/20"
                        >
                            Member Portal
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic leading-none"
                        >
                            Your <span className="text-orange-600 dark:text-orange-500">Dine Journey</span>
                        </motion.h1>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Link
                            to="/restaurants"
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-xl shadow-slate-200 dark:shadow-none flex items-center space-x-3"
                        >
                            <span>Book New Table</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </motion.div>
                </header>

                {/* Tabs selection bar */}
                <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-800 mb-10 pb-0.5">
                    <button
                        onClick={() => setActiveTab('reservations')}
                        className={`pb-4 px-4 font-black text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'reservations'
                                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
                        }`}
                    >
                        <CalendarDays className="h-4 w-4" />
                        <span>My Reservations ({reservations.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`pb-4 px-4 font-black text-xs uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${
                            activeTab === 'favorites'
                                ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                                : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-slate-600'
                        }`}
                    >
                        <Heart className="h-4 w-4" />
                        <span>My Saved Spots ({favorites.length})</span>
                    </button>
                </div>

                {/* Main Tab Content */}
                <div className="min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'reservations' ? (
                            <motion.div
                                key="reservations-tab"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                            >
                                {loadingReservations ? (
                                    <div className="flex flex-col items-center py-32">
                                        <Loader2 className="h-10 w-10 text-orange-600 animate-spin mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing reservation manifest...</p>
                                    </div>
                                ) : (() => {
                                    const filtered = reservations.filter(res => {
                                        const resName = res.restaurantId?.name || '';
                                        const resLoc = res.restaurantId?.location || '';
                                        const matchesSearch = resName.toLowerCase().includes(searchQuery.toLowerCase()) || resLoc.toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchesStatus = statusFilter === 'All' || res.status?.toLowerCase() === statusFilter.toLowerCase();
                                        return matchesSearch && matchesStatus;
                                    });

                                    return (
                                        <div className="space-y-6">
                                            {/* Filters & Search Controls */}
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-orange-100/50 dark:border-slate-800 shadow-sm">
                                                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                                                    {['All', 'Confirmed', 'Pending', 'Cancelled'].map((st) => (
                                                        <button
                                                            key={st}
                                                            onClick={() => setStatusFilter(st)}
                                                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                                                statusFilter === st
                                                                    ? 'bg-orange-600 text-white shadow-md'
                                                                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                                                            }`}
                                                        >
                                                            {st}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="relative flex-grow max-w-md">
                                                    <input
                                                        type="text"
                                                        placeholder="Filter by restaurant name or location..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 font-bold text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-orange-500"
                                                    />
                                                </div>
                                            </div>

                                            {filtered.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-8">
                                                    {filtered.map((res, i) => (
                                                        <motion.div
                                                            key={res._id}
                                                            initial={{ opacity: 0, y: 15 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-orange-100/50 dark:border-slate-800 flex flex-col lg:flex-row items-center gap-10 shadow-sm hover:shadow-xl transition-all"
                                                        >
                                                            {/* Image */}
                                                            <div className="w-full lg:w-48 h-48 rounded-[2.5rem] overflow-hidden border-4 border-orange-50 dark:border-slate-800 relative shrink-0 shadow-inner">
                                                                <SafeImage 
                                                                    src={res.restaurantId?.image} 
                                                                    type="restaurant"
                                                                    keyword={res.restaurantId?.cuisine || res.restaurantId?.name}
                                                                    className="w-full h-full object-cover" 
                                                                    alt={res.restaurantId?.name || "Restaurant"} 
                                                                />
                                                                <button
                                                                    onClick={() => toggleFavorite(res.restaurantId)}
                                                                    className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2.5 rounded-xl shadow-sm hover:scale-110 transition-transform active:scale-95 border border-white dark:border-slate-700"
                                                                >
                                                                    <Heart className={`h-4 w-4 ${isFavorite(res.restaurantId?._id) ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                                                                </button>
                                                            </div>

                                                            {/* Details */}
                                                            <div className="flex-1 w-full space-y-4">
                                                                <div className="flex flex-wrap justify-between items-start gap-4">
                                                                    <div>
                                                                        <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">{res.restaurantId?.name}</h3>
                                                                        <div className="flex items-center text-slate-400 dark:text-slate-500 text-xs font-bold mt-1">
                                                                            <MapPin className="h-4 w-4 mr-1.5 text-orange-600" />
                                                                            {res.restaurantId?.location || 'Premium Location'}
                                                                        </div>
                                                                    </div>
                                                                    <span className={`px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(res.status)} shadow-sm`}>
                                                                        {res.status}
                                                                    </span>
                                                                </div>

                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-orange-50/20 dark:bg-slate-950/40 p-5 rounded-[2rem] border border-orange-100/10 dark:border-slate-800">
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"><Calendar className="h-4 w-4 text-orange-600" /></div>
                                                                        <div>
                                                                            <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Date</p>
                                                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{new Date(res.reservationTime).toLocaleDateString()}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"><Clock className="h-4 w-4 text-orange-600" /></div>
                                                                        <div>
                                                                            <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Time</p>
                                                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{new Date(res.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"><Users className="h-4 w-4 text-orange-600" /></div>
                                                                        <div>
                                                                            <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Guests</p>
                                                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{res.guests} People</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-between pt-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <div className="h-7 w-7 bg-slate-900 dark:bg-slate-800 rounded-full flex items-center justify-center text-[9px] font-black text-white uppercase italic">DS</div>
                                                                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest italic">DineSpot Protocol Confirmed</p>
                                                                    </div>
                                                                     <div className="flex items-center space-x-2">
                                                                        <button
                                                                            onClick={() => handleShare(res.restaurantId)}
                                                                            className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-orange-50 dark:border-slate-800 text-slate-400 hover:text-orange-600 transition-all hover:scale-105 active:scale-95"
                                                                            title="Share Spot"
                                                                        >
                                                                            <Share2 className="h-4 w-4" />
                                                                        </button>

                                                                        {(() => {
                                                                            const isPast = new Date(res.reservationTime) < new Date();
                                                                            const statusLower = res.status?.toLowerCase();
                                                                            const isCancelled = statusLower === 'cancelled';
                                                                            const isCompleted = statusLower === 'completed';
                                                                            const isCheckedIn = statusLower === 'checkedin';
                                                                            const isNoShow = statusLower === 'noshow';

                                                                            const canCancel = !isPast && !isCancelled && !isCompleted && !isCheckedIn && !isNoShow;

                                                                            let btnLabel = 'Cancel';
                                                                            if (isCancelled) btnLabel = 'Cancelled';
                                                                            else if (isCompleted) btnLabel = 'Completed';
                                                                            else if (isCheckedIn) btnLabel = 'Checked In';
                                                                            else if (isNoShow) btnLabel = 'No Show';
                                                                            else if (isPast) btnLabel = 'Time Passed';

                                                                            return (
                                                                                <button
                                                                                    onClick={() => handleCancel(res._id)}
                                                                                    disabled={!canCancel}
                                                                                    className={`text-xs font-black uppercase transition-all px-3 py-2 ${
                                                                                        canCancel 
                                                                                            ? 'text-slate-400 hover:text-rose-600 cursor-pointer' 
                                                                                            : 'text-slate-300 dark:text-slate-600 opacity-50 cursor-not-allowed'
                                                                                    }`}
                                                                                >
                                                                                    {btnLabel}
                                                                                </button>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* QR Code Pass */}
                                                            {res.qrCode && (() => {
                                                                const isPast = new Date(res.reservationTime) < new Date();
                                                                const statusLower = res.status?.toLowerCase();
                                                                const isDeactivated = isPast || ['completed', 'checkedin', 'noshow', 'cancelled'].includes(statusLower);

                                                                let badgeLabel = 'EXPIRED';
                                                                if (statusLower === 'noshow') badgeLabel = 'NO SHOW';
                                                                else if (statusLower === 'completed') badgeLabel = 'USED';
                                                                else if (statusLower === 'cancelled') badgeLabel = 'CANCELLED';

                                                                return (
                                                                    <div className={`shrink-0 p-4 border-[8px] rounded-[2.5rem] relative group/qr transition-all ${
                                                                        isDeactivated
                                                                            ? 'border-slate-200 dark:border-slate-800/60 bg-slate-100 dark:bg-slate-900/60 opacity-70'
                                                                            : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-white/95 shadow-2xl'
                                                                    }`}>
                                                                        <div className="relative">
                                                                            <img 
                                                                                src={res.qrCode} 
                                                                                className={`w-24 h-24 transition-all ${
                                                                                    isDeactivated ? 'grayscale opacity-30 blur-[1px]' : 'opacity-90 group-hover:opacity-100'
                                                                                }`} 
                                                                                alt="QR Code" 
                                                                            />
                                                                            {isDeactivated && (
                                                                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 rounded-xl">
                                                                                    <span className="text-[8px] font-black text-white uppercase tracking-widest text-center px-1">
                                                                                        {badgeLabel}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className={`absolute -top-2 -right-2 p-2 rounded-xl shadow-lg border-2 ${
                                                                            isDeactivated 
                                                                                ? 'bg-slate-600 text-slate-300 border-slate-700' 
                                                                                : 'bg-orange-600 text-white border-white dark:border-slate-800'
                                                                        }`}>
                                                                            <QrCode className="h-4 w-4" />
                                                                        </div>
                                                                        <p className={`text-center text-[8px] font-black tracking-[0.2em] mt-2 ${
                                                                            isDeactivated ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'
                                                                        }`}>
                                                                            {isDeactivated ? 'Pass Deactivated' : 'Security Pass'}
                                                                        </p>
                                                                    </div>
                                                                );
                                                            })()}
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-32 space-y-6 bg-white dark:bg-slate-900 rounded-[3rem] border border-orange-100/50 dark:border-slate-800">
                                                    <div className="w-20 h-20 bg-orange-50/30 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                                        <Utensils className="h-8 w-8 text-orange-300" />
                                                    </div>
                                                    <h2 className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">No matching reservations found</h2>
                                                    <Link
                                                        to="/restaurants"
                                                        className="inline-flex items-center text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest text-xs border-b-2 border-orange-200 pb-1 hover:border-orange-600 transition-all"
                                                    >
                                                        Book an elite table
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="favorites-tab"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25 }}
                            >
                                {loadingFavorites ? (
                                    <div className="flex flex-col items-center py-32">
                                        <Loader2 className="h-10 w-10 text-orange-600 animate-spin mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Retrieving bookmarked spots...</p>
                                    </div>
                                ) : favorites.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
                                        {favorites.map((res, i) => (
                                            <motion.div
                                                key={res._id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                                className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-5 group border border-slate-50 dark:border-slate-800 flex flex-col h-full hover:shadow-xl transition-all duration-300"
                                            >
                                                {/* Image Container */}
                                                <div className="h-44 rounded-2xl overflow-hidden relative mb-5 shrink-0 shadow-sm">
                                                    <SafeImage
                                                        src={res.image}
                                                        type="restaurant"
                                                        keyword={res.cuisine}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        alt={res.name}
                                                    />
                                                    <button
                                                        onClick={() => toggleFavorite(res)}
                                                        className="absolute top-3 left-3 p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-sm hover:scale-110 active:scale-95 transition-all z-10 border border-slate-100 dark:border-slate-700"
                                                    >
                                                        <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                                                    </button>
                                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-2.5 py-1 rounded-lg text-[9px] font-black text-slate-800 dark:text-white flex items-center shadow-sm">
                                                        <Star className="h-3 w-3 text-amber-500 mr-1.5 fill-amber-500" /> {res.rating || '4.5'}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-grow flex flex-col justify-between space-y-4">
                                                    <div className="space-y-1.5">
                                                        <span className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest italic">{res.cuisine}</span>
                                                        <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight uppercase italic line-clamp-1">{res.name}</h3>
                                                        <div className="flex items-center text-slate-400 dark:text-slate-500 font-bold text-[9px] uppercase tracking-widest">
                                                            <MapPin className="h-3 w-3 mr-1 text-orange-500" /> {res.location}
                                                        </div>
                                                        <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-bold italic line-clamp-2 mt-2">
                                                            "{res.description || 'Access an unmatchable culinary experience at our elite destination.'}"
                                                        </p>
                                                    </div>

                                                    <div className="pt-2">
                                                        <Link
                                                            to={`/restaurant/${res._id}`}
                                                            className="w-full bg-slate-50 dark:bg-slate-800 group-hover:bg-slate-900 dark:group-hover:bg-slate-100 group-hover:text-white dark:group-hover:text-slate-900 text-slate-800 dark:text-slate-200 py-3.5 rounded-xl font-black transition-all uppercase tracking-widest text-[9px] flex items-center justify-center space-x-2 border border-slate-100 dark:border-slate-800"
                                                        >
                                                            <span>Book Table</span>
                                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-32 space-y-6 bg-white dark:bg-slate-900 rounded-[3rem] border border-orange-100/50 dark:border-slate-800">
                                        <div className="w-20 h-20 bg-orange-50/30 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                            <Heart className="h-8 w-8 text-orange-300" />
                                        </div>
                                        <h2 className="text-xl font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">No saved spots yet</h2>
                                        <Link
                                            to="/restaurants"
                                            className="inline-flex items-center text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest text-xs border-b-2 border-orange-200 pb-1 hover:border-orange-600 transition-all"
                                        >
                                            Discover and bookmark spots
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
