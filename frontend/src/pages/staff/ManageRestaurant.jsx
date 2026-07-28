import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { 
    Store, MapPin, Clock, Utensils, Mail, Phone, 
    Star, Sparkles, Plus, Trash2, Loader2, CheckCircle, Info, Image as ImageIcon, X, Eye, EyeOff, Search, Navigation, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import SafeImage from '../../components/SafeImage';

const loadLeaflet = () => {
    return new Promise((resolve, reject) => {
        if (window.L) {
            resolve(window.L);
            return;
        }

        if (!document.getElementById('leaflet-css')) {
            const link = document.createElement('link');
            link.id = 'leaflet-css';
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }

        const existingScript = document.getElementById('leaflet-script');
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.L));
            existingScript.addEventListener('error', (e) => reject(e));
            return;
        }

        const script = document.createElement('script');
        script.id = 'leaflet-script';
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => resolve(window.L);
        script.onerror = () => reject(new Error('Failed to load Leaflet map library'));
        document.body.appendChild(script);
    });
};

const MapPickerModal = ({ isOpen, onClose, onConfirm, initialLat, initialLng, initialAddress }) => {
    const [lat, setLat] = useState(initialLat || '16.5062');
    const [lng, setLng] = useState(initialLng || '80.6480');
    const [address, setAddress] = useState(initialAddress || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [loadingMap, setLoadingMap] = useState(true);

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerInstanceRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;

        setAddress(initialAddress || '');
        setSearchQuery('');
        setSearchResults([]);

        let active = true;

        const initMap = async () => {
            try {
                setLoadingMap(true);
                const L = await loadLeaflet();
                if (!active || !mapContainerRef.current) return;

                if (mapInstanceRef.current) {
                    mapInstanceRef.current.remove();
                    mapInstanceRef.current = null;
                }

                let startLat = parseFloat(initialLat);
                let startLng = parseFloat(initialLng);

                // If coordinates are missing but an address was typed in the main form, geocode it first!
                if ((isNaN(startLat) || isNaN(startLng)) && initialAddress && initialAddress.trim()) {
                    try {
                        const geoRes = await fetch(
                            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(initialAddress.trim())}&limit=1`,
                            { headers: { 'Accept-Language': 'en' } }
                        );
                        if (geoRes.ok) {
                            const geoData = await geoRes.json();
                            if (geoData && geoData.length > 0) {
                                startLat = parseFloat(geoData[0].lat);
                                startLng = parseFloat(geoData[0].lon);
                            }
                        }
                    } catch (geoErr) {
                        console.error('Initial address geocoding failed:', geoErr);
                    }
                }

                if (isNaN(startLat)) startLat = 16.5062;
                if (isNaN(startLng)) startLng = 80.6480;

                setLat(startLat.toFixed(6));
                setLng(startLng.toFixed(6));

                const map = L.map(mapContainerRef.current, {
                    zoomControl: true,
                    attributionControl: false
                }).setView([startLat, startLng], 15);

                mapInstanceRef.current = map;

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19
                }).addTo(map);

                const customIcon = L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    shadowSize: [41, 41]
                });

                const marker = L.marker([startLat, startLng], {
                    draggable: true,
                    icon: customIcon
                }).addTo(map);

                markerInstanceRef.current = marker;
                setLoadingMap(false);

                // Invalidate size after render to prevent gray box
                setTimeout(() => {
                    if (mapInstanceRef.current) {
                        mapInstanceRef.current.invalidateSize();
                    }
                }, 200);

                map.on('click', (e) => {
                    const { lat: newLat, lng: newLng } = e.latlng;
                    marker.setLatLng([newLat, newLng]);
                    const latStr = newLat.toFixed(6);
                    const lngStr = newLng.toFixed(6);
                    setLat(latStr);
                    setLng(lngStr);
                    reverseGeocode(newLat, newLng);
                });

                marker.on('dragend', () => {
                    const pos = marker.getLatLng();
                    const latStr = pos.lat.toFixed(6);
                    const lngStr = pos.lng.toFixed(6);
                    setLat(latStr);
                    setLng(lngStr);
                    reverseGeocode(pos.lat, pos.lng);
                });

                if (!initialAddress) {
                    reverseGeocode(startLat, startLng);
                }

            } catch (err) {
                console.error('Interactive map loading error:', err);
                toast.error('Failed to initialize interactive map.');
                setLoadingMap(false);
            }
        };

        initMap();

        return () => {
            active = false;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            markerInstanceRef.current = null;
        };
    }, [isOpen, initialLat, initialLng, initialAddress]);

    const reverseGeocode = async (latitude, longitude) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                { headers: { 'Accept-Language': 'en' } }
            );
            if (res.ok) {
                const data = await res.json();
                if (data && data.display_name) {
                    setAddress(data.display_name);
                    return;
                }
            }
        } catch (err) {
            console.error('Reverse geocoding error:', err);
        }
        setAddress(`Location (${parseFloat(latitude).toFixed(6)}, ${parseFloat(longitude).toFixed(6)})`);
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setSearching(true);
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
                { headers: { 'Accept-Language': 'en' } }
            );
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    setSearchResults(data);
                    selectSearchResult(data[0]);
                } else {
                    toast.error('Location not found. Try searching a city, area, or landmark.');
                    setSearchResults([]);
                }
            }
        } catch (err) {
            console.error('Search error:', err);
            toast.error('Location search failed.');
        } finally {
            setSearching(false);
        }
    };

    const selectSearchResult = (item) => {
        const newLat = parseFloat(item.lat);
        const newLng = parseFloat(item.lon);
        const latStr = newLat.toFixed(6);
        const lngStr = newLng.toFixed(6);

        setLat(latStr);
        setLng(lngStr);
        setAddress(item.display_name);
        setSearchResults([]);

        if (mapInstanceRef.current && markerInstanceRef.current) {
            mapInstanceRef.current.setView([newLat, newLng], 16);
            markerInstanceRef.current.setLatLng([newLat, newLng]);
        }
    };

    const handleUseDeviceLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser.');
            return;
        }
        toast.loading('Fetching device GPS coordinates...', { id: 'gps' });
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                toast.dismiss('gps');
                const newLat = pos.coords.latitude;
                const newLng = pos.coords.longitude;
                const latStr = newLat.toFixed(6);
                const lngStr = newLng.toFixed(6);
                setLat(latStr);
                setLng(lngStr);

                if (mapInstanceRef.current && markerInstanceRef.current) {
                    mapInstanceRef.current.setView([newLat, newLng], 16);
                    markerInstanceRef.current.setLatLng([newLat, newLng]);
                }
                reverseGeocode(newLat, newLng);
                toast.success('GPS Location set!');
            },
            (err) => {
                toast.dismiss('gps');
                console.error('GPS error:', err);
                toast.error('Could not get device GPS location. Please allow browser location permissions.');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleConfirm = () => {
        const finalLat = parseFloat(lat);
        const finalLng = parseFloat(lng);
        if (isNaN(finalLat) || isNaN(finalLng)) {
            toast.error('Please pick valid map coordinates.');
            return;
        }
        const finalAddress = address.trim() || searchQuery.trim() || `Location (${finalLat.toFixed(6)}, ${finalLng.toFixed(6)})`;

        onConfirm({
            latitude: finalLat,
            longitude: finalLng,
            location: finalAddress,
            googleMapsUrl: `https://www.google.com/maps?q=${finalLat},${finalLng}`
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white dark:bg-slate-900 border dark:border-slate-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-6 border-b border-orange-50 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
                    <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight uppercase flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-rose-500" /> Interactive Location Picker
                    </h3>
                    <button type="button" onClick={onClose} className="p-2 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                        <X className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </button>
                </div>

                <div className="p-6 flex-grow overflow-y-auto space-y-4">
                    {/* Search & GPS Controls */}
                    <div className="space-y-2">
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                placeholder="Search area, city, street, or landmark..."
                                className="flex-grow bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 px-5 font-bold text-xs text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={searching}
                                className="bg-slate-900 dark:bg-slate-800 hover:bg-orange-600 text-white px-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center shrink-0"
                            >
                                {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
                            </button>
                            <button
                                type="button"
                                onClick={handleUseDeviceLocation}
                                title="Use current GPS location"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center shrink-0 shadow-md"
                            >
                                <Navigation className="h-4 w-4" />
                            </button>
                        </form>

                        {/* Search Results Dropdown */}
                        {searchResults.length > 0 && (
                            <div className="bg-white dark:bg-slate-950 border border-orange-100 dark:border-slate-800 rounded-2xl p-2 shadow-xl space-y-1 max-h-48 overflow-y-auto">
                                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 py-1">Matching Locations ({searchResults.length})</p>
                                {searchResults.map((item, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => selectSearchResult(item)}
                                        className="w-full text-left p-3 hover:bg-orange-50 dark:hover:bg-slate-900 rounded-xl transition-all text-xs font-bold text-slate-700 dark:text-slate-200 line-clamp-2"
                                    >
                                        <MapPin className="h-3.5 w-3.5 inline mr-2 text-rose-500 shrink-0" />
                                        {item.display_name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Interactive Map Box */}
                    <div className="relative h-[320px] rounded-2xl overflow-hidden border border-orange-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-950">
                        {loadingMap && (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-100/90 dark:bg-slate-950/90 text-slate-400 gap-3 backdrop-blur-xs">
                                <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Loading interactive map...</p>
                            </div>
                        )}
                        <div ref={mapContainerRef} className="w-full h-full z-10 min-h-[320px]" />
                    </div>

                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold italic text-center">
                        💡 Click anywhere on the map or drag the pin to set exact coordinates.
                    </p>

                    {/* Location Summary */}
                    <div className="p-4 bg-orange-50/10 dark:bg-slate-950/40 rounded-2xl border border-orange-100/20 dark:border-slate-800 space-y-3">
                        <div>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Selected Address / Name</span>
                            <textarea
                                rows="2"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 mt-1 font-bold text-xs text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder="Edit or confirm selected address..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                            <div>
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Latitude</span>
                                <span className="font-black text-slate-800 dark:text-slate-200 text-xs">{lat}</span>
                            </div>
                            <div>
                                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Longitude</span>
                                <span className="font-black text-slate-800 dark:text-slate-200 text-xs">{lng}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-orange-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex justify-end gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-slate-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center gap-2"
                    >
                        <Check className="h-4 w-4" /> Confirm Location
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

const ManageRestaurant = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [restaurant, setRestaurant] = useState(null);
    const [showMapPicker, setShowMapPicker] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        cuisine: '',
        location: '',
        openingTime: '',
        closingTime: '',
        email: '',
        staffEmail: '',
        phoneNumber: '',
        rating: 4.5,
        image: '',
        gallery: [],
        latitude: '',
        longitude: '',
        googleMapsUrl: '',
        isAvailable: true
    });

    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const cuisinesList = [
        'Andhra', 'South Indian', 'North Indian', 'Chinese', 'Italian', 
        'Continental', 'Cafe', 'Bakery', 'BBQ', 'Seafood', 
        'Biryani', 'Fast Food', 'Hyderabadi', 'Vegetarian', 'Street Food', 'Breakfast'
    ];

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get('/api/restaurants/my');
                setRestaurant(data);
                setFormData({
                    name: data.name || '',
                    description: data.description || '',
                    cuisine: data.cuisine || '',
                    location: data.location || '',
                    openingTime: data.openingTime || '',
                    closingTime: data.closingTime || '',
                    email: data.email || '',
                    staffEmail: data.staffEmail || '',
                    phoneNumber: data.phoneNumber || '',
                    rating: data.rating || 4.5,
                    image: data.image || '',
                    gallery: data.gallery || [],
                    latitude: data.latitude || '',
                    longitude: data.longitude || '',
                    googleMapsUrl: data.googleMapsUrl || '',
                    isAvailable: data.isAvailable !== undefined ? data.isAvailable : true
                });
            } catch (err) {
                console.error('Failed to load restaurant settings:', err);
                toast.error('Could not load restaurant settings.');
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurant();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const { data } = await axiosInstance.put(`/api/restaurants/${restaurant._id}`, formData);
            setRestaurant(data);
            toast.success('Restaurant updated successfully');
        } catch (err) {
            console.error('Update Error:', err);
            toast.error(err.response?.data?.message || 'Failed to update restaurant.');
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset file input value so re-selecting the same file fires onChange
        e.target.value = '';

        if (!file.type.startsWith('image/')) {
            toast.error('Only image files (JPG, PNG, WEBP, etc.) are allowed.');
            return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        try {
            const { data } = await axiosInstance.post('/api/upload', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const uploadedUrl = data.url;
            if (field === 'cover') {
                setFormData(prev => ({ ...prev, image: uploadedUrl }));
                toast.success('Cover image uploaded.');
            } else if (field === 'gallery') {
                setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), uploadedUrl] }));
                toast.success('Gallery image uploaded.');
            }
        } catch (err) {
            console.error('Server Upload Error, using local Base64 fallback:', err);
            // Fallback to FileReader Base64 encoding so image displays and saves seamlessly
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Url = event.target.result;
                if (field === 'cover') {
                    setFormData(prev => ({ ...prev, image: base64Url }));
                    toast.success('Cover image selected.');
                } else if (field === 'gallery') {
                    setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), base64Url] }));
                    toast.success('Gallery image added.');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const addGalleryImage = () => {
        if (!newGalleryUrl) return;
        if (!newGalleryUrl.startsWith('http://') && !newGalleryUrl.startsWith('https://') && !newGalleryUrl.startsWith('/uploads/')) {
            toast.error('Please enter a valid image URL.');
            return;
        }
        setFormData(prev => ({
            ...prev,
            gallery: [...prev.gallery, newGalleryUrl]
        }));
        setNewGalleryUrl('');
        toast.success('Gallery image URL added.');
    };

    const removeGalleryImage = (index) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }));
        toast.success('Gallery image removed.');
    };

    const handleCancel = () => {
        if (!restaurant) return;
        setFormData({
            name: restaurant.name || '',
            description: restaurant.description || '',
            cuisine: restaurant.cuisine || '',
            location: restaurant.location || '',
            openingTime: restaurant.openingTime || '',
            closingTime: restaurant.closingTime || '',
            email: restaurant.email || '',
            staffEmail: restaurant.staffEmail || '',
            phoneNumber: restaurant.phoneNumber || '',
            rating: restaurant.rating || 4.5,
            image: restaurant.image || '',
            gallery: restaurant.gallery || [],
            latitude: restaurant.latitude || '',
            longitude: restaurant.longitude || '',
            googleMapsUrl: restaurant.googleMapsUrl || '',
            isAvailable: restaurant.isAvailable !== undefined ? restaurant.isAvailable : true
        });
        toast('Form values reset.');
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('All password fields are required.');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }
        try {
            const payload = {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            };
            const passwordPromise = axiosInstance.put('/api/staff/change-password', payload);
            toast.promise(passwordPromise, {
                loading: 'Updating password...',
                success: 'Password changed successfully!',
                error: (err) => err.response?.data?.message || 'Failed to change password.'
            });
            await passwordPromise;
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-32 gap-4">
                <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Accessing settings matrix...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-orange-100/50 dark:border-slate-800 transition-all">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Restaurant settings</h1>
                    <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase text-[10px] tracking-widest">Configure your establishment's profile & parameters</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main profile form */}
                <div className="lg:col-span-2 space-y-8">
                    {/* General Settings */}
                    <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-orange-100/50 dark:border-slate-800 space-y-8">
                        <div className="flex items-center space-x-3">
                            <div className="h-1 w-8 bg-orange-600 rounded-full" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">Identity & Location</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Restaurant Name</label>
                                <input
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Cuisine Type</label>
                                <select
                                    required
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                                    value={formData.cuisine}
                                    onChange={e => setFormData({ ...formData, cuisine: e.target.value })}
                                >
                                    <option value="">Select Cuisine</option>
                                    {cuisinesList.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Establishment Location / Address</label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                    <input
                                        required
                                        placeholder="Pick on map or enter address..."
                                        className="flex-grow bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowMapPicker(true)}
                                        className="cursor-pointer bg-slate-900 dark:bg-slate-800 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center shadow-lg justify-center shrink-0"
                                    >
                                        <MapPin className="h-4 w-4 mr-2" /> Pick Location on Map
                                    </button>
                                </div>

                                {formData.latitude && formData.longitude && (
                                    <div className="mt-4 p-5 bg-orange-50/10 dark:bg-slate-950/30 rounded-2xl border border-orange-100/10 space-y-3">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-500 flex items-center">
                                            <MapPin className="h-3.5 w-3.5 mr-1.5 text-rose-500" /> Selected Coordinates Preview
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 text-xs">
                                            <div>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Latitude</span>
                                                <span className="font-black text-slate-700 dark:text-slate-200">{formData.latitude}</span>
                                            </div>
                                            <div>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Longitude</span>
                                                <span className="font-black text-slate-700 dark:text-slate-200">{formData.longitude}</span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase block">Google Maps Link</span>
                                                <a 
                                                    href={formData.googleMapsUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="font-bold text-orange-600 dark:text-orange-400 hover:underline break-all block mt-0.5 text-[11px]"
                                                >
                                                    {formData.googleMapsUrl}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Rating Value</label>
                                <input
                                    required
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="5"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                                    value={formData.rating}
                                    onChange={e => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Description</label>
                            <textarea
                                rows="4"
                                className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Timings & Communications */}
                    <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-orange-100/50 dark:border-slate-800 space-y-8">
                        <div className="flex items-center space-x-3">
                            <div className="h-1 w-8 bg-orange-600 rounded-full" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">Timings & Communications</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Opening Time (24h format)</label>
                                <input
                                    required
                                    placeholder="e.g. 11:00"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                                    value={formData.openingTime}
                                    onChange={e => setFormData({ ...formData, openingTime: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Closing Time (24h format)</label>
                                <input
                                    required
                                    placeholder="e.g. 23:00"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                                    value={formData.closingTime}
                                    onChange={e => setFormData({ ...formData, closingTime: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Business Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Staff Alerts Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                                    value={formData.staffEmail}
                                    onChange={e => setFormData({ ...formData, staffEmail: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Contact Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                                    value={formData.phoneNumber}
                                    onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Gallery Images */}
                    <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-sm border border-orange-100/50 dark:border-slate-800 space-y-8">
                        <div className="flex items-center space-x-3">
                            <div className="h-1 w-8 bg-orange-600 rounded-full" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">Portfolio Gallery Images</h3>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <input
                                    placeholder="Paste Gallery Image URL (https://...)"
                                    className="flex-grow bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                                    value={newGalleryUrl}
                                    onChange={e => setNewGalleryUrl(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={addGalleryImage}
                                    className="bg-slate-900 dark:bg-slate-800 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center shadow-lg shrink-0"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add URL
                                </button>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    id="gallery-upload-input"
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => handleFileUpload(e, 'gallery')}
                                />
                                <label
                                    htmlFor="gallery-upload-input"
                                    className="cursor-pointer bg-orange-600 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center shadow-lg justify-center w-full"
                                >
                                    <ImageIcon className="h-4 w-4 mr-2" /> Browse Files
                                </label>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                            {formData.gallery && formData.gallery.length > 0 ? (
                                formData.gallery.map((imgUrl, idx) => (
                                    <div key={idx} className="relative h-24 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-orange-50 dark:border-slate-800 group">
                                        <SafeImage src={imgUrl} type="restaurant" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(idx)}
                                            className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="col-span-full text-center py-6 text-xs text-slate-400 font-bold uppercase tracking-wider italic">No custom gallery images added</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Cover preview & operational status */}
                <div className="space-y-8">
                    {/* Cover Image & Preview */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-orange-100/50 dark:border-slate-800 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="h-1 w-8 bg-orange-600 rounded-full" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">Cover & Layout</h3>
                        </div>

                        <div className="h-48 rounded-[2rem] overflow-hidden border border-orange-100 dark:border-slate-800 shadow-inner">
                            <SafeImage
                                src={formData.image}
                                type="restaurant"
                                keyword={formData.cuisine}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Cover Image</label>
                            <div className="flex flex-col gap-4">
                                <input
                                    placeholder="Paste Cover Image URL (https://...)"
                                    className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 px-6 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                                    value={formData.image}
                                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                                />
                                <input
                                    type="file"
                                    id="cover-upload-input"
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => handleFileUpload(e, 'cover')}
                                />
                                <label
                                    htmlFor="cover-upload-input"
                                    className="cursor-pointer bg-slate-900 dark:bg-slate-800 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center shadow-lg justify-center w-full"
                                >
                                    <ImageIcon className="h-4 w-4 mr-2" /> Browse Files
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Operational Availability Status */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-orange-100/50 dark:border-slate-800 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="h-1 w-8 bg-orange-600 rounded-full" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">Operational Grid</h3>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-orange-50/20 dark:bg-slate-950/20 border border-orange-100/30 dark:border-slate-800/80 rounded-2xl">
                            <div>
                                <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">Active Status</p>
                                <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Accept reserve slot inputs</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isAvailable: !formData.isAvailable })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${formData.isAvailable ? 'bg-orange-600' : 'bg-slate-200 dark:bg-slate-800'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${formData.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>

                    {/* Password Change Card */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-orange-100/50 dark:border-slate-800 space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="h-1 w-8 bg-orange-600 rounded-full" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-300">Security Credentials</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 pl-6 pr-14 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm animate-fade-in"
                                        value={passwordData.currentPassword}
                                        onChange={e => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors focus:outline-none flex items-center justify-center"
                                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 pl-6 pr-14 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm animate-fade-in"
                                        value={passwordData.newPassword}
                                        onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors focus:outline-none flex items-center justify-center"
                                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border-none rounded-xl py-4 pl-6 pr-14 font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500 text-sm animate-fade-in"
                                        value={passwordData.confirmPassword}
                                        onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors focus:outline-none flex items-center justify-center"
                                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleChangePassword}
                                className="w-full bg-slate-900 hover:bg-orange-600 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center space-x-2"
                            >
                                <span>Change Password</span>
                            </button>
                        </div>
                    </div>

                    {/* Form submissions controls */}
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-orange-100/50 dark:border-slate-800 space-y-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-100 dark:shadow-none flex items-center justify-center space-x-2"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                            <span>Save Settings</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center"
                        >
                            Cancel Changes
                        </button>
                    </div>
                </div>
            </form>

            <AnimatePresence>
                {showMapPicker && (
                    <MapPickerModal
                        isOpen={showMapPicker}
                        onClose={() => setShowMapPicker(false)}
                        onConfirm={(locationData) => {
                            setFormData(prev => ({
                                ...prev,
                                latitude: locationData.latitude,
                                longitude: locationData.longitude,
                                location: locationData.location,
                                googleMapsUrl: locationData.googleMapsUrl
                            }));
                            toast.success('Map location confirmed.');
                        }}
                        initialLat={formData.latitude}
                        initialLng={formData.longitude}
                        initialAddress={formData.location}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageRestaurant;
