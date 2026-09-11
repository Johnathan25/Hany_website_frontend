import React from 'react';
import { FaWhatsapp, FaPhone, FaCode, FaEnvelope, FaChevronUp } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="no-print bg-[#0f172a]  text-white pt-16 pb-8 border-t border-slate-800/50 relative overflow-hidden ">
      {/* الخط الجمالي العلوي */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center pb-12">
          
          {/* الجانب الأيمن: التعريف الشخصي */}
          <div className="space-y-4 text-center md:text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full mb-2">
              <FaCode className="text-blue-400" size={12} />
              <span className="text-[10px] uppercase tracking-[2px] text-blue-400 font-bold font-">Creative Dev</span>
            </div>
          <div>
                <h2 className="text-xl font-bold">
                  كيرلس رضا
                </h2>
                <p className="text-slate-400 text-sm mt-2 max-w-md">
                  مطور ويب متخصص في بناء أنظمة ومواقع ويب حديثة وسهلة الاستخدام.
                </p>
              </div>
          </div>

          {/* الجانب الأيسر: أزرار التواصل */}
          <div className="flex flex-col items-center md:items-end gap-6">
             <h4 className="text-slate-500 text-xs font-bold uppercase tracking-widest">تواصل معي</h4>
             <div className="flex gap-4">
                <ContactCard 
                  href="tel:01270857659" 
                  icon={<FaPhone size={18} />} 
                  label="اتصال" 
                  color="hover:bg-blue-600 shadow-blue-500/10"
                />
                <ContactCard 
                  href="https://wa.me/201270857659" 
                  icon={<FaWhatsapp size={20} />} 
                  label="واتساب" 
                  color="hover:bg-emerald-600 shadow-emerald-500/10"
                />
                <ContactCard 
                  href="mailto:kiroloesreda@gmail.com" 
                  icon={<FaEnvelope size={18} />} 
                  label="إيميل" 
                  color="hover:bg-orange-600 shadow-orange-500/10"
                />
             </div>
          </div>
        </div>

        {/* حقوق النشر */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
          <div className="flex items-center gap-4 order-2 md:order-1">

        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} جميع الحقوق محفوظة
        </p>
          </div>

          {/* زر الصعود للأعلى مدمج مع الحقوق */}
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5 transition-all order-1 md:order-2"
          >
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Back to top</span>
            <FaChevronUp size={10} className="text-blue-400 group-hover:-translate-y-1 transition-transform" />
          </button>

          <p className="text-slate-600 text-[10px] font-شركه tracking-tighter order-3">
            © {currentYear} | VERSION 2.0.4
          </p>
        </div>
      </div>
    </footer>
  );
}

const ContactCard = ({ href, icon, label, color }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`bg-slate-900/50 border border-white/5 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 transform hover:-translate-y-2 group shadow-2xl ${color}`}
    title={label}
  >
    <span className="text-slate-400 group-hover:text-white group-hover:scale-110 transition-all duration-300">
      {icon}
    </span>
  </a>
);

export default Footer;