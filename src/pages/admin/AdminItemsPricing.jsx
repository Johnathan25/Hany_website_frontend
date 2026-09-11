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
} from 'lucide-react';

export default function AdminPricing() {
    const { isAr } = useLanguage();

    // Data states
    const [pricing, setPricing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal / Form States
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [pricingForm, setPricingForm] = useState({
        name: '',
        serviceType: '',
        basePrice: '',
        unit: '',
        notes: '',
    });

    // 1. Fetch Pricing Data
    const fetchPricing = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await getAllPricing();
            setPricing(res?.data || res || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                (isAr ? 'فشل جلب البيانات من الخادم' : 'Failed to fetch records')
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPricing();
    }, []);

    // 2. Open Modal for Create or Edit
    const handleOpenModal = (record = null) => {
        setEditingRecord(record);
        setPricingForm(
            record || {
                name: '',
                serviceType: '',
                basePrice: '',
                unit: '',
                notes: '',
            }
        );
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingRecord(null);
    };

    // 3. Submit Handler (Create / Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingRecord?._id) {
                await updatePricing(editingRecord._id, pricingForm);
            } else {
                await createPricing(pricingForm);
            }
            handleCloseModal();
            fetchPricing();
        } catch (err) {
            alert(
                err.response?.data?.message ||
                (isAr ? 'حدث خطأ أثناء الحفظ' : 'Failed to save changes')
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <BadgeDollarSign className="w-6 h-6 text-blue-600" />
                        <span>{isAr ? 'إدارة تسعير الخدمات' : 'Service Pricing Management'}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {isAr
                            ? 'إدارة أسعار الخدمات، وتكاليف المعاينة وطرق الاحتساب.'
                            : 'Configure service rates, inspection fees, and unit billing criteria.'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchPricing}
                        className="p-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer"
                        title={isAr ? 'تحديث' : 'Refresh'}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>{isAr ? 'إضافة تسعيرة خدمة' : 'Add Pricing'}</span>
                    </button>
                </div>
            </div>

            {/* علامة التبويب الثابتة أعلى الجدول */}
            <div className="flex border-b border-slate-200">
                <div className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 border-blue-600 text-blue-600">
                    <BadgeDollarSign className="w-4 h-4" />
                    <span>{isAr ? 'تسعير الخدمات (Service Pricing)' : 'Service Pricing'}</span>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-sm font-medium">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
                    </div>
                ) : pricing.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-sm">
                        {isAr ? 'لا توجد أسعار خدمات مسجلة حالياً.' : 'No pricing plans set.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs sm:text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                                <tr>
                                    <th className="py-3 px-4 text-start">{isAr ? 'الخدمة' : 'Service Name'}</th>
                                    <th className="py-3 px-4 text-start">{isAr ? 'نوع الخدمة' : 'Service Type'}</th>
                                    <th className="py-3 px-4 text-start">{isAr ? 'السعر الأساسي' : 'Base Price'}</th>
                                    <th className="py-3 px-4 text-start">{isAr ? 'طريقة الحساب' : 'Unit Basis'}</th>
                                    <th className="py-3 px-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {pricing.map((p) => (
                                    <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="py-3.5 px-4 font-bold text-slate-900">{p.name}</td>
                                        <td className="py-3.5 px-4 text-slate-600">{p.serviceType || '-'}</td>
                                        <td className="py-3.5 px-4 font-bold text-blue-600 font-mono">
                                            {p.basePrice ? `${p.basePrice} EGP` : '-'}
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-600">{p.unit || '-'}</td>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CREATE / EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
                    <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 relative">
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <h3 className="font-bold text-slate-900 text-base">
                                {editingRecord
                                    ? isAr
                                        ? 'تعديل سعر الخدمة'
                                        : 'Edit Pricing'
                                    : isAr
                                        ? 'إضافة تسعيرة جديدة'
                                        : 'Create New Pricing'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr ? 'اسم الخدمة' : 'Service Name'} *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={pricingForm.name}
                                    onChange={(e) => setPricingForm({ ...pricingForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        {isAr ? 'نوع الخدمة' : 'Service Type'}
                                    </label>
                                    <input
                                        type="text"
                                        value={pricingForm.serviceType}
                                        onChange={(e) =>
                                            setPricingForm({ ...pricingForm, serviceType: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        {isAr ? 'السعر الأساسي' : 'Base Price'}
                                    </label>
                                    <input
                                        type="number"
                                        value={pricingForm.basePrice}
                                        onChange={(e) =>
                                            setPricingForm({ ...pricingForm, basePrice: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr ? 'طريقة الحساب (مثال: لكل زيارة / بالمتر)' : 'Unit Basis'}
                                </label>
                                <input
                                    type="text"
                                    value={pricingForm.unit}
                                    onChange={(e) => setPricingForm({ ...pricingForm, unit: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
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
        </div>
    );
}