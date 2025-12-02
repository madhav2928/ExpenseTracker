"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post<{ token: string }>('/auth/login', {
                email,
                password,
            });
            login(response.token, email);
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
            <div className="w-full max-w-md glass-card p-8 rounded-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Welcome Back</h1>
                    <p className="text-[var(--muted-foreground)]">Sign in to manage your expenses</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--muted-foreground)]">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all pl-10"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-[var(--muted-foreground)]">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all pl-10"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] font-medium py-3 rounded-[var(--radius)] hover:opacity-90 transition-opacity active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Sign In <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-[var(--primary)] hover:underline font-medium">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
}
