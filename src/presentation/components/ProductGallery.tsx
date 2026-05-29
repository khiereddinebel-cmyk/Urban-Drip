'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images = [] }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fsZoomed, setFsZoomed] = useState(false);
    const [fsPan, setFsPan] = useState({ x: 0, y: 0 });
    const mainImageRef = useRef<HTMLDivElement>(null);
    const touchStart = useRef<number | null>(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // Fallback if images array is empty or undefined
    const galleryImages = images.length > 0 ? images : ['/images/placeholder.jpg'];

    const nextImage = () => setActiveImage((prev) => (prev + 1) % galleryImages.length);
    const prevImage = () => setActiveImage((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

    // Mobile swipe handling
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStart.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStart.current === null) return;
        const diff = touchStart.current - e.changedTouches[0].clientX;
        if (diff > 50) {
            nextImage();
        } else if (diff < -50) {
            prevImage();
        }
        touchStart.current = null;
    };

    // Desktop magnifier move
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isZoomed || !mainImageRef.current) return;
        const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y });
    };

    // Drag-to-pan in fullscreen zoomed mode
    const handleFsMouseDown = (e: React.MouseEvent) => {
        if (!fsZoomed) return;
        isDragging.current = true;
        dragStart.current = { x: e.clientX - fsPan.x, y: e.clientY - fsPan.y };
    };

    const handleFsMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        setFsPan({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y
        });
    };

    const handleFsMouseUp = () => {
        isDragging.current = false;
    };

    // Escape key closes fullscreen
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsFullscreen(false);
                setFsZoomed(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
            {/* Main Image Container */}
            <div
                ref={mainImageRef}
                style={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    backgroundColor: '#f6f6f6',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'pan-y'
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setIsZoomed(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={() => {
                    // Check if mobile (width < 768)
                    if (window.innerWidth < 768) {
                        setIsFullscreen(true);
                    } else {
                        setIsZoomed(!isZoomed);
                    }
                }}
            >
                {/* Navigation Arrows (Desktop overlay / Mobile hidden) */}
                <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    style={{
                        position: 'absolute',
                        left: '15px',
                        zIndex: 10,
                        background: 'rgba(255,255,255,0.85)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                        transition: 'opacity 0.2s'
                    }}
                    className="hover:opacity-80"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    style={{
                        position: 'absolute',
                        right: '15px',
                        zIndex: 10,
                        background: 'rgba(255,255,255,0.85)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                        transition: 'opacity 0.2s'
                    }}
                    className="hover:opacity-80"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" transform="rotate(180 12 12)" /></svg>
                </button>

                {/* Expand / Fullscreen Button (Bottom-Left) */}
                <button
                    onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
                    style={{
                        position: 'absolute',
                        left: '20px',
                        bottom: '20px',
                        zIndex: 10,
                        background: 'rgba(255,255,255,0.9)',
                        border: 'none',
                        borderRadius: '8px',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    aria-label="Fullscreen zoom"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                </button>

                <Image
                    src={galleryImages[activeImage]}
                    alt="Product Image"
                    fill
                    style={{ objectFit: 'contain', padding: '15px' }}
                    priority
                />

                {/* Desktop Magnifier Zoom Overlay */}
                {isZoomed && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${galleryImages[activeImage]})`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundSize: '220%',
                        backgroundRepeat: 'no-repeat',
                        pointerEvents: 'none',
                        zIndex: 20
                    }} />
                )}
            </div>

            {/* Thumbnails list */}
            {galleryImages.length > 1 && (
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }} className="custom-scrollbar">
                    {galleryImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setActiveImage(idx); setIsZoomed(false); }}
                            style={{
                                position: 'relative',
                                minWidth: '70px',
                                height: '70px',
                                borderRadius: '8px',
                                border: activeImage === idx ? '2.5px solid #222' : '1px solid #ddd',
                                overflow: 'hidden',
                                flexShrink: 0,
                                padding: 0,
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                            }}
                        >
                            <Image src={img} alt="Thumbnail Image" fill style={{ objectFit: 'cover' }} />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Responsive Modal */}
            {isFullscreen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.95)',
                    zIndex: 99999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    touchAction: 'none'
                }}>
                    {/* Header Controls */}
                    <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100000, display: 'flex', gap: '20px' }}>
                        {/* Zoom Indicator/Toggle */}
                        <button 
                            onClick={() => {
                                setFsZoomed(!fsZoomed);
                                setFsPan({ x: 0, y: 0 });
                            }}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                <line x1="11" y1="8" x2="11" y2="14"></line>
                                <line x1="8" y1="11" x2="14" y2="11"></line>
                            </svg>
                        </button>
                        {/* Close button */}
                        <button 
                            onClick={() => {
                                setIsFullscreen(false);
                                setFsZoomed(false);
                            }}
                            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Left arrow */}
                    <button
                        onClick={prevImage}
                        style={{ position: 'absolute', left: '20px', zIndex: 100000, color: 'white', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>

                    {/* Right arrow */}
                    <button
                        onClick={nextImage}
                        style={{ position: 'absolute', right: '20px', zIndex: 100000, color: 'white', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6" transform="rotate(180 12 12)" /></svg>
                    </button>

                    {/* Image viewport */}
                    <div 
                        style={{ 
                            position: 'relative', 
                            width: '90%', 
                            height: '90%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            overflow: 'hidden',
                            cursor: fsZoomed ? 'grab' : 'zoom-in'
                        }}
                        onMouseDown={handleFsMouseDown}
                        onMouseMove={handleFsMouseMove}
                        onMouseUp={handleFsMouseUp}
                        onMouseLeave={handleFsMouseUp}
                        onClick={() => {
                            if (!fsZoomed) {
                                setFsZoomed(true);
                            } else if (!isDragging.current) {
                                setFsZoomed(false);
                                setFsPan({ x: 0, y: 0 });
                            }
                        }}
                    >
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            transform: `translate(${fsPan.x}px, ${fsPan.y}px) scale(${fsZoomed ? 2.5 : 1})`,
                            transition: isDragging.current ? 'none' : 'transform 0.25s ease-out',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={galleryImages[activeImage]}
                                alt="Zoomed Product View"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    userSelect: 'none',
                                    pointerEvents: 'none'
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
