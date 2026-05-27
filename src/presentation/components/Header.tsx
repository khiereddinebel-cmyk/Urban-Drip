'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import SearchOverlay from './SearchOverlay';
import LoginSidebar from './LoginSidebar';
import { useCart } from '../../shared/context/CartContext';
import { useAuth } from '../../shared/context/AuthContext';
import { useEffect } from 'react';

interface NavItem {
    name: string;
    path: string;
}

export default function Header() {
    const { isAuthenticated, isLoginModalOpen, openLoginModal, closeLoginModal } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [brands, setBrands] = useState<NavItem[]>([]);
    const [categories, setCategories] = useState<NavItem[]>([]);
    const [logoUrl, setLogoUrl] = useState('/logo.png');
    const [showLogoText, setShowLogoText] = useState(false);
    const pathname = usePathname();
    const { cartCount } = useCart();

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                // Fetch Brands
                const brandsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/brands/`);
                if (!brandsRes.ok) throw new Error('Brands fetch failed');
                const brandsData = await brandsRes.json();
                const fetchedBrands = (brandsData.results || brandsData).map((b: any) => ({
                    name: (b.name || '').toUpperCase(),
                    path: `/brand/${b.slug}`
                }));
                setBrands(fetchedBrands);

                // Fetch Categories
                const catsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/categories/`);
                if (!catsRes.ok) throw new Error('Categories fetch failed');
                const catsData = await catsRes.json();
                const fetchedCategories = (catsData.results || catsData).map((c: any) => ({
                    name: (c.name || '').toUpperCase(),
                    path: `/category/${c.slug}`
                }));
                setCategories(fetchedCategories);

                // Fetch Site Settings
                const settingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/site-settings/`);
                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json();
                    if (settingsData) {
                        if (settingsData.logo) {
                            setLogoUrl(settingsData.logo);
                        }
                        setShowLogoText(settingsData.show_logo_text ?? false);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch navigation/settings data:', error);
            }
        };
        fetchNavData();
    }, []);

    // Define the exact order as requested
    const menCat = categories.find(c => c.name.includes('MEN') && !c.name.includes('WOMEN'));
    const womenCat = categories.find(c => c.name.includes('WOMEN'));
    const kidsCat = categories.find(c => c.name.includes('KIDS'));
    const accCat = categories.find(c => c.name.includes('ACCESSORIES'));

    // Other categories to make it editable from admin panel
    const otherCategories = categories.filter(c => 
        c !== menCat && c !== womenCat && c !== kidsCat && c !== accCat &&
        !c.name.toLowerCase().includes('latest drops') &&
        !c.name.toLowerCase().includes('most viewed')
    );

    const staticNavItems = [
        { name: 'HOME', path: '/' },
        { name: 'LATEST DROPS', path: '/latest-drops' }
    ];

    // Build the nav bar items in order
    const orderedNavItems = [
        ...staticNavItems,
        ...brands,
        ...(menCat ? [menCat] : []),
        ...(womenCat ? [womenCat] : []),
        ...(kidsCat ? [kidsCat] : []),
        ...(accCat ? [accCat] : []),
        ...otherCategories,
        { name: 'CONTACT US', path: '/contact' }
    ];

    const toggleSearch = (isOpen: boolean) => {
        setIsSearchOpen(isOpen);
        if (!isOpen) setSearchTerm('');
    };

    return (
        <>
            <div style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'var(--bg)' }}>
                {/* Top Announcement Bar */}
                <div style={{
                    backgroundColor: 'var(--black)',
                    color: 'var(--white)',
                    height: '35px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    fontFamily: 'var(--font-sans)',
                    textTransform: 'uppercase'
                }}>
                    WELCOME TO URBAN DRIP - PREMIUM SNEAKERS & STREETWEAR
                </div>

                {!isSearchOpen ? (
                    <>
                        {/* Main Header */}
                        <header style={{
                            backgroundColor: 'var(--bg)',
                            borderBottom: '1px solid var(--border-color)',
                            padding: '0 24px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            height: '70px'
                        }}>
                            {/* Left: Hamburger for menu */}
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                                <button
                                    onClick={() => setIsSidebarOpen(true)}
                                    style={{ padding: '8px', marginLeft: '-8px', background: 'none', border: 'none', cursor: 'pointer' }}
                                    aria-label="Open Menu"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="4" y1="12" x2="20" y2="12"></line>
                                        <line x1="4" y1="6" x2="20" y2="6"></line>
                                        <line x1="4" y1="18" x2="20" y2="18"></line>
                                    </svg>
                                </button>
                            </div>

                            {/* Center: Logo */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                    <div style={{ position: 'relative', width: '72px', height: '72px' }}>
                                        <Image
                                            src={logoUrl}
                                            alt="Urban Drip Logo"
                                            fill
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                    {showLogoText && (
                                        <span style={{
                                            fontFamily: 'var(--font-serif)',
                                            fontSize: '32px',
                                            fontWeight: 900,
                                            margin: 0,
                                            letterSpacing: '2px',
                                            lineHeight: 1,
                                            color: 'var(--black)',
                                            textTransform: 'uppercase'
                                        }}>
                                            URBAN DRIP
                                        </span>
                                    )}
                                </Link>
                            </div>

                            {/* Right: Icons */}
                            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '22px', alignItems: 'center' }}>
                                {/* Search Icon - Clean Circle */}
                                <button onClick={() => toggleSearch(true)} aria-label="Search" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--black)' }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <circle cx="10.5" cy="10.5" r="7.5"></circle>
                                        <path d="M21 21l-5.2-5.2"></path>
                                    </svg>
                                </button>

                                {/* User Icon - Head & Curve */}
                                <button 
                                    onClick={openLoginModal}
                                    aria-label={isAuthenticated ? "Account" : "Login / Account"} 
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: isAuthenticated ? '#438E44' : 'var(--black)', display: 'flex', alignItems: 'center' }}
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                                        <path d="M4 21a8 8 0 0 1 16 0"></path>
                                    </svg>
                                </button>

                                {/* Cart Icon - Bag Shape */}
                                <Link href="/cart" aria-label="Cart" style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--black)', display: 'flex', alignItems: 'center' }}>
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M6 8l1-5h10l1 5"></path>
                                        <path d="M4 8h16l-1 13H5L4 8z"></path>
                                        <path d="M9 11a3 3 0 0 0 6 0"></path>
                                    </svg>
                                    {cartCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '-6px',
                                            right: '-8px',
                                            backgroundColor: 'var(--black)',
                                            color: 'var(--white)',
                                            fontSize: '9px',
                                            fontWeight: 900,
                                            width: '15px',
                                            height: '15px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </header>

                        {/* Sub-Navigation Bar - Updated for all items visibility */}
                        <nav style={{
                            backgroundColor: 'var(--bg)',
                            borderBottom: '1px solid var(--border-color)',
                            padding: '12px 24px',
                            display: 'flex',
                            justifyContent: 'center',
                            flexWrap: 'wrap', // Allow two lines
                            gap: '12px 25px', // Horizontal 25px, Vertical 12px
                            overflowX: 'hidden',
                            minHeight: '45px'
                        }}>
                            {orderedNavItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={`${item.name}-${item.path}`}
                                        href={item.path}
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: isActive ? 700 : 500,
                                            letterSpacing: '1px',
                                            color: 'var(--text)',
                                            textDecoration: 'none',
                                            transition: 'var(--transition-fast)',
                                            fontFamily: 'var(--font-sans)',
                                            borderBottom: isActive ? '2px solid var(--text)' : '2px solid transparent',
                                            paddingBottom: '2px',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </>
                ) : (
                    /* Search Mode Header */
                    <div style={{ 
                        height: '110px', 
                        backgroundColor: 'var(--bg)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '0 24px',
                        borderBottom: '1px solid var(--border-color)'
                    }}>
                        <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', alignItems: 'center', gap: '30px' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <label style={{ 
                                    position: 'absolute', 
                                    top: '10px', 
                                    left: '20px', 
                                    fontSize: '10px', 
                                    fontWeight: 700, 
                                    textTransform: 'uppercase', 
                                    color: '#999',
                                    letterSpacing: '1px'
                                }}>
                                    Search
                                </label>
                                <div style={{ 
                                    border: '1px solid var(--text)', 
                                    height: '70px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    paddingRight: '20px',
                                    backgroundColor: 'var(--bg)'
                                }}>
                                    <div style={{ position: 'relative', flex: 1, height: '100%' }}>
                                        <input 
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{ 
                                                width: '100%', 
                                                height: '100%', 
                                                border: 'none', 
                                                outline: 'none', 
                                                padding: '24px 20px 0 20px', 
                                                fontSize: '22px',
                                                fontWeight: 500,
                                                fontFamily: 'var(--font-sans)',
                                                backgroundColor: 'transparent'
                                            }}
                                            autoFocus
                                            placeholder=""
                                        />
                                                {searchTerm && (
                                            <button 
                                                onClick={() => setSearchTerm('')}
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-2px)',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#000',
                                                    padding: '5px'
                                                }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ height: '30px', width: '1px', backgroundColor: '#eee', margin: '0 15px' }}></div>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.5">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </div>
                            </div>
                            <button 
                                onClick={() => toggleSearch(false)} 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}
                                aria-label="Close search"
                            >
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="1">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebars */}
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onLoginClick={openLoginModal}
            />
            <SearchOverlay 
                isOpen={isSearchOpen} 
                onClose={() => toggleSearch(false)} 
                searchTerm={searchTerm} 
            />
            <LoginSidebar isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </>
    );
}
