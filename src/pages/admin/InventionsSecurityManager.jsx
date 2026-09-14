import React, { useEffect, useState, useCallback } from "react";
import api from "../../services/api";
import {
  Search,
  Filter,
  Eye,
  Loader2,
  AlertTriangle,
  FileText,
  User,
  Phone,
  Mail,
  X,
  MapPin,
  Clock,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Coins,
  RefreshCw,
  Award,
} from "lucide-react";

// Status Badge Component مطابق للـ enum في الموديل
const StatusBadge = ({ status }) => {
  const statusMap = {
    pending_payment: { text: "غير مدفوع", color: "bg-red-50 text-red-700 border-red-200" },
    paid: { text: "مدفوع", color: "bg-blue-50 text-blue-700 border-blue-200" },
    under_review: { text: "قيد المراجعة", color: "bg-purple-50 text-purple-700 border-purple-200" },
    approved: { text: "تمت الموافقة", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    rejected: { text: "مرفوض", color: "bg-rose-50 text-rose-700 border-rose-200" },
    completed: { text: "مكتمل", color: "bg-teal-50 text-teal-700 border-teal-200" },
    cancelled: { text: "ملغي", color: "bg-slate-100 text-slate-700 border-slate-200" },
  };

  const current = statusMap[status] || {
    text: status || "غير محدد",
    color: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${current.color}`}>
      {current.text}
    </span>
  );
};

// ترجمة وتنسيق اسم خطة التسعير إلى اللغة العربية
const renderPricingOptionName = (name) => {
  if (!name) return "الخطة القياسية";

  const cleanName = String(name).trim().toLowerCase();

  const pricingMap = {
    standard: "الخطة القياسية",
    basic: "الخطة الأساسية",
    premium: "الخطة المميزة",
    pro: "الخطة الاحترافية",
    professional: "الخطة الاحترافية",
    enterprise: "خطة الشركات والمؤسسات",
    custom: "خطة مخصصة",
    exclusive: "الخطة الحصرية",
    license: "خطة الترخيص",
    "full purchase": "خطة الشراء الكامل",
    full_purchase: "خطة الشراء الكامل",
    commercial: "الخطة التجارية",
  };

  return pricingMap[cleanName] || name;
};

// ترجمة وتنسيق نوع الاستحواذ
const renderAcquisitionLabel = (type, duration) => {
  const typeMap = {
    full_purchase: { label: "شراء كامل ونقل ملكية", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    exclusive_license: { label: "ترخيص حصري", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
    license: { label: "ترخيص عادي", color: "text-blue-700 bg-blue-50 border-blue-200" },
    custom: { label: "اتفاق مخصص", color: "text-purple-700 bg-purple-50 border-purple-200" },
  };

  const current = typeMap[type] || { label: type || "غير محدد", color: "text-slate-700 bg-slate-100 border-slate-200" };

  return (
    <div className="flex flex-col gap-1 items-start">
      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${current.color}`}>
        {current.label}
      </span>
      {type === "full_purchase" ? (
        <span className="text-[10px] text-slate-400 font-medium">مدى الحياة</span>
      ) : duration ? (
        <span className="text-[10px] text-slate-500 font-bold">
          المدة: {duration} {duration === 1 ? "سنة" : duration === 2 ? "سنتين" : duration <= 10 ? "سنوات" : "سنة"}
        </span>
      ) : (
        <span className="text-[10px] text-slate-400">مدة مفتوحة / غير محددة</span>
      )}
    </div>
  );
};

// دالة استخراج البيانات المالية
const extractFinancials = (item) => {
  if (!item) return { total: 0, deposit: 0, currency: "الجنيه المصري" };

  const total = Number(item.finalPrice ?? item.totalPrice ?? item.price ?? 0) || 0;
  let deposit = Number(item.depositAmount ?? item.deposit ?? 0) || 0;

  if (item.status === "paid" && deposit === 0 && total > 0) {
    deposit = total;
  }

  const currency = item.currency || "الجنيه المصري";

  return { total, deposit, currency };
};

