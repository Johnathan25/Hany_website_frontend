import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Shield, 
  Calendar, Clock, CheckCircle, XCircle, 
  Trash2, ArrowRight, Key, Activity, Hash, Layers
} from 'lucide-react';
import api from '../../../services/api';
import { showAlert } from '../../../services/alert';
import { showAlertConfirm } from '../../../services/alertConfirm';

const AdminDetails = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
const [loading2, setLoading2] = useState({
  toggle: false,
  delete: false,
});
  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/getUser/${adminId}`);
      setUser(res.data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, [adminId]);

  const handleToggleActive = async () => {
    try {
      await api.patch(`/users/deactivateUserById/${adminId}`);
      fetchUser();
      showAlert({ title: user.active ? "تم حظر الحساب" : "تم تفعيل الحساب", icon: "success" });
    } catch (err) {
      showAlert({ title: "خطأ في تغيير الحالة", icon: "error" });
    }
  };

  const handleDelete = async () => {
        const confirmDelete = await showAlertConfirm({icon:"warning",title:"هل أنت متأكد من حذف هذا المستخدم نهائياً؟" ,text:"عند حذف هذا العميل لا يمكن الرجوع في الحذف"});
    
    if (confirmDelete.isConfirmed) {
      try {
        await api.delete(`/users/deleteUser/${adminId}`);
        showAlert({ title: "تم الحذف بنجاح", icon: "success" });
        navigate('/admin_dashboard/admins');
      } catch (err) {
        showAlert({ title: "فشل الحذف", icon: "error" });
      }
    }
  };

  if (loading) return (
    <div classNashme="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <div className="p-10 text-center text-red-500 font-bold">المستخدم غير موجود!</div>;

  return (
    <div className="p-4 md:p-8  min-h-screen text-right font-" dir="rtl">
      
      {/* Top Header - Navigation */}
      <div className=" mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-slate-500 hover:text-blue-950 transition-all mb-2"
          >
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>العودة لقائمة المستخدمين</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-3">
            ملف المستخدم <span className="text-blue-950">#{user.userName}</span>
          </h1>
        </div>

        
        
        <div className="flex gap-3">
           <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 shadow-sm flex items-center gap-2">
             <Hash size={14} /> ID: {user._id.slice(-6)}
           </span>
        </div>
      </div>

      <div className=" mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Summary & Actions (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Profile Card */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-900 to-indigo-900"></div>
            <div className="relative pt-8">
              <div className="w-28 h-28 bg-white p-1 rounded-lg mx-auto shadow-xl">
                <div className="w-full h-full bg-blue-50 text-blue-950 rounded-[1.8rem] flex items-center justify-center border border-blue-100">
                  <User size={48} />
                </div>
              </div>
              <div className="text-center mt-4">
                <h2 className="text-xl font-black text-slate-800">{user.userName}</h2>
                <p className="text-blue-950 font-bold text-sm uppercase tracking-widest mt-1">
                  {user.role === 'admin' ? 'مدير النظام' : 'عميل متجر'}
                </p>
                <div className={`mt-4 inline-flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black uppercase ${
                  user.active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}>
                  <span className={`w-2 h-2 rounded-full animate-pulse ${user.active ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  {user.active ? 'الحساب مفعل' : 'الحساب معطل'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-slate-900 rounded-lg p-8 shadow-xl text-white">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-400 uppercase text-xs tracking-widest">
              <Activity size={16} /> مركز التحكم بالأمان
            </h3>
            <div className="space-y-4">
    <button 
  onClick={async () => {
    setLoading2(prev => ({ ...prev, toggle: true }));
    await handleToggleActive();
    setLoading2(prev => ({ ...prev, toggle: false }));
  }}
  disabled={loading.toggle}
  className={`w-full flex items-center justify-between px-5 py-4 rounded-lg transition-all font-bold text-sm ${
    user.active 
      ? 'bg-white/10 hover:bg-orange-500 hover:text-white text-orange-400' 
      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
  } ${loading2.toggle ? 'opacity-60 cursor-not-allowed' : ''}`}
>
  <span className="flex items-center gap-3">
    {loading2.toggle ? (
      <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
    ) : (
      <>
        {user.active ? <XCircle size={20} /> : <CheckCircle size={20} />}
        {user.active ? 'تعطيل الحساب' : 'تفعيل الحساب'}
      </>
    )}
  </span>

  <ArrowRight size={16} className="rotate-180 opacity-50" />
</button>
              
<button 
  onClick={async () => {
    setLoading2(prev => ({ ...prev, delete: true }));
    await handleDelete();
    setLoading2(prev => ({ ...prev, delete: false }));
  }}
  disabled={loading.delete}
  className={`w-full flex items-center justify-between px-5 py-4 bg-white/5 rounded-lg font-bold text-sm text-rose-400 hover:text-white transition-all ${
    loading2.delete ? 'opacity-60 cursor-not-allowed' : 'hover:bg-rose-600'
  }`}
>
  <span className="flex items-center gap-3">
    {loading2.delete ? (
      <span className="w-5 h-5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin"></span>
    ) : (
      <>
        <Trash2 size={20} /> حذف نهائي
      </>
    )}
  </span>

  <ArrowRight size={16} className="rotate-180 opacity-50" />
</button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Information Grid */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-3 border-b border-slate-50 pb-4">
              <Shield size={22} className="text-blue-500" /> المعلومات الشخصية
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InfoItem icon={<Mail size={20}/>} label="البريد الإلكتروني" value={user.email} color="blue" />
              <InfoItem icon={<Phone size={20}/>} label="رقم الهاتف" value={user.phoneNumber || 'غير مسجل'} color="emerald" />
              <InfoItem icon={<Clock size={20}/>} label="آخر ظهور" value={new Date(user.lastLogin).toLocaleString('ar-EG')} color="amber" />
              <InfoItem icon={<Calendar size={20}/>} label="تاريخ الانضمام" value={new Date(user.createdAt).toLocaleDateString('ar-EG')} color="purple" />
            </div>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-lg p-8 shadow-sm border border-slate-100 group">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-50 pb-4">
              <MapPin size={22} className="text-orange-500" /> تفاصيل العنوان الرئيسي
            </h3>
            
            {user.address ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <AddressBox label="المدينة" value={user.address.city} />
                <AddressBox label="المنطقة" value={user.address.region} />
                <AddressBox label="الشارع" value={user.address.street} />
                <AddressBox label="البناء/الدور" value={`${user.address.building || '-'} / ${user.address.floor || '-'}`} />
              </div>
            ) : (
              <div className="p-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 text-center">
                <p className="text-slate-400 font-medium italic">لم يتم تعيين عنوان لهذا المستخدم بعد.</p>
              </div>
            )}
          </div>

          {/* System Data Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 flex items-center gap-4">
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-950 shadow-sm"><Key size={18}/></div>
               <div>
                  <p className="text-[10px] text-blue-400 font-black uppercase">كلمة السر</p>
                  <p className="text-xs font-bold text-blue-800">آخر تغيير: {new Date(user.lastChangePassword).toLocaleDateString('ar-EG')}</p>
               </div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center gap-4">
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-500 -sm"><Layers size={18}/></div>
               <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase">محاولات الاستعادة</p>
                  <p className="text-xs font-bold text-slate-700">{user.passwordResetAttempts} محاولات مسجلة</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Component لبنود المعلومات الشخصية
const InfoItem = ({ icon, label, value, color }) => (
  <div className="flex items-start gap-4 group">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-${color}-600 bg-${color}-50 group-hover:scale-110 transition-transform -sm`}>
      {icon}
    </div>
    <div>
      <p className="text-xs text-slate-400 font-bold mb-1 uppercase tracking-tight">{label}</p>
      <p className="text-sm font-black text-slate-700 break-all">{value}</p>
    </div>
  </div>
);

// Component لتنسيق العناوين
const AddressBox = ({ label, value }) => (
  <div className="p-4 bg-slate-50 rounded-lg hover:bg-white hover:-md transition-all border border-transparent hover:border-slate-100">
    <p className="text-[10px] text-slate-400 font-black uppercase mb-1">{label}</p>
    <p className="text-sm font-bold text-slate-800">{value || '-'}</p>
  </div>
);
export default AdminDetails;