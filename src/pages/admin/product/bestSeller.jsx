import { useEffect, useState } from "react";
import { 
  FaSpinner, FaFire, FaSearch, FaChartLine, 
  FaShoppingBag, FaDollarSign, FaBox, FaArrowUp, FaListOl 
} from "react-icons/fa";
import api from "../../../services/api";

export default function BestSellerAdmin() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // حالات خاصة بإحصائيات الكروت العلوية
  const [stats, setStats] = useState({ totalSoldAll: 0, totalRevenueAll: 0 });

  const fetchBestSellers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/order/bestSellerAdmin");
      const data = res.data.data || [];
      
      setProducts(data);
      setFilteredProducts(data);

      // حساب الإحصائيات العامة للمنتجات المعروضة
      const totalSoldAll = data.reduce((acc, item) => acc + (item.totalSold || 0), 0);
      const totalRevenueAll = data.reduce((acc, item) => acc + (item.totalRevenue || 0), 0);
      setStats({ totalSoldAll, totalRevenueAll });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  // فلترة البحث بناءً على اسم المنتج أو الوصف
  useEffect(() => {
    const results = products.filter(product =>
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-" dir="rtl">
      
      {/* ─── الهيدر العلوي ─── */}
      <div className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
              <FaFire className="text-2xl animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              تحليل المنتجات الأكثر مبيعاً
            </h2>
          </div>
          <p className="text-slate-400 text-sm font-medium mr-11">متابعة دقيقة لأداء وحجم مبيعات المنتجات الأعلى طلباً</p>
        </div>

        {/* حقل البحث العصري */}
        <div className="relative w-full lg:w-96">
          <span className="absolute inset-y-0 right-4 flex items-center text-slate-400">
            <FaSearch className="text-sm" />
          </span>
          <input
            type="text"
            placeholder="ابحث باسم المنتج أو الوصف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-11 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {/* ─── كروت الإحصائيات السريعة (Stats Cards) ─── */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* كارت عدد المنتجات */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">إجمالي الأصناف</p>
              <h3 className="text-2xl font-black text-slate-800">{filteredProducts.length} صنف</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">
              <FaBox />
            </div>
          </div>

          {/* كارت إجمالي القطع المباعة */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">إجمالي الكميات المباعة</p>
              <h3 className="text-2xl font-black text-slate-800">{stats.totalSoldAll.toLocaleString()} قطعة</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">
              <FaShoppingBag />
            </div>
          </div>

          {/* كارت إجمالي الإيرادات */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">إجمالي عوائد المبيعات</p>
              <h3 className="text-2xl font-black text-blue-600">{stats.totalRevenueAll.toLocaleString("ar-EG", { minimumFractionDigits: 2 })} ج.م</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl">
              <FaDollarSign />
            </div>
          </div>
        </div>
      )}

      {/* ─── منطقة الجدول والبيانات ─── */}
      <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden">
        
        {loading ? (
          <div className="flex flex-col justify-center items-center h-80 space-y-4">
            <FaSpinner className="animate-spin text-blue-500 text-4xl" />
            <p className="text-slate-500 text-sm font-semibold">جاري جلب وتحليل بيانات المبيعات...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-28 text-slate-400">
             <FaChartLine className="mx-auto mb-4 opacity-20 text-6xl text-slate-400" />
             <p className="text-base font-medium text-slate-500">{searchTerm ? "لا توجد نتائج مطابقة لبحثك" : "لا توجد بيانات مبيعات كافية حالياً"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100">
                  <th className="p-4 text-slate-500 font-bold text-xs uppercase tracking-wider text-center w-24">الترتيب</th>
                  <th className="p-4 text-slate-500 font-bold text-xs uppercase tracking-wider">تفاصيل المنتج</th>
                  <th className="p-4 text-slate-500 font-bold text-xs uppercase tracking-wider text-center">الكمية المباعة</th>
                  <th className="p-4 text-slate-500 font-bold text-xs uppercase tracking-wider text-center">إجمالي الإيرادات</th>
                  <th className="p-4 text-slate-500 font-bold text-xs uppercase tracking-wider text-center">مؤشر الأداء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((item, index) => {
                  // تنسيقات مميزة للمراكز الثلاثة الأولى
                  const isTop3 = index < 3;
                  const badgeColors = [
                    "bg-amber-50 text-amber-600 border border-amber-200", // الأول (ذهبي)
                    "bg-slate-100 text-slate-700 border border-slate-300", // الثاني (فضي)
                    "bg-orange-50 text-orange-700 border border-orange-200" // الثالث (برونزي)
                  ];

                  return (
                    <tr
                      key={item._id}
                      className="group hover:bg-slate-50/80 transition-all duration-150"
                    >
                      {/* الترتيب */}
                      <td className="p-4 text-center">
                         <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black shadow-sm ${
                           isTop3 ? badgeColors[index] : 'bg-slate-50 text-slate-500 border border-slate-100'
                         }`}>
                           {index + 1}
                         </span>
                      </td>

                      {/* اسم المنتج والوصف والـ ID */}
                      <td className="p-4">
                        <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors text-sm">
                          {item.productName}
                        </div>
                        {item.description && (
                          <div className="text-xs text-slate-400 mt-1 font-medium max-w-md truncate">
                            {item.description}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-300 font-mono mt-0.5">
                          ID: {item._id}
                        </div>
                      </td>

                      {/* الكمية المباعة */}
                      <td className="p-4 text-center">
                        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                          {item.totalSold} قطعة
                        </span>
                      </td>

                      {/* إجمالي الإيرادات */}
                      <td className="p-4 text-center">
                        <span className="text-sm font-black text-slate-800">
                          {item.totalRevenue?.toLocaleString("ar-EG", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold mr-1">ج.م</span>
                      </td>

                      {/* مؤشر الأداء والحالة */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            index === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                          }`}>
                            <FaArrowUp className="text-[10px]" />
                            {index === 0 ? "الأعلى طلباً" : "مبيعات نشطة"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── الفوتر العلوي الحديث ─── */}
        <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-bold text-slate-400">
          <div className="flex items-center gap-1">
            <FaListOl className="text-slate-400 text-sm" />
            <span>معروض حالياً: {filteredProducts.length} من أصل {products.length} صنف</span>
          </div>
          <span className="bg-white px-3 py-1 border border-slate-200 rounded-full shadow-sm text-slate-500 font-medium">
             يتم التحديث والتصنيف تلقائياً بناءً على حركة الفواتير الحالية
          </span>
        </div>
      </div>
    </div>
  );
}