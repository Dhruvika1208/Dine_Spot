import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck, Star, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { register, loginGoogle } = useAuth();

    const searchParams = new URLSearchParams(location.search);
    const role = searchParams.get('role') || 'user';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleCredentialResponse = async (response) => {
        setError('');
        setLoading(true);
        try {
            await loginGoogle(response.credential);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Google authentication failed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (role !== 'user') return;

        // Load Google Identity Services script
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

        script.onload = () => {
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '257726893552-q8k4cnm502arme4iosrrs0unveortoge.apps.googleusercontent.com',
                    callback: handleGoogleCredentialResponse
                });
                
                window.google.accounts.id.renderButton(
                    document.getElementById('google-signin-button'),
                    { theme: 'outline', size: 'large', width: '100%' }
                );
            }
        };

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [role]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (role === 'staff') {
            setError('Public staff registration is disabled. Contact system admin.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await register({ name, email, password });
            navigate('/login?role=user');
        } catch (err) {
            setError(err.response?.data?.message || 'Identity registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FFFCFA] dark:bg-slate-950 transition-colors duration-200">
            {/* Left Side: Visual Experience */}
            <div className="hidden lg:flex lg:col-span-5 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=1200"
                    className="absolute inset-0 w-full h-full object-cover transform scale-105"
                    alt="Dining"
                />
                <div className="absolute inset-0 bg-orange-950/40 backdrop-blur-[2px]" />

                <div className="relative z-10 w-full p-20 flex flex-col justify-between text-white">
                    <div>
                        <Link to="/" className="flex items-center space-x-3 mb-24 group">
                            <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 group-hover:bg-white/30 transition-all">
                                <Utensils className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black uppercase tracking-tighter">DineSpot</span>
                        </Link>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-7xl font-black tracking-tight leading-[0.9] mb-8"
                        >
                            Begin Your <br />
                            <span className="text-orange-400">Journey.</span>
                        </motion.h1>
                        <p className="text-xl font-medium text-white/80 max-w-sm border-l-4 border-orange-500 pl-8 leading-relaxed">
                            Join our community of elite diners and unlock exclusive table access at the world's finest establishments.
                        </p>
                    </div>

                    <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/10 w-fit">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-10 w-10 rounded-full border-2 border-orange-500 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Community</p>
                            <p className="text-sm font-bold">5k+ Elite Diners</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:col-span-7 flex items-center justify-center p-8 sm:p-20">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full max-w-xl bg-white dark:bg-slate-900 p-12 sm:p-16 rounded-[3.5rem] shadow-2xl border border-orange-100/50 dark:border-slate-800 transition-all"
                >
                    <div className="mb-12">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="h-1 w-8 bg-orange-600 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Account Creation</span>
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                            Join DineSpot
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold flex items-center"
                            >
                                <span className="bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center mr-3 text-[10px]">!</span>
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        required type="text"
                                        placeholder="Alexander Pierce"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-3xl py-5 pl-16 font-bold text-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-slate-800 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 outline-none transition-all placeholder:text-slate-400"
                                        value={name} onChange={e => setName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        required type="email"
                                        placeholder="your@email.com"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-3xl py-5 pl-16 font-bold text-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-slate-800 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 outline-none transition-all placeholder:text-slate-400"
                                        value={email} onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-orange-500 transition-colors pointer-events-none" />
                                    <input
                                        required type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent rounded-3xl py-5 pl-16 pr-14 font-bold text-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-slate-800 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/20 outline-none transition-all placeholder:text-slate-400"
                                        value={password} onChange={e => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-xl transition-all flex items-center justify-center space-x-3 group active:scale-[0.98]"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                                </>
                            )}
                        </button>

                        {role === 'user' && (
                            <div className="space-y-4 mt-6">
                                <div className="flex items-center justify-center space-x-3">
                                    <div className="h-[1px] bg-slate-100/40 flex-grow" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Or connect with</span>
                                    <div className="h-[1px] bg-slate-100/40 flex-grow" />
                                </div>
                                <div id="google-signin-button" className="w-full flex justify-center" />
                            </div>
                        )}

                        <div className="pt-8 border-t border-orange-50 dark:border-slate-800 flex justify-center items-center space-x-2">
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Already have an account?</p>
                            <Link to="/login?role=user" className="text-xs font-black text-orange-600 dark:text-orange-500 uppercase tracking-widest hover:text-orange-700">Login Instead</Link>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

const Utensils = ({ className }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
);

export default Register;

