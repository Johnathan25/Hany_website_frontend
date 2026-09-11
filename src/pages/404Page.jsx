import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, Factory, Home, HelpCircle } from "lucide-react";

export default function NotFound() {
  useEffect(() => {
    document.title = "الصفحة غير موجودة - أبو الدهب للمجمدات";
  }, []);

  return (
    <section className="bg-gradient-to-br from-sky-50 via-white to-sky-100/40 min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex items-center justify-center" dir="rtl">
      
      {/* شبكة خلفية هندسية ناعمة لتطابق الهوية البصرية */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl w-full mx-auto relative z-10 text-right">
        
        {/* العناوين بأسلوب البراويز الصريحة الملتوية المأخوذة من صفحة من نحن */}
        <div className="mb-12 text-center md:text-right">
          <div className="relative inline-block mt-2">
            {/* الخلفية الملونة المستوحاة من الصورة المرفقة */}
            <div className="absolute -bottom-2 -left-2 right-2 top-2 bg-gradient-to-r from-sky-200 to-cyan-200 -z-10 rounded-lg transform rotate-1"></div>
            <h1 className="text-4xl sm:text-7xl font-black text-slate-800 bg-white border-2 border-sky-400 px-6 py-3 rounded-lg">
              عفواً.. خطأ <span className="text-sky-600">404</span>
            </h1>
          </div>

    <p className="max-w-2xl text-base sm:text-xl text-slate-600 leading-relaxed font-medium mt-8 text-center md:text-right">
  نعتذر عن الإزعاج، ولكن يبدو أن الرابط الذي تحاول الوصول إليه غير موجود حالياً في قواعد البيانات، أو تم نقله إلى مسار آخر ضمن نظام <span className="font-semibold text-sky-600">أبو الدهب</span> الإلكتروني. يرجى استخدام روابط التوجيه المتاحة للعودة.
</p>
        </div>

        {/* الهيكل الابتكاري: Bento Box مصغر لصفحة الخطأ ليتناسق مع باقي الموقع */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch mb-12">
          
          {/* كارت الأيقونة الرئيسي الكبير المقتبس من شكل مخازننا */}
          <div className="md:col-span-7 bg-white p-8 rounded-lg border border-sky-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-sky-300 transition-all duration-300">
            <div className="absolute -top-10 -left-10 text-[10rem] font-black text-sky-500/5 select-none pointer-events-none">
              404
            </div>
            <div>
              <div className="w-14 h-14 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-200 text-sky-600 mb-6">
                <Factory size={28} className="animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">المنتج أو الصفحة غير متوفرة حالياً</h3>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed font-medium">
قد يكون الرابط قد تغير، أو أن المنتج تم تحديث بياناته
              </p>
            </div>

          </div>

          {/* الجانب الأيسر: Bento Box فرعي مجهز بأزرار اتخاذ الإجراء الذكية */}
          <div className="md:col-span-5 grid grid-cols-1 gap-4">
            
            {/* بطاقة الدعم الفني السريع */}
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-6 rounded-lg text-white shadow-md flex flex-col justify-between">
              <HelpCircle className="text-sky-100" size={28} />
              <div>
                <h5 className="font-black text-lg">مشكلة متكررة؟</h5>
                <p className="text-sky-100 text-xs mt-1 leading-relaxed">إذا كنت تعتقد أن هذا الخطأ من جانبنا، يرجى إبلاغ فريق الدعم الفني فوراً لمراجعة تلاجات العرض.</p>
              </div>
            </div>

            {/* زر العودة للرئيسية مدمج بذكاء داخل الـ Bento Box بنفس استايل الفوتر والصفحات */}
            <Link
              to="/"
              className="bg-slate-950 hover:bg-sky-600 text-white font-bold p-6 rounded-lg shadow-lg transition-all duration-300 flex flex-col justify-between group text-right border border-slate-900"
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Home size={20} className="text-sky-400 group-hover:text-white" />
              </div>
              <div className="mt-4">
                <h5 className="font-black text-lg">العودة للرئيسية</h5>
                <p className="text-slate-400 group-hover:text-sky-100 text-xs mt-1">اضغط هنا لتصفح أحدث عروض المجمدات</p>
              </div>
            </Link>

          </div>

        </div>


      </div>
    </section>
  );
}