import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, User, Store, X, Mail, Lock, Sparkles, ChefHat, ChevronDown, UserCircle, LogIn, UserPlus, Sun, Moon, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { DineSpotIcon } from '../components/DineSpotIcon';

const UserLayout = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white dark:from-slate-950 dark:to-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-200">
            {/* Premium Global Navbar */}
            <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-orange-50 dark:border-slate-800 sticky top-0 z-50 h-[100px] flex items-center shadow-sm transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-8 w-full flex justify-between items-center">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="bg-orange-600 p-3 rounded-2xl group-hover:rotate-12 transition-all shadow-xl shadow-orange-200">
                            <DineSpotIcon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase relative">
                            DineSpot
                            <span className="absolute -top-1 -right-4 h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
                        </span>
                    </Link>

                    {/* Navigation Actions */}
                    <div className="flex items-center space-x-2">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all mr-2"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-600" />}
                        </button>
                        {/* User Access Item */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setShowUserDropdown(!showUserDropdown)}
                                className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${showUserDropdown || user
                                    ? 'bg-orange-50 text-orange-600 dark:bg-slate-800 dark:text-orange-500'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {user ? (
                                    <>
                                        <div className="h-6 w-6 bg-orange-600 text-white rounded-lg flex items-center justify-center text-[10px] font-black border-2 border-orange-100 shadow-sm">
                                            {user.name?.[0].toUpperCase()}
                                        </div>
                                        <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                                    </>
                                ) : (
                                    <>
                                        <User className="h-4 w-4" />
                                        <span>User</span>
                                    </>
                                )}
                                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showUserDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {showUserDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-4 w-64 bg-white dark:bg-slate-950 rounded-[2rem] shadow-2xl border border-orange-100/50 dark:border-slate-800 p-4 ring-1 ring-orange-50 dark:ring-slate-800 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-orange-50 dark:border-slate-800 mb-2">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Access Panel</p>
                                        </div>
                                        {user ? (
                                            <div className="space-y-1">
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="flex items-center space-x-3 px-5 py-3 rounded-xl hover:bg-orange-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-all font-bold text-xs"
                                                >
                                                    <LayoutDashboard className="h-4 w-4" />
                                                    <span>My Dashboard</span>
                                                </Link>
                                                <Link
                                                    to="/favorites"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="flex items-center space-x-3 px-5 py-3 rounded-xl hover:bg-orange-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-orange-600 transition-all font-bold text-xs"
                                                >
                                                    <Heart className="h-4 w-4" />
                                                    <span>My Favorites</span>
                                                </Link>
                                                <button
                                                    onClick={() => { logout(); navigate('/'); setShowUserDropdown(false); }}
                                                    className="w-full flex items-center space-x-3 px-5 py-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-300 hover:text-rose-600 transition-all font-bold text-xs"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    <span>Sign Out</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <Link
                                                    to="/login?role=user"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="flex items-center space-x-3 px-5 py-3 rounded-xl hover:bg-orange-600 hover:text-white text-slate-700 dark:text-slate-300 transition-all font-bold text-xs group"
                                                >
                                                    <LogIn className="h-4 w-4 text-orange-600 group-hover:text-white" />
                                                    <span>Log In</span>
                                                </Link>
                                                <Link
                                                    to="/signup?role=user"
                                                    onClick={() => setShowUserDropdown(false)}
                                                    className="flex items-center space-x-3 px-5 py-3 rounded-xl hover:bg-slate-900 hover:text-white text-slate-700 dark:text-slate-300 transition-all font-bold text-xs group"
                                                >
                                                    <UserPlus className="h-4 w-4 text-slate-400 group-hover:text-white" />
                                                    <span>Create Account</span>
                                                </Link>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Staff Access Item */}
                        <Link
                            to="/staff/login"
                            className="flex items-center space-x-3 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-900 hover:text-white transition-all border border-transparent hover:shadow-xl hover:shadow-slate-200 dark:hover:shadow-none"
                        >
                            <ChefHat className="h-4 w-4" />
                            <span>Staff</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Page Content */}
            <main className="flex-grow pt-10 pb-20">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 py-20 mt-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]" />
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="bg-orange-600 p-2.5 rounded-xl">
                                <DineSpotIcon className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter uppercase">DineSpot</span>
                        </div>
                        <p className="text-slate-400 font-medium max-w-sm border-l-2 border-orange-600/30 pl-6 leading-relaxed">
                            The definitive platform for world-class dining reservations. Your table awaits.
                        </p>
                    </div>
                    <div className="flex flex-col md:items-end space-y-4">
                        <Link to="/staff/login" className="flex items-center space-x-2 text-slate-400 hover:text-orange-500 font-bold uppercase tracking-widest text-xs transition-colors">
                            <span>Partner Login</span>
                            <ChevronDown className="h-4 w-4 -rotate-90" />
                        </Link>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
                            &copy; {new Date().getFullYear()} DineSpot Global . Established 2026
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;


