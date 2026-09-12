import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  HiOutlineLockClosed, 
  HiOutlineArrowRight, 
  HiOutlineMail, 
  HiOutlineKey, 
  HiOutlineShieldCheck 
} from "react-icons/hi";
import api from "../../services/api";
import { showAlert } from "../../services/alert";
import forgetpass from "/building.jpeg"
export default function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function resetPassword(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await api.put("/users/reset-password", {
        email,
        resetCode,
        newPassword
      });

      setSuccess(true);
      showAlert({
        title: "تم تغيير كلمة المرور بنجاح، جاري التحويل...",
        icon: "success"
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      showAlert({
        title: err.response?.data?.message || "حدث خطأ في العملية",
        icon: "error"
      });
    } finally {
      setLoading(false);
    }
  }

         useEffect(() => {
        document.title ="تغيير كلمة المرور";
      }, []);

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-[#f8fafc] ">
      <div className="bg-white  rounded-3xl overflow-hidden flex w-full  min-h-screen">
        
       {/* left side */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          
          {/* زر الرجوع */}
          <Link 
            to="/login" 
            className="flex items-center gap-2 text-gray-400 hover:text-[#0284c7] mb-8 transition-colors group w-fit"
          >
            <HiOutlineArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            <span className="font-bold">العودة لتسجيل الدخول</span>
          </Link>

          {/* العنوان الرئيسي */}
          <div className="text-right mb-10">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#e0f2fe] rounded-2xl flex items-center justify-center">
                  <HiOutlineLockClosed className="w-6 h-6 text-[#075985]" />
                </div>
                <h1 className="text-3xl font-black text-[#0f172a]">تغيير كلمة المرور</h1>
             </div>
            <p className="text-gray-500 text-lg">أدخل البيانات المطلوبة لاستعادة الوصول إلى حسابك  .</p>
          </div>

          {!success && (
            <form onSubmit={resetPassword} className="space-y-6">
              
              {/* حقل البريد الإلكتروني */}
              <div className="flex flex-col group">
                <label className="mb-2 text-sm font-bold text-[#0f172a] pr-1">البريد الإلكتروني</label>
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-100 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <div className="absolute inset-0 bg-[#e0f2fe] translate-x-full transition-transform duration-500 ease-out group-focus-within:translate-x-0 w-full"></div>
                  <div className="relative z-10 flex items-center px-4">
                    <HiOutlineMail className="text-gray-400 w-6 h-6" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.com"
                      required
                      className="w-full bg-transparent px-4 py-4 text-lg outline-none text-[#0f172a] placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* حقل كود التحقق */}
              <div className="flex flex-col group">
                <label className="mb-2 text-sm font-bold text-[#0f172a] pr-1">كود التحقق (OTP)</label>
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-100 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <div className="absolute inset-0 bg-[#e0f2fe] translate-x-full transition-transform duration-500 ease-out group-focus-within:translate-x-0"></div>
                  <div className="relative z-10 flex items-center px-4">
                    <HiOutlineShieldCheck className="text-gray-400 w-6 h-6" />
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="أدخل الكود المكون من 6 أرقام"
                      maxLength="6"
                      required
                      className="w-full bg-transparent px-4 py-4 text-lg outline-none text-[#0f172a] tracking-widest placeholder:tracking-normal placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* حقل كلمة المرور الجديدة */}
              <div className="flex flex-col group">
                <label className="mb-2 text-sm font-bold text-[#0f172a] pr-1">كلمة المرور الجديدة</label>
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-100 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <div className="absolute inset-0 bg-[#e0f2fe] translate-x-full transition-transform duration-500 ease-out group-focus-within:translate-x-0"></div>
                  <div className="relative z-10 flex items-center px-4">
                    <HiOutlineKey className="text-gray-400 w-6 h-6" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength="8"
                      className="w-full bg-transparent px-4 py-4 text-lg outline-none text-[#0f172a]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-l from-blue-700 to-blue-500 text-white rounded-2xl font-bold text-xl shadow-lg shadow-blue-100 hover:shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center border-t border-gray-50 pt-6">
            <p className="text-gray-500">
              لم يصلك الكود؟{" "}
              <Link to="/forget-password" name="resend" className="text-blue-600 font-bold hover:underline">
                إعادة الإرسال
              </Link>
            </p>
          </div>
        </div>

      {/* right side */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#075985]/80 to-transparent z-10"></div>
           <img 
                    loading="lazy"
            src={forgetpass}
            alt="صورة تعبيرية"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-16 right-12 z-20 text-white">
            <h2 className="text-4xl font-black mb-4">أمان حسابك أولويتنا</h2>
            <p className="text-xl opacity-90 max-w-sm leading-relaxed">نحن نستخدم أحدث تقنيات التشفير لضمان حماية بياناتك .</p>
          </div>
        </div>

      </div>
    </div>
  );
}