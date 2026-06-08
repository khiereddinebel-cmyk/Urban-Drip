'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Slide {
    id: number;
    title: string;
    subtitle?: string;
    image: string;
    mobile_image?: string;
    button_text?: string;
    button_link?: string;
}

export default function HeroSection() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/hero-sliders/`);
                if (res.ok) {
                    const data = await res.json();
                    const activeSlides = data.results || data;
                    if (Array.isArray(activeSlides)) {
                        setSlides(activeSlides);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch hero slides:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    // Auto-cycle slides every 5 seconds
    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides]);

    if (loading) {
        return (
            <div style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)' }}>
                <span style={{ fontSize: '14px', letterSpacing: '2px', fontWeight: 'bold' }}>LOADING SNEAKER COLLECTION...</span>
            </div>
        );
    }

    // Fallback if no slides exist
    if (slides.length === 0) {
        return (
            <section style={{ width: '100%', height: '100vh', minHeight: '500px', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
                {/* Banner Image wrapper */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                    <img
                        src="/images/home page hero banner.jpg"
                        alt="Urban Drip Sneaker Collection"
                        style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            objectPosition: 'center', 
                            display: 'block' 
                        }}
                    />
                </div>

                {/* Dark Overlay */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.45)',
                    zIndex: 2,
                    pointerEvents: 'none'
                }} />

                {/* Centered Content Container */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    padding: '24px',
                    textAlign: 'center',
                    color: '#ffffff',
                    pointerEvents: 'none'
                }}>
                    <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', width: '100%' }}>
                        {/* Main Title */}
                        <h1 style={{
                            fontFamily: 'var(--font-serif)',
                            fontWeight: 900,
                            textTransform: 'uppercase',
                            letterSpacing: '0.15em',
                            lineHeight: 1.1,
                            color: '#ffffff',
                            margin: '0 0 16px 0',
                        }} className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                            URBAN DRIP
                        </h1>

                        {/* Subtitle */}
                        <p style={{
                            fontFamily: 'var(--font-serif)',
                            fontStyle: 'italic',
                            color: 'rgba(255, 255, 255, 0.95)',
                            margin: '0 0 32px 0',
                            fontWeight: 300,
                            letterSpacing: '0.05em'
                        }} className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px]">
                            Sneaker & Streetwear Culture
                        </p>

                        {/* CTA Button */}
                        <Link
                            href="/latest-drops"
                            style={{
                                backgroundColor: '#000000',
                                color: '#ffffff',
                                border: '1px solid rgba(255,255,255,0.4)',
                                padding: '14px 36px',
                                fontSize: '13px',
                                fontWeight: 700,
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                textDecoration: 'none',
                            }}
                            className="hover:bg-white hover:text-black hover:border-white"
                        >
                            EXPLORE NEW RELEASES 2026 &rarr;
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    const currentSlide = slides[currentSlideIndex];

    return (
        <section style={{ width: '100%', height: '100vh', minHeight: '500px', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
            {/* Banner Image wrapper */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
                {slides.map((slide, index) => (
                    <picture key={slide.id} style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: index === currentSlideIndex ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out',
                        zIndex: index === currentSlideIndex ? 1 : 0
                    }}>
                        {slide.mobile_image && <source media="(max-width: 768px)" srcSet={slide.mobile_image} />}
                        <img
                            src={slide.image}
                            alt={slide.title}
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                objectPosition: 'center', 
                                display: 'block' 
                            }}
                        />
                    </picture>
                ))}
            </div>

            {/* Dark Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                zIndex: 2,
                pointerEvents: 'none'
            }} />

            {/* Centered Content Container */}
            <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                padding: '24px',
                textAlign: 'center',
                color: '#ffffff',
                pointerEvents: 'none'
            }}>
                <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', width: '100%' }}>
                    {/* Main Title */}
                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        lineHeight: 1.1,
                        color: '#ffffff',
                        margin: '0 0 16px 0',
                    }} className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                        {currentSlide.title || "URBAN DRIP"}
                    </h1>

                    {/* Subtitle */}
                    <p style={{
                        fontFamily: 'var(--font-serif)',
                        fontStyle: 'italic',
                        color: 'rgba(255, 255, 255, 0.95)',
                        margin: '0 0 32px 0',
                        fontWeight: 300,
                        letterSpacing: '0.05em'
                    }} className="text-[16px] sm:text-[18px] md:text-[22px] lg:text-[26px]">
                        {currentSlide.subtitle || "Sneaker & Streetwear Culture"}
                    </p>

                    {/* CTA Button */}
                    <Link
                        href={currentSlide.button_link || "/latest-drops"}
                        style={{
                            backgroundColor: '#000000',
                            color: '#ffffff',
                            border: '1px solid rgba(255,255,255,0.4)',
                            padding: '14px 36px',
                            fontSize: '13px',
                            fontWeight: 700,
                            letterSpacing: '0.15em',
 textTransform: 'uppercase',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                            textDecoration: 'none',
                        }}
                        className="hover:bg-white hover:text-black hover:border-white"
                    >
                        {currentSlide.button_text || "EXPLORE NEW RELEASES 2026"} &rarr;
                    </Link>
                </div>
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                        style={{
                            position: 'absolute',
                            left: '24px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 20,
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            transition: 'all 0.3s'
                        }}
                        className="hover:bg-white hover:text-black hover:border-white hidden md:flex"
                        aria-label="Previous Slide"
                    >
                        &#10094;
                    </button>
                    <button
                        onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                        style={{
                            position: 'absolute',
                            right: '24px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 20,
                            background: 'rgba(0, 0, 0, 0.3)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#ffffff',
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            transition: 'all 0.3s'
                        }}
                        className="hover:bg-white hover:text-black hover:border-white hidden md:flex"
                        aria-label="Next Slide"
                    >
                        &#10095;
                    </button>
                </>
            )}

            {/* Slider Dots Indicator */}
            {slides.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 20 }}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlideIndex(index)}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                border: 'none',
                                background: index === currentSlideIndex ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'all 0.3s'
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );

}
