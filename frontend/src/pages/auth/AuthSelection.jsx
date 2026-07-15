import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, ShieldCheck, ArrowRight } from 'lucide-react';

const AuthSelection = () => {
    const navigate = useNavigate();

    const roles = [
        {
            title: 'Customer',
            id: 'user',
            icon: User,
            color: 'from-blue-500 to-indigo-600',
            description: 'Book tables and explore curated dining experiences.'
        },
        {
            title: 'Staff / Partner',
            id: 'staff',
            icon: ShieldCheck,
            color: 'from-slate-700 to-slate-900',
            description: 'Manage reservations, floor layouts, and culinary entries.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6 text-slate-900 dark:text-slate-100">
            <div className="max-w-4xl w-full">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">DineSpot Protocol</h1>
                    <p className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Identify your session context to proceed</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {roles.map((role) => (
                        <motion.button
                            key={role.id}
                            whileHover={{ y: -10, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                if (role.id === 'staff') navigate('/staff/login');
                                else navigate('/login?role=user');
                            }}
                            className="bg-white dark:bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 text-left group transition-all flex flex-col h-full relative overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${role.color} opacity-5 -mr-16 -mt-16 rounded-full transition-all group-hover:scale-150`} />

                            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-10 shadow-xl shadow-current/20`}>
                                <role.icon className="h-10 w-10 text-white" />
                            </div>

                            <div className="flex-grow space-y-4">
                                <h3 className="text-3xl font-black text-slate-800 dark:text-white italic uppercase underline decoration-indigo-500/20 underline-offset-8">Login as {role.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 font-medium italic text-lg leading-relaxed">
                                    {role.description}
                                </p>
                            </div>

                            <div className="mt-12 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 group-hover:translate-x-2 transition-transform">Initialize Handshake</span>
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <ArrowRight className="h-5 w-5" />
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AuthSelection;
