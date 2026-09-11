import React, { useContext } from "react";
import { MyContext } from "../../../context/cartContext";

export default function BrandsGrid() {
  let brands = [
    { id: 1, name: "أطياب", desc: "الدواجن والمجمدات الفاخرة" },
    { id: 2, name: "حلواني", desc: "اللحوم الباردة والمصنعات" },
    { id: 3, name: "كوكي", desc: "رواد الدجاج المقرمش" },
    { id: 4, name: "ولعتين", desc: "توابل ومنتجات الشواء" },
    { id: 5, name: "سو جود", desc: "جودة المنتجات الغذائية" },
    { id: 6, name: "ميتكو", desc: "لحوم مجمدة عالية الجودة" },
  ];

  const { about } = useContext(MyContext);

  if (about && about[0]?.brands) {
    brands = about[0]?.brands;
  }

  return (
    <section className="w-full py-24 bg-[#fafafa] font-cairo overflow-hidden" dir="rtl">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
  
        <div className="text-center mb-20 relative">
          <span className="text-[#0284c7] text-[11px] font-black tracking-[0.3em] uppercase mb-4 block bg-blue-50 w-fit mx-auto px-4 py-1.5 rounded-full">
            شركاء النجاح
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] leading-tight">
            أبرز العلامات التجارية
          </h2>
          <div className="w-16 h-1 bg-[#0284c7] mx-auto mt-6 rounded-full opacity-20"></div>
          <p className="text-slate-500 text-lg font-medium mt-6 max-w-2xl mx-auto leading-relaxed">
            نتعامل مع نخبة الشركات الغذائية في مصر لنضمن لك جودة أصلية وطازجة تصلك أينما كنت.
          </p>
        </div>

        {/* شبكة البراندات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {brands.map((brand, index) => (
            <div 
              key={brand.id || index}
              className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* زخرفة خلفية بسيطة تظهر عند الهوفر */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-3xl"></div>
              
              <div className="flex flex-col h-full text-center relative z-10">
                {/* أيقونة رمزية أو الحرف الأول في حال عدم وجود لوجو */}
                <div className="w-16 h-16 bg-slate-50 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-[#0284c7] group-hover:rotate-[10deg] transition-all duration-500 shadow-inner">
                   <span className="text-2xl font-black text-[#0284c7] group-hover:text-white transition-colors">
                     {brand.name.charAt(0)}
                   </span>
                </div>

                {/* اسم البراند */}
                <h3 className="text-2xl font-black text-[#0f172a] mb-3 group-hover:text-[#0284c7] transition-colors duration-300">
                  {brand.name}
                </h3>
                
                {/* فاصل انسيابي */}
                <div className="w-8 h-[3px] bg-slate-100 mx-auto mb-6 group-hover:w-16 group-hover:bg-[#0284c7] transition-all duration-500 rounded-full"></div>
                
           
                <p className="text-slate-500 text-base font-medium leading-relaxed px-4">
                  {brand.desc}
                </p>
              </div>

              {/* الرقم التسلسلي - جعلناه أكثر أناقة وأقل وضوحاً */}
              <span className="absolute -bottom-2 -right-2 text-8xl font-black text-slate-50 opacity-40 group-hover:opacity-100 group-hover:text-blue-50 transition-all duration-700 pointer-events-none select-none italic">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .font-cairo { font-family: 'Cairo', cairo-serif; }
      `}</style>
    </section>
  );
}