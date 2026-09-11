import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, Shield, 
  Calendar, Clock, CheckCircle, XCircle, 
  Trash2, ArrowRight, Key, Activity, Hash, Layers,
  ShieldAlert,
  ShieldCheck,
  Truck,
  Bell
} from 'lucide-react';
import api from '../../../services/api';
import { showAlert } from '../../../services/alert';
import { showAlertConfirm } from '../../../services/alertConfirm';
import { CgNotifications } from 'react-icons/cg';

const UserDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clickLoading,  setClickLoading] = useState(false);
  const [clickLoading2,  setClickLoading2] = useState(false);
  const [reviews,setReviews]=useState(null);
  const [orders,setOrders]=useState(null);
  const [orderStats,setOrderStats]=useState(null);
  const [cart,setCart]=useState(null);
  const [cartStats,setCartStats]=useState(null);
  const [notifications,setNotifications]=useState(null);

  const statusMap = {
  pending: { label: "قيد الانتظار", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  confirmed: { label: "تم التأكيد", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  shipped: { label: "جاري الشحن", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  delivered: { label: "تم الاستلام", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  cancelled: { label: "تم الإلغاء", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};


const getStatusDetails = (title) => {
    if (title.includes("حظرك")) return {
      icon: <ShieldAlert className="text-rose-400" />,
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20"
    };
    if (title.includes("فك الحظر")) return {
      icon: <ShieldCheck className="text-emerald-400" />,
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    };
    if (title.includes("توصيل")) return {
      icon: <Truck className="text-sky-400" />,
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20"
    };
    return {
      icon: <Bell className="text-slate-400" />,
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-500/20"
    };
  };


  const fetchUser = async () => {
    try {
      const res = await api.get(`/users/getUser/${customerId}`);
      setUser(res.data.user);
      setReviews(res.data.reviews);
      setOrders(res.data.orders);
      setOrderStats(res.data.orderStats);
      setCart(res.data.cart);
      setCartStats(res.data.cartStats);
      setNotifications(res.data.notifications);
    

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUser(); }, [customerId]);

  const handleToggleActive = async () => {
    try {
      setClickLoading2(true)
      await api.patch(`/users/deactivateUserById/${customerId}`);
      fetchUser();
      showAlert({ title: user.active ? "تم حظر الحساب" : "تم تفعيل الحساب", icon: "success" });
    } catch (err) {
      showAlert({ title: "خطأ في تغيير الحالة", icon: "error" });
    }finally{
      setClickLoading2(false);
    }
  };

  const handleDelete = async () => {
        const confirmDelete = await showAlertConfirm({icon:"warning",title:"هل أنت متأكد من حذف هذا المستخدم نهائياً؟" ,text:"عند حذف هذا العميل لا يمكن الرجوع في الحذف"});
    
    if (confirmDelete.isConfirmed) {
      try {
      setClickLoading(true)

        await api.delete(`/users/deleteUser/${customerId}`);
        showAlert({ title: "تم الحذف بنجاح", icon: "success" });
        navigate('/admin_dashboard/customers');
      } catch (err) {
        showAlert({ title: "فشل الحذف", icon: "error" });
      }finally{
        setClickLoading(false)
      

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
           <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-500 -sm flex items-center gap-2">
             <Hash size={14} /> ID: {user._id.slice(-6)}
           </span>
        </div>
      </div>

   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-5">
    <StatCard title="إجمالي الطلبات" value={orderStats?.totalOrders || 0} unit="طلب" icon={<Layers className="text-blue-500" />} />
    <StatCard title="إجمالي المدفوعات" value={orderStats?.totalPrice || 0} unit="ج.م" icon={<Activity className="text-emerald-500" />} />
    <StatCard title="عناصر السلة" value={cartStats?.totalItems || 0} unit="منتج" icon={<CheckCircle className="text-amber-500" />} />
    <StatCard title="التقييمات" value={reviews?.length || 0} unit="مراجعة" icon={<Shield className="text-purple-500" />} />
   </div>

      <div className=" mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Summary & Actions (Col 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Profile Card */}
          <div className=" bg-white rounded-lg p-8 -sm border border-slate-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-900 to-indigo-900"></div>
            <div className="relative pt-8">
              <div className="w-28 h-28 bg-white p-1 rounded-lg mx-auto -xl">
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
          <div className="bg-slate-900 rounded-lg p-8 -xl text-white">
            <h3 className="font-bold mb-6 flex items-center gap-2 text-slate-400 uppercase text-xs tracking-widest">
              <Activity size={16} /> مركز التحكم بالأمان
            </h3>
            <div className="space-y-4">
        <button 
  onClick={async () => {
  
     handleToggleActive();
    
  }}
  disabled={clickLoading2}
  className={`w-full flex items-center justify-between px-5 py-4 rounded-lg transition-all font-bold text-sm ${
    user.active 
      ? 'bg-white/10 hover:bg-orange-500 hover:text-white text-orange-400' 
      : 'bg-emerald-500 hover:bg-emerald-600 text-white'
  } ${clickLoading2 ? 'opacity-60 cursor-not-allowed' : ''}`}
>
  <span className="flex items-center gap-3">
    {clickLoading2 ? (
      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
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
    setClickLoading(true);
    await handleDelete();
    setClickLoading(false);
  }}
  disabled={clickLoading}
  className={`w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-rose-600 transition-all rounded-lg font-bold text-sm text-rose-400 hover:text-white ${
    clickLoading ? 'opacity-60 cursor-not-allowed' : ''
  }`}
>
  <span className="flex items-center gap-3">
    {clickLoading ? (
      <span className="animate-spin border-2 border-rose-400 border-t-transparent rounded-full w-5 h-5"></span>
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

           {/* Address Card */}
          <div className=" bg-white rounded-lg p-8 -sm border border-slate-100 group">
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-50 pb-4">
              <MapPin size={22} className="text-orange-500" /> تفاصيل العنوان الرئيسي
            </h3>
            
            {user.address ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-1  3xl:grid-cols-4 gap-6">
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
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-950 -sm"><Key size={18}/></div>
               <div>
                  <p className="text-[10px] text-blue-400 font-black uppercase">كلمة السر</p>
                  <p className="text-xs font-bold text-blue-800">آخر تغيير: {new Date(user.lastChangePassword).toLocaleDateString('ar-EG')}</p>
               </div>
            </div>

      {user.pandding &&
                        <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100 flex items-center gap-4">
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-950 -sm"><Key size={18}/></div>
     
                     {new Date(user.pandding) <(new Date) &&
                          <div>
                  <p className="text-[10px] text-blue-400 font-black uppercase"> الغاء حظر كلمة السر </p>
                <p className="text-xs font-bold text-blue-800">
                  تم الغاء الحظر في  : {new Date(user.pandding).toLocaleString('ar-EG', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
               </div>
               }

                {new Date(user.pandding) >(new Date) &&
                          <div>
                  <p className="text-[10px] text-blue-400 font-black uppercase"> الغاء حظر كلمة السر </p>
                <p className="text-xs font-bold text-blue-800">
                  سيتم الغاء الحظر في  : {new Date(user.pandding).toLocaleString('ar-EG', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
               </div>
               }

            </div>}


            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center gap-4">
               <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-500 -sm"><Layers size={18}/></div>
               <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase">محاولات الاستعادة</p>
                  <p className="text-xs font-bold text-slate-700">{user.passwordResetAttempts} محاولات مسجلة</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Information Grid */}
          <div className="bg-white rounded-lg p-8 -sm border border-slate-100">
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


          <div className="bg-white rounded-lg p-8 -sm border border-slate-100 ">
            <div className='flex flex-row justify-between'>
                  <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-50 pb-4">
        <Activity size={22} className="text-blue-600" /> سجل الطلبات الأخيرة
    </h3>

    <span className="text-blue-600">
     { orders?.length}
    </span>

            </div>
    <div className="space-y-4 max-h-96 overflow-auto">
        {orders && orders.length > 0 ? (
            orders.map((order) => (
                <div key={order._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/50">
                    <div>
                        <p className="text-sm font-black text-slate-800">{order.orderNumber}</p>
                        <p className="text-xs text-slate-500 mt-1">{order.items?.length} منتجات • {order.payment.method === 'cash' ? 'دفع نقدي' : 'محفظة'}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-3 md:mt-0">
                        <div className="text-left md:text-right">
                            <p className="text-sm font-black text-blue-900">{order.finalPrice} ج.م</p>
                    <span className={`
                      flex items-center gap-3  my-1 w-fit px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors
                      ${order.payment.status === 'paid' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-500 border-red-500/20'
                      }
                  `}>
                      {/* أيقونة بسيطة تعبر عن حالة الدفع */}
                      <span className={`w-1.5 h-1.5 rounded-full ${order.payment.status === 'paid' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-red-400'}`} />
                      
                      {order.payment.status === 'paid' ? 'تم الدفع' : 'في انتظار الدفع'}
                  </span>

                            <span className={`
                        text-[11px] px-3 py-1 rounded-lg font-bold border backdrop-blur-sm transition-all
                        ${statusMap[order.status].color}
                      `}>
                        
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-current ml-2 animate-pulse" />
                        {statusMap[order.status].label}
                      </span>
                        </div>
                        <button onClick={()=>navigate(`/admin_dashboard/orders/${order._id}`)} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
                            <ArrowRight  size={18} className="rotate-180" />
                        </button>
                    </div>
                </div>
            ))
        ) : (
            <p className="text-center text-slate-400 py-4 italic text-sm">لا توجد طلبات مسجلة</p>
        )}
    </div>
        </div>

        {/* منتجات السلة الحالية */}
        <div className="bg-white rounded-lg p-8 -sm border border-slate-100">


     <div className='flex flex-row justify-between'>
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-50 pb-4">
                <Layers size={22} className="text-sky-500" /> محتويات السلة النشطة
            </h3>

            <span className="text-blue-600">
            { cart?.length}
            </span>
    </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-auto">
                {cart?.items && cart.items?.length > 0 ? (
                    cart.items.map((item) => (
                        <div key={item._id} className="flex items-center gap-4 p-3 bg-sky-50/50 rounded-xl border border-sky-100">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-sky-600 font-bold -sm">
                                {item.quantity}
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-700">اسم المنتج: {item.product?.productName}</p>
                                <p className="text-[10px] text-sky-600 font-bold uppercase">{item.unit_type}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="col-span-2 text-center text-slate-400 py-4 italic text-sm">السلة فارغة حالياً</p>
                )}
            </div>
        </div>

        {/* التقييمات والمراجعات */}
        <div className="bg-white rounded-lg p-8 -sm border border-slate-100">


         <div className='flex flex-row justify-between'>
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-50 pb-4">
                <CheckCircle size={22} className="text-emerald-500" /> آراء وتقييمات العميل
            </h3>

            <span className="text-blue-600">
            { reviews?.length}
            </span>
            </div>


            <div className="space-y-4 max-h-96 overflow-auto">
                {reviews && reviews?.length > 0 ? (
                    reviews.map((rev) => (
                        <div key={rev._id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/30">
                            <div className="flex justify-between mb-2">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className={`w-3 h-3 rounded-full ${i < rev.rating ? 'bg-amber-400' : 'bg-slate-200'}`}></div>
                                    ))}
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">{new Date(rev.createdAt).toLocaleDateString('ar-EG')}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">"{rev.comment}"</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-slate-400 py-4 italic text-sm">لم يقم العميل بكتابة أي تقييمات بعد</p>
                )}
            </div>
        </div>

        
             <div className="bg-white rounded-lg p-8 -sm border border-slate-100">

                     <div className='flex flex-row justify-between'>
            <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3 border-b border-slate-50 pb-4">
                <CgNotifications size={22} className="text-emerald-500" />   الأشعارات والرسائل
            </h3>

            <span className="text-blue-600">
            { notifications?.length}
            </span>
            </div>
            <div className="flex flex-col max-h-96 overflow-auto">
              {notifications?.map((notif) => {
                
                const status = getStatusDetails(notif.title);

                return (
                  <div 
                    key={notif._id} 
                    className={`flex gap-4 p-4 rounded-xl border backdrop-blur-md transition-all hover:bg-white/5 ${status.borderColor} mb-3`}
                  >
                
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${status.bgColor}`}>
                      {status.icon}
                    </div>

                    {/* محتوى الإشعار */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-white">{notif.title}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                          <Clock size={12} />
                          {new Date(notif.createdAt).toLocaleTimeString('ar-EG', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    
                    {/* علامة غير مقروء (اختياري) */}
                    <div className="flex flex-col justify-center">
                      <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                    </div>
                  </div>
                );
              })}
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


const StatCard = ({ title, value, unit, icon }) => (
  <div className="bg-white p-5 rounded-lg border border-slate-100 -sm hover:-md transition-">
    <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
    </div>
    <p className="text-[10px] text-slate-400 font-black uppercase mb-1">{title}</p>
    <div className="flex items-baseline gap-1">
        <span className="text-xl font-black text-slate-800">{value}</span>
        <span className="text-[10px] font-bold text-slate-500">{unit}</span>
    </div>
  </div>
);

const NotificationsList = ({ notifications }) => {
  return (
    <div className="max-w-2xl mx-auto p-4 bg-[#0a0f18] min-h-screen rounded-2xl border border-white/5">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          الإشعارات
          <span className="text-[10px] bg-sky-500 text-white px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </h2>
        <button className="text-xs text-sky-400 hover:underline">تحديد الكل كقروء</button>
      </div>

      <div className="overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
        {notifications.map((notif) => (
          <NotificationItem key={notif._id} notification={notif} />
        ))}
      </div>
    </div>
  );
};
export default UserDetails;