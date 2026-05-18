'use client';

import React from 'react';

const ContactSection = () => {
    const contactOptions = [
        {
            id: 1,
            title: "WhatsApp Support 1",
            description: "Fast reply within minutes",
            buttonText: "Chat on WhatsApp",
            link: "https://wa.me/213542296445?text=Hello%20Urban%20Drip%20I%20want%20to%20order",
            icon: (
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
            )
        },
        {
            id: 2,
            title: "WhatsApp Support 2",
            description: "Alternative number if first is busy",
            buttonText: "Chat on WhatsApp",
            link: "https://wa.me/213550340944?text=Hello%20Urban%20Drip%20I%20want%20to%20order",
            icon: (
                <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
            )
        },
        {
            id: 3,
            title: "Instagram",
            description: "DM us anytime",
            buttonText: "Message us on Instagram",
            link: "https://www.instagram.com/urbandrip.dz?igsh=aGh4cnh4ZDV2Zjcz",
            icon: (
                <svg className="w-8 h-8 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308 1.102 1.102 1.353 2.5 1.43 4.156.014.316.02.73.02 1.63 0 5.353-.25 7.625-2.28 9.655-2.03 2.03-4.302 2.28-9.655 2.28-3.204 0-3.584-.012-4.85-.07-1.366-.062-2.633-.332-3.608-1.308C.423 18.783.172 17.385.095 15.728c-.014-.316-.02-.73-.02-1.63 0-5.353.25-7.625 2.28-9.655C4.385 2.41 6.657 2.16 12 2.16zM12 0C6.74 0 6.082.022 4.015.117 1.95.213.31 1.25.04 3.03.015 3.32 0 4.04 0 5.82c0 5.68 0 6.13.117 8.015.096 2.065 1.133 3.705 2.913 3.977.29.025 1.01.04 2.79.04 5.68 0 6.13 0 8.015-.117 2.065-.096 3.705-1.133 3.977-2.913.025-.29.04-1.01.04-2.79 0-5.68 0-6.13-.117-8.015-.096-2.065-1.133-3.705-2.913-3.977-.29-.025-1.01-.04-2.79-.04C17.918 0 17.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zM18.406 4.132a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
                </svg>
            )
        }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto px-4 py-16 animate-fade-in">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-serif text-black mb-4 tracking-tight uppercase italic">
                    Contact Us
                </h2>
                <p className="text-gray-600 text-lg">
                    Choose your preferred way to contact us
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {contactOptions.map((option) => (
                    <a
                        key={option.id}
                        href={option.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative bg-white border-2 border-black p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                    >
                        <div className="mb-6 p-4 bg-gray-50 rounded-full group-hover:scale-110 transition-transform duration-300">
                            {option.icon}
                        </div>
                        <h3 className="text-xl font-bold text-black mb-2 uppercase">
                            {option.title}
                        </h3>
                        <p className="text-gray-600 mb-8 max-w-[200px]">
                            {option.description}
                        </p>
                        <div className="mt-auto w-full py-3 px-6 bg-black text-white font-bold uppercase tracking-wider text-sm transition-colors duration-300 group-hover:bg-gray-800">
                            {option.buttonText}
                        </div>
                    </a>
                ))}
            </div>

            <div className="mt-20 text-center space-y-4">
                <p className="inline-block px-6 py-2 bg-green-50 text-green-700 font-medium rounded-full border border-green-200">
                   ⚡ We usually reply within a few minutes
                </p>
                <div className="flex flex-col items-center text-gray-500 text-sm">
                    <p>If one number doesn't respond, try the other</p>
                </div>
            </div>
        </div>
    );
};

export default ContactSection;
