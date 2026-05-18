'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer style={{
            backgroundColor: 'var(--footer-bg, #000000)',
            color: 'var(--footer-text, #ffffff)',
            padding: '80px 24px 40px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 300,
            letterSpacing: '1px',
            borderTop: '1px solid var(--border-color)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '80px'
            }}>
                {/* 1. Top Section: Quick Links Centered */}
                <div style={{ textAlign: 'center' }}>
                    <h4 style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        marginBottom: '32px'
                    }}>
                        Quick links
                    </h4>
                    <ul style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '30px',
                        flexWrap: 'wrap',
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        fontSize: '13px'
                    }}>
                        <li><Link href="/delivery" style={{ transition: 'var(--transition-fast)' }}>Delivery Information</Link></li>
                        <li><Link href="/terms" style={{ transition: 'var(--transition-fast)' }}>Terms & Conditions</Link></li>
                        <li><Link href="/privacy" style={{ transition: 'var(--transition-fast)' }}>Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* 2. Middle Section: Store Info, Subscribe & Social */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    gap: '60px'
                }}>
                    {/* Store Information Column */}
                    <div style={{ flex: '1 1 300px' }}>
                        <h4 style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            marginBottom: '24px'
                        }}>
                            Store Information
                        </h4>
                        <div style={{ fontSize: '14px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                            👟 متوفر البيع بالجملة والتجزئة{'\n'}
                            📍 <a href="https://maps.app.goo.gl/jnapEgQsn9irgpPf6?g_st=atm" target="_blank" style={{ color: 'inherit', textDecoration: 'underline' }}>Bou Ismail, Tipaza (depot)</a>{'\n'}
                            📲 WhatsApp: <a href="https://wa.me/213550340944" target="_blank" style={{ color: 'inherit', textDecoration: 'underline' }}>0550340944</a> / <a href="https://wa.me/213542296445" target="_blank" style={{ color: 'inherit', textDecoration: 'underline' }}>0542296445</a>{'\n'}
                            ✨ إمكانية التجريب قبل الدفع{'\n'}
                            🔄 خدمة التبديل / Service d’échange
                        </div>
                    </div>

                    {/* Social Icons Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: '0 0 auto' }}>
                        <h4 style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            marginBottom: '24px'
                        }}>
                            Follow Us
                        </h4>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <a href="https://www.instagram.com/urbandrip.dz/?hl=en" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"></circle>
                                </svg>
                            </a>
                            <a href="https://www.tiktok.com/@urbandrip.dz" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/people/Urban-Drip/100090421930678/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* 3. Bottom Section: Copyright */}
                <div style={{
                    paddingTop: '60px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '32px'
                }}>
                    <div style={{
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.5)',
                        textAlign: 'center',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        © 2026, URBAN DRIP
                    </div>
                </div>
            </div>
        </footer>
    );
}
