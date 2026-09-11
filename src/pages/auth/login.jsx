import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { showAlert } from "../../services/alert";
import { jwtDecode } from "jwt-decode";
import login from "/building.jpeg"
import Swal from "sweetalert2";

function Login() {
  const Navigate = useNavigate();
  const RememberValue = JSON.parse(localStorage.getItem("remember"));

  const logo = "/logo.jpeg";

  // State for form data
  const [Form, SetForm] = useState({
    email: RememberValue?.email || "",
    password: RememberValue?.password || ""
  });

  // State for remember me checkbox
  const [Remember, setRemember] = useState(false);

  // loading state for API call
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const OnChange = (e) => {
    SetForm({ ...Form, [e.target.name]: e.target.value });
  };

  const showTerms = () => {
    Swal.fire({
      title: "شروط الخدمة",
      html: `
        <div style="text-align: right; line-height: 1.8;">
          <p>يجب استخدام الموقع بشكل قانوني وعدم إساءة استخدام الخدمات.</p>
          <p>جميع الأسعار قابلة للتغيير دون إشعار مسبق.</p>
          <p>المتجر غير مسؤول عن أي استخدام خاطئ للمنتجات.</p>
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
          <p>مرحبًا بك في متجر أبو الدهب للمنتجات الغذائية.</p>
          <p>باستخدامك للموقع، فإنك توافق على الالتزام بجميع الشروط والأحكام.</p>
          <p>نحرص على تقديم أفضل جودة وخدمة لعملائنا.</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "موافق",
      confirmButtonColor: "#0284c7",
      width: 500,
    });
  };

  useEffect(() => {
    document.title = "تسجيل الدخول - نظام هاني  ";
  }, []);


  // Main login logic with English comments
  const LoginProcess = async () => {
    setLoading(true);
    const isFormIncomplete = Object.values(Form).some(value => value.trim() === "");
    if (isFormIncomplete) {
      setLoading(false);
      return showAlert({
        title: "يرجى ملء جميع الحقول المطلوبة",
        icon: "warning"
      });
    }



    try {
      const Res = await api.post("/users/login", {
        email: Form.email,
        password: Form.password
      });


      const Data = Res.data;
      if (Data.accessToken) {
        localStorage.setItem("token", Data.accessToken);
 


        localStorage.setItem("userName", JSON.stringify(Data.userName));



        setLoading(false);
        if (Remember) localStorage.setItem("remember", JSON.stringify(Form));

        showAlert({ title: "تم تسجيل الدخول بنجاح", icon: "success" });

        const decoded = jwtDecode(Data.accessToken);
        const role = decoded.role;
        if (role === "admin" || role === "superadmin") {
          document.title = "لوحه التحكم نظام  هاني ";
          Navigate("/admin_dashboard");
        } else {
          Navigate("/");
        }
      }
    } catch (err) {
      setLoading(false);
      showAlert({ title: err.response?.data?.message || "خطأ في الاتصال", icon: "error" });
    }
  };

  return (
    <div className="min-h-screen flex bg-white " dir="rtl">

      {/* Right Side: Form Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 md:p-16 bg-[#f8fafc]">

        <div className="w-full max-w-[550px]">
          {/* Header Section - Text aligned right */}
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
            <h1 className="text-4xl font-extrabold text-[#0f172a] mb-4">تسجيل الدخول</h1>
            <p className="text-xl text-gray-500">مرحباً بك مجدداً! يرجى إدخال بياناتك للمتابعة.</p>
          </div>

          {/* Form Content */}
          <div className="space-y-8">

            {/* Email Field with Background Animation */}
            <div className="flex flex-col text-right group">
              <label className="mb-3 text-lg font-bold text-[#0f172a] pr-1">البريد الإلكتروني للعمل</label>
              <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                {/* Background Slider - Moves from right to left */}
                <div className="absolute inset-0 bg-[#e0f2fe] translate-x-full transition-transform duration-500 ease-out group-focus-within:translate-x-0"></div>

                <input
                  type="email"
                  name="email"
                  value={Form.email}
                  onChange={OnChange}
                  className="relative z-10 w-full bg-transparent px-6 py-5 text-xl outline-none text-right text-[#0f172a] placeholder:text-gray-400"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            {/* Password Field with Background Animation */}
            <div className="flex flex-col text-right group">
              <div className="flex justify-between items-center mb-3 pr-1">
                <label className="text-lg font-bold text-[#0f172a]">كلمة المرور</label>
                <button
                  onClick={() => Navigate("/forget-Password")}
                  className="text-sm font-bold text-blue-500 hover:underline"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 transition-all duration-300 group-focus-within:border-[#0284c7]">
                {/* Background Slider */}
                <div className="absolute inset-0 bg-[#e0f2fe] translate-x-full transition-transform duration-500 ease-out group-focus-within:translate-x-0"></div>

                <input
                  type="password"
                  name="password"
                  value={Form.password}
                  onChange={OnChange}
                  className="relative z-10 w-full bg-transparent px-6 py-5 text-xl outline-none text-right text-[#0f172a]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center gap-3 pr-2 justify-start">
              <input
                type="checkbox"
                onChange={(e) => setRemember(e.target.checked)}
                id="remember"
                className="h-6 w-6 rounded border-gray-300 text-[#0284c7] focus:ring-[#0284c7] cursor-pointer"
              />
              <label htmlFor="remember" className="text-lg text-gray-600 select-none cursor-pointer">تذكر هذا الجهاز</label>
            </div>

            {/* Login Button */}
            <button
              disabled={loading}
              type="button"
              onClick={LoginProcess}
              className="w-full py-5 mt-4 rounded-2xl text-white font-bold text-xl bg-gradient-to-l from-blue-700 to-blue-500 hover:from-[#0369a1] hover:to-[#0ea5e9] shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
            >
              {loading ? "جارٍ الإرسال..." : "تسجيل الدخول"}

              <i className="fas fa-arrow-left text-lg"></i>
            </button>

            {/* Registration Link */}
            <div className="pt-6 text-right pr-2 flex flex-col gap-3 items-center justify-center md:flex-row md:justify-between">

              <p className="text-lg text-gray-500">
                ليس لديك حساب؟ <span onClick={() => Navigate("/register")} className="text-blue-700  font-bold cursor-pointer hover:underline">سجل الآن</span>
              </p>
            </div>
          </div>
        </div>


        {/* Footer Links */}
        <div className="mt-16 flex gap-10 text-[13px] font-bold text-gray-400 uppercase tracking-widest justify-start w-full max-w-[550px]">
          <span onClick={showPolicy} className="cursor-pointer hover:text-[#0284c7]">سياسة الخصوصية</span>
          <span onClick={showTerms} className="cursor-pointer hover:text-[#0284c7]">شروط الخدمة</span>
        </div>
      </div>

      {/* Left Side: Dynamic Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* latout  */}
        <div className="absolute inset-0  bg-gradient-to-tr from-[#0f172a]/60 via-transparent to-transparent z-10"></div>

        <img
          loading="lazy"
          src={login}
          alt="Frozen Food Assortment"
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-[10s]"
        />{/* latout  */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0f172a]/20 via-[#0f172a]/40 to-transparent z-10"></div>
        <div className="absolute bottom-24 right-16 z-20 text-white text-right">
          <h4 className="text-4xl font-black mb-6 leading-tight">A Confident Step, <br /> Towards Secure Real Estate</h4>
          <p className="text-2xl opacity-90 max-w-lg font-light">'Integrated contracting solutions, certified structural inspections, and trusted supplies safeguarding your property assets.'</p>
        </div>
      </div>



    </div>
  );
}

export default Login;