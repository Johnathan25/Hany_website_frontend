import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
    getAllAdmins,
    createAdmin,
    updateAdmin,
    changeAdminRole,
    toggleAdminActive,
    deleteAdmin,
} from '../../services/adminUsersService';
import {
    Users,
    UserPlus,
    Shield,
    ShieldAlert,
    ShieldCheck,
    Search,
    Trash2,
    Edit2,
    RefreshCw,
    Loader2,
    AlertCircle,
    CheckCircle2,
    X,
    Power,
    Mail,
    Phone,
} from 'lucide-react';

export default function AdminUsers() {
    const { isAr } = useLanguage();

    // Data states
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal / Form states
    const [showModal, setShowModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Delete Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'manager',
    });

    // 1. Fetch Admins
    const fetchAdmins = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await getAllAdmins();
            setAdmins(res?.data || res?.admins || res || []);
        } catch (err) {
            console.error('Fetch Admins Error:', err);
            setError(
                err.response?.data?.message ||
                (isAr ? 'فشل جلب قائمة المسؤولين' : 'Failed to fetch admin users')
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    // 2. Open Modal for Create / Edit
    const handleOpenModal = (admin = null) => {
        setEditingAdmin(admin);
        if (admin) {
            setFormData({
                name: admin.name || '',
                email: admin.email || '',
                phone: admin.phone || '',
                password: '',
                role: admin.role || 'manager',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                role: 'manager',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingAdmin(null);
    };

    // 3. Submit Create or Update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            if (editingAdmin) {
                const payload = { ...formData };
                if (!payload.password) delete payload.password;

                await updateAdmin(editingAdmin._id, payload);
                setSuccessMessage(isAr ? 'تم تحديث بيانات المشرف بنجاح' : 'Admin updated successfully');
            } else {
                await createAdmin(formData);
                setSuccessMessage(isAr ? 'تم إنشاء حساب المشرف بنجاح' : 'Admin created successfully');
            }

            handleCloseModal();
            await fetchAdmins();
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            console.error('Save Admin Error:', err);
            alert(
                err.response?.data?.message ||
                (isAr ? 'حدث خطأ أثناء حفظ البيانات' : 'Error saving admin user')
            );
        } finally {
            setSubmitting(false);
        }
    };

    // 4. Change Role Handler
    const handleRoleChange = async (id, newRole) => {
        try {
            await changeAdminRole(id, newRole);
            setAdmins((prev) =>
                prev.map((item) => (item._id === id ? { ...item, role: newRole } : item))
            );
            setSuccessMessage(isAr ? 'تم تعديل الصلاحية بنجاح' : 'Role updated successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert(err.response?.data?.message || (isAr ? 'فشل تعديل الصلاحية' : 'Failed to change role'));
        }
    };

    // 5. Toggle Active Status
    const handleToggleActive = async (id) => {
        try {
            await toggleAdminActive(id);
            setAdmins((prev) =>
                prev.map((item) =>
                    item._id === id ? { ...item, isActive: !item.isActive } : item
                )
            );
        } catch (err) {
            alert(err.response?.data?.message || (isAr ? 'فشل تغيير حالة الحساب' : 'Failed to toggle status'));
        }
    };

    // 6. Delete Admin Modal Logic
    const handleOpenDeleteModal = (admin) => {
        setAdminToDelete(admin);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        if (deleting) return;
        setDeleteModalOpen(false);
        setAdminToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!adminToDelete?._id) return;

        try {
            setDeleting(true);
            await deleteAdmin(adminToDelete._id);
            setAdmins((prev) => prev.filter((item) => item._id !== adminToDelete._id));
            setSuccessMessage(isAr ? 'تم حذف المشرف بنجاح' : 'Admin deleted successfully');
            handleCloseDeleteModal();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            alert(err.response?.data?.message || (isAr ? 'فشل حذف المشرف' : 'Failed to delete admin'));
        } finally {
            setDeleting(false);
        }
    };

    // Role Badge Styling
    const renderRoleBadge = (role) => {
        switch (role) {
            case 'superadmin':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        {isAr ? 'مدير عام' : 'Super Admin'}
                    </span>
                );
            case 'manager':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {isAr ? 'مدير إدارة' : 'Manager'}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        <Shield className="w-3.5 h-3.5" />
                        {isAr ? 'عميل' : 'customer'}
                    </span>
                );
        }
    };

    // Filtered admins
    const filteredAdmins = admins.filter((item) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
            item.name?.toLowerCase().includes(q) ||
            item.email?.toLowerCase().includes(q) ||
            item.phone?.includes(q)
        );
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-600" />
                        <span>{isAr ? 'المستخدمين والصلاحيات' : 'Admins & Permissions'}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {isAr
                            ? 'إدارة حسابات المشرفين والمديرين، وتوزيع الصلاحيات وتفعيل الحسابات.'
                            : 'Manage administrator accounts, assign roles, and handle account status.'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchAdmins}
                        className="p-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer"
                        title={isAr ? 'تحديث' : 'Refresh'}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        onClick={() => handleOpenModal()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>{isAr ? 'إضافة مشرف جديد' : 'Add Admin'}</span>
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

            {/* Search Bar */}
            <div className="relative">
                <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'البحث بالاسم، البريد، أو رقم الهاتف...' : 'Search by name, email, or phone...'}
                    className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none shadow-xs"
                />
                {searchQuery && (
                    <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-sm font-medium">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
                    </div>
                ) : filteredAdmins.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-sm">
                        {isAr ? 'لا يوجد مشرفين مطابقين للبحث.' : 'No admins found.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs sm:text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                                <tr>
                                    <th className="py-3.5 px-4 text-start">{isAr ? 'العميل' : 'customer'}</th>
                                    <th className="py-3.5 px-4 text-start">{isAr ? 'بيانات التواصل' : 'Contact'}</th>
                                    <th className="py-3.5 px-4 text-start">{isAr ? 'الصلاحية الحالية' : 'Current Role'}</th>
                                    <th className="py-3.5 px-4 text-start">{isAr ? 'تعديل الصلاحية' : 'Change Role'}</th>
                                    <th className="py-3.5 px-4 text-center">{isAr ? 'حالة الحساب' : 'Status'}</th>
                                    <th className="py-3.5 px-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredAdmins.map((item) => (
                                    <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                                        {/* Name & Avatar */}
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                                    {item.name ? item.name[0].toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{item.name}</p>
                                                    <span className="text-[11px] text-slate-400 font-mono">
                                                        {item._id?.slice(-6)}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="py-3.5 px-4 text-slate-600 space-y-0.5">
                                            <div className="flex items-center gap-1.5">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="font-mono text-xs">{item.email}</span>
                                            </div>
                                            {item.phone && (
                                                <div className="flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="font-mono text-xs">{item.phone}</span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Role Badge */}
                                        <td className="py-3.5 px-4">{renderRoleBadge(item.role)}</td>

                                        {/* Quick Role Change */}
                                        <td className="py-3.5 px-4">
                                            <select
                                                value={item.role || 'manager'}
                                                onChange={(e) => handleRoleChange(item._id, e.target.value)}
                                                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white outline-none focus:ring-1 focus:ring-blue-600 font-semibold text-slate-700 cursor-pointer"
                                            >
                                                <option value="customer">عميل</option>
                                                <option value="manager">مدير</option>
                                                <option value="superadmin">مدير عام</option>
                                            </select>
                                        </td>

                                        {/* Status Toggle */}
                                        <td className="py-3.5 px-4 text-center">
                                            <button
                                                onClick={() => handleToggleActive(item._id)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                                                    item.isActive !== false
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                                                }`}
                                                title={isAr ? 'اضغط لتغيير الحالة' : 'Click to toggle'}
                                            >
                                                <Power className="w-3 h-3" />
                                                <span>
                                                    {item.isActive !== false
                                                        ? isAr
                                                            ? 'نشط'
                                                            : 'Active'
                                                        : isAr
                                                        ? 'معطل'
                                                        : 'Inactive'}
                                                </span>
                                            </button>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3.5 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(item)}
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* CREATE / EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <h3 className="font-bold text-slate-900 text-base">
                                {editingAdmin
                                    ? isAr
                                        ? 'تعديل بيانات المشرف'
                                        : 'Edit Admin User'
                                    : isAr
                                    ? 'إضافة مشرف جديد'
                                    : 'Add New Admin'}
                            </h3>
                            <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr ? 'الاسم بالكامل' : 'Full Name'} *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr ? 'البريد الإلكتروني' : 'Email'} *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr ? 'رقم الهاتف' : 'Phone'}
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none font-mono"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr ? 'كلمة المرور' : 'Password'}{' '}
                                    {editingAdmin ? (isAr ? '(اتركها فارغة لعدم التغيير)' : '(Leave blank to keep)') : '*'}
                                </label>
                                <input
                                    type="password"
                                    required={!editingAdmin}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    {isAr ? 'الصلاحية (الدور)' : 'Role'} *
                                </label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                >
                                    <option value="manager">Manager (مدير إدارة)</option>
                                    <option value="superadmin">Superadmin (مدير عام)</option>
                                </select>
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

            {/* DELETE CONFIRMATION MODAL */}
            {deleteModalOpen && adminToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
                    <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-150">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b pb-3 mb-4">
                            <div className="flex items-center gap-2 text-rose-600">
                                <Trash2 className="w-5 h-5" />
                                <h3 className="font-bold text-slate-900 text-base">
                                    {isAr ? 'تأكيد حذف المشرف' : 'Confirm Delete Admin'}
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
                                        ? 'هل أنت متأكد من رغبتك في حذف هذا الحساب نهائياً؟'
                                        : 'Are you sure you want to delete this admin account permanently?'}
                                </p>
                                <p className="text-[11px] text-rose-600 mt-1">
                                    {isAr
                                        ? 'سيتم إلغاء وصول هذا الحساب إلى لوحة التحكم فوراً ولا يمكن التراجع عن الإجراء.'
                                        : 'This admin will immediately lose dashboard access and this action cannot be undone.'}
                                </p>
                            </div>

                            {/* Admin Quick Details Card */}
                            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                                <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                                    <span className="text-slate-500">{isAr ? 'الاسم:' : 'Name:'}</span>
                                    <span className="font-bold text-slate-800">{adminToDelete.name}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5">
                                    <span className="text-slate-500">{isAr ? 'البريد الإلكتروني:' : 'Email:'}</span>
                                    <span className="font-mono text-slate-700">{adminToDelete.email}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">{isAr ? 'الصلاحية:' : 'Role:'}</span>
                                    <span>{renderRoleBadge(adminToDelete.role)}</span>
                                </div>
                            </div>

                            {/* Modal Actions */}
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