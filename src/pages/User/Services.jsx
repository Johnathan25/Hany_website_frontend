import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { AlertCircle, LogIn } from 'lucide-react';

export default function Services() {
    const { isAr } = useLanguage();
    const navigate = useNavigate();

    const services = [
        {
            id: 'consultation',
            image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80',
            title: isAr ? 'استشارة عقارية متخصصة' : 'Property Consultation',
            desc: isAr
                ? 'تقييم شامل ومراجعة قانونية للتراخيص والعقود ودراسة الجدوى قبل اتخاذ قرار الشراء.'
                : 'Full legal review of licenses, contracts, and feasibility before you commit to a purchase.'
        },
        {
            id: 'inspection',
            image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80',
            title: isAr ? 'معاينة هندسية للموقع' : 'Engineering Inspection',
            desc: isAr
                ? 'زيارة ميدانية من مهندسينا لفحص التشطيبات والتوصيلات، مع تقرير مصور مفصل عن حالة العقار.'
                : 'On-site engineer visit covering finishing, wiring, and plumbing, with a full photo report.'
        },
        {
            id: 'maintenance',
            image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
            title: isAr ? 'صيانة مستعجلة' : 'Priority Maintenance',
            desc: isAr
                ? 'فرق فنية جاهزة للتدخل السريع في أعمال السباكة والكهرباء والتكييف بضمان على الخامات والتنفيذ.'
                : 'Certified technicians on call for urgent plumbing, electrical, and HVAC fixes, fully guaranteed.'
        }
    ];

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    // التحقق من حالة تسجيل الدخول
    const isLoggedIn = Boolean(localStorage.getItem('token') || localStorage.getItem('user'));

    const handleServiceAction = (serviceId, e) => {
        if (e) e.stopPropagation(); // منع انتشار الحدث
        
        if (isLoggedIn) {
            // إذا كان مسجل دخول يذهب لصفحة الحجز مباشرة
            navigate(`/booking-service?service=${serviceId}`);
        } else {
            // إذا لم يكن مسجل دخول يظهر الـ Modal
            setSelectedServiceId(serviceId);
            setShowAuthModal(true);
        }
    };

    const handleConfirmLogin = () => {
        setShowAuthModal(false);
        navigate('/login');
    };

    const handleCancel = () => {
        setShowAuthModal(false);
    };

    return (
        <div className="min-h-screen bg-white font-sans" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="mx-auto px-5 sm:px-8 py-16 sm:py-20">

                {/* عنوان الصفحة */}
                <div className="max-w-xl mx-auto mb-14 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                        {isAr ? 'خدماتنا' : 'What we do'}
                    </h1>
                    <p className="mt-3 text-slate-800 text-base leading-relaxed">
                        {isAr
                            ? 'من قرار الشراء إلى الصيانة، فريقنا الهندسي والقانوني معاك في كل خطوة.'
                            : 'From the buying decision to the maintenance call, our team is with you at every step.'}
                    </p>
                </div>

                {/* كروت الخدمات */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((srv) => (
                        <div
                            key={srv.id}
                            className="group text-start rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
                        >
                            <div>
                                {/* الصورة */}
                                <div className="h-64 overflow-hidden bg-slate-100">
                                    <img
                                        src={srv.image}
                                        alt={srv.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* المحتوى */}
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        {srv.title}
                                    </h2>
                                    <div className="w-10 h-0.5 bg-teal-500 my-3" />
                                    <p className="text-sm text-slate-500 leading-relaxed">
                                        {srv.desc}
                                    </p>
                                </div>
                            </div>

                            {/* زر الحجز */}
                            <div className="px-6 pb-6 pt-2">
                                <button
                                    type="button"
                                    onClick={(e) => handleServiceAction(srv.id, e)}
                                    className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg -md hover:bg-white hover:text-blue-600 border border-blue-600 transition duration-300 ease-in-out cursor-pointer"
                                >
                                    {isAr ? 'احجز الآن' : 'Book Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* نافذة التنبيه لطلب تسجيل الدخول */}
            {showAuthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 text-center -2xl border border-slate-100 animate-in zoom-in-95 duration-200">

                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-6 ring-amber-50/60">
                            <AlertCircle className="h-7 w-7" />
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {isAr ? 'تسجيل الدخول مطلوب' : 'Login Required'}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            {isAr
                                ? 'يجب تسجيل الدخول أولاً لتتمكن من حجز الخدمة ومتابعة طلبك.'
                                : 'You need to login first to book a service and proceed with your request.'}
                        </p>

                        <div className="flex flex-col gap-2.5">
                            <button
                                type="button"
                                onClick={handleConfirmLogin}
                                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm -sm transition-all cursor-pointer"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>{isAr ? 'تسجيل الدخول' : 'Login Now'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleCancel}
                                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                            >
                                {isAr ? 'إلغاء' : 'Cancel'}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}