import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  getAllServiceItems,
  createServiceItem,
  updateServiceItem,
  deleteServiceItem,
} from '../../services/serviceItemService';
import {
    Wrench,
    Hammer,
    Zap,
    Paintbrush,
    Droplets,
    Layers,
    Plus,
    Edit2,
    Trash2,
    Search,
    RefreshCw,
    Loader2,
    AlertCircle,
    CheckCircle2,
    X,
    ChevronRight,
    ChevronLeft,
} from 'lucide-react';

// تحديد أيقونة ونمط لوني لكل خدمة
const getServiceVisuals = (name = '') => {
    const n = name.toLowerCase();
    if (n.includes('نجار') || n.includes('carpent')) {
        return { 
            icon: Hammer, 
            badge: 'أعمال نجارة', 
            badgeEn: 'Carpentry',
            bg: 'bg-amber-50', 
            text: 'text-amber-600', 
            border: 'border-amber-200' 
        };
    }
    if (n.includes('سباك') || n.includes('plumb')) {
        return { 
            icon: Droplets, 
            badge: 'أعمال سباكة', 
            badgeEn: 'Plumbing',
            bg: 'bg-cyan-50', 
            text: 'text-cyan-600', 
            border: 'border-cyan-200' 
        };
    }
    if (n.includes('كهرب') || n.includes('electr')) {
        return { 
            icon: Zap, 
            badge: 'أعمال كهرباء', 
            badgeEn: 'Electrical',
            bg: 'bg-yellow-50', 
            text: 'text-yellow-600', 
            border: 'border-yellow-200' 
        };
    }
    if (n.includes('نقاش') || n.includes('دهان') || n.includes('paint')) {
        return { 
            icon: Paintbrush, 
            badge: 'دهانات وتشطيب', 
            badgeEn: 'Painting',
            bg: 'bg-purple-50', 
            text: 'text-purple-600', 
            border: 'border-purple-200' 
        };
    }
    return { 
        icon: Wrench, 
        badge: 'خدمات وصيانة', 
        badgeEn: 'Maintenance',
        bg: 'bg-blue-50', 
        text: 'text-blue-600', 
        border: 'border-blue-200' 
    };
};

