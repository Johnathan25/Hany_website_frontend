import React, { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import {
    Wrench,
    Award,
    Layers,
    Calendar,
    Clock,
    Eye,
    Loader2,
    AlertCircle,
    FileText,
    X,
    CreditCard,
    Phone,
    MapPin,
    ChevronRight,
    ChevronLeft,
    RefreshCw,
    Coins,
} from "lucide-react";

// Status Badge Component
const StatusBadge = ({ status, isAr }) => {
    const statusMap = {
        pending: { textAr: "قيد الانتظار", textEn: "Pending", color: "bg-amber-50 text-amber-700 border-amber-200" },
        processing: { textAr: "جاري المعالجة", textEn: "Processing", color: "bg-blue-50 text-blue-700 border-blue-200" },
        approved: { textAr: "تمت الموافقة", textEn: "Approved", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        paid: { textAr: "مدفوع", textEn: "Paid", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        unpaid: { textAr: "غير مدفوع", textEn: "Unpaid", color: "bg-rose-50 text-rose-700 border-rose-200" },
        rejected: { textAr: "مرفوض", textEn: "Rejected", color: "bg-rose-50 text-rose-700 border-rose-200" },
    };

    const current = statusMap[status] || {
        textAr: status || "غير محدد",
        textEn: status || "N/A",
        color: "bg-slate-50 text-slate-700 border-slate-200",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${current.color}`}>
            {isAr ? current.textAr : current.textEn}
        </span>
    );
};

export default function MyOrders() {
    const { isAr } = useLanguage();

    // Active Tab: 'services' | 'inventions'
    const [activeTab, setActiveTab] = useState("services");

    // Services State
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [servicesPage, setServicesPage] = useState(1);
    const [servicesPagination, setServicesPagination] = useState({ currentPage: 1, totalPages: 1 });

    // Inventions State
    const [inventions, setInventions] = useState([]);
    const [inventionsLoading, setInventionsLoading] = useState(true);
    const [inventionsPage, setInventionsPage] = useState(1);
    const [inventionsPagination, setInventionsPagination] = useState({ currentPage: 1, totalPages: 1 });

    // Modal State for Invention Details
    const [selectedInventionRequest, setSelectedInventionRequest] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    const [error, setError] = useState("");

    // ==========================================
    // 1. Fetch Customer Services (getCustomerServiceRequests)
    // ==========================================
    const fetchServices = useCallback(async (page = 1) => {
        setServicesLoading(true);
        setError("");
        try {
            let res;
            try {
                res = await api.get("/serviceRequests/customer", { params: { page, limit: 10 } });
            } catch (err1) {
                if (err1.response?.status === 404) {
                    res = await api.get("/serviceRequests/my-requests", { params: { page, limit: 10 } });
                } else {
                    throw err1;
                }
            }

            setServices(res.data?.data || []);
            if (res.data?.pagination) {
                setServicesPagination(res.data.pagination);
                setServicesPage(res.data.pagination.currentPage);
            }
        } catch (err) {
            console.error("fetchServices error:", err);
            setError(err.response?.data?.message || (isAr ? "تعذر تحميل طلبات الخدمات" : "Failed to load service requests"));
        } finally {
            setServicesLoading(false);
        }
    }, [isAr]);

    // ==========================================
    // 2. Fetch Customer Inventions (getMyInventionRequests)
    // ==========================================
    const fetchInventions = useCallback(async (page = 1) => {
        setInventionsLoading(true);
        setError("");
        try {
            let res;
            try {
                res = await api.get("/inventionRequest/my", { params: { page, limit: 10 } });
            } catch (err1) {
                if (err1.response?.status === 404) {
                    res = await api.get("/inventionRequest/my", { params: { page, limit: 10 } });
                } else {
                    throw err1;
                }
            }

            setInventions(res.data?.data || []);
            if (res.data?.pagination) {
                setInventionsPagination(res.data.pagination);
                setInventionsPage(res.data.pagination.currentPage);
            }
        } catch (err) {
            console.error("fetchInventions error:", err);
            setError(err.response?.data?.message || (isAr ? "تعذر تحميل طلبات براءات الاختراع" : "Failed to load patent requests"));
        } finally {
            setInventionsLoading(false);
        }
    }, [isAr]);

    useEffect(() => {
        fetchServices(1);
        fetchInventions(1);
    }, [fetchServices, fetchInventions]);

    // ==========================================
    // 3. Get Single Invention Details (getMyInventionRequestById)
    // ==========================================
    const handleOpenInventionDetails = async (id) => {
        setModalLoading(true);
        setSelectedInventionRequest(null);
        try {
            let res;
            try {
                res = await api.get(`/inventionRequest/my/${id}`);
            } catch (err1) {
                if (err1.response?.status === 404) {
                    res = await api.get(`/inventionRequest/my/${id}`);
                } else {
                    throw err1;
                }
            }
            setSelectedInventionRequest(res.data?.request || null);
        } catch (err) {
            alert(err.response?.data?.message || (isAr ? "تعذر تحميل تفاصيل البراءة" : "Failed to load details"));
        } finally {
            setModalLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "---";
        return new Date(dateStr).toLocaleDateString(isAr ? "ar-EG" : "en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatServiceType = (type) => {
        const types = {
            inspection: isAr ? "معاينة ميدانية" : "Inspection",
            consultation: isAr ? "استشارة هندسية" : "Consultation",
            maintenance: isAr ? "صيانة تشغيلية" : "Maintenance",
        };
        return types[type] || type;
    };

    return (
        <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {isAr ? "طلباتي وسجل معاملاتي" : "My Orders & Submissions"}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            {isAr
                                ? "متابعة حالة طلبات الخدمات الإنشائية وبراءات الاختراع والتراخيص المسجلة باسمك."
                                : "Track your engineering service requests and patented innovation licenses."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            if (activeTab === "services") fetchServices(servicesPage);
                            else fetchInventions(inventionsPage);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                    >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{isAr ? "تحديث" : "Refresh"}</span>
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab("services")}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "services"
                                ? "bg-slate-900 text-white shadow-xs"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                    >
                        <Wrench className="w-4 h-4" />
                        <span>{isAr ? "طلبات الخدمات الهندسية" : "Service Requests"}</span>
                        <span className="text-[10px] bg-slate-700 text-white px-2 py-0.5 rounded-full">
                            {services.length}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("inventions")}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === "inventions"
                                ? "bg-slate-900 text-white shadow-xs"
                                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                            }`}
                    >
                        <Award className="w-4 h-4" />
                        <span>{isAr ? "براءات الاختراع والتراخيص" : "Innovation Requests"}</span>
                        <span className="text-[10px] bg-slate-700 text-white px-2 py-0.5 rounded-full">
                            {inventions.length}
                        </span>
                    </button>
                </div>

                {error && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2 text-rose-700 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* ========================================================= */}
                {/* TAB 1: SERVICE REQUESTS                                   */}
                {/* ========================================================= */}
                {activeTab === "services" && (
                    <div className="space-y-4">
                        {servicesLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                <span className="text-xs">{isAr ? "جاري تحميل الخدمات..." : "Loading services..."}</span>
                            </div>
                        ) : services.length === 0 ? (
                            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
                                <Wrench className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <h3 className="text-sm font-semibold text-slate-700">
                                    {isAr ? "لا توجد طلبات خدمات سابقة" : "No service requests found"}
                                </h3>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {services.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            {/* Top Header */}
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                                    {item.orderNumber}
                                                </span>
                                                <StatusBadge status={item.status} isAr={isAr} />
                                            </div>

                                            {/* Service Item Name & Type */}
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                                                    {item.serviceItem?.name || (isAr ? "خدمة هندسية عامة" : "Engineering Service")}
                                                </h3>
                                                <span className="text-[11px] font-medium text-slate-500 block mt-0.5">
                                                    {formatServiceType(item.requestType)}
                                                </span>
                                            </div>

                                            {item.description && (
                                                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl line-clamp-2 leading-relaxed">
                                                    {item.description}
                                                </p>
                                            )}

                                            {/* Meta Info */}
                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{formatDate(item.createdAt)}</span>
                                                </div>
                                                {item.address && (
                                                    <div className="flex items-center gap-1 max-w-[160px] truncate">
                                                        <MapPin className="w-3.5 h-3.5" />
                                                        <span className="truncate">{item.address}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price Tag */}
                                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                                {isAr ? "التكلفة" : "Amount"}
                                            </span>
                                            <div className="text-sm font-black font-mono text-slate-900">
                                                {Number(item.price || 0).toLocaleString()}{" "}
                                                <span className="text-[10px] font-normal text-slate-500">
                                                    {item.currency || "EGP"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {!servicesLoading && servicesPagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                <button
                                    type="button"
                                    disabled={!servicesPagination.hasPrevPage}
                                    onClick={() => fetchServices(servicesPagination.currentPage - 1)}
                                    className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                                </button>
                                <span className="text-xs text-slate-600 px-3">
                                    {servicesPagination.currentPage} / {servicesPagination.totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={!servicesPagination.hasNextPage}
                                    onClick={() => fetchServices(servicesPagination.currentPage + 1)}
                                    className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ========================================================= */}
                {/* TAB 2: INVENTIONS & PATENTS                               */}
                {/* ========================================================= */}
                {activeTab === "inventions" && (
                    <div className="space-y-4">
                        {inventionsLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                <span className="text-xs">{isAr ? "جاري تحميل البراءات..." : "Loading innovations..."}</span>
                            </div>
                        ) : inventions.length === 0 ? (
                            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8">
                                <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                                <h3 className="text-sm font-semibold text-slate-700">
                                    {isAr ? "لا توجد طلبات براءات اختراع مسجلة" : "No patent requests found"}
                                </h3>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {inventions.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                                    {item.orderNumber || `#${item._id.slice(-6).toUpperCase()}`}
                                                </span>
                                                <StatusBadge status={item.status} isAr={isAr} />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                                                    {item.invention?.title || (isAr ? "براءة اختراع" : "Patented IP")}
                                                </h3>
                                                {item.invention?.shortDescription && (
                                                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                                        {item.invention.shortDescription}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span>{formatDate(item.createdAt)}</span>
                                                </div>
                                                {item.phone && (
                                                    <div className="flex items-center gap-1 font-mono">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        <span>{item.phone}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleOpenInventionDetails(item._id)}
                                            className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                        >
                                            <Eye className="w-3.5 h-3.5" />
                                            <span>{isAr ? "عرض المواصفات والترخيص" : "View Details"}</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {!inventionsLoading && inventionsPagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                <button
                                    type="button"
                                    disabled={!inventionsPagination.hasPreviousPage}
                                    onClick={() => fetchInventions(inventionsPagination.currentPage - 1)}
                                    className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                                </button>
                                <span className="text-xs text-slate-600 px-3">
                                    {inventionsPagination.currentPage} / {inventionsPagination.totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={!inventionsPagination.hasNextPage}
                                    onClick={() => fetchInventions(inventionsPagination.currentPage + 1)}
                                    className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ========================================================= */}
            {/* INVENTION DETAILS MODAL                                   */}
            {/* ========================================================= */}
            {selectedInventionRequest && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
                        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                            <h3 className="text-sm font-bold text-slate-900">
                                {isAr ? "تفاصيل براءة الاختراع والترخيص" : "Invention Request Details"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelectedInventionRequest(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 overflow-y-auto">
                            <div>
                                <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                    {isAr ? "اسم البراءة" : "Invention Title"}
                                </span>
                                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                                    {selectedInventionRequest.invention?.title}
                                </h2>
                            </div>

                            {selectedInventionRequest.invention?.description && (
                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                        {isAr ? "الوصف الفني" : "Technical Description"}
                                    </span>
                                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl whitespace-pre-line">
                                        {selectedInventionRequest.invention.description}
                                    </p>
                                </div>
                            )}

                            {selectedInventionRequest.invention?.details && (
                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                        {isAr ? "المواصفات وشروط التنفيذ" : "Execution Specifications"}
                                    </span>
                                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl whitespace-pre-line">
                                        {selectedInventionRequest.invention.details}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50">
                            <button
                                type="button"
                                onClick={() => setSelectedInventionRequest(null)}
                                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                            >
                                {isAr ? "إغلاق" : "Close"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}