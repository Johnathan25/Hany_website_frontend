import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import {
    Receipt,
    Search,
    Filter,
    Eye,
    Loader2,
    AlertCircle,
    X,
    CreditCard,
    User,
    Phone,
    Mail,
    Calendar,
    Clock,
    ChevronRight,
    ChevronLeft,
    ExternalLink,
    RefreshCw,
    FileCheck2,
    ShieldAlert,
} from "lucide-react";

// مكون شارة الحالة
const StatusBadge = ({ status }) => {
    const statusMap = {
        pending: { label: "قيد الانتظار", color: "bg-amber-50 text-amber-700 border-amber-200" },
        processing: { label: "جاري المعالجة", color: "bg-blue-50 text-blue-700 border-blue-200" },
        paid: { label: "مدفوع", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        failed: { label: "فشل الدفع", color: "bg-rose-50 text-rose-700 border-rose-200" },
        refunded: { label: "مسترجع", color: "bg-purple-50 text-purple-700 border-purple-200" },
        cancelled: { label: "ملغي", color: "bg-slate-100 text-slate-700 border-slate-200" },
    };

    const current = statusMap[status] || {
        label: status || "غير محدد",
        color: "bg-slate-50 text-slate-700 border-slate-200",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${current.color}`}>
            {current.label}
        </span>
    );
};

export default function InventionsInvoicesRecords() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // الفلاتر والصفحات
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    // تفاصيل المعاملة المحددة (المودال)
    const [selectedPayment, setSelectedPayment] = useState(null);

    // جلب السجلات من الباك إند
    const fetchPayments = useCallback(
        async (targetPage = page, searchTerm = search, statusTerm = statusFilter) => {
            setLoading(true);
            setError("");
            try {
                const params = {
                    page: targetPage,
                    limit: 10,
                    search: searchTerm.trim() || undefined,
                    status: statusTerm || undefined,
                };

                // مسار الباك إند مع معالجة البادئات المحتملة
                let res;
                try {
                    res = await api.get("/invoiceTypePayments", { params });
                } catch (err1) {
                    if (err1.response?.status === 404) {
                        res = await api.get("/api/invoiceTypePayments", { params });
                    } else {
                        throw err1;
                    }
                }

                const data = res.data?.data || res.data?.payments || res.data || [];
                setPayments(Array.isArray(data) ? data : []);

                if (res.data?.pagination) {
                    setPagination(res.data.pagination);
                    setPage(res.data.pagination.currentPage);
                }
            } catch (err) {
                console.error("fetchPayments error:", err);
                setError(err.response?.data?.message || "تعذر جلب سجل فواتير براءات الاختراع");
            } finally {
                setLoading(false);
            }
        },
        [page, search, statusFilter]
    );

    // تحديث تلقائي مع البحث والفلترة
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPayments(1, search, statusFilter);
        }, 350);

        return () => clearTimeout(timer);
    }, [search, statusFilter]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "---";
        return new Date(dateStr).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div dir="rtl" className="space-y-6">
            {/* رأس الصفحة */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            سجل فواتير ومعاملات براءات الاختراع
                        </h1>
                        <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                            Kashier Invoices
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        متابعة دقيقة لعمليات السداد الإلكتروني، فواتير التراخيص، وبيانات الجلسات البنكية.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fetchPayments(page, search, statusFilter)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold -xs transition-colors cursor-pointer self-start sm:self-auto"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    <span>تحديث السجل</span>
                </button>
            </div>

            {/* شريط البحث والفلترة */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 -xs grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-8 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="بحث برقم الفاتورة، اسم العميل، الهاتف، أو المعرف..."
                        className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                <div className="sm:col-span-4 relative">
                    <Filter className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">جميع الحالات</option>
                        <option value="paid">مدفوع (Paid)</option>
                        <option value="pending">قيد الانتظار (Pending)</option>
                        <option value="processing">جاري المعالجة (Processing)</option>
                        <option value="failed">فشل الدفع (Failed)</option>
                        <option value="refunded">مسترجع (Refunded)</option>
                        <option value="cancelled">ملغي (Cancelled)</option>
                    </select>
                </div>
            </div>

            {/* جدول السجلات */}
            <div className="bg-white rounded-2xl border border-slate-200 -xs overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <span className="text-xs">جاري تحميل سجل الفواتير...</span>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center space-y-3">
                        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                        <p className="text-xs text-rose-600 font-semibold">{error}</p>
                        <button
                            type="button"
                            onClick={() => fetchPayments(1)}
                            className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium"
                        >
                            إعادة المحاولة
                        </button>
                    </div>
                ) : payments.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 space-y-2">
                        <Receipt className="w-10 h-10 mx-auto text-slate-300" />
                        <p className="text-xs font-semibold text-slate-600">لا توجد فواتير مسجلة</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs">
                            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                                <tr>
                                    <th className="py-3 px-4">رقم الفاتورة</th>
                                    <th className="py-3 px-4">العميل</th>
                                    <th className="py-3 px-4">المبلغ</th>
                                    <th className="py-3 px-4">نوع الدفعة</th>
                                    <th className="py-3 px-4">الحالة</th>
                                    <th className="py-3 px-4">التاريخ</th>
                                    <th className="py-3 px-4 text-center">التفاصيل</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {payments.map((p) => (
                                    <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                                        {/* Invoice Number */}
                                        <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                                            {p.invoiceNumber || p.reference || `#${p._id?.slice(-6)?.toUpperCase()}`}
                                        </td>

                                        {/* Customer */}
                                        <td className="py-3.5 px-4">
                                            <div className="font-bold text-slate-900">{p.name || "عميل غير محدد"}</div>
                                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                                                {p.phone || p.email || "---"}
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="py-3.5 px-4">
                                            <span className="font-mono font-black text-slate-900 text-sm">
                                                {Number(p.amount || 0).toLocaleString()}
                                            </span>{" "}
                                            <span className="text-[10px] text-slate-500">{p.currency || "EGP"}</span>
                                        </td>

                                        {/* Payment Type */}
                                        <td className="py-3.5 px-4">
                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                                                {p.paymentType === "deposit" ? "عربون مقدم" : "سداد كامل"}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="py-3.5 px-4">
                                            <StatusBadge status={p.status} />
                                        </td>

                                        {/* Date */}
                                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                                            {formatDate(p.createdAt)}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3.5 px-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedPayment(p)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>فحص</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* الترقيم (Pagination) */}
                {!loading && pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50/50">
                        <div>
                            صفحة <span className="font-bold text-slate-900">{pagination.currentPage}</span> من{" "}
                            <span className="font-bold text-slate-900">{pagination.totalPages}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={!pagination.hasPreviousPage}
                                onClick={() => fetchPayments(pagination.currentPage - 1)}
                                className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                disabled={!pagination.hasNextPage}
                                onClick={() => fetchPayments(pagination.currentPage + 1)}
                                className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ========================================================= */}
            {/* نافذة فحص وتفاصيل الفاتورة الإلكترونية                     */}
            {/* ========================================================= */}
            {selectedPayment && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden -2xl border border-slate-100 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        {/* رأس المودال */}
                        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                    <Receipt className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">
                                        فاتورة: {selectedPayment.invoiceNumber || selectedPayment.reference}
                                    </h3>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        ID: {selectedPayment._id}
                                    </span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedPayment(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* محتوى المودال */}
                        <div className="p-6 space-y-5 overflow-y-auto">
                            {/* شريط الحالة والتواريخ */}
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500 font-semibold">حالة الفاتورة:</span>
                                    <StatusBadge status={selectedPayment.status} />
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{formatDate(selectedPayment.createdAt)}</span>
                                </div>
                            </div>

                            {/* المبالغ */}
                            <div className="grid grid-cols-2 gap-3 p-4 bg-blue-50/60 border border-blue-100 rounded-2xl">
                                <div>
                                    <span className="block text-[10px] text-blue-600 font-medium">المبلغ المطلوب</span>
                                    <span className="text-lg font-black font-mono text-blue-700">
                                        {Number(selectedPayment.amount).toLocaleString()} {selectedPayment.currency}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] text-slate-500 font-medium">نوع السداد</span>
                                    <span className="text-xs font-bold text-slate-800 block mt-1">
                                        {selectedPayment.paymentType === "deposit" ? "عربون مقدم" : "سداد كامل"}
                                    </span>
                                </div>
                            </div>

                            {/* بيانات العميل */}
                            <div className="space-y-2">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                                    بيانات العميل
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                                    <div>
                                        <span className="block text-slate-400 text-[10px]">الاسم</span>
                                        <span className="font-bold text-slate-800">{selectedPayment.name || "---"}</span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-400 text-[10px]">رقم الهاتف</span>
                                        <span className="font-mono font-semibold text-slate-800">{selectedPayment.phone || "---"}</span>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <span className="block text-slate-400 text-[10px]">البريد الإلكتروني</span>
                                        <span className="font-mono text-slate-800">{selectedPayment.email || "---"}</span>
                                    </div>
                                </div>
                            </div>

                            {/* تفاصيل الجلسة وبوابة كاشير */}
                            <div className="space-y-2">
                                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                                    بيانات بوابة الدفع (Kashier Gateway)
                                </span>
                                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 font-mono">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Transaction ID:</span>
                                        <span className="font-bold text-slate-800">{selectedPayment.transactionId || "---"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Session ID:</span>
                                        <span className="text-slate-700 truncate max-w-[200px]">{selectedPayment.sessionId || "---"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Payment Link ID:</span>
                                        <span className="text-slate-700">{selectedPayment.paymentLinkId || "---"}</span>
                                    </div>
                                    {selectedPayment.paidAt && (
                                        <div className="flex justify-between text-emerald-600 font-bold pt-1 border-t border-slate-200">
                                            <span>تاريخ السداد:</span>
                                            <span>{formatDate(selectedPayment.paidAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ذيل المودال */}
                        <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50">
                            <button
                                type="button"
                                onClick={() => setSelectedPayment(null)}
                                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                            >
                                إغلاق النافذة
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}