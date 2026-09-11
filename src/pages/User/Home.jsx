import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLanguage } from '../../context/LanguageContext';
import About from "./pages/user/About";
import Properties from './Properties';
import Services from './Services';
import Complaints from './Complaints';

import SuccessModal from '../../components/SuccessModal';
import api from '../../services/api';
import {
    Send,
    ShieldAlert,
    Phone,
    User,
    AlertCircle,
    Loader2,
    LogIn,
    CheckCircle2,
    Building2,
    Hammer,
    Scale,
    Wrench
} from 'lucide-react';
const logo = "/logo.jpeg";
const bgImage = "/building.jpeg";




export default function Home() {
    const { isAr, toggleLang } = useLanguage();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Check if a target section was passed from another page
        if (location.state?.targetSection) {
            const targetId = location.state.targetSection;

            // Small timeout ensures the DOM components are fully rendered before scrolling
            const timer = setTimeout(() => {
                const el = document.getElementById(targetId);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                }
            }, 150);

            // Clean the history state so a normal page refresh doesn't scroll again
            window.history.replaceState({}, document.title);

            return () => clearTimeout(timer);
        }
    }, [location.state]);
    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // -------------------------------------------------------------
    // 2. Services & Booking Authentication Guard State
    // -------------------------------------------------------------
    const [showAuthModal, setShowAuthModal] = useState(false);
    const isLoggedIn = Boolean(
        localStorage.getItem('token') || localStorage.getItem('user')
    );

    const handleBookingClick = () => {
        if (!isLoggedIn) {
            setShowAuthModal(true);
        } else {
            navigate('/book-service');
        }
    };

    const handleConfirmLogin = () => {
        setShowAuthModal(false);
        navigate('/login');
    };

    const handleCancel = () => {
        setShowAuthModal(false);
        navigate('/');
    };

    // -------------------------------------------------------------
    // 3. Complaints Section State & Handlers
    // -------------------------------------------------------------
    const [showComplaintSuccess, setShowComplaintSuccess] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const [complaintLoading, setComplaintLoading] = useState(false);
    const [complaintError, setComplaintError] = useState('');

    const [complaintForm, setComplaintForm] = useState({
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

    // Optional: Read complaints using api.get
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

    const handleComplaintChange = (e) => {
        const { name, value } = e.target;
        setComplaintForm((prev) => ({ ...prev, [name]: value }));
        if (complaintError) setComplaintError('');
    };

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();

        if (
            !complaintForm.name ||
            !complaintForm.phone ||
            !complaintForm.type ||
            !complaintForm.title ||
            !complaintForm.details
        ) {
            setComplaintError(
                isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields'
            );
            return;
        }

        try {
            setComplaintLoading(true);
            setComplaintError('');

            const response = await api.post('/complaints', complaintForm);
            const createdId =
                response.data?.data?._id ||
                Math.floor(100000 + Math.random() * 900000).toString();

            setTicketId(createdId);
            setShowComplaintSuccess(true);
            setComplaintForm({
                name: '',
                phone: '',
                type: '',
                title: '',
                details: ''
            });
        } catch (err) {
            console.error('Submit Complaint Error:', err);
            setComplaintError(
                err.response?.data?.message ||
                (isAr
                    ? 'حدث خطأ أثناء إرسال الشكوى، يرجى المحاولة لاحقاً'
                    : 'Failed to submit complaint. Please try again.')
            );
        } finally {
            setComplaintLoading(false);
        }
    };

    // -------------------------------------------------------------
    // 4. Data Sets
    // -------------------------------------------------------------
    const stats = [
        { number: '+120', labelAr: 'مشروع منجز', labelEn: 'Projects' },
        { number: '+85', labelAr: 'عميل ومستثمر', labelEn: 'Partners' },
        { number: '+8', labelAr: 'سنوات خبرة', labelEn: 'Years Experience' },
        { number: '24/7', labelAr: 'دعم واستشارات', labelEn: 'Advisory Support' }
    ];

    const servicesList = [
        {
            icon: Building2,
            titleAr: 'معاينة وفحص العقارات',
            titleEn: 'Structural Inspection',
            descAr: 'فحص إنشائي وهندسي شامل قبل الشراء مع تقرير فني معتمد لسلامة المبنى.',
            descEn: 'Comprehensive engineering structural diagnostics before closing the deal.'
        },
        {
            icon: Scale,
            titleAr: 'الفحص والتقييم القانوني',
            titleEn: 'Legal Due Diligence',
            descAr: 'مراجعة تسلسل الملكية وتراخيص البناء وصحة الأوراق القانونية لضمان حقوقك.',
            descEn: 'Chain of title auditing, building permits verification, and risk protection.'
        },
        {
            icon: Hammer,
            titleAr: 'المقاولات العامة والتشطيبات',
            titleEn: 'General Contracting',
            descAr: 'تنفيذ كامل لأعمال الإنشاء والتشطيبات الفندقية بأعلى المعايير الهندسية.',
            descEn: 'Full execution of structural works and high-grade turnkey architectural finishing.'
        },
        {
            icon: Wrench,
            titleAr: 'التوريدات الإنشائية المتخصصة',
            titleEn: 'Construction Supplies',
            descAr: 'توفير خامات البناء والمعدات ومواد العزل المعتمدة لكبرى المشاريع.',
            descEn: 'Direct factory supply of certified building materials and hardware supplies.'
        }
    ];

    return (
        <div className="w-full flex flex-col bg-white">

            {/* ========================================================
          1. Hero Section (نفس تصميمك وألوانك بالكامل وبكامل الشاشة)
         ======================================================== */}
            <section
                id="home"
                className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden font-sans select-none bg-white"
            >
                {/* Background Image with Deep Blue / Slate Vignette */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-blue-950/40 to-slate-950/80 pointer-events-none" />

                {/* Hero Center Content */}
                <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center my-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium text-white tracking-wide drop-shadow-md">
                            LUXURY REAL ESTATE{' '}
                            <span className="opacity-75 font-light mx-2">
                                <br />
                            </span>{' '}
                            العقارات الفاخرة
                        </h1>

                        <p className="text-slate-100 text-base sm:text-xl font-light tracking-wider drop-shadow">
                            Exceptional Living in Prestigious Locations
                        </p>


                    </div>
                </main>


            </section>



            {/* ========================================================
          4. Services Section (خدماتنا)
         ======================================================== */}
            <section id="services" className="scroll-mt-20">
                <Services />
            </section>
            {/* ========================================================
          2. About Us Section (من نحن)
         ======================================================== */}
            <section id="about" className="scroll-mt-20">
                <About />
            </section>

            {/* ========================================================
          3. Properties Section (العقارات)
         ======================================================== */}
            {/* <section id="properties" className="scroll-mt-20">
                <Properties />
            </section> */}


            <section id="complaints" className="scroll-mt-20">
                <Complaints />
            </section>

        </div>
    );
}
