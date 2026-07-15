import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, Users, User, Mail, Phone,
    ArrowLeft, CheckCircle2, Loader2, Sparkles,
    CalendarDays, UtensilsCrossed, Info, Coffee, PartyPopper, Sofa, Check,
    ChevronLeft, ChevronRight, HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Reservation = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 5-step wizard states
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [seatingPreference, setSeatingPreference] = useState('');
    
    const [restaurantTables, setRestaurantTables] = useState([]);
    const [seatingPreferences, setSeatingPreferences] = useState([]);
    const [availableTables, setAvailableTables] = useState([]);
    const [tablesLoading, setTablesLoading] = useState(false);
    const [tablesError, setTablesError] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);

    const [noTablesAvailable, setNoTablesAvailable] = useState(false);
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    const [bookingData, setBookingData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: '',
        guests: 2,
        specialRequests: '',
        occasion: 'None',
        agreeToTerms: false
    });

    const [bookingLoading, setBookingLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setBookingData(prev => ({
                ...prev,
                fullName: prev.fullName || user.name || '',
                email: prev.email || user.email || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const { data } = await axiosInstance.get(`/api/restaurants/${id}`);
                setRestaurant(data.restaurant);
                setRestaurantTables(data.tables || []);
            } catch (err) {
                console.error(err);
                setError('Could not load restaurant details.');
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurant();
    }, [id]);

    // Build Seating Preferences list dynamically from actual restaurant tables
    useEffect(() => {
        if (restaurantTables.length > 0) {
            const prefs = new Set();
            restaurantTables.forEach(t => {
                if (t.viewType && t.viewType.trim() !== '' && t.viewType.toLowerCase() !== 'none') {
                    prefs.add(t.viewType.trim());
                }
                if (t.preference && t.preference.trim() !== '' && t.preference.toLowerCase() !== 'none') {
                    prefs.add(t.preference.trim());
                }
            });
            
            const list = Array.from(prefs).map(pref => {
                const matched = [
                    { name: 'Indoor', desc: 'Classic cozy indoor tables', icon: Sofa },
                    { name: 'Outdoor', desc: 'Beautiful open-air dining terrace', icon: Coffee },
                    { name: 'Window View', desc: 'Scenic views by the large glass window', icon: Coffee },
                    { name: 'Rooftop', desc: 'Skyline dining under the stars', icon: Sparkles },
                    { name: 'Couple Corner', desc: 'Quiet, intimate tables for two', icon: User },
                    { name: 'Live Music', desc: 'Lively atmosphere near the stage', icon: PartyPopper },
                    { name: 'Private Cabin', desc: 'Secluded dining for business or privacy', icon: Sofa },
                    { name: 'Family Zone', desc: 'Spacious tables in a family-friendly area', icon: Users }
                ].find(p => p.name.toLowerCase() === pref.toLowerCase());

                return {
                    name: pref,
                    desc: matched ? matched.desc : `Enjoy our custom ${pref} dining area`,
                    icon: matched ? matched.icon : Sofa
                };
            });

            if (list.length === 0) {
                list.push({ name: 'Indoor', desc: 'Classic cozy indoor tables', icon: Sofa });
            }

            setSeatingPreferences(list);
            if (list.length > 0) {
                setSeatingPreference(list[0].name);
            }
        } else {
            setSeatingPreferences([
                { name: 'Indoor', desc: 'Classic cozy indoor tables', icon: Sofa },
                { name: 'Outdoor', desc: 'Beautiful open-air dining terrace', icon: Coffee }
            ]);
            setSeatingPreference('Indoor');
        }
    }, [restaurantTables]);

    // Check overall tables availability when selectedDate and selectedTime change in Step 1
    useEffect(() => {
        const verifyTimeSlotAvailability = async () => {
            if (!selectedDate || !selectedTime) {
                setNoTablesAvailable(false);
                return;
            }

            const isToday = selectedDate === new Date().toISOString().split('T')[0];
            if (isToday) {
                const now = new Date();
                const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                if (selectedTime < currentTimeStr) {
                    setNoTablesAvailable(false);
                    setError("Do not select a past time for today's date.");
                    return;
                }
            }
            setError('');

            try {
                setCheckingAvailability(true);
                const { data } = await axiosInstance.get(`/api/restaurants/${id}/available-tables`, {
                    params: {
                        date: selectedDate,
                        time: selectedTime
                    }
                });
                if (data.length === 0) {
                    setNoTablesAvailable(true);
                } else {
                    setNoTablesAvailable(false);
                }
            } catch (err) {
                console.error("Availability check failed:", err);
                setNoTablesAvailable(false);
            } finally {
                setCheckingAvailability(false);
            }
        };

        verifyTimeSlotAvailability();
    }, [selectedDate, selectedTime, id]);

    // Fetch available tables matching preference in Step 3
    useEffect(() => {
        if (step === 3) {
            const fetchTables = async () => {
                try {
                    setTablesLoading(true);
                    setTablesError('');
                    const { data } = await axiosInstance.get(`/api/restaurants/${id}/available-tables`, {
                        params: {
                            date: selectedDate,
                            time: selectedTime,
                            preference: seatingPreference
                        }
                    });
                    setAvailableTables(data);
                } catch (err) {
                    console.error(err);
                    setTablesError(err.response?.data?.message || 'Failed to search for available tables.');
                } finally {
                    setTablesLoading(false);
                }
            };
            fetchTables();
        }
    }, [step, id, selectedDate, selectedTime, seatingPreference]);

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        if (!bookingData.agreeToTerms) {
            setError('Please agree to the storage of your reservation details.');
            return;
        }
        if (!selectedTable) {
            setError('Please select a table.');
            return;
        }
        try {
            setBookingLoading(true);
            setError('');
            await axiosInstance.post('/api/reservations', {
                restaurantId: id,
                reservationTime: `${selectedDate}T${selectedTime}`,
                guests: bookingData.guests,
                fullName: bookingData.fullName,
                email: bookingData.email,
                phone: bookingData.phone,
                specialRequests: bookingData.specialRequests,
                occasion: bookingData.occasion,
                seatingPreference: seatingPreference,
                tableId: selectedTable._id
            });
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setBookingLoading(false);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!selectedDate) {
                setError('Please select a date.');
                return;
            }
            if (!selectedTime) {
                setError('Please select a time slot.');
                return;
            }
            if (noTablesAvailable) {
                setError('No tables are available for the selected time.');
                return;
            }
        }
        if (step === 2) {
            if (!seatingPreference) {
                setError('Please select a seating preference.');
                return;
            }
        }
        if (step === 3) {
            if (!selectedTable) {
                setError('Please select a table to proceed.');
                return;
            }
        }
        if (step === 4) {
            if (!bookingData.fullName || !bookingData.email || !bookingData.phone || !bookingData.guests) {
                setError('Please fill out all required fields.');
                return;
            }
            if (selectedTable && bookingData.guests > selectedTable.capacity) {
                setError(`The selected table has a maximum capacity of ${selectedTable.capacity} guests. Please reduce the guest count or go back to select a larger table.`);
                return;
            }
        }
        setError('');
        setStep(prev => prev + 1);
    };

    const prevStep = () => {
        setError('');
        setStep(prev => prev - 1);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#FFFCFA] dark:bg-slate-950 flex flex-col items-center justify-center gap-4 transition-colors duration-200">
            <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
            <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">Preparing Your Table...</p>
        </div>
    );

    const steps = [
        { number: 1, title: 'Date & Time' },
        { number: 2, title: 'Seating Preference' },
        { number: 3, title: 'Select Table' },
        { number: 4, title: 'Guest Details' },
        { number: 5, title: 'Review & Confirm' }
    ];

    const timeSlots = [
        { label: 'Lunch Slots', slots: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30'] },
        { label: 'Dinner Slots', slots: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'] }
    ];

    return (
        <div className="min-h-screen py-20 px-6 bg-[#FDFCFB] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate(`/restaurant/${id}`);
                        }
                    }}
                    className="inline-flex items-center text-slate-400 dark:text-slate-500 hover:text-orange-600 font-black text-[10px] uppercase tracking-widest mb-10 transition-all group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Restaurant</span>
                </button>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-orange-100 dark:border-slate-800 overflow-hidden"
                >
                    {/* Premium Header */}
                    <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <div className="flex items-center space-x-2 text-orange-400 mb-4 animate-pulse">
                                    <Sparkles className="h-5 w-5" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Premium Booking Wizard</span>
                                </div>
                                <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Secure Your Table</h1>
                                <p className="text-slate-400 font-medium italic">Reservation at <span className="text-white font-bold">{restaurant?.name}</span></p>
                            </div>
                            <div className="hidden sm:block p-4 bg-white/5 rounded-3xl border border-white/10">
                                <UtensilsCrossed className="h-10 w-10 text-orange-500" />
                            </div>
                        </div>
                    </div>

                    <div className="p-10 sm:p-14">
                        {/* Step Indicator */}
                        {!success && (
                            <div className="mb-12">
                                <div className="flex justify-between items-center relative">
                                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0" />
                                    <div 
                                        className="absolute left-0 top-1/2 h-0.5 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-300"
                                        style={{ width: `${((step - 1) / 4) * 100}%` }}
                                    />
                                    {steps.map((s) => (
                                        <div key={s.number} className="relative z-10 flex flex-col items-center">
                                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                                step === s.number 
                                                    ? 'bg-orange-500 text-white ring-4 ring-orange-100 dark:ring-orange-950 scale-110'
                                                    : step > s.number
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-400'
                                            }`}>
                                                {step > s.number ? <Check className="h-4 w-4" /> : s.number}
                                            </div>
                                            <span className="hidden md:block text-[8px] font-black uppercase tracking-widest text-slate-400 mt-2">
                                                {s.title}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {success ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-16 px-4"
                                >
                                    <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-10 border border-emerald-100 dark:border-emerald-900 shadow-sm animate-bounce">
                                        <Check className="h-10 w-10" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase italic">Table Secured</h2>
                                    <div className="max-w-sm mx-auto space-y-4 mb-10">
                                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                            Your reservation at <span className="text-slate-900 dark:text-white font-bold">{restaurant?.name}</span> is confirmed.
                                        </p>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Arrival Schedule</p>
                                            <p className="text-slate-900 dark:text-white font-black">
                                                {new Date(`${selectedDate}T${selectedTime}`).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}
                                            </p>
                                            {selectedTable && (
                                                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-2">
                                                    Table {selectedTable.number || selectedTable.tableNumber} ({selectedTable.viewType || 'Standard'})
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest animate-pulse">
                                        Redirecting to your dashboard...
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="space-y-10">
                                    {error && (
                                        <div className="p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold flex items-center">
                                            <Info className="h-4 w-4 mr-3 flex-shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Step 1: Date & Time */}
                                    {step === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="h-1 w-8 bg-orange-600 rounded-full" />
                                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Choose Date & Time</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Select Date</label>
                                                    <div className="relative group">
                                                        <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors" />
                                                        <input 
                                                            required 
                                                            type="date" 
                                                            min={new Date().toISOString().split('T')[0]}
                                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-slate-800 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 outline-none transition-all cursor-pointer"
                                                            value={selectedDate} 
                                                            onChange={e => setSelectedDate(e.target.value)} 
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                                        {[
                                                            { label: 'Today', date: new Date().toISOString().split('T')[0] },
                                                            { label: 'Tomorrow', date: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
                                                            { label: 'Day After', date: new Date(Date.now() + 172800000).toISOString().split('T')[0] }
                                                        ].map(opt => (
                                                            <button
                                                                key={opt.label}
                                                                type="button"
                                                                onClick={() => setSelectedDate(opt.date)}
                                                                className={`py-3 px-1 rounded-xl border font-bold text-[10px] uppercase tracking-wider transition-all ${
                                                                    selectedDate === opt.date
                                                                        ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-orange-200'
                                                                }`}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Select Time Slot</label>
                                                    <div className="relative group">
                                                        <Clock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors" />
                                                        <input 
                                                            type="time"
                                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-slate-800 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 outline-none transition-all cursor-pointer"
                                                            value={selectedTime}
                                                            onChange={e => setSelectedTime(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="space-y-4 max-h-[180px] overflow-y-auto pr-2 mt-4 scrollbar-thin scrollbar-thumb-orange-100">
                                                        {timeSlots.map((group) => (
                                                            <div key={group.label} className="space-y-2">
                                                                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">{group.label}</h4>
                                                                <div className="grid grid-cols-3 gap-2">
                                                                    {group.slots.map((slot) => {
                                                                        // Business hours validation
                                                                        const isOutside = (restaurant && (slot < restaurant.openingTime || slot > restaurant.closingTime));
                                                                        
                                                                        // Filter out past slots if date is today
                                                                        const isToday = selectedDate === new Date().toISOString().split('T')[0];
                                                                        let isPast = false;
                                                                        if (isToday) {
                                                                            const now = new Date();
                                                                            const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                                                                            isPast = slot < currentTimeStr;
                                                                        }

                                                                        const isDisabled = isOutside || isPast;

                                                                        return (
                                                                            <button
                                                                                key={slot}
                                                                                type="button"
                                                                                disabled={isDisabled}
                                                                                onClick={() => setSelectedTime(slot)}
                                                                                className={`py-2 px-1 rounded-xl border font-bold text-[10px] transition-all ${
                                                                                    isDisabled
                                                                                        ? 'bg-slate-100 dark:bg-slate-800/40 text-slate-300 dark:text-slate-700 border-slate-100 dark:border-slate-800/30 cursor-not-allowed line-through'
                                                                                        : selectedTime === slot
                                                                                        ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                                                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-200'
                                                                                }`}
                                                                            >
                                                                                {slot}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Show Availability warnings inside Step 1 */}
                                            {checkingAvailability && (
                                                <div className="flex items-center justify-center space-x-2 text-slate-400 dark:text-slate-500 text-xs py-2">
                                                    <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                                                    <span>Checking table availability...</span>
                                                </div>
                                            )}
                                            {!checkingAvailability && selectedDate && selectedTime && noTablesAvailable && (
                                                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold flex items-center">
                                                    <Info className="h-4 w-4 mr-3 flex-shrink-0" />
                                                    <span>No tables are available for the selected time.</span>
                                                </div>
                                            )}

                                            <div className="pt-6 flex justify-end">
                                                <button
                                                    onClick={nextStep}
                                                    disabled={checkingAvailability || noTablesAvailable}
                                                    className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 ${
                                                        checkingAvailability || noTablesAvailable
                                                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                                                            : 'bg-orange-600 hover:bg-slate-900 text-white shadow-orange-100 dark:shadow-none'
                                                    }`}
                                                >
                                                    <span>Select Seating</span>
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 2: Choose Seating Preference */}
                                    {step === 2 && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="h-1 w-8 bg-orange-600 rounded-full" />
                                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Choose Seating Preference</h3>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {seatingPreferences.map((pref) => {
                                                    const IconComponent = pref.icon;
                                                    return (
                                                        <div
                                                            key={pref.name}
                                                            onClick={() => setSeatingPreference(pref.name)}
                                                            className={`cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-start gap-4 ${
                                                                seatingPreference === pref.name
                                                                    ? 'border-orange-500 bg-orange-50/55 dark:bg-orange-950/20'
                                                                    : 'border-slate-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                                                            }`}
                                                        >
                                                            <div className={`p-3 rounded-xl ${seatingPreference === pref.name ? 'bg-orange-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                                                                <IconComponent className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-tight">{pref.name}</h4>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pref.desc}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="pt-6 flex justify-between">
                                                <button
                                                    onClick={prevStep}
                                                    className="border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    <span>Back</span>
                                                </button>
                                                <button
                                                    onClick={nextStep}
                                                    className="bg-orange-600 hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 dark:shadow-none transition-all flex items-center gap-2"
                                                >
                                                    <span>Select Table</span>
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 3: Choose Specific Table */}
                                    {step === 3 && (
                                        <motion.div
                                            key="step3"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="h-1 w-8 bg-orange-600 rounded-full" />
                                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Choose a Specific Table</h3>
                                            </div>

                                            {tablesLoading ? (
                                                <div className="text-center py-20 space-y-4">
                                                    <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto" />
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Searching available tables...</p>
                                                </div>
                                            ) : tablesError ? (
                                                <div className="p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold">
                                                    {tablesError}
                                                </div>
                                            ) : availableTables.length === 0 ? (
                                                <div className="text-center py-10 bg-orange-50/20 dark:bg-slate-800/30 rounded-[2rem] border border-dashed border-orange-200 dark:border-slate-800 p-8">
                                                    <HelpCircle className="h-10 w-10 text-orange-500 mx-auto mb-4" />
                                                    <h4 className="font-black text-lg text-slate-900 dark:text-white uppercase tracking-tight mb-2">No Matching Tables Found</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
                                                        We could not find any free tables matching the preference of <span className="font-bold text-orange-600">{seatingPreference}</span> at <span className="font-bold">{selectedTime}</span> on <span className="font-bold">{selectedDate}</span>.
                                                    </p>
                                                    <button
                                                        onClick={() => setStep(2)}
                                                        className="bg-orange-600 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                                                    >
                                                        Modify Preference
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {availableTables.map((table) => (
                                                        <div
                                                            key={table._id}
                                                            onClick={() => setSelectedTable(table)}
                                                            className={`cursor-pointer p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
                                                                selectedTable?._id === table._id
                                                                    ? 'border-orange-500 bg-orange-50/55 dark:bg-orange-950/20'
                                                                    : 'border-slate-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                                                            }`}
                                                        >
                                                            <div>
                                                                <div className="flex justify-between items-start mb-4">
                                                                    <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                                                        Table #{table.number || table.tableNumber || 'N/A'}
                                                                    </span>
                                                                    <span className="px-3 py-1 bg-orange-50 dark:bg-orange-950/40 rounded-lg text-[9px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">
                                                                        Capacity: {table.capacity}
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-md font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2">
                                                                    {table.viewType || 'Standard Seating'}
                                                                </h4>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                                    {table.description || 'Premium seating option designed for comfort and luxury.'}
                                                                </p>
                                                            </div>
                                                            {table.preference && (
                                                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                                                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-500 rounded text-[8px] font-bold uppercase tracking-widest">
                                                                        {table.preference}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="pt-6 flex justify-between">
                                                <button
                                                    onClick={prevStep}
                                                    className="border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    <span>Back</span>
                                                </button>
                                                {availableTables.length > 0 && (
                                                    <button
                                                        onClick={nextStep}
                                                        className="bg-orange-600 hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 dark:shadow-none transition-all flex items-center gap-2"
                                                    >
                                                        <span>Booking Form</span>
                                                        <ChevronRight className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 4: Booking Form */}
                                    {step === 4 && (
                                        <motion.div
                                            key="step4"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-6"
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="h-1 w-8 bg-orange-600 rounded-full" />
                                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Provide Guest Details</h3>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Guest Name *</label>
                                                        <div className="relative group">
                                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                                            <input required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-slate-800 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 outline-none transition-all"
                                                                placeholder="Full Name" value={bookingData.fullName} onChange={e => setBookingData({ ...bookingData, fullName: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number *</label>
                                                        <div className="relative group">
                                                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                                            <input required className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-slate-800 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 outline-none transition-all"
                                                                placeholder="+1 (555) 000-0000" value={bookingData.phone} onChange={e => setBookingData({ ...bookingData, phone: e.target.value })} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address *</label>
                                                        <div className="relative group">
                                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                                            <input required type="email" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-slate-800 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 outline-none transition-all"
                                                                placeholder="your@email.com" value={bookingData.email} onChange={e => setBookingData({ ...bookingData, email: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Number of Guests *</label>
                                                        <div className="relative group">
                                                            <Users className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors" />
                                                            <select className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-slate-800 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 outline-none cursor-pointer appearance-none transition-all"
                                                                value={bookingData.guests} onChange={e => setBookingData({ ...bookingData, guests: Number(e.target.value) })}>
                                                                {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20].map(n => <option key={n} value={n}>{n} Guests</option>)}
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Which Occasion?</label>
                                                        <div className="relative group">
                                                            <PartyPopper className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 pointer-events-none group-focus-within:text-orange-500 transition-colors" />
                                                            <select className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl py-4 pl-14 font-bold text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-slate-800 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 outline-none cursor-pointer appearance-none transition-all"
                                                                value={bookingData.occasion} onChange={e => setBookingData({ ...bookingData, occasion: e.target.value })}>
                                                                <option value="None">Just Dining</option>
                                                                <option value="Birthday">Birthday Celebration</option>
                                                                <option value="Anniversary">Anniversary</option>
                                                                <option value="Business">Business Meeting</option>
                                                                <option value="Other">Other Special Occasion</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    {selectedTable && (
                                                        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Seat Details</p>
                                                            <p className="text-slate-800 dark:text-white font-black text-sm mt-1">Table #{selectedTable.number || selectedTable.tableNumber}</p>
                                                            <p className="text-[10px] font-bold text-orange-600 uppercase mt-0.5">{selectedTable.viewType || 'Standard Seating'}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Special Requests</label>
                                                    <textarea
                                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl py-4 px-6 font-bold text-slate-800 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-slate-800 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 outline-none transition-all resize-none h-32"
                                                        placeholder="Dietary requirements, accessibility needs, or any other notes..."
                                                        value={bookingData.specialRequests}
                                                        onChange={e => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-6 flex justify-between">
                                                <button
                                                    onClick={prevStep}
                                                    className="border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    <span>Back</span>
                                                </button>
                                                <button
                                                    onClick={nextStep}
                                                    className="bg-orange-600 hover:bg-slate-900 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 dark:shadow-none transition-all flex items-center gap-2"
                                                >
                                                    <span>Confirm Details</span>
                                                    <ChevronRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Step 5: Review & Confirm Summary */}
                                    {step === 5 && (
                                        <motion.div
                                            key="step5"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className="h-1 w-8 bg-orange-600 rounded-full" />
                                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Verify Booking Summary</h3>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Establishment</span>
                                                        <p className="text-slate-950 dark:text-white font-black text-lg uppercase tracking-tight">{restaurant?.name}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic font-medium">{restaurant?.location}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Arrival Schedule</span>
                                                        <p className="text-slate-900 dark:text-white font-bold text-sm">
                                                            {new Date(`${selectedDate}T${selectedTime}`).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                        </p>
                                                        <p className="text-orange-600 dark:text-orange-400 font-black text-md">{selectedTime}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Party Size</span>
                                                        <p className="text-slate-900 dark:text-white font-black text-sm">{bookingData.guests} Guests</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Selected Table</span>
                                                        <p className="text-slate-900 dark:text-white font-black text-sm">Table #{selectedTable?.number || selectedTable?.tableNumber}</p>
                                                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{selectedTable?.viewType} Seating</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Guest Contact</span>
                                                        <p className="text-slate-900 dark:text-white font-bold text-xs">{bookingData.fullName}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-none mt-0.5">{bookingData.email}</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{bookingData.phone}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dining Occasion</span>
                                                        <p className="text-slate-900 dark:text-white font-bold text-xs">{bookingData.occasion === 'None' ? 'Just Dining' : bookingData.occasion}</p>
                                                    </div>
                                                </div>

                                                {bookingData.specialRequests && (
                                                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Special Requests</span>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 italic leading-relaxed mt-1 font-medium bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                                            "{bookingData.specialRequests}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Privacy Section */}
                                            <div className="pt-6 border-t border-orange-50 dark:border-slate-800">
                                                <label className="flex items-start space-x-4 cursor-pointer group">
                                                    <div className="relative mt-1">
                                                        <input
                                                            type="checkbox"
                                                            checked={bookingData.agreeToTerms}
                                                            onChange={e => setBookingData({ ...bookingData, agreeToTerms: e.target.checked })}
                                                            className="sr-only"
                                                        />
                                                        <div className={`h-6 w-6 rounded-lg border-2 transition-all flex items-center justify-center ${bookingData.agreeToTerms ? 'bg-orange-600 border-orange-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 group-hover:border-orange-200'}`}>
                                                            {bookingData.agreeToTerms && <Check className="h-4 w-4 text-white" />}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                                                        I agree to let DineSpot process my data and confirm that I have read the privacy policy.
                                                        <span className="block text-orange-600 dark:text-orange-400 font-bold mt-1">Cancellation is possible up to 24h before.</span>
                                                    </p>
                                                </label>
                                            </div>

                                            <div className="pt-6 flex justify-between gap-4">
                                                <button
                                                    onClick={prevStep}
                                                    disabled={bookingLoading}
                                                    className="border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                    <span>Back</span>
                                                </button>
                                                <button
                                                    onClick={handleBookingSubmit}
                                                    disabled={bookingLoading}
                                                    className="flex-1 bg-orange-600 hover:bg-slate-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 dark:shadow-none transition-all flex items-center justify-center gap-2"
                                                >
                                                    {bookingLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                                        <>
                                                            <span>Finalize Reservation</span>
                                                            <Sparkles className="h-4 w-4" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
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
