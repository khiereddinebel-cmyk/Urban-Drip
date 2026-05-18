'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import ProductCard from '../components/ProductCard';
import { Product } from '../../domain/entities/Product';

interface ProductGridPageProps {
    title: string;
    brand?: string;
    category?: string;
    bannerImage?: string;
    logoImage?: string;
    showHero?: boolean;
    products: Product[];
}

export default function ProductGridPage({ title, brand, category, bannerImage, logoImage, showHero, products }: ProductGridPageProps) {
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('Featured');
    const [availability, setAvailability] = useState<string[]>([]);

    // Handle sorting logic
    const displayedProducts = useMemo(() => {
        let result = [...products];

        if (sortBy === 'Price, low to high') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'Price, high to low') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'Alphabetically, A-Z') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'Alphabetically, Z-A') {
            result.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === 'Date, new to old') {
            result.reverse();
        }

        return result;
    }, [products, sortBy]);

    const toggleFilter = (filterName: string) => {
        setOpenFilter(openFilter === filterName ? null : filterName);
    };

    const sectionTitle = brand 
        ? brand.toUpperCase() 
        : (title.toLowerCase().includes('viewed') ? 'Most Viewed Products' : title);

    return (
        <div style={{ paddingBottom: '100px', backgroundColor: 'var(--bg)' }}>
            {showHero && bannerImage && (
                <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '600px',
                    marginBottom: '0px',
                    overflow: 'hidden'
                }}>
                    <Image
                        src={bannerImage}
                        alt={`${title} Banner`}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                        unoptimized
                    />
                </div>
            )}

            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}>
                {/* Section Title & Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '40px', marginBottom: '50px' }}>
                    {logoImage && (
                        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                            <Image
                                src={logoImage}
                                alt={`${title} Logo`}
                                fill
                                style={{ objectFit: 'contain' }}
                                unoptimized
                            />
                        </div>
                    )}
                    <h1 style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '48px',
                        fontWeight: 800,
                        color: 'var(--text)',
                        margin: 0,
                        letterSpacing: '-1px'
                    }}>
                        {sectionTitle}
                    </h1>
                </div>

                {/* Filter & Sort Bar */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '15px 0',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '14px',
                    color: 'var(--text)',
                    marginBottom: '60px',
                    position: 'relative',
                    zIndex: 50
                }}>
                    <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700 }}>Filter:</span>
                        
                        {/* Availability Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={() => toggleFilter('Availability')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}
                            >
                                Availability 
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: openFilter === 'Availability' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                    <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            {openFilter === 'Availability' && (
                                <div style={{ position: 'absolute', top: '40px', left: 0, backgroundColor: 'var(--bg)', border: '1px solid var(--border-color)', width: '280px', padding: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', borderRadius: '2px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: 'var(--text)', opacity: 0.6, fontSize: '12px' }}>
                                        <span>0 selected</span>
                                        <button onClick={() => setAvailability([])} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontWeight: 600 }}>Reset</button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                                            <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} /> 
                                            <span style={{ fontSize: '13px' }}>In stock ({displayedProducts.length})</span>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', opacity: 0.5 }}>
                                            <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} /> 
                                            <span style={{ fontSize: '13px' }}>Out of stock (0)</span>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Price Dropdown */}
                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={() => toggleFilter('Price')}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}
                            >
                                Price 
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ transform: openFilter === 'Price' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                                    <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            {openFilter === 'Price' && (
                                <div style={{ position: 'absolute', top: '40px', left: 0, backgroundColor: 'white', border: '1px solid #e5e5e5', width: '320px', padding: '25px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', borderRadius: '2px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#666', fontSize: '12px' }}>
                                        <span>The highest price is 150.000 DA</span>
                                        <button style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#000', fontWeight: 600 }}>Reset</button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #ddd', padding: '10px' }}>
                                            <span style={{ color: '#999' }}>د.ج</span>
                                            <input type="text" placeholder="From" style={{ width: '100%', border: 'none', outline: 'none', fontSize: '13px' }} />
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #ddd', padding: '10px' }}>
                                            <span style={{ color: '#999' }}>د.ج</span>
                                            <input type="text" placeholder="To" style={{ width: '100%', border: 'none', outline: 'none', fontSize: '13px' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700 }}>Sort by:</span>
                            <div style={{ position: 'relative' }}>
                                <select 
                                    style={{ 
                                        border: 'none', 
                                        background: 'none', 
                                        fontWeight: 500, 
                                        cursor: 'pointer', 
                                        outline: 'none',
                                        fontSize: '14px',
                                        fontFamily: 'var(--font-sans)',
                                        appearance: 'none',
                                        paddingRight: '20px'
                                    }}
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option>Featured</option>
                                    <option>Best selling</option>
                                    <option>Alphabetically, A-Z</option>
                                    <option>Alphabetically, Z-A</option>
                                    <option>Price, low to high</option>
                                    <option>Price, high to low</option>
                                    <option>Date, old to new</option>
                                    <option>Date, new to old</option>
                                </select>
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                    <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>
                        <span style={{ fontWeight: 500 }}>{displayedProducts.length} products</span>
                    </div>
                </div>

                {displayedProducts.length > 0 ? (
                    <>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '100px 50px',
                            margin: '0 auto'
                        }}>
                            {displayedProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Pagination - Hide if few products or implement dynamic logic later */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '120px',
                            gap: '30px',
                            fontSize: '14px',
                            fontFamily: 'var(--font-sans)',
                            color: 'var(--text)'
                        }}>
                            <span style={{ borderBottom: '2px solid var(--text)', paddingBottom: '4px', cursor: 'pointer', fontWeight: 700 }}>1</span>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '150px 0' }}>
                        <p style={{ color: '#999', fontSize: '20px', fontFamily: 'var(--font-sans)' }}>No products found in this section.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
