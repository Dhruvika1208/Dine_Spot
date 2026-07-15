import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, Mail, ArrowRight, Loader2, ChefHat, ArrowLeft, Eye, EyeOff, Sun, Moon } from 'lucide-react';

const StaffLogin = () => {
    const navigate = useNavigate();
    const { loginStaff } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await loginStaff(email, password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("restaurantId", data.restaurantId);
            navigate('/staff/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Unauthorized access attempt recorded.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 relative overflow-hidden text-slate-800 dark:text-slate-100 transition-colors duration-300">
            {/* Back to Home Button */}
            <Link 
                to="/" 
                className="absolute top-8 left-8 flex items-center space-x-3 text-slate-500 hover:text-orange-500 transition-all group z-50 animate-fadeIn"
            >
                <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 group-hover:bg-orange-500/10 transition-colors shadow-sm">
                    <ArrowLeft className="h-5 w-5 text-slate-800 dark:text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white hidden sm:inline">Back to Home</span>
            </Link>

            {/* Theme Toggle Button */}
            <button
                onClick={toggleTheme}
                type="button"
                className="absolute top-8 right-8 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center focus:outline-none shadow-sm z-50"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-indigo-500" />}
            </button>

            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="flex justify-center mb-8">
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl transition-colors duration-300">
                        <ChefHat className="h-10 w-10 text-orange-500" />
                    </div>
                </div>

                <div className="bg-white/80 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 shadow-2xl backdrop-blur-xl p-10 sm:p-12 rounded-[3.5rem] transition-colors duration-300">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-2">Staff Portal</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-bold leading-relaxed">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600 pointer-events-none" />
                                    <input
                                        required type="email"
                                        placeholder="user@dinespot.com"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl py-5 pl-16 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                        value={email} onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Access Passphrase</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-600 pointer-events-none" />
                                    <input
                                        required type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl py-5 pl-16 pr-14 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                        value={password} onChange={e => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-500 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-orange-950/20 transition-all flex items-center justify-center space-x-3 group active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <>
                                    <span>Initiate Session</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-4">
                            <Link to="/login?role=user" className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-orange-500 transition-colors">
                                Standard User Portal
                            </Link>
                            <Link to="/staff/signup" className="text-[10px] font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest hover:text-orange-600 transition-colors">
                                Register Restaurant
                            </Link>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-[9px] font-bold text-slate-500 dark:text-slate-600 uppercase tracking-[0.4em] italic">
                    <ShieldAlert className="inline h-3 w-3 mr-2 mb-0.5" />
                    Secure Environment Protected by TLS 1.3
                </p>
            </motion.div>
        </div>
    );
};

export default StaffLogin;
