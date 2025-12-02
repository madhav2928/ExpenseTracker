"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Sparkles, LogOut } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Account {
  id: number;
  name: string;
  balanceEstimate: number;
  type: string;
}

interface Transaction {
  id: number;
  merchant: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  txnDate: string;
  categoryName?: string;
}

export default function Dashboard() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTxns, setRecentTxns] = useState<Transaction[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [accountsData, txnsData] = await Promise.all([
        api.get<Account[]>('/accounts'),
        api.get<{ content: Transaction[] }>('/transactions?page=0&size=5&sort=txnDate,desc'),
      ]);
      setAccounts(accountsData);
      setRecentTxns(txnsData.content || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (isLoading || !isAuthenticated) return null;

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balanceEstimate, 0);

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
          <p className="text-[var(--muted-foreground)] text-sm">Welcome back</p>
        </div>
        <div className="flex gap-2">
          <Link href="/ingest">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-full text-white shadow-lg hover:opacity-90 transition-opacity">
              <Sparkles className="w-5 h-5" />
            </button>
          </Link>
          <button
            onClick={logout}
            className="bg-[var(--secondary)] p-2 rounded-full text-[var(--secondary-foreground)] shadow-lg hover:opacity-80 transition-opacity"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-[var(--card)] to-[var(--primary)]/10">
        <div className="flex items-center gap-3 mb-2 text-[var(--muted-foreground)]">
          <Wallet className="w-5 h-5" />
          <span className="text-sm font-medium">Total Balance</span>
        </div>
        <div className="text-4xl font-bold text-[var(--foreground)]">
          ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div className="mt-4 flex gap-4">
          <div className="flex items-center gap-1 text-[var(--success)] text-sm bg-[var(--success)]/10 px-2 py-1 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            <span>+2.5%</span>
          </div>
          <div className="flex items-center gap-1 text-[var(--destructive)] text-sm bg-[var(--destructive)]/10 px-2 py-1 rounded-lg">
            <TrendingDown className="w-4 h-4" />
            <span>-1.2%</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Activity</h2>
          <Link href="/transactions" className="text-sm text-[var(--primary)]">See All</Link>
        </div>

        <div className="space-y-3">
          {loadingData ? (
            <div className="text-center py-8 text-[var(--muted-foreground)]">Loading...</div>
          ) : recentTxns.length === 0 ? (
            <div className="text-center py-8 text-[var(--muted-foreground)] glass-card rounded-xl">
              No recent transactions
            </div>
          ) : (
            recentTxns.map((txn) => (
              <div key={txn.id} className="glass-card p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${txn.type === 'CREDIT' ? 'bg-[var(--success)]/10 text-[var(--success)]' : 'bg-[var(--destructive)]/10 text-[var(--destructive)]'}`}>
                    {txn.type === 'CREDIT' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="font-medium text-[var(--foreground)]">{txn.merchant}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">
                      {format(new Date(txn.txnDate), 'MMM d, h:mm a')}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${txn.type === 'CREDIT' ? 'text-[var(--success)]' : 'text-[var(--foreground)]'}`}>
                  {txn.type === 'CREDIT' ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
