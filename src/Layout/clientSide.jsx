import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import WhatsAppButton from "../services/whatsApp";
import ChatBot from "../services/chatBot";
import { MyContext } from "../context/cartContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../services/api";
import { socket } from "../services/socket";
import { getCurrentUser } from "../services/getCurrentUser";
import Navbar from "../components/Navbar";
import logo from "../../public/logo.jpeg"; // تأكد من صحة مسار اللوجو لديك
import Footer from "../pages/User/footer";

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
        {/* Navbar الموحد لجميع الصفحات */}
        <Navbar />

        {/* جسم الصفحات المتغيرة */}
        <main className="flex-1 w-full">
          <Outlet />
        </main>

      <Footer/>
      </div>
    </MyContext.Provider>
  );
}