import React from 'react';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
// تأكد من صحة المسار
import deliveryMan from '../../../../public/delivery-man.png'; 
import { useNavigate } from 'react-router-dom';

const DeliveryBanner = () => {
  const navigate = useNavigate(); // تصحيح الخطأ الإملائي هنا

  return (
    <div className=" mx-auto  py-16 font-cairo overflow-x-hidden" dir="rtl">
      <div className="relative bg-[#0284c7]  h-[350px] md:h-[300px] flex items-center shadow-2xl shadow-blue-200/50 overflow-hidden md:overflow-visible">
        
        {/* المحتوى النصي */}
        <div  data-aos="fade-right" className="w-full md:w-1/2 px-6 md:pr-16 z-20 text-right">
          <h2 className="text-white text-3xl md:text-5xl font-black leading-tight mb-4 drop-shadow-md">
            توصيل سريع <br /> 
            <span className="text-sky-200 italic tracking-wide">لباب بيتك!</span>
          </h2>
          <p className="text-blue-50 text-sm md:text-lg font-medium opacity-90 max-w-xs md:max-w-md mb-8">
            اطلب الآن كل احتياجاتك من اللحوم والمجمدات، وبنوصلها لك طازجة وفي أسرع وقت.
          </p>

          <button 
            onClick={() => navigate("/كل_المنتجات")} 
            className="group cursor-pointer bg-white text-sky-700 px-8 md:px-10 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg flex items-center gap-3 transition-all hover:bg-sky-50 hover:shadow-xl active:scale-95"
          >
            اطلب الآن
            <HiOutlineArrowNarrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-2" />
          </button>
        </div>

        {/* حاوية الصورة */}
        <div  data-aos="fade-left" className="absolute left-0 bottom-0 h-full w-full md:w-1/2 pointer-events-none z-10 flex justify-end items-end">
          <img 
            src={deliveryMan} 
            alt="Delivery Service" 
            className="
              h-[90%] md:h-[125%] 
              w-auto 
              object-contain 
              transform 
              scale-x-[-1] 
              drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)]
              transition-transform 
              duration-700 
              hover:scale-x-[-1.05]
              opacity-40 md:opacity-100 /* تقليل شفافية الصورة على الموبايل لكي لا تحجب النص */
            " 
          />
        </div>

        {/* عناصر زخرفية مع Blur عالي */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-1/3 w-40 h-40 bg-blue-400/30 rounded-full blur-3xl"></div>
        
        {/* لمسة جمالية: خطوط منحنية خلفية (اختياري) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[120%] border-[20px] border-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryBanner;