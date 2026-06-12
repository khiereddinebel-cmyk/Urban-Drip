'use client';

import React from 'react';

export default function DeliveryPage() {
    return (
        <div dir="rtl" className="w-full max-w-3xl mx-auto px-6 py-16 md:py-24 animate-fade-in text-right">
            {/* Header section */}
            <div className="text-center mb-16 md:mb-20">
                <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                    🚚 معلومات الشحن والتوصيل
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight leading-tight">
                    كيفاش يوصلك صباطك؟
                </h1>
                <div className="h-[3px] w-20 bg-black mx-auto rounded-full"></div>
            </div>

            {/* Content Cards */}
            <div className="space-y-6 md:space-y-8">
                
                {/* 1. Regions */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">📍</span> مناطق التوصيل
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        نوصلو لـ <strong className="text-black font-extrabold">58 ولاية</strong>، وين ما كنت نلحقولك حتى لباب الدار.
                    </p>
                </div>

                {/* 2. Duration */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">⚡</span> مدة التوصيل
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        الطلبية تاعك تاخد من <strong className="text-black font-extrabold">2 لـ 5 أيام عمل</strong>، على حساب الولاية والمنطقة تاعك.
                    </p>
                </div>

                {/* 3. Cost */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">💳</span> التكلفة
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        السومة تاع التوصيل تبانلك واضحة وتتحسب تلقائياً <strong className="text-black font-extrabold">قبل ما تخلص</strong> في صفحة الدفع (Checkout) على حساب الولاية اللي تخيرها.
                    </p>
                </div>

                {/* 4. Tracking */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">📦</span> تتبع الطلبية
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        كي نبعتو السلعة تاعك، نبعتولك <strong className="text-black font-extrabold">رقم التتبع في ميساج (SMS)</strong> باش تشوف وين راهي لحقت خطوة بخطوة.
                    </p>
                </div>

                {/* 5. Payment Method */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">🤝</span> طريقة الدفع
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        عندنا خدمة <strong className="text-black font-extrabold">"يد بيد" (الدفع عند الاستلام)</strong>. تخلص كاش غير كي يلحقك الصباط وتشوفو بعينيك وتتأكد من القياس والـ Quality.
                    </p>
                </div>

            </div>

            {/* Note Section */}
            <div className="mt-12 text-center p-6 bg-gray-50 border border-gray-100 rounded-lg">
                <p className="text-gray-500 text-sm font-medium">
                    عندك أي سؤال آخر؟ تواصل معنا مباشرة عبر الواتساب أو الإنستغرام عبر صفحة <a href="/contact" className="text-black font-bold underline">اتصل بنا</a>.
                </p>
            </div>
        </div>
    );
}
