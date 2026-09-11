import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import {
    Users,
    Search,
    Shield,
    ShieldAlert,
    UserCheck,
    UserX,
    Trash2,
    RefreshCw,
    Loader2,
    AlertCircle,
    Mail,
    Phone,
    Calendar
} from 'lucide-react';

export default function AdminUsers() {
    const { isAr } = useLanguage();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    // 1. Fetch Users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await api.get('/users');
            setUsers(res.data?.data || res.data || []);
        } catch (err) {
            console.error('Fetch users error:', err);
            setError(
                err.response?.data?.message ||
                (isAr ? 'فشل تحميل بيانات المستخدمين' : 'Failed to fetch users list')
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Handle Role Update
    const handleRoleChange = async (userId, newRole) => {
        try {
            setActionLoading(userId);
            await api.patch(`/users/${userId}/role`, { role: newRole });
            setUsers((prev) =>
                prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
            );
        } catch (err) {
            console.error('Change role error:', err);
            alert(err.response?.data?.message || (isAr ? 'فشل تعديل الصلاحية' : 'Failed to update role'));
        } finally {
            setActionLoading(null);
        }
    };

    // 3. Handle Delete User
    const handleDeleteUser = async (userId) => {
        const confirmMsg = isAr
            ? 'هل أنت متأكد من حذف هذا المستخدم نهائياً؟'
            : 'Are you sure you want to delete this user permanently?';

        if (!window.confirm(confirmMsg)) return;

        try {
            setActionLoading(userId);
            await api.delete(`/users/${userId}`);
            setUsers((prev) => prev.filter((u) => u._id !== userId));
        } catch (err) {
            console.error('Delete user error:', err);
            alert(err.response?.data?.message || (isAr ? 'فشل حذف المستخدم' : 'Failed to delete user'));
        } finally {
            setActionLoading(null);
        }
    };

    // 4. Filtering Logic
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.phone || '').includes(searchQuery) ||
            (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRole = roleFilter === 'all' || u.role === roleFilter;

        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-600" />
                        <span>{isAr ? 'إدارة المستخدمين والصلاحيات' : 'User Management & Roles'}</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        {isAr
                            ? 'إدارة حسابات المشرفين، العملاء، ومراجعة بيانات الوصول للمنظومة.'
                            : 'Manage system administrators, clients, and role-based permissions.'}
                    </p>
                </div>

                <button
                    onClick={fetchUsers}
                    className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 shadow-xs transition-colors cursor-pointer"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تحديث البيانات' : 'Refresh'}</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {/* Controls: Search & Role Filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isAr ? 'بحث بالاسم، الهاتف أو البريد...' : 'Search by name, phone or email...'}
                        className="w-full ps-10 pe-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </div>

                <div className="w-full sm:w-auto flex items-center gap-2">
                    <label className="text-xs font-semibold text-slate-600 shrink-0">
                        {isAr ? 'تصفية الصلاحية:' : 'Role Filter:'}
                    </label>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-700"
                    >
                        <option value="all">{isAr ? 'جميع الرتب' : 'All Roles'}</option>
                        <option value="client">{isAr ? 'عميل (Client)' : 'Client'}</option>
                        <option value="admin">{isAr ? 'مشرف (Admin)' : 'Admin'}</option>
                        <option value="superadmin">{isAr ? 'مشرف عام (Superadmin)' : 'Superadmin'}</option>
                    </select>
                </div>
            </div>

            {/* Users Table Container */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        <p className="text-sm font-medium">
                            {isAr ? 'جاري تحميل قائمة المستخدمين...' : 'Loading users...'}
                        </p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="py-16 text-center text-slate-400 text-sm">
                        {isAr ? 'لم يتم العثور على مستخدمين يطابقون البحث.' : 'No users match your search criteria.'}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-start text-xs sm:text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                                <tr>
                                    <th className="py-3 px-4 text-start">{isAr ? 'المستخدم' : 'User'}</th>
                                    <th className="py-3 px-4 text-start">{isAr ? 'الاتصال' : 'Contact'}</th>
                                    <th className="py-3 px-4 text-start">{isAr ? 'الرتبة / الصلاحية' : 'Role'}</th>
                                    <th className="py-3 px-4 text-start">{isAr ? 'تاريخ التسجيل' : 'Registered'}</th>
                                    <th className="py-3 px-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => {
                                    const isActionActive = actionLoading === user._id;

                                    return (
                                        <tr key={user._id} className="hover:bg-slate-50/70 transition-colors">
                                            {/* Name & Avatar */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                        {(user.name || 'U').charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{user.name || 'Anonymous'}</p>
                                                        <p className="text-[11px] text-slate-400 font-mono">ID: {user._id?.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact details */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    {user.email && (
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            <span>{user.email}</span>
                                                        </div>
                                                    )}
                                                    {user.phone && (
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-mono">
                                                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                            <span dir="ltr">{user.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Role selection dropdown */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5">
                                                    {user.role === 'superadmin' ? (
                                                        <ShieldAlert className="w-4 h-4 text-purple-600" />
                                                    ) : user.role === 'admin' ? (
                                                        <Shield className="w-4 h-4 text-blue-600" />
                                                    ) : (
                                                        <UserCheck className="w-4 h-4 text-slate-400" />
                                                    )}

                                                    <select
                                                        value={user.role || 'client'}
                                                        disabled={isActionActive}
                                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                        className={`text-xs font-bold py-1 px-2.5 rounded-lg border focus:outline-none transition-all cursor-pointer ${user.role === 'superadmin'
                                                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                                : user.role === 'admin'
                                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                                            }`}
                                                    >
                                                        <option value="client">Client</option>
                                                        <option value="admin">Admin</option>
                                                        <option value="superadmin">Superadmin</option>
                                                    </select>
                                                </div>
                                            </td>

                                            {/* Registration Date */}
                                            <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-slate-500">
                                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>

                                            {/* Actions */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    disabled={isActionActive || user.role === 'superadmin'}
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    title={isAr ? 'حذف المستخدم' : 'Delete user'}
                                                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
                                                >
                                                    {isActionActive ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
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
        </div>
    );
}