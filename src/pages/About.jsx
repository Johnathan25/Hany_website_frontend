import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
    Building2,
    ShieldCheck,
    Award,
    Mail,
    Phone,
    MapPin,
    CheckCircle2,
    ArrowRight,
    ArrowLeft
} from 'lucide-react';
import building from '../../public/building.jpeg';

export default function About() {
    const { isAr } = useLanguage();
    const navigate = useNavigate();

    const content = {
        ar: {
            badge: 'الريادة والمصداقية العقارية',
            title: 'من نحن - نبذة عن الشركة',
            subtitle: 'شريكك العقاري المعتمد والموثوق لتقديم الاستشارات القانونية والفنية والمعاينات الميدانية للمستثمرين في مصر وخارجها.',
            storyTitle: 'خبرة ممتدة ورؤية استثمارية تحمي حقوقك',
            storyP1: 'تأسست شركتنا ككيان استشاري عقاري يهدف إلى سد الفجوة بين المستثمرين (لا سيما المستثمرين الدوليين) والفرص العقارية الواعدة داخل جمهورية مصر العربية. نحن لا نبيع مجرد عقارات، بل نقدّم فحصاً وتدقيقاً فنياً وقانونياً شاملاً يضمن سلامة استثمارك.',
            storyP2: 'من خلال فريقنا من المهندسين والمستشارين، نوثق كل جولة معاينة، ونحرص على توثيق كافة المعاملات والاتفاقات عبر المراسلات الرسمية لضمان الشفافية التامة وحماية جميع الأطراف.',
            stats: [
                { value: '+12', label: 'عاماً من الخبرة في السوق' },
                { value: '+350', label: 'عقار تمت معاينته وفحصه' },
                { value: '100%', label: 'توثيق رسمي ومراسلات معتمدة' },
                { value: '+200', label: 'مستثمر دولي يثق بخدماتنا' }
            ],
            valuesTitle: 'لماذا يثق بنا المستثمرون؟',
            values: [
                {
                    title: 'الشفافية والتوثيق القانوني',
                    desc: 'جميع استفساراتك واتفاقاتك مسجلة عبر البريد الإلكتروني الرسمي لضمان حجية المعاملات.'
                },
                {
                    title: 'معاينات هندسية دقيقة',
                    desc: 'نقدم تقارير فحص حقيقية تشمل مقاطع مصورة وتدقيقاً تفصيلياً لحالة العقار الإنشائية والقانونية.'
                },
                {
                    title: 'بوابات دفع دولية آمنة',
                    desc: 'إمكانية إتمام سداد رسوم الاستشارات والمعاينات عبر بوابات رسمية معتمدة ومحمية بالكامل.'
                }
            ],
            contactTitle: 'بيانات التواصل الرسمية',
            emailLabel: 'البريد الإلكتروني المعتمد:',
            phoneLabel: 'الهاتف المباشر / واتساب:',
            addressLabel: 'المقر الرئيسي:',
            addressVal: 'الجيزة / القاهرة - جمهورية مصر العربية',
            ctaText: 'العودة للرئيسية ومطالعة العقارات'
        },
        en: {
            badge: 'Real Estate Authority & Trust',
            title: 'About Us - Company Overview',
            subtitle: 'Your trusted partner providing certified technical appraisals, legal advisory, and verified on-site inspections for global investors in Egypt.',
            storyTitle: 'Proven Expertise & Protected Investments',
            storyP1: 'Founded as a specialized real estate advisory firm, we bridge the gap between discerning investors and lucrative property opportunities in Egypt. We prioritize asset security through meticulous on-site evaluations and legal due diligence.',
            storyP2: 'Our team of certified engineers and consultants documents every physical walk-through with timestamped visual reports, ensuring all correspondence and agreements remain verifiable and transparent.',
            stats: [
                { value: '12+ Years', label: 'Market Expertise' },
                { value: '350+', label: 'Inspected Properties' },
                { value: '100%', label: 'Documented Transactions' },
                { value: '200+', label: 'International Clients' }
            ],
            valuesTitle: 'Why Global Investors Trust Us',
            values: [
                {
                    title: 'Audit-Proof Transparency',
                    desc: 'All communications, scopes of work, and negotiations are recorded via official email channels.'
                },
                {
                    title: 'Rigorous On-site Inspections',
                    desc: 'We provide comprehensive inspection reports accompanied by verified video walkthroughs.'
                },
                {
                    title: 'Secure Global Checkout',
                    desc: 'Advisory and inspection fees are processed via certified, encrypted payment gateways.'
                }
            ],
            contactTitle: 'Official Contact Details',
            emailLabel: 'Certified Inquiries Email:',
            phoneLabel: 'Direct Line / WhatsApp:',
            addressLabel: 'Headquarters:',
            addressVal: 'Giza / Cairo, Arab Republic of Egypt',
            ctaText: 'Back to Home & Featured Properties'
        }
    };

    const t = isAr ? content.ar : content.en;
    const Arrow = isAr ? ArrowLeft : ArrowRight;

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed py-14 px-4 sm:px-6 lg:px-8 font-sans"
            style={{
                backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.78), rgba(30, 58, 138, 0.85)), url(${building})`,
            }}
        >
            <div className="max-w-5xl mx-auto space-y-12">



                {/* Page Header */}
                <div className="text-center max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-1.5 py-1 px-4 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-4 backdrop-blur-xs">
                        <Award className="w-3.5 h-3.5 text-blue-300" />
                        {t.badge}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 drop-shadow-sm">
                        {t.title}
                    </h1>
                    <p className="text-blue-100/90 text-base sm:text-lg leading-relaxed drop-shadow-xs">
                        {t.subtitle}
                    </p>
                </div>

                {/* Stats Grid (White Cards with Royal Blue Numbers) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {t.stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-blue-100 shadow-md text-center hover:translate-y-[-2px] transition-transform"
                        >
                            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mb-1">
                                {stat.value}
                            </div>
                            <div className="text-xs sm:text-sm font-semibold text-slate-700">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Story & Contact Details */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-10 border border-blue-100 shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-7 space-y-4">
                        <h2 className="text-2xl font-bold text-slate-900 border-b border-blue-100 pb-3">
                            {t.storyTitle}
                        </h2>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            {t.storyP1}
                        </p>
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                            {t.storyP2}
                        </p>
                    </div>

                    {/* Deep Navy/Blue Card for Official Contacts */}
                    <div className="md:col-span-5 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white p-6 sm:p-8 rounded-2xl space-y-4 border border-blue-800/60 shadow-xl">
                        <div className="flex items-center gap-2 text-blue-300 font-semibold text-sm border-b border-blue-800/80 pb-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <span>{t.contactTitle}</span>
                        </div>
                        <div className="space-y-4 text-xs sm:text-sm text-slate-200">
                            <div className="flex items-start gap-2.5">
                                <Mail className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-blue-200/70 text-xs">{t.emailLabel}</div>
                                    <a href="mailto:hanywilliam1000@gmail.com" className="text-white hover:text-blue-300 underline font-medium">
                                        hanywilliam1000@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-blue-200/70 text-xs">{t.phoneLabel}</div>
                                    <span className="text-white dir-ltr font-mono font-medium">201228213969+</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                <div>
                                    <div className="text-blue-200/70 text-xs">{t.addressLabel}</div>
                                    <span className="text-white font-medium">{t.addressVal}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Trust Us Cards */}
                <div className="space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white text-center drop-shadow-sm">
                        {t.valuesTitle}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {t.values.map((v, idx) => (
                            <div
                                key={idx}
                                className="bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-blue-100 shadow-md flex flex-col justify-between hover:shadow-xl transition-shadow"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4 text-blue-700 font-bold">
                                        0{idx + 1}
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 mb-2">{v.title}</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{v.desc}</p>
                                </div>
                                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-blue-700 text-xs font-semibold">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>معتمد ومطبق رسمياً</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Back to Home Button (Blue Accent) */}
                <div className="text-center pt-4">
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:-translate-y-0.5"
                    >
                        <span>{t.ctaText}</span>
                        <Arrow className="w-4 h-4 text-blue-200" />
                    </button>
                </div>

            </div>
        </div>
    );
}