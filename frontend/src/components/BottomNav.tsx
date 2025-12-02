"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, PlusCircle, CreditCard, Tag } from 'lucide-react';
import clsx from 'clsx';

export default function BottomNav() {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: 'Home', href: '/' },
        { icon: List, label: 'Txns', href: '/transactions' },
        { icon: PlusCircle, label: 'Add', href: '/transactions/add', primary: true },
        { icon: CreditCard, label: 'Accounts', href: '/accounts' },
        { icon: Tag, label: 'Categories', href: '/categories' },
    ];

    // Don't show on auth pages
    if (pathname === '/login' || pathname === '/register') return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[var(--card)] border-t border-[var(--border)] pb-safe pt-2 px-4 z-50">
            <div className="flex justify-between items-end max-w-md mx-auto pb-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    if (item.primary) {
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className="bg-[var(--primary)] text-[var(--primary-foreground)] p-4 rounded-full -mt-8 shadow-lg shadow-[var(--primary)]/30 hover:scale-105 transition-transform">
                                    <Icon className="w-6 h-6" />
                                </div>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center gap-1 transition-colors",
                                isActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
