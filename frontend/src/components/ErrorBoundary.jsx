import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("DineSpot Critical Failure:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
                    <div className="text-center">
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-4">Fallback</p>
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Unable to load dashboard.</h2>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all shadow-lg"
                        >
                            Reload App
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
