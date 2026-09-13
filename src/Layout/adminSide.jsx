import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/getCurrentUser";
import { socket } from "../services/socket";
import { MyContext } from "../context/cartContext";
import {
  LayoutDashboard,
  MessageSquareWarning,
  Users,
  Package,
  CalendarCheck,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Layers,
  Menu,
  X,
  Award,
  ChevronDown,
  Receipt,
} from "lucide-react";

export default function AdminLayout() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openGroups, setOpenGroups] = useState({
    servicesGroup: true,
    inventionsGroup: true,
  });

  const toggleGroup = (groupKey) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notifications") || "[]");
    } catch {
      return [];
    }
  });

  const [audioUnlocked, setAudioUnlocked] = useState(false);

  useEffect(() => {
    document.title = "لوحة التحكم - Large Step";
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const navigationSections = [
  {
    categoryName: "نظرة عامة",
    items: [
      {
        to: "/admin_dashboard",
        end: true,
        label: "لوحة المتابعة",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    categoryName: "إدارة العمليات والخدمات",
    items: [
      {
        key: "servicesGroup",
        label: "الخدمات والمعاينات",
        icon: Layers,
        subItems: [
          {
            to: "/admin_dashboard/services",
            label: "دليل الخدمات",
            icon: Layers,
          },
          {
            to: "/admin_dashboard/items-pricing",
            label: "تسعير الخدمات",
            icon: Package,
          },
          {
            to: "/admin_dashboard/bookings",
            label: "حجوزات المعاينة",
            icon: CalendarCheck,
          },
        ],
      },
      {
        key: "inventionsGroup",
        label: "براءات الاختراع",
        icon: Award,
        subItems: [
          {
            to: "/admin_dashboard/InventionsManager",
            label: "إدارة براءات الاختراع",
            icon: Award,
          },
          {
            to: "/admin_dashboard/inventions-security",
            label: "سجل براءات الاختراع (أمن)",
            icon: ShieldCheck,
          },
        ],
      },
      // تجميع صفحات الفواتير في مجموعة واحدة
      {
        key: "invoicesGroup",
        label: "الفواتير والمدفوعات",
        icon: Receipt,
        subItems: [
          {
            to: "/admin_dashboard/create-invoice",
            label: "إنشاء فاتورة ورابط دفع",
            icon: Receipt,
          },
          {
            to: "/admin_dashboard/inventions-invoices-records",
            label: "سجل فواتير براءات الاختراع",
            icon: Receipt,
          },
        ],
      },
    ],
  },

  {
    categoryName: "إدارة النظام والعملاء",
    items: [
      {
        to: "/admin_dashboard/users",
        label: "المستخدمين والصلاحيات",
        icon: Users,
      },
      {
        to: "/admin_dashboard/complaints",
        label: "إدارة الشكاوى",
        icon: MessageSquareWarning,
      },
    ],
  },
];

  useEffect(() => {
    navigationSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.subItems) {
          const isChildActive = item.subItems.some(
            (sub) => location.pathname === sub.to
          );
          if (isChildActive) {
            setOpenGroups((prev) => ({ ...prev, [item.key]: true }));
          }
        }
      });
    });
  }, [location.pathname]);

  useEffect(() => {
    if (user?.userId) {
      socket.emit("join", user.userId);
    }
    return () => {
      if (user?.userId) {
        socket.emit("leave", user.userId);
      }
    };
  }, [user?.userId]);

  useEffect(() => {
    const handleNotification = (data) => {
      setNotifications((prev) => {
        const updated = [data, ...prev];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated;
      });
    };

    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("notifications");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <MyContext.Provider
      value={{
        notifications,
        notifyCount: notifications.length,
        setNotifications,
        clearNotifications,
        audioUnlocked,
        setAudioUnlocked,
      }}
    >
      <div dir="rtl" className="min-h-screen bg-slate-100 flex flex-col lg:flex-row text-slate-800 font-sans">
        <header className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between -md border-b border-slate-800 sticky top-0 z-40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              LS
            </div>
            <span className="font-bold text-sm tracking-wide">LARGE STEP</span>
          </div>

          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            aria-label="Open Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          />
        )}

        <aside
          className={`fixed lg:sticky top-0 bottom-0 right-0 h-screen w-64 bg-slate-900 text-slate-200 flex flex-col justify-between shrink-0 -2xl lg:-xl border-l border-slate-800 z-50 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
        >
          <div>
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.jpeg"
                  alt="Logo"
                  onClick={() => navigate("/")}
                  className="w-10 h-10 rounded-xl object-contain -md -blue-600/30 cursor-pointer hover:opacity-90 transition-opacity"
                />
                <div>
                  <h2
                    onClick={() => navigate("/")}
                    className="font-bold text-white text-base tracking-wider cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    LARGE STEP
                  </h2>
                  <p className="text-xs text-blue-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> لوحة الإدارة
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]">
              {navigationSections.map((section, secIdx) => (
                <div key={secIdx} className="space-y-1">
                  <span className="block px-3.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    {section.categoryName}
                  </span>

                  {section.items.map((item, idx) => {
                    const Icon = item.icon || Layers;

                    if (item.subItems) {
                      const isOpen = Boolean(openGroups[item.key]);
                      const isAnyChildActive = item.subItems.some(
                        (sub) => location.pathname === sub.to
                      );

                      return (
                        <div key={idx} className="space-y-1">
                          <button
                            type="button"
                            onClick={() => toggleGroup(item.key)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                              isAnyChildActive
                                ? "bg-slate-800/90 text-white"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4 shrink-0 text-slate-400" />
                              <span>{item.label}</span>
                            </div>
                            <ChevronDown
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isOpen ? "rotate-180 text-blue-400" : "text-slate-500"
                              }`}
                            />
                          </button>

                          {isOpen && (
                            <div className="pr-4 pl-1 space-y-1 border-r-2 border-slate-800 mr-3 my-1">
                              {item.subItems.map((subItem) => {
                                const SubIcon = subItem.icon || Layers;
                                return (
                                  <NavLink
                                    key={subItem.to}
                                    to={subItem.to}
                                    className={({ isActive }) =>
                                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                                        isActive
                                          ? "bg-blue-600 text-white -sm -blue-600/30 font-bold"
                                          : "text-slate-400 hover:bg-slate-800/70 hover:text-white"
                                      }`
                                    }
                                  >
                                    <SubIcon className="w-3.5 h-3.5 shrink-0" />
                                    <span>{subItem.label}</span>
                                  </NavLink>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                            isActive
                              ? "bg-blue-600 text-white -md -blue-600/30 font-bold"
                              : "text-slate-400 hover:bg-slate-800 hover:text-white"
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-slate-800 space-y-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>الموقع الرئيسي</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </MyContext.Provider>
  );
}