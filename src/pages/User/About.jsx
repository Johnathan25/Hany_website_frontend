import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  ShieldCheck, 
  Hammer, 
  Award,
  Sparkles,
  PhoneCall,
  Compass,
} from 'lucide-react';

const Image = "/image2.jpeg";

export default function About() {
  const { isAr } = useLanguage();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const pillars = [
    {
      icon: Building2,
      labelAr: 'فحص إنشائي معتمد',
      labelEn: 'Structural Inspection',
      subAr: 'سلامة الأساسات والخرسانات',
      subEn: 'Certified Quality',
      color: 'text-blue-400 bg-blue-500/10 border-blue-400/20',
    },
    {
      icon: ShieldCheck,
      labelAr: 'أمان وتدقيق قانوني',
      labelEn: 'Legal Diligence',
      subAr: 'مراجعة التراخيص والملكية',
      subEn: 'Safe Ownership',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-400/20',
    },
    {
      icon: Hammer,
      labelAr: 'تنفيذ ومقاولات عامة',
      labelEn: 'Turnkey Contracting',
      subAr: 'أعلى المعايير المعمارية',
      subEn: 'Premium Standards',
      color: 'text-amber-400 bg-amber-500/10 border-amber-400/20',
    },
    {
      icon: Award,
      labelAr: 'توريدات وضمان شامل',
      labelEn: 'Guaranteed Supply',
      subAr: 'خامات معتمدة وموثوقة',
      subEn: 'Approved Materials',
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-400/20',
    },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div 
      className="relative w-full pt-16 sm:pt-24 font-sans select-none bg-gradient-to-b from-slate-300 via-blue-400 to-slate-400 text-white flex flex-col justify-between overflow-hidden" 
      dir={isAr ? "rtl" : "ltr"}
    >
      
      {/* هالات لونية ضبابية زرقاء تمنح عمقاً هندسياً فخماً */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 -left-40 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. المحتوى الأساسي */}
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 space-y-16 w-full mb-16 sm:mb-20">
        
        {/* الترويسة الرئيسية */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {isAr ? 'أثرنا ورؤيتنا المعمارية' : 'Our Architectural Impact & Vision'}
          </h2>

          <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
            {isAr
              ? 'نبني الثقة ونضمن سلامة الاستثمار العقاري من خلال حلول هندسية متقدمة وتدقيق فني وقانوني موثوق.'
              : 'Securing real estate assets through high-grade engineering diligence and certified construction.'}
          </p>
        </div>

        {/* شبكة النصوص والصورة المعمارية */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 leading-snug">
              {isAr 
                ? 'التزام راسخ بالنزاهة الهندسية وتأمين الأصول الاستثمارية' 
                : 'Commitment to Engineering Integrity & Asset Security'}
            </h3>

            <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
              {isAr
                ? 'تلتزم شركة Large Step بتقديم أعلى معايير النزاهة الهندسية والأمان الاستثماري عبر تلبية متطلبات المقاولات العامة وحماية أصول عملائنا العقارية بأدق تفاصيل السلامة الإنشائية.'
                : 'Large Step follows strict engineering principles and investment diligence, responding to comprehensive contracting needs and delivering reliable asset security.'}
            </p>

            <p className="text-slate-700 text-xs sm:text-sm font-normal leading-relaxed">
              {isAr
                ? 'نعمل جنباً إلى جنب مع كبرى المصانع والشركاء الهندسيين لتقديم خدمات المعاينات الدقيقة، الفحص القانوني المعتمد، والتوريدات الإنشائية المتكاملة لضمان استثمار آمن ومستدام.'
                : 'Across major hubs, we collaborate with certified partners to perform on-site structural diagnostics, legal due diligence, and high-grade material supplies.'}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('services')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{isAr ? 'استكشف ما نقدمه' : 'Explore Our Services'}</span>
                <Arrow className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-4/3 sm:aspect-16/11 lg:aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200 bg-slate-900">
              <img
                src={Image}
                alt="Large Step Building"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>

      </div>



    </div>
  );
}