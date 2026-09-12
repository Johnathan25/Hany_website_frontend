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
} from "lucide-react";

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: { text: "قيد الانتظار", color: "bg-amber-50 text-amber-700 border-amber-200" },
    approved: { text: "تمت الموافقة", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    rejected: { text: "مرفوض", color: "bg-rose-50 text-rose-700 border-rose-200" },
    paid: { text: "مدفوع", color: "bg-blue-50 text-blue-700 border-blue-200" },
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

  // Modal State for Single Request
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);

  // =========================================================
  // 1. Fetch Requests List (with automated prefix fallback)
  // =========================================================
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
        // First try the route matching your Payment POST endpoint
        res = await api.get("/inventionRequest", { params });
      } catch (err1) {
        if (err1.response?.status === 404) {
          try {
            res = await api.get("/inventionRequest", { params });
          } catch (err2) {
            if (err2.response?.status === 404) {
              res = await api.get("/inventionRequest", { params });
            } else {
              throw err2;
            }
          }
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

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRequests(1, search, status);
    }, 350);

    return () => clearTimeout(timer);
  }, [search, status]);

  // =========================================================
  // 2. Fetch Single Request by ID (with fallback)
  // =========================================================
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
          try {
            res = await api.get(`/inventionRequest/${id}`);
          } catch (err2) {
            if (err2.response?.status === 404) {
              res = await api.get(`/inventionRequest/${id}`);
            } else {
              throw err2;
            }
          }
        } else {
          throw err1;
        }
      }

      setSelectedRequest(res.data?.request || null);
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
            <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              قسم المراقبة والأمن
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            متابعة فورية وميدانية لكافة طلبات التراخيص وحجوزات براءات الاختراع الصادرة
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
            placeholder="بحث برقم الطلب، اسم العميل، الهاتف، البريد الإلكتروني..."
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
            <option value="pending">قيد الانتظار (Pending)</option>
            <option value="approved">تمت الموافقة (Approved)</option>
            <option value="rejected">مرفوض (Rejected)</option>
            <option value="paid">مدفوع (Paid)</option>
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
              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium"
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
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {item.orderNumber || `#${item._id.slice(-6).toUpperCase()}`}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">
                        {item.customerName || item.customer?.username || "غير محدد"}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {item.phone || item.customer?.phone || "---"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
                        {item.invention?.title || "براءة غير متوفرة"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="py-3.5 px-4 text-center">
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
                ))}
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
      {/* Inspection Modal: Single Request Details                  */}
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
              ) : selectedRequest ? (
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
                          {selectedRequest.customerName || selectedRequest.customer?.username || "---"}
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
                          {selectedRequest.invention?.title || "غير متاح"}
                        </h5>
                      </div>

                      {selectedRequest.invention?.shortDescription && (
                        <div>
                          <span className="block text-[10px] text-slate-400 mb-0.5">الوصف المختصر</span>
                          <p className="text-slate-600 leading-relaxed">
                            {selectedRequest.invention.shortDescription}
                          </p>
                        </div>
                      )}

                      {selectedRequest.invention?.details && (
                        <div className="pt-2 border-t border-slate-200">
                          <span className="block text-[10px] text-slate-400 mb-0.5">الشروط والمواصفات الفنية</span>
                          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                            {selectedRequest.invention.details}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : null}
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