export default function InventionsSecurityManager() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & Filter States
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Modal State for Single Request (Full Inspection)
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // Modal State for Quick Invention Description (Eye Icon)
  const [selectedInventionDesc, setSelectedInventionDesc] = useState(null);

  // Fetch Requests List
  const fetchRequests = useCallback(async (targetPage = page, searchTerm = search, statusTerm = status) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: targetPage,
        limit,
        search: searchTerm.trim() || undefined,
        status: statusTerm || undefined,
      };

      let res;
      try {
        res = await api.get("/inventionRequest", { params });
      } catch (err1) {
        if (err1.response?.status === 404) {
          res = await api.get("/api/inventionRequest", { params });
        } else {
          throw err1;
        }
      }

      setRequests(res.data?.data || []);
      if (res.data?.pagination) {
        setPagination(res.data.pagination);
        setPage(res.data.pagination.currentPage);
      }
    } catch (err) {
      console.error("fetchRequests error:", err);
      setError(err.response?.data?.message || "تعذر جلب سجل طلبات براءات الاختراع");
    } finally {
      setLoading(false);
    }
  }, [limit, page, search, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests(1, search, status);
    }, 350);

    return () => clearTimeout(timer);
  }, [search, status]);

  // Fetch Single Request by ID
  const handleOpenDetails = async (id) => {
    setSelectedRequestId(id);
    setModalLoading(true);
    setModalError(null);
    setSelectedRequest(null);

    try {
      let res;
      try {
        res = await api.get(`/inventionRequest/${id}`);
      } catch (err1) {
        if (err1.response?.status === 404) {
          res = await api.get(`/api/inventionRequest/${id}`);
        } else {
          throw err1;
        }
      }

      setSelectedRequest(res.data?.request || res.data?.data || null);
    } catch (err) {
      console.error("getInventionRequestById error:", err);
      setModalError(err.response?.data?.message || "تعذر تحميل تفاصيل الطلب");
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedRequestId(null);
    setSelectedRequest(null);
    setModalError(null);
  };

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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              سجل طلبات براءات الاختراع
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            متابعة فورية وميدانية لكافة طلبات التراخيص، شروط الاستحواذ، وحجوزات براءات الاختراع الصادرة
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchRequests(page, search, status)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>تحديث السجل</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث برقم الطلب، اسم العميل، الهاتف، البريد الإلكتروني، خطة التسعير..."
            className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <div className="sm:col-span-4 relative">
          <Filter className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
          >
            <option value="">جميع الحالات</option>
            <option value="pending_payment">غير مدفوع (Pending Payment)</option>
            <option value="paid">مدفوع (Paid)</option>
            <option value="under_review">قيد المراجعة (Under Review)</option>
            <option value="approved">تمت الموافقة (Approved)</option>
            <option value="rejected">مرفوض (Rejected)</option>
            <option value="completed">مكتمل (Completed)</option>
            <option value="cancelled">ملغي (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs">جاري تحميل سجل الطلبات من الخادم...</span>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
            <p className="text-xs text-rose-600 font-semibold">{error}</p>
            <button
              type="button"
              onClick={() => fetchRequests(1)}
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-slate-400 space-y-2">
            <FileText className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">لا توجد طلبات تطابق معايير البحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-semibold">
                <tr>
                  <th className="py-3 px-4">رقم الطلب</th>
                  <th className="py-3 px-4">العميل</th>
                  <th className="py-3 px-4">براءة الاختراع</th>
                  <th className="py-3 px-4">نوع ومدة الترخيص</th>
                  <th className="py-3 px-4">السعر الكلي</th>
                  <th className="py-3 px-4">العربون المسدد</th>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((item) => {
                  const { total, deposit, currency } = extractFinancials(item);

                  const descriptionText =
                    item.invention?.shortDescription ||
                    item.invention?.description ||
                    item.invention?.details ||
                    item.shortDescription ||
                    item.description;

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 whitespace-nowrap">
                        {item.orderNumber || `#${item._id.slice(-6).toUpperCase()}`}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          {item.customerName || item.customer?.username || item.customer?.name || "غير محدد"}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {item.phone || item.customer?.phone || "---"}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
  <div className="flex items-center gap-1.5">
    {/* اسم البراءة */}
    <span className="font-semibold text-slate-800 line-clamp-1 max-w-[150px]">
      {item.invention?.title || item.title || "براءة غير متوفرة"}
    </span>

    {/* رمز العين يظهر دائماً إذا كان للبراءة أي وصف أو تفاصيل */}
    {(item.invention?.shortDescription ||
      item.invention?.description ||
      item.invention?.details ||
      item.shortDescription ||
      item.description) && (
      <button
        type="button"
        onClick={() =>
          setSelectedInventionDesc({
            title: item.invention?.title || item.title || "براءة الاختراع",
            desc:
              item.invention?.shortDescription ||
              item.invention?.description ||
              item.invention?.details ||
              item.shortDescription ||
              item.description,
            orderNumber: item.orderNumber,
          })
        }
        className="p-1 rounded-md text-blue-600 hover:text-white hover:bg-blue-600 bg-blue-50 transition-colors cursor-pointer shrink-0"
        title="عرض وصف وتفاصيل براءة الاختراع"
      >
        <Eye className="w-3.5 h-3.5" />
      </button>
    )}
  </div>


</td>

                      {/* خانة نوع الترخيص ومدته */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderAcquisitionLabel(item.acquisitionType, item.licenseDurationYears)}
                      </td>

                      {/* السعر الكلي من finalPrice */}
                      <td className="py-3.5 px-4 font-mono font-black text-slate-900 text-sm whitespace-nowrap">
                        {total > 0 ? (
                          <>
                            {Number(total).toLocaleString()}{" "}
                            <span className="text-[10px] text-slate-500 font-sans font-normal">{currency}</span>
                          </>
                        ) : (
                          <span className="text-slate-400 font-sans font-normal text-xs">غير محدد</span>
                        )}
                      </td>

                      {/* العربون من depositAmount */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {deposit > 0 && deposit < total ? (
                          <div>
                            <span className="font-mono font-bold text-sm">
                              {Number(deposit).toLocaleString()}
                            </span>{" "}
                            <span className="text-[10px]">{currency}</span>
                          </div>
                        ) : item.status === "paid" || (total > 0 && deposit >= total) ? (
                          <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] rounded-md border border-emerald-200 font-semibold">
                            مسدد بالكامل
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">لم يسدد بعد</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetails(item._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>فحص</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50/50">
            <div>
              عرض صفحة <span className="font-bold text-slate-900">{pagination.currentPage}</span> من{" "}
              <span className="font-bold text-slate-900">{pagination.totalPages}</span> (إجمالي{" "}
              {pagination.totalItems} طلب)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={!pagination.hasPreviousPage}
                onClick={() => fetchRequests(pagination.currentPage - 1)}
                className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => fetchRequests(pagination.currentPage + 1)}
                className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* نافذة منبثقة سريعة لعرض وصف البراءة عند النقر على العين      */}
      {/* ========================================================= */}
      {selectedInventionDesc && (
  <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
      
      {/* رأس النافذة */}
      <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2 text-blue-600">
          <div className="p-2 bg-blue-100/70 rounded-xl">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              وصف وتفاصيل براءة الاختراع
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              #{selectedInventionDesc.orderNumber} - {selectedInventionDesc.title}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSelectedInventionDesc(null)}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* محتوى الوصف */}
      <div className="p-6">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-60 overflow-y-auto whitespace-pre-wrap">
          {selectedInventionDesc.desc}
        </div>
      </div>

      {/* زر الإغلاق */}
      <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50">
        <button
          type="button"
          onClick={() => setSelectedInventionDesc(null)}
          className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
        >
          إغلاق
        </button>
      </div>

    </div>
  </div>
)}

      {/* ========================================================= */}
      {/* Inspection Modal: Single Request Details                 */}
      {/* ========================================================= */}
      {selectedRequestId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    تفاصيل طلب براءة الاختراع: {selectedRequest?.orderNumber || ""}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ID: {selectedRequestId}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {modalLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3 text-blue-600">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs text-slate-500">جاري جلب تفاصيل المعاملة كاملة...</span>
                </div>
              ) : modalError ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs text-center">
                  {modalError}
                </div>
              ) : selectedRequest ? (() => {
                const { total, deposit, currency } = extractFinancials(selectedRequest);
                const remaining = Math.max(0, total - deposit);

                return (
                  <>
                    {/* Status Bar */}
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-semibold">حالة الطلب:</span>
                        <StatusBadge status={selectedRequest.status} />
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(selectedRequest.createdAt)}</span>
                      </div>
                    </div>

                    {/* تفاصيل الترخيص وشروط التعاقد */}
                    <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl space-y-3">
                      

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-white border border-blue-100 rounded-xl">
                          <span className="block text-[10px] text-slate-400 mb-0.5">نوع الاستحواذ</span>
                          <span className="font-bold text-slate-900">
                            {selectedRequest.acquisitionType === "full_purchase"
                              ? "شراء كامل ونقل ملكية"
                              : selectedRequest.acquisitionType === "exclusive_license"
                              ? "ترخيص حصري"
                              : selectedRequest.acquisitionType === "license"
                              ? "ترخيص عادي"
                              : "اتفاق مخصص"}
                          </span>
                        </div>

                        <div className="p-3 bg-white border border-blue-100 rounded-xl">
                          <span className="block text-[10px] text-slate-400 mb-0.5">مدة الترخيص</span>
                          <span className="font-bold text-blue-700 font-mono">
                            {selectedRequest.acquisitionType === "full_purchase"
                              ? "دائم (مدى الحياة)"
                              : selectedRequest.licenseDurationYears
                              ? `${selectedRequest.licenseDurationYears} ${
                                  selectedRequest.licenseDurationYears === 1
                                    ? "سنة"
                                    : selectedRequest.licenseDurationYears === 2
                                    ? "سنتين"
                                    : selectedRequest.licenseDurationYears <= 10
                                    ? "سنوات"
                                    : "سنة"
                                }`
                              : "غير محدد"}
                          </span>
                        </div>

                        <div className="p-3 bg-white border border-blue-100 rounded-xl">
                          <span className="block text-[10px] text-slate-400 mb-0.5">خطة التسعير</span>
                          <span className="font-bold text-slate-900">
                            {renderPricingOptionName(selectedRequest.pricingOptionName)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* المبالغ المالية (السعر الكلي، العربون، المتبقي) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="p-3 bg-white border border-slate-100 rounded-xl">
                        <span className="block text-[11px] text-slate-500 font-semibold">السعر الكلي (Final Price)</span>
                        <span className="text-base font-black font-mono text-slate-900 mt-1 block">
                          {total > 0 ? Number(total).toLocaleString() : "غير محدد"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{currency}</span>
                      </div>

                      <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
                        <span className="block text-[11px] text-amber-800 font-semibold">
                          العربون المطلوب/المسدد
                        </span>
                        <span className="text-base font-black font-mono text-amber-900 mt-1 block">
                          {deposit > 0 ? Number(deposit).toLocaleString() : "0"}
                        </span>
                        <span className="text-[10px] text-amber-700 font-medium">{currency}</span>
                      </div>

                      <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                        <span className="block text-[11px] text-blue-800 font-semibold">المبلغ المتبقي</span>
                        <span className="text-base font-black font-mono text-blue-900 mt-1 block">
                          {total > 0 ? Number(remaining).toLocaleString() : "0"}
                        </span>
                        <span className="text-[10px] text-blue-700 font-medium">{currency}</span>
                      </div>
                    </div>

                    {/* Customer Data */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>بيانات مقدم الطلب</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                        <div>
                          <span className="block text-[10px] text-slate-400 mb-0.5">الاسم الكامل</span>
                          <span className="font-bold text-slate-900">
                            {selectedRequest.customerName || selectedRequest.customer?.username || selectedRequest.customer?.name || "---"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 mb-0.5">رقم الهاتف</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {selectedRequest.phone || selectedRequest.customer?.phone || "---"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 mb-0.5">البريد الإلكتروني</span>
                          <span className="font-mono text-slate-800">
                            {selectedRequest.email || selectedRequest.customer?.email || "---"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 mb-0.5">العنوان المقيد</span>
                          <span className="text-slate-800">
                            {selectedRequest.address || "---"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Invention Data */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-blue-600" />
                        <span>تفاصيل براءة الاختراع المعتمدة</span>
                      </h4>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                        <div>
                          <span className="block text-[10px] text-slate-400 mb-0.5">اسم البراءة</span>
                          <h5 className="font-bold text-slate-900 text-sm">
                            {selectedRequest.invention?.title || selectedRequest.title || "غير متاح"}
                          </h5>
                        </div>

                        {(selectedRequest.invention?.shortDescription || selectedRequest.shortDescription) && (
                          <div>
                            <span className="block text-[10px] text-slate-400 mb-0.5">الوصف المختصر</span>
                            <p className="text-slate-600 leading-relaxed">
                              {selectedRequest.invention?.shortDescription || selectedRequest.shortDescription}
                            </p>
                          </div>
                        )}

                        {selectedRequest.adminNotes && (
                          <div className="pt-2 border-t border-slate-200">
                            <span className="block text-[10px] text-amber-700 font-bold mb-0.5">ملاحظات الإدارة</span>
                            <p className="text-slate-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200 leading-relaxed">
                              {selectedRequest.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* الوصف الفني الكامل لبراءة الاختراع في أسفل النافذة */}
{(selectedRequest.invention?.description || selectedRequest.description) && (
  <div className="space-y-2 pt-2 border-t border-slate-100">
    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
      <FileText className="w-3.5 h-3.5 text-blue-600" />
      <span>الوصف الفني الكامل</span>
    </h4>
    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-line">
      {selectedRequest.invention?.description || selectedRequest.description}
    </div>
  </div>
)}
                  </>
                );
              })() : null}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
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