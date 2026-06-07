'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { getProductImageUrl } from '../../shared/utils/imageUtils';

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images = [] }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [fsZoomed, setFsZoomed] = useState(false);
    const [fsPan, setFsPan] = useState({ x: 0, y: 0 });
    const mainImageRef = useRef<HTMLDivElement>(null);
    const touchStart = useRef<number | null>(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    // Map each image path to use the API URL prefix helper to fix broken images
    const galleryImages = (images && images.length > 0) 
        ? images.map(img => getProductImageUrl(img)) 
        : ['/images/placeholder.jpg'];

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
        <div className="flex flex-col md:flex-row gap-5 w-full">
            {/* Thumbnails list */}
            {galleryImages.length > 1 && (
                <div 
                    className="flex flex-row md:flex-col gap-3 w-full md:w-[85px] pb-2 md:pb-0 order-last md:order-first shrink-0"
                    style={{
                        scrollbarWidth: 'thin',
                        msOverflowStyle: 'none',
                    }}
                >
                    {galleryImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => { setActiveImage(idx); }}
                            className={`relative flex-1 aspect-square md:w-[85px] md:h-[85px] md:flex-initial rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border ${
                                activeImage === idx ? 'border-black' : 'border-gray-200 hover:border-gray-400'
                            }`}
                        >
                            <Image 
                                src={img} 
                                alt={`Thumbnail ${idx + 1}`} 
                                fill 
                                className="object-cover p-1" 
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Main Image Container */}
            <div
                ref={mainImageRef}
                className="relative w-full max-w-[500px] aspect-[4/5] md:aspect-square bg-white overflow-hidden flex items-center justify-center touch-pan-y flex-1 order-first md:order-last group cursor-pointer mx-auto"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={() => {
                    setIsFullscreen(true);
                }}
            >
                {/* Navigation Arrows */}
                <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-black border-none cursor-pointer flex items-center justify-center hover:opacity-75 transition-opacity"
                    style={{ background: 'transparent', padding: '12px' }}
                    aria-label="Previous image"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-black border-none cursor-pointer flex items-center justify-center hover:opacity-75 transition-opacity"
                    style={{ background: 'transparent', padding: '12px' }}
                    aria-label="Next image"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" transform="rotate(180 12 12)" /></svg>
                </button>

                {/* Expand / Fullscreen Button (Bottom-Left Circle) */}
                <button
                    onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
                    className="absolute left-4 bottom-4 z-10 bg-white text-black border-none rounded-full w-10 h-10 cursor-pointer flex items-center justify-center shadow-md transition-colors duration-200"
                    aria-label="Fullscreen zoom"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                    </svg>
                </button>

                {/* Dot pagination indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {galleryImages.map((_, idx) => (
                        <span
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                activeImage === idx ? 'bg-white scale-125' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>

                {/* Active Image (No hover zoom) */}
                <div className="relative w-full h-full p-4">
                    <Image
                        src={galleryImages[activeImage]}
                        alt="Product Image"
                        fill
                        className="object-contain p-2"
                        priority
                        unoptimized
                    />
                </div>
            </div>

            {/* Fullscreen Responsive Lightbox Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 bg-black/95 z-[99999] flex items-center justify-center touch-none">
                    {/* Header Controls */}
                    <div className="absolute top-5 right-5 z-[100000] flex gap-5">
                        {/* Zoom Toggle */}
                        <button 
                            onClick={() => {
                                setFsZoomed(!fsZoomed);
                                setFsPan({ x: 0, y: 0 });
                            }}
                            className="bg-transparent border-none text-white cursor-pointer hover:opacity-80 transition-opacity"
                            aria-label="Toggle zoom"
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
                            className="bg-transparent border-none text-white cursor-pointer hover:opacity-80 transition-opacity"
                            aria-label="Close details"
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
                        className="absolute left-5 z-[100000] text-white bg-white/10 hover:bg-white/20 border-none rounded-full w-12 h-12 cursor-pointer flex items-center justify-center transition-colors"
                        aria-label="Previous"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>

                    {/* Right arrow */}
                    <button
                        onClick={nextImage}
                        className="absolute right-5 z-[100000] text-white bg-white/10 hover:bg-white/20 border-none rounded-full w-12 h-12 cursor-pointer flex items-center justify-center transition-colors"
                        aria-label="Next"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M9 18l6-6-6-6" transform="rotate(180 12 12)" /></svg>
                    </button>

                    {/* Image viewport */}
                    <div 
                        className="relative w-[90%] h-[90%] flex items-center justify-center overflow-hidden"
                        style={{ 
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
                        <div 
                            className="relative w-full h-full flex items-center justify-center"
                            style={{
                                transform: `translate(${fsPan.x}px, ${fsPan.y}px) scale(${fsZoomed ? 2.5 : 1})`,
                                transition: isDragging.current ? 'none' : 'transform 0.25s ease-out',
                            }}
                        >
                            <img
                                src={galleryImages[activeImage]}
                                alt="Zoomed Product View"
                                className="max-w-full max-h-full object-contain select-none pointer-events-none"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
