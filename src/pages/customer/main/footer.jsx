import { Link } from "react-router-dom";
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker,
  HiOutlineClock 
} from "react-icons/hi";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaWhatsapp 
} from "react-icons/fa";
import { MyContext } from "../../../context/cartContext";
import { useContext } from "react";

export default function Footer() {
  const { about } = useContext(MyContext);
  
  // استخراج البيانات مع تأمين الكائن
  const storeInfo = about && about[0] ? about[0] : {};

  // تعريف القيم الافتراضية
  const defaults = {
    storeName: "ابو الدهب",
    about: "نحن نسعى لتقديم أفضل المنتجات الغذائية بجودة عالية وخدمة مميزة لعملائنا الكرام.",
    address: "العنوان غير محدد حالياً",
    email: "info@store.com",
    workingHours: "يومياً من 9 صباحاً حتى 10 مساءً",
    phones: ["012XXXXXXXX"],
    socialMedia: {
      facebook: "#",
      instagram: "#",
      whatsapp: ""
    }
  };

  // دمج البيانات الحقيقية مع الافتراضية
  const data = {
    storeName: storeInfo.storeName || defaults.storeName,
    about: storeInfo.about || defaults.about,
    address: storeInfo.address || defaults.address,
    email: storeInfo.email || defaults.email,
    workingHours: storeInfo.workingHours || defaults.workingHours,
    phones: storeInfo.phones?.length > 0 ? storeInfo.phones : defaults.phones,
    socialMedia: {
      facebook: storeInfo.socialMedia?.facebook || defaults.socialMedia.facebook,
      instagram: storeInfo.socialMedia?.instagram || defaults.socialMedia.instagram,
      whatsapp: storeInfo.socialMedia?.whatsapp || defaults.socialMedia.whatsapp,
    }
  };
  
  const upToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  return (
    <footer className="bg-[#0f172a] text-white font-cairo pt-16 pb-8 border-t border-slate-800" dir="rtl">
      <div className="2xl:container mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. معلومات المتجر */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black tracking-tight text-white">
                {data.storeName}
              </h2>
            </div>
            <p className="text-gray-400 leading-relaxed text-md">
              {data.about}
            </p>
            <div className="flex gap-4">
              <SocialIcon Icon={FaFacebookF} href={data.socialMedia.facebook} color="hover:bg-[#0284c7]" />
              <SocialIcon Icon={FaInstagram} href={data.socialMedia.instagram} color="hover:bg-pink-600" />
              <SocialIcon Icon={FaWhatsapp} href={`https://wa.me/${data.socialMedia.whatsapp}`} color="hover:bg-green-600" />
            </div>
          </div>

          {/* 2. روابط سريعة (مضاف إليها الصفحات الجديدة بالمسارات المطلوبة) */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-[#0284c7]">روابط سريعة</h3>
            <ul className="space-y-4 text-gray-400">
              <li onClick={upToTop}><FooterLink to="/">الرئيسية</FooterLink></li>
              <li><FooterLink to="/كل_المنتجات">جميع المنتجات</FooterLink></li>
              <li><FooterLink to="/العروض_والخصومات_الكومبو"> العروض المجمعة</FooterLink></li>
              <li><FooterLink to="/العروض_والخصومات">مجالات العروض </FooterLink></li>
              <li onClick={upToTop}><FooterLink to="/"> الكوبونات </FooterLink></li>
              
              {/* الروابط الهرمية الجديدة مدمجة هنا */}
              <li onClick={upToTop} className="border-t border-slate-800/60 pt-2"><FooterLink to="/من_نحن">من نحن</FooterLink></li>
              <li onClick={upToTop}><FooterLink to="/تواصل_معانا">تواصل معنا</FooterLink></li>
              <li onClick={upToTop}><FooterLink to="/سياسة_الخصوصية">سياسة الخصوصية</FooterLink></li>
            </ul>
          </div>

          {/* 3. أوقات العمل */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-[#0284c7]">أوقات العمل</h3>
            <div className="flex items-start gap-4 text-gray-400">
              <HiOutlineClock className="w-6 h-6 text-[#0284c7] mt-1" />
              <div>
                <p className="font-bold text-white mb-1 tracking-wide">مواعيدنا اليومية:</p>
                <p>{data.workingHours}</p>
              </div>
            </div>
          </div>

          {/* 4. بيانات التواصل */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-[#0284c7]">بيانات التواصل</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <HiOutlineLocationMarker className="w-6 h-6 text-[#0284c7] mt-1 shrink-0" />
                <span className="text-gray-400">{data.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <HiOutlinePhone className="w-6 h-6 text-[#0284c7] shrink-0" />
                <div className="flex flex-col text-gray-400" dir="ltr">
                  {data.phones.map((phone, idx) => (
                    <span key={idx}>{phone}</span>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-4">
                <HiOutlineMail className="w-6 h-6 text-[#0284c7] shrink-0" />
                <span className="text-gray-400 break-all">{data.email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* الجزء السفلي - الحقوق والمطور */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-right">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} جميع الحقوق محفوظة لـ 
            <span className="text-[#0284c7] font-bold"> {data.storeName}</span>.
          </p>

          <p className="text-gray-400 text-xs tracking-wide">
            تم تطوير الموقع بواسطة 
            <span className="text-[#0284c7] font-bold"> كيرلس رضا </span> | 
            <a href="tel:01270857659" className="hover:text-white transition decoration-[#0284c7] underline underline-offset-4">
              01270857659
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}

// مكونات فرعية للتنسيق
function FooterLink({ to, children }) {
  return (
    <Link to={to} className="hover:text-white hover:translate-x-[-8px] transition-all duration-300 inline-block font-medium">
      {children}
    </Link>
  );
}

function SocialIcon({ Icon, href, color }) {
  // منع الرابط من العمل إذا لم يتوفر رابط حقيقي
  const isAvailable = href && href !== "#";
  
  return (
    <a 
      href={isAvailable ? href : undefined} 
      target={isAvailable ? "_blank" : undefined}
      rel="noopener noreferrer"
      className={`w-10 h-10 bg-slate-800 flex items-center justify-center rounded-lg transition-all duration-300 ${isAvailable ? `${color} hover:scale-110 shadow-md` : "opacity-50 cursor-not-allowed"}`}
    >
      <Icon className="w-5 h-5 text-white" />
    </a>
  );
}