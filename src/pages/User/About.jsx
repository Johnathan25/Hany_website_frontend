import { useLanguage } from '../../context/LanguageContext';
import { 
  ArrowLeft, 
  ArrowRight, 
} from 'lucide-react';

const Image = "/image2.jpeg";

export default function About() {
  const { isAr } = useLanguage();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  

  

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full font-sans select-none bg-white text-slate-900" dir={isAr ? "rtl" : "ltr"}>


      {/* 2. القسم الأوسط: الأسهم المعدلة + الصورة السحابية + النصوص والزر */}
      <section className="relative w-full pt-12 sm:pt-16 pb-16 sm:pb-20 overflow-hidden">
        
        {/* السهم الأيسر: أعرض، أصغر حجماً، نازل من فوق مع margin-top */}
        <div className="hidden lg:block absolute left-4 xl:left-12 top-0 mt-6 xl:mt-8 w-44 xl:w-56 pointer-events-none select-none text-blue-600 drop-shadow-sm z-20">
          <svg viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path 
              d="M10 20C60 15 90 75 140 55C165 45 185 65 205 92" 
              stroke="currentColor" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path 
              d="M185 86L207 95L202 72" 
              stroke="currentColor" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        {/* السهم الأيمن: أعرض، أصغر حجماً، نازل من فوق مع margin-top */}
        <div className="hidden lg:block absolute right-4 xl:right-12 top-0 mt-6 xl:mt-8 w-44 xl:w-56 pointer-events-none select-none text-blue-600 drop-shadow-sm z-20">
          <svg viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path 
              d="M210 20C160 15 130 75 80 55C55 45 35 65 15 92" 
              stroke="currentColor" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path 
              d="M35 86L13 95L18 72" 
              stroke="currentColor" 
              strokeWidth="6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          
          {/* عنوان القسم في المنتصف */}
          <div className="text-center max-w-xl mx-auto mt-2 mb-14 sm:mb-18 space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              {isAr ? 'أثرنا ورؤيتنا المعمارية' : 'Our Impact & Vision'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {isAr
                ? 'نبني الثقة ونضمن سلامة الاستثمار العقاري من خلال حلول هندسية متقدمة وتدقيق فني وقانوني موثوق.'
                : 'Securing real estate assets through high-grade engineering diligence.'}
            </p>
          </div>

          {/* شبكة: الصورة السحابية المنحنية (Image) مقابل النصوص (Label) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* الصورة السحابية (Organic Blob Image) */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div 
                className="absolute inset-0 bg-blue-500/15 blur-2xl scale-105 pointer-events-none"
                style={{ borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%' }}
              />
              <div 
                className="relative w-full max-w-md aspect-square shadow-2xl overflow-hidden border-4 border-white bg-slate-100 transition-transform duration-500 hover:scale-[1.02]"
                style={{ borderRadius: '52% 48% 63% 37% / 40% 58% 42% 60%' }}
              >
                <img
                  src={Image}
                  alt="Large Step Architecture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* النصوص والزر (Label) */}
            <div className="lg:col-span-6 space-y-5 text-start">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-950 leading-snug">
                {isAr 
                  ? 'التزام راسخ بالنزاهة الهندسية وتأمين الأصول' 
                  : 'Commitment to Engineering Integrity'}
              </h3>

              <p className="text-slate-700 text-sm sm:text-base font-normal leading-relaxed">
                {isAr
                  ? 'تلتزم شركة Large Step بتقديم أعلى معايير النزاهة الهندسية والأمان الاستثماري عبر تلبية متطلبات المقاولات العامة وحماية أصول عملائنا العقارية بأدق تفاصيل السلامة الإنشائية.'
                  : 'Large Step follows strict engineering principles and investment diligence, responding to comprehensive contracting needs.'}
              </p>

              <p className="text-slate-500 text-xs sm:text-sm font-normal leading-relaxed">
                {isAr
                  ? 'نعمل جنباً إلى جنب مع كبرى المصانع والشركاء الهندسيين لتقديم خدمات المعاينات الدقيقة، الفحص القانوني المعتمد، والتوريدات الإنشائية المتكاملة.'
                  : 'We collaborate with certified partners to perform on-site structural diagnostics and high-grade material supplies.'}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('services')}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-blue-600/20 transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>{isAr ? 'استكشف خدماتنا' : 'Explore Our Services'}</span>
                  <Arrow className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}