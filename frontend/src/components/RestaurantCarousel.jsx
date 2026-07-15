import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeImage from './SafeImage';

const RestaurantCarousel = ({ coverImage, gallery, galleryImages, cuisine }) => {
    // Unify backend fields
    const otherImages = Array.isArray(galleryImages) && galleryImages.length > 0
        ? galleryImages
        : (Array.isArray(gallery) ? gallery : []);

    // Combine coverImage at index 0 and unique other images that don't repeat the cover image
    const images = [coverImage, ...otherImages.filter(img => img && img !== coverImage)].filter(Boolean);

    // If no images at all, fall back to cuisine-based standard photo
    if (images.length === 0) {
        return (
            <div className="relative h-full w-full bg-slate-100 dark:bg-slate-900">
                <SafeImage
                    src=""
                    type="restaurant"
                    keyword={cuisine}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Swipe gestures tracking refs
    const touchStart = useRef(0);
    const touchEnd = useRef(0);

    const handleNext = () => {
        if (images.length <= 1) return;
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        if (images.length <= 1) return;
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    // Autoplay trigger
    useEffect(() => {
        if (images.length <= 1 || isHovered) return;
        const interval = setInterval(handleNext, 4000);
        return () => clearInterval(interval);
    }, [isHovered, images.length]);

    // Touch Swipe Event Handlers
    const handleTouchStart = (e) => {
        touchStart.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEnd.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStart.current || !touchEnd.current || images.length <= 1) return;
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
        <div 
            className="relative w-full h-full group/carousel select-none bg-slate-100 dark:bg-slate-950"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Active Image Area */}
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
                        initial={{ opacity: 0.85, scale: 0.99 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.85, scale: 1.01 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="w-full h-full relative"
                    >
                        <SafeImage
                            src={images[currentIndex]}
                            type="restaurant"
                            keyword={cuisine}
                            className="w-full h-full object-cover pointer-events-none"
                            alt={`Restaurant Photo ${currentIndex + 1}`}
                        />
                        
                        {/* Hover Zoom Overlay Tip */}
                        <div className="absolute top-6 right-6 bg-black/45 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-opacity flex items-center gap-2 text-white pointer-events-none">
                            <ZoomIn className="h-3.5 w-3.5" />
                            <span className="text-[8px] font-black uppercase tracking-widest">View Full Size</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls & Overlays - Only show if there are multiple images */}
            {images.length > 1 && (
                <>
                    {/* Dark gradient overlay at bottom for readability of dots */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

                    {/* Navigation Arrows */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                        }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white transition-all hover:scale-110 active:scale-95 opacity-0 group-hover/carousel:opacity-100"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-xl border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white transition-all hover:scale-110 active:scale-95 opacity-0 group-hover/carousel:opacity-100"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Bottom Center Indicator Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2.5 z-10">
                        {images.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex(idx);
                                }}
                                className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-orange-600 w-6' : 'bg-white/60 w-2.5 hover:bg-white'}`}
                                title={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>

                    {/* Indicator dots and navigation arrows are rendered if images.length > 1 */}
                </>
            )}
 
            {/* Badge Overlays */}
            {otherImages.length === 0 ? (
                <div className="absolute bottom-6 right-6 bg-black/45 backdrop-blur-md px-4.5 py-1.5 rounded-full border border-white/10 text-white font-black text-[9px] tracking-widest uppercase pointer-events-none z-10">
                    No Gallery Images Yet
                </div>
            ) : (
                images.length > 1 && (
                    <div className="absolute bottom-6 right-6 bg-black/45 backdrop-blur-md px-4.5 py-1.5 rounded-full border border-white/10 text-white font-black text-[9px] tracking-widest uppercase pointer-events-none z-10">
                        {currentIndex + 1} / {images.length}
                    </div>
                )
            )}

            {/* Full-Screen Lightbox Image Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
                        onClick={() => setPreviewImage(null)}
                    >
                        {/* Close Action */}
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
                                alt="Expanded Restaurant Photo Preview"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RestaurantCarousel;
