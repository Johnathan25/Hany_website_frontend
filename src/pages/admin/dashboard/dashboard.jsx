import React, { useState, useEffect, useContext } from "react";
import api from "../../../services/api";
import { 
  Users, ShoppingBag, DollarSign, TrendingUp, 
  ArrowUpRight, UserPlus, Activity, Package, 
  AlertTriangle, LayoutGrid, CheckCircle2, XCircle
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { MyContext } from "../../../context/cartContext";
import { useNavigate } from "react-router-dom";



const Dashboard = () => {
  const [data, setData] = useState({
    summary: {},
    unitStats: {},
    products: [],
    extraStats: {
      users: { customer: {}, admin: {} },
      products: {},
      categories: []
    }
  });

    useEffect(() => {
    window.title= "لوحة التحكم - ابو الدهب";

  }, []);
  const navigate=useNavigate()
  const [loading, setLoading] = useState(false);
 
   const { notifications, notifyCount } = useContext(MyContext);

   console.log(notifications,notifyCount)
   
  ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);



// تحضير بيانات حركة المبيعات بناءً على المنتجات المتاحة
const salesMovementData = {
  labels: data.products.length > 0 
    ? data.products.map(p => p.productName) 
    : ['لا يوجد بيانات'],
  datasets: [
    {
      fill: true,
      label: 'إجمالي الإيرادات',
      data: data.products.map(p => p.totalRevenue),
      borderColor: '#3b82f6', // Blue
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    },
    {
      fill: true,
      label: 'صافي الربح',
      data: data.products.map(p => p.totalProfit),
      borderColor: '#10b981', // Emerald
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
    }
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', align: 'end', labels: { boxWidth: 10, font: { family: 'inherit' } } },
    tooltip: { rtl: true }
  },
  scales: {
    y: { beginAtZero: true, grid: { borderDash: [5, 5] } },
    x: { grid: { display: false } }
  }
};
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reports");
      setData(res.data);
    } catch (err) { 
      console.error("Error fetching reports:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // إعداد بيانات الرسم البياني للفئات
  const categoryChartData = {
    labels: data.extraStats.categories.map(c => c._id),
    datasets: [{
      label: 'عدد المنتجات',
      data: data.extraStats.categories.map(c => c.count),
      backgroundColor: [
        'rgba(59, 130, 246, 0.6)', 'rgba(16, 185, 129, 0.6)', 
        'rgba(249, 115, 22, 0.6)', 'rgba(139, 92, 246, 0.6)',
        'rgba(236, 72, 153, 0.6)', 'rgba(107, 114, 128, 0.6)'
      ],
      borderWidth: 1,
    }]
  };

  const getTimeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

  if (seconds < 60) return "الآن";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `منذ ${minutes} دقيقة`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;

  const days = Math.floor(hours / 24);
  return `منذ ${days} يوم`;
};

if (loading) {
  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen w-full overflow-x-hidden animate-pulse" dir="rtl">
      
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div className="space-y-3">
          <div className="h-8 w-64 bg-slate-200 rounded-xl"></div>
          <div className="h-4 w-80 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="hidden md:block h-4 w-32 bg-slate-100 rounded-lg"></div>
      </div>

      {/* Notifications Card Skeleton */}
      <div className="mb-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between mb-6">
          <div className="h-6 w-40 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-16 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 p-3 bg-slate-50/50 rounded-xl">
              <div className="w-2 h-2 mt-2 rounded-full bg-slate-200 shrink-0"></div>
              <div className="space-y-2 w-full">
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                <div className="h-2 bg-slate-100 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between mb-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
              <div className="w-12 h-5 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-100 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Inventory Skeleton */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100">
          <div className="h-5 w-32 bg-slate-200 rounded mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-slate-100 rounded"></div>
                  <div className="h-3 w-8 bg-slate-200 rounded"></div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100">
          <div className="h-5 w-40 bg-slate-200 rounded mb-6"></div>
          <div className="h-[250px] w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-slate-300">
             <LayoutGrid size={40} />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 h-16 flex items-center">
           <div className="h-5 w-48 bg-slate-200 rounded"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50">
              <div className="space-y-2">
                <div className="h-4 w-40 bg-slate-200 rounded"></div>
                <div className="h-3 w-24 bg-slate-100 rounded"></div>
              </div>
              <div className="h-4 w-20 bg-slate-100 rounded"></div>
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

  return (
<div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font- w-full overflow-x-hidden" dir="rtl">
      
      {/* Header */}
<div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">لوحة التحكم التحليلية</h1>
          <p className="text-slate-500 text-sm mt-1">نظرة شاملة على المنتجات، المخزون، والمستخدمين.</p>
        </div>
        <div className="hidden md:block text-left text-xs font-شركه text-slate-400">
          Last updated: {new Date().toLocaleTimeString('ar-EG')}
        </div>
      </div>

      <div className="mb-8 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all">
  
  {/* الرأس: إضافة أيقونة وزر "عرض الكل" */}
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <div className="p-1.5 bg-[#0284c7] -50 rounded-lg">
        <svg className="w-4 h-4 text-white -600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <h3 className="font-bold text-slate-800 text-base">آخر الإشعارات</h3>
    </div>
    <button onClick={()=>navigate("notificatios")} className="text-xs font-medium text-[#0284c7] -600 hover:text-[#0284c7] -700 transition-colors">
      عرض الكل
    </button>
  </div>

  <div className="space-y-3">
    {notifications && notifications.length > 0 ? (
      notifications.slice(0, 3).map((n, i) => (
        <div 
          key={n.id || i} 
          className="group flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-200"
        >
         
          <span className="mt-1.5 w-2 h-2 rounded-full bg-[#0284c7] -500 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          
          <div className="flex flex-col gap-1 w-full">
            <p className="text-sm text-slate-700 leading-relaxed font-medium group-hover:text-slate-900">
              {n.title || n.message}
            </p>
{n.createdAt && (
  <span className="text-[10px] text-slate-400">
    {getTimeAgo(n.createdAt)}
  </span>
)}
          </div>
        </div>
      ))
    ) : (
      /* حالة عدم وجود إشعارات */
      <div className="py-6 text-center">
        <p className="text-sm text-slate-400">لا توجد إشعارات جديدة حالياً</p>
      </div>
    )}
  </div>

</div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-4 mb-8">
        <StatCard title="إجمالي المبيعات" value={data.summary.totalSales} icon={<DollarSign />} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard title="صافي الربح" value={data.summary.totalProfit} icon={<TrendingUp />} color="text-[#0284c7] -600" bg="bg-blue-50" />
        <StatCard title="إجمالي المنتجات" value={data.extraStats.products.total} icon={<Package />} color="text-indigo-600" bg="bg-indigo-50" />
        <StatCard title="الطلبات" value={data.summary.totalOrders} icon={<ShoppingBag />} color="text-purple-600" bg="bg-purple-50" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        
        {/* Inventory & Stock Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Activity size={18} className="text-orange-500" /> حالة المخزون
          </h3>
          <div className="space-y-4">
            <StockStatusItem 
                label="منتجات نفذت" 
                value={data.extraStats.products.outOfStock} 
                total={data.extraStats.products.total}
                icon={<XCircle className="text-red-500" />} 
                color="bg-red-500"
            />
            <StockStatusItem 
                label="مخزون منخفض" 
                value={data.extraStats.products.lowStock} 
                total={data.extraStats.products.total}
                icon={<AlertTriangle className="text-orange-500" />} 
                color="bg-orange-500"
            />
            <StockStatusItem 
                label="متوفر بالكامل" 
                value={data.extraStats.products.total - data.extraStats.products.outOfStock} 
                total={data.extraStats.products.total}
                icon={<CheckCircle2 className="text-emerald-500" />} 
                color="bg-emerald-500"
            />
          </div>
        </div>

        {/* Categories Chart */}
        <div  className="hidden md:block  lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <LayoutGrid size={18} className="text-[#0284c7] -600" /> توزيع الفئات
          </h3>
          <div className="h-[220px] sm:h-[250px] md:h-[300px]">
            <Bar 
              data={categoryChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } }
              }} 
            />
          </div>
        </div>

                  {/* Sales Movement Chart */}
<div className="hidden md:block lg:col-span-3 bg-white p-6 rounded-2xl border  border-slate-100 shadow-sm">
  <div className="flex justify-between items-center mb-6">
    <div>
      <h3 className="font-bold text-slate-800 flex items-center gap-2">
        <TrendingUp size={20} className="text-[#0284c7] -600" />
        تحليل حركة المبيعات والأرباح
      </h3>
      <p className="text-xs text-slate-400 mt-1">مقارنة أداء المنتجات من حيث الإيراد والربح الصافي</p>
    </div>
    <select className="text-xs bg-slate-50 border-none rounded-lg p-2 outline-none font-bold text-slate-600">
      <option>حسب المنتج</option>
      <option>آخر 7 أيام</option>
    </select>
  </div>
  
  <div className="h-[350px] w-full">
    {data.products.length > 0 ? (
      <Line data={salesMovementData} options={chartOptions} />
    ) : (
      <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border border-dashed">
        <p className="text-slate-400 text-sm">لا توجد بيانات كافية لرسم المخطط</p>
      </div>
    )}
  </div>
</div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Users Stats Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users size={18} className="text-indigo-600" /> إدارة المستخدمين
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UserMiniCard 
              label="العملاء" 
              total={data.extraStats.users.customer.total} 
              active={data.extraStats.users.customer.active} 
            />
            <UserMiniCard 
              label="المشرفين" 
              total={data.extraStats.users.admin.total} 
              active={data.extraStats.users.admin.active} 
            />
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-50">
            <h4 className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">توزيع الوحدات</h4>
            <div className="flex flex-wrap gap-2 justify-start sm:justify-center">
              {Object.entries(data.unitStats).map(([k, v]) => (
                <div key={k} className="bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-100">
                  <span className="text-slate-500 text-sm font-medium">{k}:</span>
                  <span className="text-slate-900 font-black">{v}</span>
                </div>
              ))}
            </div>
          </div>


        </div>

        {/* Detailed Product Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">أداء المنتجات التفصيلي</h3>

          </div>
          <div className="overflow-x-auto max-h-96 overflow-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase">
                  <th className="p-4 font-bold">المنتج</th>
                  <th className="p-4 font-bold text-center">الكمية المباعة</th>
                  <th className="p-4 font-bold">الإيرادات</th>
                  <th className="p-4 font-bold">صافي الربح</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 ">
                {data.products.length > 0 ? (
                  data.products.map((p, i) => (
                    <tr key={i} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-slate-700 group-hover:text-[#0284c7] -600 transition-colors">{p.productName}</div>
                        <div className="text-xs text-slate-400">{p?.description || 'لا يوجد وصف'}</div>
                      </td>
                      <td className="p-4 text-center">
                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-sm font-شركه">
                          {p.totalSold}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-600">{Number(p.totalRevenue).toLocaleString()} ج.م</td>
                      <td className="p-4">
                        <span className="text-emerald-600 font-bold">+{Number(p.totalProfit).toLocaleString()} ج.م</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-20">
                        <div className="flex flex-col items-center opacity-20">
                            <Package size={48} />
                            <p className="mt-2 font-medium">لا توجد بيانات حركة بيع حتى الآن</p>
                        </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

// مكون شريط حالة المخزون
const StockStatusItem = ({ label, value, total, icon, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2 font-medium text-slate-600">
                {icon} {label}
            </div>
            <span className="font-bold text-slate-800">{value}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
                className={`h-full ${color} transition-all duration-1000`} 
                style={{ width: `${(value / total) * 100}%` }}
            ></div>
        </div>
    </div>
);

// مكون كارت المستخدمين المصغر
const UserMiniCard = ({ label, total, active }) => (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
        <p className="text-xs text-slate-500 font-bold mb-1">{label}</p>
        <h4 className="text-xl font-black text-slate-800">{total}</h4>
        <div className="flex items-center gap-1 mt-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-emerald-600 font-bold">{active} نشط حالياً</span>
        </div>
    </div>
);

// مكون الكارت الأساسي للإحصائيات
const StatCard = ({ title, value, icon, color, bg }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:translate-y-[-4px] transition-all duration-300">
    <div className="flex items-start justify-between">
      <div className={`w-12 h-12 ${bg} ${color} flex items-center justify-center rounded-xl`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div className="flex items-center text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
        <ArrowUpRight size={12} /> 12%
      </div>
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h4 className="text-2xl font-black text-slate-900 font-شركه">
        {typeof value === 'number' ? value.toLocaleString() : (value || 0)}
      </h4>
    </div>
  </div>
);

export default Dashboard;