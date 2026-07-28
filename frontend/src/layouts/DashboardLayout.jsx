import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DineSpotIcon } from '../components/DineSpotIcon';
import {
    LayoutDashboard,
    CalendarCheck,
    UtensilsCrossed,
    Table as TableIcon,
    LogOut,
    Settings,
    Bell,
    BarChart3
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label }) => (
    <NavLink
        to={to}
        end
        className={({ isActive }) => `
      flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
      ${isActive
                ? 'bg-primary-50 text-primary-600 shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
    `}
    >
        <Icon className="h-5 w-5" />
        <span className="font-medium">{label}</span>
    </NavLink>
);

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
                <div className="p-6">
                    <div className="flex items-center space-x-2 mb-10">
                        <div className="bg-primary-600 p-2 rounded-lg">
                            <DineSpotIcon className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-800 tracking-tight">DineSpot <span className="text-primary-500">Pro</span></span>
                    </div>

                    <nav className="space-y-2">
                        <SidebarItem to="/staff" icon={LayoutDashboard} label="Dashboard" />
                        <SidebarItem to="/staff/reservations" icon={CalendarCheck} label="Reservations" />
                        <SidebarItem to="/staff/menu" icon={UtensilsCrossed} label="Menu" />
                        <SidebarItem to="/staff/tables" icon={TableIcon} label="Tables" />
                        <SidebarItem to="/staff/analytics" icon={BarChart3} label="Analytics" />
                    </nav>
                </div>

                <div className="mt-auto p-6 border-t border-slate-100">
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all w-full"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
                    <h1 className="text-lg font-semibold text-slate-800">
                        Welcome back, {user?.name?.split(' ')[0]}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors relative">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user?.name?.[0]}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Outlet />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
