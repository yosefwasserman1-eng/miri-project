import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingIndicator } from './LoadingIndicator';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <LoadingIndicator label="Authenticating session..." />
            </div>
        );
    }

    if (!user) {
        // Redirect to login (to be implemented later, for now just a placeholder)
        // return <Navigate to="/login" state={{ from: location }} replace />;
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center p-4 text-center">
                <h2 className="text-xl font-bold mb-2">Access Restricted</h2>
                <p className="text-gray-600 mb-4">Please sign in to access Project Miri.</p>
                <button
                    onClick={() => { /* Placeholder for login trigger */ }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
                >
                    Sign In (Mock)
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
