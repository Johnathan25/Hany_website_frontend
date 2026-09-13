import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Loader2,
    CreditCard,
    ShieldCheck,
    AlertCircle,
    FileText,
    Calendar,
    Wallet,
    User,
    Phone,
    Mail,
    MapPin,
    ArrowRight,
    ExternalLink,
} from "lucide-react";
import api from "../../services/api";

const InventionDepositPayment = () => {
    const [searchParams] = useSearchParams();
    const inventionId = searchParams.get("inventionId");
    const pricingOptionId = searchParams.get("pricingOptionId");

    // ==========================================
    // STATES
    // ==========================================
    const [invention, setInvention] = useState(null);
    const [pricingOption, setPricingOption] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [paymentUrl, setPaymentUrl] = useState("");
    const [error, setError] = useState("");

    // ==========================================
    // CUSTOMER FORM
    // ==========================================
    const [formData, setFormData] = useState({
        customerName: "",
        phone: "",
        address: "",
        email: "",
    });

    // ==========================================
    // GET INVENTION
    // ==========================================
    useEffect(() => {
        const getInvention = async () => {
            try {
                setLoading(true);
                setError("");

                if (!inventionId || !pricingOptionId) {
                    setError("بيانات براءة الاختراع أو خيار الترخيص غير موجودة");
                    return;
                }

                const response = await api.get(
                    `/invention/client/${inventionId}`
                );
                const data = response.data?.invention;

                if (!data) {
                    setError("لم يتم العثور على براءة الاختراع");
                    return;
                }

                setInvention(data);

                // ==========================================
                // FIND SELECTED PRICING OPTION
                // ==========================================
                const selectedOption = (data.pricingOptions || []).find(
                    (option) => String(option._id) === String(pricingOptionId)
                );

                if (!selectedOption) {
                    setError("خيار الترخيص الذي اخترته غير موجود أو غير متاح");
                    return;
                }

                setPricingOption(selectedOption);
            } catch (err) {
                console.error("Get invention error:", err);
                setError(
                    err.response?.data?.message || "حدث خطأ أثناء جلب بيانات البراءة"
                );
            } finally {
                setLoading(false);
            }
        };

        getInvention();
    }, [inventionId, pricingOptionId]);

    // ==========================================
    // FORM CHANGE
    // ==========================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ==========================================
    // VALIDATE FORM
    // ==========================================
    const validateForm = () => {
        if (!formData.customerName.trim()) {
            setError("يرجى إدخال الاسم");
            return false;
        }
        if (!formData.phone.trim()) {
            setError("يرجى إدخال رقم الهاتف");
            return false;
        }
        if (!formData.email.trim()) {
            setError("يرجى إدخال البريد الإلكتروني");
            return false;
        }
        if (!formData.address.trim()) {
            setError("يرجى إدخال العنوان");
            return false;
        }

        setError("");
        return true;
    };

    // ==========================================
    // CREATE REQUEST + PAYMENT
    // ==========================================
    const handlePayment = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setPaymentLoading(true);
            setError("");

            const response = await api.post(
                "/inventionRequest",
                {
                    inventionId,
                    pricingOptionId,
                    customerName: formData.customerName.trim(),
                    phone: formData.phone.trim(),
                    address: formData.address.trim(),
                    email: formData.email.trim(),
                },
                {
                    withCredentials: true,
                }
            );

            console.log("Create invention request response:", response.data);

            // ==========================================
            // GET PAYMENT URL (مع إضافة sessionUrl)
            // ==========================================
            const url =
                response.data?.sessionUrl ||
                response.data?.payment?.sessionUrl ||
                response.data?.payment?.kashier?.sessionUrl ||
                response.data?.payment?.kashier?.paymentUrl ||
                response.data?.payment?.kashier?.url ||
                response.data?.paymentUrl;

            if (!url) {
                console.error("Full payment response with missing URL:", response.data);
                throw new Error("لم يتم استلام رابط الدفع من الخادم");
            }

            // خيار 1: التحويل المباشر لصفحة كاشير لتجنب قيود الـ iframe (موصى به)
            // window.location.href = url;

            // خيار 2: عرض الصفحة مع الـ iframe وزر احتياطي
            setPaymentUrl(url);
        } catch (err) {
            console.error("Payment error:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "حدث خطأ أثناء إنشاء عملية الدفع"
            );
        } finally {
            setPaymentLoading(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                    <p className="text-gray-600">جاري تحميل بيانات البراءة...</p>
                </div>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================
    if (error && !invention) {
        return (
            <div
                dir="rtl"
                className="min-h-screen bg-gray-50 flex items-center justify-center p-6"
            >
                <div className="bg-white border rounded-2xl -sm p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    // ==========================================
    // PAYMENT IFRAME + DIRECT BUTTON
    // ==========================================
    if (paymentUrl) {
        return (
            <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl border -sm overflow-hidden">
                        <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-800 text-lg">
                                        إتمام دفع العربون
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        أكمل عملية الدفع بأمان عبر بوابة الدفع الإلكتروني
                                    </p>
                                </div>
                            </div>

                            {/* زر للتحويل لصفحة الدفع مباشرة في حال تعذر ظهور الـ iframe */}
                            <a
                                href={paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
                            >
                                <span>فتح نافذة الدفع مباشرة</span>
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>

                        <iframe
                            src={paymentUrl}
                            title="Kashier Payment"
                            className="w-full border-0"
                            style={{ height: "750px" }}
                            allow="payment"
                        />
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // MAIN PAGE
    // ==========================================
    return (
        <div dir="rtl" className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* ====================================== PAGE HEADER ======================================= */}
                <div className="mb-7">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        طلب براءة الاختراع
                    </h1>
                    <p className="text-gray-500 mt-2">
                        راجع بيانات البراءة والترخيص قبل دفع العربون
                    </p>
                </div>

                {/* ====================================== ERROR ======================================= */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* ====================================== INVENTION INFO ======================================= */}
                <div className="bg-white rounded-2xl border -sm p-6 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">براءة الاختراع</p>
                            <h2 className="text-xl font-bold text-gray-800">
                                {invention?.title}
                            </h2>
                            {invention?.shortDescription && (
                                <p className="text-gray-600 mt-3 leading-7">
                                    {invention.shortDescription}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ====================================== CONTENT ======================================= */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* ==================================== FORM / OPTION ==================================== */}
                    <div className="lg:col-span-2">
                        {/* SELECTED PRICING */}
                        {pricingOption && (
                            <div className="bg-white rounded-2xl border -sm p-6">
                                <h2 className="text-lg font-bold text-gray-800 mb-5">
                                    تفاصيل الترخيص المختار
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* TYPE */}
                                    <div className="border rounded-xl p-4">
                                        <p className="text-sm text-gray-500 mb-2">نوع الترخيص</p>
                                        <p className="font-bold text-gray-800">
                                            {pricingOption.type}
                                        </p>
                                    </div>

                                    {/* DURATION */}
                                    <div className="border rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <p className="text-sm text-gray-500">مدة الترخيص</p>
                                        </div>
                                        <p className="font-bold text-gray-800">
                                            {pricingOption.durationYears
                                                ? `${pricingOption.durationYears} سنة`
                                                : "غير محددة"}
                                        </p>
                                    </div>

                                    {/* FINAL PRICE */}
                                    <div className="border rounded-xl p-4">
                                        <p className="text-sm text-gray-500 mb-2">السعر النهائي</p>
                                        <p className="text-xl font-bold text-gray-800">
                                            {Number(pricingOption.price).toLocaleString("ar-EG")}{" "}
                                            جنيه
                                        </p>
                                    </div>

                                    {/* DEPOSIT */}
                                    <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Wallet className="w-4 h-4 text-blue-600" />
                                            <p className="text-sm text-blue-700">العربون المطلوب</p>
                                        </div>
                                        <p className="text-2xl font-bold text-blue-700">
                                            {Number(pricingOption.depositAmount).toLocaleString(
                                                "ar-EG"
                                            )}{" "}
                                            جنيه
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ================================== CUSTOMER FORM =================================== */}
                        {showForm && (
                            <div className="bg-white rounded-2xl border -sm p-6 mt-6">
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-gray-800">
                                        بيانات العميل
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        أدخل بياناتك لإتمام طلب براءة الاختراع
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {/* NAME */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            الاسم بالكامل
                                        </label>
                                        <div className="relative">
                                            <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="customerName"
                                                value={formData.customerName}
                                                onChange={handleChange}
                                                placeholder="اكتب اسمك بالكامل"
                                                className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>

                                    {/* PHONE */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            رقم الهاتف
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="01012345678"
                                                className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>

                                    {/* EMAIL */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            البريد الإلكتروني
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="example@gmail.com"
                                                className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>

                                    {/* ADDRESS */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            العنوان
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute right-3 top-4 w-5 h-5 text-gray-400" />
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="اكتب العنوان بالتفصيل"
                                                rows={4}
                                                className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ==================================== PAYMENT SUMMARY ==================================== */}
                    <div>
                        <div className="bg-white rounded-2xl border -sm p-6 lg:sticky lg:top-5">
                            <h2 className="text-lg font-bold text-gray-800 mb-5">
                                ملخص الطلب
                            </h2>

                            <div className="space-y-4">
                                {/* INVENTION */}
                                <div>
                                    <p className="text-sm text-gray-500">براءة الاختراع</p>
                                    <p className="font-semibold text-gray-800 mt-1">
                                        {invention?.title}
                                    </p>
                                </div>

                                {/* TYPE */}
                                <div className="flex justify-between gap-3">
                                    <span className="text-gray-500">نوع الترخيص</span>
                                    <span className="font-semibold text-gray-800">
                                        {pricingOption?.type}
                                    </span>
                                </div>

                                {/* DURATION */}
                                {pricingOption?.durationYears && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">المدة</span>
                                        <span className="font-semibold text-gray-800">
                                            {pricingOption.durationYears} سنة
                                        </span>
                                    </div>
                                )}

                                {/* FINAL PRICE */}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">السعر النهائي</span>
                                    <span className="font-semibold text-gray-800">
                                        {Number(pricingOption?.price || 0).toLocaleString("ar-EG")}{" "}
                                        جنيه
                                    </span>
                                </div>

                                {/* DEPOSIT */}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-800">العربون</span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {Number(
                                                pricingOption?.depositAmount || 0
                                            ).toLocaleString("ar-EG")}{" "}
                                            جنيه
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* SECURITY */}
                            <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-4">
                                <div className="flex gap-2">
                                    <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                                    <p className="text-xs text-green-800 leading-5">
                                        سيتم دفع العربون فقط الآن، وسيتم حفظ السعر النهائي للترخيص في
                                        طلبك.
                                        في حالة محاولة استرداد المبلغ يتم استرجاع ثلثي المبلغ.
                                    </p>
                                </div>
                            </div>

                            {/* ================================= BUTTONS ================================== */}
                            {!showForm ? (
                                <button
                                    onClick={() => {
                                        setError("");
                                        setShowForm(true);
                                    }}
                                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    متابعة إلى بيانات العميل
                                    <ArrowRight className="w-5 h-5 rtl:rotate-180" />
                                </button>
                            ) : (
                                <button
                                    onClick={handlePayment}
                                    disabled={paymentLoading || !pricingOption}
                                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {paymentLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            جاري تجهيز الدفع...
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            دفع العربون
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventionDepositPayment;