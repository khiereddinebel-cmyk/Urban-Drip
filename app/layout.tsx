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
    metadataBase: new URL('https://urbandrip.dz'),
    title: {
        default: 'Urban Drip | Step Into Style',
        template: '%s | Urban Drip',
    },
    description: 'Urban Drip — Step Into Style. Discover premium sneakers, streetwear, and the latest drops in Algeria.',
    alternates: {
        canonical: 'https://urbandrip.dz/',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://urbandrip.dz/',
        siteName: 'Urban Drip',
        title: 'Urban Drip | Step Into Style',
        description: 'Urban Drip — Step Into Style. Discover premium sneakers, streetwear, and the latest drops in Algeria.',
        images: [
            {
                url: 'https://urbandrip.dz/hero-banner.png',
                width: 1200,
                height: 630,
                alt: 'Urban Drip — Step Into Style',
            },
        ],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'WebSite',
            '@id': 'https://urbandrip.dz/#website',
            'url': 'https://urbandrip.dz/',
            'name': 'Urban Drip',
            'description': 'Urban Drip — Step Into Style. Premium luxury sneakers and streetwear in Algeria.',
            'publisher': { '@id': 'https://urbandrip.dz/#organization' }
        },
        {
            '@type': 'Organization',
            '@id': 'https://urbandrip.dz/#organization',
            'name': 'Urban Drip',
            'url': 'https://urbandrip.dz/',
            'logo': 'https://urbandrip.dz/logo.png',
            'sameAs': [
                'https://www.instagram.com/urbandrip.dz',
                'https://www.tiktok.com/@urbandrip.dz',
                'https://www.facebook.com/people/Urban-Drip/100090421930678/'
            ]
        }
    ]
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
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
