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

            <div style={{
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
                <div style={{ position: 'sticky', top: '20px' }}>
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text)', opacity: 0.6, marginBottom: '10px' }}>
                            {product.brand}
                        </h2>
                        <h1 style={{ fontSize: '32px', fontWeight: 400, fontFamily: 'var(--font-sans)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px', color: '#222' }}>
                            {product.name}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '20px', fontWeight: 500, color: '#333' }}>
                            <span style={{ color: '#888', textDecoration: 'line-through', fontWeight: 400, fontSize: '18px' }}>
                                {(product.price * 1.1).toLocaleString()} DA
                            </span>
                            <span style={{ color: '#27ae60' }}>
                                {product.price.toLocaleString()} DA
                            </span>
                        </div>
                    </div>

                    {/* Sizes Section */}
                    <div style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>Pointeur:</h4>
                            <button 
                                onClick={() => {
                                    const guide = product.sizes.map(s => `EU ${s.size} = ${s.cm}cm`).join('\n');
                                    alert(`Guide des Tailles :\n${guide || 'Aucune donnée disponible'}`);
                                }}
                                style={{ fontSize: '11px', textDecoration: 'underline', color: '#27ae60', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 700 }}
                            >
                                SIZE GUIDE (CM)
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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

                    <div style={{ marginBottom: '15px' }}>
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
                    />

                    <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', fontSize: '13px', color: 'var(--text)', opacity: 0.6 }}>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <strong style={{ color: 'var(--text)' }}>UGS :</strong> {product.id.toUpperCase()}
                        </p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <strong style={{ color: 'var(--text)' }}>Catégories :</strong> {(product.category || 'Uncategorized').toUpperCase()}, {(product.brand || 'No Brand').toUpperCase()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom: Tabs */}
            <div style={{ borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px 0' }}>
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
        </div>
    );
}
