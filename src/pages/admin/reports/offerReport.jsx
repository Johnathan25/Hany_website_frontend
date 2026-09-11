import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Tag, 
  Layers, 
  ShoppingBag, 
  DollarSign, 
  Hash, 
  BarChart3, 
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import api from '../../../services/api';

export default function OffersCombosReport() {

  const [activeTab, setActiveTab] = useState('offers'); 
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const fetchReport = async (type) => {
  setLoading(true);
  setError(null);
  try {

    const endpoint = type === 'offers' 
      ? '/reports/getOffersReport' 
      : '/reports/getCombosReport';
    

    const response = await api.get(endpoint);

    const data = response.data;

    if (data.success) {
      setReportData(type === 'offers' ? data.offers : data.combos);
    } else {
      throw new Error(data.error || 'فشل في جلب البيانات');
    }
  } catch (err) {
    console.error(err);

    const errorMessage = err.response?.data?.error || err.message || 'حدث خطأ أثناء الاتصال بالخادم';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  
  useEffect(() => {
    fetchReport(activeTab);
  }, [activeTab]);


  const totalRevenueAll = reportData.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0);
  const totalUnitsSold = reportData.reduce((acc, curr) => acc + (curr.totalSold || 0), 0);
  const totalOrdersCount = reportData.reduce((acc, curr) => acc + (curr.ordersCount || 0), 0);

  return (
    <div className="p-6  mx-auto space-y-7 direction-rtl" dir="rtl">
   
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-600" />
            تقارير الأداء والمبيعات
          </h1>
          <p className="text-xs text-gray-500">متابعة وتحليل مبيعات العروض الترويجية وباقات الكومبو</p>
        </div>

        {/* أزرار التبديل والتحديث */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="bg-gray-100/80 p-1 rounded-xl flex items-center gap-1 flex-1 sm:flex-none">
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none ${
                activeTab === 'offers'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              العروض الترويجية
            </button>
            <button
              onClick={() => setActiveTab('combos')}
              className={`flex items-center justify-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-all duration-200 flex-1 sm:flex-none ${
                activeTab === 'combos'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              باقات الكومبو
            </button>
          </div>

          <button
            onClick={() => fetchReport(activeTab)}
            disabled={loading}
            className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-700 transition disabled:opacity-50"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* كروت الإحصائيات السريعة (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* كارت إجمالي الإيرادات */}


        {/* كارت الكميات المباعة */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-400">إجمالي الكميات المباعة</p>
            <h3 className="text-xl font-black text-gray-800">
              {loading ? '...' : `${totalUnitsSold.toLocaleString('ar-EG')} وحدة`}
            </h3>
          </div>
        </div>

        {/* كارت عدد مرات الطلب */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Hash className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-gray-400">عدد الطلبات المتضمنة</p>
            <h3 className="text-xl font-black text-gray-800">
              {loading ? '...' : `${totalOrdersCount.toLocaleString('ar-EG')} طلب`}
            </h3>
          </div>
        </div>
      </div>

      {/* جدول استعراض التقارير بالتفصيل */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-sky-600" />
            ترتيب المبيعات والأعلى رواجاً حسب الإيرادات
          </h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 space-y-3">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
            <p className="text-xs font-medium">جاري تحليل الطلبات وتوليد التقرير...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-rose-500 space-y-2">
            <AlertCircle className="w-10 h-10" />
            <p className="text-sm font-bold">فشل تحميل التقرير</p>
            <p className="text-xs text-gray-400">{error}</p>
          </div>
        ) : reportData.length === 0 ? (
          <div className="text-center py-24 text-gray-400 space-y-2">
            <ShoppingBag className="w-12 h-12 mx-auto text-gray-200" />
            <p className="text-sm font-medium">لا توجد مبيعات مسجلة لهذا التصنيف حالياً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3.5 px-5 w-16 text-center">الترتيب</th>
                  <th className="py-3.5 px-4">اسم {activeTab === 'offers' ? 'العرض' : 'الكومبو'}</th>
                  <th className="py-3.5 px-4 text-center">الكمية المباعة</th>
                  <th className="py-3.5 px-4 text-center">عدد الطلبات</th>
                  {/* <th className="py-3.5 px-5 text-left">إجمالي الإيرادات</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {reportData.map((item, index) => (
                  <tr key={index} className="hover:bg-sky-50/20 transition-colors group">
                    {/* الترتيب الرقمي */}
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-[10px] ${
                        index === 0 ? 'bg-amber-100 text-amber-700' :
                        index === 1 ? 'bg-slate-100 text-slate-700' :
                        index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'
                      }`}>
                        {index + 1}
                      </span>
                    </td>

                    {/* الاسم المعرف (العنوان) */}
                    <td className="py-4 px-4 font-bold text-gray-800 group-hover:text-sky-950">
                      {item._id || <span className="text-gray-400 font-normal italic">بدون اسم مسجل</span>}
                    </td>

                    {/* إجمالي القطع أو الوحدات المباعة */}
                    <td className="py-4 px-4 text-center font-medium text-gray-600">
                      <span className="bg-gray-100 px-2 py-1 rounded-md text-[11px] text-gray-700">
                        {item.totalSold?.toLocaleString('ar-EG')} وحدة
                      </span>
                    </td>

                    {/* عدد الفواتير/الطلبات المشترية */}
                    <td className="py-4 px-4 text-center font-medium text-gray-600">
                      {item.ordersCount?.toLocaleString('ar-EG')} طلب
                    </td>

                    {/* صافي مبيعات هذا العرض الخيار المالي الأهم */}
                    {/* <td className="py-4 px-5 text-left font-black text-emerald-600 text-sm">
                      {item.totalRevenue?.toLocaleString('ar-EG')} ج.م
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}