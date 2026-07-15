import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { 
    Clock, Search, Filter, Shield, User, Mail, 
    Calendar, CheckCircle, Info, Loader2, RefreshCcw, 
    HelpCircle, ChevronRight, AlertCircle, Ban, QrCode, Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const getActivityStyle = (action) => {
    switch (action) {
        case 'Restaurant Update':
        case 'restaurant_updated':
            return { 
                label: 'Restaurant Update', 
                bg: 'bg-indigo-50 dark:bg-indigo-950/20', 
                text: 'text-indigo-600 dark:text-indigo-400', 
                border: 'border-indigo-100 dark:border-indigo-900/40' 
            };
        case 'Menu Update':
        case 'menu_updated':
            return { 
                label: 'Menu Update', 
                bg: 'bg-amber-50 dark:bg-amber-950/20', 
                text: 'text-amber-600 dark:text-amber-400', 
                border: 'border-amber-100 dark:border-amber-900/40' 
            };
        case 'Gallery Update':
            return { 
                label: 'Gallery Update', 
                bg: 'bg-violet-50 dark:bg-violet-950/20', 
                text: 'text-violet-600 dark:text-violet-400', 
                border: 'border-violet-100 dark:border-violet-900/40' 
            };
        case 'Location Update':
            return { 
                label: 'Location Update', 
                bg: 'bg-sky-50 dark:bg-sky-950/20', 
                text: 'text-sky-600 dark:text-sky-400', 
                border: 'border-sky-100 dark:border-sky-900/40' 
            };
        case 'Password Change':
            return { 
                label: 'Password Change', 
                bg: 'bg-rose-50 dark:bg-rose-950/20', 
                text: 'text-rose-600 dark:text-rose-400', 
                border: 'border-rose-100 dark:border-rose-900/40' 
            };
        case 'table_status_changed':
            return { 
                label: 'Table Update', 
                bg: 'bg-emerald-50 dark:bg-emerald-950/20', 
                text: 'text-emerald-600 dark:text-emerald-400', 
                border: 'border-emerald-100 dark:border-emerald-900/40' 
            };
        default:
            return { 
                label: action || 'General Action', 
                bg: 'bg-slate-50 dark:bg-slate-800', 
                text: 'text-slate-600 dark:text-slate-300', 
                border: 'border-slate-200 dark:border-slate-700' 
            };
    }
};

const ActivityLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('All');
    const [error, setError] = useState('');

    const fetchLogs = async (isSilent = false) => {
        try {
            if (!isSilent) setLoading(true);
            const { data } = await axiosInstance.get('/api/staff/activity-log');
            setLogs(data || []);
            setError('');
        } catch (err) {
            console.error('Activity Log Sync Error:', err);
            setError('Failed to synchronize security activity log.');
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            (log.description || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
            (log.staffName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.staffEmail || '').toLowerCase().includes(searchTerm.toLowerCase());
            
        let matchesAction = true;
        if (actionFilter !== 'All') {
            const mappedAction = getActivityStyle(log.action).label;
            matchesAction = mappedAction === actionFilter;
        }
        return matchesSearch && matchesAction;
    });

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 dark:border-slate-800 pb-12">
                <div>
                    <h1 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter italic">Security Activity Log</h1>
                    <p className="text-slate-400 dark:text-slate-500 font-bold italic mt-2 uppercase text-[10px] tracking-widest flex items-center">
                        <Shield className="h-3.5 w-3.5 mr-2 text-rose-500" /> Tamper-Proof Audit Manifest & Operations Logs
                    </p>
                </div>
                <button
                    onClick={() => fetchLogs(false)}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-none transition-all group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300"
                >
                    <RefreshCcw className="h-4 w-4 text-orange-600 group-hover:rotate-180 transition-transform duration-750" />
                    <span>Sync Feed</span>
                </button>
            </div>

            {/* Error banner */}
            {error && (
                <div className="p-6 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 rounded-3xl flex items-center gap-4 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="h-6 w-6" />
                    <p className="font-black text-[10px] uppercase tracking-widest">{error}</p>
                </div>
            )}

            {/* Controls */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-8 group hover:shadow-xl dark:hover:shadow-none transition-all">
                <div className="relative flex-1 min-w-[320px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-600" />
                    <input
                        type="text"
                        placeholder="Filter by description, staff name, or email..."
                        className="w-full pl-14 pr-8 py-5 bg-slate-50 dark:bg-slate-950 border-none rounded-[2rem] focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-950/30 outline-none font-black text-xs uppercase tracking-widest text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic font-sans">Action Type:</span>
                    <select
                        className="bg-slate-50 dark:bg-slate-950 border-none rounded-2xl py-4 px-8 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-950/30 appearance-none italic underline"
                        value={actionFilter}
                        onChange={e => setActionFilter(e.target.value)}
                    >
                        <option value="All" className="dark:bg-slate-950">All Actions</option>
                        <option value="Restaurant Update" className="dark:bg-slate-950">Restaurant Updates</option>
                        <option value="Menu Update" className="dark:bg-slate-950">Menu Updates</option>
                        <option value="Gallery Update" className="dark:bg-slate-950">Gallery Updates</option>
                        <option value="Location Update" className="dark:bg-slate-950">Location Updates</option>
                        <option value="Password Change" className="dark:bg-slate-950">Password Changes</option>
                        <option value="Table Update" className="dark:bg-slate-950">Table Updates</option>
                    </select>
                </div>
            </div>

            {/* Table Board */}
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#fbfeff] dark:bg-slate-950/40 border-b border-slate-50 dark:border-slate-800">
                            <tr>
                                <th className="px-12 py-8 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] italic">Timeline Anchor</th>
                                <th className="px-12 py-8 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] italic">Staff Member</th>
                                <th className="px-12 py-8 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] italic text-center">Action performed</th>
                                <th className="px-12 py-8 text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] italic">Log Description</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                            <AnimatePresence>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-32 text-center">
                                            <Loader2 className="h-12 w-12 text-orange-600 dark:text-orange-400 animate-spin mx-auto mb-6" />
                                            <p className="text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Security Matrix...</p>
                                        </td>
                                    </tr>
                                ) : filteredLogs.length > 0 ? filteredLogs.map((log, i) => {
                                    const style = getActivityStyle(log.action);

                                    return (
                                        <motion.tr
                                            key={log._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors group relative"
                                        >
                                            <td className="px-12 py-8">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-11 w-11 rounded-2xl bg-orange-50 dark:bg-slate-950 flex items-center justify-center border border-orange-100 dark:border-slate-800 group-hover:scale-105 transition-all">
                                                        <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 dark:text-slate-200 text-xs tracking-tighter">
                                                            {new Date(log.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </p>
                                                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest flex items-center mt-0.5 italic">
                                                            <Clock className="h-3 w-3 mr-1 text-orange-500" /> {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8">
                                                <div className="flex items-center space-x-4">
                                                    <div className="h-10 w-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-500 dark:text-slate-400 text-xs shadow-inner">
                                                        {log.staffName?.charAt(0) || 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 dark:text-slate-200 tracking-tight text-sm">{log.staffName || 'System'}</p>
                                                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black tracking-widest uppercase flex items-center mt-0.5 space-x-1.5 italic">
                                                            <Mail className="h-3 w-3 text-orange-500" /> <span>{log.staffEmail || 'system@dinespot.com'}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8 text-center">
                                                <div className={`inline-flex items-center px-5 py-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} shadow-sm group-hover:scale-105 transition-all`}>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{style.label}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-8">
                                                <p className="text-slate-700 dark:text-slate-300 font-bold text-xs leading-relaxed italic max-w-md">
                                                    "{log.description}"
                                                </p>
                                            </td>
                                        </motion.tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-32 text-center">
                                            <HelpCircle className="h-14 w-14 text-slate-100 dark:text-slate-800 mx-auto mb-6 animate-bounce" />
                                            <p className="text-slate-300 dark:text-slate-600 font-black italic uppercase tracking-[0.2em] text-xs">Awaiting Security Manifest: No Logs Recorded.</p>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActivityLog;
