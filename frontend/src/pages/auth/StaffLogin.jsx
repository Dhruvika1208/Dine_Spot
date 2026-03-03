import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldAlert, Lock, Mail, ArrowRight, Loader2, ChefHat } from 'lucide-react';

const StaffLogin = () => {
    const navigate = useNavigate();
    const { loginStaff } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
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
                    <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-2xl">
                        <ChefHat className="h-10 w-10 text-orange-500" />
                    </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl p-10 sm:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-2">Staff Portal</h2>
                        <p className="text-slate-400 text-sm font-medium">Authorized Personnel Only</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-bold leading-relaxed">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                                    <input
                                        required type="email"
                                        placeholder="user@dinespot.com"
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-3xl py-5 pl-16 text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-700"
                                        value={email} onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Access Passphrase</label>
                                <div className="relative">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600" />
                                    <input
                                        required type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-3xl py-5 pl-16 text-white font-medium focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-slate-700"
                                        value={password} onChange={e => setPassword(e.target.value)}
                                    />
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

                        <div className="flex justify-center pt-6">
                            <Link to="/login?role=user" className="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-orange-500 transition-colors">
                                Standard User Portal
                            </Link>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em] italic">
                    <ShieldAlert className="inline h-3 w-3 mr-2 mb-0.5" />
                    Secure Environment Protected by TLS 1.3
                </p>
            </motion.div>
        </div>
    );
};

export default StaffLogin;
