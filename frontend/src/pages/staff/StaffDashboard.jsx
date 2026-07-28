import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import {
    XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, BarChart, Bar
} from 'recharts';
import { Calendar, IndianRupee, Clock, AlertCircle, TrendingUp, Users, Loader2, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAuth } from '../../context/AuthContext';

const StatCard = ({ label, value, icon: Icon, trend, color, description }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between group hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500 overflow-hidden relative"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.03] rounded-bl-full group-hover:scale-150 transition-transform duration-700`} />

        <div className="flex justify-between items-start relative z-10">
            <div className={`p-4 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 ')} ${color.replace('bg-', 'text-')}`}>
                <Icon className="h-6 w-6" />
            </div>
            {trend && (
                <div className="flex items-center text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {trend}
                </div>
            )}
        </div>

        <div className="mt-8 relative z-10">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">{label}</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{value}</h3>
            {description && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">{description}</p>}
        </div>
    </motion.div>
);

const Loading = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Data...</p>
    </div>
);

const StaffDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Optimized Fetching Logic: Consolidates metrics and reservations
    const fetchStats = async (isSilent = false) => {
        try {
            // Only show full-screen loader on initial mount or manual retry
            if (!isSilent) setLoading(true);

            // Fetch comprehensive dashboard data (includes stats, manifest, and chart data)
            const res = await axiosInstance.get('/api/staff/dashboard');

            if (res.data) {
                setData(res.data);
                setError(null);
            } else {
                setError('Unable to load dashboard.');
            }
        } catch (err) {
            console.error("Dashboard Sync Error:", err.response?.data || err.message);
            if (err.response?.status === 401) {
                setError('SESSION_EXPIRED');
            } else {
                setError('Unable to load dashboard.');
            }
        } finally {
            if (!isSilent) setLoading(false);
        }
    };

    // Effect for Initial Load and Periodic Synchronization
    useEffect(() => {
        if (user?.restaurantId) {
            fetchStats();

            // High-frequency polling (10s) to reflect new reservations immediately
            const pollInterval = setInterval(() => {
                fetchStats(true);
            }, 10000);

            return () => clearInterval(pollInterval);
        }
    }, [user?.restaurantId]);

    if (loading) return <Loading />;

    if (error === 'SESSION_EXPIRED') {
        return <Navigate to="/staff/login" replace />;
    }

    const stats = data?.stats;
    if (!stats) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="bg-orange-50 p-6 rounded-full">
                <AlertCircle className="h-10 w-10 text-orange-600" />
            </div>
            <p className="text-slate-600 font-bold uppercase tracking-tight text-sm">{error || "Unable to load dashboard."}</p>
            <button
                onClick={() => fetchStats(false)}
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all font-sans"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Control Hub</h2>
                    <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Real-time operational overview</p>
                </div>
                <button
                    onClick={() => fetchStats(false)}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md dark:hover:shadow-none transition-all group"
                >
                    <TrendingUp className="h-4 w-4 text-orange-600 group-hover:rotate-12 transition-transform" />
                </button>
            </div>

            {/* Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard
                    label="Today's Bookings"
                    value={data?.stats?.totalToday || 0}
                    icon={Users}
                    color="bg-slate-900"
                    description="Total reservations logged today"
                />
                <StatCard
                    label="Upcoming Entries"
                    value={data?.stats?.upcoming || 0}
                    icon={Clock}
                    color="bg-orange-600"
                    description="Guests arriving shortly"
                />
                <StatCard
                    label="Revenue Est."
                    value={`₹${(data?.stats?.revenue || 0).toLocaleString()}`}
                    icon={IndianRupee}
                    color="bg-emerald-600"
                    description="Projected today's revenue"
                />
                <StatCard
                    label="Cancellations"
                    value={data?.stats?.noShows || 0}
                    icon={AlertCircle}
                    color="bg-rose-600"
                    description="Total missed appointments"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Manifest Table */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="p-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/20">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Guest Manifest</h3>
                    </div>
                    <div className="overflow-x-auto px-4">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-50 dark:border-slate-800">
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Guest</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Arrival</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {data?.todayReservations?.length > 0 ? data.todayReservations.map((res) => (
                                    <tr key={res._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-6 py-8">
                                            <div className="flex items-center space-x-4">
                                                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-slate-600 dark:text-slate-300">
                                                    {res.fullName?.[0]}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-800 dark:text-white text-sm">{res.fullName}</p>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{res.guests} Guests • {res.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-8">
                                            <span className="text-sm font-black text-slate-700 dark:text-slate-400 italic">
                                                {new Date(res.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-8">
                                            <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                                res.status === 'Confirmed' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' :
                                                res.status === 'CheckedIn' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' :
                                                res.status === 'Completed' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400' :
                                                'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                                            }`}>
                                                {res.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="py-32 text-center text-slate-300 dark:text-slate-700 font-black uppercase text-xs tracking-widest">
                                            No active reservations
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Velocity Chart */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800">
                    <div className="mb-10">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">Booking Velocity</h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-1 uppercase tracking-widest">7-Day Trend Analysis</p>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data?.chartData || []}>
                                <defs>
                                    <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 900 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '16px', border: 'none', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 900 }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#ea580c" strokeWidth={4} fillOpacity={1} fill="url(#chartColor)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;


