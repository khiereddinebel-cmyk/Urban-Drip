"use client";

import React, { useRef, useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import ProductCard from '../components/ProductCard';
import { Product } from '../../domain/entities/Product';
import Image from 'next/image';
import Link from 'next/link';
import { DjangoProductDataSource } from '../../data/datasources/DjangoProductDataSource';

interface HomeProps {
    featured?: Product[];
}

export default function Home({ featured = [] }: HomeProps) {
    const [storeImages, setStoreImages] = useState<string[]>([]);
    const [displayBrands, setDisplayBrands] = useState<any[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
            const dataSource = new DjangoProductDataSource();
            try {
                // Fetch Home Banners
                const banners = await dataSource.getBanners('home');
                if (banners.length > 0) {
                    setStoreImages(banners.map(b => b.image));
                }

                // Fetch All Brands
                const brands = await dataSource.getAllBrands();
                setDisplayBrands(brands.map(b => ({
                    name: b.data.name,
                    image: b.data.cover || b.data.logo || '/images/placeholder.jpg',
                    link: `/brand/${b.id}`
                })));
            } catch (error) {
                console.error('Failed to fetch home data:', error);
            }
        };
        fetchData();
    }, []);

    const latestDrops = featured;
    const mostViewed = [...featured].reverse();

    const latestRef = useRef<HTMLDivElement>(null);
    const viewedRef = useRef<HTMLDivElement>(null);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && storeImages.length > 0) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % storeImages.length);
            }, 10000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, storeImages.length]);

    const handleNextSlide = () => setCurrentSlide((prev) => (prev + 1) % storeImages.length);
    const handlePrevSlide = () => setCurrentSlide((prev) => (prev - 1 + storeImages.length) % storeImages.length);
    const togglePlay = () => setIsPlaying(!isPlaying);

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
        if (ref.current) {
            const scrollAmount = 400; 
            ref.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <main className="min-h-screen bg-[var(--bg)] font-sans text-[var(--text)]">

            <HeroSection />

            <section className="w-full bg-[var(--bg)] pt-16 pb-16 md:pt-24 md:pb-24 border-b border-[var(--border-color)]">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8">
                    <div className="flex flex-row items-center justify-between w-full overflow-x-auto whitespace-nowrap gap-6 md:gap-12 scrollbar-hide">
                        <div className="flex flex-col items-center justify-center text-center flex-1">
                            <h3 className="text-[13px] md:text-[15px] font-bold text-[var(--text)] mb-1 font-sans tracking-snug">LIVRAISON</h3>
                            <p className="text-[12px] md:text-[14px] text-black font-bold">69 Wilaya disponible</p>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center flex-1">
                            <h3 className="text-[13px] md:text-[15px] font-bold text-[var(--text)] mb-1 font-sans tracking-snug">Exclusive Items</h3>
                            <p className="text-[12px] md:text-[14px] text-black font-bold">Only on our website</p>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center flex-1">
                            <h3 className="text-[13px] md:text-[15px] font-bold text-[var(--text)] mb-1 font-sans tracking-snug">Online Support</h3>
                            <p className="text-[12px] md:text-[14px] text-black font-bold">Serving you via WhatsApp</p>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center flex-1">
                            <h3 className="text-[13px] md:text-[15px] font-bold text-[var(--text)] mb-1 font-sans tracking-snug">100% Authentic</h3>
                            <p className="text-[12px] md:text-[14px] text-black font-bold">Authentic Verified Guaranteed</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto mt-[120px] lg:mt-[250px] mb-20 lg:mb-32 px-4 md:px-8">
                <h2 className="mb-[60px] lg:mb-[80px] px-2 text-center md:text-left">
                    <span 
                        className="text-[36px] md:text-[48px] lg:text-[56px] uppercase tracking-wide"
                        style={{ color: '#000', fontWeight: 700, fontFamily: 'var(--font-serif)' }}
                    >
                        LATEST DROPS (EXCLUSIVE)
                    </span>
                </h2>

                <div
                    ref={latestRef}
                    className="flex overflow-x-auto gap-20 md:gap-32 pb-4 snap-x scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <style dangerouslySetInnerHTML={{ __html: `::-webkit-scrollbar { display: none; }` }} />

                    {latestDrops.map((product) => (
                        <div key={`latest-${product.id}`} className="snap-start">
                            <ProductCard product={product} />
                        </div>
                    ))}
                    {latestDrops.length === 0 && (
                        <div className="text-gray-400 p-4 w-full text-center">No latest items.</div>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center mt-6 lg:mt-10">
                    <div className="flex items-center gap-6 text-gray-500 text-[15px] font-bold mb-6">
                        <button onClick={() => scroll(latestRef, 'left')} className="text-gray-400 hover:text-gray-800 transition-colors px-2">&lt;</button>
                        <span>1 - {latestDrops.length} items</span>
                        <button onClick={() => scroll(latestRef, 'right')} className="hover:text-gray-800 transition-colors px-2">&gt;</button>
                    </div>
                    <Link href="/latest-drops" className="inline-flex items-center justify-center border border-[var(--text)] bg-[var(--text)] px-10 md:px-16 py-3 md:py-4 text-[16px] font-semibold text-[var(--bg)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-colors duration-300">
                        View all
                    </Link>
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto pt-[120px] lg:pt-[200px] pb-20 lg:pb-32 px-4 md:px-8">
                <h2 
                    className="text-[36px] md:text-[48px] lg:text-[56px] mb-[60px] lg:mb-[80px] px-2 uppercase tracking-wide text-center md:text-left"
                    style={{ color: '#000', fontWeight: 700, fontFamily: 'var(--font-serif)' }}
                >
                    MOST VIEWED PRODUCTS
                </h2>

                <div
                    ref={viewedRef}
                    className="flex overflow-x-auto gap-20 md:gap-32 pb-4 snap-x scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {mostViewed.map((product) => (
                        <div key={`viewed-${product.id}`} className="snap-start">
                            <ProductCard product={product} pricePrefix="From " />
                        </div>
                    ))}
                    {mostViewed.length === 0 && (
                        <div className="text-gray-400 p-4 w-full text-center">No viewed items.</div>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center mt-6 lg:mt-10">
                    <div className="flex items-center gap-6 text-gray-500 text-[15px] font-bold mb-6">
                        <button onClick={() => scroll(viewedRef, 'left')} className="text-gray-400 hover:text-gray-800 transition-colors px-2">&lt;</button>
                        <span>1 - {mostViewed.length} items</span>
                        <button onClick={() => scroll(viewedRef, 'right')} className="hover:text-gray-800 transition-colors px-2">&gt;</button>
                    </div>
                    <Link href="/most-viewed" className="inline-flex items-center justify-center border border-[var(--text)] bg-[var(--text)] px-10 md:px-16 py-3 md:py-4 text-[16px] font-semibold text-[var(--bg)] hover:bg-[var(--bg)] hover:text-[var(--text)] transition-colors duration-300">
                        View all
                    </Link>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 pt-[120px] lg:pt-[200px] pb-20 lg:pb-32">
                <h2
                    className="text-[36px] md:text-[48px] lg:text-[56px] mb-[100px] lg:mb-[140px] px-2 uppercase tracking-wide text-center"
                    style={{ color: '#000', fontWeight: 700, fontFamily: 'var(--font-serif)' }}
                >
                    BRANDS
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
                    {displayBrands.map((brand, idx) => (
                        <Link key={idx} href={brand.link} className="flex flex-col items-center w-full group">
                            <div className="w-[85%] md:w-[85%] lg:w-[80%] aspect-square bg-[var(--surface)] relative overflow-hidden mb-5 flex items-center justify-center rounded-sm shadow-sm ring-1 ring-[var(--border-color)]">
                                <Image
                                    src={brand.image}
                                    alt={brand.name}
                                    fill
                                    unoptimized
                                    className="object-cover relative z-10 group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                            <div className="flex items-center mt-3 px-1 text-center">
                                <span className="font-black text-[18px] md:text-[22px] text-[var(--text)] group-hover:underline uppercase tracking-wide">
                                    {brand.name} <span className="text-gray-400 text-[18px] ml-1">&rarr;</span>
                                </span>
                            </div>
                        </Link>
                    ))}
                    {displayBrands.length === 0 && (
                        <div className="col-span-full text-center text-gray-400">No brands found.</div>
                    )}
                </div>
            </section>

            {storeImages.length > 0 && (
                <section className="w-full relative mt-[80px] md:mt-[150px] lg:mt-[250px] mb-[80px] md:mb-[150px] lg:mb-[200px]">
                    <div className="relative w-full overflow-hidden h-[70vh] md:h-[95vh] lg:h-[100vh] bg-gray-100">
                        {storeImages.map((src, idx) => (
                            <Image
                                key={idx}
                                src={src}
                                alt={`Banner ${idx + 1}`}
                                fill
                                unoptimized
                                className={`object-cover transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="flex items-center justify-center mt-8">
                        <div className="flex items-center gap-6">
                            <button onClick={handlePrevSlide} className="text-gray-600 hover:text-black transition-colors p-2 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>

                            <div className="flex gap-4 items-center px-2">
                                {storeImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentSlide(idx)}
                                        className={`w-[10px] h-[10px] rounded-full transition-all ${idx === currentSlide ? 'bg-black' : 'bg-transparent border border-gray-500'}`}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                ))}
                            </div>

                            <button onClick={handleNextSlide} className="text-gray-600 hover:text-black transition-colors p-2 flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>

                            <div className="w-[1px] h-8 bg-gray-200 ml-4 mr-2"></div>

                            <button onClick={togglePlay} className="text-gray-600 hover:text-black transition-colors p-2 flex items-center justify-center">
                                {isPlaying ? (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                                ) : (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                )}
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <section className="max-w-[1400px] mx-auto py-16 px-4 md:px-8 mt-24 lg:mt-32 text-center mb-16">
                <p className="text-[14px] uppercase tracking-widest mb-2" style={{ fontWeight: 300, color: '#000' }}>vous êtes les bienvenus chez nous</p>
                <h2
                    className="text-[36px] md:text-[48px] lg:text-[56px] uppercase tracking-wide mb-4"
                    style={{ color: '#000', fontWeight: 700, fontFamily: 'var(--font-serif)' }}
                >
                    URBAN DRIP LOCALISATION
                </h2>
                <p className="text-[15px] mb-10 max-w-2xl mx-auto" style={{ fontWeight: 300, color: '#000' }}>
                    Veuillez cliquer sur le plan pour vous rendre directement au point de vente.
                </p>

                <a
                    href="https://maps.app.goo.gl/jnapEgQsn9irgpPf6?g_st=atm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full max-w-4xl mx-auto h-[250px] md:h-[350px] relative pointer-events-auto overflow-hidden rounded-sm shadow-md border border-gray-200"
                >
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3198.71884399222!2d2.6936!3d36.6425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fa6eb4df57bbb%3A0xc3cdfb90b1ecdd5!2sBou%20Ismail%2C%20Tipaza%20Province%2C%20Algeria!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="filter grayscale-[50%] contrast-[1.1] opacity-90 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                    ></iframe>
                </a>
            </section>

        </main>
    );
}
