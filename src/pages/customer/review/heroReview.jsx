import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// استيراد استايلات Swiper
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const BestReviews = () => {
  const [reviews, setReviews] = useState([]);
  // 1. تغيير الحالة الابتدائية لـ loading إلى true
  const [loading, setLoading] = useState(true);

  const fallbackReviews = [
    {
      _id: "fake1",
      userId: { userName: "أحمد محمد" },
      rating: 5,
      comment: "خدمة ممتازة ومنتجات ذات جودة عالية جداً، سأكرر التجربة بالتأكيد.",
      productId: { productName: "أطياب دجاج" }
    },
    {
      _id: "fake2",
      userId: { userName: "سارة محمود" },
      rating: 4,
      comment: "التوصيل سريع جداً والمنتجات وصلت مغلفة بشكل جيد.",
      productId: { productName: "كوكي بانيه" }
    },
    {
      _id: "fake3",
      userId: { userName: "مينا يوسف" },
      rating: 5,
      comment: "أفضل سعر مقابل جودة، شكراً لفريق العمل على الرقي في التعامل.",
      productId: { productName: "حلواني إخوان" }
    }
  ];

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    const fetchBestReviews = async () => {
      try {
        setLoading(true); // تأكيد بدء التحميل
        const res = await api.get("/review/getBestReviews");
        if (res.data && res.data.data && res.data.data.length > 0) {
          setReviews(res.data.data);
        } else {
          setReviews(fallbackReviews);
        }
      } catch (err) {
        console.error("Error:", err);
        setReviews(fallbackReviews);
      } finally {
        setLoading(false); // إنهاء التحميل
      }
    };
    fetchBestReviews();
  }, []);

  const StarRating = ({ rating }) => (
    <div className="flex gap-1 justify-center mb-6">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );

  // إذا كان يحمل، نعرض مؤشر التحميل
  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0284c7]"></div>
    </div>
  );

  // إذا لم توجد بيانات بعد التحميل
  if (reviews.length === 0) return null;

  return (
    <>
      <div data-aos="zoom-in"  className="text-center mt-16 mb-8">
        <span data-aos="zoom-out"  className="text-[#0284c7] font-bold text-sm tracking-widest uppercase">تجارب حقيقية</span>
        <h2   data-aos="zoom-in"  className="text-4xl font-black text-gray-900 mt-2 mb-4">آراء <span className="text-[#0284c7]">عملائنا</span> المميزين</h2>
        <div className="w-20 h-1.5 bg-[#0284c7] mx-auto rounded-full"></div>
      </div>

      <section className="mb-16 py-12 bg-[#0284c7]/5 overflow-hidden" dir="rtl">
        <div className="container mx-auto px-6 relative">
          
          {/* أزرار التنقل - تأكد من الكلاسات swiper-prev-custom */}
          <button className="swiper-prev-custom absolute right-2 md:right-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-400 hover:border-[#0284c7] hover:text-[#0284c7] transition-all shadow-sm">
            <ChevronRight className="w-6 h-6" />
          </button>
          <button className="swiper-next-custom absolute left-2 md:left-10 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-[#2d4a43] flex items-center justify-center text-white hover:bg-[#0284c7] transition-all shadow-sm">
            <ChevronLeft className="w-6 h-6" />
          </button>

          <Swiper
            modules={[Autoplay, Pagination, Navigation, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            slidesPerView={1}
            loop={reviews.length > 1} // لا يعمل اللوب إلا إذا كان هناك أكثر من عنصر
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ 
                clickable: true, 
                el: '.custom-pagination' 
            }}
            navigation={{
              nextEl: '.swiper-next-custom',
              prevEl: '.swiper-prev-custom',
            }}
            className="max-w-4xl mx-auto"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review._id}>
                <div className="text-center px-4 md:px-20 py-10">
                  <StarRating rating={review.rating} />
                  <p className="text-gray-700 text-xl md:text-2xl leading-relaxed font-medium mb-10 italic">
                    "{review.comment}"
                  </p>
                  <div className="flex flex-col items-center">
                    <img 
                      src={review.userId?.profileImg || defaultAvatar} 
                      alt={review.userId?.userName}
                      className="w-16 h-16 rounded-full object-cover mb-4 border-2 border-white shadow-md"
                      onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                    <h4 className="text-lg font-bold text-gray-900">
                      {review.userId?.userName || "عميل رائع"}
                    </h4>
                    <p className="text-sm text-[#0284c7] font-semibold mt-1">
                      {review.productId?.productName || "مراجعة عامة"}
                    </p>
                      <p className="text-sm text-[#0284c7] font-semibold mt-1">
                      {review.productId?.description || "مراجعة عامة"}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="custom-pagination flex justify-center gap-2 mt-6"></div>

          <div className="absolute bottom-4 left-10 md:left-20 opacity-10 pointer-events-none hidden md:block">
             <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
                <path d="M40 0H0V40H20C20 60 10 70 0 80V100C30 90 40 70 40 40V0ZM120 0H80V40H100C100 60 90 70 80 80V100C110 90 120 70 120 40V0Z" fill="#0284c7"/>
             </svg>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .swiper-pagination-bullet {
            width: 8px;
            height: 8px;
            background: #ccc !important;
            opacity: 1;
          }
          .swiper-pagination-bullet-active {
            background: #0284c7 !important;
            width: 20px !important;
            border-radius: 4px !important;
          }
          .custom-pagination {
            position: relative !important;
          }
        `}} />
      </section>
    </>
  );
};

export default BestReviews;