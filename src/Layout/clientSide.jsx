import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import WhatsAppButton from "../services/whatsApp";
import ChatBot from "../services/chatBot";
import { MyContext } from "../context/cartContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import { socket } from "../services/socket";
import { getCurrentUser } from "../services/getCurrentUser";

import logo from "../../public/logo.jpeg"; // تأكد من صحة مسار اللوجو لديك

export default function ClientLayout() {
  const { isAr, toggleLang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // فحص المسار الحالي لتحديد الزر النشط في الهيدر
  const isActive = (path) => location.pathname === path;

  const [token] = useState(localStorage.getItem("token"));
  const [about, setAbout] = useState();

  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem("notifications") || "[]");
  });

  const [notifyCount, setNotifyCount] = useState(notifications.length);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const [counts, setCounts] = useState(
    (JSON.parse(localStorage.getItem("cart")) || []).length || 0
  );

  const user = getCurrentUser();

  // ========================
  // 1. Unlock Audio
  // ========================
  useEffect(() => {
    const unlockAudio = () => {
      setAudioUnlocked(true);
      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    return () => {
      window.removeEventListener("click", unlockAudio);
    };
  }, []);

  // ========================
  // 2. Join socket room
  // ========================
  useEffect(() => {
    if (user) {
      socket.emit("join", user.userId);
    }
    return () => {
      socket.off("join");
    };
  }, [user]);

  // ========================
  // 3. Fetch notifications
  // ========================
  useEffect(() => {
    const fetchAndMerge = async () => {
      try {
        const res = await api.get("/notification");
        const dbData = res.data;

        const localData = JSON.parse(
          localStorage.getItem("notifications") || "[]"
        );

        const combined = [...dbData, ...localData];
        const unique = Array.from(
          new Map(combined.map((item) => [item._id, item])).values()
        );

        unique.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotifications(unique);
        localStorage.setItem("notifications", JSON.stringify(unique));
        setNotifyCount(unique.length);
      } catch (err) {
        console.log("Notification fetch warning:", err);
      }
    };

    fetchAndMerge();
  }, []);

  // ========================
  // 4. Handle live socket notifications
  // ========================
  useEffect(() => {
    const handleNotification = (data) => {
      if (data.title === "تم حظرك من قبل الادمن") {
        localStorage.removeItem("cart");
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
      }
      console.log(data);
      setNotifications((prev) => {
        const updated = [data, ...prev];
        localStorage.setItem("notifications", JSON.stringify(updated));
        setNotifyCount(updated.length);


        return updated;
      });
    };

    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [audioUnlocked]);

  // ========================
  // 5. Fetch about data
  // ========================
  const fetchAbout = async () => {
    try {
      const res = await api.get("/about");
      setAbout(res.data.data);
    } catch (err) {
      console.log("About fetch warning:", err);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, [token]);

 return (
    <MyContext.Provider
      value={{
        counts,
        setCounts,
        about,
        notifications,
        setNotifications,
        notifyCount,
        setNotifyCount,
      }}
    >
      <div
        dir={isAr ? "rtl" : "ltr"}
        className="min-h-screen flex flex-col bg-slate-50 font-sans select-none"
      >
        {/* ========================
            1. Unified Full-Width Header
           ======================== */}
        <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
            
            {/* Logo and Brand Name */}
            <div
              onClick={() => navigate("/")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-lg border-2 border-blue-500 overflow-hidden group-hover:scale-105 transition-transform shadow-xs">
                <img
                  src={logo}
                  alt="Large Step Logo"
                  className="w-full-1 h-full-1 object-cover rounded-lg block"
                />
              </div>
              <span className="text-base sm:text-lg font-bold tracking-widest text-slate-800 uppercase font-serif">
                Large Step
              </span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-600">
              <button
                onClick={() => navigate("/")}
                className={`transition-colors pb-1 ${
                  isActive("/")
                    ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                    : "hover:text-blue-600"
                }`}
              >
                {isAr ? "الرئيسية" : "Home"}
              </button>

              <button
                onClick={() => navigate("/about")}
                className={`transition-colors pb-1 ${
                  isActive("/about")
                    ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                    : "hover:text-blue-600"
                }`}
              >
                {isAr ? "من نحن" : "About Us"}
              </button>

              {/* العقارات / Properties */}
              <button
                onClick={() => navigate("/properties")}
                className={`transition-colors pb-1 ${
                  isActive("/properties")
                    ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                    : "hover:text-blue-600"
                }`}
              >
                {isAr ? "العقارات" : "Properties"}
              </button>

              {/* خدماتنا / Services */}
              <button
                onClick={() => navigate("/services")}
                className={`transition-colors pb-1 ${
                  isActive("/services")
                    ? "text-blue-600 border-b-2 border-blue-600 font-bold"
                    : "hover:text-blue-600"
                }`}
              >
                {isAr ? "خدماتنا" : "Services"}
              </button>

              <button
                onClick={() => navigate("/about")}
                className="hover:text-blue-600 transition-colors pb-1"
              >
                {isAr ? "تواصل معنا" : "Contact"}
              </button>
            </nav>

            {/* Actions & Language Switcher */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={toggleLang}
                className="text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300"
              >
                {isAr ? "English" : "[العربية]"}
              </button>

              <button
                onClick={() => navigate("/")}
                className="px-4 sm:px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs tracking-wider transition-all shadow-sm hover:shadow-md whitespace-nowrap"
              >
                {isAr ? "ابدأ الآن" : "Get Started"}
              </button>
            </div>

          </div>
        </header>

        {/* ========================
            2. Page Content Outlet
           ======================== */}
        <main className="flex-1 w-full">
          <Outlet />
        </main>

        {/* ========================
            3. Global Floating Utilities
           ======================== */}
        <ChatBot />
        <WhatsAppButton />
      </div>
    </MyContext.Provider>
  );
}