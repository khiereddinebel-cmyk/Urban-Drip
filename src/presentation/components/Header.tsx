'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import SearchOverlay from './SearchOverlay';
import LoginSidebar from './LoginSidebar';
import { useCart } from '../../shared/context/CartContext';
import { useAuth } from '../../shared/context/AuthContext';

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
    const pathname = usePathname();
    const { cartCount } = useCart();

    const isHome = pathname === '/';
    const [isScrolled, setIsScrolled] = useState(!isHome);

    useEffect(() => {
        if (!isHome) {
            setIsScrolled(true);
            return;
        }

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [pathname, isHome]);

    useEffect(() => {
        const fetchNavData = async () => {
            try {
                // Fetch Brands
                const brandsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/brands/`, { cache: 'no-store' });
                if (!brandsRes.ok) throw new Error('Brands fetch failed');
                const brandsData = await brandsRes.json();
                const fetchedBrands = (brandsData.results || brandsData).map((b: any) => ({
                    name: (b.name || '').toUpperCase(),
                    path: `/brand/${b.slug}`
                }));
                setBrands(fetchedBrands);

                // Fetch Categories
                const catsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/categories/`, { cache: 'no-store' });
                if (!catsRes.ok) throw new Error('Categories fetch failed');
                const catsData = await catsRes.json();
                const fetchedCategories = (catsData.results || catsData).map((c: any) => ({
                    name: (c.name || '').toUpperCase(),
                    path: `/category/${c.slug}`
                }));
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Failed to fetch navigation data:', error);
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
    };

    const iconColor = (isHome && !isScrolled) ? '#fff' : 'var(--black)';

    return (
        <>
            <div style={{ 
                position: isHome ? (isScrolled ? 'fixed' : 'absolute') : 'sticky', 
                top: 0, 
                left: 0, 
                right: 0, 
                zIndex: 100, 
                backgroundColor: isScrolled ? 'var(--bg)' : 'transparent',
                borderBottom: isScrolled ? '1px solid var(--border-color)' : 'none',
                transition: 'background-color 0.3s ease, border-color 0.3s ease',
                width: '100%'
            }}>
                {/* Main Header */}
                <header style={{
                    backgroundColor: 'transparent',
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
                            style={{ padding: '8px', marginLeft: '-8px', background: 'none', border: 'none', cursor: 'pointer', color: iconColor }}
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
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                            <div style={{ width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src="/logo.png"
                                    alt="Urban Drip Logo"
                                    style={{ 
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        filter: (isHome && !isScrolled) ? 'brightness(0) invert(1)' : 'none',
                                        transition: 'filter 0.3s ease',
                                        display: 'block'
                                    }}
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Right: Icons */}
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '22px', alignItems: 'center' }}>
                        {/* Search Icon - Clean Circle */}
                        <button onClick={() => toggleSearch(true)} aria-label="Search" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: iconColor }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <circle cx="10.5" cy="10.5" r="7.5"></circle>
                                <path d="M21 21l-5.2-5.2"></path>
                            </svg>
                        </button>

                        {/* User Icon - Head & Curve */}
                        <button 
                            onClick={openLoginModal}
                            aria-label={isAuthenticated ? "Account" : "Login / Account"} 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: isAuthenticated ? '#438E44' : iconColor, display: 'flex', alignItems: 'center' }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                                <path d="M4 21a8 8 0 0 1 16 0"></path>
                            </svg>
                        </button>

                        {/* Cart Icon - Bag Shape */}
                        <Link href="/cart" aria-label="Cart" style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: iconColor, display: 'flex', alignItems: 'center' }}>
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
                                    backgroundColor: (isHome && !isScrolled) ? '#fff' : 'var(--black)',
                                    color: (isHome && !isScrolled) ? 'var(--black)' : 'var(--white)',
                                    fontSize: '9px',
                                    fontWeight: 900,
                                    width: '15px',
                                    height: '15px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </header>
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
            />
            <LoginSidebar isOpen={isLoginModalOpen} onClose={closeLoginModal} />
        </>
    );
}
