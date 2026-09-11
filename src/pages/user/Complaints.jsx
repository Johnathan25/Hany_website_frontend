import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import SuccessModal from '../../components/SuccessModal';
import api from '../../services/api';
import { 
  Send, 
  ShieldAlert, 
  Phone, 
  User, 
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function Complaints() {
  const { isAr } = useLanguage();
  const [showSuccess, setShowSuccess] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // نموذج إرسال الشكوى متطابق مع أسماء الحقول في الـ Controller
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: '',
    title: '',
    details: ''
  });

  const categories = [
    { id: 'معاينة هندسية', ar: 'تأخر مواعيد المعاينة الهندسية', en: 'Site Inspection Delay' },
    { id: 'جودة وتوريدات', ar: 'ملاحظات على خامات التوريد والإنشاء', en: 'Materials & Supply Quality' },
    { id: 'استفسار مالي وتعاقد', ar: 'استفسارات بنود التعاقد والدفعات', en: 'Contract & Payment Inquiries' },
    { id: 'اقتراح تطوير', ar: 'اقتراح لتطوير خدمات المنظومة', en: 'Improvement Suggestion' }
  ];

  // استخدام api.get لجلب البيانات من الـ Backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get('/complaints/all');
        console.log('Fetched Complaints:', response.data);
      } catch (err) {
        console.error('Fetch Complaints Error:', err);
      }
    };

    fetchComplaints();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.type || !formData.title || !formData.details) {
      setError(isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // إرسال البيانات للـ Backend عبر api.post
      const response = await api.post('/complaints', formData);

      // استخراج المعرف القادم من الـ Database أو استخدام كود افتراضي
      const createdId = response.data?.data?._id || Math.floor(100000 + Math.random() * 900000).toString();
      setTicketId(createdId);
      setShowSuccess(true);

      // تفريغ النموذج
      setFormData({
        name: '',
        phone: '',
        type: '',
        title: '',
        details: ''
      });
    } catch (err) {
      console.error('Submit Complaint Error:', err);
      setError(
        err.response?.data?.message || 
        (isAr ? 'حدث خطأ أثناء إرسال الشكوى، يرجى المحاولة لاحقاً' : 'Failed to submit complaint. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="complaints" className="w-full py-20 px-4 sm:px-6 lg:px-8 font-sans scroll-mt-20 select-none ">
      <div className="max-w-2xl mx-auto space-y-12">

        {/* 1. Header Section */}
        <div className="text-center space-y-4">
         

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight font-serif">
            {isAr ? 'الشكاوى والاقتراحات' : 'Complaints & Feedback'}
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-light">
            {isAr
              ? 'نحرص في Large Step على تقديم تجربة استثنائية. ملاحظاتك الميدانية والفنية محل اهتمام مباشر من الإدارة وفريق الجودة.'
              : 'At Large Step, we uphold strict standards. Your feedback receives immediate attention from our team.'}
          </p>
        </div>

        {/* 2. Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-7 sm:p-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder={isAr ? 'أحمد علي محمود' : 'Full name'}
                    className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isAr ? 'رقم الهاتف' : 'Phone Number'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    dir="ltr"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="010xxxxxxxx"
                    className="w-full ps-10 pe-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* نوع المعاملة / الشكوى */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isAr ? 'نوع المعاملة أو الشكوى' : 'Complaint Type'} <span className="text-rose-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer text-slate-700"
              >
                <option value="" disabled>
                  {isAr ? '-- اختر تصنيف الشكوى --' : '-- Select Type --'}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {isAr ? cat.ar : cat.en}
                  </option>
                ))}
              </select>
            </div>

            {/* العنوان */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isAr ? 'عنوان الشكوى' : 'Subject'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder={isAr ? 'مثال: تأخر استلام الطلب رقم #98765' : 'Brief title'}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            {/* التفاصيل */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {isAr ? 'تفاصيل الشكوى' : 'Details'} <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="details"
                rows="4"
                value={formData.details}
                onChange={handleInputChange}
                required
                placeholder={isAr ? 'اكتب تفاصيل الشكوى بدقة هنا...' : 'Write detailed complaint here...'}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-y"
              />
            </div>

            {/* زر الإرسال */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-md hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isAr ? 'جاري الإرسال...' : 'Submitting...'}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{isAr ? 'تأكيد وإرسال' : 'Submit Complaint'}</span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>

      {/* نافذة التأكيد المنبثقة */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={isAr ? 'تم إرسال الشكوى بنجاح' : 'Complaint Submitted'}
        message={
          isAr 
            ? `تم تسجيل شكواك برقم مرجعي #${ticketId}، وتم إرسال إشعار للإدارة الفنية لمتابعتها فوراً.` 
            : `Your complaint #${ticketId} has been registered and sent to management.`
        }
        actionText={isAr ? 'حسناً' : 'Done'}
        onAction={() => setShowSuccess(false)}
      />
    </section>
  );
}