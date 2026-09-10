import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import logo from '../../public/logo.jpeg'; // تأكد من مسار الشعار لديك

export default function Navbar() {
  const { isAr, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // فحص المسار النشط لتمييز الزر المفعل
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-lg border-2 border-blue-500 overflow-hidden group-hover:scale-105 transition-transform shadow-xs">
            <img
              src={logo}
              alt="Large Step Logo"
              className="w-full h-full object-cover rounded-lg block"
            />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-widest text-slate-800 uppercase font-serif">
            Large Step
          </span>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-600">
          <button
            onClick={() => navigate('/')}
            className={`transition-colors pb-1 ${
              isActive('/') ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'hover:text-blue-600'
            }`}
          >
            {isAr ? 'الرئيسية' : 'Home'}
          </button>
          <button
            onClick={() => navigate('/about')}
            className={`transition-colors pb-1 ${
              isActive('/about') ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'hover:text-blue-600'
            }`}
          >
            {isAr ? 'من نحن' : 'About Us'}
          </button>
          <button
            onClick={() => navigate('/properties')}
            className={`transition-colors pb-1 ${
              isActive('/properties') ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'hover:text-blue-600'
            }`}
          >
            {isAr ? 'العقارات' : 'Properties'}
          </button>
          <button
            onClick={() => navigate('/services')}
            className={`transition-colors pb-1 ${
              isActive('/services') ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'hover:text-blue-600'
            }`}
          >
            {isAr ? 'خدماتنا' : 'Services'}
          </button>
          <button
            onClick={() => navigate('/about')}
            className="hover:text-blue-600 transition-colors pb-1"
          >
            {isAr ? 'تواصل معنا' : 'Contact'}
          </button>
        </nav>

        {/* Language Switcher & Action Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={toggleLang}
            className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors px-2.5 py-1.5 rounded-lg border border-slate-200"
          >
            {isAr ? 'English' : '[العربية]'}
          </button>

          <button
            onClick={() => navigate('/about')}
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs tracking-wider transition-all shadow-sm"
          >
            {isAr ? 'ابدأ الآن' : 'Get Started'}
          </button>
        </div>

      </div>
    </header>
  );
}