import { useContext } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { MyContext } from "../context/cartContext";

export default function WhatsAppButton() {

     const { about } = useContext(MyContext);
    
    // الوصول لأول عنصر في المصفوفة (حسب بنية الـ JSON الخاصة بك)
    const storeInfo = about && about[0] ? about[0] : null;
  
  const phoneNumber = "201021037611"; 
  const message = "أهلاً أبو الدهب، محتاج أستفسر عن المنتجات المتاحة."; 

  const formatPhoneNumber = (num) => {
  if (!num) return "";

  // نشيل أي حاجة مش رقم
  let cleaned = num.replace(/\D/g, "");

  // لو بدأ بـ 0 نحول لـ 20
  if (cleaned.startsWith("0")) {
    cleaned = "20" + cleaned.slice(1);
  }

  // لو بالفعل 20 نسيبه
  return cleaned;
};
  const openWhatsApp = () => {
    window.open(`https://wa.me/${formatPhoneNumber(storeInfo.socialMedia.whatsapp)|| phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };



  return (
    // <div
    //   onClick={openWhatsApp}
    //   className="no-print fixed bottom-24 right-8 z-50 
    //              bg-[#25D366] text-white 
    //              p-4 rounded-[20px] 
    //              shadow-2xl shadow-[#25d366]/40 
    //              hover:bg-[#20ba5a] hover:-translate-y-2 
    //              hover:rotate-[10deg]
    //              active:scale-90 
    //              transition-all duration-300 cursor-pointer 
    //              group flex items-center justify-center"
    //   title="تواصل معنا عبر واتساب"
    // >
    //   {/* تأثير الموجة الخضراء خلف الأيقونة */}
    //   <span className="absolute inset-0 rounded-[20px] bg-[#25D366] animate-ping opacity-30 group-hover:hidden"></span>
      
    //   {/* whatsapp */}
    //   <FaWhatsapp className="text-2xl font-black relative z-10" />

    //   {/* optiional text */}
    //   <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:mr-2 transition-all duration-500 font-bold text-sm whitespace-nowrap">
    //     تحدث معنا
    //   </span>
    // </div>
    <div></div>
  );
}