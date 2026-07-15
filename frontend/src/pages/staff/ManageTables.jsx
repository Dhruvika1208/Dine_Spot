import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { Plus, Users, Layout, ChevronRight, CheckCircle2, AlertCircle, Clock, Trash2, X, Check, Loader2, Info, Sofa, Sparkles, Coffee, Edit3, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ManageTables = () => {
    const navigate = useNavigate();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [formData, setFormData] = useState({
        tableNumber: '',
        capacity: 2,
        description: ''
    });
    const [selectedPref, setSelectedPref] = useState('Indoor');
    const [customPref, setCustomPref] = useState('');
    const [isCustomPref, setIsCustomPref] = useState(false);
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

    const getSeatingPreferences = () => {
        const prefs = new Set();
        const defaultPrefs = [
            'Indoor', 'Outdoor', 'Window View', 'Rooftop', 'Couple Corner', 
            'Live Music', 'Private Cabin', 'Family Zone'
        ];
        tables.forEach(t => {
            if (t.preference && t.preference !== 'None' && t.preference.trim() !== '') {
                prefs.add(t.preference.trim());
            }
            if (t.viewType && t.viewType !== 'None' && t.viewType.trim() !== '') {
                prefs.add(t.viewType.trim());
            }
        });
        defaultPrefs.forEach(p => prefs.add(p));
        return Array.from(prefs);
    };

    const seatingPrefsList = getSeatingPreferences();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalPref = isCustomPref ? customPref : selectedPref;
        const payload = {
            tableNumber: formData.tableNumber,
            capacity: formData.capacity,
            preference: finalPref,
            viewType: finalPref,
            description: formData.description
        };
        try {
            if (editingTable) {
                await axiosInstance.put(`/api/tables/${editingTable._id}`, payload);
            } else {
                await axiosInstance.post('/api/tables', payload);
            }
            setShowModal(false);
            setEditingTable(null);
            setIsCustomPref(false);
            setCustomPref('');
            setSelectedPref('Indoor');
            setFormData({ tableNumber: '', capacity: 2, description: '' });
            fetchTables();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save table.');
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

    const handleEditClick = (table) => {
        setEditingTable(table);
        const currentPref = table.preference !== 'None' ? table.preference : (table.viewType || 'Indoor');
        if (seatingPrefsList.includes(currentPref)) {
            setIsCustomPref(false);
            setSelectedPref(currentPref);
            setCustomPref('');
        } else {
            setIsCustomPref(true);
            setSelectedPref('CUSTOM');
            setCustomPref(currentPref);
        }
        setFormData({
            tableNumber: table.tableNumber,
            capacity: table.capacity,
            description: table.description || ''
        });
        setShowModal(true);
    };

    const handleAddClick = () => {
        setEditingTable(null);
        setIsCustomPref(false);
        setCustomPref('');
        setSelectedPref('Indoor');
        setFormData({ tableNumber: '', capacity: 2, description: '' });
        setShowModal(true);
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
            case 'Occupied': return 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
            case 'Reserved': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
            default: return 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800/20 dark:text-slate-400 dark:border-slate-800/30';
        }
    };

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
                    className="inline-flex items-center text-slate-400 dark:text-slate-500 hover:text-orange-600 dark:hover:text-orange-600 font-black text-[10px] uppercase tracking-widest transition-all group"
                >
                    <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>
            </div>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-orange-100/50 dark:border-slate-800 transition-all">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">Floor Management</h1>
                    <p className="text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase text-[10px] tracking-widest">Real-time table status and occupancy</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="mt-4 md:mt-0 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-orange-100 dark:shadow-none flex items-center space-x-2 group"
                >
                    <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
                    <span>Add New Table</span>
                </button>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-40 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-orange-50 dark:border-slate-800">
                        <Loader2 className="h-10 w-10 text-orange-600 animate-spin mx-auto mb-4" />
                        <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">Updating Floor Map...</p>
                    </div>
                ) : (
                    <AnimatePresence mode='popLayout'>
                        {tables.length > 0 ? tables.map((table, i) => (
                            <motion.div
                                key={table._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -4 }}
                                className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm border border-orange-100/50 dark:border-slate-800 text-center relative group hover:shadow-xl transition-all flex flex-col justify-between"
                            >
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                                    <button
                                        onClick={() => handleEditClick(table)}
                                        className="p-2 bg-orange-50 dark:bg-slate-800 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-600 hover:text-white transition-all shadow-sm border border-orange-100/20 dark:border-slate-800"
                                        title="Edit Table"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(table._id)}
                                        className="p-2 bg-rose-50 dark:bg-rose-950/30 text-rose-500 dark:text-rose-400 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100/20 dark:border-rose-900/30"
                                        title="Delete Table"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="h-16 w-16 bg-orange-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4 border border-orange-100 dark:border-slate-700 text-orange-600 dark:text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    {table.tableNumber}
                                </div>

                                <div className="space-y-3 flex-grow flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[9px] mb-2">
                                            <Users className="h-3 w-3 mr-1.5" /> {table.capacity} Seats
                                        </div>
                                        <div className="text-[10px] font-black text-orange-700 dark:text-orange-500 uppercase tracking-wider">
                                            {table.preference !== 'None' ? table.preference : (table.viewType || 'Indoor')}
                                        </div>
                                        {table.description && (
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 line-clamp-2 leading-relaxed italic">
                                                "{table.description}"
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-4">
                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(table.status)}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                table.status === 'Available' ? 'bg-emerald-500' :
                                                table.status === 'Occupied' ? 'bg-rose-500' : 'bg-amber-500'
                                            } animate-pulse`} />
                                            {table.status}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[2rem] border border-orange-50 dark:border-slate-800 p-8">
                                <AlertCircle className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px]">No tables registered yet.</p>
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
                            className="bg-white dark:bg-slate-900 w-full max-w-md max-h-[90vh] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden flex flex-col border border-orange-50 dark:border-slate-800"
                        >
                            <div className="p-8 border-b border-orange-50 dark:border-slate-800 flex justify-between items-center shrink-0">
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase italic">
                                    {editingTable ? 'Edit Table' : 'New Table'}
                                </h3>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-xl transition-all">
                                    <X className="h-5 w-5 text-slate-400" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col flex-grow overflow-hidden">
                                <div className="p-8 overflow-y-auto flex-grow space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Table Number/Name</label>
                                        <input
                                            required placeholder="e.g. T-12"
                                            className="w-full bg-slate-50 dark:bg-slate-950 dark:text-white border-none rounded-xl py-3 px-5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                            value={formData.tableNumber} onChange={e => setFormData({ ...formData, tableNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Guest Capacity</label>
                                        <input
                                            required type="number" min="1"
                                            className="w-full bg-slate-50 dark:bg-slate-950 dark:text-white border-none rounded-xl py-3 px-5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                            value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Seating Preference</label>
                                        <select
                                            className="w-full bg-slate-50 dark:bg-slate-950 dark:text-white border-none rounded-xl py-3 px-5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                                            value={isCustomPref ? 'CUSTOM' : selectedPref}
                                            onChange={e => {
                                                if (e.target.value === 'CUSTOM') {
                                                    setIsCustomPref(true);
                                                } else {
                                                    setIsCustomPref(false);
                                                    setSelectedPref(e.target.value);
                                                }
                                            }}
                                        >
                                            {seatingPrefsList.map(pr => (
                                                <option key={pr} value={pr} className="bg-white dark:bg-slate-900 text-slate-700 dark:text-white">
                                                    {pr}
                                                </option>
                                            ))}
                                            <option value="CUSTOM" className="bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-500 font-bold">
                                                + Add New Seating Preference
                                            </option>
                                        </select>
                                    </div>

                                    {isCustomPref && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-rose-500 dark:text-rose-500 uppercase tracking-widest ml-1">Custom Seating Preference</label>
                                            <input
                                                required
                                                placeholder="e.g. Sea View, Pool Side, Near Aquarium..."
                                                className="w-full bg-slate-50 dark:bg-slate-950 dark:text-white border-none rounded-xl py-3 px-5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                                value={customPref}
                                                onChange={e => setCustomPref(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Short Description</label>
                                        <textarea
                                            rows="2" placeholder="e.g. Quiet window seat near the gardens..."
                                            className="w-full bg-slate-50 dark:bg-slate-950 dark:text-white border-none rounded-xl py-3 px-5 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                            value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="p-8 border-t border-orange-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 shrink-0 flex gap-4">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        className="flex-grow border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 py-4 rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-slate-100 dark:hover:bg-slate-800/50 text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="flex-grow bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-100 dark:shadow-none hover:bg-orange-700 transition-all flex items-center justify-center space-x-2 text-xs"
                                    >
                                        <span>{editingTable ? 'Save Changes' : 'Add Table'}</span>
                                        <Check className="h-4 w-4" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Floating Stats */}
            <div className="fixed bottom-8 right-8 bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl z-40 hidden md:flex items-center space-x-8 px-10 border border-white/5">
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
