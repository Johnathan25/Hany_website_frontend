import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import {
    User,
    MapPin,
    Phone,
    Briefcase,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';

export default function BookService() {
    const { isAr } = useLanguage();
    const navigate = useNavigate();
    const Arrow = isAr ? ArrowLeft : ArrowRight;

    const [formData, setFormData] = useState({
        userName: '',
        location: '',
        phoneNumber: '',
        serviceType: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const servicesList = [
        {
            id: 'consultation',
            titleAr: 'جلسة استشارة عقارية وقانونية متخصصة',
            titleEn: 'Specialized Real Estate & Legal Consultation'
        },
        {
            id: 'inspection',
            titleAr: 'معاينة هندسية ميدانية دقيقة',
            titleEn: 'Field Engineering & Structural Inspection'
        },
        {
            id: 'maintenance',
            titleAr: 'صيانة مستعجلة وتدخل فوري',
            titleEn: 'Emergency Maintenance & Urgent Repairs'
        },
        {
            id: 'supplies',
            titleAr: 'مقاولات وتوريدات معتمدة',
            titleEn: 'Contracting & Certified Material Supplies'
        }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.userName || !formData.location || !formData.phoneNumber || !formData.serviceType) {
            setError(isAr ? 'برجاء ملء جميع الحقول المطلوبة' : 'Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Send to backend API
            const response = await api.post('/order', formData);

            // Navigate to payment page with order details in route state
            navigate('/pay', {
                state: {
                    order: response.data?.data || formData,
                    orderId: response.data?.data?._id || response.data?._id
                }
            });
        } catch (err) {
            console.error('Order submission error:', err);
            setError(
                err.response?.data?.message ||
                (isAr ? 'حدث خطأ أثناء إرسال البيانات، يرجى المحاولة مرة أخرى' : 'Failed to submit request. Please try again.')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-xl">

                {/* Header Title & Intro */}
                <div className="text-center mb-8 space-y-2">
                    
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {isAr ? 'طلب معاينة أو خدمة هندسية' : 'Request a Service / Inspection'}
                    </h1>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                        {isAr
                            ? 'أدخل بياناتك وسيتم توجيهك فوراً لاختيار وسيلة الدفع وتأكيد الحجز.'
                            : 'Enter your details to proceed to secure checkout and confirm your booking.'}
                    </p>
                </div>

                {/* Form Container Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* 1. Full Name */}
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
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    placeholder={isAr ? 'مثال: أحمد مصطفى' : 'e.g. John Doe'}
                                    className="w-full ps-10 pe-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* 2. Phone Number */}
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
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="+20 100 000 0000"
                                    className="w-full ps-10 pe-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* 3. Location / Address */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                {isAr ? 'الموقع أو العنوان بالتفصيل' : 'Location / Detailed Address'} <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder={isAr ? 'مثال: التجمع الخامس - كمبوند...' : 'e.g. 5th Settlement, Cairo'}
                                    className="w-full ps-10 pe-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* 4. Service Type Select */}
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                {isAr ? 'نوع الخدمة المطلوبة' : 'Service Type'} <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                                    <Briefcase className="w-4 h-4" />
                                </div>
                                <select
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    className="w-full ps-10 pe-8 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all cursor-pointer"
                                    required
                                >
                                    <option value="" disabled>
                                        {isAr ? '-- اختر نوع الخدمة --' : '-- Select Service Type --'}
                                    </option>
                                    {servicesList.map((srv) => (
                                        <option key={srv.id} value={srv.id}>
                                            {isAr ? srv.titleAr : srv.titleEn}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide shadow-sm hover:shadow-md hover:shadow-blue-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>{isAr ? 'جاري الحفظ...' : 'Processing...'}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{isAr ? 'المتابعة للدفع' : 'Proceed to Payment'}</span>
                                        <Arrow className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    );
}