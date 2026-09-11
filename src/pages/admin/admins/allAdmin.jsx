import React, { useState, useEffect } from 'react';
import { Eye, Trash2, UserX, UserCheck, Search, ShieldCheck, Mail, Phone, Crown, Users, UserPlus, UserMinus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { showAlertConfirm } from '../../../services/alertConfirm';

const AllAdminTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [loadingAction, setLoadingAction] = useState({
  view: null,
  toggle: null,
  delete: null,
});



  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/getAllAdmin');
      setUsers(res.data.users);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  

  const toggleActiveStatus = async (id) => {
    try {
      await api.patch(`/users/deactivateUserById/${id}`);
      setUsers(users.map(u => u._id === id ? { ...u, active: !u.active } : u));
    } catch (err) {
      alert("حدث خطأ أثناء تغيير حالة المشرف");
    }
  };

  const handleDelete = async (id) => {
  const confirmDelete = await showAlertConfirm({icon:"warning",title:"هل أنت متأكد من حذف هذا المشرف نهائياً؟" ,text:"عند حذف هذا العميل لا يمكن الرجوع في الحذف"});
    if (confirmDelete.isConfirmed) {
      try {
        await api.delete(`/users/deleteUser/${id}`);
        setUsers(users.filter(u => u._id !== id));
      } catch (err) {
        alert("فشل الحذف، تأكد من الصلاحيات");
      }
    }
  };

  const filteredUsers = users.filter(u => 
    u.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.phoneNumber?.includes(searchTerm) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const stats = {
    total: users.length,
    active: users.filter(u => u.active).length,
    blocked: users.filter(u => !u.active).length
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-bold animate-pulse">جاري جلب بيانات المشرفين...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-[#fcfcfd] min-h-screen font-" dir="rtl">
      
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 rounded-lg text-white -lg -slate-200">
              <ShieldCheck size={26} />
            </div>
            إدارة طاقم الإشراف
          </h2>
          <p className="text-slate-500 text-sm mt-1 mr-12">لديك {users.length} مشرفين</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96 group">
          <input
            type="text"
            placeholder="بحث في سجل المشرفين..."
            className="w-full pr-12 py-3.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all -sm group-hover:-md"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
        </div>
      </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-white p-4 rounded-lg border border-slate-100 -sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Users size={20}/></div>
            <div><p className="text-xs text-slate-400 font-bold uppercase">الإجمالي</p><p className="text-xl font-black text-slate-800">{stats.total}</p></div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-100 -sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><UserPlus size={20}/></div>
            <div><p className="text-xs text-slate-400 font-bold uppercase">نشط</p><p className="text-xl font-black text-slate-800">{stats.active}</p></div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-100 -sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600"><UserMinus size={20}/></div>
            <div><p className="text-xs text-slate-400 font-bold uppercase">محظور</p><p className="text-xl font-black text-slate-800">{stats.blocked}</p></div>
          </div>
        </div>

      {/* Modern Table Container */}
      <div className="bg-white rounded-lg border border-slate-100 -xl -slate-100/50 overflow-auto">
        <div className="overflow-x-auto max-h-screen overflow-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-5 text-slate-500 font-black text-xs uppercase tracking-widest">المشرف</th>
                <th className="p-5 text-slate-500 font-black text-xs uppercase tracking-widest text-center">التواصل</th>
                <th className="p-5 text-slate-500 font-black text-xs uppercase tracking-widest text-center">المستوى</th>
                <th className="p-5 text-slate-500 font-black text-xs uppercase tracking-widest text-center">الحالة</th>
                <th className="p-5 text-slate-500 font-black text-xs uppercase tracking-widest text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                  {/* Avatar & Name */}
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center text-white -md font-bold text-lg">
                        {user.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-base">{user.userName}</p>
                        <span className="text-[10px] text-slate-400 font-شركه tracking-wider">ID: {user._id.slice(-6).toUpperCase()}</span>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td className="p-5">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                        <Mail size={12} className="text-slate-400" /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-شركه">
                        <Phone size={12} /> {user.phoneNumber || '---'}
                      </div>
                    </div>
                  </td>

                  {/* Role/Level */}
                  <td className="p-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100 -sm">
                      <Crown size={14} />
                      <span className="text-xs font-black uppercase">مدير نظام</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="p-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-tight transition-all duration-500 ${
                      user.active 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-rose-100 text-rose-700 ring-4 ring-rose-50'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                      {user.active ? 'نشط الآن' : 'موقوف مؤقتاً'}
                    </span>
                  </td>

                  {/* Actions Buttons */}
                  <td className="p-5">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => navigate(`${user._id}`)}
                        className="w-10 h-10 flex items-center justify-center bg-white text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-600 hover:text-white hover:-lg hover:-blue-200 transition-all duration-300"
                        title="الملف الشخصي"
                      >
                        <Eye size={18} />
                      </button>

                      <button 
          disabled={loadingAction.toggle === user._id}
          onClick={async () => {
            setLoadingAction(prev => ({ ...prev, toggle: user._id }));
            await toggleActiveStatus(user._id);
            setLoadingAction(prev => ({ ...prev, toggle: null }));
          }}
          className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all ${
            user.active 
              ? 'bg-white text-orange-500 border-orange-100 hover:bg-orange-500 hover:text-white' 
              : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white'
          }`}
        >
          {loadingAction.toggle === user._id ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          ) : user.active ? (
            <UserX size={18} />
          ) : (
            <UserCheck size={18} />
          )}
        </button>

<button 
  disabled={loadingAction.delete === user._id}
  onClick={async () => {
    setLoadingAction(prev => ({ ...prev, delete: user._id }));
    await handleDelete(user._id);
    setLoadingAction(prev => ({ ...prev, delete: null }));
  }}
  className="w-10 h-10 flex items-center justify-center bg-white text-rose-500 border border-rose-100 rounded-lg hover:bg-rose-600 hover:text-white transition-all"
>
  {loadingAction.delete === user._id ? (
    <span className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></span>
  ) : (
    <Trash2 size={18} />
  )}
</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-bold">لم يتم العثور على أي مشرفين</p>
            <p className="text-sm">حاول البحث باستخدام معايير أخرى</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAdminTable;