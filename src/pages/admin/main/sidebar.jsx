import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Package, Users, BarChart3, 
  HardHat, Settings, Bell, Star, UserCircle,
  ChevronDown, Menu, X, LogOut, PlusCircle, List
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import api from "../../../services/api";
import { showAlert } from "../../../services/alert";

const Sidebar = ({ role }) => {
  const [open, setOpen] = useState(null);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const location = useLocation(); // لمعرفة المسار الحالي وتمييزه

  useEffect(() => {
    document.body.style.overflow = isOpenMobile ? "hidden" : "auto";
  }, [isOpenMobile]);

  const toggle = (menu) => {
    setOpen(open === menu ? null : menu);
  };

  const getDashboardPath = () => {
    if (['superadmin', 'admin'].includes(role)) return '/admin_dashboard';
    if (role === 'manager') return '/manager_dashboard';
    return '/';
  };

  const menus = [
    {
      id: "dashboard",
      label: "لوحة التحكم",
      icon: <LayoutDashboard size={20} />,
      roles: ["admin", "manager", "superadmin"],
      path: getDashboardPath()
    },
    {
      id: "products",
      label: "المنتجات",
      icon: <Package size={20} />,
      roles: ["admin", "manager", "superadmin"],
      sub: [
        { id: "addProduct", label: "إضافة منتج", path: "products/add", icon: <PlusCircle size={14}/> },
        { id: "allProducts", label: "عرض المنتجات", path: "products", icon: <List size={14}/> }
      ]
    },
    {
      id: "orders",
      label: "الطلبات",
      icon: <BarChart3 size={20} />,
      roles: ["admin", "manager", "superadmin"],
      sub: [
        { id: "reports", label: "تقارير البيع", path: "orders/reports" },
        { id: "allOrders", label: "إدارة الطلبات", path: "orders" }
      ]
    },

        {
      id: "offers",
      label: "العروض والخصومات",
      icon: <BarChart3 size={20} />,
      roles: ["admin", "manager", "superadmin"],
      sub: [
 

        { id: "coupon", label: "الخصومات و الكوبونات", path: "offer/coupon" },
        { id: "2", label: " مجالات العروض ", path: "offer/" },
        { id: "offerCompo", label: "  العروض المجمعة", path: "offer/Compo" },
        { id: "offerReport", label: "تقارير العروض ", path: "reports/offers-combos" },

      ]
    },
    {
      id: "customers",
      label: "العملاء",
      icon: <Users size={20} />,
      roles: ["admin", "manager", "superadmin"],
      sub: [
        { id: "allCustomers", label: "قاعدة العملاء", path: "customers" }
      ]
    },
    {
      id: "reviews",
      label: "التقييمات",
      icon: <Star size={20} />,
      roles: ["admin", "superadmin"],
      sub: [
        { id: "allReviews", label: "مراجعات العملاء", path: "reviews" }
      ]
    },
    {
      id: "notifications",
      label: "الإشعارات",
      icon: <Bell size={20} />,
      roles: ["admin", "manager", "superadmin"],
      sub: [
        { id: "notifications", label: "إرسال تنبيه", path: "notifications" }
      ]
    },
    {
      id: "admin",
      label: "المشرفين",
      icon: <HardHat size={20} />,
      roles: ["superadmin"],
      sub: [
        { id: "admins", label: "قائمة المشرفين", path: "admins" },
        { id: "addAdmin", label: "إضافة مشرف جديد", path: "addAdmin" }
      ]
    },
    {
      id: "settings",
      label: "الإعدادات",
      icon: <Settings size={20} />,
      roles: ["admin", "superadmin"],
      sub: [
        { id: "settings", label: "إعدادات النظام", path: "settings" },
        { id: "backup", label: "إعدادات النسخ الاحتياطي", path: "settings/backup" },

      ]
    },
    {
      id: "profile",
      label: "الحساب",
      icon: <UserCircle size={20} />,
      roles: ["admin", "manager", "superadmin"],
      sub: [
        { id: "profile", label: "ملفي الشخصي", path: "profile" }
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await api.post('/users/logout'); 
      localStorage.removeItem('token'); 
      showAlert?.({icon:"success", title:"تم تسجيل الخروج بنجاح"});
      setTimeout(() => { window.location.href = '/تسجيل_الدخول'; }, 1000);
    } catch (err) {
      localStorage.clear();
      window.location.href = '/تسجيل_الدخول';
    }
  };

  const hasAccess = (menuRoles) => !menuRoles || menuRoles.includes(role);

  return (
    <div className="no-print min-h-full" dir="rtl">
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpenMobile(!isOpenMobile)}
        className="lg:hidden fixed top-5 left-5 z-[60] p-2.5 bg-[#0284c7]  -600 text-white rounded-xl -lg hover:scale-105 active:scale-95 transition-all"
      >
        {isOpenMobile ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[50] lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 right-0 z-[55] lg:static
        w-72 lg:w-64 xl:w-72 h-full
        bg-[#0f172a] border-l border-slate-800/50
        flex flex-col transition-transform duration-300 ease-in-out
        ${isOpenMobile ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>

        {/* Branding Area */}
<div className="p-6 mb-2">
  <div className="flex items-center gap-3 px-2">

    <div className="flex flex-col">
      <span className="text-white font-black tracking-tight text-lg leading-tight">
        متجر أبو الدهب
      </span>
      <span className="text-[10px] text-[#0284c7]  -00 font-bold uppercase tracking-widest">
        للمنتجات الغذائيه
      </span>
    </div>

  </div>
</div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
          {menus.map(menu => hasAccess(menu.roles) && (
            <div key={menu.id} className="mb-1">
              {menu.sub ? (
                // Menu with Sub-items
                <>
                  <button
                    onClick={() => toggle(menu.id)}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all duration-200 group
                      ${open === menu.id ? 'bg-blue-600/10 text-blue-400' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`${open === menu.id ? 'text-[#0284c7]  -500' : 'group-hover:text-slate-200'}`}>{menu.icon}</span>
                      <span className="font-bold text-sm">{menu.label}</span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${open === menu.id ? "rotate-180 text-[#0284c7]  -500" : "opacity-40"}`} />
                  </button>
                  
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${open === menu.id ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                    {menu.sub.map(sub => (
                      <Link 
                        key={sub.id}
                        to={sub.path}
                        onClick={() => setIsOpenMobile(false)}
                        className={`flex items-center gap-2 mr-9 ml-2 py-2.5 px-3 text-sm rounded-lg transition-colors
                          ${location.pathname.includes(sub.path) 
                            ? 'text-[#0284c7]  -400 font-bold bg-blue-400/5' 
                            : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${location.pathname.includes(sub.path) ? 'bg-[#0284c7]  -500' : 'bg-slate-700'}`} />
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                // Simple Link
                <Link 
                  to={menu.path}
                  onClick={() => setIsOpenMobile(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${location.pathname === menu.path 
                      ? 'bg-[#0284c7]  -600 text-white -lg -[#0284c7]  -600/20' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'}`}
                >
                  {menu.icon}
                  <span className="font-bold text-sm">{menu.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer Area */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-900/20">
          <div className="flex items-center justify-between bg-slate-800/40 p-3 rounded-2xl border border-slate-700/30">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 bg-slate-700 rounded-xl flex shrink-0 items-center justify-center text-white font-bold ring-2 ring-slate-800">
                {role?.[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-slate-200 truncate capitalize">{role}</span>
                <span className="text-[10px] text-emerald-500 font-medium">متصل الآن</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors group"
              title="تسجيل الخروج"
            >
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </aside>
    </div>
  );
};

export default Sidebar;