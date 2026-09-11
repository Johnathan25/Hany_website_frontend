import React, { useState, useEffect, useRef } from "react";
import api from "../../../services/api";
import { Users, ShoppingBag, DollarSign, TrendingUp, Filter, RefreshCcw, Search, ChevronDown } from "lucide-react";

const ReportsPage = () => {
  const [data, setData] = useState({
    summary: {},
    unitStats: {},
    products: []
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // حالات الفلترة المرسلة للباك إند
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    status: "all",
    userId: ""
  });

  // حالات خاصة بالبحث والتحكم بقائمة العملاء المتطورة
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // حالة البحث المحلي داخل جدول أداء المنتجات (الاسم والوصف)
  const [productSearchQuery, setProductSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/reports/getUserName");
      setUsers(res.data?.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports", { params: filters });
      setData({
        summary: res.data.summary || {},
        unitStats: res.data.unitStats || {},
        products: res.data.products || []
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchReports();

    // إغلاق قائمة العملاء عند النقر خارجها
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // فلترة قائمة العملاء بناءً على كتابة المستخدم
  const filteredUsers = users.filter((u) =>
    u.userName?.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  // فلترة جدول أداء المنتجات محلياً بناءً على الاسم أو الوصف
  const filteredProductsTable = data.products.filter((p) => {
    const query = productSearchQuery.toLowerCase();
    const matchesName = p.productName?.toLowerCase().includes(query);
    const matchesDesc = p.description?.toLowerCase().includes(query);
    return matchesName || matchesDesc;
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-" dir="rtl">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <TrendingUp className="text-blue-600" />
          التقارير المتقدمة
        </h1>
        <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-full border shadow-sm">
          آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center gap-2 mb-4 text-gray-600 font-bold">
          <Filter size={18} />
          <span>أدوات تصفية الفواتير</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 mr-2 font-semibold">من تاريخ</label>
            <input type="date" name="from" onChange={handleChange} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 mr-2 font-semibold">إلى تاريخ</label>
            <input type="date" name="to" onChange={handleChange} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm" />
          </div>

          {/* فلتر العميل الذكي - البحث والكتابة بالاختيار المباشر */}
          <div className="flex flex-col gap-1 relative" ref={dropdownRef}>
            <label className="text-xs text-gray-400 mr-2 font-semibold">ابحث عن العميل</label>
            <div className="relative">
              <input
                type="text"
                placeholder="اكتب اسم العميل..."
                value={userSearchQuery}
                onFocus={() => setIsUserDropdownOpen(true)}
                onChange={(e) => {
                  setUserSearchQuery(e.target.value);
                  setIsUserDropdownOpen(true);
                  if (e.target.value === "") {
                    setFilters({ ...filters, userId: "" });
                  }
                }}
                className="w-full border border-gray-200 p-2.5 pl-8 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
              />
              <ChevronDown size={16} className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* القائمة المنسدلة المفلترة للعملاء */}
            {isUserDropdownOpen && (
              <div className="absolute top-full right-0 w-full bg-white border border-gray-100 mt-1 rounded-xl shadow-lg max-h-48 overflow-y-auto z-50 divide-y divide-gray-50">
                <div
                  onClick={() => {
                    setFilters({ ...filters, userId: "" });
                    setUserSearchQuery("كل العملاء");
                    setIsUserDropdownOpen(false);
                  }}
                  className="p-2.5 text-sm hover:bg-blue-50 cursor-pointer font-bold text-blue-600 transition-colors"
                >
                  كل العملاء
                </div>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <div
                      key={u._id}
                      onClick={() => {
                        setFilters({ ...filters, userId: u._id });
                        setUserSearchQuery(u.userName);
                        setIsUserDropdownOpen(false);
                      }}
                      className="p-2.5 text-sm hover:bg-slate-50 cursor-pointer text-gray-700 transition-colors"
                    >
                      {u.userName}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-xs text-gray-400 text-center">لا توجد أسماء مطابقة</div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 mr-2 font-semibold">حالة الطلب</label>
            <select name="status" onChange={handleChange} className="border border-gray-200 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white">
              <option value="all">كل الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="confirmed">تم التأكيد</option>
              <option value="shipped">تم الشحن</option>
              <option value="delivered">تم الاستلام</option>
            </select>
          </div>

          <button 
            onClick={fetchReports} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2 h-11 shadow-sm active:scale-95"
          >
            {loading ? <RefreshCcw className="animate-spin" size={18} /> : "تطبيق الفلترة"}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="إجمالي المبيعات" value={data.summary.totalSales} icon={<DollarSign className="text-green-600" />} color="bg-green-50" />
        <StatCard title="صافي الربح" value={data.summary.totalProfit} icon={<TrendingUp className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="عدد الطلبات" value={data.summary.totalOrders} icon={<ShoppingBag className="text-purple-600" />} color="bg-purple-50" />
        <StatCard title="إجمالي الوحدات" value={data.summary.totalItems} icon={<Users className="text-orange-600" />} color="bg-orange-50" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          
          {/* شريط عنوان الجدول المضاف إليه البحث المتقدم للمنتجات والوصف */}
          <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-gray-700">أداء المنتجات</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">مراقبة مبيعات وعوائد الأغذية والمجمدات</p>
            </div>
            
            {/* خانة البحث التفاعلي الفوري للمنتجات */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="ابحث هنا بالاسم أو الوصف..."
                value={productSearchQuery}
                onChange={(e) => setProductSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl pr-8 pl-3 py-2 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
              <Search size={14} className="absolute right-2.5 top-2.5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto max-h-screen overflow-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
                  <th className="p-4 font-bold uppercase">المنتج</th>
                  <th className="p-4 font-bold uppercase">الوصف</th>
                  <th className="p-4 font-bold uppercase text-center">الكمية المباعة</th>
                  <th className="p-4 font-bold uppercase">الإيرادات</th>
                  <th className="p-4 font-bold uppercase">الربح المحقق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {filteredProductsTable.length > 0 ? (
                  filteredProductsTable.map((p, i) => (
                    <tr key={i} className="hover:bg-blue-50/20 transition-colors">
                      <td className="p-4 font-bold text-gray-800">{p.productName}</td>
                      <td className="p-4 text-gray-500 font-medium">{p?.description || "---"}</td>
                      <td className="p-4 text-center">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-md font-bold text-gray-700">{p.totalSold}</span>
                      </td>
                      <td className="p-4 font-semibold text-gray-900">{Number(p.totalRevenue).toLocaleString()} ج.م</td>
                      <td className="p-4 text-emerald-600 font-bold">+{Number(p.totalProfit).toLocaleString()} ج.م</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-12 text-gray-400 font-medium">
                      لا توجد منتجات مطابقة للبحث أو الفلترة الحالية
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Units Stats Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
          <div className="mb-4">
            <h3 className="font-bold text-gray-700">إحصائيات الوحدات</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">توزيع المبيعات حسب التعبئة (كرتونة / قطعة)</p>
          </div>
          <div className="space-y-3 mt-4">
            {Object.entries(data.unitStats).length > 0 ? (
              Object.entries(data.unitStats).map(([k, v]) => (
                <div key={k} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100/70 transition-colors border border-gray-100">
                  <span className="text-gray-600 font-bold text-xs">{k}</span>
                  <span className="bg-white px-3 py-1 rounded-lg border shadow-xs font-black text-blue-600 text-xs">{v}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-6 text-xs">لا توجد إحصائيات وحدات متوفرة</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <h4 className="text-2xl font-black text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : (value || 0)} 
        </h4>
 
      </div>
      
      <div className={`${color} p-3.5 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
  </div>
);

export default ReportsPage;