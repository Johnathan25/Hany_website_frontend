import React, { useEffect, useContext } from 'react';
// تأكد من استيراد السياق (Context) الخاص بك بشكل صحيح، هنا افترضت اسمه MyContext
// import { MyContext } from '../context/MyContext'; 
import icon from "/logo.jpeg";
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { MyContext } from '../../../context/cartContext';
import { FaFacebook } from 'react-icons/fa';
import { BsInstagram } from 'react-icons/bs';

export default function ContactUs() {

  const { about } = useContext(MyContext);
  


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

  
  const data = {
    storeName: storeInfo.storeName || defaults.storeName,
    about: storeInfo.about || defaults.about,
    address: storeInfo.address || defaults.address,
    email: storeInfo.email || defaults.email,
    workingHours: storeInfo.workingHours || defaults.workingHours,
    phones: storeInfo.phones?.length > 0 ? storeInfo.phones : defaults.phones,
    socialMedia: {
      facebook: storeInfo.socialMedia?.facebook || defaults.socialMedia?.facebook,
      instagram: storeInfo.socialMedia?.instagram || defaults.socialMedia.instagram,
      whatsapp: storeInfo.socialMedia?.whatsapp || defaults.socialMedia.whatsapp,
    }
  };

  useEffect(() => {
    document.title = `اتصل بنا - ${data.storeName} للمجمدات`;
  }, [data.storeName]);

  return (
    <section className="bg-gradient-to-br from-sky-50 via-white to-sky-100/40 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      
      {/* شبكة خلفية هندسية ناعمة لتطابق التصميم */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* العناوين بأسلوب البراويز الصريحة الملتوية */}
        <div className="mb-20 text-right">
          <div className="relative inline-block mt-2">
            <div className="absolute -bottom-2 -left-2 right-2 top-2 bg-gradient-to-r from-sky-200 to-cyan-200 -z-10 rounded-lg transform rotate-1"></div>
            <h2 className="text-3xl sm:text-6xl font-black text-slate-800 bg-white border-2 border-sky-400 px-6 py-3 rounded-lg">
              تواصل مع <span className="text-sky-600">{data.storeName}</span>
            </h2>
          </div>
          <p className="max-w-3xl text-base sm:text-xl text-slate-600 leading-relaxed font-medium mt-8">
            عندك استفسار عن الأسعار؟ عايز تطلب جملة أو قطاعي؟ تواصل معانا مباشرة من خلال وسائل الاتصال المتاحة، وفريقنا هيرد عليك في أسرع وقت ممكن!
          </p>
        </div>

        {/* الهيكل الرئيسي: تقسيم الصفحة بأسلوب الـ Bento Box والخط الزمني للمعلومات */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* الجانب الأيمن: كروت البيانات المباشرة المستخرجة من الـ Context */}
          <div className="lg:col-span-7 space-y-6 relative before:absolute before:right-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-sky-200 pr-12">
            
            {/* كارت أرقام التليفونات */}
            <div className="relative group">
              <div className="absolute -right-[44px] top-1.5 w-6 h-6 bg-white border-4 border-sky-500 rounded-full group-hover:scale-120 transition-transform duration-300 z-10"></div>
              <div className="bg-white p-6 rounded-lg border border-sky-100 -sm hover:-md hover:border-sky-300 transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="text-sky-500"><Phone size={22} /></span> أرقام الهاتف والطلب
                </h3>
                <div className="flex flex-col gap-2">
                  {data.phones.map((phone, index) => (
                    <a key={index} href={`tel:${phone}`} className="text-slate-600 text-lg font-semibold hover:text-sky-600 transition-colors w-fit">
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* كارت العنوان */}
            <div className="relative group">
              <div className="absolute -right-[44px] top-1.5 w-6 h-6 bg-white border-4 border-cyan-500 rounded-full group-hover:scale-120 transition-transform duration-300 z-10"></div>
              <div className="bg-white p-6 rounded-lg border border-sky-100 -sm hover:-md hover:border-sky-300 transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-cyan-500"><MapPin size={22} /></span> عنوان الفروع والمخازن
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  {data.address}
                </p>
              </div>
            </div>

            {/* كارت ساعات العمل */}
            <div className="relative group">
              <div className="absolute -right-[44px] top-1.5 w-6 h-6 bg-white border-4 border-sky-500 rounded-full group-hover:scale-120 transition-transform duration-300 z-10"></div>
              <div className="bg-white p-6 rounded-lg border border-sky-100 -sm hover:-md hover:border-sky-300 transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-sky-500"><Clock size={22} /></span> مواعيد العمل واستقبال الطلبات
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
                  {data.workingHours}
                </p>
              </div>
            </div>

            {/* كارت البريد الإلكتروني */}
            <div className="relative group">
              <div className="absolute -right-[44px] top-1.5 w-6 h-6 bg-white border-4 border-cyan-500 rounded-full group-hover:scale-120 transition-transform duration-300 z-10"></div>
              <div className="bg-white p-6 rounded-lg border border-sky-100 -sm hover:-md hover:border-sky-300 transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-cyan-500"><Mail size={22} /></span> البريد الإلكتروني للمراسلات الإدارية
                </h3>
                <a href={`mailto:${data.email}`} className="text-slate-600 text-sm sm:text-base hover:text-sky-600 transition-colors">
                  {data.email}
                </a>
              </div>
            </div>

          </div>

          {/* الجانب الأيسر: مصفوفة بصرية ذكية (Bento Box) وشات السوشيال ميديا السريع */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            {/* بطاقة اللوجو والترحيب الكبيرة */}
            <div className="col-span-2 relative overflow-hidden rounded-lg -lg border border-sky-200/50 h-64 bg-white">
              <img 
                src={icon} 
                alt={data.storeName} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/70 via-sky-900/20 to-transparent"></div>
              <div className="absolute bottom-4 right-4 text-white left-4">
                <span className="inline-block text-white font-black text-sm bg-sky-600/90 backdrop-blur-sm px-3 py-1 rounded-md border border-sky-400 mb-2">
                  دائماً في خدمتك
                </span>
                <p className="text-xs text-sky-100 line-clamp-2 leading-relaxed">
                  {data.about}
                </p>
              </div>
            </div>

            {/* زر الواتساب السريع الملون */}
<a
  href={`https://wa.me/${data.socialMedia.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    "السلام عليكم، أريد الاستفسار عن الأسعار والمنتجات المتوفرة."
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  className="bg-emerald-600 hover:bg-emerald-700 p-6 rounded-lg text-white flex flex-col justify-between transition-all duration-300 group hover:-translate-y-1"
>
  <MessageSquare
    className="text-emerald-100 group-hover:scale-110 transition-transform"
    size={28}
  />
  <div className="mt-4">
    <h5 className="font-black text-lg">طلب سريع واتساب</h5>
    <p className="text-emerald-100 text-xs mt-1">
      اضغط للمحادثة المباشرة
    </p>
  </div>
</a>

            {/* روابط الفيسبوك وانستجرام مدمجة في كرت ذكي */}
            <div className="bg-white p-6 rounded-lg border border-sky-100 -sm flex flex-col justify-between hover:border-sky-300 transition-colors">
              <div className="flex gap-3 text-sky-600">
                <a href={data.socialMedia?.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-sky-800 transition-colors">
                  <FaFacebook size={24} />
                </a>
                <a href={data.socialMedia?.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-rose-600 transition-colors">
                  <BsInstagram size={24} />
                </a>
              </div>
              <div className="mt-4">
                <h5 className="font-black text-lg text-slate-800">تابع منصاتنا</h5>
                <p className="text-slate-500 text-xs mt-1">لمتابعة جديد الأسعار اليومية</p>
              </div>
            </div>

            {/* الكارت الطولي العريض السفلي للإجراء المباشر */}
            <div className="col-span-2 bg-slate-900 text-white font-bold py-5 px-6 rounded-lg -lg flex items-center justify-between border border-slate-800">
              <div className="text-right">
                <h4 className="font-black text-base text-sky-400">نحن بانتظارك!</h4>
                <p className="text-xs text-slate-400 mt-0.5">شرفنا بالاتصال أو بزيارة أقرب فرع</p>
              </div>
              <span className="text-xs bg-sky-600 text-white px-3 py-1.5 rounded-full font-medium">
                استجابة فورية
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}