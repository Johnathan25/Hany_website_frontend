import { useEffect, useState, useMemo } from "react";
import { FaSpinner, FaStar, FaSearch, FaUser, FaCalendarAlt, FaFilter, FaQuoteRight } from "react-icons/fa";
import api from "../../../services/api";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  // ستايتس الـ Pagination الجديدة
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // إرسال رقم الصفحة والـ limit للباك إند
      const res = await api.get("/review/getReviews", {
        params: {
          page: currentPage,
          limit: 10
        }
      });
      
      setReviews(res.data.data || []);
      setTotalPages(res.data.pagination.totalPages || 0);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  // إعادة جلب البيانات عند تغير الصفحة الحالية
  useEffect(() => { 
    fetchReviews(); 
  }, [currentPage]);

  // الفلترة والبحث محلياً بناءً على الـ 10 عناصر المعروضة في الصفحة الحالية
  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const productName = review.productId?.productName?.toLowerCase() || "";
      const userName = review.userId?.userName?.toLowerCase() || "زائر";
      return (productName.includes(searchTerm.toLowerCase()) || userName.includes(searchTerm.toLowerCase())) &&
             (ratingFilter === "all" || review.rating === parseInt(ratingFilter));
    });
  }, [reviews, searchTerm, ratingFilter]);

  return (
    <div className="p-6 md:p-10 min-h-screen text-right" dir="rtl">
      <div className="mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">سجل التقييمات</h1>
            <p className="text-slate-500 mt-2 text-sm">إدارة ومراجعة آراء العملاء حول المنتجات</p>
          </div>

          <div className="flex items-center gap-3">
            {/* <div className="relative">
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input 
                type="text" 
                placeholder="بحث في الصفحة الحالية..." 
                className="pr-10 pl-4 py-2.5 w-64 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-blue-500 transition-all -sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div> */}
            <div className="relative">
              <FaFilter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <select 
                className="pr-10 pl-8 py-2.5 border border-slate-200 rounded-lg bg-white text-sm outline-none cursor-pointer appearance-none -sm focus:border-blue-500"
                onChange={(e) => setRatingFilter(e.target.value)}
              >
                <option value="all">جميع التقييمات</option>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} نجوم</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Table / Grid Section */}
        <div className="bg-white rounded-lg -xl border border-slate-100 overflow-auto max-h-screen">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase font-bold">
                <th className="px-8 py-5">المنتج والعميل</th>
                <th className="px-8 py-5 w-1/3">التعليق</th>
                <th className="px-8 py-5 text-center">التقييم</th>
                <th className="px-8 py-5 text-center">التاريخ</th>
                <th className="px-8 py-5 text-center">تفاصيل العميل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <FaSpinner className="animate-spin inline text-blue-600 text-2xl" />
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                          {review.productId?.productName || "منتج محذوف"}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">
                            <FaUser />
                          </div>
                          {review.userId?.userName || "زائر"}
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="relative group/comment max-w-md">
                        <FaQuoteRight className="absolute -right-4 -top-2 text-slate-100 text-xl group-hover/comment:text-blue-50 transition-colors" />
                        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 group-hover/comment:line-clamp-none transition-all duration-300">
                          {review.comment || "لا يوجد تعليق"}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-center">
                      <div className="flex justify-center items-center gap-1 bg-slate-50 w-fit mx-auto px-3 py-1.5 rounded-full border border-slate-100">
                        <span className="text-xs font-bold text-slate-700 ml-1">{review.rating}</span>
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`text-[10px] ${i < review.rating ? "text-amber-400" : "text-slate-200"}`} />
                        ))}
                      </div>
                    </td>

                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/50 text-blue-600 text-[11px] font-bold">
                        {review.createdAt && new Date(review.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>

                    <td className="px-8 py-6">
                      <div className="flex justify-center items-center w-full">
                        {review.userId?._id ? (
                          <button 
                            onClick={() => navigate(`/admin_dashboard/customers/${review.userId._id}`)} 
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض الحساب"
                          >
                            <Eye className="text-blue-500 text-xl cursor-pointer" />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">غير متاح (زائر)</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {!loading && filteredReviews.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium">لا توجد تقييمات مطابقة للبحث في هذه الصفحة</p>
            </div>
          )}
        </div>

        {/* أزرار الـ Pagination أسفل الجدول */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6 pb-8" dir="ltr">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
              السابق
            </button>
            
            <span className="text-slate-600 font-bold px-4">
              صفحة {currentPage} من {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-bold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
              التالي
            </button>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        body { font-family: 'Cairo', sans-serif; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;  
          overflow: hidden;
        }
      `}} />
    </div>
  );
}