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
                // Fetch Carousel Images
                const carousel = await dataSource.getCarouselImages();
                if (carousel.length > 0) {
                    setStoreImages(carousel.map(c => c.image));
                } else {
                    // Fallback to banners if no carousel image is configured
                    const banners = await dataSource.getBanners('home');
                    if (banners.length > 0) {
                        setStoreImages(banners.map(b => b.image));
                    }
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


            <section className="max-w-[1400px] mx-auto mt-[120px] lg:mt-[200px] mb-20 lg:mb-32 px-4 md:px-8">
                <h2 className="mb-[40px] px-2 text-left">
                    <span 
                        className="text-[28px] md:text-[36px] lg:text-[42px]"
                        style={{ color: '#000', fontWeight: 700, fontFamily: 'var(--font-sans)' }}
                    >
                        Latest Drops
                    </span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-10">
                    {latestDrops.map((product) => (
                        <ProductCard key={`latest-${product.id}`} product={product} />
                    ))}
                </div>
                {latestDrops.length === 0 && (
                    <div className="text-gray-400 p-4 w-full text-center">No latest items.</div>
                )}

                <div className="flex flex-col items-center justify-center mt-12">
                    <Link href="/latest-drops" className="inline-flex items-center justify-center border border-black bg-black px-10 md:px-16 py-3 md:py-4 text-[14px] font-bold text-white hover:bg-white hover:text-black transition-colors duration-300">
                        View all
                    </Link>
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto pt-[100px] lg:pt-[150px] pb-20 lg:pb-32 px-4 md:px-8 border-t border-[var(--border-color)]">
                <h2 className="mb-[40px] px-2 text-left">
                    <span 
                        className="text-[28px] md:text-[36px] lg:text-[42px]"
                        style={{ color: '#000', fontWeight: 700, fontFamily: 'var(--font-sans)' }}
                    >
                        Most Viewed Products
                    </span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 md:gap-x-6 gap-y-10">
                    {mostViewed.map((product) => (
                        <ProductCard key={`viewed-${product.id}`} product={product} pricePrefix="From " />
                    ))}
                </div>
                {mostViewed.length === 0 && (
                    <div className="text-gray-400 p-4 w-full text-center">No viewed items.</div>
                )}

                <div className="flex flex-col items-center justify-center mt-12">
                    <Link href="/most-viewed" className="inline-flex items-center justify-center border border-black bg-black px-10 md:px-16 py-3 md:py-4 text-[14px] font-bold text-white hover:bg-white hover:text-black transition-colors duration-300">
                        View all
                    </Link>
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto px-4 pt-[100px] lg:pt-[150px] pb-20 lg:pb-32 border-t border-[var(--border-color)]">
                <h2 className="mb-[40px] px-2 text-left">
                    <span 
                        className="text-[28px] md:text-[36px] lg:text-[42px]"
                        style={{ color: '#000', fontWeight: 700, fontFamily: 'var(--font-sans)' }}
                    >
                        Brands
                    </span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10">
                    {displayBrands.map((brand, idx) => (
                        <Link key={idx} href={brand.link} className="flex flex-col items-start w-full group">
                            <div className="w-full aspect-square bg-white relative overflow-hidden mb-4 flex items-center justify-center">
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
                            <div className="flex items-center text-left mt-2 px-1">
                                <span className="font-bold text-[15px] md:text-[16px] text-[var(--text)] group-hover:underline uppercase tracking-normal">
                                    {brand.name} <span className="text-gray-400 text-[15px] ml-1">&rarr;</span>
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
