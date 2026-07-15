import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, Key } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);
        try {
            const { data } = await axiosInstance.post('/api/auth/forgot-password', { email });
            setMessage(data.message || 'Password reset link sent to your email.');
            toast.success('Reset email dispatched successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
            toast.error(err.response?.data?.message || 'Failed to dispatch reset email.');
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
                        <Key className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Forgot Password</h2>
                    <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 font-medium">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                required
                                type="email"
                                placeholder="your@email.com"
                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent dark:border-slate-800 rounded-3xl py-4 pl-16 font-bold text-slate-700 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:border-orange-100 dark:focus:border-orange-900 focus:ring-4 focus:ring-orange-50 dark:focus:ring-orange-950/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-3xl font-black uppercase tracking-widest shadow-lg transition-all flex items-center justify-center space-x-3 group active:scale-[0.98]"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                            <>
                                <span>Send Reset Link</span>
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

export default ForgotPassword;
