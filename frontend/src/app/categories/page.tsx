"use client";

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Plus, Tag, Trash2 } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    parent?: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await api.get<Category[]>('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/categories/${id}`);
            setCategories(prev => prev.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete category', error);
        }
    };

    return (
        <div className="p-4 pb-24 max-w-md mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[var(--foreground)]">Categories</h1>
                <Link href="/categories/add" className="p-2 rounded-full bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30">
                    <Plus className="w-6 h-6" />
                </Link>
            </div>

            <div className="space-y-3">
                {categories.map((category) => (
                    <div key={category.id} className="glass-card p-4 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[var(--secondary)] text-[var(--secondary-foreground)]">
                                <Tag className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-medium text-[var(--foreground)]">{category.name}</h3>
                                {category.parent && (
                                    <p className="text-xs text-[var(--muted-foreground)]">Parent: {category.parent}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(category.id)}
                            className="p-2 text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {!loading && categories.length === 0 && (
                    <div className="text-center py-12 text-[var(--muted-foreground)]">
                        <Tag className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No categories found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
