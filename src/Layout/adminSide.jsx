import React, { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/getCurrentUser";
import { socket } from "../services/socket";
import { MyContext } from "../context/cartContext";
import StoreNavigationMenu from "../services/GoWebsite";
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
} from "lucide-react";

export default function AdminLayout() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  // ==========================================
  // Notifications State
  // ==========================================
  const [notifications, setNotifications] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notifications") || "[]");
    } catch {
      return [];
    }
  });

  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Set Document Title
  useEffect(() => {
    document.title = "لوحة التحكم - Large Step";
  }, []);

  // Join & Leave Socket Room
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

  // Handle Real-time Notifications
  useEffect(() => {
    const handleNotification = (data) => {
      console.log("ADMIN NOTIFICATION:", data);

      setNotifications((prev) => {
        const updated = [data, ...prev];
        localStorage.setItem("notifications", JSON.stringify(updated));
        return updated; // Fixed: was missing return
      });
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  // Clear Notifications
  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("notifications");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navLinks = [
    {
      to: "/admin_dashboard",
      end: true,
      label: "لوحة المتابعة",
      icon: LayoutDashboard,
    },
    {
      to: "/admin_dashboard/services",
      label: "الخدمات" ,
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
    
    
  ];

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
      <div dir="rtl" className="min-h-screen bg-slate-100 flex text-slate-800 font-sans">
        {/* ========================================= */}
        {/* SIDEBAR                                   */}
        {/* ========================================= */}
        <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col justify-between shrink-0 shadow-xl border-l border-slate-800">
          <div>
            {/* Brand Header */}
            <div className="p-5 border-b border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-600/30">
                LS
              </div>
              <div>
                <h2 className="font-bold text-white text-base tracking-wider">LARGE STEP</h2>
                <p className="text-xs text-blue-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> لوحة الإدارة
                </p>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="p-3 space-y-1.5">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions */}
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

        {/* ========================================= */}
        {/* MAIN OUTLET CONTAINER                     */}
        {/* ========================================= */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>


      </div>
    </MyContext.Provider>
  );
}