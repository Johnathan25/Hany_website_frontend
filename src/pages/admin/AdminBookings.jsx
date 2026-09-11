import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
    getAllServiceRequests,
    deleteServiceRequest,
} from '../../services/bookingService';
import {
    CalendarCheck,
    Search,
    RefreshCw,
    Loader2,
    AlertCircle,
    CheckCircle2,
    Trash2,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight,
    X,
    Clock,
    UserCheck,
    Sparkles,
    ShieldAlert,
    Inbox,
    MessageCircle,
} from 'lucide-react';

// Friendly relative date formatter
function formatFriendlyDate(dateString, isAr) {
    if (!dateString) return isAr ? 'غير محدد' : 'Unknown';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    const timeStr = date.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    if (diffDays === 0) {
        return {
            label: isAr ? 'اليوم' : 'Today',
            sub: timeStr,
            badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
    }
    if (diffDays === 1) {
        return {
            label: isAr ? 'أمس' : 'Yesterday',
            sub: timeStr,
            badge: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
    return {
        label: date.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
            month: 'short',
            day: 'numeric',
        }),
        sub: timeStr,
        badge: 'bg-slate-50 text-slate-600 border-slate-200',
    };
}

export default function AdminBookings() {
    const { isAr } = useLanguage();

    // Data States
    const [requests, setRequests] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    // Delete Modal States
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch Requests
    const fetchRequests = async (page = 1) => {
        try {
            setLoading(true);
            setError('');
            const res = await getAllServiceRequests(page, 10);
            setRequests(res.data || []);
            if (res.pagination) {
                setPagination(res.pagination);
            }
        } catch (err) {
            console.error('Fetch Bookings Error:', err);
            setError(
                err.response?.data?.message ||
                (isAr
                    ? 'تعذر الوصول إلى جدول الحجوزات، يرجى المحاولة بعد قليل.'
                    : 'Unable to reach bookings schedule. Please retry shortly.')
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests(1);
    }, []);

    // Open Delete Modal
    const handleOpenDeleteModal = (booking) => {
        setBookingToDelete(booking);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (deleting) return;
        setDeleteModalOpen(false);
        setBookingToDelete(null);
    };

    // Confirm Delete
    const handleConfirmDelete = async () => {
        if (!bookingToDelete?._id) return;

        try {
            setDeleting(true);
            await deleteServiceRequest(bookingToDelete._id);
            setSuccessMessage(
                isAr
                    ? `تم إلغاء حجز الطلب #${bookingToDelete.orderNumber} بنجاح`
                    : `Order #${bookingToDelete.orderNumber} was removed successfully`
            );
            handleCloseDeleteModal();
            fetchRequests(pagination.currentPage);
            setTimeout(() => setSuccessMessage(''), 3500);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                (isAr
                    ? 'حدثت مشكلة أثناء محاولة حذف هذا الحجز.'
                    : 'Could not complete removing this booking.')
            );
        } finally {
            setDeleting(false);
        }
    };

    // Status Badge with human labels
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {isAr ? 'تم السداد بالكامل' : 'Paid & Settled'}
                    </span>
                );
            case 'unpaid':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-600" />
                        {isAr ? 'بانتظار التحصيل' : 'Payment Pending'}
                    </span>
                );
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                        <UserCheck className="w-3 h-3 text-sky-600" />
                        {isAr ? 'معاينة مؤكدة' : 'Confirmed Visit'}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {status || (isAr ? 'قيد المراجعة' : 'In Review')}
                    </span>
                );
        }
    };

    // Service Type Badges
    const renderTypeBadge = (type) => {
        switch (type) {
            case 'inspection':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-500 border border-indigo-100">
                
                        {isAr ? 'معاينة ' : 'Site Inspection'}
                    </span>
                );
            case 'consultation':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                        {isAr ? 'جلسة استشارية' : 'Consultation'}
                    </span>
                );
            case 'maintenance':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                        {isAr ? 'أعمال صيانة' : 'Maintenance'}
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                        {type}
                    </span>
                );
        }
    };

    // Safe Client Filter
    const filteredRequests = requests.filter((req) => {
        const matchesType = typeFilter === 'all' || req.requestType === typeFilter;
        const q = searchQuery.trim().toLowerCase();
        if (!q) return matchesType;

        const customerName = (req.userName || req.customer?.userName || req.customer?.name || '').toLowerCase();
        const customerEmail = (req.customer?.email || '').toLowerCase();
        const rawPhones = req.phone || req.customer?.phone || '';
        const customerPhone = Array.isArray(rawPhones) ? rawPhones.join(' ') : String(rawPhones);
        const orderNum = (req.orderNumber || '').toLowerCase();
        const serviceName = (req.serviceItem?.name || '').toLowerCase();
        const description = (req.description || '').toLowerCase();

        const matchesSearch =
            orderNum.includes(q) ||
            customerName.includes(q) ||
            customerEmail.includes(q) ||
            customerPhone.includes(q) ||
            serviceName.includes(q) ||
            description.includes(q);

        return matchesType && matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header & Mission Statement */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                            <CalendarCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">
                                {isAr ? 'جدول حجوزات المعاينة' : 'Inspection Bookings Schedule'}
                            </h1>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {isAr
                                    ? 'متابعة مواعيد المعاينات، طلبات العملاء، وحالة التحصيل المالي المباشر.'
                                    : 'Review customer appointment schedules, on-site demands, and payment statuses.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-end hidden sm:block">
                        <p className="text-[11px] text-slate-400 font-medium">
                            {isAr ? 'إجمالي الحجوزات المسجلة' : 'Total Registered Bookings'}
                        </p>
                        <p className="text-sm font-bold text-slate-800 font-mono">
                            {pagination.totalItems || requests.length} {isAr ? 'حجز' : 'requests'}
                        </p>
                    </div>

                    <button
                        onClick={() => fetchRequests(pagination.currentPage)}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-slate-700 transition-colors cursor-pointer"
                        title={isAr ? 'تحديث البيانات' : 'Refresh'}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Notifications */}
            {successMessage && (
                <div className="p-4 bg-emerald-50/90 border border-emerald-200/80 text-emerald-900 text-xs sm:text-sm rounded-2xl flex items-center gap-2.5 shadow-xs animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span className="font-medium">{successMessage}</span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-2xl flex items-center gap-2.5 shadow-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{error}</span>
                </div>
            )}

            {/* Human Search & Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative">
                    <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3.5 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                            isAr
                                ? 'ابحث باسم العميل، الهاتف، رقم الطلب، أو البند...'
                                : 'Search by client, phone number, order ID, or service...'
                        }
                        className="w-full pl-9 pr-10 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm focus:ring-2 focus:ring-blue-600 outline-none shadow-xs transition-all"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                <div className="relative">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 shadow-xs cursor-pointer"
                    >
                        <option value="all">{isAr ? 'كافة أنواع الخدمات' : 'All Categories'}</option>
                        <option value="inspection">{isAr ? 'طلبات المعاينة الميدانية' : 'Inspections'}</option>
                        <option value="consultation">{isAr ? 'استشارات فنية' : 'Consultations'}</option>
                        <option value="maintenance">{isAr ? 'أعمال الصيانة' : 'Maintenance'}</option>
                    </select>
                </div>
            </div>

            {/* Table / Content Area */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-slate-400 gap-3">
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-600">
                            {isAr ? 'جاري تجهيز جدول الحجوزات...' : 'Fetching bookings schedule...'}
                        </p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-3xl flex items-center justify-center text-slate-400 mb-3 shadow-inner">
                            <Inbox className="w-7 h-7" />
                        </div>
                        <h3 className="text-base font-bold text-slate-800">
                            {isAr ? 'لا توجد حجوزات مطابقة' : 'No bookings found'}
                        </h3>
                        <p className="text-xs text-slate-500 max-w-sm mt-1">
                            {searchQuery
                                ? isAr
                                    ? 'لم نعثر على أي نتائج تطابق نص البحث، جرب استخدام كلمات أو أرقام أخرى.'
                                    : 'No requests matched your query. Try tweaking your search keywords.'
                                : isAr
                                ? 'لم يتم تقديم أي طلبات معاينة حتى هذه اللحظة.'
                                : 'No appointment requests have been registered yet.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs sm:text-sm">
                            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                                <tr>
                                    <th className="py-4 px-5 text-start">{isAr ? 'تاريخ الحجز والطلب' : 'Request & Date'}</th>
                                    <th className="py-4 px-5 text-start">{isAr ? 'العميل وبيانات التواصل' : 'Customer & Contact'}</th>
                                    <th className="py-4 px-5 text-start">{isAr ? 'الخدمة المطلوبة' : 'Service & Details'}</th>
                                    <th className="py-4 px-5 text-start">{isAr ? 'قيمة المعاينة' : 'Price'}</th>
                                    <th className="py-4 px-5 text-center">{isAr ? 'حالة السداد' : 'Payment Status'}</th>
                                    <th className="py-4 px-5 text-center">{isAr ? 'إجراء' : 'Action'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/90">
                                {filteredRequests.map((req) => {
                                    const clientName = req.userName || req.customer?.userName || req.customer?.name || (isAr ? 'عميل كرام' : 'Guest Client');
                                    const initial = clientName.trim()[0]?.toUpperCase() || 'U';
                                    const dateMeta = formatFriendlyDate(req.createdAt, isAr);
                                    const rawPhone = req.phone || req.customer?.phone;
                                    const formattedPhone = Array.isArray(rawPhone) ? rawPhone[0] : rawPhone;

                                    return (
                                        <tr key={req._id} className="hover:bg-slate-50/60 transition-colors">
                                            {/* Order Identity & Time */}
                                            <td className="py-4 px-5 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md inline-block w-fit">
                                                        #{req.orderNumber}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${dateMeta.badge}`}>
                                                            {dateMeta.label}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 font-mono">
                                                            {dateMeta.sub}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Client Avatar & Contact Card */}
                                            <td className="py-4 px-5">
                                                <div className="flex items-start gap-3">
                                                    
                                                    <div className="space-y-1">
                                                        <p className="font-bold text-slate-900 text-sm leading-tight">
                                                            {clientName}
                                                        </p>

                                                        <div className="flex flex-wrap items-center gap-2 text-xs">
                                                            {formattedPhone ? (
                                                                <a
                                                                    href={`tel:${formattedPhone}`}
                                                                    className="inline-flex items-center gap-1 font-mono text-slate-600 hover:text-blue-600 bg-slate-50 px-2 py-0.5 rounded-md transition-colors"
                                                                    title={isAr ? 'اتصال مباشر' : 'Call'}
                                                                >
                                                                    <Phone className="w-3 h-3 text-slate-400" />
                                                                    <span>{formattedPhone}</span>
                                                                </a>
                                                            ) : (
                                                                <span className="text-slate-400 text-[11px]">
                                                                    {isAr ? 'بدون رقم هاتف' : 'No phone'}
                                                                </span>
                                                            )}

                                                            
                                                        </div>

                                                        {req.customer?.email && (
                                                            <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                                                                <Mail className="w-3 h-3" />
                                                                <span>{req.customer.email}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Service & Request Item */}
                                            <td className="py-4 px-5">
                                                <div className="space-y-1 max-w-xs">
                                                    <div className="flex items-center gap-1.5">
                                                        {renderTypeBadge(req.requestType)}
                                                    </div>
                                                    <p className="font-bold text-slate-800 text-xs">
                                                        {req.serviceItem?.name || (isAr ? 'معاينة متخصصة' : 'Specialized Item')}
                                                    </p>
                                                    {req.description && (
                                                        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                                            "{req.description}"
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Price */}
                                            <td className="py-4 px-5 whitespace-nowrap">
                                                <span className="text-base font-black text-slate-900 font-mono">
                                                    {req.price}
                                                </span>
                                                <span className="text-xs text-slate-500 mr-1 font-medium">
                                                    {req.currency || 'EGP'}
                                                </span>
                                            </td>

                                            {/* Human Payment Status */}
                                            <td className="py-4 px-5 text-center whitespace-nowrap">
                                                {renderStatusBadge(req.status)}
                                            </td>

                                            {/* Action Button */}
                                            <td className="py-4 px-5 text-center whitespace-nowrap">
                                                {req.status === 'paid' ? (
                                                    <span
                                                        className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg cursor-not-allowed inline-block"
                                                        title={isAr ? 'حجز مسدد لا يمكن حذفه' : 'Paid booking locked'}
                                                    >
                                                        {isAr ? 'محمي' : 'Locked'}
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(req)}
                                                        className="p-2 text-rose-500 hover:text-white hover:bg-rose-600 rounded-xl transition-all border border-rose-100 hover:border-rose-600 cursor-pointer shadow-2xs"
                                                        title={isAr ? 'إلغاء وحذف الحجز' : 'Cancel booking'}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Friendly Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                        <span className="text-slate-500 font-medium">
                            {isAr
                                ? `عرض الصفحة ${pagination.currentPage} من إجمالي ${pagination.totalPages} صفحات`
                                : `Showing page ${pagination.currentPage} of ${pagination.totalPages}`}
                        </span>

                        <div className="flex items-center gap-1.5">
                            <button
                                disabled={!pagination.hasPrevPage}
                                onClick={() => fetchRequests(pagination.currentPage - 1)}
                                className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
                                title={isAr ? 'الصفحة السابقة' : 'Previous'}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                disabled={!pagination.hasNextPage}
                                onClick={() => fetchRequests(pagination.currentPage + 1)}
                                className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
                                title={isAr ? 'الصفحة التالية' : 'Next'}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Humanized Delete Modal */}
            {deleteModalOpen && bookingToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <div className="flex items-center gap-2.5 text-rose-600">
                                <div className="p-2 bg-rose-50 rounded-xl">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                        {isAr ? 'إلغاء حجز المعاينة' : 'Cancel Booking'}
                                    </h3>
                                    <p className="text-[11px] text-slate-400">
                                        {isAr ? 'يرجى مراجعة التفاصيل قبل التأكيد' : 'Please review details before confirming'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseDeleteModal}
                                disabled={deleting}
                                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg cursor-pointer disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-4">
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {isAr ? (
                                    <>
                                        أنت على وشك إلغاء الحجز رقم{' '}
                                        <strong className="font-mono text-slate-900">
                                            #{bookingToDelete.orderNumber}
                                        </strong>
                                        . لن يتمكن الفني أو العميل من متابعة هذا الموعد بعد حذفه.
                                    </>
                                ) : (
                                    <>
                                        You are about to cancel booking{' '}
                                        <strong className="font-mono text-slate-900">
                                            #{bookingToDelete.orderNumber}
                                        </strong>
                                        . Neither the inspector nor the client will see this scheduled visit again.
                                    </>
                                )}
                            </p>

                            {/* Booking Card Preview */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                    <span className="text-slate-500">{isAr ? 'اسم العميل:' : 'Customer:'}</span>
                                    <span className="font-bold text-slate-800">
                                        {bookingToDelete.userName || bookingToDelete.customer?.userName || bookingToDelete.customer?.name || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                                    <span className="text-slate-500">{isAr ? 'الخدمة المختارة:' : 'Requested Service:'}</span>
                                    <span className="font-semibold text-slate-800">
                                        {bookingToDelete.serviceItem?.name || bookingToDelete.requestType}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">{isAr ? 'المبلغ المستحق:' : 'Fee:'}</span>
                                    <span className="font-bold font-mono text-slate-900">
                                        {bookingToDelete.price} {bookingToDelete.currency || 'EGP'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleCloseDeleteModal}
                                    disabled={deleting}
                                    className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    {isAr ? 'التراجع والاحتفاظ بالحجز' : 'Keep Booking'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    disabled={deleting}
                                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{isAr ? 'نعم، قم بالحذف' : 'Confirm Cancellation'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}