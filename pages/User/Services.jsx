import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { AlertCircle, LogIn, Loader2, Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import Image3 from '../../../public/image3.jpeg';

export default function Services() {
    const { isAr } = useLanguage();
    const navigate = useNavigate();
    const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

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

    const staggeredOffsets = [
        'lg:translate-y-0',
        'lg:translate-y-10',
        'lg:translate-y-20'
    ];

    return (
        <div className="relative w-full bg-gradient-to-b from-slate-50/70 via-white to-slate-50/50 pt-12 sm:pt-16 font-sans overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
            
            {/* السهم الأيسر: أعرض، أصغر حجماً، نازل من فوق مع margin-top */}
            <div className="hidden lg:block absolute left-4 xl:left-12 top-0 mt-6 xl:mt-8 w-44 xl:w-56 pointer-events-none select-none text-blue-600 drop-shadow-sm z-20">
                <svg viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path 
                        d="M10 20C60 15 90 75 140 55C165 45 185 65 205 92" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />
                    <path 
                        d="M185 86L207 95L202 72" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />
                </svg>
            </div>

            {/* السهم الأيمن: أعرض، أصغر حجماً، نازل من فوق مع margin-top */}
            <div className="hidden lg:block absolute right-4 xl:right-12 top-0 mt-6 xl:mt-8 w-44 xl:w-56 pointer-events-none select-none text-blue-600 drop-shadow-sm z-20">
                <svg viewBox="0 0 220 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path 
                        d="M210 20C160 15 130 75 80 55C55 45 35 65 15 92" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />
                    <path 
                        d="M35 86L13 95L18 72" 
                        stroke="currentColor" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                    />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">

                {/* ترويسة عنوان الخدمات */}
                <div className="max-w-2xl mx-auto mt-2 mb-20 sm:mb-28 text-center space-y-3 relative">
                   

                    <h2 className="text-5xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        {isAr ? 'خدماتنا' : 'What We Do'}
                    </h2>

                    <p className="text-slate-600 text-m sm:text-base leading-relaxed max-w-xl mx-auto">
                        {isAr
                            ? 'من قرار الشراء إلى الصيانة، فريقنا الهندسي والقانوني معاك في كل خطوة.'
                            : 'From acquisition decisions to routine diagnostics, our certified team secures every step.'}
                    </p>
                </div>

                {/* شبكة الكروت بالنمط المتداخل الهابط */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 pb-28 lg:pb-36 items-start">
                    {services.map((srv, index) => (
                        <div
                            key={srv.id}
                            className={`group relative flex flex-col transition-all duration-500 ease-out ${staggeredOffsets[index % 3]}`}
                        >
                            {/* صورة الغلاف بدون حدود خارجية */}
                            <div className="relative w-full h-64 sm:h-72 lg:h-80 rounded-3xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-slate-200">
                                <img
                                    src={srv.image}
                                    alt={srv.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/15 to-transparent opacity-85 group-hover:opacity-70 transition-opacity" />

                            </div>

                            {/* كارت المعلومات الطافي المتداخل */}
                            <div className="relative -mt-16 sm:-mt-20 mx-4 sm:mx-5 bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-100 group-hover:border-blue-500/40 group-hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between space-y-4">
                                
                                <div className="space-y-2.5 text-start">
                                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                                        {srv.title}
                                    </h3>

                                    {/* الخط الفاصل اللوني */}
                                    <div className="w-full h-0.5 bg-blue-500 to-transparent rounded-full" />

                                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">
                                        {srv.desc}
                                    </p>
                                </div>

                                {/* شريط التكلفة وزر الحجز */}
                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                                    <div className="flex flex-col text-start">
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {isAr ? 'تكلفة الخدمة' : 'Fee'}
                                        </span>
                                        {pricesLoading ? (
                                            <div className="flex items-center gap-1 text-slate-400">
                                                <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
                                                <span className="text-xs font-mono">...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-baseline gap-1 font-mono font-black text-blue-600 text-sm sm:text-base">
                                                <span>
                                                    {prices[srv.id] !== null && prices[srv.id] !== undefined
                                                        ? prices[srv.id].toLocaleString()
                                                        : '--'}
                                                </span>
                                                <span className="text-[9px] font-sans font-semibold text-slate-500">
                                                    {currency}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={(e) => handleServiceAction(srv.id, e)}
                                        className="inline-flex items-center gap-1.5 py-2.5 px-4 sm:px-5 bg-slate-900 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all duration-200 cursor-pointer group-hover:shadow-md active:scale-95"
                                    >
                                        <span>{isAr ? 'احجز الآن' : 'Book'}</span>
                                        <ArrowIcon className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
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