export default function AdminServices() {
    const { isAr } = useLanguage();

    // Data states
    const [items, setItems] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Create / Edit Modal states
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    // Delete Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // 1. Fetch Items
    const fetchItems = async (page = 1, search = searchQuery) => {
        try {
            setLoading(true);
            setError('');
            const res = await getAllServiceItems(page, 10, search);
            setItems(res.data || []);
            if (res.pagination) {
                setPagination(res.pagination);
            }
        } catch (err) {
            console.error('Fetch Items Error:', err);
            setError(
                err.response?.data?.message ||
                (isAr ? 'فشل تحميل قائمة الخدمات' : 'Failed to load services')
            );
        } finally {
            setLoading(false);
        }
    };

    // Real-time search with debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchItems(1, searchQuery.trim());
        }, 350);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // 2. Open Form Modal (Add / Edit)
    const handleOpenFormModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setFormData({
                name: item.name || '',
                description: item.description || '',
            });
        } else {
            setFormData({ name: '', description: '' });
        }
        setFormModalOpen(true);
    };

    const handleCloseFormModal = () => {
        if (submitting) return;
        setFormModalOpen(false);
        setEditingItem(null);
    };

    // 3. Save Form
    const handleSubmitForm = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            setError('');

            if (editingItem?._id) {
                await updateServiceItem(editingItem._id, formData);
                setSuccessMessage(isAr ? 'تم تعديل الخدمة بنجاح' : 'Service updated successfully');
            } else {
                await createServiceItem(formData);
                setSuccessMessage(isAr ? 'تمت إضافة الخدمة بنجاح' : 'Service created successfully');
            }

            handleCloseFormModal();
            await fetchItems(pagination.currentPage, searchQuery);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                (isAr ? 'حدث خطأ أثناء حفظ الخدمة' : 'Error saving service')
            );
        } finally {
            setSubmitting(false);
        }
    };

    // 4. Open Delete Modal
    const handleOpenDeleteModal = (item) => {
        setItemToDelete(item);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (deleting) return;
        setDeleteModalOpen(false);
        setItemToDelete(null);
    };

    // 5. Confirm Delete
    const handleConfirmDelete = async () => {
        if (!itemToDelete?._id) return;
        try {
            setDeleting(true);
            await deleteServiceItem(itemToDelete._id);
            setSuccessMessage(isAr ? 'تم حذف الخدمة بنجاح' : 'Service deleted successfully');
            handleCloseDeleteModal();
            await fetchItems(pagination.currentPage, searchQuery);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert(
                err.response?.data?.message ||
                (isAr ? 'حدث خطأ أثناء حذف الخدمة' : 'Error deleting service')
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-6 h-6 text-blue-600" />
                        <span>{isAr ? 'إدارة بنود الخدمات' : 'Service Items Catalog'}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {isAr
                            ? 'إدارة التخصصات والخدمات المتاحة للحجز وتعديل بياناتها في جدول موحد.'
                            : 'Configure available service categories and items offered to customers.'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchItems(pagination.currentPage, searchQuery)}
                        className="p-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 shadow-xs transition-colors cursor-pointer"
                        title={isAr ? 'تحديث' : 'Refresh'}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        onClick={() => handleOpenFormModal()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{isAr ? 'إضافة خدمة جديدة' : 'Add Service'}</span>
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

            {/* Instant Search Bar */}
            <div className="relative">
                <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3.5 text-slate-400 pointer-events-none" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                        isAr
                            ? 'ابحث باسم الخدمة مباشرة (مثال: نجارة، سباكة...)'
                            : 'Type to search services in real-time...'
                    }
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none shadow-xs transition-all"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
                        title={isAr ? 'مسح البحث' : 'Clear search'}
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Services Table View */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-sm font-medium">{isAr ? 'جاري التحميل...' : 'Loading services...'}</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-sm">
                        {isAr ? 'لا توجد خدمات مسجلة مطابقة للبحث.' : 'No service items found.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs sm:text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 text-start">{isAr ? 'اسم الخدمة' : 'Service Name'}</th>
                                    <th className="py-3.5 px-4 text-start">{isAr ? 'الوصف والتفاصيل' : 'Description'}</th>
                                    <th className="py-3.5 px-4 text-start">{isAr ? 'تاريخ الإنشاء' : 'Date Created'}</th>
                                    <th className="py-3.5 px-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {items.map((item) => {
                                    const visual = getServiceVisuals(item.name);
                                    const Icon = visual.icon;

                                    return (
                                        <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                                            {/* Service Icon & Name */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-xl border ${visual.bg} ${visual.text} ${visual.border} shrink-0`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                                                        <span className="text-[11px] text-slate-400 font-mono">
                                                            #{item._id.slice(-6).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                          

                                            {/* Description */}
                                            <td className="py-3.5 px-4 max-w-xs">
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                    {item.description || (isAr ? 'لا يوجد وصف مضاف لهذه الخدمة.' : 'No description provided.')}
                                                </p>
                                            </td>

                                            {/* Created Date */}
                                            <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-slate-500">
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('ar-EG') : 'N/A'}
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenFormModal(item)}
                                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                        title={isAr ? 'تعديل' : 'Edit'}
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenDeleteModal(item)}
                                                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                        title={isAr ? 'حذف' : 'Delete'}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
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
                                onClick={() => fetchItems(pagination.currentPage - 1, searchQuery)}
                                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                disabled={!pagination.hasNextPage}
                                onClick={() => fetchItems(pagination.currentPage + 1, searchQuery)}
                                className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* FORM MODAL (Add / Edit) */}
            {formModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <h3 className="font-bold text-slate-900 text-base">
                                {editingItem
                                    ? isAr
                                        ? 'تعديل بند الخدمة'
                                        : 'Edit Service Item'
                                    : isAr
                                        ? 'إضافة بند خدمة جديد'
                                        : 'Add New Service Item'}
                            </h3>
                            <button
                                onClick={handleCloseFormModal}
                                disabled={submitting}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitForm} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr ? 'اسم الخدمة (مثل: نجارة، سباكة)' : 'Service Name'} *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                    placeholder={isAr ? 'مثال: أعمال النجارة وتركيب الأبواب' : 'e.g. Plumbing Services'}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr ? 'وصف تفصيلي للخدمة' : 'Description'}
                                </label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                                    placeholder={
                                        isAr
                                            ? 'اكتب شرحاً لما تشمله هذه الخدمة...'
                                            : 'Describe what this service covers...'
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleCloseFormModal}
                                    disabled={submitting}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                                >
                                    {isAr ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{isAr ? 'حفظ' : 'Save'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {deleteModalOpen && itemToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <div className="flex items-center gap-2 text-rose-600">
                                <Trash2 className="w-5 h-5" />
                                <h3 className="font-bold text-slate-900 text-base">
                                    {isAr ? 'تأكيد حذف الخدمة' : 'Confirm Delete Service'}
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

                        <div className="space-y-4">
                            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-xs sm:text-sm">
                                <p className="font-semibold">
                                    {isAr
                                        ? `هل أنت متأكد من حذف خدمة "${itemToDelete.name}"؟`
                                        : `Are you sure you want to delete "${itemToDelete.name}"?`}
                                </p>
                                <p className="text-[11px] text-rose-600 mt-1">
                                    {isAr
                                        ? 'ملاحظة: سيتم حذف هذا البند نهائياً من قائمة الخيارات المتاحة للعملاء.'
                                        : 'Note: This item will be permanently removed from options available to clients.'}
                                </p>
                            </div>

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