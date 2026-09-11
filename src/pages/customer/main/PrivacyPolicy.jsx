import { DatabaseIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { CgDanger } from 'react-icons/cg';
import { MdDataUsage } from 'react-icons/md';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = "سياسة الخصوصية - أبو الدهب للمجمدات";
  }, []);

  return (
    <section className="bg-gradient-to-br from-sky-50 via-white to-sky-100/40 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      
      {/* شبكة خلفية هندسية ناعمة للمسة معمارية حديثة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* العناوين بأسلوب التصميم المرفق في الصورة (البراويز الصريحة) */}
        <div className="mb-20 text-right">

          
          <div className="relative inline-block mt-2">
            {/* الخلفية الملونة المستوحاة من الصورة المرفقة image_122160.png */}
            <div className="absolute -bottom-2 -left-2 right-2 top-2 bg-gradient-to-r from-sky-200 to-cyan-200 -z-10 rounded-lg transform rotate-1"></div>
            <h2 className="text-3xl sm:text-6xl font-black text-slate-800 bg-white border-2 border-sky-400 px-6 py-3 rounded-lg -sm">
              سياسة <span className="text-sky-600">الخصوصية</span> والأمان
            </h2>
          </div>

          <p className="max-w-3xl text-base sm:text-xl text-slate-600 leading-relaxed font-medium mt-8">
            في شركة <span className="text-sky-600 font-bold">أبو الدهب للمجمدات</span>، نحن نلتزم بحماية خصوصيتك وبياناتك الشخصية تماماً كما نلتزم بالحفاظ على جودة وتجميد منتجاتنا. توضح هذه الصفحة كيف نجمع معلوماتك ونحميها لتجربة شراء آمنة ومريحة.
          </p>
        </div>

        {/* الهيكل الابتكاري: خط زمني تفاعلي لبنود السياسة بدلاً من السرد الممل */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* الجانب الأيمن: خط بنود الخصوصية (Privacy Timeline) */}
          <div className="lg:col-span-7 space-y-8 relative before:absolute before:right-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-sky-200 pr-12">
            
            {/* البند الأول */}
            <div className="relative group">
              <div className="absolute -right-[44px] top-1.5 w-6 h-6 bg-white border-4 border-sky-500 rounded-full group-hover:scale-120 transition-transform duration-300 z-10"></div>
              <div className="bg-white p-6 rounded-2xl border border-sky-100 -sm hover:-md hover:border-sky-300 transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-sky-500 text-lg"><DatabaseIcon/></span> ما هي البيانات التي نجمعها؟
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  عند تسجيل طلبك أو التواصل معنا لجملة أو قطاعي، نطلب فقط المعلومات الأساسية اللازمة لإتمام وتوصيل طلبك بنجاح، وتستمل على: (الاسم، رقم الهاتف، العنوان بالتفصيل لتسهيل حركة سيارات الشحن
                </p>
              </div>
            </div>

            {/* البند الثاني */}
            <div className="relative group">
              <div className="absolute -right-[44px] top-1.5 w-6 h-6 bg-white border-4 border-cyan-500 rounded-full group-hover:scale-120 transition-transform duration-300 z-10"></div>
              <div className="bg-white p-6 rounded-2xl border border-sky-100 -sm hover:-md hover:border-sky-300 transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-cyan-500 text-lg"><MdDataUsage/></span> كيف نستخدم معلوماتك؟
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  نستخدم هذه البيانات لتجهيز طلبيتك من مخازننا، وتنسيق التوصيل السريع بسياراتنا المجهزة، وإبلاغك بأحدث عروض الأسعار وحرق الأسعار الحصري لعملائنا، بالإضافة إلى تحسين جودة خدمتنا والتواصل معك لضمان رضاك التام عن الطلب.
                </p>
              </div>
            </div>

            {/* البند الثالث */}
            <div className="relative group">
              <div className="absolute -right-[44px] top-1.5 w-6 h-6 bg-white border-4 border-sky-500 rounded-full group-hover:scale-120 transition-transform duration-300 z-10"></div>
              <div className="bg-white p-6 rounded-2xl border border-sky-100 -sm hover:-md hover:border-sky-300 transition-all duration-300">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <span className="text-sky-500 text-lg"><CgDanger/></span> عدم مشاركة البيانات مع أي طرف ثالث
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  خصوصيتك خط أحمر. نحن نتعهد بشكل صارم بعدم بيع، أو تأجير، أو مشاركة بياناتك الشخصية أو التجارية مع أي جهات خارجية أو شركات إعلانية. بياناتك محفوظة في خوادم مشفرة وآمنة تماماً ومخصصة فقط لإدارة تعاملاتك داخل شركة أبو الدهب.
                </p>
              </div>
            </div>

          </div>

          {/* الجانب الأيسر: مصفوفة بصرية ذكية (Bento Box) لتأكيد الأمان */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            {/* بطاقة رسالة الأمان */}
            <div className="col-span-2 relative overflow-hidden rounded-2xl -lg border border-sky-200/50 p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col justify-between h-48">
              <div className="flex justify-between items-start">
                <i className="fas fa-user-shield text-3xl text-sky-400"></i>
                <span className="text-xs bg-sky-600 px-2 py-1 rounded font-bold">تشفير كامل</span>
              </div>
              <div>
                <h5 className="font-black text-lg">تصفح آمن ومحمي</h5>
                <p className="text-slate-300 text-xs mt-1">نطبق أعلى بروتوكولات الأمان الإلكتروني لضمان سلامة بياناتك أثناء التصفح والشراء.</p>
              </div>
            </div>

            {/* ميزة سريعة 1 */}
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-6 rounded-2xl text-white -md flex flex-col justify-between">
              <i className="fas fa-cookie-bite text-2xl text-sky-100 mb-4"></i>
              <div>
                <h5 className="font-black text-lg">ملفات الكوكيز</h5>
                <p className="text-sky-100 text-xs mt-1">نستخدمها فقط لتسهيل دخولك وحفظ سلة مشترياتك.</p>
              </div>
            </div>

            {/* ميزة سريعة 2 */}
            <div className="bg-white p-6 rounded-2xl border border-sky-100 -sm flex flex-col justify-between hover:border-sky-300 transition-colors">
              <i className="fas fa-user-check text-2xl text-cyan-500 mb-4"></i>
              <div>
                <h5 className="font-black text-lg text-slate-800">تحكم كامل</h5>
                <p className="text-slate-500 text-xs mt-1">يمكنك تعديل أو حذف بياناتك في أي وقت بالتواصل معنا.</p>
              </div>
            </div>

            {/* زرار الاتصال والدعم الفني */}
            <div className="col-span-2">
              <a 
                href="#contact" 
                className="w-full bg-white border-2 border-sky-400 hover:bg-sky-50 text-sky-600 font-bold py-4 px-6 rounded-2xl -sm transition-all duration-300 flex items-center justify-center gap-3 group text-center"
              >
                <span>عندك استفسار عن بياناتك؟ تواصل معنا</span>
                <i className="fas fa-headset text-sm text-sky-500"></i>
              </a>
            </div>

          </div>

        </div>

        {/* كروت الضمانات والالتزام الصارم (Flat Icons Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2  xl:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border-2 border-slate-100 hover:border-sky-300 transition-all duration-300 relative overflow-hidden group">
            
            <h4 className="text-xl font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-lock text-sky-500"></i> تحديثات السياسة
            </h4>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لمواكبة التطورات التكنولوجية أو متطلبات السوق، وأي تغييرات ستُعلن على هذه الصفحة فوراً لتبقى على علم دائم بها.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border-2 border-slate-100 hover:border-cyan-300 transition-all duration-300 relative overflow-hidden group">

            <h4 className="text-xl font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-user-gear text-cyan-500"></i> موافقتك على الشروط
            </h4>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              باستخدامك لموقع ومتجر أبو الدهب للمجمدات وتثبيت طلباتك من خلاله، فإنك توافق بشكل كامل على بنود سياسة الخصوصية الموضحة وتثق في آليات حمايتنا لبياناتك.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border-2 border-slate-100 hover:border-sky-300 transition-all duration-300 relative overflow-hidden group">
            
            <h4 className="text-xl font-black text-slate-800 mb-3 flex items-center gap-2">
              <i className="fas fa-handshake text-sky-500"></i> عهدنا الدائم
            </h4>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              الأمانة هي رأس مالنا سواء في جودة وتجميد اللحوم والدواجن التي نقدمها لكم، أو في الحفاظ التام والسرية المطلقة لبيانات عملائنا من الأفراد والمنشآت التجارية.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}