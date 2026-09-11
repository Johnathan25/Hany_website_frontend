import React, { useState, useEffect } from "react";
import api from "../../../services/api";

const CouponSelector = ({ onSelectCoupon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


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

  const handleOpenModal = () => {
    setIsOpen(true);
    fetchCoupons();
  };


  const handleSelect = (code) => {
    onSelectCoupon(code); 
    setIsOpen(false); 
  };

  return (
    <div className="w-full max-w-md dir-rtl" dir="rtl">
   
      <button
        onClick={handleOpenModal}
        type="button"
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0284c7] hover:bg-[#0369a1] text-white font-medium rounded-lg shadow-sm transition-colors duration-200 w-full md:w-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a2.25 2.25 0 0 0 3.181 0l5.141-5.141a2.25 2.25 0 0 0 0-3.181l-9.58-9.581A2.25 2.25 0 0 0 9.568 3Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
        عرض الكوبونات المتاحة
      </button>

      {/* النافذة المنبثقة (Modal) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
            
            {/* الهيدر بتاع المودال */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">الكوبونات المتاحة لك</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* محتوى المودال (قائمة الكوبونات) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {loading && (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <div className="w-8 h-8 border-4 border-[#0284c7] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-500">جاري البحث عن كوبونات...</p>
                </div>
              )}

              {error && (
                <p className="text-center text-red-500 text-sm py-4">{error}</p>
              )}

              {!loading && !error && coupons.length === 0 && (
                <p className="text-center text-gray-500 py-6">للأسف، لا توجد كوبونات متاحة حالياً.</p>
              )}

              {!loading && !error && coupons.map((coupon) => (
                <div 
                  key={coupon._id}
                  className="flex items-center justify-between p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-[#0284c7]/50 bg-gray-50/50 transition-all duration-200"
                >
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#0284c7]/10 text-[#0284c7] font-mono font-bold text-sm rounded-md tracking-wider">
                      {coupon.code}
                    </span>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {coupon.expiresAt ? `ينتهي في: ${new Date(coupon.expiresAt).toLocaleDateString('ar-EG')}` : 'صالح لفترة محدودة'}
                    </p>
                  </div>

                  <div className="text-left">
                    <span className="block text-xl font-black text-gray-800">
                      {coupon.discount}% <span className="text-xs font-normal text-gray-500">خصم</span>
                    </span>
                    <button
                      onClick={() => handleSelect(coupon.code)}
                      className="mt-2 text-xs font-semibold text-[#0284c7] hover:text-[#0369a1] underline underline-offset-4"
                    >
                      تطبيق الآن
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* الفوتر */}
            <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CouponSelector;