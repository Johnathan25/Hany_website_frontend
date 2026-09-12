import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { showAlert } from "../../services/alert";
import signup from "/building.jpeg"
import Swal from "sweetalert2";
function Signup() {
  const Navigate = useNavigate();
  const logo = "/logo.jpeg";
  const [Form, SetForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "", 
    city: "",
    street: "",
    building: "",
    floor: "",
    region:"",
    phoneNumber: ""
  });

  const showTerms = () => {
  Swal.fire({
    title: "شروط الخدمة",
    html: `
      <div style="text-align: right; line-height: 1.8;">
        <p>يجب استخدام الموقع بشكل قانوني وعدم إساءة استخدام الخدمات.</p>
        <p>جميع الأسعار قابلة للتغيير دون إشعار مسبق.</p>
        <p>الشركة غير مسؤولة عن أي استخدام خاطئ .</p>
      </div>
    `,
    icon: "warning",
    confirmButtonText: "تم",
    confirmButtonColor: "#0284c7",
  });
};

  const showPolicy = () => {
  Swal.fire({
    title: "سياسة الاستخدام",
    html: `
     <div style="text-align: right; line-height: 1.8;">
  <p>مرحبًا بك في منصة Large Step لخدمات الصيانة والتشطيبات.</p>
  <p>باستخدامك للموقع أو طلب خدمة معاينة، فإنك توافق على الالتزام بجميع الشروط والسياسات المتبعة.</p>
  <p>نلتزم بتقديم أعلى معايير الجودة الفنية والمتابعة المستمرة لضمان دقة التنفيذ.</p>
</div>
    `,
    icon: "info",
    confirmButtonText: "موافق",
    confirmButtonColor: "#0284c7",
    width: 500,
  });
};

