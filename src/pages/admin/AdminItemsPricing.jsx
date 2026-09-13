import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
    getAllPricing,
    createPricing,
    updatePricing,
} from '../../services/itemPricingService';
import {
    BadgeDollarSign,
    Plus,
    Edit2,
    RefreshCw,
    Loader2,
    AlertCircle,
    X,
    Search,
    CheckCircle2,
    Wrench,
    Stethoscope,
    ClipboardCheck,
    Calendar,
} from 'lucide-react';

export default function AdminPricing() {
    const { isAr } = useLanguage();

    // الحالات الأساسية
    const [pricingList, setPricingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // حالات النافذة المنبثقة (Modal)
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // حالة النموذج متوافقة مع الـ Backend
    const [formData, setFormData] = useState({
        inspectionPrice: '',
        consultationPrice: '',
        maintenanceDeposit: '',
    });

    // جلب الأسعار من الخادم
    const fetchPricing = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await getAllPricing();
            setPricingList(res?.data || []);
        } catch (err) {
            console.error('Fetch Pricing Error:', err);
            setError(
                err.response?.data?.message ||
                (isAr ? 'فشل تحميل بيانات الأسعار من الخادم' : 'Failed to load pricing data')
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPricing();
    }, []);

    // فتح نافذة الإضافة أو التعديل
    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingId(record._id);
            setFormData({
                inspectionPrice: record.inspectionPrice ?? '',
                consultationPrice: record.consultationPrice ?? '',
                maintenanceDeposit: record.maintenanceDeposit ?? '',
            });
        } else {
            setEditingId(null);
            setFormData({
                inspectionPrice: '',
                consultationPrice: '',
                maintenanceDeposit: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
    };

    // إرسال البيانات للـ API
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccessMessage('');

        try {
            if (editingId) {
                await updatePricing(editingId, formData);
                setSuccessMessage(isAr ? 'تم تعديل الأسعار بنجاح' : 'Pricing updated successfully');
            } else {
                await createPricing(formData);
                setSuccessMessage(isAr ? 'تم إضافة لائحة الأسعار بنجاح' : 'New pricing tier created');
            }
            handleCloseModal();
            await fetchPricing();
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            console.error('Save Pricing Error:', err);
            alert(
                err.response?.data?.message ||
                (isAr ? 'حدث خطأ أثناء حفظ التغييرات' : 'Error saving pricing')
            );
        } finally {
            setSubmitting(false);
        }
    };

    // أحدث سجل فعال حالياً في النظام
    const currentActivePricing = pricingList[0] || null;

    return (
        <div className="space-y-6">
            {/* رأس الصفحة */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <BadgeDollarSign className="w-6 h-6 text-blue-600" />
                        <span>{isAr ? 'إدارة تسعير الخدمات' : 'Service Pricing Management'}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {isAr
                            ? 'تحديد رسوم المعاينات الميدانية، الاستشارات الهندسية، ومقدمات عقود الصيانة.'
                            : 'Set active rates for site inspections, technical consultations, and maintenance deposits.'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchPricing}
                        className="p-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 -xs transition-colors cursor-pointer"
                        title={isAr ? 'تحديث' : 'Refresh'}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold -sm transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{isAr ? 'إضافة تسعيرة جديدة' : 'Add New Pricing'}</span>
                    </button>
                </div>
            </div>

            {/* رسائل النجاح أو الأخطاء */}
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

            {/* البطاقات الإحصائية للأسعار الفعالة حالياً */}
            {currentActivePricing && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* المعاينة */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 -xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-500">
                                {isAr ? 'رسوم المعاينة (Inspection)' : 'Inspection Fee'}
                            </span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
                                {currentActivePricing.inspectionPrice}{' '}
                                <span className="text-xs font-normal text-slate-400">EGP</span>
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <ClipboardCheck className="w-6 h-6" />
                        </div>
                    </div>

                    {/* الاستشارة */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 -xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-500">
                                {isAr ? 'رسوم الاستشارة (Consultation)' : 'Consultation Fee'}
                            </span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
                                {currentActivePricing.consultationPrice}{' '}
                                <span className="text-xs font-normal text-slate-400">EGP</span>
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Stethoscope className="w-6 h-6" />
                        </div>
                    </div>

                    {/* تأمين الصيانة */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 -xs flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-500">
                                {isAr ? 'تأمين الصيانة (Maintenance Deposit)' : 'Maintenance Deposit'}
                            </span>
                            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
                                {currentActivePricing.maintenanceDeposit}{' '}
                                <span className="text-xs font-normal text-slate-400">EGP</span>
                            </h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Wrench className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            )}

            {/* شريط عنوان التبويب أعلى الجدول */}
            <div className="flex border-b border-slate-200">
                <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 border-blue-600 text-blue-600">
                    <BadgeDollarSign className="w-4 h-4" />
                    <span>{isAr ? 'سجل لوائح الأسعار' : 'Pricing Records'}</span>
                </div>
            </div>

            {/* جدول السجلات */}
            <div className="bg-white rounded-2xl border border-slate-200 -xs overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-sm font-medium">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
                    </div>
                ) : pricingList.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-sm">
                        {isAr ? 'لا توجد بيانات أسعار مسجلة.' : 'No pricing plans set.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs sm:text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                                <tr>
                                    <th className="py-3 px-4 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                                    <th className="py-3 px-4 text-start">{isAr ? 'المعاينة' : 'Inspection'}</th>
                                    <th className="py-3 px-4 text-start">{isAr ? 'الاستشارة' : 'Consultation'}</th>
                                    <th className="py-3 px-4 text-start">{isAr ? 'تأمين الصيانة' : 'Maint. Deposit'}</th>
                                    <th className="py-3 px-4 text-start">{isAr ? 'تاريخ التحديث' : 'Date Created'}</th>
                                    <th className="py-3 px-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pricingList.map((p, index) => {
                                    const isActive = index === 0;

                                    return (
                                        <tr
                                            key={p._id}
                                            className={`hover:bg-slate-50/70 transition-colors ${isActive ? 'bg-blue-50/25' : ''
                                                }`}
                                        >
                                            {/* الحالة */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                {isActive ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        {isAr ? 'فعّال حالياً' : 'Active'}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] text-slate-400 bg-slate-100">
                                                        {isAr ? 'أرشيف' : 'Archived'}
                                                    </span>
                                                )}
                                            </td>

                                            {/* سعر المعاينة */}
                                            <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                                                {p.inspectionPrice} EGP
                                            </td>

                                            {/* سعر الاستشارة */}
                                            <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                                                {p.consultationPrice} EGP
                                            </td>

                                            {/* تأمين الصيانة */}
                                            <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                                                {p.maintenanceDeposit} EGP
                                            </td>

                                            {/* التاريخ */}
                                            <td className="py-3.5 px-4 text-slate-500 text-xs font-mono">
                                                {p.createdAt ? new Date(p.createdAt).toLocaleDateString('ar-EG') : 'N/A'}
                                            </td>

                                            {/* الإجراءات */}
                                            <td className="py-3.5 px-4 text-center">
                                                <button
                                                    onClick={() => handleOpenModal(p)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                    title={isAr ? 'تعديل' : 'Edit'}
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* نافذة الإضافة والتعديل المنبثقة (Modal) */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
                    <div className="w-full max-w-md bg-white rounded-2xl p-6 -2xl border border-slate-100 relative">
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <h3 className="font-bold text-slate-900 text-base">
                                {editingId
                                    ? isAr
                                        ? 'تعديل لائحة الأسعار'
                                        : 'Edit Pricing'
                                    : isAr
                                        ? 'إضافة لائحة أسعار جديدة'
                                        : 'Add New Pricing'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* سعر المعاينة */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr ? 'سعر المعاينة (Inspection Price - EGP)' : 'Inspection Price (EGP)'} *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    required
                                    value={formData.inspectionPrice}
                                    onChange={(e) =>
                                        setFormData({ ...formData, inspectionPrice: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                                    placeholder="مثال: 150"
                                />
                            </div>

                            {/* سعر الاستشارة */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr ? 'سعر الاستشارة (Consultation Price - EGP)' : 'Consultation Price (EGP)'} *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    required
                                    value={formData.consultationPrice}
                                    onChange={(e) =>
                                        setFormData({ ...formData, consultationPrice: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                                    placeholder="مثال: 300"
                                />
                            </div>

                            {/* تأمين الصيانة */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr
                                        ? 'مقدم / تأمين الصيانة (Maintenance Deposit - EGP)'
                                        : 'Maintenance Deposit (EGP)'} *
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    required
                                    value={formData.maintenanceDeposit}
                                    onChange={(e) =>
                                        setFormData({ ...formData, maintenanceDeposit: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                                    placeholder="مثال: 500"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    {isAr ? 'إلغاء' : 'Cancel'}
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold -sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                >
                                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>{isAr ? 'حفظ الأسعار' : 'Save Pricing'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}