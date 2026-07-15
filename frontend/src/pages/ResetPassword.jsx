import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            toast.error('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axiosInstance.post(`/api/auth/reset-password/${token}`, { password });
            setMessage(data.message || 'Password reset successfully!');
            toast.success('Password updated successfully! Redirecting...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. The link may have expired.');
            toast.error(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFFCFA] dark:bg-slate-950 flex items-center justify-center p-4 theme-transition">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] shadow-xl border border-orange-100/50 dark:border-slate-800"
            >
                <div className="mb-8 text-center">
                    <div className="inline-flex p-3 bg-orange-50 dark:bg-orange-950/20 rounded-2xl mb-4 text-orange-600">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Reset Password</h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 font-medium">Please enter your new security key below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold">
                            {message} Redirecting to login...
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">New Security Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent dark:border-slate-800 rounded-3xl py-4 pl-16 pr-14 font-bold text-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-orange-900 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 focus:outline-none flex items-center justify-center"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Confirm Security Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent dark:border-slate-800 rounded-3xl py-4 pl-16 pr-14 font-bold text-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-orange-900 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 focus:outline-none flex items-center justify-center"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-3xl font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center space-x-3 group active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                            <>
                                <span>Reset Password</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="pt-4 text-center">
                        <Link to="/login" className="text-xs font-black text-orange-600 uppercase tracking-widest hover:text-orange-700">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
