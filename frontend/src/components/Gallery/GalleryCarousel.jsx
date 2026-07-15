import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from '../SafeImage';

const GalleryCarousel = ({ gallery, galleryImages, cuisine }) => {
    // Unify lists of images to ensure support for both database keys
    const images = Array.isArray(galleryImages) && galleryImages.length > 0
        ? galleryImages
        : (Array.isArray(gallery) ? gallery : []);

    // Gracefully hide if no gallery images are available
    if (!images || images.length === 0) return null;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Touch support ref variables
    const touchStart = useRef(0);
    const touchEnd = useRef(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    // Autoplay Timer
    useEffect(() => {
        if (!isPlaying || isHovered) return;
        const interval = setInterval(handleNext, 4000);
        return () => clearInterval(interval);
    }, [isPlaying, isHovered, images.length]);

    // Touch Swipe Event Handlers
    const handleTouchStart = (e) => {
        touchStart.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current) return;
        const distance = touchStart.current - touchEnd.current;
        const isLeftSwipe = distance > 75;
        const isRightSwipe = distance < -75;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }

        // Reset tracking
        touchStart.current = 0;
        touchEnd.current = 0;
    };

    return (
        <section 
            className="w-full mt-16 px-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                    <div className="h-2 w-16 bg-orange-600 rounded-full" />
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Ambience & Gallery</h2>
                    <p className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px] tracking-widest">A glance inside our kitchen & seating space</p>
                </div>
                
                {/* Autoplay Play/Pause Toggle */}
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-orange-50 dark:border-slate-800 text-slate-400 dark:text-slate-300 hover:text-orange-600 transition-colors flex items-center gap-2 hover:scale-105 active:scale-95"
                    title={isPlaying ? "Pause Auto-Slide" : "Play Auto-Slide"}
                >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline">
                        {isPlaying ? 'Autoplay Active' : 'Autoplay Paused'}
                    </span>
                </button>
            </div>

            {/* Slider Showcase Frame */}
            <div className="relative h-[300px] sm:h-[450px] lg:h-[550px] w-full rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-950 group/slider">
                {/* Zoomable Image Wrapper */}
                <div 
                    className="w-full h-full cursor-zoom-in"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onClick={() => setPreviewImage(images[currentIndex])}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="w-full h-full relative"
                        >
                            <SafeImage
                                src={images[currentIndex]}
                                type="restaurant"
                                keyword={cuisine}
                                className="w-full h-full object-cover"
                                alt={`Gallery Photo ${currentIndex + 1}`}
                            />
                            
                            {/* Subtle dark gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                            
                            {/* Click to expand hover overlay */}
                            <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover/slider:opacity-100 transition-opacity flex items-center gap-2 text-white pointer-events-none">
                                <ZoomIn className="h-3.5 w-3.5" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Click to Expand</span>
                            </div>

                            {/* Position Indicator Badge */}
                            <div className="absolute bottom-6 left-6 bg-black/45 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 text-white font-black text-[10px] uppercase tracking-widest pointer-events-none">
                                {currentIndex + 1} / {images.length}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Arrow Controls */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                    }}
                    className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-xl border border-orange-50 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white transition-all hover:scale-110 active:scale-95 opacity-0 group-hover/slider:opacity-100"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                    }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-xl border border-orange-50 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white transition-all hover:scale-110 active:scale-95 opacity-0 group-hover/slider:opacity-100"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="flex gap-4 overflow-x-auto py-6 px-1 scrollbar-hide no-scrollbar mt-2 max-w-full justify-start md:justify-center">
                {images.map((imgUrl, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative h-20 w-32 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${index === currentIndex ? 'border-orange-600 scale-105 shadow-md shadow-orange-100 dark:shadow-none' : 'border-slate-200 dark:border-slate-800 hover:border-orange-300 opacity-60 hover:opacity-95'}`}
                    >
                        <SafeImage
                            src={imgUrl}
                            type="restaurant"
                            keyword={cuisine}
                            className="w-full h-full object-cover animate-fade-in"
                            alt={`Thumbnail ${index + 1}`}
                        />
                    </button>
                ))}
            </div>

            {/* Full-Screen Lightbox Image Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                        onClick={() => setPreviewImage(null)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute top-6 right-6 p-4 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10 hover:scale-110 active:scale-95"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        
                        {/* Expanded Showcase Frame */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-5xl max-h-[85vh] rounded-[2rem] overflow-hidden border-4 border-white/10 bg-slate-900 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <SafeImage
                                src={previewImage}
                                type="restaurant"
                                keyword={cuisine}
                                className="w-full h-auto max-h-[80vh] object-contain"
                                alt="Expanded Gallery Preview"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default GalleryCarousel;
