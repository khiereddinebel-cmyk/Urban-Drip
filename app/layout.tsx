import Header from '../src/presentation/components/Header';
import Footer from '../src/presentation/components/Footer';
import FloatingWhatsApp from '../src/presentation/components/FloatingWhatsApp';
import CartNotification from '../src/presentation/components/CartNotification';
import '../src/globals.css';
import { Metadata } from 'next';
import { CartProvider } from '../src/shared/context/CartContext';
import { AuthProvider } from '../src/shared/context/AuthContext';
import React from 'react';

export const metadata: Metadata = {
    title: 'Urban Drip | Step Into Style',
    description: 'Premium luxury sneakers and streetwear.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body style={{ fontFamily: 'var(--font-sans)', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
                <AuthProvider>
                    <CartProvider>
                        <CartNotification />
                        <Header />

                        <main style={{ minHeight: '100vh' }}>
                            {children}
                        </main>

                        <Footer />
                        <FloatingWhatsApp />
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
