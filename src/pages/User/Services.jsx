import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { AlertCircle, LogIn, Loader2, Sparkles } from 'lucide-react';
import api from '../../services/api';
import Image3 from '../../../public/image3.jpeg';

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
            image: Image3,
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
    const [prices, setPrices] = useState({});
    const [pricesLoading, setPricesLoading] = useState(true);

    const currency = isAr ? 'الجنيه المصري' : 'EGP';
    const isLoggedIn = Boolean(localStorage.getItem('token') || localStorage.getItem('user'));

    useEffect(() => {
        let cancelled = false;

        const fetchAllPrices = async () => {
            setPricesLoading(true);
            try {
                const results = await Promise.allSettled(
                    services.map((srv) =>
                        api.get(`/serviceMangement/getPricingByName/${srv.id}`)
                    )
                );

                if (cancelled) return;

                const pricesMap = {};
                results.forEach((res, index) => {
                    const srvId = services[index].id;
                    if (res.status === 'fulfilled') {
                        pricesMap[srvId] = res.value.data?.data?.price ?? null;
                    } else {
                        pricesMap[srvId] = null;
                    }
                });

                setPrices(pricesMap);
            } catch (err) {
                console.error("Error fetching service prices:", err);
            } finally {
                if (!cancelled) setPricesLoading(false);
            }
        };

        fetchAllPrices();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleServiceAction = (serviceId, e) => {
        if (e) e.stopPropagation();
        if (isLoggedIn) {
            navigate(`/booking-service?service=${serviceId}`);
        } else {
            setShowAuthModal(true);
        }
    };

    return (
        <div className="min-h-screen bg-transparent font-sans" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="mx-auto px-5 sm:px-8 py-16 sm:py-20">

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

                {/* شبكة عرض الخدمات بنظام الصفوف المتبادلة (Zig-Zag Table Layout) */}
                <div className="flex flex-col gap-10 lg:gap-14">
                    {services.map((srv, index) => {
                        // تحديد ما إذا كان الصف زوجياً لعكس الترتيب
                        const isEven = index % 2 === 1;

                        return (
                            <div
                                key={srv.id}
                                className="group rounded-3xl overflow-hidden bg-white/95 backdrop-blur-xs border border-slate-200/90 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-slate-300/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 items-stretch"
                            >
                                {/* عمود الوصف والبيانات المالية وزر الحجز */}
                                <div
                                    className={`lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6 ${isEven ? "lg:order-2" : "lg:order-1"
                                        }`}
                                >
                                    <div className="space-y-4 text-start">
                                        

                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {srv.title}
                                        </h3>

                                        <div className="w-14 h-1 bg-gradient-to-r from-blue-600 to-teal-400 rounded-full" />

                                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                            {srv.desc}
                                        </p>
                                    </div>

                                    {/* شريط السعر وزر الحجز */}
                                    <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 p-4 rounded-2xl">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] text-slate-400 font-medium">
                                                {isAr ? "تكلفة الخدمة المقررة" : "Estimated Service Fee"}
                                            </span>
                                            {pricesLoading ? (
                                                <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                                                    <span className="text-xs font-mono">...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-baseline gap-1.5 font-mono font-black text-blue-600 text-lg sm:text-xl">
                                                    <span>
                                                        {prices[srv.id] !== null && prices[srv.id] !== undefined
                                                            ? prices[srv.id].toLocaleString()
                                                            : "--"}
                                                    </span>
                                                    <span className="text-xs font-sans font-semibold text-slate-500">
                                                        {currency}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => handleServiceAction(srv.id, e)}
                                            className="py-3 px-8 bg-slate-900 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                        >
                                            {isAr ? "احجز الآن" : "Book Now"}
                                        </button>
                                    </div>
                                </div>

                                {/* عمود الصورة */}
                                <div
                                    className={`lg:col-span-5 relative min-h-[260px] sm:min-h-[320px] lg:min-h-full overflow-hidden bg-slate-100 ${isEven ? "lg:order-1" : "lg:order-2"
                                        }`}
                                >
                                    <img
                                        src={srv.image}
                                        alt={srv.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60" />
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>

            {/* نافذة تسجيل الدخول المنبثقة */}
            {showAuthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
                    <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-slate-100">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                            <AlertCircle className="h-7 w-7" />
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {isAr ? 'تسجيل الدخول مطلوب' : 'Login Required'}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                            {isAr
                                ? 'يجب تسجيل الدخول أولاً لتتمكن من حجز الخدمة ومتابعة طلبك مباشرة.'
                                : 'You need to login first to book a service and proceed with your request.'}
                        </p>

                        <div className="flex flex-col gap-2.5">
                            <button
                                type="button"
                                onClick={() => { setShowAuthModal(false); navigate('/login'); }}
                                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all cursor-pointer shadow-sm"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>{isAr ? 'تسجيل الدخول' : 'Login Now'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowAuthModal(false)}
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