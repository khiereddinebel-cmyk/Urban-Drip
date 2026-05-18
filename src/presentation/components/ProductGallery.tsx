'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
    images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
    const [activeImage, setActiveImage] = useState(0);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
    const mainImageRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!mainImageRef.current) return;
        const { left, top, width, height } = mainImageRef.current.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPos({ x, y, show: true });
    };

    const nextImage = () => setActiveImage((prev) => (prev + 1) % images.length);
    const prevImage = () => setActiveImage((prev) => (prev - 1 + images.length) % images.length);

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
                    cursor: 'crosshair',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setZoomPos(prev => ({ ...prev, show: false }))}
            >
                {/* Navigation Arrows */}
                <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    style={{ position: 'absolute', left: '15px', zIndex: 10, background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    style={{ position: 'absolute', right: '15px', zIndex: 10, background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6 6-6" transform="rotate(180 12 12)" /></svg>
                </button>

                <Image
                    src={images[activeImage]}
                    alt="Product"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                />

                {/* Zoom Overlay */}
                {zoomPos.show && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${images[activeImage]})`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundSize: '200%',
                        pointerEvents: 'none',
                        zIndex: 20
                    }} />
                )}
            </div>

            {/* Thumbnails */}
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveImage(idx)}
                        style={{
                            position: 'relative',
                            minWidth: '70px',
                            height: '70px',
                            borderRadius: '8px',
                            border: activeImage === idx ? '2px solid #222' : '1px solid #ddd',
                            overflow: 'hidden',
                            flexShrink: 0,
                            padding: 0,
                            cursor: 'pointer'
                        }}
                    >
                        <Image src={img} alt="Thumbnail" fill style={{ objectFit: 'cover' }} />
                    </button>
                ))}
            </div>
        </div>
    );
}
