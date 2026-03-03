import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Utensils } from 'lucide-react';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors">
                                Home
                            </Link>
                            <Link to="/restaurants" className="text-slate-600 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors">
                                Restaurants
                            </Link>
                            {user ? (
                                <div className="flex items-center space-x-6">
                                    <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-bold text-sm uppercase tracking-widest transition-colors border-l border-slate-200 pl-6">
                                        My Bookings
                                    </Link>
                                    <button
                                        onClick={() => { logout(); navigate('/login'); }}
                                        className="h-10 w-10 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all font-black"
                                        title="Sign Out"
                                    >
                                        {user.name?.[0]}
                                    </button>
                                </div>
                            ) : (
                                <Link to="/login" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} DineSpot Smart Reservation System.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
