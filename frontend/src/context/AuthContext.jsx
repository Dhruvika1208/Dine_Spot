import { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');
            const restaurantId = localStorage.getItem('restaurantId');

            if (token && storedUser) {
                try {
                    const parsedUser = JSON.parse(storedUser);
                    setUser({
                        ...parsedUser,
                        token,
                        role: role || parsedUser.role,
                        restaurantId: restaurantId || parsedUser.restaurantId
                    });
                } catch (err) {
                    console.error('Session restoration failed:', err);
                    logout();
                }
            }
            setLoading(false);
        };
        restoreSession();
    }, []);

    const loginUser = async (email, password) => {
        const { data } = await axiosInstance.post('/api/auth/login', { email, password });
        const userData = { ...data, role: data.role || 'user' };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', userData.role);
        return data;
    };

    const loginStaff = async (email, password) => {
        const { data } = await axiosInstance.post('/api/auth/staff-login', { email, password });
        const staffData = { ...data.staff, role: data.role, restaurantId: data.restaurantId };
        setUser(staffData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', staffData.role);
        localStorage.setItem('restaurantId', staffData.restaurantId);
        localStorage.setItem('user', JSON.stringify(staffData));
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

    const loginGoogle = async (credential) => {
        const { data } = await axiosInstance.post('/api/auth/google', { credential });
        const userData = { ...data, role: data.role || 'user' };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', userData.role);
        return data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('restaurantId');
    };

    const registerStaff = async (staffDataPayload) => {
        const { data } = await axiosInstance.post('/api/auth/staff-register', staffDataPayload);
        const staffData = { ...data.staff, role: data.role, restaurantId: data.restaurantId };
        setUser(staffData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', staffData.role);
        localStorage.setItem('restaurantId', staffData.restaurantId);
        localStorage.setItem('user', JSON.stringify(staffData));
        return data;
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, loginStaff, register, registerStaff, loginGoogle, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
