import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Utensils, Shield, Heart, ArrowRight, Sparkles, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="min-h-screen text-slate-800 dark:text-slate-100 transition-colors duration-200">
            {/* Hero Section */}
            <section className="relative px-6 pt-16 pb-32 overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-orange-100/50 dark:bg-orange-950/10 rounded-full blur-3xl z-0" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-orange-50 dark:bg-orange-950/5 rounded-full blur-3xl z-0" />

                <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="text-left">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
                            className="mb-8 inline-flex items-center px-6 py-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-xs font-black uppercase tracking-widest shadow-sm"
                        >
                            <Sparkles className="h-4 w-4 mr-2" /> The Future of Dining is Here
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
                            className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.9] uppercase italic"
                        >
                            Savor the <br />
                            <span className="text-orange-600 dark:text-orange-500">Extraordinary.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-lg text-slate-500 dark:text-slate-400 mb-12 max-w-xl font-medium leading-relaxed"
                        >
                            Discover and reserve tables at the world's most sought-after restaurants.
                            From hidden gems to Michelin-starred icons, find your seat at the table.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-6"
                        >
                            <Link
                                to="/restaurants"
                                className="w-full sm:w-auto bg-orange-600 text-white px-12 py-6 rounded-2xl font-black shadow-2xl shadow-orange-200 dark:shadow-none hover:bg-orange-700 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest flex items-center justify-center group"
                            >
                                Book a Table <ArrowRight className="h-5 w-5 ml-3 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link
                                to="/restaurants"
                                className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 px-12 py-6 rounded-2xl font-black border-2 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all text-sm uppercase tracking-widest flex items-center justify-center"
                            >
                                Explore Menu
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative hidden lg:block"
                    >
                        {/* Representative Image Frame */}
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white dark:border-slate-900 ring-1 ring-orange-100 dark:ring-slate-800">
                            <img
                                src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000"
                                alt="Premium Dining"
                                className="w-full h-[600px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
                                <div>
                                    <p className="text-white/60 font-bold uppercase tracking-widest text-xs mb-2">Featured Restaurant</p>
                                    <h2 className="text-white text-3xl font-black uppercase tracking-tight italic">The Golden Pavilion</h2>
                                </div>
                            </div>
                        </div>
                        {/* Floating Badge */}
                        <div className="absolute -bottom-10 -left-10 bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-2xl border border-orange-50 dark:border-slate-800 max-w-xs animate-bounce-slow">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-orange-100 dark:bg-orange-950/30 rounded-xl">
                                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">Instant Confirmation in seconds.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-32 bg-white dark:bg-slate-900 border-y border-orange-50 dark:border-slate-800 transition-colors duration-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4 uppercase italic">Why DineSpot?</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">We bridge the gap between hunger and happiness.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: 'Safe & Secure', desc: 'Encrypted booking protocols and verified restaurant partners.', icon: Shield, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/20' },
                            { title: 'Global Flavors', desc: 'From local bistros to international gourmet destinations.', icon: Utensils, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/20' },
                            { title: 'Prime Locations', desc: 'Secure the best seats in the most desired spots.', icon: MapPin, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/20' }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-10 rounded-[2.5rem] bg-[#FDFCFB] dark:bg-slate-950 border border-orange-50 dark:border-slate-800 hover:shadow-xl dark:hover:border-slate-700 transition-all group"
                            >
                                <div className={`${feature.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
