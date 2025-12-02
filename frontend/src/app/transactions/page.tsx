"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Filter, Loader2 } from 'lucide-react';

interface Transaction {
    id: number;
    merchant: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    txnDate: string;
    categoryName?: string;
    accountName?: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, [page]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await api.get<{ content: Transaction[], last: boolean }>(`/transactions?page=${page}&size=20&sort=txnDate,desc`);

            if (page === 0) {
                setTransactions(data.content);
            } else {
                setTransactions(prev => [...prev, ...data.content]);
            }

            setHasMore(!data.last);
        } catch (error) {
            console.error('Failed to fetch transactions', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 pb-24 max-w-md mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Transactions</h1>
                <button className="p-2 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--muted-foreground)]">
                    <Filter className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-3">
                {transactions.map((txn) => (
                    <div key={txn.id} className="glass-card p-4 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${txn.type === 'CREDIT' ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--destructive)]/10 text-[var(--destructive)]'}`}>
                                {txn.type === 'CREDIT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div>
                                <div className="font-medium text-[var(--foreground)]">{txn.merchant}</div>
                                <div className="text-xs text-[var(--muted-foreground)] flex gap-2">
                                    <span>{format(new Date(txn.txnDate), 'MMM d')}</span>
                                    <span>•</span>
                                    <span>{txn.categoryName || 'Uncategorized'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`font-semibold ${txn.type === 'CREDIT' ? 'text-[var(--success)]' : 'text-[var(--foreground)]'}`}>
                                {txn.type === 'CREDIT' ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
                            </div>
                            <div className="text-xs text-[var(--muted-foreground)]">{txn.accountName}</div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-center py-4">
                        <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
                    </div>
                )}

                {!loading && hasMore && (
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="w-full py-3 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                        Load More
                    </button>
                )}

                {!loading && !hasMore && transactions.length > 0 && (
                    <div className="text-center py-4 text-sm text-[var(--muted-foreground)]">
                        No more transactions
                    </div>
                )}
            </div>
        </div>
    );
}
