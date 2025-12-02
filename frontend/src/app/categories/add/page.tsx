"use client";

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AddCategoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/categories', { name });
            router.push('/categories');
        } catch (error) {
            console.error('Failed to create category', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto min-h-screen bg-[var(--background)]">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/categories" className="p-2 rounded-full hover:bg-[var(--card)]">
                    <ArrowLeft className="w-6 h-6 text-[var(--foreground)]" />
                </Link>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Add Category</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Category Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                        placeholder="e.g. Groceries"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] font-medium py-3 rounded-[var(--radius)] hover:opacity-90 transition-opacity active:scale-[0.98] flex items-center justify-center gap-2 mt-8"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Create Category
                </button>
            </form>
        </div>
    );
}
