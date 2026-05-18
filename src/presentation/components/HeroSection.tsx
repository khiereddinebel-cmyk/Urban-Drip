import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
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
                <p
                    className="text-sm md:text-lg font-black tracking-[4px] uppercase mb-10 text-black"
                    style={{ fontFamily: 'var(--font-sans)', maxWidth: '600px' }}
                >
                    Exclusive Sneakers & Streetwear
                </p>
                <Link href="/category/sneakers">
                    <button
                        className="bg-[var(--text)] text-[var(--bg)] px-12 py-4 text-sm font-bold uppercase tracking-[3px] transition-all border border-[var(--text)] hover:bg-[var(--bg)] hover:text-[var(--text)]"
                        style={{ fontFamily: 'var(--font-sans)' }}
                    >
                        Shop Now
                    </button>
                </Link>
            </div>
        </section>
    );
}
