import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  HiOutlineSearch, 
  HiOutlineShoppingCart, 
  HiOutlineTruck, 
  HiOutlineMenuAlt3, 
  HiX,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineBell
} from "react-icons/hi";
import { MyContext } from "../../../context/cartContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); 
  const navigate = useNavigate();
  const { counts, about, notifyCount } = useContext(MyContext);

  const location=useLocation()
  console.log(location)
  const token = localStorage.getItem("token");
  const userName = JSON.parse(localStorage.getItem("userName"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/تسجيل_الدخول");
   
  };

  const storeInfo = about && about[0] ? about[0] : null;

  return (
    <nav className="bg-[#0f172a] text-white font-cairo shadow-2xl sticky top-0 z-50 transition-all duration-300" dir="rtl">
      <div className="mx-auto py-3 px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
        
        {/* 1. اللوجو - تصميم عصري */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="bg-[#0284c7] p-1.5 rounded-lg rotate-3 group-hover:rotate-0 transition-transform">
             <span className="text-xl md:text-2xl font-black tracking-tighter text-white">AD</span>
          </div>
          <span className="text-lg md:text-xl font-bold hidden xl:block group-hover:text-[#38bdf8] transition-colors">
            {"شركة ابو الدهب لتوزيع المنتجات الغذائية" }
          </span>
        </Link>

        {/* 2. البحث الذكي المتوسع */}
{ location.pathname!="/%D8%A8%D8%AD%D8%AB_%D8%B9%D9%86_%D8%A7%D9%84%D9%85%D9%86%D8%AA%D8%AC%D8%A7%D8%AA"  &&      <div 
          onClick={() => navigate("/بحث_عن_المنتجات")} 
          className="flex-1 max-w-md hidden md:flex justify-center"
        >
          <div className="relative w-full group cursor-pointer">
            <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 transition-all duration-300 group-hover:border-[#0284c7] group-hover:bg-slate-800">
              <HiOutlineSearch className="w-5 h-5 text-slate-400 group-hover:text-[#0284c7]" />
              <span className="text-slate-500 text-sm">ابحث عن منتجك المفضل...</span>
            </div>
          </div>
        </div>}

        {/* 3. الأزرار والأيقونات */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* روابط الديسكتوب الأساسية */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-bold ml-4">
            <Link to="/تتبع_الطلب" className="flex items-center gap-2 text-slate-300 hover:text-[#38bdf8] transition-colors">
              <HiOutlineTruck className="w-5 h-5" /> <span>تتبع الطلب</span>
            </Link>

            {!token && (
              <div className="flex items-center gap-4 border-r border-slate-700 pr-4">
                <Link to="/تسجيل_الدخول" className="text-slate-300 hover:text-white transition-colors">دخول</Link>
                <Link to="/انشاء_حساب" className="bg-[#0284c7] hover:bg-[#0369a1] px-5 py-2 rounded-xl shadow-lg shadow-blue-900/20 transition-all">
                  إنشاء حساب
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            
            {/* أيقونة البحث للموبايل فقط */}
            <button onClick={() => navigate("/بحث_عن_المنتجات")} className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl">
               <HiOutlineSearch className="w-5 h-5 text-slate-300" />
            </button>

            {/* الإشعارات */}
            <div
              onClick={() => navigate("/اشعارات")}
              className="relative cursor-pointer group w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 hover:border-[#0ea5e9] transition-all"
            >
              <HiOutlineBell className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
              {notifyCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-sky-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0f172a]">
                  {notifyCount}
                </span>
              )}
            </div>

            {/* السلة */}
            <div 
              onClick={() => navigate("/سله_المنتجات")} 
              className="relative cursor-pointer group w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 hover:border-[#0284c7] transition-all"
            >
              <HiOutlineShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
              {counts > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0f172a] animate-pulse">
                  {counts}
                </span>
              )}
            </div>

            {/* الملف الشخصي (عند تسجيل الدخول) */}
            {token && (
              <div 
                onClick={() => navigate("/الصفحه الشخصيه")} 
                className="cursor-pointer group flex items-center gap-2 bg-slate-800 pl-3 pr-2 py-1.5 rounded-xl border border-slate-700 hover:border-[#0ea5e9] transition-all"
              >
                <div className="w-7 h-7 bg-[#0284c7]/20 rounded-lg flex items-center justify-center">
                   <HiOutlineUserCircle className="w-6 h-6 text-[#38bdf8]" />
                </div>
                <span className="hidden sm:block text-[13px] font-bold max-w-[100px] truncate">
                  {userName ? `أهلاً، ${userName.split(' ')[0]}` : "حسابي"}
                </span>
              </div>
            )}

            {/* خروج (ديسكتوب) */}
            {token && (
              <button 
                onClick={handleLogout}
                className="hidden lg:flex items-center justify-center w-10 h-10 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                title="تسجيل الخروج"
              >
                <HiOutlineLogout className="w-5 h-5" />
              </button>
            )}

            {/* زر المنيو (موبايل) */}
            <button 
              className="lg:hidden w-10 h-10 flex items-center justify-center cursor-pointer  bg-[#0284c7] rounded-xl shadow-lg active:scale-90 transition-transform" 
              onClick={() => setIsMenuOpen(true)}
            >
              <HiOutlineMenuAlt3 className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* --- القائمة الجانبية المحدثة للموبايل --- */}
      <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-500 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
        
        {/* Sidebar Content */}
        <div className={`absolute right-0 top-0 h-full w-[280px] bg-[#0f172a] shadow-2xl transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex flex-col h-full p-6">
            
            <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
               <span className="font-black text-xl text-[#0284c7]">القائمة</span>
               <button onClick={() => setIsMenuOpen(false)} className="w-8 h-8 flex  cursor-pointer items-center justify-center bg-slate-800 rounded-full">
                  <HiX className="w-5 h-5  text-slate-400" />
               </button>
            </div>

            {token && (
              <div className="flex items-center gap-3 bg-slate-800/40 p-4 rounded-2xl mb-6">
                <div className="w-12 h-12 bg-[#0284c7] rounded-xl flex items-center justify-center shadow-lg">
                   <HiOutlineUserCircle size={28} />
                </div>
                <div className="overflow-hidden">
                   <p className="text-xs text-slate-400">مرحباً بك</p>
                   <p className="text-sm font-bold truncate">{userName || "المستخدم"}</p>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-2">
              <MobileNavLink to="/" icon={<HiOutlineMenuAlt3 />} label="الرئيسية" onClick={() => setIsMenuOpen(false)} />
              <MobileNavLink to="/تتبع_الطلب" icon={<HiOutlineTruck />} label="تتبع طلبك" onClick={() => setIsMenuOpen(false)} />
              {token && <MobileNavLink to="/الصفحه الشخصيه" icon={<HiOutlineUserCircle />} label="حسابي الشخصي" onClick={() => setIsMenuOpen(false)} />}
              <MobileNavLink to="/سله_المنتجات" icon={<HiOutlineShoppingCart />} label="سلة المشتريات" onClick={() => setIsMenuOpen(false)} />
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-800">
              {!token ? (
                <div className="flex flex-col gap-3">
                  <Link to="/تسجيل_الدخول" className="w-full py-3 text-center font-bold text-white border border-slate-700 rounded-xl" onClick={() => setIsMenuOpen(false)}>تسجيل الدخول</Link>
                  <Link to="/انشاء_حساب" className="w-full py-3 text-center font-bold bg-[#0284c7] text-white rounded-xl shadow-lg shadow-blue-900/40" onClick={() => setIsMenuOpen(false)}>إنشاء حساب جديد</Link>
                </div>
              ) : (
                <button 
                  onClick={handleLogout} 
                  className="w-full py-3 cursor-pointer text-center font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl flex items-center justify-center gap-2 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <HiOutlineLogout className="w-5 h-5" /> تسجيل الخروج
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// مكون فرعي لروابط الموبايل لتسهيل التكرار
function MobileNavLink({ to, icon, label, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors text-slate-300 hover:text-[#38bdf8] font-bold"
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}