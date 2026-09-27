import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Edit3,
  X,
  Check,
  Loader2,
  Calendar,
  Shield,
  FileText,
  Trash2,
  Clock,
  Lock,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

import api from "../../services/api";
import { showAlert } from "../../services/alert";
import { showAlertConfirm } from "../../services/alertConfirm";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [err, setErr] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // الحقول المطابقة تماماً لـ User Schema
  const [form, setForm] = useState({
    userName: "",
    email: "",
    phone: "",
    notes: "",
  });

  // ---------------- تغيير كلمة المرور ----------------
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordStep, setPasswordStep] = useState("request"); // 'request' | 'verify'
  const [sendingCode, setSendingCode] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    resetCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showAlert({
        icon: "error",
        title: "يجب عليك تسجيل الدخول أولاً، سيتم توجيهك الآن...",
      });
      setTimeout(() => {
        navigate("/login");
      }, 500);
      return false;
    }
    return true;
  };

  const getProfile = async () => {
    if (!checkAuth()) return;

    try {
      const res = await api.get("/users/profile");
      const u = res.data?.user || res.data?.data || res.data;
      setUser(u);
      setForm({
        userName: u?.userName || "",
        email: u?.email || "",
        phone: u?.phone || "",
        notes: u?.notes || "",
      });
    } catch (error) {
      setErr(error.response?.data || { message: "خطأ في تحميل البيانات" });
      showAlert({ title: "خطأ في تحميل البيانات", icon: "error" });
    }
  };

  useEffect(() => {
    document.title = "الملف الشخصي";
    getProfile();
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const updateProfile = async () => {
    if (!checkAuth()) return;

    setLoading(true);
    try {
      await api.put("/users/updateProfile", {
        userName: form.userName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        notes: form.notes.trim(),
      });

      showAlert({ title: "تم تحديث البيانات بنجاح", icon: "success" });
      setIsEditing(false);
      getProfile();
    } catch (error) {
      showAlert({
        title: error.response?.data?.message || "حدث خطأ أثناء التحديث",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      const result = await showAlertConfirm({
        title: "حذف الحساب",
        text: "هل أنت متأكد أنك تريد حذف الحساب؟ لا يمكن التراجع عن هذا الإجراء نهائياً.",
        icon: "warning",
        confirmButtonText: "نعم، احذف الحساب",
        cancelButtonText: "إلغاء",
        confirmButtonColor: "#dc2626",
      });

      if (!result.isConfirmed) return;

      setDeleteLoading(true);
      await api.delete("/users");

      await showAlertConfirm({
        title: "تم الحذف",
        text: "تم حذف حسابك بنجاح",
        icon: "success",
        confirmButtonText: "حسناً",
        showCancelButton: false,
      });

      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      showAlertConfirm({
        title: "خطأ",
        text: error.response?.data?.message || "حدث خطأ أثناء حذف الحساب",
        icon: "error",
        confirmButtonText: "حسناً",
        showCancelButton: false,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---------------- منطق تغيير كلمة المرور ----------------

  const openPasswordModal = () => {
    setPasswordStep("request");
    setPasswordForm({ resetCode: "", newPassword: "", confirmPassword: "" });
    setShowPasswordModal(true);
  };

  const closePasswordModal = () => {
    if (sendingCode || resettingPassword) return;
    setShowPasswordModal(false);
  };

  const handlePasswordFormChange = (e) =>
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // خطوة 1: إرسال رمز التحقق إلى بريد المستخدم الحالي
  const requestResetCode = async () => {
    if (!user?.email) {
      showAlert({ title: "تعذر العثور على بريدك الإلكتروني", icon: "error" });
      return;
    }

    setSendingCode(true);
    try {
      // ملاحظة: تأكد أن هذا المسار مطابق لمسار forgetPassword الفعلي لديك  forgot-password
      await api.put("/users/forgot-password", { email: user.email });
      showAlert({
        title: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
        icon: "success",
      });
      setPasswordStep("verify");
    } catch (error) {
      showAlert({
        title: error.response?.data?.message || "حدث خطأ أثناء إرسال رمز التحقق",
        icon: "error",
      });
    } finally {
      setSendingCode(false);
    }
  };

  // خطوة 2: تأكيد الرمز وتعيين كلمة المرور الجديدة
  const submitNewPassword = async (e) => {
    e.preventDefault();

    if (!passwordForm.resetCode.trim()) {
      showAlert({ title: "الرجاء إدخال رمز التحقق", icon: "warning" });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showAlert({
        title: "كلمة المرور يجب ألا تقل عن 6 أحرف",
        icon: "warning",
      });
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAlert({ title: "كلمتا المرور غير متطابقتين", icon: "warning" });
      return;
    }

    setResettingPassword(true);
    try {
      // ملاحظة: تأكد أن هذا المسار مطابق لمسار resetPassword الفعلي لديك
      await api.put("/users/reset-password", {
        email: user.email,
        resetCode: passwordForm.resetCode.trim(),
        newPassword: passwordForm.newPassword,
      });

      await showAlertConfirm({
        title: "تم تغيير كلمة المرور بنجاح",
        text: "سيتم تسجيل خروجك الآن، الرجاء تسجيل الدخول بكلمة المرور الجديدة.",
        icon: "success",
        confirmButtonText: "حسناً",
        showCancelButton: false,
      });

      // نظرًا لأن الـ backend يُلغي refreshToken عند تغيير الباسورد
      localStorage.clear();
      window.location.href = "/login";
    } catch (error) {
      showAlert({
        title: error.response?.data?.message || "حدث خطأ أثناء تغيير كلمة المرور",
        icon: "error",
      });
    } finally {
      setResettingPassword(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "غير متوفر";
    return new Date(dateStr).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRole = (role) => {
    const roles = {
      superadmin: "مدير النظام (Super Admin)",
      manager: "مشرف (Manager)",
      customer: "عميل (Customer)",
    };
    return roles[role] || role || "عميل";
  };

  if (err) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-slate-50 text-rose-600">
        <p className="text-base sm:text-lg font-bold">{err.message || "حدث خطأ ما"}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* كارت الغلاف والمعلومات الرئيسية */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-36 bg-gradient-to-l from-slate-900 via-slate-800 to-blue-900 relative">
            <div className="absolute -bottom-10 right-8">
              <div className="w-24 h-24 p-1.5 bg-white rounded-2xl shadow-md">
                <div className="w-full h-full rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                  <User size={40} strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-14 pb-6 px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900">
                  {user?.userName || "مستخدم"}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {formatRole(user?.role)}
                </span>
              </div>
              <p className="text-slate-400 font-mono text-xs mt-1">
                {user?.email}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={openPasswordModal}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-900 hover:text-white text-xs font-bold transition-colors border border-slate-200 cursor-pointer"
              >
                <Lock size={15} />
                <span>تغيير كلمة المرور</span>
              </button>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white text-xs font-bold transition-colors border border-blue-100 cursor-pointer"
                >
                  <Edit3 size={15} />
                  <span>تعديل البيانات</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* كارت عرض وتعديل البيانات */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-10 space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                {isEditing ? "تحديث بيانات الحساب" : "تفاصيل الحساب الشخصي"}
              </h3>
            </div>
            {user?.isVerified && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                حساب موثق ✓
              </span>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="اسم المستخدم" value={user?.userName} icon={User} />
                <DetailItem label="البريد الإلكتروني" value={user?.email} icon={Mail} />
                <DetailItem label="رقم الهاتف" value={user?.phone} icon={Phone} isLtr />
                <DetailItem label="الصلاحية الحالية" value={formatRole(user?.role)} icon={Shield} />
              </div>

              {/* الملاحظات إن وجدت */}
              {user?.notes && (
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5">
                    <FileText size={13} className="text-blue-600" />
                    <span>ملاحظات إضافية</span>
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {user.notes}
                  </p>
                </div>
              )}

              {/* تواريخ الدخول والتسجيل من Schema */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-slate-500 text-xs">
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Calendar size={14} className="text-blue-600" />
                  <span>تاريخ التسجيل: <b>{formatDate(user?.createdAt)}</b></span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <Clock size={14} className="text-blue-600" />
                  <span>آخر تسجيل دخول: <b>{formatDate(user?.lastLogin)}</b></span>
                </div>
              </div>
            </div>
          ) : (
            /* نموذج التعديل */
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateProfile();
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اسم المستخدم (userName)
                  </label>
                  <input
                    type="text"
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    البريد الإلكتروني (email)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رقم الهاتف (phone)
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="010xxxxxxxx"
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 text-right outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    ملاحظات (notes)
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="أي ملاحظات أو تفاصيل إضافية..."
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                  <span>{loading ? "جاري الحفظ..." : "حفظ التغييرات"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  <X size={15} />
                  <span>إلغاء</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* نافذة تغيير كلمة المرور */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center gap-2 text-slate-900">
                <KeyRound size={18} className="text-blue-600" />
                <h3 className="font-black text-base">تغيير كلمة المرور</h3>
              </div>
              <button
                type="button"
                onClick={closePasswordModal}
                disabled={sendingCode || resettingPassword}
                className="text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {passwordStep === "request" ? (
              <div className="space-y-5">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  سيتم إرسال رمز تحقق مكوّن من 6 أرقام إلى بريدك الإلكتروني{" "}
                  <span className="font-bold text-slate-900 font-mono">{user?.email}</span>{" "}
                  لتأكيد تغيير كلمة المرور.
                </p>

                <button
                  type="button"
                  onClick={requestResetCode}
                  disabled={sendingCode}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                >
                  {sendingCode ? <Loader2 size={15} className="animate-spin" /> : <Mail size={15} />}
                  <span>{sendingCode ? "جاري الإرسال..." : "إرسال رمز التحقق"}</span>
                </button>
              </div>
            ) : (
              <form onSubmit={submitNewPassword} className="space-y-4">
                <button
                  type="button"
                  onClick={() => setPasswordStep("request")}
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>تغيير البريد / إعادة الإرسال</span>
                </button>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رمز التحقق
                  </label>
                  <input
                    type="text"
                    name="resetCode"
                    dir="ltr"
                    maxLength={6}
                    value={passwordForm.resetCode}
                    onChange={handlePasswordFormChange}
                    placeholder="••••••"
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm font-mono text-center tracking-[0.4em] text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordFormChange}
                    placeholder="6 أحرف على الأقل"
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordFormChange}
                    placeholder="أعد كتابة كلمة المرور"
                    className="w-full px-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={resettingPassword}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all disabled:opacity-60 cursor-pointer"
                  >
                    {resettingPassword ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Check size={15} />
                    )}
                    <span>{resettingPassword ? "جاري التأكيد..." : "تأكيد التغيير"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closePasswordModal}
                    disabled={resettingPassword}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const DetailItem = ({ label, value, icon: Icon, isLtr = false }) => (
  <div className="flex items-center gap-3.5 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:border-slate-200">
    <div className="p-2.5 bg-white rounded-xl shadow-2xs text-blue-600 border border-slate-100 shrink-0">
      <Icon size={17} />
    </div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-xs sm:text-sm font-bold text-slate-800 mt-0.5 truncate ${isLtr ? "font-mono text-left" : ""}`} dir={isLtr ? "ltr" : "rtl"}>
        {value || "---"}
      </p>
    </div>
  </div>
);

export default Profile;
