import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Menu, X } from 'lucide-react';
import logo from '../../public/logo.jpeg';

export default function Navbar() {
  const { isAr, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-blue-100/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        {/* 1. Div الأيمن: أزرار تسجيل الدخول واللغة للشاشات الكبيرة + زر الموبايل للشاشات الصغيرة */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">

          {/* Toggle Menu Button (للموبايل والشاشات الصغيرة فقط) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* الأزرار العادية (تظهر فقط في الشاشات المتوسطة والكبيرة) */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3">


            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-full text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-bold text-sm tracking-wide transition-all"
            >
              {isAr ? 'تسجيل الدخول' : 'Log In'}
            </button>

            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/20 whitespace-nowrap transform hover:-translate-y-0.5"
            >
              {isAr ? 'إنشاء حساب' : 'Register'}
            </button>
          </div>

        </div>

        {/* 2. Div المنتصف: روابط التنقل (تظهر في الشاشات المتوسطة والكبيرة فقط) */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <nav className="flex items-center gap-6 lg:gap-8 text-base font-bold text-slate-700">
            <button
              onClick={() => scrollToSection('home')}
              className="relative py-1.5 hover:text-blue-600 transition-colors group"
            >
              {isAr ? 'الرئيسية' : 'Home'}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-200" />
            </button>

            <button
              onClick={() => scrollToSection('about')}
              className="relative py-1.5 hover:text-blue-600 transition-colors group"
            >
              {isAr ? 'من نحن' : 'About Us'}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-200" />
            </button>

            {/* <button
              onClick={() => scrollToSection('properties')}
              className="relative py-1.5 hover:text-blue-600 transition-colors group"
            >
              {isAr ? 'العقارات' : 'Properties'}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-200" />
            </button> */}

            <button
              onClick={() => scrollToSection('services')}
              className="relative py-1.5 hover:text-blue-600 transition-colors group"
            >
              {isAr ? 'خدماتنا' : 'Services'}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-200" />
            </button>

            <button
              onClick={() => scrollToSection('complaints')}
              className="relative py-1.5 hover:text-blue-600 transition-colors group"
            >
              {isAr ? 'الشكاوى والاقتراحات' : 'Complaints'}
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-center duration-200" />
            </button>
            
          </nav>
        </div>

        {/* 3. Div الأيسر: الشعار اسم اللوجو والصورة */}
        <div className="flex items-center justify-end shrink-0">
          <div
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <span className="text-lg sm:text-xl font-extrabold tracking-wider text-slate-800 uppercase font-serif group-hover:text-blue-600 transition-colors">
              Large Step
            </span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-blue-500 overflow-hidden group-hover:scale-105 transition-transform shadow-sm group-hover:shadow-blue-500/20">
              <img
                src={logo}
                alt="Large Step Logo"
                className="w-full h-full object-cover rounded-lg block"
              />
            </div>
          </div>
        </div>

      </div>

      {/* 4. Pop-up Mobile Navigation Drawer (ينبثق عند الضغط على زر الموبايل) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-lg px-6 py-6 shadow-xl space-y-5 animate-in slide-in-from-top-2 duration-200">

          {/* روابط التنقل الموبايل */}
          <nav className="flex flex-col gap-4 font-bold text-slate-700 text-right">
            <button
              onClick={() => scrollToSection('home')}
              className="py-2 text-slate-800 hover:text-blue-600 transition-colors border-b border-slate-50 text-right"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>

            <button
              onClick={() => scrollToSection('about')}
              className="py-2 text-slate-800 hover:text-blue-600 transition-colors border-b border-slate-50 text-right"
            >
              {isAr ? 'من نحن' : 'About Us'}
            </button>

            <button
              onClick={() => scrollToSection('properties')}
              className="py-2 text-slate-800 hover:text-blue-600 transition-colors border-b border-slate-50 text-right"
            >
              {isAr ? 'العقارات' : 'Properties'}
            </button>

            <button
              onClick={() => scrollToSection('services')}
              className="py-2 text-slate-800 hover:text-blue-600 transition-colors border-b border-slate-50 text-right"
            >
              {isAr ? 'خدماتنا' : 'Services'}
            </button>

            <button
              onClick={() => scrollToSection('about')}
              className="py-2 text-slate-800 hover:text-blue-600 transition-colors border-b border-slate-50 text-right"
            >
              {isAr ? 'تواصل معنا' : 'Contact'}
            </button>
          </nav>

          {/* أزرار الإجراءات واللغة داخل القائمة */}
          <div className="pt-2 flex flex-col gap-3">


            <button
              onClick={() => {
                navigate('/login');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl border border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors"
            >
              {isAr ? 'تسجيل الدخول' : 'Log In'}
            </button>

            <button
              onClick={() => {
                navigate('/register');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
            >
              {isAr ? 'إنشاء حساب' : 'Register'}
            </button>
          </div>

        </div>
      )}
    </header>
  );
}