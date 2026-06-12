'use client';

import React from 'react';

export default function PrivacyPage() {
    return (
        <div dir="rtl" className="w-full max-w-3xl mx-auto px-6 py-16 md:py-24 animate-fade-in text-right">
            {/* Header section */}
            <div className="text-center mb-16 md:mb-20">
                <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                    🔒 حماية وخصوصية معلوماتك
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight leading-tight">
                    سرية معلوماتك
                </h1>
                <div className="h-[3px] w-20 bg-black mx-auto rounded-full"></div>
            </div>

            {/* Content Cards */}
            <div className="space-y-6 md:space-y-8">
                
                {/* 1. Collected Information */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">👤</span> واش نحتاجو منك
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        نحتاجو برك <strong className="text-black font-extrabold">اسمك، نمرتك (رقم الهاتف)، وعنوانك</strong> باش نقدرو نتواصلو معاك ونلحقولك الطلبية تاعك بلا أي تأخير أو خطأ.
                    </p>
                </div>

                {/* 2. Security */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">🛡️</span> الأمان والسرية
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        معلوماتك الشخصية كامل راهي عندنا <strong className="text-black font-extrabold">"في أمان"</strong>. نضمنولك باللي ما نبارطاجيوهم مع حتى واحد وما نبيعوهمش لأي جهة كانت.
                    </p>
                </div>

                {/* 3. Cookies */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">🍪</span> الكوكيز (Cookies)
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        نستعملو الكوكيز (Cookies) في المتصفح برك باش السيت يمشي بشكل سريع ومليح، وباش تلقى كامل الصوالح والمنتجات اللي حطيتهم في السلة تاعك (Baniier / Panier) كي ترجع تدور في السيت.
                    </p>
                </div>

            </div>

            {/* Note Section */}
            <div className="mt-12 text-center p-6 bg-gray-50 border border-gray-100 rounded-lg">
                <p className="text-gray-500 text-sm font-medium">
                    إذا كان عندك أي سؤال بخصوص حماية بياناتك، لا تتردد في الاتصال بنا عبر صفحة <a href="/contact" className="text-black font-bold underline">اتصل بنا</a>.
                </p>
            </div>
        </div>
    );
}
