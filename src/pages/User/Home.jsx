import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useLanguage } from '../../context/LanguageContext';
import About from "./About";

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
        const targetId = location.state?.scrollTo;
        if (targetId) {
            const timer = setTimeout(() => {
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 150);
            window.history.replaceState({}, document.title);
            return () => clearTimeout(timer);
        }
    }, [location.state]);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

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
            setComplaintForm({ name: '', phone: '', type: '', title: '', details: '' });
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

    return (
        // خلفية متدرجة ناعمة من الرمادي الفاتح إلى الأبيض تمتد خلف كل الأقسام
        <div className="w-full flex flex-col bg-gradient-to-b from-slate-100 via-slate-50 to-white">

            {/* ======== Hero Section ======== */}
            <section
                id="home"
                className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden font-sans select-none"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-blue-950/40 to-slate-950/80 pointer-events-none" />

                <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center my-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium text-white tracking-wide drop-shadow-md">
                            LUXURY REAL ESTATE{' '}
                            <span className="opacity-75 font-light mx-2">
                                <br />
                            </span>{' '}
                            العقارات الفاخرة
                        </h1>
                        <p className="text-slate-100 text-base sm:text-xl font-light tracking-wider drop-shadow-sm">
                            Exceptional Living in Prestigious Locations
                        </p>
                    </div>
                </main>
            </section>

            {/* مسافة فاصلة + قسم الخدمات */}
            <section id="services" className="scroll-mt-20 pt-10 sm:pt-16">
                <Services />
            </section>

            {/* مسافة فاصلة + قسم من نحن */}
            <section id="about" className="scroll-mt-20 pt-6 sm:pt-10">
                <About />
            </section>

            {/* مسافة فاصلة + قسم الشكاوى */}
            <section id="complaints" className="scroll-mt-20 pt-6 sm:pt-10 pb-16">
                <Complaints />
            </section>

        </div>
    );
}