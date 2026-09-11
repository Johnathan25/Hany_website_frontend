import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import ProductCard from '../products/productCard';

const BestSellersCard = () => {
  const [bestSellers, setBestSellers] = useState(JSON.parse(localStorage.getItem("bestSellers")) || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(false);
        const response = await api.get('/order/bestSeller');
        if (response.data.success) {
          setBestSellers(response.data.data);
          localStorage.setItem("bestSellers", JSON.stringify(response.data.data));
        }
      } catch (err) {
        console.error("Error fetching best sellers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  // Skeleton المحسن ليتناسب مع أبعاد ProductCard الثابتة
  const Skeleton = () => (
    <div className="bg-white border border-slate-100 rounded-xl w-64 h-[460px] animate-pulse p-4">
      <div className="bg-slate-100 h-52 w-full rounded-lg mb-4"></div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-100 rounded w-1/3"></div>
        <div className="h-5 bg-slate-100 rounded w-full"></div>
        <div className="h-14 bg-slate-50 rounded w-full"></div>
        <div className="h-8 bg-slate-100 rounded w-full"></div>
        <div className="h-10 bg-slate-100 rounded w-full"></div>
      </div>
    </div>
  );

  return (
  <section className="py-12 bg-white" dir="rtl">
    {bestSellers.length> 0   &&    <div className=" mx-auto px-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div  data-aos="fade-down" className="flex items-start gap-4">
            <div className="w-14 h-14 bg-[#0284c7] -500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h2  data-aos="fade-left" className="text-3xl font-black text-slate-900">الأكثر مبيعاً</h2>
              <p className="text-slate-500 font-bold mt-1">المنتجات التي نالت ثقة عملائنا هذا الأسبوع</p>
            </div>
          </div>
          
          <div className="hidden md:block">
            <span className="text-xs bg-white border border-slate-200 px-4 py-2 rounded-full font-black text-slate-400">
              تحديث تلقائي كل 24 ساعة
            </span>
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-8 justify-items-center">
          {(loading && bestSellers.length==0 ) ? (
            // عرض 5 كروت Skeleton أثناء التحميل
            Array(5).fill(0).map((_, i) => <Skeleton key={i} />)
          ) : (
            bestSellers.map((item) => (
              <ProductCard
                key={item.product._id}
                product={item.product}
                isLast={false}
                lastProductElementRef={null}
              />
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && bestSellers.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-bold text-xl">لا توجد بيانات متاحة حالياً</p>
          </div>
        )}
      </div>}
    </section>
  );
};

export default BestSellersCard;