//   loading state for API call
  const [loading, setLoading] = useState(false);

  const OnChange = (e) => {
    SetForm({ ...Form, [e.target.name]: e.target.value });
  };

  const SignupProcess = async () => {
    setLoading(true);
    const isFormIncomplete = Object.values(Form).some(value => value.trim() === "");
    if (isFormIncomplete) {
        setLoading(false);
      return showAlert({
        title: "يرجى ملء جميع الحقول المطلوبة",
        icon: "warning"
      });
    }

    if (Form.password.length < 8) {
        setLoading(false);
      return showAlert({
        title: "كلمة المرور ضعيفة، يجب أن تكون 8 أحرف على الأقل",
        icon: "error"
      });
    }

    
    if (Form.password !== Form.confirmPassword) {
        setLoading(false);
      return showAlert({
        title: "كلمة المرور غير متطابقة",
        icon: "error"
      });
    }

    try {
      const Res = await api.post("/users/sign-up", {
        userName: Form.userName,
        email: Form.email,
        password: Form.password,
        address: {
          city: Form.city,
          street: Form.street,
          building: Form.building,
          floor: Form.floor,
          region:Form.region
        },
        phoneNumber: Form.phoneNumber
      });

      showAlert({
        title: Res.data?.message || "تم إنشاء الحساب بنجاح",
        icon: "success"
      });
      setLoading(false);

      Navigate("/login");

    } catch (err) {
        setLoading(false);
      showAlert({
        title: err.response?.data?.message || "حدث خطأ في الاتصال بالخادم",
        icon: "error"
      });
    }
  };

         useEffect (() => {
        document.title = "تسجيل حساب جديد";
      }, []);

  return (
    <div className="min-h-screen flex bg-white " dir="rtl">
      
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-[#f8fafc]">
        
        <div className="w-full max-w-[650px]">
          <div className="mb-12 text-right">
            <div className="flex items-center gap-4 mb-6 justify-start">
                
                <div className="w-14 h-14  rounded-2xl flex items-center justify-center ">
                <Link to="/">
                  <div className="w-14 h-14  rounded-2xl flex items-center justify-center overflow-hidden">
                    <img src={logo} alt="Logo" className="w-full-1 h-full-1 object-cover" />
                  </div>
                </Link>
              </div>

              <h2 className="text-3xl font-black text-[#0f172a]">Large Step</h2>
            </div>
            <h1 className="text-4xl font-extrabold text-[#0f172a] mb-4">إنشاء حساب جديد</h1>
            <p className="text-xl text-gray-500">انضم إلينا اليوم .</p>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-8 gap-y-8">
              
              <div className="flex flex-col text-right group">
                <label className="mb-3 text-lg font-bold text-[#0f172a] pr-1">اسم المستخدم</label>
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <div className="absolute inset-0 bg-[#e0f2fe] translate-x-full transition-transform duration-500 ease-out group-focus-within:translate-x-0"></div>
                  <input type="text" name="userName" value={Form.userName} onChange={OnChange} className="relative z-10 w-full bg-transparent px-6 py-5 text-xl outline-none text-right text-[#0f172a]" placeholder="أحمد محمد" />
                </div>
              </div>

              <div className="flex flex-col text-right group">
                <label className="mb-3 text-lg font-bold text-[#0f172a] pr-1">البريد الإلكتروني للعمل</label>
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <div className="absolute inset-0 bg-[#e0f2fe] translate-x-full transition-transform duration-500 ease-out group-focus-within:translate-x-0"></div>
                  <input type="email" name="email" value={Form.email} onChange={OnChange} className="relative z-10 w-full bg-transparent px-6 py-5 text-xl outline-none text-right text-[#0f172a]" placeholder="name@company.com" />
                </div>
              </div>

              <div className="flex flex-col text-right group">
                <label className="mb-3 text-lg font-bold text-[#0f172a] pr-1">كلمة المرور</label>
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <div className="absolute inset-0 bg-[#e0f2fe] translate-x-full transition-transform duration-500 ease-out group-focus-within:translate-x-0"></div>
                  <input type="password" name="password" value={Form.password} onChange={OnChange} className="relative z-10 w-full bg-transparent px-6 py-5 text-xl outline-none text-right text-[#0f172a]" placeholder="••••••••" />
                </div>
              </div>

              {/* حقل تأكيد كلمة المرور المضاف */}
              <div className="flex flex-col text-right group">
                <label className="mb-3 text-lg font-bold text-[#0f172a] pr-1">تأكيد كلمة المرور</label>
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <div className="absolute inset-0 bg-[#e0f2fe] translate-x-full transition-transform duration-500 ease-out group-focus-within:translate-x-0"></div>
                  <input type="password" name="confirmPassword" value={Form.confirmPassword} onChange={OnChange} className="relative z-10 w-full bg-transparent px-6 py-5 text-xl outline-none text-right text-[#0f172a]" placeholder="••••••••" />
                </div>
              </div>

              <div className="flex flex-col text-right group">
                <label className="mb-3 text-lg font-bold text-[#0f172a] pr-1">رقم الهاتف</label>
                <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <div className="absolute inset-0 bg-[#e0f2fe] translate-x-full transition-transform duration-500 ease-out group-focus-within:translate-x-0"></div>
                  <input type="text" name="phoneNumber" value={Form.phoneNumber} onChange={OnChange} className="relative z-10 w-full bg-transparent px-6 py-5 text-xl outline-none text-right text-[#0f172a]" placeholder="010xxxxxxx" />
                </div>
              </div>
            </div>

            <hr className="border-gray-200 my-10" />
            <h3 className="text-2xl font-black text-blue-600 mb-6 text-right">بيانات العنوان </h3>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-6">
              <div className="flex flex-col text-right group">
                <label className="mb-2 text-base font-bold text-[#0f172a] pr-1">المحافظة</label>
                <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <input type="text" name="city" value={Form.city} onChange={OnChange} className="relative z-10 w-full bg-transparent px-5 py-4 text-lg outline-none text-right text-[#0f172a]" placeholder="القاهرة" />
                </div>
              </div>
                              <div className="flex flex-col text-right group">
                <label className="mb-2 text-base font-bold text-[#0f172a] pr-1">المنظقة</label>
                <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <input type="text" name="region" value={Form.region} onChange={OnChange} className="relative z-10 w-full bg-transparent px-5 py-4 text-lg outline-none text-right text-[#0f172a]" placeholder="مدينه نصر" />
                </div>
              </div>
              <div className="flex flex-col text-right group">
                <label className="mb-2 text-base font-bold text-[#0f172a] pr-1">الشارع</label>
                <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <input type="text" name="street" value={Form.street} onChange={OnChange} className="relative z-10 w-full bg-transparent px-5 py-4 text-lg outline-none text-right text-[#0f172a]" placeholder="شارع النصر" />
                </div>
              </div>
              <div className="flex flex-col text-right group">
                <label className="mb-2 text-base font-bold text-[#0f172a] pr-1">المبنى</label>
                <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <input type="text" name="building" value={Form.building} onChange={OnChange} className="relative z-10 w-full bg-transparent px-5 py-4 text-lg outline-none text-right text-[#0f172a]" placeholder="12" />
                </div>
              </div>
              <div className="flex flex-col text-right group">
                <label className="mb-2 text-base font-bold text-[#0f172a] pr-1">الدور</label>
                <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                  <input type="text" name="floor" value={Form.floor} onChange={OnChange} className="relative z-10 w-full bg-transparent px-5 py-4 text-lg outline-none text-right text-[#0f172a]" placeholder="3" />
                </div>
              </div>

            </div>

            <button
            disabled={loading}
              type="button"
              onClick={SignupProcess}
              className="w-full py-5 mt-6 rounded-2xl text-white font-bold text-xl bg-gradient-to-l from-blue-700 to-blue-500 hover:from-[#0369a1] hover:to-[#0ea5e9] shadow-xl transition-all active:scale-[0.98]"
            >
            {loading ? "جارٍ الإرسال..." : "انشاء الحساب"}
            </button>

            <div className="pt-6 text-right pr-2">
              <p className="text-lg text-gray-500">
                لديك حساب بالفعل؟ <span onClick={() => Navigate("/login")} className="text-[#0284c7] font-bold cursor-pointer hover:underline">سجل دخولك الآن</span>
              </p>
            </div>
          </form>
                  {/* Footer Links */}
        <div className="mt-16 flex gap-10 text-[13px] font-bold text-gray-400 uppercase tracking-widest justify-start w-full max-w-[550px]">
            <span onClick={showPolicy} className="cursor-pointer hover:text-[#0284c7]">سياسة الخصوصية</span>
            <span onClick={showTerms} className="cursor-pointer hover:text-[#0284c7]">شروط الخدمة</span>

        </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a]/70 via-transparent to-transparent z-10"></div>
                {/* latout  */}
        <div className="absolute inset-0  bg-gradient-to-tr from-blue-400/40 via-transparent to-blue-300/40 z-10"></div>
         <img 
                    loading="lazy" src={signup} alt="Food" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute bottom-24 right-16 z-20 text-white text-right">
           <h2 className="text-6xl font-black mb-6 leading-tight">Join our company<br/> large Step</h2>
           <p className="text-2xl opacity-90 max-w-lg font-light">Start your journy with us</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;