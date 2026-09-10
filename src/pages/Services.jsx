import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
    FileText,
    SearchCheck,
    Wrench,
    ArrowRight,
    ArrowLeft,
    Clock,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';

export default function Services() {
    const { isAr } = useLanguage();
    const navigate = useNavigate();
    const Arrow = isAr ? ArrowLeft : ArrowRight;

    const services = [
        {
            id: 'consultation',
            icon: FileText,
            tag: isAr ? 'استشارات فنية وقانونية' : 'Legal & Technical Advisory',
            title: isAr ? 'جلسة استشارة عقارية متخصصة' : 'Specialized Property Consultation',
            desc: isAr
                ? 'تقييم شامل ومستندات قانونية معتمدة لدراسة الجدوى والتأكد من سلامة التراخيص والتسجيل قبل الشراء.'
                : 'Comprehensive assessment and verified legal verification of property licenses, contracts, and investment feasibility.',
            features: isAr
                ? ['فحص التراخيص والوضع القانوني', 'دراسة القيمة السوقية العادلة', 'مراجعة عقود البيع والشراء']
                : ['License & Legal Status Audit', 'Fair Market Value Estimation', 'Sales Contract Due Diligence'],
            badgeColor: 'text-sky-700 bg-sky-50 border-sky-200'
        },
        {
            id: 'inspection',
            icon: SearchCheck,
            tag: isAr ? 'فحص ميداني وتوثيق' : 'On-Site Inspection',
            title: isAr ? 'معاينة هندسية ميدانية دقيقة' : 'Certified Engineering Inspection',
            desc: isAr
                ? 'زيارة موقعية لفريق من المهندسين لفحص العقار إنشائياً وتوثيق حالته عبر تقرير تفصيلي مع صور وفيديوهات.'
                : 'On-site engineer visit to inspect structural integrity, electrical/plumbing fixtures, and generate timestamped visual logs.',
            features: isAr
                ? ['فحص التشطيبات والإنشاءات', 'كشف الرطوبة والتوصيلات', 'تقرير فيديو وصور رسمي للموقع']
                : ['Finishing & Structural Integrity Check', 'Moisture & Electrical Scan', 'Verified Video & Photo Walkthrough'],
            badgeColor: 'text-blue-800 bg-blue-50 border-blue-200'
        },
        {
            id: 'emergency-maintenance',
            icon: Wrench,
            tag: isAr ? 'طوارئ وسرعة استجابة' : 'Priority Maintenance',
            title: isAr ? 'صيانة مستعجلة وتدخل فوري' : 'Urgent Repair & Rapid Response',
            desc: isAr
                ? 'فرق عمل متخصصة لحل المشاكل الطارئة بالسباكة، الكهرباء، التكييف، والعوازل بأعلى معايير الجودة والسرعة.'
                : 'Rapid dispatch technical team resolving urgent electrical, plumbing, HVAC, and insulation failures immediately.',
            features: isAr
                ? ['استجابة سريعة على مدار الساعة', 'فنيون ومهندسون معتمدون', 'ضمان معتمد على قطع الغيار والأعمال']
                : ['24/7 Fast Track Response', 'Certified Technicians & Supervisors', 'Workmanship & Replacement Guarantee'],
            badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-200'
        }
    ];

    const handleSelectService = () => {
        // توجيه مؤقت لصفحة About لحين إنشاء الصفحات المنفصلة
        navigate('/about');
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans select-none">
            <div className="max-w-6xl mx-auto space-y-10">


               
                

                {/* 2. عنوان الصفحة ومقدمتها */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {isAr ? 'خدماتنا الهندسية والاستشارية' : 'Our Professional Services'}
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                        {isAr
                            ? 'نضع خبرتنا الهندسية والقانونية لضمان سلامة أصولك العقارية، ابتداءً من القرار الاستثماري وحتى الصيانة الميدانية.'
                            : 'End-to-end technical, legal, and operational solutions safeguarding your real estate investments.'}
                    </p>
                </div>

                {/* 3. شبكة الخدمات الثلاث (Services Cards Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {services.map((srv) => {
                        const Icon = srv.icon;
                        return (
                            <div
                                key={srv.id}
                                onClick={handleSelectService}
                                className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-sky-400 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1"
                            >
                                <div className="space-y-4">
                                    {/* الأيقونة والتصنيف */}
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-sky-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${srv.badgeColor}`}>
                                            {srv.tag}
                                        </span>
                                    </div>

                                    {/* عنوان الخدمة وشرحها */}
                                    <div className="space-y-2 pt-2">
                                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                                            {srv.title}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                            {srv.desc}
                                        </p>
                                    </div>

                                    {/* تفاصيل المميزات */}
                                    <div className="pt-3 border-t border-slate-100 space-y-2">
                                        {srv.features.map((feat, fIdx) => (
                                            <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-700">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* زر اتخاذ الإجراء داخل البطاقة */}
                                <div className="pt-6 mt-6 border-t border-slate-100">
                                    <div className="w-full py-2.5 px-4 rounded-xl bg-slate-50 group-hover:bg-gradient-to-r group-hover:from-blue-900 group-hover:to-sky-600 text-slate-700 group-hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2">
                                        <span>{isAr ? 'طلب الخدمة والتفاصيل' : 'Request & Details'}</span>
                                        <Arrow className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 4. إشعار التوثيق والدعم أسفل الصفحة */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center sm:flex items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-center justify-center gap-3 text-slate-700 text-xs sm:text-sm mb-3 sm:mb-0">
                        <Clock className="w-4 h-4 text-sky-600 shrink-0" />
                        <span>
                            {isAr
                                ? 'هل تحتاج إلى استشارة عاجلة خارج أوقات العمل الرسمية؟'
                                : 'Need immediate consultation assistance outside business hours?'}
                        </span>
                    </div>
                    <button
                        onClick={() => navigate('/about')}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
                    >
                        {isAr ? 'تواصل مع الدعم الفني' : 'Contact Support'}
                    </button>
                </div>

            </div>
        </div>
    );
}