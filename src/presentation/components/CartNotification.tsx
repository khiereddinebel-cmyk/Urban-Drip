'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../shared/context/CartContext';

export default function CartNotification() {
    const { lastAddedItem, clearLastAddedItem, cartCount } = useCart();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (lastAddedItem) {
            setIsVisible(true);
        }
    }, [lastAddedItem]);

    const handleClose = () => {
        setIsVisible(false);
        clearLastAddedItem();
    };

    if (!lastAddedItem || !isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: '80px', // Below header
            right: '24px',
            width: '100%',
            maxWidth: '380px',
            backgroundColor: 'white',
            boxShadow: '0 15px 50px rgba(0,0,0,0.1)',
            zIndex: 10000,
            padding: '30px',
            border: '1px solid #f0f0f0',
            fontFamily: 'var(--font-sans)',
            animation: 'slideUpTransition 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes slideUpTransition {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}} />
            
            {/* Header: Item Added + Close */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span style={{ fontSize: '15px', fontWeight: 500, color: '#000', letterSpacing: '-0.01em' }}>Item added to your cart</span>
                </div>
                <button 
                    onClick={handleClose}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#666' }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Product Info */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '30px' }}>
                <div style={{ position: 'relative', width: '90px', height: '90px', backgroundColor: '#fff', border: '1px solid #f5f5f5' }}>
                    <Image
                        src={lastAddedItem.images[0]}
                        alt={lastAddedItem.name}
                        fill
                        style={{ objectFit: 'contain', padding: '8px' }}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: '#000', lineHeight: '1.2' }}>
                        {lastAddedItem.name}
                    </h4>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0, fontWeight: 500 }}>
                        Size: {lastAddedItem.selectedSize}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link 
                    href="/cart"
                    onClick={() => setIsVisible(false)}
                    style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'center',
                        padding: '16px',
                        border: '1.5px solid #000',
                        backgroundColor: '#fff',
                        color: '#000',
                        fontSize: '14px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        textTransform: 'none'
                    }}
                >
                    View cart ({cartCount})
                </Link>
                <Link 
                    href="/checkout"
                    onClick={() => setIsVisible(false)}
                    style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'center',
                        padding: '16px',
                        backgroundColor: '#000',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        textTransform: 'none'
                    }}
                >
                    Check out
                </Link>
                <button 
                    onClick={handleClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#000',
                        fontSize: '14px',
                        fontWeight: 700,
                        textDecoration: 'underline',
                        textUnderlineOffset: '4px',
                        cursor: 'pointer',
                        marginTop: '10px'
                    }}
                >
                    Continue shopping
                </button>
            </div>
        </div>
    );
}
