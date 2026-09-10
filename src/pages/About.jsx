import React from 'react';
import { useLanguage } from '../context/LanguageContext';
const Image = "/image2.jpeg";
export default function About() {
    const { isAr } = useLanguage();

    const stats = [
        { number: '+120', labelAr: 'مشروع منجز', labelEn: 'Projects' },
        { number: '+85', labelAr: 'عميل ومستثمر', labelEn: 'Partners' },
        { number: '+8', labelAr: 'سنوات خبرة', labelEn: 'Years Experience' },
        { number: '24/7', labelAr: 'دعم واستشارات', labelEn: 'Advisory Support' },
    ];

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="w-full bg-white font-sans select-none overflow-hidden">
            {/* 1. Top Section: 50/50 Split (Image & Editorial Content) */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 min-h-[560px]">



                {/* Right Side: Editorial Content */}
                <div className="flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-16 lg:py-20 bg-white">
                    <div className="max-w-xl space-y-6">

                        {/* Main Header */}
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight font-serif">
                            {isAr ? 'أثرنا ورؤيتنا' : 'Our impact'}
                        </h2>

                        {/* Paragraph 1 */}
                        <p className="text-slate-700 text-base sm:text-4xl font-normal leading-relaxed">
                            {isAr
                                ? 'تلتزم شركة Large Step بتقديم أعلى معايير النزاهة الهندسية والأمان الاستثماري عبر تلبية متطلبات المقاولات العامة وحماية أصول عملائنا العقارية بأعلى معايير الدقة.'
                                : 'Large Step follows strict engineering principles and investment diligence, responding to comprehensive contracting needs and delivering reliable asset security.'}
                        </p>

                        {/* Paragraph 2 */}
                        <p className="text-slate-600 text-sm sm:text-2xl font-light leading-relaxed">
                            {isAr
                                ? 'نعمل جنباً إلى جنب مع كبرى المصانع والشركاء الهندسيين لتقديم خدمات المعاينات الدقيقة، الفحص القانوني المعتمد، والتوريدات الإنشائية المتكاملة لضمان استثمار آمن ومستدام.'
                                : 'Across major hubs, we collaborate with certified partners to perform on-site structural diagnostics, legal due diligence, and high-grade material supplies.'}
                        </p>

                        {/* Dual Action Pill Buttons */}
                        <div className="flex flex-wrap items-center gap-3.5 pt-4">
                            <button
                                onClick={() => scrollToSection('services')}
                                className="px-7 py-2.5 rounded-full border-2 border-slate-900 text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-900 hover:text-white transition-all shadow-xs"
                            >
                                {isAr ? 'ماذا نقدم' : 'What we do'}
                            </button>

                            {/* <button
                                onClick={() => scrollToSection('properties')}
                                className="px-7 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-blue-600 transition-colors shadow-xs"
                            >
                                {isAr ? 'مشاريعنا' : 'Where we work'}
                            </button> */}
                        </div>

                    </div>
                </div>
                <div className="relative w-full h-80 lg:h-auto min-h-[350px] p-[20px]">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <img
                            src={Image}
                            alt="Large Step Building"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/10 pointer-events-none" />
                    </div>

                </div>

            </div>

            {/* 2. Bottom Stats Banner: Cyan / Deep Sky Blue Band
            <div className="w-full bg-[#00b4d8] text-white py-14 px-6 sm:px-12 lg:px-20">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center lg:text-start">
                    {stats.map((item, index) => (
                        <div key={index} className="space-y-1.5">
                            <div className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight font-sans">
                                {item.number}
                            </div>
                            <div className="text-sm sm:text-base font-medium opacity-90">
                                {isAr ? item.labelAr : item.labelEn}
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}
        </section>
    );
}