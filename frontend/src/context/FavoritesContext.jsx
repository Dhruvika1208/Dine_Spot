import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [favoriteIds, setFavoriteIds] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchFavorites = async (showLoading = true) => {
        if (!user) {
            setFavorites([]);
            setFavoriteIds([]);
            return;
        }
        try {
            if (showLoading) setLoading(true);
            const { data } = await axiosInstance.get('/api/auth/favorites');
            if (Array.isArray(data)) {
                setFavorites(data);
                setFavoriteIds(data.map(f => f._id));
            }
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites(true);
    }, [user]);

    const toggleFavorite = async (restaurant) => {
        if (!user) {
            toast.error('Please login to save favorites');
            return false;
        }

        const restaurantId = typeof restaurant === 'object' ? restaurant._id : restaurant;
        const restaurantName = typeof restaurant === 'object' ? restaurant.name : 'restaurant';
        const isCurrentlyFav = favoriteIds.includes(restaurantId);

        try {
            // Optimistic UI updates
            if (isCurrentlyFav) {
                setFavoriteIds(prev => prev.filter(id => id !== restaurantId));
                setFavorites(prev => prev.filter(f => f._id !== restaurantId));
                toast.success(`Removed ${restaurantName} from favorites`);
            } else {
                setFavoriteIds(prev => [...prev, restaurantId]);
                if (typeof restaurant === 'object') {
                    setFavorites(prev => [...prev, restaurant]);
                }
                toast.success(`Added ${restaurantName} to favorites`);
            }

            // Sync with backend
            const { data } = await axiosInstance.post(`/api/auth/favorites/${restaurantId}`);
            
            // If data (array of IDs) is returned, ensure sync.
            if (Array.isArray(data)) {
                setFavoriteIds(data);
                // If we added a restaurant and only had the ID, refetch populated list.
                if (!isCurrentlyFav && typeof restaurant !== 'object') {
                    fetchFavorites(false);
                }
            }
            return true;
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
            toast.error('Failed to update favorites');
            // Revert optimistic updates
            fetchFavorites(false);
            return false;
        }
    };

    const isFavorite = (restaurantId) => {
        return favoriteIds.includes(restaurantId);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, favoriteIds, loading, toggleFavorite, isFavorite, refetchFavorites: fetchFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};
