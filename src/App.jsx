// import NotFound from "./pages/404Page";
import ScrollToTop from "./services/scrollToTop";
import logo from "/logo.jpeg"; // تأكد من مسار الصورة الصحيح عندك
import { FaAngleUp } from "react-icons/fa";
import { lazy, Suspense, useEffect, useState } from "react";
import AppRoutes from "./AppRoutes";
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/user/Home';

import { LanguageProvider } from './context/LanguageContext';
function App() {
  const upToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // useEffect(() => {
  //   // تبديل اتجاه الصفحة واللغة في كود الـ HTML تلقائياً
  //   document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  //   document.documentElement.lang = lang;
  // }, [lang]);
  
  const [lang, setLang] = useState('ar'); // اللغة الافتراضية  
  return (
    <div className="App font-Cairo bg-white">


      {/* <ScrollToTop /> */}




      {/* Scroll To Top Button */}
      <div
        onClick={upToTop}
        className="fixed bottom-8 right-8 z-50 bg-[#0284c7] text-white p-4 rounded-[20px] -2xl hover:-translate-y-2 active:scale-90 transition-all cursor-pointer"
      >
        <FaAngleUp className="text-2xl" />
      </div>

      {/* Suspense Wrapper */}
      <Suspense
        fallback={
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden select-none">

            {/* دوائر خلفية مضيئة ناعمة (Glow Background) */}
            <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-[#0284c7]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-700"></div>

            {/* 1. قسم اللوجو (Logo Section) فوق الكارت */}
            <div className="relative z-10 flex flex-col items-center mb-6">
              {/* كلمة logo الصغيرة الافتراضية بشكل ناعم */}
              <span className="text-slate-500 text-xs tracking-widest uppercase mb-2">ابو الدهب للمنتجات الغذائيه</span>

              {/* حاوية الصورة مع تأثير التوهج الدائري الأزرق */}
              <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-b from-[#0284c7]/30 to-transparent flex items-center justify-center shadow-[0_0_30px_rgba(2,132,199,0.3)] border border-[#0284c7]/20">
                <img
                  src={logo}
                  alt="Abu El-Dahab Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>

            {/* 2. كارت جلاسمورفيزم (Glassmorphism Card) */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-md p-8 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/[0.05] shadow-2xl mx-4">

              {/* جملة سبورت صغيرة أعلى الكارت على اليمين */}
              <div className="absolute top-4 right-6 flex items-center gap-1.5 opacity-60" dir="rtl">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-ping"></span>
                <span className="text-[10px] text-slate-400 font-light">مدعوم من أبو الذهب للمنتجات الغذائية</span>
              </div>

              {/* عنصر الحركة الدائري (Loader) */}
              <div className="relative w-24 h-24 flex items-center justify-center mt-4 mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-t-[#0284c7] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-1.5 rounded-full border border-b-[#0284c7]/30 border-t-transparent border-r-transparent border-l-transparent animate-spin [animation-duration:1.2s] [animation-direction:reverse]"></div>

                <div className="w-14 h-14 rounded-full bg-[#0284c7]/5 flex items-center justify-center">
                  <span className="text-[#0284c7] text-xs font-semibold animate-pulse">99%</span>
                </div>
              </div>

              {/* النصوص المتناسقة */}
              <h3 className="text-white font-medium text-xl mb-2 tracking-wide text-center" dir="rtl">
                جاري تحميل الأفضل
              </h3>

              <p className="text-slate-400 text-sm font-light text-center" dir="rtl">
                لحظات ويتم تحميل جودة المنتجات الغذائية
              </p>

              {/* خط تحميل سفلي ناعم بـ Gradient */}
              <div className="w-48 h-[3px] bg-white/5 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0284c7] to-blue-500 rounded-full animate-shimmer"></div>
              </div>
            </div>

            {/* أنيميشن شريط التحميل */}
            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.6s infinite linear;
          width: 100%;
        }
      `}</style>

          </div>
        }
      >
        <AppRoutes />
      </Suspense>
<LanguageProvider>
      <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
        {/* <AppRoutes /> */}
      </Suspense>
    </LanguageProvider>

    </div>
  );
}

export default App;