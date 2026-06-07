'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../src/shared/context/CartContext';
import { useAuth } from '../../src/shared/context/AuthContext';
import { getProductImageUrl } from '../../src/shared/utils/imageUtils';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const { openLoginModal } = useAuth();

    if (cart.length === 0) {
        return (
            <div style={{ padding: '100px 24px', textAlign: 'center', backgroundColor: 'var(--bg)', minHeight: '60vh' }}>
                <h1 style={{ fontSize: '48px', fontWeight: 600, marginBottom: '40px', color: 'var(--text)' }}>
                    Your cart is empty
                </h1>
                
                <Link 
                    href="/" 
                    style={{
                        display: 'inline-block',
                        backgroundColor: 'var(--text)',
                        color: 'var(--bg)',
                        padding: '18px 60px',
                        fontSize: '16px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        marginBottom: '60px',
                        transition: 'opacity 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                    Continue shopping
                </Link>

                <div style={{ marginTop: '40px' }}>
                    <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '15px', color: 'var(--text)' }}>
                        Have an account?
                    </h3>
                    <p style={{ fontSize: '16px', color: 'var(--text)' }}>
                        <button 
                            onClick={openLoginModal} 
                            style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'var(--text)', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            Log in
                        </button> to check out faster.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', color: 'var(--text)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '40px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-sans)', letterSpacing: '-0.5px' }}>Your cart</h1>
                <Link href="/" style={{ fontSize: '16px', color: 'var(--text)', textDecoration: 'underline', fontWeight: 500 }}>
                    Continue shopping
                </Link>
            </div>

            {/* Table Header */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '2fr 1fr 1fr', 
                paddingBottom: '20px', 
                borderBottom: '1px solid var(--border-color)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text)',
                opacity: 0.5,
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                <div>PRODUCT</div>
                <div style={{ textAlign: 'center' }}>QUANTITY</div>
                <div style={{ textAlign: 'right' }}>TOTAL</div>
            </div>

            {/* Cart Items */}
            <div style={{ marginBottom: '60px' }}>
                {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '2fr 1fr 1fr', 
                        padding: '30px 0', 
                        borderBottom: '1px solid var(--border-color)',
                        alignItems: 'center'
                    }}>
                        {/* Product Info */}
                        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                            <div style={{ position: 'relative', width: '120px', height: '120px', backgroundColor: 'var(--bg)', border: '1px solid var(--border-color)' }}>
                                <Image
                                    src={getProductImageUrl(item.images[0])}
                                    alt={item.name}
                                    fill
                                    style={{ objectFit: 'contain', padding: '10px' }}
                                />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 500, fontFamily: 'var(--font-sans)', margin: '0 0 8px 0', color: 'var(--text)' }}>{item.name}</h3>
                                <p style={{ fontSize: '14px', color: 'var(--text)', margin: '0 0 8px 0' }}>{item.price.toLocaleString()} DA</p>
                                <p style={{ fontSize: '14px', color: 'var(--text)', opacity: 0.6, margin: 0 }}>Size: {item.selectedSize}</p>
                            </div>
                        </div>

                        {/* Quantity Controls */}
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                border: '1px solid var(--border-color)',
                                borderRadius: '0',
                                padding: '5px'
                            }}>
                                <button 
                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 15px', color: '#666', fontWeight: 300 }}
                                >
                                    &mdash;
                                </button>
                                <div style={{ minWidth: '40px', textAlign: 'center', fontSize: '16px', fontWeight: 500 }}>{item.quantity}</div>
                                <button 
                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px 15px', color: '#666', fontSize: '20px' }}
                                >
                                    +
                                </button>
                            </div>
                            <button 
                                onClick={() => removeFromCart(item.id, item.selectedSize)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Total */}
                        <div style={{ textAlign: 'right', fontSize: '16px', fontWeight: 700 }}>
                            {(item.price * item.quantity).toLocaleString()} DA
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Footer */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '30px' }}>
                <div style={{ textAlign: 'right', color: 'var(--text)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '40px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 500 }}>Estimated total</span>
                        <span style={{ fontSize: '24px', fontWeight: 700 }}>{cartTotal.toLocaleString()} DA</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text)', opacity: 0.6, margin: 0 }}>
                        Taxes, discounts and shipping calculated at checkout.
                    </p>
                </div>

                <Link 
                    href="/checkout"
                    style={{
                        backgroundColor: 'var(--text)',
                        color: 'var(--bg)',
                        padding: '16px 80px',
                        fontSize: '15px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'opacity 0.2s',
                        borderRadius: '0px'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                    Check out
                </Link>
            </div>
        </div>
    );
}
