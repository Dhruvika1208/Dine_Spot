import { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const restaurantId = localStorage.getItem('restaurantId'); // Retrieve restaurantId
        if (storedUser && token) {
            try {
                const parsedUser = JSON.parse(storedUser);
                // Ensure role and restaurantId are synced
                setUser({ ...parsedUser, role: role || parsedUser.role, restaurantId: restaurantId || parsedUser.restaurantId });
            } catch (err) {
                console.error('Auth Session Error');
                logout();
            }
        }
        setLoading(false);
    }, []);

    const loginUser = async (email, password) => {
        const { data } = await axiosInstance.post('/api/auth/login', { email, password });
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || 'user');
        return data;
    };

    const loginStaff = async (email, password) => {
        const { data } = await axiosInstance.post('/api/auth/staff-login', { email, password });
        setUser({ ...data.staff, role: data.role, restaurantId: data.restaurantId });
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('restaurantId', data.restaurantId);
        localStorage.setItem('user', JSON.stringify({ ...data.staff, role: data.role, restaurantId: data.restaurantId }));
        return data;
    };

    const register = async (userData) => {
        const { data } = await axiosInstance.post('/api/auth/register', userData);
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || 'user');
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, loginStaff, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
