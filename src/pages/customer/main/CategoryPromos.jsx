import React, { useState, useEffect } from "react";
import { ShoppingBag, Ticket, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// styles
import "swiper/css";
import "swiper/css/pagination";

import offer from "/offer.png"; 
import couponImg from "/coupon.png"; 
import comboImg from "/combo.png"; 

import { showAlertConfirm } from "../../../services/alertConfirm";
import api from "../../../services/api";


const CategoryPromos = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;
  
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
  
      if (decoded.exp <= currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        return false; 
      }
      
      return true; 
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      return false; 
    }
  };

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/coupons"); 
      
      if (response.data.success) {
        setCoupons(response.data.coupons);
      } else {
        setError("فشل في تحميل الكوبونات");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCoupons = async () => {
    if (!isTokenValid()) {
      const alert = await showAlertConfirm({ 
        title: "يجب تسجيل الدخول", 
        text: "يجب عليك تسجيل الدخول أولاً لتتمكن من استعراض وتطبيق الكوبونات المتاحة", 
        icon: "warning" 
      });
      
      if (alert.isConfirmed) {
        navigate("/تسجيل_الدخول");
      }
      return; 
    }

    setIsOpen(true);
    fetchCoupons();
  };

  const handleOpenCombo = async () => {
    // if (!isTokenValid()) {
    //   const alert = await showAlertConfirm({ 
    //     title: "يجب تسجيل الدخول", 
    //     text: "يجب عليك تسجيل الدخول أولاً لتتمكن من استعراض العروض المجمعة المتاحة", 
    //     icon: "warning" 
    //   });
      
    //   if (alert.isConfirmed) {
    //     navigate("/تسجيل_الدخول");
    //   }
    //   return; 
    // }
    navigate("/العروض_والخصومات_الكومبو");
  };

  const handleSelectCoupon = (code) => {
    navigator.clipboard.writeText(code); 
    alert(`تم نسخ الكود بنجاح: ${code}`);
    setIsOpen(false);
  };

  // تم تصحيح الـ actions هنا لتعمل كل كارد بشكل صحيح
  const promos = [
    {
      id: 3,
      buttonText: "احصل علي عرض الكومبو",
      image: comboImg, 
      type: "modal",
      action: handleOpenCombo // تم تصحيحه ليستدعي الكومبو
    },
    {
      id: 1,
      buttonText: "احصل علي العرض", 
      image: offer, 
      type: "link",
      link: "/العروض_والخصومات"
    },
    {
      id: 2,
      buttonText: "احصل علي كوبون",
      image: couponImg, 
      type: "modal",
      action: handleOpenCoupons // تم تصحيحه ليستدعي الكوبونات
    },
  ];

  useEffect(() => {
    isTokenValid();
  }, []);

  return (
    <div className="w-full mx-auto px-4 py-12 mt-12" dir="rtl">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        // تعديل الـ Autoplay ليدعم التوقف المؤقت عند العمل هوفر (Mouse Enter)
        autoplay={{ 
          delay: 3500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true 
        }}
        pagination={{ clickable: true }}
        loop={true}
        breakpoints={{
          1024: { slidesPerView: 2 },
        }}
      >
        {promos.map((promo) => (
          <SwiperSlide key={promo.id}>
            <div className="relative rounded-[2rem] overflow-hidden h-[300px] md:h-[400px] bg-slate-100 group cursor-grab active:cursor-grabbing">
              
              <img 
                
                src={promo.image} 
                alt={promo.buttonText} 
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent z-10"></div>

              <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 md:p-12">
                {promo.type === "link" ? (
                  <Link
                    to={promo.link}
                    className="bg-white text-[#0284c7] px-8 py-3.5 rounded-full flex items-center gap-2.5 w-fit font-bold transition-all hover:bg-[#0284c7] hover:text-white hover:shadow-2xl hover:scale-105 active:scale-95"
                  >
                    {promo.buttonText}
                    <ShoppingBag size={20} />
                  </Link>
                ) : (
                  <button
                    onClick={promo.action}
                    className="bg-white cursor-pointer text-[#0284c7] px-8 py-3.5 rounded-full flex items-center gap-2.5 w-fit font-bold transition-all hover:bg-[#0284c7] hover:text-white hover:shadow-2xl hover:scale-105 active:scale-95"
                  >
                    {promo.buttonText}
                    <Ticket size={20} />
                  </button>
                )}
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* المودال الديناميكي للكوبونات */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[75vh] flex flex-col overflow-hidden">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Ticket className="text-[#0284c7]" size={22} />
                الكوبونات المتاحة حالياً
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <div className="w-9 h-9 border-4 border-[#0284c7] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500 font-medium">جاري تحديث الكوبونات...</p>
                </div>
              )}

              {error && (
                <p className="text-center text-red-500 text-sm font-medium py-4">{error}</p>
              )}

              {!loading && !error && coupons.length === 0 && (
                <p className="text-center text-gray-500 py-8 text-sm">لا توجد كوبونات نشطة في الوقت الحالي.</p>
              )}

              {!loading && !error && coupons.map((coupon) => (
                <div 
                  key={coupon._id}
                  className="flex items-center justify-between p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:border-[#0284c7]/40 transition-all duration-200"
                >
                  <div className="space-y-1">
                    <span className="inline-block px-3 py-1 bg-[#0284c7]/10 text-[#0284c7] font-mono font-bold text-sm rounded-lg uppercase tracking-wider">
                      {coupon.code}
                    </span>
                    <p className="text-[11px] text-gray-400">
                      {coupon.expiresAt ? `ينتهي: ${new Date(coupon.expiresAt).toLocaleDateString('ar-EG')}` : 'صالح لفترة محدودة'}
                    </p>
                  </div>

                  <div className="text-left flex flex-col items-end">
                    <span className="text-2xl font-black text-gray-800">
                      {coupon.discount}% <span className="text-xs font-normal text-gray-500">خصم</span>
                    </span>
                    <button
                      onClick={() => handleSelectCoupon(coupon.code)}
                      className="mt-1.5 text-xs font-bold text-[#0284c7] hover:text-[#0369a1] hover:underline"
                    >
                      نسخ الكوبون 
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors bg-white border border-gray-200 rounded-xl shadow-sm"
              >
                إلغاء
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPromos;

// import React, { useState, useEffect, useRef } from "react";
// import { ShoppingBag, Ticket, X } from "lucide-react";
// import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode"; 

// import offer from "/offer.png"; 
// import couponImg from "/coupon.png"; 
// import comboImg from "/combo.png"; 

// import { showAlertConfirm } from "../../../services/alertConfirm";
// import api from "../../../services/api";

// const CategoryPromos = () => {
//   const navigate = useNavigate();
//   const scrollContainerRef = useRef(null);
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isOpen, setIsOpen] = useState(false);
//   const [coupons, setCoupons] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isHovered, setIsHovered] = useState(false);

//   const isTokenValid = () => {
//     const token = localStorage.getItem("token");
//     if (!token) return false;
  
//     try {
//       const decoded = jwtDecode(token);
//       const currentTime = Date.now() / 1000;
  
//       if (decoded.exp <= currentTime) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("userName");
//         return false; 
//       }
//       return true; 
//     } catch (err) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("userName");
//       return false; 
//     }
//   };

//   const fetchCoupons = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await api.get("/coupons"); 
//       if (response.data.success) {
//         setCoupons(response.data.coupons);
//       } else {
//         setError("فشل في تحميل الكوبونات");
//       }
//     } catch (err) {
//       setError("حدث خطأ أثناء الاتصال بالسيرفر");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenCoupons = async () => {
//     if (!isTokenValid()) {
//       const alert = await showAlertConfirm({ 
//         title: "يجب تسجيل الدخول", 
//         text: "يجب عليك تسجيل الدخول أولاً لتتمكن من استعراض وتطبيق الكوبونات المتاحة", 
//         icon: "warning" 
//       });
      
//       if (alert.isConfirmed) {
//         navigate("/تسجيل_الدخول");
//       }
//       return; 
//     }
//     setIsOpen(true);
//     fetchCoupons();
//   };

//   const handleOpenCombo = async () => {
//     if (!isTokenValid()) {
//       const alert = await showAlertConfirm({ 
//         title: "يجب تسجيل الدخول", 
//         text: "يجب عليك تسجيل الدخول أولاً لتتمكن من استعراض العروض المجمعة المتاحة", 
//         icon: "warning" 
//       });
      
//       if (alert.isConfirmed) {
//         navigate("/تسجيل_الدخول");
//       }
//       return; 
//     }
//     navigate("/العروض_والخصومات_الكومبو");
//   };

//   const handleSelectCoupon = (code) => {
//     navigator.clipboard.writeText(code); 
//     alert(`تم نسخ الكود بنجاح: ${code}`);
//     setIsOpen(false);
//   };

//   const promos = [
//     {
//       id: 3,
//       buttonText: "احصل علي عرض الكومبو",
//       image: comboImg, 
//       type: "modal",
//       action: handleOpenCombo
//     },
//     {
//       id: 1,
//       buttonText: "احصل علي العرض", 
//       image: offer, 
//       type: "link",
//       link: "/العروض_والخصومات"
//     },
//     {
//       id: 2,
//       buttonText: "احصل علي كوبون",
//       image: couponImg, 
//       type: "modal",
//       action: handleOpenCoupons
//     },
//   ];

//   // تأثير الـ Autoplay المطور والمحلي بالكامل
//   useEffect(() => {
//     if (isHovered || isOpen) return; // إيقاف الحركة إذا وضع الماوس أو فتح المودال

//     const interval = setInterval(() => {
//       if (scrollContainerRef.current) {
//         const container = scrollContainerRef.current;
        
//         // حساب الـ Index القادم (يتكيف تلقائياً مع الشاشات الكبيرة التي تعرض كارتين معاً)
//         const isDesktop = window.innerWidth >= 1024;
//         const maxSlides = isDesktop ? promos.length - 1 : promos.length;
//         const nextIndex = (activeIndex + 1) % maxSlides;
        
//         const itemWidth = container.querySelector('[data-slide]').clientWidth + 20; // العرض + الـ Gap
        
//         // في متصفحات الـ RTL التمرير لليسر يكون بقيم سالبة
//         container.scrollTo({
//           left: -nextIndex * itemWidth,
//           behavior: "smooth"
//         });
        
//         setActiveIndex(nextIndex);
//       }
//     }, 3800);

//     return () => clearInterval(interval);
//   }, [activeIndex, isHovered, isOpen, promos.length]);

//   // تحديث الـ Dots عند سحب المستخدم بيده على الموبايل
//   const handleScroll = () => {
//     if (scrollContainerRef.current) {
//       const container = scrollContainerRef.current;
//       const slideElement = container.querySelector('[data-slide]');
//       if (!slideElement) return;

//       const itemWidth = slideElement.clientWidth + 20;
//       const index = Math.round(Math.abs(container.scrollLeft) / itemWidth);
      
//       if (index !== activeIndex && index < promos.length) {
//         setActiveIndex(index);
//       }
//     }
//   };

//   useEffect(() => {
//     isTokenValid();
//   }, []);

//   return (
//     <div className="w-full mx-auto py-8 mt-6 relative group/section" dir="rtl">
      
//       {/* حاوية الـ CSS-Snap المشابهة تماماً للنظام السابق */}
//       <div 
//         ref={scrollContainerRef}
//         onScroll={handleScroll}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         className="w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-none gap-5 px-4 md:px-8"
//       >
//         {promos.map((promo) => (
//           <div 
//             key={promo.id}
//             data-slide
//             className="w-full min-w-full lg:min-w-[calc(50%-10px)] snap-start relative overflow-hidden h-[260px] md:h-[350px] bg-slate-900 rounded-3xl border border-slate-100/10 shadow-[0_15px_30px_rgba(0,0,0,0.02)] group cursor-grab active:cursor-grabbing select-none"
//           >
//             {/* الصورة الخلفية بالإضاءة الفخمة */}
//             <img 
//               src={promo.image} 
//               alt={promo.buttonText} 
//               className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 ease-out group-hover:scale-105 opacity-85"
//             />

//             {/* الجراديانت الزجاجي السفلي */}
//             <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10"></div>

//             {/* تأثير ضوئي ناعم بالزاوية */}
//             <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>

//             {/* المحتوى والأزرار */}
//             <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10">
//               {promo.type === "link" ? (
//                 <Link
//                   to={promo.link}
//                   className="bg-white text-[#0284c7] px-8 py-3.5 rounded-xl flex items-center gap-2.5 w-fit font-black text-sm shadow-xl shadow-black/10 transition-all hover:bg-[#0284c7] hover:text-white active:scale-95"
//                 >
//                   {promo.buttonText}
//                   <ShoppingBag size={18} />
//                 </Link>
//               ) : (
//                 <button
//                   onClick={promo.action}
//                   className="bg-white text-[#0284c7] px-8 py-3.5 rounded-xl flex items-center gap-2.5 w-fit font-black text-sm shadow-xl shadow-black/10 transition-all hover:bg-[#0284c7] hover:text-white active:scale-95 cursor-pointer"
//                 >
//                   {promo.buttonText}
//                   <Ticket size={18} />
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* الـ Dots التلقائية بالأسفل */}
//       {promos.length > 1 && (
//         <div className="flex justify-center gap-1.5 mt-5 z-20">
//           {Array.from({ length: window.innerWidth >= 1024 ? promos.length - 1 : promos.length }).map((_, idx) => (
//             <div 
//               key={idx}
//               className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-5 bg-[#0284c7]' : 'w-1.5 bg-slate-200'}`}
//             />
//           ))}
//         </div>
//       )}

//       {/* الـ CSS المخصص لإخفاء الـ Scrollbars كلياً */}
//       <style jsx>{`
//         .scrollbar-none::-webkit-scrollbar { display: none; }
//         .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
//       `}</style>

//       {/* --- المودال الديناميكي للكوبونات (محتفظ بنفس اللوجيك والـ UI) --- */}
//       {isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[75vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//               <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
//                 <Ticket className="text-[#0284c7]" size={22} />
//                 الكوبونات المتاحة حالياً
//               </h3>
//               <button 
//                 onClick={() => setIsOpen(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-6 overflow-y-auto flex-1 space-y-4">
//               {loading && (
//                 <div className="flex flex-col items-center justify-center py-12 space-y-3">
//                   <div className="w-9 h-9 border-4 border-[#0284c7] border-t-transparent rounded-full animate-spin"></div>
//                   <p className="text-sm text-gray-500 font-medium">جاري تحديث الكوبونات...</p>
//                 </div>
//               )}

//               {error && (
//                 <p className="text-center text-red-500 text-sm font-medium py-4">{error}</p>
//               )}

//               {!loading && !error && coupons.length === 0 && (
//                 <p className="text-center text-gray-500 py-8 text-sm">لا توجد كوبونات نشطة في الوقت الحالي.</p>
//               )}

//               {!loading && !error && coupons.map((coupon) => (
//                 <div 
//                   key={coupon._id}
//                   className="flex items-center justify-between p-4 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 hover:border-[#0284c7]/40 transition-all duration-200"
//                 >
//                   <div className="space-y-1">
//                     <span className="inline-block px-3 py-1 bg-[#0284c7]/10 text-[#0284c7] font-mono font-bold text-sm rounded-lg uppercase tracking-wider">
//                       {coupon.code}
//                     </span>
//                     <p className="text-[11px] text-gray-400">
//                       {coupon.expiresAt ? `ينتهي: ${new Date(coupon.expiresAt).toLocaleDateString('ar-EG')}` : 'صالح لفترة محدودة'}
//                     </p>
//                   </div>

//                   <div className="text-left flex flex-col items-end">
//                     <span className="text-2xl font-black text-gray-800">
//                       {coupon.discount}% <span className="text-xs font-normal text-gray-500">خصم</span>
//                     </span>
//                     <button
//                       onClick={() => handleSelectCoupon(coupon.code)}
//                       className="mt-1.5 text-xs font-bold text-[#0284c7] hover:text-[#0369a1] hover:underline"
//                     >
//                       نسخ الكوبون 
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
//               <button
//                 onClick={() => setIsOpen(false)}
//                 className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors bg-white border border-gray-200 rounded-xl shadow-sm"
//               >
//                 إلغاء
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CategoryPromos;