import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Home, ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import logo from '/logo.jpeg'; // أو المسار الذي تضع به اللوجو في مشروعك

export default function NotFound() {
  const { isAr } = useLanguage();
  const navigate = useNavigate();
  const Arrow = isAr ? ArrowRight : ArrowLeft;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-xl w-full text-center space-y-8">
        
        {/* اللوجو واسم الشركة */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <Link to="/" className="inline-block group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl p-2 shadow-md border border-slate-200/80 group-hover:scale-105 transition-transform overflow-hidden flex items-center justify-center">
              <img
                src={logo}
                alt="Large Step Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-wider">
              LARGE STEP
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {isAr ? 'للمقاولات والتوريدات الهندسية' : 'Contracting & Real Estate Supplies'}
            </p>
          </div>
        </div>

        {/* رقم 404 وتأثير التصميم */}
        <div className="relative">
          <div className="text-8xl sm:text-9xl font-black text-slate-200 tracking-tighter select-none font-sans">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs sm:text-sm font-bold shadow-xs">
              {isAr ? 'عفواً، الصفحة غير موجودة' : 'Page Not Found'}
            </span>
          </div>
        </div>

        {/* الرسالة التوضيحية */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {isAr ? 'يبدو أنك سلكت مساراً غير صحيح' : 'Lost your way in our properties?'}
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {isAr
              ? 'العنوان الذي تبحث عنه قد تم نقله أو لم يعد متاحاً. يمكنك العودة للصفحة الرئيسية واستعراض خدماتنا ومشاريعنا العقارية.'
              : 'The link you followed may be broken, or the page may have been removed. Let us guide you back to safety.'}
          </p>
        </div>

        {/* أزرار التوجيه */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-100 hover:text-slate-900 transition-all shadow-xs"
          >
            <Arrow className="w-4 h-4" />
            <span>{isAr ? 'الرجوع للخلف' : 'Go Back'}</span>
          </button>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-blue-500/25 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>{isAr ? 'الصفحة الرئيسية' : 'Back to Home'}</span>
          </Link>
        </div>

      </div>
    </div>
  );
}