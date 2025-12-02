"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Plus, CreditCard, Wallet, Building, MoreVertical, Trash2 } from 'lucide-react';

interface Account {
    id: number;
    name: string;
    type: string;
    balanceEstimate: number;
    last4?: string;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const data = await api.get<Account[]>('/accounts');
            setAccounts(data);
        } catch (error) {
            console.error('Failed to fetch accounts', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure? This will delete all associated transactions.')) return;
        try {
            await api.delete(`/accounts/${id}`);
            setAccounts(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to delete account', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'CASH': return Wallet;
            case 'BANK': return Building;
            default: return CreditCard;
        }
    };

    return (
        <div className="p-4 pb-24 max-w-md mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Accounts</h1>
                <Link href="/accounts/add" className="p-2 rounded-full bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30">
                    <Plus className="w-6 h-6" />
                </Link>
            </div>

            <div className="space-y-4">
                {accounts.map((account) => {
                    const Icon = getIcon(account.type);
                    return (
                        <div key={account.id} className="glass-card p-5 rounded-2xl relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--foreground)]">{account.name}</h3>
                                        <p className="text-sm text-[var(--muted-foreground)]">{account.type}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(account.id)}
                                    className="p-2 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex justify-between items-end">
                                <div className="text-sm text-[var(--muted-foreground)]">
                                    {account.last4 ? `**** ${account.last4}` : 'No card linked'}
                                </div>
                                <div className="text-2xl font-bold text-[var(--foreground)]">
                                    ${account.balanceEstimate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!loading && accounts.length === 0 && (
                    <div className="text-center py-12 text-[var(--muted-foreground)]">
                        <Wallet className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No accounts found. Add one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
