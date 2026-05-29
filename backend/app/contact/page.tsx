'use client';

import React from 'react';

const ContactSection = () => {
    const contactLinks = {
        whatsapp1: "https://wa.me/213542296445?text=Hello%20Urban%20Drip%20I%20want%20to%20order",
        whatsapp2: "https://wa.me/213550340944?text=Hello%20Urban%20Drip%20I%20want%20to%20order",
        instagram: "https://www.instagram.com/urbandrip.dz?igsh=aGh4cnh4ZDV2Zjcz"
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-20 animate-fade-in flex flex-col items-center">
            {/* Header section */}
            <div className="text-center mb-20 md:mb-24">
                <h1 className="text-5xl md:text-6xl font-serif text-black mb-6 tracking-tight uppercase italic font-black">
                    Contact Us
                </h1>
                <p className="text-gray-400 text-xl tracking-widest uppercase font-light">
                    Reach our support team instantly
                </p>
            </div>

            {/* Contact Bars Container */}
            <div className="w-full space-y-10 md:space-y-12 mb-40">
                
                {/* 1. WhatsApp Bar 1 */}
                <a
                    href={contactLinks.whatsapp1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-full bg-white border-[3px] border-[#25D366] rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(37,211,102,0.3)] min-h-[100px] shadow-sm"
                >
                    <div className="absolute left-6 md:left-8 transition-transform duration-500 group-hover:rotate-12 opacity-80 group-hover:opacity-100">
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                    </div>
                    <div className="flex flex-col items-center text-center px-4">
                        <span className="text-[#25D366] text-xs font-bold uppercase tracking-[0.2em] mb-1">WhatsApp Support 1</span>
                        <span className="text-black text-xl md:text-2xl font-black uppercase italic tracking-wider leading-none">+213 542296445</span>
                    </div>
                </a>

                {/* 2. WhatsApp Bar 2 */}
                <a
                    href={contactLinks.whatsapp2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-full bg-white border-[3px] border-[#128C7E] rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(18,140,126,0.3)] min-h-[100px] shadow-sm"
                >
                    <div className="absolute left-6 md:left-8 transition-transform duration-500 group-hover:-rotate-12 opacity-80 group-hover:opacity-100">
                        <svg className="w-8 h-8 md:w-10 md:h-10 text-[#128C7E]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                    </div>
                    <div className="flex flex-col items-center text-center px-4">
                        <span className="text-[#128C7E] text-xs font-bold uppercase tracking-[0.2em] mb-1">WhatsApp Support 2</span>
                        <span className="text-black text-xl md:text-2xl font-black uppercase italic tracking-wider leading-none">+213 550340944</span>
                    </div>
                </a>

                {/* 3. Instagram Bar */}
                <a
                    href={contactLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center justify-center w-full bg-white border-[3px] border-[#E1306C] rounded-full overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_40px_-15px_rgba(225,48,108,0.3)] min-h-[100px] shadow-sm"
                >
                    <div className="absolute left-6 md:left-8 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308 1.102 1.102 1.353 2.5 1.43 4.156.014.316.02.73.02 1.63 0 5.353-.25 7.625-2.28 9.655-2.03 2.03-4.302 2.28-9.655 2.28-3.204 0-3.584-.012-4.85-.07-1.366-.062-2.633-.332-3.608-1.308C.423 18.783.172 17.385.095 15.728c-.014-.316-.02-.73-.02-1.63 0-5.353.25-7.625 2.28-9.655C4.385 2.41 6.657 2.16 12 2.16zM12 0C6.74 0 6.082.022 4.015.117 1.95.213.31 1.25.04 3.03.015 3.32 0 4.04 0 5.82c0 5.68 0 6.13.117 8.015.096 2.065 1.133 3.705 2.913 3.977.29.025 1.01.04 2.79.04 5.68 0 6.13 0 8.015-.117 2.065-.096 3.705-1.133 3.977-2.913.025-.29.04-1.01.04-2.79 0-5.68 0-6.13-.117-8.015-.096-2.065-1.133-3.705-2.913-3.977-.29-.025-1.01-.04-2.79-.04C17.918 0 17.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zM18.406 4.132a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
                        </svg>
                    </div>
                    <div className="flex flex-col items-center text-center px-4">
                        <span className="text-[#E1306C] text-xs font-bold uppercase tracking-[0.2em] mb-1">Instagram Private Message</span>
                        <span className="text-black text-xl md:text-2xl font-black uppercase italic tracking-wider leading-none">@urbandrip.dz</span>
                    </div>
                </a>
            </div>

            {/* Footer space */}
            <div className="w-full max-w-lg mx-auto text-center flex flex-col items-center space-y-10">
                <div className="inline-flex items-center gap-3 px-10 py-4 bg-green-50 text-green-700 font-bold rounded-full border-2 border-green-200 shadow-sm">
                   <span className="text-2xl">⚡</span>
                   <span className="uppercase tracking-[0.2em] text-sm font-black italic">We usually reply within a few minutes</span>
                </div>
                
                <div className="flex flex-col items-center gap-4">
                    <p className="text-black text-lg md:text-xl font-black uppercase tracking-[0.4em] mb-2 leading-none">Need help immediately?</p>
                    <div className="h-[2px] w-16 bg-black/10 rounded-full mb-2"></div>
                    <p className="text-black text-sm md:text-base font-bold tracking-[0.2em] uppercase leading-relaxed max-w-md">
                        If one number doesn't respond, <br/> 
                        try the other one.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function Page() {
    return (
        <div className="w-full bg-white text-black min-h-screen pt-32 pb-24 px-4 md:px-8">
            <ContactSection />
        </div>
    );
}
