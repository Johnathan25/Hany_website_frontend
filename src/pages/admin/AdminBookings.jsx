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
} from 'lucide-react';


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

    // 1. Fetch Requests
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
                (isAr ? 'فشل جلب حجوزات المعاينة' : 'Failed to fetch bookings')
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests(1);
    }, []);

    // 2. Open Delete Modal
    const handleOpenDeleteModal = (booking) => {
        setBookingToDelete(booking);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (deleting) return;
        setDeleteModalOpen(false);
        setBookingToDelete(null);
    };

    // 3. Confirm Delete Request
    const handleConfirmDelete = async () => {
        if (!bookingToDelete?._id) return;

        try {
            setDeleting(true);
            await deleteServiceRequest(bookingToDelete._id);
            setSuccessMessage(isAr ? 'تم حذف الحجز بنجاح' : 'Booking deleted successfully');
            handleCloseDeleteModal();
            fetchRequests(pagination.currentPage);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                (isAr ? 'فشل حذف الحجز' : 'Failed to delete booking')
            );
        } finally {
            setDeleting(false);
        }
    };

    // Status Badge
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {isAr ? 'مدفوع' : 'Paid'}
                    </span>
                );
            case 'unpaid':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        {isAr ? 'غير مدفوع' : 'Unpaid'}
                    </span>
                );
            case 'confirmed':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {isAr ? 'مؤكد' : 'Confirmed'}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-50 text-slate-700 border border-slate-200">
                        {status}
                    </span>
                );
        }
    };

    // Request Type Badge
    const renderTypeBadge = (type) => {
        switch (type) {
            case 'inspection':
                return (
                    <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {isAr ? 'معاينة' : 'Inspection'}
                    </span>
                );
            case 'consultation':
                return (
                    <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {isAr ? 'استشارة' : 'Consultation'}
                    </span>
                );
            case 'maintenance':
                return (
                    <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {isAr ? 'صيانة' : 'Maintenance'}
                    </span>
                );
            default:
                return <span>{type}</span>;
        }
    };

    // Filter requests
    const filteredRequests = requests.filter((req) => {
        const matchesType = typeFilter === 'all' || req.requestType === typeFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch =
            req.orderNumber?.toLowerCase().includes(q) ||
            req.customer?.username?.toLowerCase().includes(q) ||
            req.customer?.name?.toLowerCase().includes(q) ||
            (Array.isArray(req.customer?.phone) ? req.customer.phone.some(p => p.includes(q)) : req.customer?.phone?.includes(q)) ||
            req.serviceItem?.name?.toLowerCase().includes(q);

        return matchesType && matchesSearch;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <CalendarCheck className="w-6 h-6 text-blue-600" />
                        <span>{isAr ? 'حجوزات المعاينة والخدمات' : 'Service & Inspection Bookings'}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {isAr
                            ? 'متابعة طلبات المعاينة الميدانية المقدمة من العملاء والتحقق من حالة الدفع.'
                            : 'Track customer site inspection requests and verify payment statuses.'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchRequests(pagination.currentPage)}
                        className="p-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer"
                        title={isAr ? 'تحديث' : 'Refresh'}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Notifications */}
            {successMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                </div>
            )}

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Search */}
                <div className="sm:col-span-2 relative">
                    <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                            isAr
                                ? 'البحث برقم الطلب، اسم العميل، رقم الهاتف، أو البند...'
                                : 'Search by order #, client name, phone, item...'
                        }
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none shadow-xs"
                    />
                </div>

                {/* Type Filter */}
                <div className="relative">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-700 shadow-xs cursor-pointer"
                    >
                        <option value="all">{isAr ? 'كل أنواع الخدمات' : 'All Request Types'}</option>
                        <option value="inspection">{isAr ? 'طلبات المعاينة فقط' : 'Inspections Only'}</option>
                        <option value="consultation">{isAr ? 'استشارات فقط' : 'Consultations Only'}</option>
                        <option value="maintenance">{isAr ? 'صيانة فقط' : 'Maintenance Only'}</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-sm font-medium">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-sm">
                        {isAr ? 'لا توجد طلبات حجز مسجلة.' : 'No bookings found.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs sm:text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 text-start">{isAr ? 'رقم الطلب والتاريخ' : 'Order & Date'}</th>
                                    <th className="py-3.5 px-4 text-start">{isAr ? 'بيانات العميل' : 'Customer'}</th>
                                    <th className="py-3.5 px-4 text-start">{isAr ? 'نوع الخدمة والبند' : 'Service & Item'}</th>
                                    <th className="py-3.5 px-4 text-start">{isAr ? 'السعر' : 'Price'}</th>
                                    <th className="py-3.5 px-4 text-center">{isAr ? 'حالة الدفع' : 'Payment'}</th>
                                    <th className="py-3.5 px-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredRequests.map((req) => (
                                    <tr key={req._id} className="hover:bg-slate-50/70 transition-colors">
                                        {/* Order Number & Date */}
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            <p className="font-bold text-slate-900 font-mono text-xs">{req.orderNumber}</p>
                                            <span className="text-[11px] text-slate-400 font-mono">
                                                {req.createdAt ? new Date(req.createdAt).toLocaleDateString('ar-EG') : 'N/A'}
                                            </span>
                                        </td>

                                        {/* Customer Info */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold text-slate-900 text-sm">
                                                    {req.customer?.username || req.customer?.name || (isAr ? 'عميل غير مسجل' : 'N/A')}
                                                </p>
                                            </div>

                                            <div className="text-xs text-slate-500 space-y-1 mt-1.5">
                                                {req.customer?.email && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="font-mono text-slate-600">{req.customer.email}</span>
                                                    </div>
                                                )}

                                                {Array.isArray(req.customer?.phone) ? (
                                                    req.customer.phone.length > 0 ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            <span className="font-mono text-slate-600">{req.customer.phone.join(' - ')}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                                                            <Phone className="w-3.5 h-3.5 shrink-0" />
                                                            <span>{isAr ? 'لا يوجد هاتف' : 'No phone'}</span>
                                                        </div>
                                                    )
                                                ) : req.customer?.phone ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                        <span className="font-mono text-slate-600">{req.customer.phone}</span>
                                                    </div>
                                                ) : null}
                                            </div>
                                        </td>

                                        {/* Service & Item */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                {renderTypeBadge(req.requestType)}
                                            </div>
                                            <p className="font-bold text-slate-800 text-xs">
                                                {req.serviceItem?.name || (isAr ? 'بند مخصص' : 'Custom Item')}
                                            </p>
                                            {req.description && (
                                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                                    {req.description}
                                                </p>
                                            )}
                                        </td>

                                        {/* Price */}
                                        <td className="py-3.5 px-4 font-bold text-slate-900 font-mono whitespace-nowrap">
                                            {req.price} {req.currency || 'EGP'}
                                        </td>

                                        {/* Payment Status */}
                                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                            {renderStatusBadge(req.status)}
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3.5 px-4 text-center">
                                            <button
                                                onClick={() => handleOpenDeleteModal(req)}
                                                disabled={req.status === 'paid'}
                                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                                    req.status === 'paid'
                                                        ? 'text-slate-300 cursor-not-allowed'
                                                        : 'text-rose-500 hover:bg-rose-50'
                                                }`}
                                                title={
                                                    req.status === 'paid'
                                                        ? isAr
                                                            ? 'لا يمكن حذف حجز مدفوع'
                                                            : 'Paid booking cannot be deleted'
                                                        : isAr
                                                        ? 'حذف الحجز'
                                                        : 'Delete booking'
                                                }
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination Footer */}
                {pagination.totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                            {isAr
                                ? `صفحة ${pagination.currentPage} من ${pagination.totalPages}`
                                : `Page ${pagination.currentPage} of ${pagination.totalPages}`}
                        </span>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={!pagination.hasPrevPage}
                                onClick={() => fetchRequests(pagination.currentPage - 1)}
                                className="p-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                disabled={!pagination.hasNextPage}
                                onClick={() => fetchRequests(pagination.currentPage + 1)}
                                className="p-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModalOpen && bookingToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <div className="flex items-center gap-2 text-rose-600">
                                <Trash2 className="w-5 h-5" />
                                <h3 className="font-bold text-slate-900 text-base">
                                    {isAr ? 'تأكيد حذف الحجز' : 'Confirm Delete Booking'}
                                </h3>
                            </div>
                            <button
                                onClick={handleCloseDeleteModal}
                                disabled={deleting}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="space-y-4">
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs sm:text-sm">
                                <p className="font-semibold">
                                    {isAr
                                        ? 'هل أنت متأكد من رغبتك في حذف هذا الحجز نهائياً؟'
                                        : 'Are you sure you want to delete this booking permanently?'}
                                </p>
                                <p className="text-[11px] text-rose-600 mt-1">
                                    {isAr
                                        ? 'ملاحظة: لا يمكن حذف الحجوزات المدفوعة، وهذه العملية غير قابلة للتراجع.'
                                        : 'Note: Paid bookings cannot be removed, and this action cannot be undone.'}
                                </p>
                            </div>

                            {/* Booking Quick Details */}
                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                                <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                                    <span className="text-slate-500">{isAr ? 'رقم الطلب:' : 'Order No:'}</span>
                                    <span className="font-mono font-bold text-slate-800">{bookingToDelete.orderNumber}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                                    <span className="text-slate-500">{isAr ? 'العميل:' : 'Customer:'}</span>
                                    <span className="font-bold text-slate-800">
                                        {bookingToDelete.customer?.username || bookingToDelete.customer?.name || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                                    <span className="text-slate-500">{isAr ? 'الخدمة / البند:' : 'Service:'}</span>
                                    <span className="font-medium text-slate-800">
                                        {bookingToDelete.serviceItem?.name || bookingToDelete.requestType}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">{isAr ? 'المبلغ:' : 'Amount:'}</span>
                                    <span className="font-bold font-mono text-emerald-600">
                                        {bookingToDelete.price} {bookingToDelete.currency || 'EGP'}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleCloseDeleteModal}
                                    disabled={deleting}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                                >
                                    {isAr ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    disabled={deleting}
                                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{isAr ? 'تأكيد الحذف' : 'Confirm Delete'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}