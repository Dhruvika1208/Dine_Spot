import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { Loader2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

const CheckInQR = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('Processing check-in...');
    const [reservationDetails, setReservationDetails] = useState(null);

    useEffect(() => {
        const performCheckIn = async () => {
            try {
                // Hitting the backend API for checkin via GET route
                const { data } = await axiosInstance.get(`/api/reservations/checkin/${id}`);
                setStatus('success');
                setMessage('Guest successfully checked in!');
                setReservationDetails(data);
                
                // Redirect to reservations after 3 seconds
                setTimeout(() => {
                    navigate('/staff/reservations');
                }, 3000);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Failed to check-in. Invalid or expired QR code.');
            }
        };

        if (id) {
            performCheckIn();
        }
    }, [id, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl p-8 text-center border border-slate-100 dark:border-slate-800">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-16 w-16 text-indigo-600 dark:text-indigo-400 animate-spin mb-6" />
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Verifying Pass...</h2>
                        <p className="text-slate-400 dark:text-slate-500 mt-2 text-sm font-bold uppercase tracking-widest">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center animate-in zoom-in duration-300">
                        <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-950/20 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-100 dark:border-emerald-900/30">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Access Granted</h2>
                        <p className="text-emerald-600 dark:text-emerald-400 font-bold mb-6">{message}</p>
                        
                        {reservationDetails && (
                            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl w-full text-left mb-6 border border-slate-100 dark:border-slate-800">
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Guest Name</p>
                                <p className="font-bold text-slate-800 dark:text-slate-200 mb-3">{reservationDetails.fullName}</p>
                                
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mb-1">Party Size</p>
                                <p className="font-bold text-slate-800 dark:text-slate-200">{reservationDetails.guests} PAX</p>
                            </div>
                        )}
                        
                        <button 
                            onClick={() => navigate('/staff/reservations')}
                            className="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" /> Return to Dashboard
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center animate-in slide-in-from-bottom-4 duration-300">
                        <div className="h-20 w-20 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center mb-6 border-4 border-rose-100 dark:border-rose-900/30">
                            <XCircle className="h-10 w-10 text-rose-500" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mb-2">Access Denied</h2>
                        <p className="text-rose-600 dark:text-rose-400 font-bold mb-8">{message}</p>
                        
                        <button 
                            onClick={() => navigate('/staff/reservations')}
                            className="bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-200 px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-black dark:hover:bg-slate-700 transition-all"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CheckInQR;
