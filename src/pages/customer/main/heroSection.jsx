import { useContext, useState } from "react";
import { HiOutlineArrowNarrowRight, HiOutlineBadgeCheck, HiOutlineTag, HiOutlineX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../../context/cartContext";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import hero from "/hero.png";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Hero() {
  const navigate = useNavigate();
  const { about } = useContext(MyContext);
  const [showBanner, setShowBanner] = useState(true);

  // العروض المتغيرة على طريقة أمازون
  const topOffers = [
    " عروض شركة أبو الدهب: خصومات تصل إلى 25% على كافة المجمدات واللحوم لفترة محدودة!",
    " شحن مجاني وسريع للطلبات الفوق مميزة.. طازجة من ثلاجاتنا إلى باب بيتك مباشرة",
    " جودة تثق بها: نطبق أعلى معايير السلامة الغذائية لضمان طعم لا يُنسى للأسرة"
  ];

  const slides = [
    {
      badge: "أبو الدهب للمنتجات الغذائية",
      title: (
        <>
          أفضل <span className="text-[#0284c7]">جودة</span> <br />
          لأجود المنتجات الغذائية <br />
          تصلك بكل عناية
        </>
      ),
      text: (about && about[0]?.heroText) || "نحرص على اختيار أفضل أنواع اللحوم والمجمدات بعناية فائقة لنقدم لك طعماً لا يُنسى وجودة تثق بها.",
      svgIllustration: "https://illustrations.popsy.co/blue/delivering-packages.svg" 
    },
    {
      badge: "خدمة التوصيل السريع",
      title: (
        <>
          توصيل <span className="text-[#0284c7]">سريع</span> <br />
          حتى باب منزلك <br />
          حافظ على وقتك وجهدك
        </>
      ),
      text: "استمتع بتجربة تسوق سهلة وسريعة، نضمن لك وصول المنتجات طازجة ومبردة تماماً وفق أعلى معايير السلامة.",
      svgIllustration: "https://illustrations.popsy.co/blue/shopping-bag.svg"
    },
  ];

  return (
    <section className="relative w-full h-screen flex flex-col overflow-hidden font-cairo bg-[#f8fafc]" dir="rtl">
      
      {/* 1. البانر الاحترافي (ستايل أمازون المتغير تلقائياً مع زر إغلاق) */}
{showBanner && (
  <div 
    className="w-full text-white relative z-40 overflow-hidden shadow-md transition-all duration-300 border-b border-white/5"
    style={{ background: "linear-gradient(90deg, #0369a1 0%, #0284c7 50%, #0ea5e9 100%)" }}
  >
    
    {/* خط التوهج العلوي الناعم */}
    <div className="absolute top-0 left-0 right-0 h-[1.5px]"
      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />

    <div className="container mx-auto max-w-7xl flex items-center justify-between px-4 py-2.5 gap-4">
      
      {/* اليمين (في اتجاه الـ RTL): شارة "عروض حصرية" بتصميم زجاجي أنيق */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-black tracking-wide flex-shrink-0 select-none backdrop-blur-sm transition-transform hover:scale-105"
        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
        <HiOutlineTag className="w-4 h-4 text-amber-300 animate-pulse" />
        <span>عروض حصرية</span>
      </div>

      {/* المنتصف: النص الإعلاني المتحرك مع ضبط دقيق للامتداد والارتفاع */}
      <div className="flex-1 text-center overflow-hidden h-9 sm:h-6 flex items-center justify-center">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          direction={"vertical"}
          className="w-full h-full pointer-events-none"
        >
          {topOffers.map((offer, idx) => (
            <SwiperSlide key={idx} className="flex items-center justify-center text-slate-50 font-bold text-xs md:text-sm tracking-wide">
              <span className="drop-shadow-sm">{offer}</span>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* اليسار: زر الإغلاق الدائري المتناسق مع الشارة المقابلة */}
      <button
        onClick={() => setShowBanner(false)}
        className="flex-shrink-0 p-1.5 rounded-full cursor-pointer transition-all duration-200 hover:bg-white/20 active:scale-90 border border-white/10 shadow-inner"
        style={{ background: "rgba(255,255,255,0.1)" }}
        title="إغلاق العرض"
      >
        <HiOutlineX className="w-3.5 h-3.5 text-white/90" />
      </button>
    </div>

    {/* خط التوهج السفلي الناعم */}
    <div className="absolute bottom-0 left-0 right-0 h-[1px]"
      style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />
  </div>
)}

      {/* عناصر خلفية جمالية خفيفة */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-blue-50/50 rounded-full blur-3xl"></div>
      </div>

      {/* الـ Swiper للـ Hero الرئيسي */}
      <div className="flex-1 w-full h-full relative">
        <Swiper
          spaceBetween={0}
          effect={"fade"}
          fadeEffect={{ crossFade: true }}
          speed={1000}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          modules={[Autoplay, Pagination, EffectFade]}
          className="h-full w-full"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className="flex items-center">
              <div className="container mx-auto px-6 md:px-12 lg:px-24 h-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                
                {/* الجانب الأيمن: النصوص */}
                <div data-aos="fade-" className="relative z-20 space-y-6 text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0284c7]/10 rounded-lg text-[#0284c7] border border-[#0284c7]/10 animate-fadeInUp">
                    <HiOutlineBadgeCheck className="w-5 h-5" />
                    <span className="text-sm font-bold">{slide.badge}</span>
                  </div>

                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0f172a] leading-[1.1] animate-fadeInUp delay-75">
                    {slide.title}
                  </h1>

                  <p className="text-lg md:text-xl text-slate-500 max-w-lg leading-relaxed animate-fadeInUp delay-150">
                    {slide.text}
                  </p>

                  <div className="pt-4 animate-fadeInUp delay-200">
                    <button
                      onClick={() => navigate(`/كل_المنتجات`)}
                      className="group cursor-pointer bg-[#0284c7] text-white px-10 py-4 rounded-2xl font-black text-xl flex items-center gap-3 transition-all hover:bg-[#0369a1] shadow-lg shadow-blue-200 active:scale-95"
                    >
                      تصفح الآن
                      <HiOutlineArrowNarrowRight className="w-6 h-6 transition-transform group-hover:-translate-x-2 flip-x" />
                    </button>
                  </div>
                </div>

                {/* الجانب الأيسر: صورة الـ SVG */}
                <div className="relative hidden lg:flex justify-center items-center animate-fadeInLeft">
                  <div data-aos="fade-right" className="absolute w-[450px] h-[450px] bg-blue-100/30 rounded-full scale-95"></div>
                  <img 
                    src={hero} 
                    alt="Illustration" 
                    className="relative z-10 w-full max-w-[500px] h-auto drop-shadow-2xl"
                  />
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fadeInLeft { animation: fadeInLeft 1s ease-out forwards; }
        
        .delay-75 { animation-delay: 0.075s; }
        .delay-150 { animation-delay: 0.15s; }
        .delay-200 { animation-delay: 0.2s; }

        :global(.swiper-pagination-bullet-active) {
          background: #0284c7 !important;
          width: 35px !important;
          border-radius: 10px !important;
        }

        .flip-x {
          transform: scaleX(-1);
        }
      `}</style>
    </section>
  );
}
