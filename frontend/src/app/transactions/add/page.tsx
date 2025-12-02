"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Loader2, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Account {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

export default function AddTransactionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        merchant: '',
        amount: '',
        type: 'DEBIT',
        accountId: '',
        categoryId: '',
        txnDate: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [accData, catData] = await Promise.all([
                    api.get<Account[]>('/accounts'),
                    api.get<Category[]>('/categories'),
                ]);
                setAccounts(accData);
                setCategories(catData);

                // Set default account if available
                if (accData.length > 0) {
                    setFormData(prev => ({ ...prev, accountId: accData[0].id.toString() }));
                }
                // Set default category if available
                if (catData.length > 0) {
                    setFormData(prev => ({ ...prev, categoryId: catData[0].id.toString() }));
                }
            } catch (error) {
                console.error('Failed to load options', error);
            }
        };
        fetchOptions();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/transactions', {
                ...formData,
                amount: Number(formData.amount),
                accountId: Number(formData.accountId),
                categoryId: Number(formData.categoryId),
                currency: 'USD',
                txnDate: new Date(formData.txnDate).toISOString(),
            });
            router.push('/transactions');
        } catch (error) {
            console.error('Failed to create transaction', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto min-h-screen bg-[var(--background)]">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/transactions" className="p-2 rounded-full hover:bg-[var(--card)]">
                    <ArrowLeft className="w-6 h-6 text-[var(--foreground)]" />
                </Link>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Add Transaction</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Toggle */}
                <div className="grid grid-cols-2 gap-2 bg-[var(--card)] p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'DEBIT' })}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.type === 'DEBIT'
                            ? 'bg-[var(--destructive)] text-white shadow-lg'
                            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                            }`}
                    >
                        Expense
                    </button>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'CREDIT' })}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${formData.type === 'CREDIT'
                            ? 'bg-[var(--success)] text-white shadow-lg'
                            : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                            }`}
                    >
                        Income
                    </button>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-[var(--muted-foreground)]">$</span>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all pl-8 text-2xl font-bold"
                            placeholder="0.00"
                            required
                        />
                    </div>
                </div>

                {/* Merchant */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Merchant / Description</label>
                    <input
                        type="text"
                        value={formData.merchant}
                        onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all"
                        placeholder="e.g. Starbucks, Salary"
                        required
                    />
                </div>

                {/* Date */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-foreground)]" />
                        <input
                            type="date"
                            value={formData.txnDate}
                            onChange={(e) => setFormData({ ...formData, txnDate: e.target.value })}
                            className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all pl-10"
                            required
                        />
                    </div>
                </div>

                {/* Account */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Account</label>
                    <select
                        value={formData.accountId}
                        onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all appearance-none"
                        required
                    >
                        {accounts.map(acc => (
                            <option key={acc.id} value={acc.id}>{acc.name}</option>
                        ))}
                    </select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--muted-foreground)]">Category</label>
                    <select
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-[var(--radius)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition-all appearance-none"
                        required
                    >
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] font-medium py-3 rounded-[var(--radius)] hover:opacity-90 transition-opacity active:scale-[0.98] flex items-center justify-center gap-2 mt-8"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Save Transaction
                </button>
            </form>
        </div>
    );
}
