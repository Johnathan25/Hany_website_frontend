import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";




// import NotFound from "./pages/404Page";
import ScrollToTop from "./services/scrollToTop";
import logo from "/logo.jpeg"; // تأكد من مسار الصورة الصحيح عندك

// import ProtectedRoute from "./services/protectRoutes";
// import ProtectedAccess from "./services/protectAccess";
// import AdminLayout from "./Layout/adminSide";
// import ClientLayout from "./Layout/clientSide";
import { FaAngleUp } from "react-icons/fa";
// import { showAlert } from "./services/alert";
// import api from "./services/api";
// import ReportsPage from "./pages/admin/reports/reports";
// import Dashboard from "./pages/admin/dashboard/dashboard";
// import OrderInvoice from "./pages/print/order";
import AppRoutes from "./AppRoutes";
import useOnlineStatus from "./services/checkInternet";
// =====================
// Auth (Lazy optional)
// =====================
// const Login = lazy(() => import("./pages/auth/login"));
// const Signup = lazy(() => import("./pages/auth/signup"));
// const ForgetPassword = lazy(() => import("./pages/auth/forgetPassword"));
// const ResetPassword = lazy(() => import("./pages/auth/resetPassword"));
// const PhoneLogin = lazy(() => import("./pages/auth/loginByPhone"));

// =====================
// Admin Pages
// =====================
// const ProductManager = lazy(() => import("./pages/admin/product/createProduct"));
// const ProductList = lazy(() => import("./pages/admin/product/displayAllProduct"));
// const MaybeSellProducts = lazy(() => import("./pages/admin/product/maybesellproducts"));
// const BestSellerAdmin = lazy(() => import("./pages/admin/product/bestSeller"));

// const OrdersList = lazy(() => import("./pages/admin/order/showAllOrder"));
// const OrderDetail = lazy(() => import("./pages/admin/order/showOrderDetails"));

// const AllUsersTable = lazy(() => import("./pages/admin/users/allUsers"));
// const UserDetails = lazy(() => import("./pages/admin/users/userProfile"));

// const AllAdminTable = lazy(() => import("./pages/admin/admins/allAdmin"));
// const AdminDetails = lazy(() => import("./pages/admin/admins/adminProfile"));
// const CreateAdmin = lazy(() => import("./pages/admin/admins/addAdmin"));

// const ReviewsAdmin = lazy(() => import("./pages/admin/review/reviews"));
// const BroadcastNotification = lazy(() => import("./pages/admin/notifications/createNotification"));
// const SettingsAdmin = lazy(() => import("./pages/admin/setting/settings"));
// const Profile = lazy(() => import("./pages/customer/profile"));

// =====================
// Client Pages
// =====================
// const Main = lazy(() => import("./pages/customer/mainLayout"));
// const AllProducts = lazy(() => import("./pages/customer/products/allProducts"));
// const ProductDetails = lazy(() => import("./pages/customer/products/productDetails"));
// const ProductSearch = lazy(() => import("./pages/customer/products/searchProduct"));

// const CartPage = lazy(() => import("./pages/customer/cart/cart"));
// const Checkout = lazy(() => import("./pages/customer/order/createOrder"));
// const TrackOrder = lazy(() => import("./pages/customer/order/trackOrder"));

// const Notifications = lazy(() => import("./pages/notification/notification"));

// =====================

function App() {
  const upToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


//   const  [token,setToken]=useState(localStorage.getItem("token") || "")
// const fetchUser = async () => {
//   try {

//     const res = await api.get("/users/getProfile");
//     return res.data;

//   } catch (err) {
//     console.log(err.response?.data?.message);

    
//       localStorage.removeItem("cart");
//       localStorage.removeItem("token");
//       localStorage.removeItem("userName");

      
//       setToken("");
    

//     showAlert({
//       icon: "error",
//       title: err.response?.data?.message || "Something went wrong"
//     });

//     setTimeout(() => {
//       window.location = "/تسجيل_الدخول";
//     }, 500);
//   }
// };

// useEffect(() => {
//   if (token) {
//     fetchUser();
//   }
// }, []);

const navigate = useNavigate();
const isOnline = useOnlineStatus();

useEffect(() => {
  if (!isOnline) {
    navigate("/فقد_الأتصال_بالانترنت", { replace: true });
  }
}, [isOnline, navigate]);


  return (
    <div className="App font-Cairo bg-white">
      
        <ScrollToTop />


{/* Suspense Wrapper */}
<Suspense
  fallback={
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden select-none">
      
      {/* دوائر خلفية مضيئة ناعمة (Glow Background) */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-[#0284c7]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* 1. قسم اللوجو (Logo Section) فوق الكارت */}
      <div className="relative z-10 flex flex-col items-center mb-6">
        {/* كلمة logo الصغيرة الافتراضية بشكل ناعم */}
        <span className="text-slate-500 text-xs tracking-widest uppercase mb-2">ابو الدهب للمنتجات الغذائيه</span>
        
        {/* حاوية الصورة مع تأثير التوهج الدائري الأزرق */}
        <div className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-b from-[#0284c7]/30 to-transparent flex items-center justify-center shadow-[0_0_30px_rgba(2,132,199,0.3)] border border-[#0284c7]/20">
          <img 
            src={logo} 
            alt="Abu El-Dahab Logo" 
            className="w-full h-full object-contain rounded-full"
          />
        </div>
      </div>

      {/* 2. كارت جلاسمورفيزم (Glassmorphism Card) */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md p-8 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/[0.05] shadow-2xl mx-4">
        
        {/* جملة سبورت صغيرة أعلى الكارت على اليمين */}
        <div className="absolute top-4 right-6 flex items-center gap-1.5 opacity-60" dir="rtl">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7] animate-ping"></span>
          <span className="text-[10px] text-slate-400 font-light">مدعوم من أبو الذهب للمنتجات الغذائية</span>
        </div>

        {/* عنصر الحركة الدائري (Loader) */}
        <div className="relative w-24 h-24 flex items-center justify-center mt-4 mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-t-[#0284c7] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-1.5 rounded-full border border-b-[#0284c7]/30 border-t-transparent border-r-transparent border-l-transparent animate-spin [animation-duration:1.2s] [animation-direction:reverse]"></div>
          
          <div className="w-14 h-14 rounded-full bg-[#0284c7]/5 flex items-center justify-center">
            <span className="text-[#0284c7] text-xs font-semibold animate-pulse">99%</span>
          </div>
        </div>

        {/* النصوص المتناسقة */}
        <h3 className="text-white font-medium text-xl mb-2 tracking-wide text-center" dir="rtl">
          جاري تحميل الأفضل
        </h3>
        
        <p className="text-slate-400 text-sm font-light text-center" dir="rtl">
          لحظات ويتم تحميل جودة المنتجات الغذائية
        </p>

        {/* خط تحميل سفلي ناعم بـ Gradient */}
        <div className="w-48 h-[3px] bg-white/5 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#0284c7] to-blue-500 rounded-full animate-shimmer"></div>
        </div>
      </div>

      {/* أنيميشن شريط التحميل */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.6s infinite linear;
          width: 100%;
        }
      `}</style>

    </div>
  }
>
  <AppRoutes />
</Suspense>

        {/* Scroll To Top Button */}
        <div
          onClick={upToTop}
          className="fixed bottom-8 right-8 z-50 bg-[#0284c7] text-white p-4 rounded-[20px] -2xl hover:-translate-y-2 active:scale-90 transition-all cursor-pointer"
        >
          <FaAngleUp className="text-2xl" />
        </div>

    </div>
  );
}

export default App;