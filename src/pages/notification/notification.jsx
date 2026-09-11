import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/cartContext";
import api from "../../services/api";
import { 
  Bell, 
  Trash2, 
  CheckCircle2, 
  Package, 
  Info, 
  ChevronLeft, 
  Clock, 
  Inbox,
  ShieldAlert,
  ShieldCheck,
  Truck
} from "lucide-react";
import { showAlertConfirm } from "../../services/alertConfirm";

export default function Notifications() {
  const { notifications, setNotifications, setNotifyCount } = useContext(MyContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndMerge = async () => {
      try {
        const res = await api.get("/notification");
        const dbData = res.data;
        const localData = JSON.parse(localStorage.getItem("notifications") || "[]");
        const combined = [...dbData, ...localData];
        const unique = Array.from(new Map(combined.map((item) => [item._id, item])).values());
        
        unique.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setNotifications(unique);
        localStorage.setItem("notifications", JSON.stringify(unique));
        setNotifyCount(unique.length);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAndMerge();
  }, []);

        useEffect(() => {
      document.title = "الإشعارات - نظام أبو الدهب";
    }, []);

  const getStatusDetails = (title) => {
    if (title.includes("حظرك")) return {
      icon: <ShieldAlert className="text-rose-400" />,
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20"
    };
    if (title.includes("فك الحظر")) return {
      icon: <ShieldCheck className="text-emerald-400" />,
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    };
    if (title.includes("توصيل")) return {
      icon: <Truck className="text-sky-400" />,
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20"
    };
    return {
      icon: <Bell className="text-slate-400" />,
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/20"
    };
  };

  const clearAll = async() => {
    const confirm =await showAlertConfirm({
      title:"هل تريد مسح جميع الإشعارات؟",
      text:"في حاله مسح الأشعارات فلا يمكنك الرجوع اليها مره اخري",
      icon:"warning"
    })
    if (confirm.isConfirmed) {
      localStorage.setItem("notifications", JSON.stringify([]));
      setNotifications([]);
      setNotifyCount(0);
    }
  };

// داخل المكون Notifications
// داخل المكون Notifications
return (
  <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 font-cairo tracking-tight" dir="rtl">
    <div className="mx-auto">
      
      {/* Header - Clean Modern Style */}
      <header className="flex items-center justify-between mb-12 p-8 rounded-lg bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm">
        <div className="relative">
          <h1 className="text-4xl font-black text-slate-900 mb-2 bg-gradient-to-l from-blue-600 to-sky-500 bg-clip-text text-transparent">
            الإشعارات
          </h1>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            لديك {notifications.length} إشعار في نظامك
          </p>
        </div>
        
        {notifications.length > 0 && (
          <button 
            onClick={clearAll}
            className="group flex items-center gap-2 px-5 py-2.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl hover:bg-rose-600 hover:text-white transition-all duration-500 shadow-sm"
          >
            <span className="text-xs font-bold">مسح الكل</span>
            <Trash2 size={18} className="group-hover:rotate-12 transition-transform" />
          </button>
        )}
      </header>

      {/* Notifications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-blue-50 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-slate-400 font-bold animate-pulse">جاري جلب التنبيهات...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => {
            const statusStyle = getStatusDetails(notif.title);
            const themeStyle = getTheme(notif.type);
            
            return (
              <div 
                key={notif._id} 
                className="group relative overflow-hidden bg-white border border-slate-200/80 p-6 rounded-lg transition-all duration-500 hover:border-blue-300 hover:translate-y-[-3px] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)]"
              >
                {/* Subtle Gradient Glow on Hover */}
                <div className="absolute -left-20 -top-20 w-40 h-40 bg-blue-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="flex  gap-6 relative z-10">
                  {/* Icon Container - Light Glass Effect */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${statusStyle.bgColor.replace('/10', '/20')} border-white/50`}>
                    {React.cloneElement(statusStyle.icon, { size: 24 })}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between  items-center   mb-2">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-lg border uppercase tracking-wider ${themeStyle.bg} ${themeStyle.text} border-current/20`}>
                        {notif.type || 'عام'}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        <Clock size={12} />
                        {new Date(notif.createdAt).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>

                    <h3 className="text-[17px] font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors leading-tight">
                      {notif.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                      {notif.message}
                    </p>
                  </div>

                  <div className="flex items-center self-center">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 opacity-0 group-hover:opacity-100 group-hover:translate-x-[-8px] transition-all duration-500 shadow-sm">
                      <ChevronLeft className="text-blue-600" size={18} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State - Light Minimalist */
          <div className="text-center py-24 rounded-[3.5rem] border-2 border-dashed border-slate-100 bg-white/50">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-blue-100 blur-[60px] opacity-50 animate-pulse"></div>
              <div className="relative p-12 bg-white rounded-full border border-slate-100 shadow-xl">
                <Inbox size={64} className="text-blue-200" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-800">صندوق الوارد نظيف</h3>
            <p className="text-slate-400 mt-3 max-w-xs mx-auto text-sm font-medium leading-relaxed">
              لا توجد إشعارات جديدة حالياً. استمتع بوقتك!
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);
}

// Helper Functions for Styling with Lucide Icons
function getTheme(type) {
  switch(type) {
    case 'order': 
      return {
        bg: 'bg-emerald-50 text-emerald-600', 
        text: 'text-emerald-600',
        icon: <Package size={26} strokeWidth={2.5} />
      };
    case 'product': 
      return {
        bg: 'bg-blue-50 text-blue-600', 
        text: 'text-blue-600',
        icon: <CheckCircle2 size={26} strokeWidth={2.5} />
      };
    default: 
      return {
        bg: 'bg-slate-50 text-slate-600', 
        text: 'text-slate-600',
        icon: <Info size={26} strokeWidth={2.5} />
      };
  }
}