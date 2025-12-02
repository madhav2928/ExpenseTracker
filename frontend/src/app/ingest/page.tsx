"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Sparkles, Send, Check, X, Loader2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Proposal {
    id: number;
    amount: number;
    merchant: string;
    accountHint: string;
    status: string;
    createdAt: string;
}

export default function IngestPage() {
    const [rawText, setRawText] = useState('');
    const [loading, setLoading] = useState(false);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [activeTab, setActiveTab] = useState<'ingest' | 'proposals'>('ingest');

    useEffect(() => {
        fetchProposals();
    }, []);

    const fetchProposals = async () => {
        try {
            const data = await api.get<Proposal[]>('/proposals');
            setProposals(data.filter(p => p.status === 'PENDING'));
        } catch (error) {
            console.error('Failed to fetch proposals', error);
        }
    };

    const handleIngest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rawText.trim()) return;

        setLoading(true);
        try {
            await api.post('/ingest', {
                rawText,
                currency: 'USD', // Default
            });
            setRawText('');
            setActiveTab('proposals');
            fetchProposals();
        } catch (error) {
            console.error('Failed to ingest', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id: number) => {
        try {
            await api.post(`/proposals/${id}/accept`, {});
            setProposals(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to accept proposal', error);
        }
    };

    return (
        <div className="p-4 pb-24 max-w-md mx-auto min-h-screen">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--foreground)]">AI Assistant</h1>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-[var(--card)] rounded-xl mb-6">
                <button
                    onClick={() => setActiveTab('ingest')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'ingest'
                        ? 'bg-[var(--primary)] text-white shadow-lg'
                        : 'text-[var(--muted-foreground)]'
                        }`}
                >
                    New Entry
                </button>
                <button
                    onClick={() => setActiveTab('proposals')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'proposals'
                        ? 'bg-[var(--primary)] text-white shadow-lg'
                        : 'text-[var(--muted-foreground)]'
                        }`}
                >
                    Review ({proposals.length})
                </button>
            </div>

            {activeTab === 'ingest' ? (
                <div className="glass-card p-6 rounded-2xl">
                    <p className="text-[var(--muted-foreground)] mb-4">
                        Describe your expense naturally. For example:
                        <br />
                        <span className="text-[var(--foreground)] italic">"Spent $45 at Trader Joe's for groceries using my Chase card"</span>
                    </p>

                    <form onSubmit={handleIngest}>
                        <textarea
                            value={rawText}
                            onChange={(e) => setRawText(e.target.value)}
                            className="w-full h-32 bg-[var(--input)] border border-[var(--border)] rounded-xl p-4 text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-none mb-4"
                            placeholder="Type here..."
                        />

                        <button
                            type="submit"
                            disabled={loading || !rawText.trim()}
                            className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] font-medium py-3 rounded-[var(--radius)] hover:opacity-90 transition-opacity active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            Process with AI
                        </button>
                    </form>
                </div>
            ) : (
                <div className="space-y-4">
                    {proposals.length === 0 ? (
                        <div className="text-center py-12 text-[var(--muted-foreground)]">
                            <Check className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>All caught up! No pending proposals.</p>
                        </div>
                    ) : (
                        proposals.map((proposal) => (
                            <div key={proposal.id} className="glass-card p-4 rounded-xl">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-[var(--foreground)]">{proposal.merchant || 'Unknown Merchant'}</h3>
                                        <p className="text-sm text-[var(--muted-foreground)]">
                                            {proposal.accountHint ? `via ${proposal.accountHint}` : 'No account detected'}
                                        </p>
                                    </div>
                                    <div className="text-lg font-bold text-[var(--foreground)]">
                                        ${proposal.amount?.toFixed(2)}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                                    <div className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {format(new Date(proposal.createdAt), 'MMM d, h:mm a')}
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-full bg-[var(--destructive)]/10 text-[var(--destructive)] hover:bg-[var(--destructive)]/20">
                                            <X className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleAccept(proposal.id)}
                                            className="p-2 rounded-full bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
