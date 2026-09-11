import { useState } from "react";
import { FaPaperPlane, FaBell, FaInfoCircle, FaCheckCircle, FaSpinner } from "react-icons/fa";
import api from "../../../services/api";
import { showAlert } from "../../../services/alert";


export default function BroadcastNotification() {
  const [formData, setFormData] = useState({ title: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.message) {
      return showAlert({icon:"error",title:"يرجى ملء جميع الحقول"});
    }

    try {
      setLoading(true);
      await api.post("/admin/brodcast", formData);
      showAlert({icon:"success",title:"تم إرسال الإشعار لجميع المستخدمين بنجاح"});
      setFormData({ title: "", message: "" });
    } catch (err) {
      console.error(err);
      showAlert({title:"فشل في إرسال الإشعار",icon:"error"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen font-" dir="rtl">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <FaBell className="text-xl" />
          </div>
          إرسال إشعار عام
        </h2>
        <p className="text-gray-400 mt-2 text-sm flex items-center gap-1">
          <FaInfoCircle className="text-xs" />
          سيتم إرسال هذه الرسالة إلى جميع المستخدمين النشطين في الوقت الفعلي.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
        
        {/* Form Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">عنوان الإشعار</label>
              <input
                type="text"
                placeholder="مثلاً: تحديث جديد، عرض خاص..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all text-sm"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">نص الرسالة</label>
              <textarea
                rows="5"
                placeholder="اكتب تفاصيل الإشعار هنا..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-200 outline-none transition-all text-sm resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              ></textarea>
            </div>
          </div>

          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
          >
            {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane className="text-sm" />}
            ارسال الإشعار الآن
          </button>
        </div>

        {/* Live Preview Section */}
        <div className="bg-gray-50 rounded-lg p-8 border border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
          <span className="absolute top-4 right-6 text-[10px] font-bold text-gray-300 uppercase tracking-widest italic">Live Preview / معاينة</span>
          
          <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl border border-gray-50 overflow-hidden transform rotate-1 transition-transform hover:rotate-0 duration-500">
            <div className="p-4 border-b border-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-inner">
                <FaBell className="animate-pulse" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-800 truncate">
                  {formData.title || "عنوان الإشعار يظهر هنا"}
                </h4>
                <p className="text-[10px] text-gray-400">الآن • نظام الإشعارات</p>
              </div>
            </div>
            <div className="p-4 bg-white">
              <p className="text-xs text-gray-500 leading-relaxed min-h-[40px]">
                {formData.message || "اكتب رسالتك في النموذج لرؤية كيف ستبدو للمستخدمين..."}
              </p>
            </div>
            <div className="px-4 py-3 bg-gray-50 flex justify-end">
               <div className="text-[9px] font-bold text-blue-500 flex items-center gap-1">
                 <FaCheckCircle /> جاهز للإرسال
               </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-50 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        </div>

      </div>
    </div>
  );
}