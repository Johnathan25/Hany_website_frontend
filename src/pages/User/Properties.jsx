import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
    ArrowRight,
    ArrowLeft,
    Play,
    MapPin,
    CheckCircle2,
    Maximize,
    BedDouble,
    Bath,
    Video,
    Image as ImageIcon
} from 'lucide-react';

export default function Properties() {
    const { isAr } = useLanguage();
    const navigate = useNavigate();
    const Arrow = isAr ? ArrowRight : ArrowLeft;

    // حالة التبديل بين عرض الصورة أو الفيديو
    const [activeMedia, setActiveMedia] = useState('image'); // 'image' | 'video'

    const propertyData = {
        title: isAr ? 'فيلا الجوهرة الفاخرة - التجمع الخامس' : 'The Diamond Luxury Villa - New Cairo',
        location: isAr ? 'القاهرة الجديدة، التجمع الخامس، مصر' : 'New Cairo, Fifth Settlement, Egypt',
        price: isAr ? '18,500,000 ج.م' : 'EGP 18,500,000',
        description: isAr
            ? 'فيلا مستقلة راقية بتصميم معماري حديث وتشطيب فندقي متكامل، تطل مباشرة على بحيرة صناعية ومساحات خضراء، مجهزة بأحدث أنظمة المنازل الذكية وتأمين متكامل على مدار الساعة.'
            : 'An exclusive detached villa featuring state-of-the-art contemporary architecture, premium high-end finishing, private infinity pool, and integrated smart home automation.',
        specs: [
            { label: isAr ? 'المساحة' : 'Area', value: '520 m²', icon: Maximize },
            { label: isAr ? 'الغرف' : 'Bedrooms', value: '5', icon: BedDouble },
            { label: isAr ? 'الحمامات' : 'Bathrooms', value: '6', icon: Bath },
        ],
        features: isAr
            ? ['حمام سباحة خاص وتراس بانورامي', 'أنظمة تحكم ذكية بالكامل (Smart Home)', 'فحص إنشائي معتمد وموثق', 'جاهزية التسليم الفوري والتسجيل']
            : ['Private Infinity Pool & Terrace', 'Fully Integrated Smart Home Automation', 'Certified Structural Inspection Report', 'Immediate Handover & Legal Registration'],
        imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
        // فيديو عقاري تجريبي بجودة عالية
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-tour-42036-large.mp4'
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className=" mx-auto space-y-8">

              

                {/* 2. حاوية الوسائط (صورة / فيديو) */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-md space-y-4">

                    {/* شريط أزرار التبديل بين المعاينة بالصورة أو الفيديو */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setActiveMedia('image')}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeMedia === 'image'
                                ? 'bg-gradient-to-r from-blue-900 to-sky-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            <ImageIcon className="w-4 h-4" />
                            <span>{isAr ? 'معاينة الصور' : 'Photo Tour'}</span>
                        </button>

                        
                    </div>

                    {/* شاشة العرض الرئيسية */}
                    <div className="relative w-full h-[320px] sm:h-[480px] lg:h-[540px] rounded-2xl overflow-hidden bg-slate-950 border border-slate-100 shadow-inner">
                        {activeMedia === 'image' ? (
                            <img
                                src={propertyData.imageUrl}
                                alt={propertyData.title}
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                        ) : (
                            <video
                                controls
                                autoPlay
                                muted
                                playsInline
                                preload="auto"
                                key={propertyData.videoUrl}
                                className="w-full h-full object-cover"
                            >
                                <source src={propertyData.videoUrl} type="video/mp4" />
                                {isAr ? 'متصفحك لا يدعم تشغيل الفيديو.' : 'Your browser does not support the video tag.'}
                            </video>
                        )}

                        {/* شارة السعر العائمة فوق المشغل */}
                        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-white">
                            <div className="text-[10px] uppercase tracking-wider text-sky-400 font-semibold">
                                {isAr ? 'السعر المطلوب' : 'Asking Price'}
                            </div>
                            <div className="text-base sm:text-lg font-bold">
                                {propertyData.price}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. تفاصيل العقار والمواصفات */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* العمود الرئيسي: الوصف والمميزات */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                        <div>
                            <div className="flex items-center gap-2 text-sky-600 text-xs font-semibold mb-2">
                                <MapPin className="w-4 h-4" />
                                <span>{propertyData.location}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                                {propertyData.title}
                            </h1>
                        </div>

                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            {propertyData.description}
                        </p>

                        {/* قائمة المميزات */}
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900 mb-3">
                                {isAr ? 'أهم مواصفات الفحص والاعتماد:' : 'Key Property Highlights:'}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {propertyData.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* العمود الجانبي: إحصائيات سريعة وزر طلب المعاينة */}
                    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                                {isAr ? 'بيانات المساحة والتقسيم' : 'Overview Specs'}
                            </h3>

                            <div className="space-y-3">
                                {propertyData.specs.map((spec, idx) => {
                                    const Icon = spec.icon;
                                    return (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                                                <Icon className="w-4 h-4 text-sky-600" />
                                                <span>{spec.label}</span>
                                            </div>
                                            <span className="text-xs font-bold text-slate-900">{spec.value}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <button
                                onClick={() => navigate('/about')}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-900 to-sky-600 hover:from-blue-950 hover:to-sky-700 text-white font-bold text-xs tracking-wider transition-all shadow-md hover:shadow-lg text-center"
                            >
                                {isAr ? 'حجز معاينة ميدانية معتمدة' : 'Schedule On-Site Inspection'}
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors text-center"
                            >
                                {isAr ? 'العودة للرئيسية' : 'Return to Home'}
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}