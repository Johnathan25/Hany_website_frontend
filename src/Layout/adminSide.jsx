import { Outlet } from "react-router-dom";
//import Sidebar from "../pages/admin/main/sidebar";
//import Footer from "../pages/admin/main/footer";
import { getCurrentUser } from "../services/getCurrentUser";
//import BackupButton from "../pages/admin/backup/backup";
import { useEffect, useState } from "react";
import { socket } from "../services/socket";

import { MyContext } from "../context/cartContext";
import StoreNavigationMenu from "../services/GoWebsite";

export default function AdminLayout() {
  const user = getCurrentUser();

  const [notifications, setNotifications] = useState(() => {
    return JSON.parse(localStorage.getItem("notifications") || "[]");
  });

  const [notifyCount, setNotifyCount] = useState(notifications.length);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // ========================
  // Unlock audio
  // ========================
  useEffect(() => {
    window.title= "لوحة التحكم - ابو الدهب";

  }, []);

  // ========================
  // Join admin socket room
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
  // Handle notifications
  // ========================
  useEffect(() => {
    const handleNotification = (data) => {
      console.log("ADMIN NOTIFICATION:", data);

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

  return (
    <MyContext.Provider
      value={{
        notifications,
        notifyCount,
      }}
    >
      <div dir="rtl" className="">
        <div className="flex min-h-screen ">
          {/* <Sidebar role={user?.role} className="bg-[#0f172a]" /> */}

          <div className="w-full">
            <Outlet />
          </div>
        </div>



        <StoreNavigationMenu />

        {/* <BackupButton /> */}
        {/* <Footer  className="w-full"/> */}
      </div>
    </MyContext.Provider>
  );
}