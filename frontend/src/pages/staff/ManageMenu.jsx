import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Plus, Trash2, Edit3, X, Check, Search, Filter, Info, Loader2, Sparkles, ChefHat, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageMenu = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '', price: '', category: '', description: '', available: true, image: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['Starter', 'Main Course', 'Dessert', 'Beverage', 'Specialty'];

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
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2rem] shadow-sm border border-orange-100/50 transition-all">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Menu Catalog</h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Manage your restaurant's culinary offerings</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setFormData({ name: '', price: '', category: '', description: '', available: true, image: '' }); setShowModal(true); }}
                    className="mt-4 md:mt-0 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-100 flex items-center space-x-2 group"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span>Create New Dish</span>
                </button>
            </div>

            {/* Menu Content Area */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-orange-100/50 overflow-hidden">
                <div className="p-8 border-b border-orange-50 bg-orange-50/5">
                    <div className="relative max-w-md">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-300" />
                        <input
                            type="text"
                            placeholder="Find a dish..."
                            className="w-full pl-12 pr-6 py-4 bg-orange-50/50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm text-slate-700 placeholder:text-orange-200"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#FFFBF7] border-b border-orange-100">
                            <tr>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dish Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Live</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-orange-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Updating Catalog...</p>
                                    </td>
                                </tr>
                            ) : filteredMenu.length > 0 ? filteredMenu.map((item, i) => (
                                <motion.tr
                                    key={item._id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="hover:bg-orange-50/20 transition-colors group"
                                >
                                    <td className="px-8 py-6">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-14 w-14 bg-orange-50 rounded-2xl overflow-hidden border border-orange-100 relative group-hover:scale-105 transition-transform">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ChefHat className="h-6 w-6 text-orange-200 absolute inset-0 m-auto" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm tracking-tight">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-xs">{item.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-orange-100">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-black text-slate-700">${item.price}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <button
                                            onClick={() => toggleAvailability(item)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${item.available ? 'bg-orange-600' : 'bg-slate-200'}`}
                                        >
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${item.available ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(item)} className="p-2 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-600 hover:text-white transition-all">
                                                <Edit3 className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <p className="text-slate-300 font-bold uppercase text-[10px] tracking-widest">Menu is currently empty</p>
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
                            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-orange-50 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                                    {editingItem ? 'Edit Dish' : 'New Dish'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-orange-50 rounded-xl transition-all">
                                    <X className="h-5 w-5 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2 col-span-2 sm:col-span-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dish Name</label>
                                        <input
                                            required placeholder="e.g. Lobster Thermidor"
                                            className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2 sm:col-span-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price ($)</label>
                                        <input
                                            required type="number" step="0.01" placeholder="0.00"
                                            className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
                                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2 sm:col-span-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                        <select
                                            required className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
                                            value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2 col-span-2 sm:col-span-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                                        <input
                                            placeholder="https://..."
                                            className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500"
                                            value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        required rows="3" placeholder="Describe the ingredients and preparation..."
                                        className="w-full bg-slate-50 border-none rounded-xl py-4 px-6 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <button className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all">
                                    {editingItem ? 'Save Changes' : 'Add to Menu'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageMenu;
