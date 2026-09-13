import React, { useState } from "react";
import {
  User,
  Phone,
  Tag,
  FileText,
  MessageSquare,
  Send,
  ChevronDown,
  Loader2,
} from "lucide-react";

export default function ComplaintForm() {
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // منطق الإرسال هنا
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl border border-slate-600 dow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-8 m-5 sm:p-10" dir="rtl">
      
      {/* عنوان ونبذة للفورم (اختياري لتحسين المظهر) */}
      <div className="mb-8 text-center sm:text-start border-b border-slate-100 pb-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          تقديم شكوى أو مقترح
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          نسعى دائماً لتقديم أفضل تجربة. شاركنا تفاصيل شكواك وسنتواصل معك بأسرع وقت.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* الصف الأول: الاسم + رقم الهاتف */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* الاسم بالكامل */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              الاسم بالكامل <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="مثال: أحمد علي محمود"
                className="w-full pr-10 pl-4 py-3 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              />
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* رقم الهاتف */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              رقم الهاتف <span className="text-rose-500">*</span>
            </label>
            
            <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

              <input
                type="tel"
                dir="ltr"
                required
                placeholder="010xxxxxxxx"
                className="w-full pl-10 pr-4 py-3 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-right"
              />
            </div>
          </div>
        </div>

        {/* نوع المعاملة أو الشكوى */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            نوع المعاملة أو الشكوى <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <select
              required
              defaultValue=""
              className="w-full pr-10 pl-10 py-3 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 appearance-none cursor-pointer"
            >
              
              <option value="refund_exchange">طلب استبدال أو استرجاع (استرداد ثلثي المبلغ)</option>
              <option value="delay">تأخر في تنفيذ الطلب</option>
              <option value="service_quality">جودة الخدمة المقدمة</option>
              <option value="payment">مشكلة في الدفع أو الفواتير</option>
              <option value="technical">استفسار أو عطل تقني</option>
              <option value="" disabled>-- اختر تصنيف الشكوى أو الطلب --</option>
              <option value="other">أخرى</option>
            </select>
            
            {/* أيقونة التصنيف على اليمين */}
            <Tag className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            
            {/* سهم القائمة المنسدلة على اليسار */}
            <ChevronDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* عنوان الشكوى */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            عنوان الشكوى <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="مثال: تأخر استلام المعاينة للطلب رقم 98765#"
              className="w-full pr-10 pl-4 py-3 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
            />
            <FileText className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* تفاصيل الشكوى */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold text-slate-700">
              تفاصيل الشكوى <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {charCount} / 500
            </span>
          </div>
          <div className="relative">
            <textarea
              required
              rows={4}
              maxLength={500}
              onChange={(e) => setCharCount(e.target.value.length)}
              placeholder="اكتب تفاصيل الشكوى والملاحظات بدقة هنا..."
              className="w-full p-4 bg-slate-50/60 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* زر الإرسال التفاعلي */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-[0.99] text-white font-bold text-sm dow-lg dow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الإرسال...</span>
              </>
            ) : (
              <>
                <span>تأكيد وإرسال</span>
                <Send className="w-4 h-4 rtl:-scale-x-100" />
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}