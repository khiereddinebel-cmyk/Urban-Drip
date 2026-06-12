'use client';

import React from 'react';

export default function TermsPage() {
    return (
        <div dir="rtl" className="w-full max-w-3xl mx-auto px-6 py-16 md:py-24 animate-fade-in text-right">
            {/* Header section */}
            <div className="text-center mb-16 md:mb-20">
                <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                    📝 شروط الاستخدام والأحكام
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight leading-tight">
                    الشروط والأحكام
                </h1>
                <div className="h-[3px] w-20 bg-black mx-auto rounded-full"></div>
            </div>

            {/* Content Cards */}
            <div className="space-y-6 md:space-y-8">
                
                {/* 1. Orders */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">🛒</span> الطلبيات
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        كي تكوموندي (تطلب) من السيت تاعنا، راك موافق باللي كامل المعلومات الشخصية ومعلومات التوصيل اللي عطيتهم صحاح ودقيقين باش نقدرو نلحقولك طلبك بلا مشاكل.
                    </p>
                </div>

                {/* 2. Exchange & Returns */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">🔄</span> التبديل والرجوع
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        عندك الحق في <strong className="text-black font-extrabold">15 يوم</strong> كاملة باش ترجع الصباط ولا تبدلو إذا ما عجبكش ولا ما جاش قدك، بشرط يكون في حالتو الأصلية (داخل العلبة تاعو وما تلبسش برا).
                    </p>
                </div>

                {/* 3. Quality Guarantee */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">✨</span> الضمان
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        نضمنولك بلي السلعة اللي توصلك هي <strong className="text-black font-extrabold">نفسها اللي راهي مصورة</strong> في السيت وبلي الجودة والـ Quality هي الصح ونهتمو بأدق التفاصيل.
                    </p>
                </div>

                {/* 4. Order Cancellation */}
                <div className="p-6 md:p-8 bg-white border border-gray-100 rounded-lg shadow-xs hover:border-black transition-all duration-300">
                    <h3 className="text-xl font-bold text-black mb-3 flex items-center gap-3">
                        <span className="text-2xl">🛑</span> إلغاء الطلبية
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-[15px] md:text-[16px]">
                        تقدر تانولي (تُلغي) الطلبية تاعك في أي وقت <strong className="text-black font-extrabold">قبل ما نبعتوها</strong> لشركة التوصيل. اتصل بينا برك في أقرب وقت عبر خدمة الزبائن وراح نلغوها فوراً.
                    </p>
                </div>

            </div>

            {/* Note Section */}
            <div className="mt-12 text-center p-6 bg-gray-50 border border-gray-100 rounded-lg">
                <p className="text-gray-500 text-sm font-medium">
                    للأسئلة أو الاستفسارات حول الشروط، يمكنك دائماً مراسلتنا في صفحة <a href="/contact" className="text-black font-bold underline">اتصل بنا</a>.
                </p>
            </div>
        </div>
    );
}
