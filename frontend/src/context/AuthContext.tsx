"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, email: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for token on mount
        const storedToken = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('userEmail');

        if (storedToken) {
            setToken(storedToken);
            if (storedEmail) {
                // In a real app we might fetch the full user profile here
                setUser({ id: 0, email: storedEmail });
            }
        }
        setIsLoading(false);
    }, []);

    const login = (newToken: string, email: string) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('userEmail', email);
        setToken(newToken);
        setUser({ id: 0, email });
        router.push('/');
    };

    const logout = async () => {
        const currentToken = localStorage.getItem('token'); // Use a different name to avoid conflict with setToken
        if (currentToken) {
            try {
                // Call backend logout endpoint to blacklist the token
                await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${currentToken}`,
                    },
                });
            } catch (error) {
                console.error('Logout error:', error);
                // Continue with local logout even if backend call fails
            }
        }
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail'); // Keep this line for consistency with login and initial setup
        setToken(null); // This is crucial for isAuthenticated to update correctly
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            isAuthenticated: !!token,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
