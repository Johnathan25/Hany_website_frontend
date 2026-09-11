import { Outlet } from "react-router-dom";
import Footer from "../pages/customer/main/footer";
import Navbar from "../pages/customer/main/navBar";
import WhatsAppButton from "../services/whatsApp";
import { MyContext } from "../context/cartContext";
import { useEffect, useState } from "react";
import api from "../services/api";
import { socket } from "../services/socket";
import { getCurrentUser } from "../services/getCurrentUser";
import soundFile from "../../public/sound.mp3";
import ChatBot from "../services/chatBot";
import FloatingMenu from "../pages/customer/main/button";

export default function ClientLayout() {
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
  // 1. Unlock Audio (important)
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
      console.log(err);
    }
  };

  fetchAndMerge();
}, []);


  // ========================
  // 3. Handle notifications (ONLY HERE)
  // ========================
  useEffect(() => {
    const handleNotification = (data) => {
     if(data.title=="تم حظرك من قبل الادمن"){
      localStorage.removeItem("cart");
      localStorage.removeItem("token");
      localStorage.removeItem("userName");

     }
     console.log(data)
      setNotifications((prev) => {
        const updated = [data, ...prev];

        localStorage.setItem("notifications", JSON.stringify(updated));
        setNotifyCount(updated.length);

        // play sound safely
        if (audioUnlocked) {
          const audio = new Audio(soundFile);
          audio.play().catch(() => {});
        }

        return updated;
      });
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [audioUnlocked]);

  // ========================
  // 4. Fetch about
  // ========================
  const fetchAbout = async () => {
    const res = await api.get("/about");
    setAbout(res.data.data);
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
      <div dir="rtl" className="dashboard">
        <Navbar />

        <div className="flex-1">
          <Outlet />
        </div>
        <ChatBot/>
        <FloatingMenu/>


        <Footer />
        <WhatsAppButton />
      </div>
    </MyContext.Provider>
  );
}