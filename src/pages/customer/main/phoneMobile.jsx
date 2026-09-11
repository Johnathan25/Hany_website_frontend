import React, { useEffect, useState } from 'react';
import { FaGoogleDrive } from 'react-icons/fa';
import api from '../../../services/api'; // تأكد من صحة مسار ملف الـ api الخاص بك هنا

const playStoreIcon = "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg";
const phonePlaceholder = "/phone.jpeg";

const AppDownloadSection = () => {
 
  const [links, setLinks] = useState({ googleDrive: "", googlePlay: "" });

  useEffect(() => {

    api.get("/about/getLink")
      .then(res => {
        if (res.data && res.data.links) {
          setLinks(res.data.links);
        }
      })
      .catch(err => {
        console.error("Error fetching links inside component:", err);
      });
  }, []);

  return (
    <section className="relative w-full h-[360px] bg-[#0284c7]/5 flex items-center overflow-hidden px-6 md:px-16" dir="rtl">
      <div className="max-w-7xl w-full mx-auto flex flex-row items-center justify-between h-full">
        
        {/* النصوص وأزرار التحميل */}
        <div data-aos="fade-right" className="flex-1 text-right flex flex-col justify-center space-y-4 md:mr-6">
          <div>
            <div className="relative inline-block pb-2 mb-2">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: '#0284c7' }}>
                حمل التطبيق الآن!
              </h2>
              <span className="absolute bottom-0 right-0 h-[3px] w-20 rounded-full bg-gradient-to-l from-[#0284c7] to-transparent"></span>
            </div>

            <p className="text-base md:text-xl font-bold leading-tight text-slate-700 max-w-xl">
              استمتع بتجربة تسوق سهلة وسريعة من خلال تطبيقنا المتاح على متجر جوجل بلاي أو عبر التحميل المباشر.
            </p>
          </div>

          {/* الأزرار الرقمية وتظهر بناءً على توفر الروابط */}
          <div className="flex flex-wrap gap-4 items-center mt-2">
            
            {/* زر Google Play */}
            {links.googlePlay && links.googlePlay !== "" && (
              <a 
                href={links.googlePlay} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="block w-36 md:w-44 transition hover:scale-105 active:scale-95 drop-shadow-md"
              >
                <img src={playStoreIcon} alt="Get it on Google Play" className="w-full h-auto" />
              </a>
            )}

            {/* زر Google Drive */}
            {links.googleDrive && links.googleDrive !== "" && (
              <a 
                href={links.googleDrive} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold text-xs md:text-sm px-5 py-3 rounded-xl transition hover:scale-105 active:scale-95 shadow-md shadow-green-50"
              >
                <FaGoogleDrive className="text-base md:text-xl" />
                <div className="text-right flex flex-col">
                  <span className="text-[10px] opacity-85 font-normal">تحميل ملف APK</span>
                  <span className="leading-tight">من Google Drive</span>
                </div>
              </a>
            )}

          </div>
        </div>

        {/* صورة الهاتف الجانبية */}
        <div data-aos="fade-left" className="relative w-1/3 md:w-1/3 h-full hidden sm:block">
          <img 
            src={phonePlaceholder} 
            alt="واجهة التطبيق" 
            className="absolute top-[10%] right-0 w-[200px] md:w-[220px] max-w-none h-auto object-cover rounded-t-2xl shadow-2xl transition-transform hover:scale-105"
          />
        </div>

      </div>
    </section>
  );
};

export default AppDownloadSection;