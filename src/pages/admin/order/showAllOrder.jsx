import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Package, 
  Truck, 
  LayoutGrid,
  Clock,
  Eye,
  Printer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { showAlert } from '../../../services/alert';
import api from '../../../services/api';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, delivered: 0, active: 0 });
  const [tabCounts, setTabCounts] = useState({ all: 0, pending: 0, confirmed: 0, shipped: 0, delivered: 0, cancelled: 0 });

  const navigate = useNavigate();

  const statusConfig = {
    pending: { label: 'قيد الانتظار', color: 'text-amber-600', bg: 'bg-amber-100' },
    confirmed: { label: 'تم التأكيد', color: 'text-blue-600', bg: 'bg-blue-100' },
    shipped: { label: 'تم الشحن', color: 'text-indigo-600', bg: 'bg-indigo-100' },
    delivered: { label: 'تم التوصيل', color: 'text-emerald-600', bg: 'bg-emerald-100' },
    cancelled: { label: 'ملغي', color: 'text-rose-600', bg: 'bg-rose-100' },
  };

  // دالة جلب البيانات مع تمرير رقم الصفحة كـ Parameter لضمان عدم التضارب
  const fetchOrders = async (pageToFetch = currentPage) => {
    try {
      setLoading(true);
      const res = await api.get(`/order/all?page=${pageToFetch}&limit=10&status=${activeTab}&search=${searchTerm}`);
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
      if (res.data.stats) setStats(res.data.stats);
      if (res.data.tabCounts) setTabCounts(res.data.tabCounts);
    } catch (err) {
      showAlert({ title: "خطأ في جلب البيانات", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  // دالة التعامل مع تغيير التبويبات (تنقل المستخدم فوراً للصفحة 1 وتجلب بيانات التبويب الجديد)
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
    // جلب البيانات فوراً للتبويب الجديد والصفحة الأولى
    // ملحوظة: fetchOrders ستستخدم الـ activeTab الجديد هنا إذا أردت تمريره مباشرة أو الاعتماد على الـ useEffect أدناه
  };

  // العودة للصفحة الأولى فقط عند تغيير التبويب أو عند تغيير نص البحث (بدون useEffect مستقل ومتداخل)
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  // تنفيذ جلب البيانات مع تطبيق Debounce للبحث، وبدون تأخير عند تقليب الصفحات العادي
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders(currentPage);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, activeTab, searchTerm]);

  return (
    <div className="p-6 min-h-screen text-slate-700" dir="rtl">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-lg text-slate-400 mb-6">
        <LayoutGrid size={16} />
        <span>لوحة التحكم</span>
        <span>{'>'}</span>
        <span className="text-slate-600 font-medium">قائمة الطلبات</span>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">الطلبات</h1>
        <p className="text-slate-500 text-lg">إدارة وتتبع جميع عمليات الشراء والطلبات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Package size={24} /></div>
          <div>
            <p className="text-slate-400 text-lg mb-1">إجمالي الطلبات</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><Truck size={24} /></div>
          <div>
            <p className="text-emerald-700/60 text-lg mb-1">طلبات مكتملة</p>
            <p className="text-2xl font-bold text-emerald-700">{stats.delivered}</p>
          </div>
        </div>
        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><Clock size={24} /></div>
          <div>
            <p className="text-amber-700/60 text-lg mb-1">طلبات نشطة</p>
            <p className="text-2xl font-bold text-amber-700">{stats.active}</p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-6">
        {/* Dynamic Tabs */}
        <div className="flex gap-4 border-b border-slate-200 text-lg font-medium overflow-x-auto no-scrollbar whitespace-nowrap pb-px">
          <button
            onClick={() => handleTabChange('all')}
            className={`pb-4 px-2 cursor-pointer transition-all ${activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            الكل <span className="text-lg opacity-50">({tabCounts.all})</span>
          </button>
          {Object.keys(statusConfig).map((key) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`pb-4 px-2 cursor-pointer transition-all ${activeTab === key ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {statusConfig[key].label}
              <span className="mr-1 text-lg opacity-50">
                ({tabCounts[key] || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="flex gap-3">
          <div className="relative flex-1 w-full xl:w-80">
            <Search className="absolute right-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              placeholder="ابحث بالاسم، الرقم، أو الهاتف..."
              className="w-full pr-9 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // تصفير الصفحة فوراً عند بدء الكتابة لمنع مشاكل الـ Pagination
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 font-medium text-lg">جاري جلب البيانات...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto p-3">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-lg font-bold uppercase tracking-widest">
                    <th className="p-5 border-b border-slate-100">تفاصيل العميل والطلب</th>
                    <th className="p-5 border-b border-slate-100">تاريخ الطلب</th>
                    <th className="p-5 border-b border-slate-100">قيمة الطلب</th>
                    <th className="p-5 border-b border-slate-100">حالة الدفع</th>
                    <th className="p-5 border-b border-slate-100">حالة الطلب</th>
                    <th className="p-5 text-center border-b border-slate-100">الاجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                             <Package size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-md mb-0.5">{order.customerName}</p>
                            <p className="text-md text-slate-400 tracking-tighter flex items-center gap-1">
                              <span className="inline-block w-1 h-1 rounded-full bg-slate-300"></span>
                              {order.orderNumber}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="text-md text-slate-600 font-medium">
                          {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="p-5 font-bold text-md text-slate-900 text-left" dir="ltr">
                        {order.finalPrice?.toLocaleString()} <span className="text-md text-slate-400">EGP</span>
                      </td>
                      <td className="p-5">
                        <span className={`text-md font-bold px-2 py-0.5 rounded-full ${order.payment?.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : order.payment?.status === 'rejected' ? "bg-rose-50 text-rose-600" : 'bg-rose-50 text-rose-600'}`}>
                          {order.payment?.status === 'paid' ? 'مدفوع' : order.payment?.status === 'rejected' ? "مرفوض" : 'غير مدفوع' }
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-md font-bold inline-block ${statusConfig[order.status]?.bg || 'bg-slate-100'} ${statusConfig[order.status]?.color || 'text-slate-500'}`}>
                          {statusConfig[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <div className='flex justify-center gap-1'>
                          <button 
                            onClick={() => navigate(`${order._id}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="عرض تفاصيل الطلب"
                          >
                            <Eye size={20} />
                          </button>

                          <button 
                            onClick={() => navigate(`/admin_dashboard/order/${order._id}`)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="طباعة الفاتورة"
                          >
                            <Printer size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {orders.length === 0 && (
              <div className="py-24 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search size={32} className="text-slate-200" />
                </div>
                <h3 className="text-slate-800 font-bold text-lg">لم نعثر على أي طلبات!</h3>
                <p className="text-slate-400 text-lg max-w-xs mx-auto">لا توجد بيانات تطابق الفلاتر المختارة حالياً.</p>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-around  bg-slate-50/50 gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight size={16} />  السابق
                </button>
                
                <span className="text-sm font-bold text-slate-500">
                  الصفحة {currentPage} من {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  التالي <ChevronLeft size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersList;