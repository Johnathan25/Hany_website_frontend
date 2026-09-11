import React, { useState, useEffect } from 'react';
import { Eye, Trash2, UserX, UserCheck, Search, Users, ShieldCheck, UserMinus, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { showAlert } from '../../../services/alert';
import { showAlertConfirm } from '../../../services/alertConfirm';

const AllUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, SetIsLoading] = useState(false);
  
  // حالات التقسيم والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, active: 0, blocked: 0 });

  const navigate = useNavigate();

  // جلب البيانات من السيرفر بناءً على الصفحة الحالية وكلمة البحث
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/getUsers?page=${currentPage}&limit=20&search=${searchTerm}`);
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
      if (res.data.stats) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    } finally {
      setLoading(false);
    }
  };

  // إعادة تعيين الصفحة إلى 1 عند تغيير نص البحث
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // تحديث البيانات عند تغيير الصفحة أو نص البحث
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 400); // Debounce لتجنب إرسال طلبات متعددة فورية أثناء الكتابة

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]);

  const toggleActiveStatus = async (id) => {
    try {
      SetIsLoading(true);
      await api.patch(`/users/deactivateUserById/${id}`);
      setUsers(users.map(u => u._id === id ? { ...u, active: !u.active } : u));
      
      // تحديث العدادات موضعياً لتجنب إعادة طلب السيرفر بالكامل
      setStats(prev => {
        const user = users.find(u => u._id === id);
        if (!user) return prev;
        return {
          ...prev,
          active: user.active ? prev.active - 1 : prev.active + 1,
          blocked: user.active ? prev.blocked + 1 : prev.blocked - 1
        };
      });

      showAlert({ title: "تم تحديث حالة المستخدم", icon: "success" });
    } catch (err) {
      showAlert({ title: "خطأ في العملية", icon: "error" });
    } finally {
      SetIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = await showAlertConfirm({
      icon: "warning",
      title: "هل أنت متأكد من حذف هذا المستخدم نهائياً؟",
      text: "عند حذف هذا العميل لا يمكن الرجوع في الحذف"
    });
    
    if (confirmDelete.isConfirmed) {
      try {
        SetIsLoading(true);
        await api.delete(`/users/deleteUser/${id}`);
        setUsers(users.filter(u => u._id !== id));
        
        // تحديث الإحصائيات بعد الحذف مباشرة
        setStats(prev => {
          const user = users.find(u => u._id === id);
          return {
            total: prev.total - 1,
            active: user?.active ? prev.active - 1 : prev.active,
            blocked: !user?.active ? prev.blocked - 1 : prev.blocked
          };
        });

        showAlert({ title: "تم حذف المستخدم", icon: "success" });
      } catch (err) {
        showAlert({ title: "فشل الحذف", icon: "error" });
      } finally {
        SetIsLoading(false);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 min-h-screen" dir="rtl">
      
      {/* 1. Header & Stats Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-1 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Users size={24} />
              </div>
              إدارة المستخدمين
            </h1>
            <p className="text-slate-500 text-sm">تحكم في صلاحيات وحالات حسابات النظام</p>
          </div>

          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              value={searchTerm}
              placeholder="ابحث بالاسم، البريد، أو الهاتف..."
              className="w-full pr-11 py-3 bg-white border border-slate-200 rounded-lg text-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all group-hover:border-blue-300"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 top-3.5 text-slate-400 group-hover:text-blue-500 transition-colors" size={18} />
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-4 rounded-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Users size={20}/></div>
            <div><p className="text-xs text-slate-400 font-bold uppercase">الإجمالي</p><p className="text-xl font-black text-slate-800">{stats.total}</p></div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><UserPlus size={20}/></div>
            <div><p className="text-xs text-slate-400 font-bold uppercase">نشط</p><p className="text-xl font-black text-slate-800">{stats.active}</p></div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600"><UserMinus size={20}/></div>
            <div><p className="text-xs text-slate-400 font-bold uppercase">محظور</p><p className="text-xl font-black text-slate-800">{stats.blocked}</p></div>
          </div>
        </div>
      </div>

      {/* 2. Main Table Section */}
      <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-black uppercase tracking-widest border-b border-slate-100">
                    <th className="p-5">المستخدم</th>
                    <th className="p-5">بيانات الاتصال</th>
                    <th className="p-5 text-center">الرتبة</th>
                    <th className="p-5 text-center">الحالة</th>
                    <th className="p-5 text-center">التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-black text-xs">
                            {user.userName ? user.userName.substring(0, 2).toUpperCase() : 'US'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{user.userName}</p>
                            <p className="text-[10px] text-slate-400 tracking-tighter">ID: ...{user._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-600">{user.email}</p>
                          <p className="text-[11px] text-slate-400">{user.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                          user.role === 'admin' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-slate-50 text-slate-600 border border-slate-100'
                        }`}>
                          {user.role === 'admin' && <ShieldCheck size={12} />}
                          {user.role === 'admin' ? 'مدير النظام' : 'عميل'}
                        </span>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                          user.active ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {user.active ? '● نشط' : '○ محظور'}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => navigate(`${user._id}`)}
                            className="w-9 h-9 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all duration-300"
                            title="تفاصيل"
                          >
                            <Eye size={18} />
                          </button>

                          <button 
                            onClick={() => toggleActiveStatus(user._id)}
                            disabled={isLoading} 
                            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${
                              isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            } ${
                              user.active 
                                ? 'text-amber-500 hover:bg-amber-500 hover:text-white' 
                                : 'text-emerald-500 hover:bg-emerald-500 hover:text-white'
                            }`}
                            title={user.active ? "حظر" : "تفعيل"}
                          >
                            {user.active ? <UserX size={18} /> : <UserCheck size={18} />}
                          </button>

                          <button 
                            onClick={() => handleDelete(user._id)}
                            disabled={isLoading}
                            className={`w-9 h-9 flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300 ${
                              isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            title="حذف"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {users.length === 0 && (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-200" size={30} />
                </div>
                <h3 className="text-slate-800 font-bold">لا يوجد نتائج لبحثك</h3>
                <p className="text-slate-400 text-xs mt-1">تأكد من كتابة الاسم أو رقم الهاتف بشكل صحيح</p>
              </div>
            )}

            {/* 3. Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-around gap-3 bg-slate-50/50">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} /> السابق
                </button>
                
                <span className="text-xs font-bold text-slate-500">
                  الصفحة {currentPage} من {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || isLoading}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  التالي <ChevronLeft size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsersTable;