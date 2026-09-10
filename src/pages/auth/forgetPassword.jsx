import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineArrowRight } from "react-icons/hi"; // تم تغيير السهم لليمين ليناسب الـ RTL
import api from "../../services/api";
import { showAlert } from "../../services/alert";

import forgetpass from "/building.jpeg"
export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

         useEffect (() => {
        document.title = "نسيت كلمة المرور - نظام أبو الدهب";
      }, []);
  async function forgetPassword(e) {
    e.preventDefault();
        
    const isFormIncomplete = Object.values(email).some(value => value.trim() === "");
    if (isFormIncomplete) {
      return showAlert({
        title: "يرجى ملء جميع الحقول المطلوبة",
        icon: "warning"
      });
    }
    try {
      setLoading(true);
      await api.put("/users/forgot-password", { email: email });

      setSent(true);
      showAlert({
        title: "تم إرسال رابط إعادة تعيين كلمة المرور",
        icon: "success"
      });

      setTimeout(() => {
        navigate("/reset-password");
      }, 2000); 

    } catch (err) {
      showAlert({
        title: err.response?.data?.message || "حدث خطأ، حاول مرة أخرى",
        icon: "error"
      });
    } finally {
      setLoading(false);
      setSent(false);

    }
  }

  return (
    <div className="min-h-screen flex bg-white font-cairo" dir="rtl">
      
      {/* Right Side: Form Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-[#f8fafc]">
        
        <div className="w-full max-w-[500px]">
          
          {/* Back Button */}
          <Link 
            to="/تسجيل_الدخول" 
            className="flex items-center gap-2 text-[#0284c7] hover:text-[#075985] mb-10 font-bold transition-colors w-fit"
          >
            <HiOutlineArrowRight className="w-5 h-5" />
            العودة لتسجيل الدخول
          </Link>

          {/* Header */}
          <div className="mb-10 text-right">
             <div className="w-16 h-16 bg-[#e0f2fe] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <HiOutlineMail className="w-8 h-8 text-[#0284c7]" />
             </div>
             <h1 className="text-4xl font-extrabold text-[#0f172a] mb-4">نسيت كلمة المرور؟</h1>
             <p className="text-xl text-gray-500 leading-relaxed">
               لا تقلق، أدخل بريدك الإلكتروني وسنرسل لك رابطاً لاستعادة حسابك.
             </p>
          </div>

          {!sent ? (
            <form onSubmit={forgetPassword} className="space-y-8">
              
              {/* Email Field with Background Animation (Same as تسجيل_الدخول) */}
              <div className="flex flex-col text-right group">
                <label className="mb-3 text-lg font-bold text-[#0f172a] pr-1">البريد الإلكتروني المسجل</label>
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  {/* Background Slider */}
                  <div className="absolute inset-0 bg-[#e0f2fe] translate-x-full transition-transform duration-500 ease-out group-focus-within:translate-x-0"></div>
                  
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="relative z-10 w-full bg-transparent px-6 py-5 text-xl outline-none text-right text-[#0f172a] placeholder:text-gray-300"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 rounded-2xl text-white font-bold text-xl bg-gradient-to-l from-[#075985] to-[#0284c7] hover:from-[#0369a1] hover:to-[#0ea5e9] shadow-xl shadow-blue-100 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
              </button>

            </form>
          ) : (
            <div className="bg-green-50 p-8 rounded-3xl border border-green-100 text-center">
               <div className="text-green-600 font-bold text-xl">
                 تم الإرسال بنجاح! يتم الآن تحويلك...
               </div>
            </div>
          )}

          {/* Registration Helper Link */}
          <div className="mt-10 text-center">
            <p className="text-lg text-gray-500">
              ليس لديك حساب؟ <Link to="/انشاء_حساب" className="text-[#0284c7] font-bold hover:underline">سجل الآن</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Left Side: Decorative Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a]/70 via-transparent to-transparent z-10"></div>
        

        <img 
          src={forgetpass} 
          alt="Fresh Food Assortment" 
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[10s]"
        />
        
        <div className="absolute bottom-24 right-16 z-20 text-white text-right">
           <h2 className="text-5xl font-black mb-6 leading-tight">أمن حسابك <br/> يهمنا دائماً</h2>
           <p className="text-2xl opacity-90 max-w-lg font-light">نحن نستخدم أحدث التقنيات لضمان وصولك الآمن لمنتجاتنا وخدماتنا.</p>
        </div>
      </div>

    </div>
  );
}