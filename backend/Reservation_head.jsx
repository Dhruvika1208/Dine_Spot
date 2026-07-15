import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, Users, User, Mail, Phone,
    ArrowLeft, CheckCircle2, Loader2, Sparkles,
    CalendarDays, UtensilsCrossed, Info, Coffee, PartyPopper, Sofa, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Reservation = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        reservationTime: '',
        guests: 2,
        specialRequests: '',
        occasion: 'None',
        seatingPreference: 'Indoor',
        agreeToTerms: false
    });
    const [bookingLoading, setBookingLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/restaurants/${id}`);
                setRestaurant(data.restaurant);
            } catch (err) {
                console.error(err);
                setError('Could not load restaurant details.');
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurant();
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!bookingData.agreeToTerms) {
            setError('Please agree to the storage of your reservation details.');
            return;
        }
        try {
            setBookingLoading(true);
            setError('');
            await axiosInstance.post('/api/reservations', {
                restaurantId: id,
                ...bookingData
            });
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please check availability or try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#FFFCFA] flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Preparing Your Table...</p>
        </div>
    );

    return (
        <div className="min-h-screen py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link to={`/restaurant/${id}`} className="inline-flex items-center text-slate-400 hover:text-orange-600 font-black text-[10px] uppercase tracking-widest mb-10 transition-all group">
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Restaurant</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[3rem] shadow-2xl border border-orange-100 overflow-hidden"
                >
                    <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <div className="flex items-center space-x-2 text-orange-400 mb-4 animate-pulse">
                                    <Sparkles className="h-5 w-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Premium Booking</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Secure Your Table</h1>
                                <p className="text-slate-400 font-medium italic">Reservation at <span className="text-white font-bold">{restaurant?.name}</span></p>
                            </div>
                            <div className="hidden sm:block p-4 bg-white/5 rounded-3xl border border-white/10">
                                <Calendar className="h-10 w-10 text-orange-500" />
                            </div>
                        </div>
                    </div>

                    <div className="p-10 sm:p-14">
                        <AnimatePresence mode="wait">
                            {success ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-16 px-4"
                                >
                                    <div className="h-20 w-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-100 shadow-sm animate-bounce">
                                        <Check className="h-10 w-10" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">Table Secured</h2>
                                    <div className="max-w-sm mx-auto space-y-4 mb-10">
                                        <p className="text-slate-500 font-medium leading-relaxed">
                                            Your reservation at <span className="text-slate-900 font-bold">{restaurant?.name}</span> is confirmed.
                                        </p>
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Arrival Schedule</p>
                                            <p className="text-slate-900 font-black">{new Date(bookingData.reservationTime).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                                        Dispatching digital pass to your inbox...
                                    </p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleBooking} className="space-y-10">
                                    {error && (
                                        <div className="p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-bold flex items-center">
                                            <Info className="h-4 w-4 mr-3 flex-shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Personal Info Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="h-1 w-8 bg-orange-600 rounded-full" />
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Personal Identification</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Guest Name</label>
                                                <div className="relative group">
                                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                                    <input required className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                                                        placeholder="Full Name" value={bookingData.fullName} onChange={e => setBookingData({ ...bookingData, fullName: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                                    <input required className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                                                        placeholder="+1 (555) 000-0000" value={bookingData.phone} onChange={e => setBookingData({ ...bookingData, phone: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                                <input required type="email" className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                                                    placeholder="your@email.com" value={bookingData.email} onChange={e => setBookingData({ ...bookingData, email: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Event Details Section */}
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="h-1 w-8 bg-orange-600 rounded-full" />
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Event Coordination</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Number of Guests</label>
                                                <div className="relative group">
                                                    <Users className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors" />
                                                    <select className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50 outline-none cursor-pointer appearance-none transition-all"
                                                        value={bookingData.guests} onChange={e => setBookingData({ ...bookingData, guests: Number(e.target.value) })}>
                                                        {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map(n => <option key={n} value={n}>{n} Guests</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Arrival Schedule</label>
                                                <div className="relative group">
                                                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors" />
                                                    <input required type="datetime-local" className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50 outline-none transition-all"
                                                        value={bookingData.reservationTime} onChange={e => setBookingData({ ...bookingData, reservationTime: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Which Occasion?</label>
                                                <div className="relative group">
                                                    <PartyPopper className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors" />
                                                    <select className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50 outline-none cursor-pointer appearance-none transition-all"
                                                        value={bookingData.occasion} onChange={e => setBookingData({ ...bookingData, occasion: e.target.value })}>
                                                        <option value="None">Just Dining</option>
                                                        <option value="Birthday">Birthday Celebration</option>
                                                        <option value="Anniversary">Anniversary</option>
                                                        <option value="Business">Business Meeting</option>
                                                        <option value="Other">Other Special Occasion</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Seating Preference</label>
                                                <div className="relative group">
                                                    <Sofa className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors" />
                                                    <select className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50 outline-none cursor-pointer appearance-none transition-all"
                                                        value={bookingData.seatingPreference} onChange={e => setBookingData({ ...bookingData, seatingPreference: e.target.value })}>
                                                        <option value="Indoor">Indoor Seating</option>
                                                        <option value="Outdoor">Outdoor Terrace</option>
                                                        <option value="Window">Window Seat</option>
                                                        <option value="Bar">Bar Seating</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Special Requests</label>
                                            <textarea
                                                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 px-6 font-bold text-slate-800 focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50 outline-none transition-all resize-none h-32"
                                                placeholder="Dietary requirements, accessibility needs, or any other notes..."
                                                value={bookingData.specialRequests}
                                                onChange={e => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Privacy Section */}
                                    <div className="pt-6 border-t border-orange-50">
                                        <label className="flex items-start space-x-4 cursor-pointer group">
                                            <div className="relative mt-1">
                                                <input
                                                    type="checkbox"
                                                    checked={bookingData.agreeToTerms}
                                                    onChange={e => setBookingData({ ...bookingData, agreeToTerms: e.target.checked })}
                                                    className="sr-only"
                                                />
                                                <div className={`h-6 w-6 rounded-lg border-2 transition-all flex items-center justify-center ${bookingData.agreeToTerms ? 'bg-orange-600 border-orange-600' : 'bg-white border-slate-200 group-hover:border-orange-200'}`}>
                                                    {bookingData.agreeToTerms && <Check className="h-4 w-4 text-white" />}
                                                </div>
                                            </div>
                                            <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                                I agree to let DineSpot process my data and confirm that I have read the privacy policy.
                                                <span className="block text-orange-600 font-bold mt-1">Cancellation is possible up to 24h before.</span>
                                            </p>
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={bookingLoading}
                                        className="w-full bg-orange-600 hover:bg-slate-900 text-white py-7 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-orange-100 transition-all flex items-center justify-center group"
                                    >
                                        {bookingLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                                            <>
                                                <span>Finalize Reservation</span>
                                                <Sparkles className="h-5 w-5 ml-4 group-hover:rotate-12 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                <div className="mt-12 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center space-x-4">
                    <span className="flex items-center"><Info className="h-3 w-3 mr-1 text-orange-500" /> SSL SECURE PLATFORM</span>
                    <span className="h-1 w-1 bg-slate-300 rounded-full" />
                    <span>VERIFIED ESTABLISHMENT</span>
                </div>
            </div>
        </div>
    );
};

export default Reservation;

