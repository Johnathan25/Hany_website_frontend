import React, { useContext } from "react";
import { MyContext } from "../../../context/cartContext";

export default function LogoMarquee() {
  const { about } = useContext(MyContext);

  let brands = [
    { id: 1, name: "أطياب", desc: "الدواجن والمجمدات الفاخرة" },
    { id: 2, name: "حلواني", desc: "اللحوم الباردة والمصنعات" },
    { id: 3, name: "كوكي", desc: "رواد الدجاج المقرمش" },
    { id: 4, name: "ولعتين", desc: "توابل ومنتجات الشواء" },
    { id: 5, name: "سو جود", desc: "جودة المنتجات الغذائية" },
    { id: 6, name: "ميتكو", desc: "لحوم مجمدة عالية الجودة" },
  ];

  if (about && about[0]?.brands) {
    brands = about[0]?.brands;
  }

  // تكرار البيانات لضمان سلاسة الحركة
  const marqueeItems = [...brands, ...brands, ...brands];

  return (
    <div className=" py-20 overflow-hidden font-cairo" dir="ltr">
      {/* عنوان القسم */}
      <div data-aos="fade-up" className="flex flex-col items-center mb-16 px-4">
        <span data-aos="fade-left" className="text-[#0284c7] text-[11px] font-black tracking-[0.3em] uppercase mb-3 bg-blue-50 px-4 py-1.5 rounded-full">
          شركاؤنا
        </span>
        <h2 data-aos="fade-right" className="text-3xl md:text-5xl font-black text-[#0f172a] text-center leading-tight">
          أفضل <span className="text-[#0284c7]">البراندات</span> المختارة
        </h2>
        <div className="w-12 h-1 bg-[#0284c7] rounded-full mt-6 opacity-20"></div>
      </div>

      {/* Marquee Section مع تأثير التلاشي عند الحواف (Mask) */}
      <div className="relative group">
        {/* Gradient Overlays لجعل الحركة تبدو كأنها تظهر من العدم */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#fafafa] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#fafafa] to-transparent z-10 pointer-events-none"></div>

        <div className="flex animate-marquee gap-8 items-center py-4">
          {marqueeItems.map((brand, index) => (
            <div
              key={`${brand.id}-${index}`}
              className="min-w-[280px] md:min-w-[350px]"
            >
              {/* Card - تصميم عصري مع تأثير Hover زجاجي */}
              <div className="relative group/card bg-white border border-slate-100 p-8 rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 text-right overflow-hidden">
                
                {/* زخرفة خلفية بسيطة */}
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 blur-2xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-black text-[#0284c7] group-hover/card:bg-[#0284c7] group-hover/card:text-white transition-all duration-500">
                       {brand.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Verified Partner</span>
                  </div>

                  <h3 className="text-2xl font-black text-[#0f172a] mb-2 group-hover/card:text-[#0284c7] transition-colors duration-300">
                    {brand.name}
                  </h3>

                  <div className="w-8 h-[3px] bg-slate-100 mb-4 group-hover/card:w-16 group-hover/card:bg-[#0284c7] transition-all duration-500 rounded-full"></div>

                  <p className="text-slate-500 text-sm font-medium leading-relaxed">
                    {brand.desc}
                  </p>
                </div>

                {/* رقم ضخم في الخلفية بلمسة عصرية */}
                <span className="absolute -bottom-4 -left-2 text-8xl font-black text-slate-50 opacity-40 group-hover/card:text-blue-50 group-hover/card:opacity-100 transition-all duration-700 pointer-events-none italic select-none">
                  {(index % brands.length) + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee-ltr {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }

        .animate-marquee {
          animation: marquee-ltr 40s linear infinite;
          display: flex;
          width: fit-content;
        }

        /* توقف الحركة عند الوقوف بالماوس لسهولة القراءة */
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 25s;
          }
        }
      `}</style>
    </div>
  );
}