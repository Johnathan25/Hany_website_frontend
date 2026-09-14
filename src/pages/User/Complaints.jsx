import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import {
  MessageSquareWarning,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Tag,
  FileText,
  AlignLeft,
} from "lucide-react";

export default function Complaints() {
  const { isAr } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    type: "شكوى بخصوص الخدمة",
    title: "",
    details: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    // التحقق المبدئي
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.type.trim() ||
      !formData.title.trim() ||
      !formData.details.trim()
    ) {
      setErrorMsg(isAr ? "يرجى ملء جميع الحقول المطلوبة" : "All fields are required");
      return;
    }

    setLoading(true);

    try {
      // إرسال البيانات للباك إند (المسار: /complaints)
      const res = await api.post("/complaints", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        type: formData.type.trim(),
        title: formData.title.trim(),
        details: formData.details.trim(),
      });

      setSuccessMsg(
        res.data?.message ||
          (isAr
            ? "تم إرسال شكواك بنجاح، وسيقوم فريقنا بمراجعتها والرد في أقرب وقت."
            : "Your complaint has been submitted successfully.")
      );

      // تصفير الحقول بعد الإرسال الناجح
      setFormData({
        name: "",
        phone: "",
        type: "شكوى بخصوص الخدمة",
        title: "",
        details: "",
      });
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.response?.data?.error ||
          (isAr ? "حدث خطأ أثناء إرسال الشكوى، يرجى المحاولة لاحقاً" : "Failed to submit complaint")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* رأس الصفحة */}
        <div className="text-center space-y-2">
        
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            {isAr ? "تقديم شكوى أو مقترح" : "Submit a Complaint / Feedback"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            {isAr
              ? "نحرص دائماً على تقديم أعلى جودة ممكنة. إذا واجهتك أي مشكلة أو كان لديك مقترح، يرجى إرسال التفاصيل لنقوم بدراستها مباشرة."
              : "We strive to deliver the highest standard of service. Let us know your issue or suggestion and we will review it immediately."}
          </p>
        </div>

        {/* رسائل التنبيه والنجاح */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs sm:text-sm shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center gap-3 text-xs sm:text-sm shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* كارت النموذج */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* الاسم ورقم الهاتف */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAr ? "الاسم الكامل" : "Full Name"} *</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={isAr ? "أدخل اسمك الكريم..." : "Enter your full name"}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{isAr ? "رقم الهاتف للتواصل" : "Phone Number"} *</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={isAr ? "01xxxxxxxxx" : "+20xxxxxxxxx"}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {/* نوع المعاملة */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>{isAr ? "نوع المعاملة" : "Category"} *</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-500 cursor-pointer font-medium text-slate-700"
              >
                <option value="" disabled>-- اختر تصنيف الشكوى أو الطلب --</option>
                <option value="refund_exchange">طلب استبدال أو استرجاع (استرداد ثلثي المبلغ)</option>
                <option value="delay">تأخر في تنفيذ الطلب</option>
                <option value="service_quality">جودة الخدمة المقدمة</option>
                <option value="payment">مشكلة في الدفع أو الفواتير</option>
                <option value="technical">استفسار أو عطل تقني</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            {/* عنوان الشكوى */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>{isAr ? "عنوان موجز للشكوى" : "Subject"} *</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder={
                  isAr
                    ? "مثال: تأخر الرد بخصوص تقرير المعاينة الإنشائية"
                    : "e.g., Delay in structural inspection report"
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {/* تفاصيل الشكوى */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>{isAr ? "التفاصيل والشرح الكامل" : "Detailed Description"} *</span>
              </label>
              <textarea
                name="details"
                rows={5}
                required
                value={formData.details}
                onChange={handleChange}
                placeholder={
                  isAr
                    ? "اشرح بالتفصيل ما حدث معك لمساعدتنا في اتخاذ الإجراء المناسب..."
                    : "Provide detailed context to help us take immediate action..."
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all resize-none"
              />
            </div>

            {/* زر الإرسال */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-slate-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isAr ? "جاري الإرسال..." : "Sending..."}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 rtl:rotate-180" />
                    <span>{isAr ? "إرسال الشكوى للمراجعة" : "Submit Complaint"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}