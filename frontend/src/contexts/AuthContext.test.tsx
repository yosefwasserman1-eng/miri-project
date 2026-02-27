/** @vitest-environment jsdom */
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import '@testing-library/jest-dom/vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Mock Firebase Auth
vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(),
}));

vi.mock('../lib/firebase', () => ({
    auth: {},
}));

const TestComponent = () => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return <div>{user ? `User: ${user.email}` : 'No User'}</div>;
};

describe('AuthContext', () => {
    it('shows loading state initially', () => {
        (onAuthStateChanged as any).mockReturnValue(() => { });
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('identifies unauthenticated state', async () => {
        // Simulate no user
        (onAuthStateChanged as any).mockImplementation((auth: any, callback: any) => {
            callback(null);
            return () => { };
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('No User')).toBeInTheDocument();
        });
    });

    it('identifies authenticated state', async () => {
        // Simulate user
        const mockUser = { email: 'test@example.com' };
        (onAuthStateChanged as any).mockImplementation((auth: any, callback: any) => {
            callback(mockUser);
            return () => { };
        });

        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('User: test@example.com')).toBeInTheDocument();
        });
    });
});
