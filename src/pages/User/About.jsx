import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, ArrowRight, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';

const Image = "/image2.jpeg";

export default function About() {
  const { isAr } = useLanguage();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const stats = [
    { number: '+120', labelAr: 'مشروع منجز', labelEn: 'Projects Done' },
    { number: '+85', labelAr: 'عميل ومستثمر', labelEn: 'Trusted Partners' },
    { number: '+8', labelAr: 'سنوات خبرة', labelEn: 'Years Experience' },
    { number: '24/7', labelAr: 'دعم واستشارات', labelEn: 'Advisory Support' },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full py-12 sm:py-20 lg:py-24 font-sans select-none overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Content + Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Texts & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
          
            {/* Main Header */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {isAr ? 'أثرنا ورؤيتنا المعمارية' : 'Our Impact & Vision'}
            </h2>

            {/* Paragraph 1 */}
            <p className="text-slate-700 text-sm sm:text-base lg:text-lg font-medium leading-relaxed">
              {isAr
                ? 'تلتزم شركة Large Step بتقديم أعلى معايير النزاهة الهندسية والأمان الاستثماري عبر تلبية متطلبات المقاولات العامة وحماية أصول عملائنا العقارية بأعلى معايير الدقة.'
                : 'Large Step follows strict engineering principles and investment diligence, responding to comprehensive contracting needs and delivering reliable asset security.'}
            </p>

            {/* Paragraph 2 */}
            <p className="text-slate-500 text-xs sm:text-sm lg:text-base font-normal leading-relaxed">
              {isAr
                ? 'نعمل جنباً إلى جنب مع كبرى المصانع والشركاء الهندسيين لتقديم خدمات المعاينات الدقيقة، الفحص القانوني المعتمد، والتوريدات الإنشائية المتكاملة لضمان استثمار آمن ومستدام.'
                : 'Across major hubs, we collaborate with certified partners to perform on-site structural diagnostics, legal due diligence, and high-grade material supplies.'}
            </p>

            {/* Actions Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => scrollToSection('services')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm transition-all -md -slate-900/10 hover:-blue-600/20 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>{isAr ? 'استكشف ما نقدمه' : 'What we do'}</span>
                <Arrow className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full aspect-4/3 sm:aspect-16/11 lg:aspect-4/5 rounded-3xl overflow-hidden -2xl border-4 border-white bg-slate-100">
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
    </section>
  );
}