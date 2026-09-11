import React, { useState } from "react";
import { DatabaseBackup } from "lucide-react";
import axios from "axios";
import { showAlert } from "../../../services/alert";
import api from "../../../services/api";

const BackupButton = () => {
  const [loading, setLoadingMan] = useState(false);

const handleBackup = async () => {
  setLoadingMan(true);

  try {

    const response = await api.get('/backupManual');

    if (response.data.success) {

      // تحويل الداتا لملف JSON
      const dataStr = JSON.stringify(
        response.data.data,
        null,
        2
      );

      const blob = new Blob(
        [dataStr],
        { type: "application/json" }
      );

      // إنشاء لينك تحميل
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `backup-${Date.now()}.json`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);


      localStorage.setItem("lastBackup",new Date().toLocaleString("ar-EG"))


      showAlert({
        title: "تم تنزيل النسخة الاحتياطية",
        text: "تم حفظ الملف على جهازك",
        icon: "success"
      });

    }

  } catch (error) {

    console.error(error);

    showAlert({
      title: "فشل النسخ الاحتياطي",
      text: "حدث خطأ أثناء التحميل",
      icon: "error"
    });

  } finally {

    setLoadingMan(false);

  }
};

  return (
    <div
      onClick={handleBackup}
      className="
        font-['cairo']
        no-print fixed bottom-12 left-8 z-50
        bg-[#0284c7] text-white
        p-4 rounded-[20px]
        shadow-2xl shadow-[#0284c7]/40
        hover:bg-[#0284c7] hover:-translate-y-2
        active:scale-90
        transition-all duration-300 cursor-pointer
        group flex items-center justify-center
      "
      title="تحميل نسخة احتياطية"
    >
      <span className="absolute inset-0 rounded-[20px] bg-[#0284c7] animate-ping opacity-20 group-hover:hidden"></span>

      <DatabaseBackup
        className={`text-2xl relative z-10 ${
          loading ? "animate-spin" : ""
        }`}
      />
    </div>
  );
};

export default BackupButton;