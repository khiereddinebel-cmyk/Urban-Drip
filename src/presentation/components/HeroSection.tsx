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
            <section className="w-full bg-[var(--bg)] flex flex-col items-center overflow-hidden border-b border-[var(--border-color)]">
                {/* Banner Image */}
                <div className="w-full">
                    <img
                        src="/images/home page hero banner.jpg"
                        className="w-full h-auto object-cover max-h-[85vh]"
                        alt="Urban Drip Sneaker Collection"
                    />
                </div>

                {/* Clear Text Content Below Banner */}
                <div className="w-full text-center text-[var(--text)] py-16 px-4 flex flex-col items-center max-w-4xl mx-auto">
                    <h1
                        className="text-5xl md:text-7xl font-black tracking-widest uppercase mb-4"
                        style={{ fontFamily: 'var(--font-serif)', lineHeight: 1 }}
                    >
                        URBAN DRIP
                    </h1>
                </div>
            </section>
        );
    }

    const currentSlide = slides[currentSlideIndex];

    return (
        <section className="w-full bg-[var(--bg)] flex flex-col items-center overflow-hidden border-b border-[var(--border-color)] relative">
            {/* Banner Image wrapper with fade effect */}
            <div className="w-full relative min-h-[50vh] md:min-h-[70vh] flex items-center justify-center bg-black overflow-hidden" style={{ width: '100%' }}>
                {slides.map((slide, index) => (
                    <picture key={slide.id} style={{
                        position: index === currentSlideIndex ? 'relative' : 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: index === currentSlideIndex ? 1 : 0,
                        transition: 'opacity 0.8s ease-in-out',
                        zIndex: index === currentSlideIndex ? 1 : 0
                    }}>
                        {slide.mobile_image && <source media="(max-width: 768px)" srcSet={slide.mobile_image} />}
                        <img
                            src={slide.image}
                            className="w-full h-full object-cover max-h-[85vh]"
                            alt={slide.title}
                            style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
                        />
                    </picture>
                ))}
                
                {/* Navigation Arrows */}
                {slides.length > 1 && (
                    <>
                        <button
                            onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
                            style={{
                                position: 'absolute',
                                left: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: 'rgba(255,255,255,0.7)',
                                border: 'none',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}
                        >
                            &#10094;
                        </button>
                        <button
                            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
                            style={{
                                position: 'absolute',
                                right: '20px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                zIndex: 10,
                                background: 'rgba(255,255,255,0.7)',
                                border: 'none',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}
                        >
                            &#10095;
                        </button>
                    </>
                )}
            </div>

            {/* Clear Text Content Below Banner */}
            <div className="w-full text-center text-[var(--text)] py-16 px-4 flex flex-col items-center max-w-4xl mx-auto">
                <h1
                    className="text-5xl md:text-7xl font-black tracking-widest uppercase mb-4"
                    style={{ fontFamily: 'var(--font-serif)', lineHeight: 1 }}
                >
                    {currentSlide.title}
                </h1>
            </div>

            {/* Slider Dots Indicator */}
            {slides.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', position: 'absolute', bottom: '230px', zIndex: 10 }}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlideIndex(index)}
                            style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                border: 'none',
                                background: index === currentSlideIndex ? 'var(--text)' : 'rgba(0,0,0,0.3)',
                                cursor: 'pointer',
                                padding: 0
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
