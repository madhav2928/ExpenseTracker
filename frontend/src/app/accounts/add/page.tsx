"use client";

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AddAccountPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'CHECKING',
        last4: '',
        balanceEstimate: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/accounts', {
                ...formData,
                balanceEstimate: Number(formData.balanceEstimate),
            });
            router.push('/accounts');
        } catch (error) {
            console.error('Failed to create account', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto min-h-screen bg-[var(--background)]">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/accounts" className="p-2 rounded-full hover:bg-[var(--card)]">
                    <ArrowLeft className="w-6 h-6 text-[var(--foreground)]" />
                </Link>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Add Account</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Account Name</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                        placeholder="e.g. Chase Sapphire"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Type</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all appearance-none"
                    >
                        <option value="CHECKING">Checking</option>
                        <option value="SAVINGS">Savings</option>
                        <option value="CREDIT_CARD">Credit Card</option>
                        <option value="CASH">Cash</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Last 4 Digits (Optional)</label>
                    <input
                        type="text"
                        maxLength={4}
                        value={formData.last4}
                        onChange={(e) => setFormData({ ...formData, last4: e.target.value })}
                        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                        placeholder="1234"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Initial Balance</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]">$</span>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.balanceEstimate}
                            onChange={(e) => setFormData({ ...formData, balanceEstimate: e.target.value })}
                            className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all pl-8"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] font-medium py-3 rounded-[var(--radius)] hover:opacity-90 transition-opacity active:scale-[0.98] flex items-center justify-center gap-2 mt-8"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Create Account
                </button>
            </form>
        </div>
    );
}
