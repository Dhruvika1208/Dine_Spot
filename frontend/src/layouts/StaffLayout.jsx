import React from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    CalendarCheck,
    UtensilsCrossed,
    Table as TableIcon,
    LogOut,
    BarChart3,
    ArrowLeft,
    Store,
    ChevronRight,
    Sun,
    Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SidebarItem = ({ to, icon: Icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                    ? "bg-orange-500 text-white shadow-lg"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
            }
        >
            {({ isActive }) => (
                <>
                    <Icon className="h-5 w-5" />
                    <span className="font-bold text-xs uppercase tracking-widest">{label}</span>
                    {isActive && <ChevronRight className="h-4 w-4 opacity-50 ml-auto" />}
                </>
            )}
        </NavLink>
    );
};

const StaffLayout = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#FDFCFB] dark:bg-slate-950 dark:text-white flex font-sans transition-colors duration-200">
            {/* Professional Dark Sidebar */}
            <aside className="w-72 bg-slate-900 text-white flex flex-col sticky top-0 h-screen z-40 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <div className="bg-orange-600 p-2.5 rounded-xl shadow-lg">
                            <Store className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black tracking-tighter leading-none italic uppercase">DineSpot</h2>
                            <p className="text-[10px] font-bold text-orange-400 tracking-[0.2em] mt-1 italic uppercase">Partner Pro</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-4 space-y-2 mt-4">
                    <SidebarItem to="/staff/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/staff/reservations" icon={CalendarCheck} label="Reservations" />
                    <SidebarItem to="/staff/menu" icon={UtensilsCrossed} label="Menu" />
                    <SidebarItem to="/staff/tables" icon={TableIcon} label="Tables" />
                    <SidebarItem to="/staff/analytics" icon={BarChart3} label="Analytics" />
                    <SidebarItem to="/staff/settings" icon={Store} label="Settings" />
                </div>

                <div className="p-6 border-t border-white/10">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center space-x-4 mb-4">
                        <div className="h-10 w-10 bg-orange-600 text-white rounded-xl flex items-center justify-center font-black">
                            {user?.name?.[0]}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-black truncate">{user?.name}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Administrator</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center justify-center space-x-3 px-6 py-4 rounded-2xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all w-full font-black text-[10px] uppercase tracking-widest border border-white/5"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Global Staff Header */}
                <header className="h-[80px] bg-white dark:bg-slate-900 border-b border-orange-100 dark:border-slate-800 flex items-center justify-between px-10 sticky top-0 z-30 shadow-sm transition-colors duration-200">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => {
                                if (window.history.length > 1 && location.pathname !== '/staff/dashboard') {
                                    navigate(-1);
                                } else {
                                    navigate('/staff/dashboard');
                                }
                            }}
                            className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-300 rounded-xl hover:bg-orange-50 dark:hover:bg-slate-700 hover:text-orange-600 transition-all group border border-slate-100 dark:border-slate-800"
                        >
                            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />
                        <div>
                            <h1 className="text-lg font-black text-slate-800 dark:text-white tracking-tight uppercase">
                                {user?.restaurantName || 'Staff Control Panel'}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-orange-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-indigo-600" />}
                        </button>

                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Operational Status</p>
                            <p className="text-[10px] font-bold text-emerald-600 flex items-center justify-end">
                                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
                                Live & Synced
                            </p>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-10 overflow-y-auto">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-7xl mx-auto"
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default StaffLayout;

