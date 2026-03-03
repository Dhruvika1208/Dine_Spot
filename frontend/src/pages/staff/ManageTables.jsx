import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Plus, Users, Layout, ChevronRight, CheckCircle2, AlertCircle, Clock, Trash2, X, Check, Loader2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageTables = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ tableNumber: '', capacity: 2 });
    const [error, setError] = useState('');

    const fetchTables = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.get('/api/tables');
            setTables(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            console.error('Floor Map Error:', err);
            setError('Failed to load floor plan.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/tables', formData);
            setShowModal(false);
            setFormData({ tableNumber: '', capacity: 2 });
            fetchTables();
        } catch (err) {
            alert(err.response?.data?.message || 'Table creation failed.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this table?')) return;
        try {
            await axiosInstance.delete(`/api/tables/${id}`);
            fetchTables();
        } catch (err) {
            alert('Deletion failed.');
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Occupied': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'Reserved': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-slate-50 text-slate-500 border-slate-100';
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2rem] shadow-sm border border-orange-100/50 transition-all">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Floor Management</h1>
                    <p className="text-slate-400 font-bold mt-1 uppercase text-[10px] tracking-widest">Real-time table status and occupancy</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="mt-4 md:mt-0 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-100 flex items-center space-x-2 group"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span>Add New Table</span>
                </button>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {loading ? (
                    <div className="col-span-full py-40 text-center bg-white rounded-[2rem] border border-orange-50">
                        <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Updating Floor Map...</p>
                    </div>
                ) : (
                    <AnimatePresence mode='popLayout'>
                        {tables.length > 0 ? tables.map((table, i) => (
                            <motion.div
                                key={table._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -5 }}
                                className="bg-white p-6 rounded-[2rem] shadow-sm border border-orange-100/50 text-center relative group hover:shadow-xl transition-all"
                            >
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(table._id)}
                                        className="p-2 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="h-20 w-20 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl font-black mx-auto mb-6 border border-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    {table.tableNumber}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                        <Users className="h-3 w-3 mr-2" /> {table.capacity} Seats
                                    </div>

                                    <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(table.status)}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${table.status === 'Available' ? 'bg-emerald-500' :
                                            table.status === 'Occupied' ? 'bg-rose-500' :
                                                'bg-amber-500'
                                            } animate-pulse`} />
                                        {table.status}
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border border-orange-50">
                                <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No tables registered yet.</p>
                            </div>
                        )}
                    </AnimatePresence>
                )}
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
                            className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden"
                        >
                            <div className="p-8 border-b border-orange-50 flex justify-between items-center">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">New Table</h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-orange-50 rounded-xl transition-all">
                                    <X className="h-5 w-5 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Table Number/Name</label>
                                    <input
                                        required placeholder="e.g. T-12"
                                        className="w-full bg-slate-50 border-orange-100 rounded-2xl py-4 px-6 font-bold text-slate-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-300"
                                        value={formData.tableNumber} onChange={e => setFormData({ ...formData, tableNumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Guest Capacity</label>
                                    <input
                                        required type="number" min="1"
                                        className="w-full bg-slate-50 border-orange-100 rounded-2xl py-4 px-6 font-bold text-slate-700 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                                        value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                    />
                                </div>
                                <button className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all flex items-center justify-center space-x-2">
                                    <span>Initialize Table</span>
                                    <Check className="h-4 w-4" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Floating Stats */}
            <div className="fixed bottom-8 right-8 bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl z-40 hidden md:flex items-center space-x-8 px-10">
                <div className="flex items-center space-x-3">
                    <div className="bg-emerald-500/20 p-2 rounded-xl"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></div>
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Free</p>
                        <p className="text-xl font-black tabular-nums">{tables.filter(t => t.status === 'Available').length}</p>
                    </div>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="flex items-center space-x-3">
                    <div className="bg-rose-500/20 p-2 rounded-xl"><AlertCircle className="h-4 w-4 text-rose-500" /></div>
                    <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Active</p>
                        <p className="text-xl font-black tabular-nums">{tables.filter(t => t.status !== 'Available').length}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageTables;

