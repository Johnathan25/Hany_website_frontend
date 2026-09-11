import React, { useState } from "react";
import { 
  FaUserShield, FaEnvelope, FaLock, FaUserTag, 
  FaStickyNote, FaPlusCircle, FaArrowRight 
} from "react-icons/fa";
import api from "../../../services/api";
import { showAlert } from "../../../services/alert";
import { useNavigate } from "react-router-dom";
import { Phone, PhoneCall } from "lucide-react";

export default function CreateAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
    phoneNumber:"",
    notes: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users/createAdmin", formData);
      showAlert({ title: "تم إنشاء حساب الأدمن بنجاح", icon: "success" });
      setFormData({
            username: "",
    email: "",
    password: "",
    role: "admin",
    phoneNumber:"",
    notes: ""
      })
    } catch (err) {
      showAlert({ 
        title: "خطأ في الإنشاء", 
        text: err.response?.data?.message || "تأكد من البيانات المدخلة", 
        icon: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10 text-right" dir="rtl">
      
      {/* Header */}
      <div className="mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <FaUserShield className="text-blue-900" /> إنشاء مدير نظام جديد
          </h1>
          <p className="text-slate-500 text-sm mt-1">إضافة حساب جديد بصلاحيات إدارة المنصة</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-800 transition-colors"
        >
          <FaArrowRight size={14} /> رجوع
        </button>
      </div>

      <div className=" mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 p-8 -sm space-y-8">
          
          {/* قسم البيانات الأساسية - شبكة من عمودين */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mr-1">
                <FaUserShield className="text-slate-400" /> اسم المستخدم
              </label>
              <input 
                required
                className="modern-input"
                placeholder="مثال: Ahmed_Admin"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mr-1">
                <FaEnvelope className="text-slate-400" /> البريد الإلكتروني
              </label>
              <input 
                required
                type="email"
                className="modern-input"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mr-1">
                <PhoneCall className="text-slate-400 text-[5px]" />رقم التلفون
              </label>
              <input 
                required
                type="tel"
                className="modern-input"
                placeholder="01270857659"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mr-1">
                <FaLock className="text-slate-400" /> كلمة المرور
              </label>
              <input 
                required
                type="password"
                className="modern-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mr-1">
                <FaUserTag className="text-slate-400" /> الرتبة (Role)
              </label>
              <select 
                className="modern-input appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="admin">مدير (Admin)</option>
                <option value="customer">عميل (Customer)</option>
              </select>
            </div>
          </div>

          {/* ملاحظات إضافية - تأخذ العرض بالكامل */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[13px] font-bold text-slate-700 mr-1">
              <FaStickyNote className="text-slate-400" /> ملاحظات إدارية
            </label>
            <textarea 
              rows="4"
              className="modern-input resize-none"
              placeholder="اكتب أي ملاحظات حول هذا المدير أو صلاحياته..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          {/* زر الإرسال */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-lg font-bold transition-all -lg -blue-100 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-lg animate-spin" />
              ) : (
                <FaPlusCircle />
              )}
              إنشاء الحساب الآن
            </button>
          </div>
        </form>
      </div>

      {/* Styles */}
      <style>{`
        .modern-input {
          width: 100%;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 16px;
          padding: 14px 20px;
          font-size: 14px;
          color: #334155;
          transition: all 0.2s ease;
          outline: none;
        }
        .modern-input:focus {
          background-color: #fff;
          border-color: #3b82f6;
          box-: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </div>
  );
}