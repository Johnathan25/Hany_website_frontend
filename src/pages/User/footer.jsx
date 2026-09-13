import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    MessageCircle
} from 'lucide-react';

export default function Footer() {
    const { isAr } = useLanguage();

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <footer className="w-full bg-[#0b1325] text-slate-300 font-sans border-t border-slate-800/80 select-none">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6">

                    {/* 1. بيانات التواصل (Contact Info) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#00b4d8] tracking-wide">
                            {isAr ? 'بيانات التواصل' : 'Contact Info'}
                        </h3>

                        <ul className="space-y-3 text-xs sm:text-sm text-slate-300/90">
                            <li className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-[#00b4d8] shrink-0 mt-0.5" />
                                <span>{isAr ? 'التجمع الخامس، القاهرة الجديدة' : 'New Cairo, Egypt'}</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone className="w-4 h-4 text-[#00b4d8] shrink-0" />
                                <span dir="ltr" className="font-mono text-xs">+201228213969</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail className="w-4 h-4 text-[#00b4d8] shrink-0" />
                                <span className="font-mono text-xs truncate">hanywilliam1000@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* 2. أوقات العمل (Working Hours) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#00b4d8] tracking-wide">
                            {isAr ? 'أوقات العمل' : 'Working Hours'}
                        </h3>

                        <div className="flex items-start gap-2.5 text-xs sm:text-sm">
                            <Clock className="w-4 h-4 text-[#00b4d8] shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <div className="font-bold text-white text-xs sm:text-sm">
                                    {isAr ? 'مواعيدنا اليومية:' : 'Daily Schedule:'}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {isAr ? 'يومياً من 9 صباحاً حتى 10 مساءً' : 'Daily: 9:00 AM - 10:00 PM'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. روابط سريعة (Quick Links) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#00b4d8] tracking-wide">
                            {isAr ? 'روابط سريعة' : 'Quick Links'}
                        </h3>

                        <ul className="space-y-2 text-xs sm:text-sm">
                            <li>
                                <button
                                    onClick={() => scrollToSection('home')}
                                    className="hover:text-[#00b4d8] transition-colors"
                                >
                                    {isAr ? 'الرئيسية' : 'Home'}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('about')}
                                    className="hover:text-[#00b4d8] transition-colors"
                                >
                                    {isAr ? 'من نحن' : 'About Us'}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('properties')}
                                    className="hover:text-[#00b4d8] transition-colors"
                                >
                                    {isAr ? 'العقارات' : 'Properties'}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('services')}
                                    className="hover:text-[#00b4d8] transition-colors"
                                >
                                    {isAr ? 'خدماتنا' : 'Services'}
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => scrollToSection('about')}
                                    className="hover:text-[#00b4d8] transition-colors"
                                >
                                    {isAr ? 'تواصل معنا' : 'Contact Us'}
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* 4. فريق التطوير (Development Team) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#00b4d8] tracking-wide">
                            {isAr ? 'فريق التطوير' : 'Development'}
                        </h3>

                        <div className="space-y-2 text-xs">
                            <p className="text-slate-400 font-medium">
                                {isAr ? 'تم التطوير بواسطة:' : 'Developed by:'}
                            </p>
                            <div className="space-y-3 font-mono text-[11px]">
                                {/* Contact 1 */}
                                <div className="space-y-0.5">
                                    <a
                                        href="tel:+201270857659"
                                        className="block text-sky-400 hover:text-sky-300 hover:underline transition-colors truncate"
                                    >
                                        +201270857659
                                    </a>
                                    <a
                                        href="mailto:kiroloesreda@gmail.com"
                                        className="block text-slate-400 hover:text-sky-300 hover:underline transition-colors truncate"
                                    >
                                        kiroloesreda@gmail.com
                                    </a>
                                </div>

                                {/* Contact 2 */}
                                <div className="space-y-0.5">
                                    <a
                                        href="tel:+201094124323"
                                        className="block text-sky-400 hover:text-sky-300 hover:underline transition-colors truncate"
                                    >
                                        +201094124323
                                    </a>
                                    <a
                                        href="mailto:johnathanibraheem7@gmail.com"
                                        className="block text-slate-400 hover:text-sky-300 hover:underline transition-colors truncate"
                                    >
                                        johnathanibraheem7@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. نبذة عن الشركة ووسائل التواصل (Brand & Socials) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-[#00b4d8] tracking-wide">
                            LARGE STEP
                        </h3>

                        <p className="text-xs text-slate-400 leading-relaxed">
                            {isAr
                                ? 'حلول المقاولات والتوريدات المتكاملة والمعاينات الهندسية المعتمدة.'
                                : 'Integrated contracting, structural appraisals, and trusted supplies.'}
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-2 pt-1">
                            <a
                                href="https://wa.me/201228213969"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-[#00b4d8] hover:text-white flex items-center justify-center transition-all text-slate-300 -sm"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                </div>
            </div>

            {/* الشريط السفلي لحقوق النشر والمطور */}
            <div className="w-full border-t border-slate-800/70 bg-[#080d1a] py-4 text-xs text-slate-400">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
                    <div>
                        © 2026 {isAr ? 'جميع الحقوق محفوظة لـ' : 'All rights reserved to'}{' '}
                        <span className="text-white font-bold">Large Step</span>.
                    </div>
                    <div>
                        {isAr ? 'تم تطوير الموقع بواسطة' : 'Developed by'}{' '}
                        <span className="text-[#00b4d8] font-semibold">Large Step Tech Team</span>
                    </div>
                </div>
            </div>

        </footer>
    );
}