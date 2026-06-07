'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { getProductImageUrl } from '../../shared/utils/imageUtils';

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images = [] }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
    const mainImageRef = useRef<HTMLDivElement>(null);
    const touchStart = useRef<number | null>(null);

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

    const handleImageError = (imgUrl: string) => {
        setImageErrors(prev => ({ ...prev, [imgUrl]: true }));
    };

    const getImgSrc = (imgUrl: string) => {
        if (imageErrors[imgUrl]) {
            return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 100 100'><rect width='100%' height='100%' fill='%23f9f9f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='6' fill='%23bbbbbb'>IMAGE NOT AVAILABLE</text></svg>";
        }
        return imgUrl;
    };

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
                                src={getImgSrc(img)} 
                                alt={`Thumbnail ${idx + 1}`} 
                                fill 
                                className="object-cover p-1" 
                                unoptimized
                                onError={() => handleImageError(img)}
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Main Image Container */}
            <div
                ref={mainImageRef}
                className="relative w-full max-w-[500px] aspect-[4/5] md:aspect-square bg-white overflow-hidden flex items-center justify-center touch-pan-y flex-1 order-first md:order-last group mx-auto"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                {/* Navigation Arrows */}
                <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute z-10 border-none cursor-pointer flex items-center justify-center hover:opacity-90 transition-opacity"
                    style={{ 
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.45)', 
                        width: '32px', 
                        height: '52px',
                        borderRadius: '4px',
                        color: '#fff',
                        padding: 0
                    }}
                    aria-label="Previous image"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute z-10 border-none cursor-pointer flex items-center justify-center hover:opacity-90 transition-opacity"
                    style={{ 
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(0, 0, 0, 0.45)', 
                        width: '32px', 
                        height: '52px',
                        borderRadius: '4px',
                        color: '#fff',
                        padding: 0
                    }}
                    aria-label="Next image"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" transform="rotate(180 12 12)" /></svg>
                </button>

                {/* Dot pagination indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {galleryImages.map((_, idx) => (
                        <span
                            key={idx}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                activeImage === idx ? 'bg-gray-800 scale-125' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>

                {/* Active Image (No hover zoom) */}
                <div className="relative w-full h-full p-4">
                    <Image
                        src={getImgSrc(galleryImages[activeImage])}
                        alt="Product Image"
                        fill
                        className="object-contain p-2"
                        priority
                        unoptimized
                        onError={() => handleImageError(galleryImages[activeImage])}
                    />
                </div>
            </div>
        </div>
    );
}
