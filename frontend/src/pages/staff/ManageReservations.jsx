import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import {
    Clock, Search, Filter, Calendar, Users,
    ArrowUpRight, CheckCircle2,
    XCircle, Clock3, Ban, HelpCircle, Loader2, Info, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ManageReservations = () => {
    const navigate = useNavigate();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [error, setError] = useState('');

    const fetchRes = async (isSilent = false) => {
        console.log('Board: Synchronizing guest admissions...');
        try {
            if (!isSilent) setLoading(true);
            const { data } = await axiosInstance.get('/api/reservations/restaurant');
            console.log('Board: Connection established. Admissions found:', data.length);
            setReservations(data);
        } catch (err) {
            console.error('Board ERROR:', err);
            setError(err.response?.data?.message || 'Hub synchronization failed.');
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchRes();

        // Polling: Automatically fetch latest reservations every 30 seconds
        const pollInterval = setInterval(() => {
            fetchRes(true);
        }, 30000);

        return () => clearInterval(pollInterval);
    }, []);

    const handleAction = async (id, action) => {
        console.log(`Board Action: Triggering [${action}] for ${id}`);
        try {
            if (action === 'checkin') {
                await axiosInstance.post('/api/reservations/checkin', { reservationId: id });
            } else if (action === 'complete') {
                await axiosInstance.put(`/api/reservations/${id}/complete`);
            } else if (action === 'noshow') {
                await axiosInstance.put(`/api/reservations/${id}/noshow`);
            }
            console.log(`Board Action: SUCCESS [${action}]`);
            fetchRes();
        } catch (err) {
            console.error(`Board Action FAILURE: [${action}]`, err);
            alert(err.response?.data?.message || 'Target operational action failed.');
        }
    };

    const statusColors = {
        'Confirmed': { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', icon: CheckCircle2 },
        'CheckedIn': { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', icon: Clock3 },
        'Completed': { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', icon: CheckCircle2 },
        'Cancelled': { bg: 'bg-slate-100', text: 'text-slate-500', border: 'border-slate-200', icon: XCircle },
        'NoShow': { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', icon: Ban }
    };

    const filteredReservations = reservations.filter(res => {
        const matchesSearch = res.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || res.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || res.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-10">
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

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-100 pb-12">
                <div>
                    <h1 className="text-5xl font-black text-slate-800 tracking-tighter italic">Operational Admissions</h1>
                    <p className="text-slate-400 font-bold italic mt-2 uppercase text-[10px] tracking-widest flex items-center">
                        <Info className="h-3 w-3 mr-2 text-indigo-500" /> Coordination Board: Real-time Admissions
                    </p>
                </div>
                <div className="flex bg-white rounded-2xl shadow-sm border border-slate-100 p-1">
                    <button className="px-8 py-3 text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white rounded-xl shadow-lg transition-all">Daily Queue</button>
                    <button className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 italic underline decoration-indigo-500 decoration-2">Future Logs</button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 text-rose-600 animate-in fade-in slide-in-from-top-4">
                    <HelpCircle className="h-6 w-6" />
                    <p className="font-black text-[10px] uppercase tracking-widest">{error}</p>
                </div>
            )}

            {/* Control Bar: Search & Filtering */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-wrap items-center gap-8 group hover:shadow-xl transition-all">
                <div className="relative flex-1 min-w-[320px]">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Search Guest Database (Name / Contact)..."
                        className="w-full pl-14 pr-8 py-5 bg-slate-50 border-none rounded-[2rem] focus:ring-4 focus:ring-indigo-100 outline-none font-black text-xs uppercase tracking-widest text-slate-700 placeholder:text-slate-300"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Status Logic:</span>
                    <select
                        className="bg-slate-50 border-none rounded-2xl py-4 px-8 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-4 focus:ring-indigo-100 appearance-none italic underline"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="All">Collective Audit</option>
                        <option value="Confirmed">Confirmed Admissions</option>
                        <option value="CheckedIn">Active Floor Cases</option>
                        <option value="Completed">Completed Cycle</option>
                        <option value="NoShow">Security - NoShow</option>
                    </select>
                </div>
            </div>

            {/* Results Board: Functional Table */}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#fbfeff] border-b border-slate-50">
                            <tr>
                                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] italic">Guest Fingerprint</th>
                                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] italic">Timeline Anchor</th>
                                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] italic text-center">Status Flag</th>
                                <th className="px-12 py-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] italic text-right">Operational Overrides</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {loading ? (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-32 text-center">
                                            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-6" />
                                            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Synchronizing Grid Hub...</p>
                                        </td>
                                    </tr>
                                ) : filteredReservations.length > 0 ? filteredReservations.map((res, i) => {
                                    const status = statusColors[res.status] || statusColors['Confirmed'];
                                    const StatusIcon = status.icon;

                                    return (
                                        <motion.tr
                                            key={res._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="hover:bg-slate-50/50 transition-colors group relative"
                                        >
                                            <td className="px-12 py-10">
                                                <div className="flex items-center space-x-6">
                                                    <div className="h-14 w-14 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all text-sm italic shadow-sm">
                                                        {res.fullName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 tracking-tight text-lg">{res.fullName}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase flex items-center mt-1 space-x-2 italic">
                                                            <Users className="h-3 w-3 text-indigo-500" /> <span>{res.guests} PAX REQUISITION</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10">
                                                <div className="flex items-center space-x-5">
                                                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50 group-hover:scale-105 transition-all">
                                                        <Calendar className="h-6 w-6 text-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-800 text-sm tracking-tighter">{new Date(res.reservationTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center mt-1 italic">
                                                            <Clock className="h-3 w-3 mr-2 text-rose-500" /> {new Date(res.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-center">
                                                <div className={`inline-flex items-center px-6 py-2 rounded-full border ${status.bg} ${status.text} ${status.border} shadow-sm group-hover:scale-110 transition-all`}>
                                                    <StatusIcon className="h-3 w-3 mr-2 animate-pulse" />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{res.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-12 py-10 text-right">
                                                <div className="flex justify-end gap-4">
                                                    {res.status === 'Confirmed' && (
                                                        <button
                                                            onClick={() => handleAction(res._id, 'checkin')}
                                                            className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-200 hover:bg-black transition-all flex items-center group/btn"
                                                        >
                                                            Trigger Check In <ArrowUpRight className="h-3 w-3 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                                        </button>
                                                    )}
                                                    {res.status === 'CheckedIn' && (
                                                        <button
                                                            onClick={() => handleAction(res._id, 'complete')}
                                                            className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-black transition-all flex items-center"
                                                        >
                                                            Finalize Cycle <CheckCircle2 className="h-3 w-3 ml-2" />
                                                        </button>
                                                    )}
                                                    {(res.status === 'Confirmed' || res.status === 'CheckedIn') && (
                                                        <button
                                                            onClick={() => handleAction(res._id, 'noshow')}
                                                            className="p-4 bg-white border border-slate-100 text-slate-300 rounded-2xl hover:bg-rose-600 hover:text-white hover:border-rose-700 transition-all group/noshow shadow-sm"
                                                            title="Security Override: No Show"
                                                        >
                                                            <Ban className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" className="px-10 py-32 text-center">
                                            <HelpCircle className="h-14 w-14 text-slate-100 mx-auto mb-6 animate-bounce" />
                                            <p className="text-slate-300 font-black italic uppercase tracking-[0.2em] text-xs">Awaiting Collective Audit: No Admissions Found.</p>
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

export default ManageReservations;
