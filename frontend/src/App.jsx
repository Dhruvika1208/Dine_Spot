import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import UserLayout from './layouts/UserLayout';
import StaffLayout from './layouts/StaffLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Auth Pages
import AuthSelection from './pages/auth/AuthSelection';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StaffLogin from './pages/auth/StaffLogin';


// User Pages
import Home from './pages/user/Home';
import Restaurants from './pages/user/Restaurants';
import RestaurantDetails from './pages/user/RestaurantDetails';
import UserDashboard from './pages/user/UserDashboard';
import Reservation from './pages/user/Reservation';

// Staff Pages
import StaffDashboard from './pages/staff/StaffDashboard';
import ManageReservations from './pages/staff/ManageReservations';
import ManageMenu from './pages/staff/ManageMenu';
import ManageTables from './pages/staff/ManageTables';
import Analytics from './pages/staff/Analytics';

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <Routes>
                    {/* ISOLATED STAFF LOGIN */}
                    <Route path="/staff/login" element={<StaffLogin />} />

                    {/* USER ROUTES (WITH USER LAYOUT AND NAV) */}
                    <Route element={<UserLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/restaurants" element={<Restaurants />} />
                        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                        <Route path="/reserve/:id" element={<Reservation />} />

                        {/* Static User Auth Pages inside layout to show nav */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Register />} />
                        <Route path="/register" element={<Navigate to="/signup?role=user" replace />} />
                        <Route path="/auth" element={<AuthSelection />} />

                        <Route path="/dashboard" element={
                            <ProtectedRoute role="user">
                                <UserDashboard />
                            </ProtectedRoute>
                        } />
                    </Route>

                    {/* STAFF DASHBOARD (WITH STAFF LAYOUT AND SIDEBAR) */}
                    <Route element={
                        <ProtectedRoute role="staff">
                            <StaffLayout />
                        </ProtectedRoute>
                    }>
                        <Route path="/staff/dashboard" element={<StaffDashboard />} />
                        <Route path="/staff/reservations" element={<ManageReservations />} />
                        <Route path="/staff/menu" element={<ManageMenu />} />
                        <Route path="/staff/tables" element={<ManageTables />} />
                        <Route path="/staff/analytics" element={<Analytics />} />
                    </Route>

                    {/* GLOBAL REDIRECTS */}
                    <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
