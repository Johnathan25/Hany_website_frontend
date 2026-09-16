import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { RefreshCw, ShieldAlert, CheckCircle2, HelpCircle, MailWarning } from 'lucide-react';

export default function ReturnPolicy() {
  const { isAr } = useLanguage();

  return (
    <div className={`min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 ${isAr ? 'rtl font-sans' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-10 md:p-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-4 shadow-sm">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
            {isAr ? 'سياسة الاستبدال والاسترجاع' : 'Refund & Exchange Policy'}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">
            {isAr
              ? 'يرجى قراءة الشروط والأحكام الخاصة بسياسة الاسترجاع بعناية لضمان حقوقك'
              : 'Please read our terms and conditions regarding returns carefully'}
          </p>
        </div>

        {/* تنبيه مهم: استرجاع ثلثي المبلغ */}
        <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-4">
          <ShieldAlert className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-amber-900 mb-1">
              {isAr ? 'تنويه أساسي بشأن قيمة الاسترجاع' : 'Important Note Regarding Refund Value'}
            </h2>
            <p className="text-amber-800 text-sm sm:text-base leading-relaxed">
              {isAr
                ? 'وفقاً لسياسة الشركة، يحق للعميل في حال قبول طلب الاسترجاع استرداد ثلثي قيمة المبلغ المدفوع فقط (70%)، ويتم خصم الثلث المتبقي كرسوم إدارية، تشغيلية، وتكاليف حجز الموارد والخدمات غير القابلة للاسترداد.'
                : 'In accordance with our company policy, upon approval of a refund request, the client is entitled to receive only two-thirds (2/3 - 66.6%) of the total amount paid. The remaining one-third is retained to cover administrative, operational, and non-refundable service reservation costs.'}
            </p>
          </div>
        </div>

        {/* تنبيه خاص: عدم استرداد العربون بعد إرسال الصور على الإيميل */}
        <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-4">
          <MailWarning className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h2 className="text-lg font-bold text-rose-900 mb-1">
              {isAr ? 'حالات عدم استرداد العربون ' : 'Non-Refundable Deposit Policy (Email Deliverables)'}
            </h2>
            <p className="text-rose-800 text-sm sm:text-base leading-relaxed font-medium">
              {isAr
                ? 'في حالة تم إرسال صور العمل أو التصاميم أو النماذج إلى البريد الإلكتروني الخاص بالعميل، فإن مبلغ العربون المدفوع يُعد غير مسترد نهائياً ولا يحق للعميل المطالبة بأي جزء منه بعد الاستلام.'
                : 'Once work photos, designs, or mockups have been delivered to the client’s registered email, the advance deposit becomes strictly non-refundable, and no portion of it can be recovered under any circumstances.'}
            </p>
          </div>
        </div>

        {/* أقسام الشروط */}
        <div className="space-y-8 text-slate-700">
          
          {/* 1. شروط الأهلية */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              {isAr ? 'شروط قبول طلب الاسترجاع' : 'Eligibility for Refund'}
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-slate-600 pr-2">
              <li>
                {isAr
                  ? 'أن يتم تقديم الطلب خلال المدة الزمنية المسموح بها (خلال 7 أيام من تاريخ الدفع أو بدء الطلب).'
                  : 'The request must be submitted within the eligible time frame (within 7 days of payment or order initiation).'}
              </li>
              <li>
                {isAr
                  ? 'ألا تكون الصور أو النماذج قد تم إرسالها بالفعل إلى البريد الإلكتروني للعميل.'
                  : 'Work previews or design images must not have already been dispatched to the client email.'}
              </li>
              <li>
                {isAr
                  ? 'ألا تكون الخدمة أو براءة الاختراع/العمل قد تم تسليمه بالكامل أو اعتماده نهائياً.'
                  : 'The service or work must not have been fully delivered or officially completed.'}
              </li>
              <li>
                {isAr
                  ? 'إرفاق إثبات الدفع ورقم الطلب أو الفاتورة المسجلة في حسابك.'
                  : 'Provide proof of payment along with the registered order or invoice number.'}
              </li>
            </ul>
          </div>

          {/* 2. كيفية تقديم الطلب */}
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              {isAr ? 'كيفية تقديم طلب استرجاع' : 'How to Request a Refund'}
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {isAr
                ? 'يمكنك تقديم الطلب من خلال قسم "الشكاوى والاقتراحات" في الموقع مع توضيح سبب الاسترجاع وإرفاق كود الطلب، أو التواصل مع فريق خدمة العملاء والدعم الفني مباشرة عبر البريد الإلكتروني المعتمد.'
                : 'You can submit a request through our "Complaints" section stating your reason along with the order ID, or contact our customer support team directly via email.'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}