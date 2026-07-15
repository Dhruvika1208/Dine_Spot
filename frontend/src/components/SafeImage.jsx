import React, { useState, useEffect } from 'react';

const FALLBACK_IMAGES = {
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    dish: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    cuisine: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    italian: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?auto=format&fit=crop&w=800&q=80',
    indian: 'https://images.unsplash.com/photo-1585938338392-50a59970d8ee?auto=format&fit=crop&w=800&q=80',
    chinese: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    japanese: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    thai: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80',
    dessert: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
    southindian: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    andhra: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80',
    seafood: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    bbq: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
    cafe: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
    bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    starter: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    beverage: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    northindian: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80',
    continental: 'https://images.unsplash.com/photo-1532550907401-a500c9af5743?auto=format&fit=crop&w=800&q=80',
    fastfood: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    hyderabadi: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    vegetarian: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    streetfood: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    biryani: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
};

const getFallback = (type, keyword = '') => {
    const key = keyword.toLowerCase().replace(/[^a-z0-9]/g, '').trim();
    if (FALLBACK_IMAGES[key]) {
        return FALLBACK_IMAGES[key];
    }
    // Check keyword containment
    for (const [k, url] of Object.entries(FALLBACK_IMAGES)) {
        if (key.includes(k) || k.includes(key)) {
            return url;
        }
    }
    return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.restaurant;
};

const getFullImageUrl = (src) => {
    if (!src || typeof src !== 'string') return '';
    if (src.startsWith('http://') || src.startsWith('https://')) {
        return src;
    }
    // Normalize backslashes to forward slashes
    let normalizedPath = src.replace(/\\/g, '/');
    if (normalizedPath.startsWith('uploads/') || normalizedPath.startsWith('/uploads/')) {
        if (!normalizedPath.startsWith('/')) {
            normalizedPath = '/' + normalizedPath;
        }
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        return `${backendUrl.replace(/\/+$/, '')}${normalizedPath}`;
    }
    return src;
};

const isValidUrl = (string) => {
    if (!string || typeof string !== 'string') return false;
    if (string.startsWith('http://') || string.startsWith('https://')) return true;
    const normalized = string.replace(/\\/g, '/');
    return normalized.startsWith('uploads/') || normalized.startsWith('/uploads/');
};

const SafeImage = ({ src, type = 'restaurant', keyword = '', alt = 'Image', className = '', ...props }) => {
    const fallback = getFallback(type, keyword || alt);
    const initialSrc = isValidUrl(src) ? getFullImageUrl(src) : fallback;
    const [imgSrc, setImgSrc] = useState(initialSrc);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setImgSrc(isValidUrl(src) ? getFullImageUrl(src) : fallback);
        setIsLoaded(false);
    }, [src, fallback]);

    const handleError = () => {
        if (imgSrc !== fallback) {
            setImgSrc(fallback);
        }
    };

    return (
        <img
            src={imgSrc}
            alt={alt}
            className={`${className}`}
            loading="lazy"
            onError={handleError}
            {...props}
        />
    );
};

export default SafeImage;
