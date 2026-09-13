import React, { useState } from "react";
import api from "../../services/api";
import {
    Receipt,
    CreditCard,
    User,
    Mail,
    Phone,
    DollarSign,
    FileText,
    Copy,
    Check,
    ExternalLink,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Layers,
} from "lucide-react";

export default function CreateInvoicePayment() {
    const [formData, setFormData] = useState({
        customer: "",
        payableType: "other",
        payableId: "",
        amount: "",
        paymentType: "full",
        description: "",
        name: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [createdInvoice, setCreatedInvoice] = useState(null);
    const [copied, setCopied] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCopyLink = () => {
        if (!createdInvoice?.paymentUrl) return;
        navigator.clipboard.writeText(createdInvoice.paymentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setCreatedInvoice(null);

        if (Number(formData.amount) <= 0) {
            setError("المبلغ يجب أن يكون أكبر من صفر");
            return;
        }

        if (formData.payableType !== "other" && !formData.payableId.trim()) {
            setError("معرف الطلب (payableId) مطلوب في حال اختيار نوع مرتبط بطلب");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                amount: Number(formData.amount),
                paymentType: formData.paymentType,
                payableType: formData.payableType,
                description: formData.description.trim(),
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                customer: formData.customer.trim() || undefined,
                payableId: formData.payableType === "other" ? undefined : formData.payableId.trim(),
            };

            // تجربة المسار المباشر أو المسبوق بـ /api
            let res;
            try {
                res = await api.post("/paymentLink", payload);
            } catch (err1) {
                if (err1.response?.status === 404) {
                    res = await api.post("/paymentLink", payload);
                } else {
                    throw err1;
                }
            }

            setCreatedInvoice(res.data?.data);
        } catch (err) {
            console.error("Create Invoice Error:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "حدث خطأ أثناء إنشاء الفاتورة ورابط الدفع"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleResetForm = () => {
        setCreatedInvoice(null);
        setFormData({
            customer: "",
            payableType: "other",
            payableId: "",
            amount: "",
            paymentType: "full",
            description: "",
            name: "",
            email: "",
            phone: "",
        });
    };

    return (
        <div dir="rtl" className="space-y-8 max-w-4xl mx-auto">
            {/* Header */}
            <div className="border-b border-slate-200 pb-5">
                <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                        <Receipt className="w-5 h-5" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">إنشاء فاتورة ورابط دفع</h1>
                </div>
                <p className="text-xs sm:text-sm text-slate-500">
                    توليد فواتير إلكترونية مباشرة للعملاء ومشاركتها عبر روابط كاشير (Kashier Payment Links).
                </p>
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Success Banner and Payment Link */}
            {createdInvoice && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-800">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <h3 className="font-bold text-sm">تم إصدار الفاتورة وتوليد رابط الدفع بنجاح!</h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-emerald-100 text-xs">
                        <div>
                            <span className="text-slate-400 block text-[10px]">رقم الفاتورة</span>
                            <span className="font-mono font-bold text-slate-800">{createdInvoice.invoiceNumber}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px]">المبلغ المطلوب</span>
                            <span className="font-bold text-emerald-600">
                                {Number(createdInvoice.amount).toLocaleString()} {createdInvoice.currency}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px]">نوع الدفع</span>
                            <span className="font-semibold text-slate-700">
                                {createdInvoice.paymentType === "deposit" ? "عربون" : "كامل"}
                            </span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px]">الحالة</span>
                            <span className="font-semibold text-amber-600">قيد الدفع (Pending)</span>
                        </div>
                    </div>

                    {/* Copy Link Input Area */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">رابط الدفع الخاص بالعميل:</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                readOnly
                                value={createdInvoice.paymentUrl || "لم يتم العثور على رابط"}
                                className="flex-1 px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-700 outline-none select-all"
                            />
                            <button
                                type="button"
                                onClick={handleCopyLink}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                <span>{copied ? "تم النسخ" : "نسخ الرابط"}</span>
                            </button>
                            {createdInvoice.paymentUrl && (
                                <a
                                    href={createdInvoice.paymentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
                                    title="فتح الرابط"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleResetForm}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                    >
                        إنشاء فاتورة جديدة أخرى
                    </button>
                </div>
            )}

            {/* Invoice Form */}
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 -xs">
                {/* Section 1: Customer Details */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-4 h-4 text-blue-600" />
                        <span>بيانات العميل المستلم</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                اسم العميل <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="اسم العميل الكامل"
                                    className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                البريد الإلكتروني <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="email"
                                    required
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="client@example.com"
                                    className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-mono"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                رقم الهاتف <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                    type="tel"
                                    required
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="010xxxxxxxx"
                                    className="w-full pr-9 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 font-mono"
                                />
                            </div>
                        </div>
                    </div>

                    
                </div>

                <hr className="border-slate-100" />

                {/* Section 2: Invoice & Pricing Specifications */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-blue-600" />
                        <span>تفاصيل الفاتورة والمبلغ</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                المبلغ (EGP) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                step="any"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                placeholder="1000"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono outline-none focus:bg-white focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                نوع الدفعة <span className="text-rose-500">*</span>
                            </label>
                            <select
                                name="paymentType"
                                value={formData.paymentType}
                                onChange={handleChange}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
                            >
                                <option value="full">دفع كامل (Full Payment)</option>
                                <option value="deposit">عربون مقدم (Deposit)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                نوع الخدمة التابعة <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value="أخرى / مخصصة (Other)"
                                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600 font-medium cursor-not-allowed outline-none select-none"
                                />
                                {/* إبقاء القيمة مخفية لضمان وصولها إذا كان النموذج يعتمد على اسم الحقل */}
                                <input type="hidden" name="payableType" value="other" />
                            </div>
                        </div>
                    </div>

                    {formData.payableType !== "other" && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                معرف الطلب المرتبط (Payable ID) <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                name="payableId"
                                value={formData.payableId}
                                onChange={handleChange}
                                placeholder="معرف الطلب في النظام (MongoDB _id)"
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:bg-white focus:border-blue-500"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                            وصف أو بيان الفاتورة (يظهر للعميل)
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="مثال: دفعة تشطيب ريسبشن، أو ترخيص استخدام براءة اختراع، إلخ..."
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none resize-none focus:bg-white focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-all -md -blue-500/20 cursor-pointer"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>جاري إنشاء الفاتورة في كاشير...</span>
                            </>
                        ) : (
                            <>
                                <CreditCard className="w-4 h-4" />
                                <span>إصدار الفاتورة وتوليد الرابط</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}