import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SuccessModal from '../components/SuccessModal';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Paperclip, 
  Clock, 
  ShieldAlert, 
  HelpCircle, 
  BarChart3,
  Phone,
  Mail,
  User,
  Hash
} from 'lucide-react';

export default function Complaints() {
  const { isAr } = useLanguage();
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'track'
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');

  // بيانات النموذج
  const [formData, setFormData] = useState({
    nationalId: '',
    fullName: '',
    title: '',
    details: '',
    category: '',
    file: null
  });

  // بيانات تتبع الشكوى
  const [trackInput, setTrackInput] = useState('');
  const [trackedRecord, setTrackedRecord] = useState(null);

  const categories = [
    { id: 'inspection_delay', ar: 'تأخر مواعيد المعاينة الهندسية', en: 'Site Inspection Delay' },
    { id: 'supplies_quality', ar: 'ملاحظات على خامات التوريد والإنشاء', en: 'Materials & Supply Quality' },
    { id: 'contract_inquiry', ar: 'استفسارات بنود التعاقد والدفعات', en: 'Contract & Payment Inquiries' },
    { id: 'service_suggestion', ar: 'اقتراح لتطوير خدمات المنظومة', en: 'Improvement Suggestion' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // توليد رقم تتبع عشوائي للطلب
    const generatedId = Math.floor(100000 + Math.random() * 900000).toString();
    setTicketId(generatedId);
    setShowSuccess(true);
    setFormData({ nationalId: '', fullName: '', title: '', details: '', category: '', file: null });
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackInput.trim()) return;

    setTrackedRecord({
      id: trackInput,
      status: isAr ? 'قيد الفحص والمتابعة الميدانية' : 'Under Field Review',
      date: '2026-09-11',
      title: isAr ? 'مراجعة تقرير معاينة التجمع الخامس' : '5th Settlement Inspection Review'
    });
  };

  return (
    <section id="complaints" className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans scroll-mt-20 select-none">
      <div className="max-w-2xl mx-auto space-y-16">

        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-serif">
            {isAr ? 'الشكاوى والاقتراحات' : 'Complaints & Feedback'}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            {isAr
              ? 'نحرص في Large Step على تقديم تجربة استثنائية. ملاحظاتك الميدانية والفنية محل اهتمام مباشر من الإدارة العليا وفريق الجودة.'
              : 'At Large Step, we uphold strict standards. Your field notices and suggestions receive immediate priority from our leadership team.'}
          </p>

          {/* تبديل المسار: جديد / تتبع */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setActiveTab('new')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-xs ${
                activeTab === 'new'
                  ? 'bg-blue-600 text-white shadow-blue-500/25'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'تقديم شكوى أو اقتراح' : 'Submit Feedback'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-xs ${
                activeTab === 'track'
                  ? 'bg-blue-600 text-white shadow-blue-500/25'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{isAr ? 'متابعة شكوى سابقة' : 'Track Status'}</span>
            </button>
          </div>
        </div>

        {/* 2. Content Layout (Form vs Sidebar) */}
     
          
          {/* Main Form Container */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-7 sm:p-10">
            {activeTab === 'new' ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* رقم الهاتف / الهوية */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {isAr ? 'رقم الهاتف أو الهوية' : 'Phone / ID'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                        <Hash className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleInputChange}
                        required
                        placeholder={isAr ? '010xxxxxxxx' : 'Phone or ID'}
                        className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* اسم العميل */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      {isAr ? 'الاسم بالكامل' : 'Full Name'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        placeholder={isAr ? 'اسم العميل' : 'Full name'}
                        className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* تصنيف الشكوى */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {isAr ? 'نوع المعاملة أو الشكوى' : 'Category'} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer text-slate-700"
                  >
                    <option value="" disabled>
                      {isAr ? '-- اختر التصنيف المناسب --' : '-- Select Category --'}
                    </option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {isAr ? cat.ar : cat.en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* العنوان المختصر */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {isAr ? 'عنوان موجز للملاحظة' : 'Subject'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder={isAr ? 'مثال: تأخر استلام تقرير فحص الموقع' : 'Brief subject'}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>

                {/* التفاصيل */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {isAr ? 'تفاصيل الملاحظة أو الشكوى' : 'Details'} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="details"
                    rows="4"
                    value={formData.details}
                    onChange={handleInputChange}
                    required
                    placeholder={isAr ? 'اشرح بالتفصيل ما حدث ليتسنى لفريقنا التدخل فوراً...' : 'Write all details clearly...'}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-y"
                  />
                </div>

               

                {/* زر الإرسال */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-blue-500/25 transition-all"
                >
                  {isAr ? 'إرسال الشكوى رسمياً' : 'Submit Ticket'}
                </button>
              </form>
            ) : (
              /* وضع تتبع الشكوى */
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {isAr ? 'الاستعلام عن حالة الطلب' : 'Check Request Status'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? 'أدخل رقم المعاملة المسجل لمتابعة الإجراءات المتخذة.' : 'Enter your ticket reference ID.'}
                  </p>
                </div>

                <form onSubmit={handleTrackSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={trackInput}
                    onChange={(e) => setTrackInput(e.target.value)}
                    placeholder={isAr ? 'مثال: 543210' : 'e.g. 543210'}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shrink-0"
                  >
                    {isAr ? 'استعلام' : 'Track'}
                  </button>
                </form>

                {trackedRecord && (
                  <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3 mt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-900">
                        #{trackedRecord.id}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <Clock className="w-3.5 h-3.5" />
                        {trackedRecord.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {trackedRecord.title}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {isAr ? 'تاريخ التقديم:' : 'Date:'} {trackedRecord.date}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

         

        </div>

      

      {/* نافذة التأكيد المنبثقة */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={isAr ? 'تم تسجيل الشكوى بنجاح' : 'Feedback Received'}
        message={
          isAr 
            ? `تم استلام طلبكم برقم تتبع #${ticketId}. سيتواصل معكم فريق الفحص والجودة الفنية خلال 24 ساعة.` 
            : `Your ticket #${ticketId} has been filed. Our quality team will contact you within 24 hours.`
        }
        actionText={isAr ? 'تم' : 'Done'}
        onAction={() => setShowSuccess(false)}
      />
    </section>
  );
}