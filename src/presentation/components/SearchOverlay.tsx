'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../domain/entities/Product';
import { getProductImageUrl } from '../../shared/utils/imageUtils';

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState<Product[]>([]);
    const [popularProducts, setPopularProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input on open
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Fetch popular products for initial display
    useEffect(() => {
        if (!isOpen) return;
        
        const fetchPopular = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/products/?most_viewed=true`);
                if (response.ok) {
                    const data = await response.json();
                    const results = data.results || data;
                    const mapped: Product[] = results.map((item: any) => ({
                        id: item.id.toString(),
                        name: item.name,
                        price: parseFloat(item.price),
                        images: Array.from(
                            new Set([
                                ...(item.image ? [item.image] : []),
                                ...(item.main_image ? [item.main_image] : []),
                                ...(item.images || []).map((img: any) => {
                                    if (typeof img === 'string') return img;
                                    return img.image || img;
                                })
                            ])
                        ).map((url: any) => getProductImageUrl(url)),
                        brand: item.brand_name || 'N/A',
                        category: item.category_name || 'Sneakers',
                        description: item.description,
                        isExclusive: item.is_exclusive,
                        viewCount: item.view_count || 0,
                        createdAt: item.created_at,
                        sizes: (item.sizes || []).map((s: any) => ({
                            size: s.size,
                            cm: s.cm
                        })),
                        colors: item.colors || []
                    })).slice(0, 3);
                    setPopularProducts(mapped);
                }
            } catch (err) {
                console.error("Failed to fetch popular products:", err);
            }
        };
        fetchPopular();
    }, [isOpen]);

    // Fetch search results
    useEffect(() => {
        if (!isOpen || !searchTerm.trim()) {
            setProducts([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/products/?search=${encodeURIComponent(searchTerm)}`);
                if (response.ok) {
                    const data = await response.json();
                    const results = data.results || data;
                    
                    const mapped: Product[] = results.map((item: any) => ({
                        id: item.id.toString(),
                        name: item.name,
                        price: parseFloat(item.price),
                        images: Array.from(
                            new Set([
                                ...(item.image ? [item.image] : []),
                                ...(item.main_image ? [item.main_image] : []),
                                ...(item.images || []).map((img: any) => {
                                    if (typeof img === 'string') return img;
                                    return img.image || img;
                                })
                            ])
                        ).map((url: any) => getProductImageUrl(url)),
                        brand: item.brand_name || 'N/A',
                        category: item.category_name || 'Sneakers',
                        description: item.description,
                        isExclusive: item.is_exclusive,
                        viewCount: item.view_count || 0,
                        createdAt: item.created_at,
                        sizes: (item.sizes || []).map((s: any) => ({
                            size: s.size,
                            cm: s.cm
                        })),
                        colors: item.colors || []
                    })).slice(0, 6);
                    
                    setProducts(mapped);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, isOpen]);

    // Handle ESC key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const displayProducts = searchTerm.trim() ? products : popularProducts;
    const rightSideHeading = searchTerm.trim() ? 'RESULTATS DE RECHERCHE' : 'PRODUITS POPULAIRES';

    return (
        <div className="fixed inset-0 bg-white z-[9999] overflow-y-auto animate-fade-in flex flex-col">
            {/* Search Input Bar (Top) */}
            <div className="w-full border-b border-gray-100 py-8 px-6 md:px-12 flex justify-center items-center bg-white sticky top-0 z-[10000]">
                <div className="w-full max-w-7xl flex items-center justify-between gap-6">
                    <div className="flex-1 flex items-center gap-4">
                        {/* Search Icon */}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                            <circle cx="10.5" cy="10.5" r="7.5"></circle>
                            <path d="M21 21l-5.2-5.2"></path>
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="RECHERCHE..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full border-none outline-none text-2xl md:text-3xl font-light uppercase tracking-wider bg-transparent text-black placeholder-gray-300"
                        />
                    </div>
                    {/* Close Button */}
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:opacity-70 transition-opacity"
                        aria-label="Fermer la recherche"
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content Container */}
            <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-12 md:gap-20">
                    {/* Left Column: Popular Searches / Suggestions */}
                    <div className="border-b md:border-b-0 md:border-r border-gray-100 pb-10 md:pb-0 md:pr-12">
                        <h3 className="text-[11px] font-sans font-bold tracking-[2px] text-gray-400 uppercase mb-8">
                            RECHERCHES POPULAIRES
                        </h3>
                        <div className="flex flex-col gap-6">
                            <button 
                                onClick={() => setSearchTerm('LATEST')}
                                className="text-left font-sans text-[13px] font-medium tracking-[1.5px] uppercase text-black hover:opacity-60 transition-opacity flex items-center gap-3"
                            >
                                <span>⚡</span> LES DERNIERS ARRIVAGES
                            </button>
                            <button 
                                onClick={() => setSearchTerm('BEST')}
                                className="text-left font-sans text-[13px] font-medium tracking-[1.5px] uppercase text-black hover:opacity-60 transition-opacity flex items-center gap-3"
                            >
                                <span>🏆</span> LES BEST SELLERS
                            </button>
                            <button 
                                onClick={() => setSearchTerm('SNEAKERS')}
                                className="text-left font-sans text-[13px] font-medium tracking-[1.5px] uppercase text-black hover:opacity-60 transition-opacity flex items-center gap-3"
                            >
                                <span>📦</span> LES REASSORTS
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Results Grid */}
                    <div>
                        <h3 className="text-[11px] font-sans font-bold tracking-[2px] text-gray-400 uppercase mb-8">
                            {rightSideHeading}
                        </h3>

                        {loading ? (
                            <div className="py-16 text-center text-xs font-sans tracking-widest text-gray-400 uppercase">
                                RECHERCHE EN COURS...
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                                {displayProducts.map((product) => (
                                    <Link 
                                        key={product.id}
                                        href={`/product/${product.id}`}
                                        onClick={onClose}
                                        className="group block text-center"
                                    >
                                        <div className="relative aspect-square w-full bg-gray-50 flex items-center justify-center overflow-hidden mb-3 border border-gray-100 p-3">
                                            <Image
                                                src={product.images[0] || '/images/placeholder.jpg'}
                                                alt={product.name}
                                                fill
                                                className="object-contain transition-transform duration-500 group-hover:scale-105 p-2"
                                                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <h4 className="text-[12px] font-sans font-medium uppercase text-black tracking-[1px] line-clamp-2 mb-1">
                                                {product.name}
                                            </h4>
                                            <p className="text-[12px] font-sans font-semibold text-black tracking-[1px]">
                                                {product.price.toLocaleString()} DA
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {!loading && displayProducts.length === 0 && searchTerm.trim() && (
                            <div className="py-16 text-center text-xs font-sans tracking-widest text-gray-400 uppercase">
                                AUCUN PRODUIT NE CORRESPOND A VOTRE RECHERCHE
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
