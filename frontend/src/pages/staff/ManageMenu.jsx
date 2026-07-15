import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Plus, Trash2, Edit3, X, Check, Search, Filter, Info, Loader2, Sparkles, ChefHat, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ManageMenu = () => {
    const navigate = useNavigate();
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', category: '', description: '', available: true, image: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    const categories = [
        'Starter', 'Main Course', 'Dessert', 'Beverage', 'Specialty',
        'Breakfast', 'Lunch', 'Dinner', 'Brunch', 'Snacks',
        'Appetizer', 'Soup', 'Salad', 'Pizza', 'Burger',
        'Sandwich', 'Pasta', 'Side Dish', 'Bakery & Bread', 'Mocktail',
        'Cocktail', 'Biryani', 'Seafood', 'Grill & BBQ', 'Platter',
        'Vegan & Vegetarian', 'Kids Menu'
    ];

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/api/menu/my');
            setMenu(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Menu Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMenu(); }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadPayload = new FormData();
        uploadPayload.append('image', file);

        try {
            setUploadingImage(true);
            const { data } = await axiosInstance.post('/api/upload', uploadPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setFormData(prev => ({ ...prev, image: data.url }));
        } catch (err) {
            console.error('Upload Error:', err);
            alert(err.response?.data?.message || 'File upload failed. Only JPG, PNG, WEBP are allowed under 15MB.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await axiosInstance.put(`/api/menu/${editingItem._id}`, formData);
            } else {
                await axiosInstance.post('/api/menu', formData);
            }
            setShowModal(false);
            setEditingItem(null);
            setFormData({ name: '', price: '', category: '', description: '', available: true, image: '' });
            fetchMenu();
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this culinary masterpiece?')) return;
        try {
            await axiosInstance.delete(`/api/menu/${id}`);
            fetchMenu();
        } catch (err) {
            alert('Deletion failed.');
        }
    };

    const toggleAvailability = async (item) => {
        try {
            await axiosInstance.put(`/api/menu/${item._id}`, { ...item, available: !item.available });
            fetchMenu();
        } catch (err) {
            console.error('Toggle Error:', err);
        }
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            price: item.price,
            category: item.category,
            description: item.description,
            available: item.available,
            image: item.image || ''
        });
        setShowModal(true);
    };

    const filteredMenu = menu.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 text-slate-800 dark:text-slate-100 transition-colors duration-200">
            {/* Back Button */}
            <div>
                <button 
                    onClick={() => {
                        if (window.history.length > 1) {
                            navigate(-1);
                        } else {
                            navigate('/staff/dashboard');
                        }
                    }}
                    className="inline-flex items-center text-slate-500 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-600 font-black text-[10px] uppercase tracking-widest transition-all group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-orange-100/50 dark:border-slate-800 transition-all">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Menu Catalog</h1>
                    <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase text-[10px] tracking-widest">Manage your restaurant's culinary offerings</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setFormData({ name: '', price: '', category: '', description: '', available: true, image: '' }); setShowModal(true); }}
                    className="mt-4 md:mt-0 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-100 dark:shadow-none flex items-center space-x-2 group"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span>Create New Dish</span>
                </button>
            </div>

            {/* Menu Content Area */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-orange-100/50 dark:border-slate-800 overflow-hidden transition-colors">
                <div className="p-8 border-b border-orange-50 dark:border-slate-800 bg-orange-50/5 dark:bg-slate-900">
                    <div className="relative max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400 dark:text-slate-600" />
                        <input
                            type="text"
                            placeholder="Find a dish..."
                            className="w-full pl-12 pr-6 py-4 bg-orange-50/50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm text-slate-700 dark:text-slate-200 placeholder:text-orange-300 dark:placeholder:text-slate-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FFFBF7] dark:bg-slate-900/80 border-b border-orange-100 dark:border-slate-800">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dish Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Price</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Live</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-50 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
                                        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">Updating Catalog...</p>
                                    </td>
                                </tr>
                            ) : filteredMenu.length > 0 ? filteredMenu.map((item, i) => (
                                <motion.tr
                                    key={item._id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="hover:bg-orange-50/20 dark:hover:bg-slate-800/20 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-14 w-14 bg-orange-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-orange-100 dark:border-slate-700 relative group-hover:scale-105 transition-transform">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ChefHat className="h-6 w-6 text-orange-300 dark:text-slate-600 absolute inset-0 m-auto" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-white text-sm tracking-tight">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium line-clamp-1 max-w-xs">{item.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-orange-100 dark:border-orange-900/30">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-slate-700 dark:text-slate-300">${item.price}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => toggleAvailability(item)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${item.available ? 'bg-orange-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${item.available ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(item)} className="p-2 bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-600 hover:text-white transition-all">
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <p className="text-slate-300 dark:text-slate-600 font-bold uppercase text-[10px] tracking-widest">Menu is currently empty</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col transition-colors duration-205"
                        >
                            <div className="p-8 border-b border-orange-50 dark:border-slate-800 flex justify-between items-center shrink-0">
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">
                                    {editingItem ? 'Edit Dish' : 'New Dish'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                                    <X className="h-5 w-5 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
                                <div className="p-8 overflow-y-auto flex-grow space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2 col-span-2 sm:col-span-1">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Dish Name</label>
                                            <input
                                                required placeholder="e.g. Lobster Thermidor"
                                                className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
                                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2 sm:col-span-1">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Price ($)</label>
                                            <input
                                                required type="number" step="0.01" placeholder="0.00"
                                                className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
                                                value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2 sm:col-span-1">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Category</label>
                                            <select
                                                required className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                                                value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        
                                        {/* Dual Mode Dish Image Input */}
                                        <div className="space-y-2 col-span-2 sm:col-span-1">
                                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Dish Image</label>
                                            <div className="flex gap-4 items-center">
                                                {/* Preview Frame */}
                                                <div className="h-16 w-16 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-orange-100 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center relative shadow-inner">
                                                    {formData.image ? (
                                                        <img src={formData.image} alt="Dish Preview" className="h-full w-full object-cover" />
                                                    ) : (
                                                        <ImageIcon className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                                                    )}
                                                    {uploadingImage && (
                                                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                                                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-grow space-y-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Or paste image URL..."
                                                        className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-xl py-2.5 px-4 font-bold text-xs text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
                                                        value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                                                    />
                                                    <label className="inline-block cursor-pointer bg-slate-900 dark:bg-slate-800 text-white hover:bg-orange-600 dark:hover:bg-orange-600 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all">
                                                        {uploadingImage ? 'Uploading...' : 'Choose File'}
                                                        <input 
                                                            type="file" 
                                                            accept="image/*" 
                                                            className="hidden" 
                                                            onChange={handleImageUpload} 
                                                            disabled={uploadingImage}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest ml-1">Description</label>
                                        <textarea
                                            required rows="3" placeholder="Describe the ingredients and preparation..."
                                            className="w-full bg-slate-50 dark:bg-slate-800 dark:text-white border-none rounded-xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="p-8 border-t border-orange-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0 flex gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 py-5 rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-1 bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 dark:shadow-none hover:bg-orange-700 transition-all"
                                    >
                                        {editingItem ? 'Save Changes' : 'Add to Menu'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageMenu;
