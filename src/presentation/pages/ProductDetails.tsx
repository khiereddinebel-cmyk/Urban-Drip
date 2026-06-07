'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductGallery from '../components/ProductGallery';
import CODForm from '../components/CODForm';
import { Product } from '../../domain/entities/Product';
import { useCart } from '../../shared/context/CartContext';

interface ProductDetailsPageProps {
    product: Product;
}

export default function ProductDetailsPage({ product }: ProductDetailsPageProps) {
    const [selectedSize, setSelectedSize] = useState<number | string | null>(null);
    const [hoveredSize, setHoveredSize] = useState<number | string | null>(null);
    const [activeTab, setActiveTab] = useState('DESCRIPTION');
    const [openMobileTabs, setOpenMobileTabs] = useState<Record<string, boolean>>({ DESCRIPTION: true });
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Veuillez sélectionner une pointure / Please select a size');
            return;
        }
        
        addToCart(product, 1, selectedSize);
        setSelectedSize(null);
    };

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 24px' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)' }}>Product Not Found</h1>
                <p>The product you are looking for does not exist or has been removed.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px 24px' }}>
            {/* Breadcrumbs */}
            <div style={{ marginBottom: '30px', fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <Link href="/" style={{ color: '#888' }}>Home</Link> / <Link href={`/category/${(product.category || '').toLowerCase()}`} style={{ color: '#888' }}>{product.category}</Link> / {product.name}
            </div>

            <div className="product-details-container" style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '80px',
                alignItems: 'flex-start',
                marginBottom: '80px'
            }}>
                {/* Left: Interactive Gallery */}
                <div>
                    <ProductGallery images={product.images} />
                </div>

                {/* Right: Info & COD Form */}
                <div style={{ position: 'sticky', top: '20px' }} className="w-full">
                    <div className="text-center md:text-left mb-[30px]">
                        <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text)', opacity: 0.6, marginBottom: '10px' }}>
                            {product.brand}
                        </h2>
                        <h1 className="product-details-title" style={{ fontSize: '32px', fontWeight: 400, fontFamily: 'var(--font-sans)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', color: '#222' }}>
                            {product.name}
                        </h1>
                        <div className="flex justify-center md:justify-start items-center gap-[15px] text-[20px] font-medium text-[#333]">
                            <span className="hidden md:inline text-[#888] line-through font-normal text-[18px]">
                                {(product.price * 1.1).toLocaleString()} DA
                            </span>
                            <span style={{ color: '#27ae60' }} className="text-[22px] md:text-[20px] font-bold">
                                {product.price.toLocaleString()} DA
                            </span>
                        </div>
                    </div>

                    {/* Sizes Section */}
                    <div style={{ marginBottom: '30px' }} className="w-full" id="sizes-section">
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-[12px] gap-2 md:gap-0">
                            <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', margin: 0 }} className="text-center md:text-left">
                                Pointeur :
                            </h4>
                            <button 
                                onClick={() => {
                                    const guide = product.sizes.map(s => `EU ${s.size} = ${s.cm}cm`).join('\n');
                                    alert(`Guide des Tailles :\n${guide || 'Aucune donnée disponible'}`);
                                }}
                                style={{ fontSize: '11px', textDecoration: 'underline', color: '#27ae60', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                                className="hidden md:block"
                            >
                                SIZE GUIDE (CM)
                            </button>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-[8px] max-w-[340px] md:max-w-none mx-auto md:mx-0">
                            {product.sizes.map((size) => {
                                const isActive = selectedSize === size.size;
                                const isHovered = hoveredSize === size.size;
                                return (
                                    <button
                                        key={size.size}
                                        onClick={() => setSelectedSize(size.size)}
                                        onMouseEnter={() => setHoveredSize(size.size)}
                                        onMouseLeave={() => setHoveredSize(null)}
                                        style={{
                                            minWidth: '50px',
                                            height: '45px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: (isActive || isHovered) ? '2px solid var(--text)' : '1px solid var(--border-color)',
                                            backgroundColor: (isActive || isHovered) ? 'var(--text)' : 'var(--bg)',
                                            color: (isActive || isHovered) ? 'var(--bg)' : 'var(--text)',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            transition: 'all 0.2s',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        {size.size}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div style={{ marginBottom: '15px' }} className="hidden md:block">
                        <button
                            onClick={handleAddToCart}
                            style={{
                                width: '100%',
                                backgroundColor: 'var(--text)',
                                color: 'var(--bg)',
                                padding: '18px',
                                border: 'none',
                                fontSize: '14px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                cursor: 'pointer',
                                transition: 'opacity 0.2s',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                        >
                            ADD TO CART
                        </button>
                    </div>

                    <CODForm
                        productId={product.id}
                        productName={product.name}
                        productPrice={product.price}
                        selectedSize={selectedSize}
                        productImage={product.images?.[0]}
                    />

                    <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', fontSize: '13px', color: 'var(--text)', opacity: 0.6 }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <strong style={{ color: 'var(--text)' }}>UGS :</strong> {product.id.toUpperCase()}
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <strong style={{ color: 'var(--text)' }}>Catégories :</strong> {(product.category || 'Uncategorized').toUpperCase()}, {(product.brand || 'No Brand').toUpperCase()}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ color: 'var(--text)' }}>Follow :</strong>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', color: '#111' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M20 4l-6.768 6.768"/></svg>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 22a10 10 0 0 1-5.18-8.61A10 10 0 0 1 12 2a10 10 0 0 1 9.18 11.39A10 10 0 0 1 12 22a9.9 9.9 0 0 1-4-1l.73-3.69A9 9 0 0 0 12 18a6 6 0 0 0 5-3c.48-1 .48-3 0-4a6 6 0 0 0-8 3c0 .52.17 1 .5 1.5l-1 3.5c-.71-2.52.2-6 3-8a9 9 0 0 1 7 0c1.78 1.5 2.5 4.5 1 7.5a6 6 0 0 1-5.5 3.5c-1.5 0-2.5-1-2.5-2a9 9 0 0 0 1-4.5c0-1.5-.75-2.5-2.25-2.5-1.78 0-3 1.5-3 3.5a6 6 0 0 0 .5 2z"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: Tabs (Desktop only) */}
            <div style={{ borderTop: '1px solid var(--border-color)' }} className="hidden md:block">
                <div className="product-details-tabs" style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px 0' }}>
                    {['DESCRIPTION', 'INFORMATIONS COMPLÉMENTAIRES', 'EXPÉDITION ET LIVRAISON', 'ECHANGE'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: 600,
                                color: activeTab === tab ? 'var(--text)' : 'var(--text)',
                                opacity: activeTab === tab ? 1 : 0.4,
                                paddingBottom: '10px',
                                borderBottom: activeTab === tab ? '2px solid #27ae60' : 'none',
                                transition: 'all 0.3s'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ padding: '40px 0', minHeight: '200px', lineHeight: 1.8, color: 'var(--text)', opacity: 0.8 }}>
                    {activeTab === 'DESCRIPTION' && (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '18px', marginBottom: '20px', fontWeight: 600, textTransform: 'uppercase' }}>
                                {product.name} ONE OF THE LIMITED EDITION IN THE WORLD
                            </p>
                            <div style={{ backgroundColor: 'var(--surface)', padding: '15px', borderRadius: '8px', display: 'inline-block' }}>
                                <p style={{ fontSize: '20px', fontWeight: 800, color: '#27ae60', margin: 0 }}>
                                    tu peux ouvrir le colis avant le paiement ✅
                                </p>
                            </div>
                        </div>
                    )}
                    {activeTab !== 'DESCRIPTION' && (
                        <p style={{ textAlign: 'center', color: 'var(--text)', opacity: 0.4 }}>Informations bientôt disponibles pour cette section.</p>
                    )}
                </div>
            </div>

            {/* Mobile Accordions */}
            <div className="md:hidden mt-8 border-t border-gray-200" style={{ marginBottom: '60px' }}>
                {[
                    { id: 'DESCRIPTION', title: 'Description' },
                    { id: 'INFORMATIONS', title: 'Informations complémentaires' },
                    { id: 'EXPEDITION', title: 'Expédition et livraison' },
                    { id: 'ECHANGE', title: 'Echange' }
                ].map((tab) => {
                    const isOpen = !!openMobileTabs[tab.id];
                    return (
                        <div key={tab.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <button
                                onClick={() => setOpenMobileTabs(prev => ({ ...prev, [tab.id]: !prev[tab.id] }))}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '16px 0',
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: isOpen ? '#27ae60' : 'var(--text)',
                                    transition: 'color 0.2s',
                                    textAlign: 'left'
                                }}
                            >
                                <span>{tab.title}</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }}>
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                            </button>
                            {isOpen && (
                                <div style={{ padding: '0 0 20px 0', fontSize: '13px', lineHeight: 1.7, color: 'var(--text)', opacity: 0.8 }}>
                                    {tab.id === 'DESCRIPTION' && (
                                        <div>
                                            <p style={{ marginBottom: '15px' }}>
                                                {product.description || `${product.name} limited edition.`}
                                            </p>
                                            <div style={{ backgroundColor: 'var(--surface)', padding: '12px', borderRadius: '6px', display: 'inline-block', border: '1px solid #e2f2e5' }}>
                                                <p style={{ fontSize: '14px', fontWeight: 800, color: '#27ae60', margin: 0 }}>
                                                    tu peux ouvrir le colis avant le paiement ✅
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {tab.id !== 'DESCRIPTION' && (
                                        <p style={{ opacity: 0.5 }}>Informations bientôt disponibles pour cette section.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-[50] bg-white border-t border-gray-200 p-3 flex justify-center items-center shadow-lg">
                <button
                    onClick={() => {
                        const el = document.getElementById('sizes-section');
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }}
                    style={{
                        backgroundColor: '#27ae60',
                        color: '#fff',
                        width: '100%',
                        padding: '14px',
                        fontSize: '14px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        borderRadius: '4px',
                        textAlign: 'center'
                    }}
                >
                    SELECT OPTIONS
                </button>
            </div>
        </div>
    );
}
