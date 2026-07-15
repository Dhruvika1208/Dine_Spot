import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { 
    ShieldAlert, Lock, Mail, User, Store, ArrowRight, Loader2, ChefHat, 
    Eye, EyeOff, ArrowLeft, Sun, Moon, MapPin, Utensils, Phone, Clock, 
    Image as ImageIcon, Upload, X 
} from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';

const StaffRegister = () => {
    const navigate = useNavigate();
    const { registerStaff } = useAuth();
    const { theme, toggleTheme } = useTheme();

    // Personal details
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Restaurant mode
    const [isNewRestaurant, setIsNewRestaurant] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantId, setRestaurantId] = useState('');

    // New restaurant details
    const [restaurantName, setRestaurantName] = useState('');
    const [location, setLocation] = useState('');
    const [cuisine, setCuisine] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [openingTime, setOpeningTime] = useState('09:00');
    const [closingTime, setClosingTime] = useState('22:00');
    const [coverImage, setCoverImage] = useState('');
    const [gallery, setGallery] = useState([]);

    // Upload & loading states
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);
    
    // Visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch existing restaurants on mount
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await axiosInstance.get('/api/restaurants');
                setRestaurants(data);
                if (data.length > 0) {
                    setRestaurantId(data[0]._id);
                }
            } catch (err) {
                console.error('Failed to fetch restaurants:', err);
            }
        };
        fetchRestaurants();
    }, []);

    // Handle Cover Image Upload
    const handleCoverImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploadingCover(true);
        setError('');
        try {
            const { data } = await axiosInstance.post('/api/upload/public', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCoverImage(data.url);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload cover image.');
        } finally {
            setUploadingCover(false);
        }
    };

    // Handle Gallery Images Upload (multiple)
    const handleGalleryImagesChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingGallery(true);
        setError('');
        try {
            const uploadedUrls = [];
            for (const file of files) {
                const formData = new FormData();
                formData.append('image', file);
                const { data } = await axiosInstance.post('/api/upload/public', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedUrls.push(data.url);
            }
            setGallery(prev => [...prev, ...uploadedUrls]);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload some gallery images.');
        } finally {
            setUploadingGallery(false);
        }
    };

    // Remove a gallery image
    const handleRemoveGalleryImage = (indexToRemove) => {
        setGallery(prev => prev.filter((_, idx) => idx !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Validate restaurant selection or creation inputs
        if (!isNewRestaurant && !restaurantId) {
            setError('Please select a restaurant to join.');
            return;
        }

        if (isNewRestaurant) {
            if (!restaurantName || !location || !cuisine || !openingTime || !closingTime) {
                setError('Please fill in all required restaurant details.');
                return;
            }
        }

        setLoading(true);
        try {
            await registerStaff({
                name,
                email,
                password,
                confirmPassword,
                isNewRestaurant,
                restaurantId: !isNewRestaurant ? restaurantId : undefined,
                restaurantName: isNewRestaurant ? restaurantName : undefined,
                location: isNewRestaurant ? location : undefined,
                cuisine: isNewRestaurant ? cuisine : undefined,
                phoneNumber: isNewRestaurant ? phoneNumber : undefined,
                openingTime: isNewRestaurant ? openingTime : undefined,
                closingTime: isNewRestaurant ? closingTime : undefined,
                image: isNewRestaurant ? coverImage : undefined,
                gallery: isNewRestaurant ? gallery : undefined
            });
            navigate('/staff/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getFullImageUrl = (src) => {
        if (!src) return '';
        if (src.startsWith('http')) return src;
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        return `${backendUrl.replace(/\/+$/, '')}${src}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden transition-colors duration-300">
            {/* Absolute navigation buttons */}
            <Link
                to="/"
                className="absolute top-6 left-6 p-3 px-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center font-bold text-xs uppercase tracking-wider shadow-sm z-50 gap-2 focus:outline-none"
            >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <button
                onClick={toggleTheme}
                type="button"
                className="absolute top-6 right-6 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center focus:outline-none shadow-sm z-50"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-500" />}
            </button>

            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl relative z-10 my-20"
            >
                <div className="flex justify-center mb-8">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl transition-colors duration-300">
                        <ChefHat className="h-10 w-10 text-orange-500" />
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 shadow-2xl backdrop-blur-xl p-8 sm:p-12 rounded-[3.5rem] transition-colors duration-300">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase mb-2">Partner Sign Up</h2>
                        <p className="text-slate-400 dark:text-slate-500 text-sm font-medium">Join DineSpot Professional & manage your kitchen</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-bold leading-relaxed">
                                {error}
                            </div>
                        )}

                        {/* Staff Personal Details Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="h-1 w-8 bg-orange-600 rounded-full" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Staff Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600" />
                                        <input
                                            required type="text"
                                            placeholder="Your Full Name"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-4.5 pl-16 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                            value={name} onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Work Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600" />
                                        <input
                                            required type="email"
                                            placeholder="you@dinespot.com"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-4.5 pl-16 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                            value={email} onChange={e => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600" />
                                        <input
                                            required type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-4.5 pl-16 pr-14 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                            value={password} onChange={e => setPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600" />
                                        <input
                                            required type={showConfirmPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-4.5 pl-16 pr-14 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 focus:outline-none"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Restaurant Setup Section */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="h-1 w-8 bg-orange-600 rounded-full" />
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Restaurant Affiliation</h3>
                            </div>

                            {/* Dual Mode Selector */}
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] border border-slate-200/50 dark:border-slate-700/30">
                                <button
                                    type="button"
                                    onClick={() => setIsNewRestaurant(false)}
                                    className={`flex-1 py-3.5 rounded-[1.7rem] text-[10px] font-black uppercase tracking-widest transition-all ${!isNewRestaurant ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Join Existing
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsNewRestaurant(true)}
                                    className={`flex-1 py-3.5 rounded-[1.7rem] text-[10px] font-black uppercase tracking-widest transition-all ${isNewRestaurant ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-md' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                                >
                                    Register New
                                </button>
                            </div>

                            {/* Conditional Forms */}
                            {!isNewRestaurant ? (
                                /* JOIN EXISTING */
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Select Establishment</label>
                                    <div className="relative">
                                        <Store className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600 pointer-events-none" />
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-4.5 pl-16 pr-6 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all cursor-pointer appearance-none"
                                            value={restaurantId}
                                            onChange={e => setRestaurantId(e.target.value)}
                                        >
                                            {restaurants.length === 0 ? (
                                                <option value="" disabled>No restaurants available</option>
                                            ) : (
                                                restaurants.map(r => (
                                                    <option key={r._id} value={r._id}>{r.name} - {r.location}</option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                /* REGISTER NEW */
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Restaurant Name</label>
                                            <div className="relative">
                                                <Store className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600" />
                                                <input
                                                    required type="text"
                                                    placeholder="e.g. Chinatown"
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-4.5 pl-16 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                                    value={restaurantName} onChange={e => setRestaurantName(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Cuisine Type</label>
                                            <div className="relative">
                                                <Utensils className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600" />
                                                <input
                                                    required type="text"
                                                    placeholder="e.g. Italian, Chinese, Indian"
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-4.5 pl-16 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                                    value={cuisine} onChange={e => setCuisine(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Address / Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600" />
                                                <input
                                                    required type="text"
                                                    placeholder="Street Address, City"
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-4.5 pl-16 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                                    value={location} onChange={e => setLocation(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Contact Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600" />
                                                <input
                                                    type="tel"
                                                    placeholder="Contact phone number"
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-4.5 pl-16 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                                    value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Opening & Closing hours */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Opening Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600 pointer-events-none" />
                                                <input
                                                    required type="time"
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-4.5 pl-16 pr-6 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all cursor-pointer"
                                                    value={openingTime} onChange={e => setOpeningTime(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Closing Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600 pointer-events-none" />
                                                <input
                                                    required type="time"
                                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-3xl py-4.5 pl-16 pr-6 text-slate-800 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all cursor-pointer"
                                                    value={closingTime} onChange={e => setClosingTime(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cover Image Upload */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Cover Image</label>
                                        <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/30 rounded-3xl">
                                            {coverImage ? (
                                                <div className="h-28 w-44 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                                                    <img src={getFullImageUrl(coverImage)} alt="Cover Preview" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="h-28 w-44 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-800/20 text-slate-400 flex-shrink-0">
                                                    <ImageIcon className="h-8 w-8 mb-1" />
                                                    <span className="text-[9px] font-bold tracking-wider uppercase">No Image</span>
                                                </div>
                                            )}
                                            <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                                                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Upload a high-quality cover photo</p>
                                                <p className="text-[9px] text-slate-400 dark:text-slate-500">Supports JPG, PNG or WEBP (Max 5MB)</p>
                                                <label className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs cursor-pointer select-none transition-all hover:scale-102 active:scale-98">
                                                    {uploadingCover ? <Loader2 className="h-4 w-4 animate-spin text-orange-500" /> : <Upload className="h-4 w-4 text-orange-500" />}
                                                    <span>{uploadingCover ? 'Uploading...' : 'Choose Cover'}</span>
                                                    <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Gallery Images Upload */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Gallery Images</label>
                                        <div className="space-y-4 p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/30 rounded-3xl">
                                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                                <div className="flex-1 w-full text-center sm:text-left">
                                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Upload initial restaurant gallery photos</p>
                                                    <p className="text-[9px] text-slate-400 dark:text-slate-500">Select multiple files. Displayed in user view.</p>
                                                </div>
                                                <label className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs cursor-pointer select-none transition-all hover:scale-102 active:scale-98 flex-shrink-0">
                                                    {uploadingGallery ? <Loader2 className="h-4 w-4 animate-spin text-orange-500" /> : <Upload className="h-4 w-4 text-orange-500" />}
                                                    <span>{uploadingGallery ? 'Uploading...' : 'Upload Photos'}</span>
                                                    <input type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} className="hidden" />
                                                </label>
                                            </div>

                                            {/* Gallery Preview Strip */}
                                            {gallery.length > 0 && (
                                                <div className="flex gap-3 overflow-x-auto py-2 no-scrollbar scrollbar-hide">
                                                    {gallery.map((img, idx) => (
                                                        <div key={idx} className="relative h-16 w-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-700 flex-shrink-0 group">
                                                            <img src={getFullImageUrl(img)} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveGalleryImage(idx)}
                                                                className="absolute top-1 right-1 p-1 bg-black/70 text-white hover:bg-black rounded-full transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={loading || uploadingCover || uploadingGallery}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-orange-950/20 transition-all flex items-center justify-center space-x-3 group active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <>
                                    <span>Create Partner Account</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100/5 dark:border-white/5">
                            <Link to="/staff/login" className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest hover:text-orange-500 transition-colors">
                                Already registered? Log In
                            </Link>
                            <Link to="/login?role=user" className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest hover:text-orange-500 transition-colors">
                                Standard User Portal
                            </Link>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-[9px] font-bold text-slate-400 dark:text-slate-700 uppercase tracking-[0.4em] italic">
                    <ShieldAlert className="inline h-3 w-3 mr-2 mb-0.5" />
                    Secure Partner Portal Protected by TLS 1.3
                </p>
            </motion.div>
        </div>
    );
};

export default StaffRegister;
