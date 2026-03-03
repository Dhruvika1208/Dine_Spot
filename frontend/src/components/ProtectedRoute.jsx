import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    console.log('ProtectedRoute Check:', { user, role, loading });

    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-black text-slate-400 uppercase tracking-[0.2em] text-xs">Validating Credentials...</p>
                </div>
            </div>
        );
    }

    if (!token) {
        return <Navigate to={role === 'staff' ? '/staff/login' : '/login'} replace />;
    }

    if (role && storedRole !== role) {
        return <Navigate to={role === 'staff' ? '/staff/login' : '/'} replace />;
    }

    return children;
};

export default ProtectedRoute;
