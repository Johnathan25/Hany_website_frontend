import React, { useEffect } from 'react';
import icon from "/logo.jpeg";
import { 
  Layers, 
  Store, 
  Utensils, 
  Snowflake, 
  Package, 
  DollarSign, 
  RefreshCw, 
  Truck, 
  CheckCircle, 
  Users, 
  Boxes, 
  ShieldCheck, 
  ChevronLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  useEffect(() => {
    document.title = "من نحن - أبو الدهب للتوزيع الغذائي";
  }, []);

  return (
    <section className="bg-gradient-to-br from-sky-50 via-white to-sky-100/40 py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      
      {/* شبكة خلفية هندسية ناعمة للمسة معمارية حديثة */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0284c708_1px,transparent_1px),linear-gradient(to_bottom,#0284c708_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* العناوين الرئيسية للشركة */}
        <div className="mb-20 text-right">
          <div className="relative inline-block mt-2">
            {/* الخلفية الملونة المستوحاة من الهوية */}
            <div className="absolute -bottom-2 -left-2 right-2 top-2 bg-gradient-to-r from-sky-200 to-cyan-200 -z-10 rounded-lg transform rotate-1"></div>
            <h2 className="text-3xl sm:text-6xl font-black text-slate-800 bg-white border-2 border-sky-400 px-6 py-3 rounded-lg">
              <span className="text-sky-600">أبو الدهب</span> للتوزيع الغذائي
            </h2>
          </div>

          <p className="max-w-3xl text-base sm:text-xl text-slate-600 leading-relaxed font-medium mt-8">
            شريكك في توريد المجمدات والمنتجات الغذائية بالجملة. نوفر للمطاعم والسوبر ماركت ومحلات التجزئة تشكيلة واسعة من المنتجات الغذائية والمجمدات من أكبر الشركات وبأسعار جملة تنافسية وخدمة توصيل منتظمة.
          </p>

          {/* مميزات سريعة أسفل البانر الرئيسي */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 max-w-4xl">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-sky-100 text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sky-500" /> أسعار جملة حقيقية
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-sky-100 text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sky-500" /> أصناف متنوعة من أشهر الشركات
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-sky-100 text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sky-500" /> توصيل سريع ومنتظم
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-sky-100 text-sm font-semibold text-slate-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sky-500" /> خدمة للمطاعم والسوبر ماركت</div>
          </div>
        </div>

        {/* الهيكل الابتكاري: نخدم مين؟ ولماذا أبو الدهب؟ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* الجانب الأيمن: الفئات المستهدفة (نخدم مين؟) */}
          <div className="lg:col-span-7 space-y-8 relative before:absolute before:right-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-sky-200 pr-12">
            <h3 className="text-2xl font-black text-slate-800 mb-6">نخدم مين؟</h3>
            
            {/* السوبر ماركت */}
            <div className="relative group">
              <div className="absolute -right-[44px] top-1.5 w-6 h-6 bg-white border-4 border-sky-500 rounded-full group-hover:scale-120 transition-transform duration-300 z-10"></div>
              <div className="bg-white p-6 rounded-lg border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300">
                <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Store className="w-6 h-6 text-sky-500" /> السوبر ماركت
                </h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  توفير مستمر للأصناف الأكثر طلبًا بأسعار تضمن لك أعلى هامش ربح.
                </p>
              </div>
            </div>

            {/* المطاعم والكافيهات */}
            <div className="relative group">
              <div className="absolute -right-[44px] top-1.5 w-6 h-6 bg-white border-4 border-cyan-500 rounded-full group-hover:scale-120 transition-transform duration-300 z-10"></div>
              <div className="bg-white p-6 rounded-lg border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300">
                <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Utensils className="w-6 h-6 text-cyan-500" /> المطاعم والكافيهات
                </h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  منتجات مناسبة للتشغيل اليومي بجودة ثابتة تضمن رضا عملائك واستقرار جودة أطباقك.
                </p>
              </div>
            </div>

            {/* محلات المجمدات */}
            <div className="relative group">
              <div className="absolute -right-[44px] top-1.5 w-6 h-6 bg-white border-4 border-sky-500 rounded-full group-hover:scale-120 transition-transform duration-300 z-10"></div>
              <div className="bg-white p-6 rounded-lg border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300">
                <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Snowflake className="w-6 h-6 text-sky-500" /> محلات المجمدات
                </h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  توريد مباشر وأسعار جملة منافسة لتكون دائمًا الخيار الأول للمستهلك في منطقتك.
                </p>
              </div>
            </div>

            {/* تجار الجملة والتجزئة */}
            <div className="relative group">
              <div className="absolute -right-[44px] top-1.5 w-6 h-6 bg-white border-4 border-cyan-500 rounded-full group-hover:scale-120 transition-transform duration-300 z-10"></div>
              <div className="bg-white p-6 rounded-lg border border-sky-100 shadow-sm hover:shadow-md hover:border-sky-300 transition-all duration-300">
                <h4 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Package className="w-6 h-6 text-cyan-500" /> تجار الجملة والتجزئة
                </h4>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  حلول توريد مرنة وكميات متنوعة تلبي حجم نشاطك التجاري بدقة وسهولة.
                </p>
              </div>
            </div>

          </div>

          {/* الجانب الأيسر: مصفوفة الأرقام والبينتو بوكس الذكي */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            
            {/* إحصائية الأصناف */}
            <div className="bg-white p-6 rounded-lg border border-sky-100 text-center shadow-sm">
              <h5 className="text-3xl font-black text-sky-600">+1000 صنف</h5>
              <p className="text-slate-500 text-xs mt-1">متوفر باستمرار</p>
            </div>

            {/* إحصائية الشركات */}
            <div className="bg-white p-6 rounded-lg border border-sky-100 text-center shadow-sm">
              <h5 className="text-3xl font-black text-cyan-600">+50 شركة</h5>
              <p className="text-slate-500 text-xs mt-1">وعلامة تجارية</p>
            </div>

            {/* إحصائية العملاء */}
            <div className="bg-white p-6 rounded-lg border border-sky-100 text-center shadow-sm">
              <h5 className="text-3xl font-black text-slate-800">+500 عميل</h5>
              <p className="text-slate-500 text-xs mt-1">يتعامل معنا بشكل مستمر</p>
            </div>

            {/* التزام سلسلة التبريد */}
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-6 rounded-lg text-white text-center shadow-md">
              <h5 className="text-3xl font-black">100%</h5>
              <p className="text-sky-100 text-xs mt-1">التزام بسلسلة التبريد</p>
            </div>

            {/* بطاقة الصورة الكبيرة للمخازن */}
            <div className="col-span-2 relative overflow-hidden rounded-lg shadow-lg border border-sky-200/50 h-48 bg-white">
              <img 
                src={icon} 
                alt="مخازن أبو الدهب للتوزيع الغذائي" 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/60 via-transparent to-transparent"></div>
              <span className="absolute bottom-4 right-4 text-white font-black text-sm bg-sky-600/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-sky-400">مخازننا وثلاجاتنا</span>
            </div>

            <Link to="/كل_المنتجات" className="col-span-2 w-full text-center">
              <div className="w-full bg-slate-900 hover:bg-sky-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3">
                <span>تصفح الأصناف واطلب الآن</span>
                <ChevronLeft className="w-5 h-5" />
              </div>
            </Link>

          </div>
        </div>

        {/* لماذا أبو الدهب؟ */}
        <div className="mb-20">
          <h3 className="text-3xl font-black text-slate-800 mb-10 text-center">لماذا أبو الدهب؟</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:border-sky-300 transition-colors">
              <h4 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-sky-500" /> أسعار تنافسية
              </h4>
              <p className="text-slate-600 text-sm">أفضل قيمة مقابل الجودة في سوق التوزيع الغذائي.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:border-sky-300 transition-colors">
              <h4 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-sky-500" /> تنوع كبير
              </h4>
              <p className="text-slate-600 text-sm">منتجات من شركات متعددة وعلامات تجارية كبرى في مكان واحد.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:border-sky-300 transition-colors">
              <h4 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-sky-500" /> توافر مستمر
              </h4>
              <p className="text-slate-600 text-sm">مخزون متجدد بشكل يومي للأصناف الأكثر طلباً في السوق.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:border-sky-300 transition-colors">
              <h4 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-500" /> توصيل مبرد
              </h4>
              <p className="text-slate-600 text-sm sa">سيارات مجهزة للحفاظ على جودة وسلامة المنتجات حتى التسليم.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:border-sky-300 transition-colors">
              <h4 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-sky-500" /> طلبات سهلة
              </h4>
              <p className="text-slate-600 text-sm">منظومة ميسرة لإدارة ومتابعة طلباتك وتوريدها دون تعقيد.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:border-sky-300 transition-colors">
              <h4 className="font-bold text-lg text-slate-800 mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-sky-500" /> خدمة موثوقة
              </h4>
              <p className="text-slate-600 text-sm">فريق مبيعات ودعم فني متخصص لمتابعة احتياجات عملائنا باستمرار.</p>
            </div>

          </div>
        </div>

        {/* الأقسام الرئيسية */}
        <div className="mb-20 bg-slate-50 p-10 rounded-2xl border border-slate-200/60">
          <h3 className="text-2xl font-black text-slate-800 mb-8">الأقسام الرئيسية</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-sky-600 text-lg mb-2">الدواجن والمصنعات</h4>
              <p className="text-slate-500 text-sm">بانيه – أوراك – صدور – مصنعات متنوعة</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-sky-600 text-lg mb-2">اللحوم ومنتجات اللحوم</h4>
              <p className="text-slate-500 text-sm">برجر – كفتة – سجق – أصناف متنوعة</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-sky-600 text-lg mb-2">البطاطس والخضروات</h4>
              <p className="text-slate-500 text-sm">بطاطس – خضروات – منتجات التجميد المتنوعة</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h4 className="font-bold text-sky-600 text-lg mb-2">المجمدات المتنوعة</h4>
              <p className="text-slate-500 text-sm">أشهر الأصناف المطلوبة للمطاعم والسوبر ماركت</p>
            </div>

          </div>
        </div>

        {/* كروت التزامنا والخاتمة */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-lg border-2 border-slate-100 hover:border-sky-300 transition-all duration-300 flex flex-col justify-between">
            <div>
              <h4 className="text-xl font-black text-slate-800 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-sky-500" /> التزامنا
              </h4>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                في <span className="font-bold text-sky-600">أبو الدهب للتوزيع الغذائي</span> نلتزم بتوفير منتجات موثوقة من أفضل الشركات مع الحفاظ على سلسلة التبريد الكاملة وتقديم خدمة توريد منتظمة تساعد عملاءنا على إدارة أعمالهم بثقة واستقرار.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-lg text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-600/10 rounded-full blur-xl"></div>
            <div>
              <h4 className="text-xl font-black text-sky-400 mb-3 flex items-center gap-2">
                <Layers className="w-6 h-6 text-sky-400" /> كل الشركات... كل الأصناف... طلب واحد
              </h4>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                وفر وقتك ومجهودك واحصل على كافة احتياجات نشاطك التجاري والغذائي من مصدر واحد موثوق.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}