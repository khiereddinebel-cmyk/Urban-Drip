'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SidebarNavItem {
    name: string;
    path: string;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginClick?: () => void;
}

export default function Sidebar({ isOpen, onClose, onLoginClick }: SidebarProps) {
    const [openMenus, setOpenMenus] = useState<string[]>([]);
    const [brands, setBrands] = useState<SidebarNavItem[]>([]);
    const [categories, setCategories] = useState<SidebarNavItem[]>([]);

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                const brandsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/brands/`);
                if (!brandsRes.ok) throw new Error('Brands fetch failed');
                const brandsData = await brandsRes.json();
                setBrands((brandsData.results || brandsData).map((b: any) => ({
                    name: b.name,
                    path: `/brand/${b.slug}`
                })));

                const catsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/categories/`);
                if (!catsRes.ok) throw new Error('Categories fetch failed');
                const catsData = await catsRes.json();
                setCategories((catsData.results || catsData).map((c: any) => ({
                    name: c.name,
                    path: `/category/${c.slug}`
                })));
            } catch (error) {
                console.error('Failed to fetch sidebar data:', error);
            }
        };
        fetchNavData();
    }, []);

    const toggleMenu = (menu: string) => {
        setOpenMenus(prev =>
            prev.includes(menu) ? prev.filter(m => m !== menu) : [...prev, menu]
        );
    };

    // Dynamic lists are now in state: brands and categories

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 1000,
                        transition: 'opacity var(--transition-fast)'
                    }}
                />
            )}

            {/* Drawer */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
                width: '85%', maxWidth: '320px',
                backgroundColor: 'var(--black)',
                color: 'var(--white)',
                zIndex: 1001,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform var(--transition-smooth)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '10px 0 30px rgba(0,0,0,0.5)'
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        height: '60px',
                        padding: '0 8px'
                    }}>
                        <div style={{ position: 'relative', height: '60px', width: '60px' }}>
                            <Image
                                src="/logo.png"
                                alt="Urban Drip Logo"
                                fill
                                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                            />
                        </div>
                        <span style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '32px',
                            fontWeight: 800,
                            letterSpacing: '2px',
                            lineHeight: 1,
                            color: 'var(--white)',
                            textTransform: 'uppercase'
                        }}>
                            URBAN DRIP
                        </span>
                    </div>
                    <button onClick={onClose} style={{ padding: '8px', marginRight: '-8px', color: 'var(--white)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Links */}
                <div className="nav-menu" style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
                    <Link href="/" onClick={onClose} style={{ display: 'block', padding: '16px 24px', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}
                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
                        Home
                    </Link>
                    
                    {/* Standalone dynamically fetched main sections */}
                    {categories.filter(c => c.name.toLowerCase().includes('latest drops') || c.name.toLowerCase().includes('most viewed')).map(cat => (
                        <Link 
                            key={cat.path}
                            href={cat.path} 
                            onClick={onClose} 
                            style={{ display: 'block', padding: '16px 24px', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }} 
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'} 
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            {cat.name}
                        </Link>
                    ))}


                    {/* Sneakers Section */}
                    <div style={{ padding: '16px 24px 8px', fontSize: '14px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', backgroundColor: '#111' }}>
                        Sneakers
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {brands.map(brand => (
                            <Link 
                                key={brand.path}
                                href={brand.path} 
                                onClick={onClose} 
                                style={{ padding: '12px 32px', fontSize: '12px', borderBottom: '1px solid #222' }} 
                                onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'} 
                                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                            >
                                {brand.name}
                            </Link>
                        ))}
                    </div>

                    {/* Clothes Section */}
                    <div style={{ padding: '16px 24px 8px', fontSize: '14px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', backgroundColor: '#111', marginTop: '8px' }}>
                        Clothes
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {categories.filter(c => !c.name.toLowerCase().includes('latest drops') && !c.name.toLowerCase().includes('most viewed')).map(cat => (
                            <Link 
                                key={cat.path}
                                href={cat.path} 
                                onClick={onClose} 
                                style={{ padding: '12px 32px', fontSize: '12px', borderBottom: '1px solid #222' }} 
                                onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'} 
                                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>

                    {/* Other Links handled via categories */}
                    <Link href="/contact" onClick={onClose} style={{ display: 'block', padding: '16px 24px', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '8px' }} onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'} onMouseOut={(e) => e.currentTarget.style.opacity = '1'}>
                        Contact Us
                    </Link>
                </div>

                {/* Footer */}
                <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--black)' }}>
                    <button 
                        onClick={() => {
                            if (onLoginClick) onLoginClick();
                            onClose();
                        }} 
                        style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '16px', border: '1px solid var(--white)',
                            justifyContent: 'center', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase',
                            color: 'var(--white)', backgroundColor: 'transparent', transition: 'background-color var(--transition-fast)',
                            cursor: 'pointer'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--white)'; e.currentTarget.style.color = 'var(--black)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--white)'; }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        Log in
                    </button>
                    <div style={{ marginTop: '24px', color: '#888', fontSize: '11px', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        ALGERIA | DA د.ج
                    </div>
                </div>
            </div>
        </>
    );
}
