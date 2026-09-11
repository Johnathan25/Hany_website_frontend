import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Package, User, MapPin, CreditCard, Clipboard, 
  CheckCircle, XCircle, AlertCircle, ArrowRight, 
  Phone, Calendar, Hash, Truck, Info, Eye,
  Edit3,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import api from '../../../services/api';
import { showAlert } from '../../../services/alert';
import { showAlertConfirm } from '../../../services/alertConfirm';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/order/by-id/${id}`);
      setOrder(res.data.order);
      setAdminNote(res.data.order.adminNote || '');
      setLoading(false);
    } catch (err) {
      showAlert({ title: "خطأ في تحميل البيانات", icon: "error" });
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.put(`/order/status/${id}`, { status: newStatus });
      fetchOrder();
      showAlert({ title: "تم تحديث حالة الطلب", icon: "success" });
    } catch (err) { showAlert({ title: "فشل التحديث", icon: "error" }); }
  };

const approvePayment = async () => {
  const confirm = await showAlertConfirm({
    title: "تأكيد عملية الدفع",
    text: "هل أنت متأكد من اعتماد الدفع لهذا الطلب؟",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، تأكيد الدفع",
    cancelButtonText: "إلغاء",
  });

  if (!confirm.isConfirmed) return;

  try {
    await api.put(`/order/approve/${id}`);

    showAlert({
      title: "تم تأكيد الدفع بنجاح",
      icon: "success"
    });

    fetchOrder();
  } catch (err) {
    showAlert({
      title: "فشل في تأكيد الدفع",
      icon: "error"
    });
  }
};

const rejectPayment = async () => {
  if (!rejectReason.trim()) {
    return showAlert({
      title: "برجاء إدخال سبب الرفض",
      icon: "warning"
    });
  }

  const confirm = await showAlertConfirm({
    title: "هل أنت متأكد؟",
    text: "سيتم رفض الدفع وإلغاء الطلب وتحويله إلى قيد الانتظار",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "نعم، تأكيد الرفض",
    cancelButtonText: "إلغاء",
  });

  if (!confirm.isConfirmed) return;

  try {
    await api.put(`/order/reject/${id}`, { reason: rejectReason });

    showAlert({
      title: "تم رفض الدفع بنجاح",
      text: "تم تحويل الطلب إلى قيد الانتظار",
      icon: "success"
    });

    fetchOrder();
    setRejectReason("")
  } catch (err) {
    showAlert({
      title: "حدث خطأ أثناء تنفيذ العملية",
      icon: "error"
    });
  }
};

  // const saveAdminNote = async () => {
  //   await api.put(`/order/note/${id}`, { note: adminNote });
  //   showAlert({ title: "تم حفظ الملاحظات الداخلية", icon: "success" });
  // };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!order) return <div className="p-10 text-center font-bold">الطلب غير موجود</div>;

return (
  <div className="p-4 md:p-10 bg-[#f1f5f9] min-h-screen font- text-slate-800" dir="rtl">
    
    {/* Header Section - أكثر أناقة */}
    <div className=" mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-2">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-all font-bold text-md mb-4"
        >
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /> 
          العودة للوحة التحكم
        </button>
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            طلب <span className="text-blue-600">#{order.orderNumber}</span>
          </h1>
          <div className={`px-4 py-1.5 rounded-full text-md font-black uppercase tracking-wider -sm ${
            order.status === 'delivered' ? 'bg-emerald-500 text-white' : 
            order.status === 'cancelled' ? 'bg-rose-500 text-white' : 'bg-blue-600 text-white'
          }`}>
            {order.status === 'pending' ? ' قيد الانتظار' :  order.status === 'delivered' ?"تم التوصيل" : order.status === 'cancelled' ? "تم الالغاء" :order.status === 'shipped'?"تم الشحن" :"تم التأكيد" }
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl -sm border border-slate-200/60">
        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
          <Calendar size={24} />
        </div>
        <div>
          <p className="text-md text-slate-400 font-black uppercase tracking-tighter">تاريخ إنشاء الطلب</p>
          <p className="text-lg font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
    </div>

    <div className="mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* Main Content (Right Side - 8 Columns) */}
      <div className="lg:col-span-8 space-y-8">
        
        {/* Customer & Shipping - بطاقات بتصميم عصري */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Profile */}
          <div className="bg-white rounded-xl p-8 -sm border border-slate-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white -lg -blue-200">
                  <User size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">بيانات الحساب</h3>
                  <p className="text-md text-blue-500 font-bold">معلومات العميل المسجل</p>
                </div>
              </div>
              <div className="space-y-6">
                <InfoRow label="اسم المستخدم" value={order.user?.userName || 'زائر'} />
                <div className="grid grid-cols-2 gap-4">
                  <InfoRow label="رقم الهاتف" value={order.user?.phoneNumber || '-'} isشركه />
                  <InfoRow label="البريد" value={order.user?.email || '-'} isTruncate />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Details */}
          <div className="bg-white rounded-xl p-8 -sm border border-slate-200/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>
            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-orange-500 rounded-xl flex items-center justify-center text-white -lg -orange-200">
                  <MapPin size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">تفاصيل الشحن</h3>
                  <p className="text-md text-orange-500 font-bold">وجهة التوصيل المحددة</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex justify-between items-center">
                  <div>
                    <p className="text-md font-black text-orange-400 uppercase mb-1">المستلم</p>
                    <p className="text-lg font-black text-slate-800">{order.customerName}</p>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-xl -sm font-شركه font-bold text-orange-600 border border-orange-100">
                    {order.phone}
                  </div>
                </div>
                    <InfoRow 
                      label="العنوان" 
                      value={
                        <div className="flex flex-col text-right gap-1">
                          <span>
                            {order.address.city}، {order.address.region}
                          </span>
                          <span className="text-slate-500 text-sm">
                            مبنى {order.address.building} • دور {order.address.floor ==null? "  غير مذكور   ":order.address.floor  }
                          </span>
                        </div>
                      }
                    />
                {order.address.notes && (
                  <div className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Info size={20} className="text-blue-500 shrink-0" />
                    <p className="text-md text-slate-600 font-medium italic">"{order.address.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Table - جدول بتصميم أنظف */}
        <div className="bg-white rounded-xl -sm border border-slate-200/50 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
                <Package size={20} />
              </div>
              <h3 className="font-black text-lg text-slate-800">المنتجات المطلوبة</h3>
            </div>
            <span className="text-md font-bold text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
              {order.items?.length} عناصر
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-md uppercase font-black">
                  <th className="p-6">المنتج</th>
                  <th className="p-6 text-center">الكمية</th>
                  <th className="p-6 text-center">سعر الوحدة</th>
                  <th className="p-6 text-left">المجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {order.items?.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="p-6">
<div className="flex flex-wrap items-center gap-2 text-right" dir="rtl">
      
      {/* اسم المنتج بتأثير حركي ناعم */}
      <p className="text-sm md:text-base font-black text-slate-800 tracking-wide group-hover:text-[#0284c7] transition-colors duration-200">
        {item.productName}
      </p>

      {/* شارة عرض خاص (Offer) */}
      {item.isOfferItem && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black bg-orange-50 text-orange-600 rounded-lg border border-orange-100/80 shadow-sm shadow-orange-100/50 transition-transform duration-200 hover:scale-105">
          <Sparkles size={12} className="text-orange-500 animate-pulse" />
          <span>{item.offerTitle}</span>
        </span>
      )}

      {/* شارة العرض المجمع (Combo) */}
      {item.isComboItem && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black bg-sky-50 text-sky-700 rounded-lg border border-sky-100/80 shadow-sm shadow-sky-100/50 transition-transform duration-200 hover:scale-105">
          <Package size={12} className="text-[#0284c7]" />
          <span>هذا المنتج من عروض الكومبو: <strong className="font-extrabold text-[#0284c7]">{item.comboTitle}</strong></span>
        </span>
      )}

    </div>
          
                      <p className="text-md text-slate-400 mt-1 font-bold">{item?.product?.description}</p>
                      <p className="text-md text-slate-400 mt-1 font-bold">{item.unit_type}</p>
                    </td>
                    <td className="p-6 text-center">
                      <span className="bg-slate-100 px-3 py-1 rounded-xl font-شركه font-bold text-slate-600">
                        x{item.quantity}
                      </span>
                      
                    </td>
                    <td className="p-6 text-center font-bold text-slate-600">{item.price} ج.م</td>
                    <td className="p-6 text-left font-black text-slate-900 text-lg">{item.subtotal} ج.م</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Financials Summary - فوتر داكن واحترافي */}
          <div className="p-8 bg-slate-900 text-white rounded-b-3xl mt-0 -xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"></div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                <div className="space-y-1">
                  <p className="text-slate-400 text-md font-black uppercase">المجموع الفرعي</p>
                  <p className="text-xl font-bold">{order.totalPrice} <span className="text-md font-normal opacity-60">ج.م</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 text-md font-black uppercase">رسوم الشحن</p>
                  <p className="text-xl font-bold"> + {order.shippingPrice} <span className="text-md font-normal opacity-60">ج.م</span></p>
                </div>

                <div className="space-y-1">
                  <p className="text-slate-400 text-md font-black uppercase"> الخصم </p>
                  <p className="text-xl font-bold"> - {order.discount} <span className="text-md font-normal opacity-60">ج.م</span></p>
                </div>


                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 text-left">
                  <p className="text-blue-300 text-md font-black uppercase mb-1 text-center md:text-left">الإجمالي النهائي</p>
                  <p className="text-4xl font-black text-white text-center md:text-left tracking-tighter">
                    {order.finalPrice} <span className="text-lg font-light">ج.م</span>
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Sidebar (Left Side - 4 Columns) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Status Card */}
        <div className="bg-white p-6 rounded-xl -sm border border-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <Truck size={20} />
            </div>
            <h3 className="font-black text-slate-800">إدارة حالة الطلب</h3>
          </div>
          <select 
            className="w-full p-4 bg-slate-50 border-2 border-transparent hover:border-blue-100 focus:border-blue-500 rounded-xl text-lg font-black outline-none transition-all cursor-pointer appearance-none -inner"
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
          >
            <option value="pending"> قيد الانتظار</option>
            <option value="confirmed"> تم التأكيد</option>
            <option value="shipped"> تم الشحن</option>
            <option value="delivered"> تم التوصيل</option>
     

          </select>

<div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
  <h4 className="text-md font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
    <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
    الجدول الزمني للطلب
  </h4>
  
  <div className="relative mr-2 border-r-2 border-slate-200 pr-6 space-y-6 py-2">
    <TimelineItem label="إنشاء الطلب" date={order.createdAt} isCompleted={true} />
    <TimelineItem label="تأكيد الطلب" date={order.confirmedAt} isCompleted={!!order.confirmedAt} />
    <TimelineItem label="خروج للشحن" date={order.shippedAt} isCompleted={!!order.shippedAt} />
    <TimelineItem label="تم التوصيل" date={order.deliveredAt} isCompleted={!!order.deliveredAt} />
  </div>
</div>
        </div>

        {/* Payment Card */}
{      <div className="bg-white rounded-xl -sm border border-slate-200/50 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30  flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <CreditCard size={20} />
              </div>
              <h3 className="font-black text-slate-800">حالة الدفع</h3>
            </div>

            <span
          className={`text-sm font-black px-3 py-1 rounded-full ${
            order.payment.status === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {order.payment.status === "paid" ? "مدفوع" : "غير مدفوع"}
        </span>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-md font-bold text-slate-400">طريقة الدفع</span>
              <span className="px-4 py-1 bg-slate-900 text-white rounded-full text-md font-black uppercase tracking-widest italic">{order.payment.method =="cash" ?"كاش" : " محفظة"}</span>
            </div>

            {order.payment.method === 'wallet' && (
              <div className="p-4 bg-emerald-600 rounded-xl text-white -lg -emerald-100 relative group overflow-hidden">
                <div className="relative z-10">
                  <p className="text-lg font-black uppercase opacity-80 mb-1">محفظة العميل</p>
                  <p className="text-xl font-black tracking-widest mb-3">{order.payment.walletPhone}</p>
                  {order.payment.proofImage?.url && (
                    <a href={order.payment.proofImage.url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-md font-bold transition-all border border-white/20">
                      <Eye size={16}/> عرض الأثبات
                    </a>
                  )}
                </div>
                <CreditCard size={80} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform" />
              </div>
            )}

  { order.status !="delivered"  &&           <div className="space-y-3 pt-4">
              <button 
                onClick={approvePayment} 
                disabled={order.payment.status === 'paid'}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 text-white rounded-xl font-black text-lg -lg -emerald-100 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={22} /> اعتماد الدفع
              </button>
              
     {        <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3 px-1">
                <label className="text-md font-black text-rose-600 uppercase tracking-tight flex items-center gap-2">
                  <AlertTriangle size={16} /> سبب رفض التحويل / الطلب
                </label>
                {rejectReason.length > 0 && (
                  <span className="text-[10px] font-bold text-rose-400 bg-rose-50 px-2 py-0.5 rounded-full">
                    مطلوب للإلغاء
                  </span>
                )}
              </div>

              <textarea 
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-rose-200 focus:bg-white rounded-2xl text-md outline-none transition-all h-24 placeholder:text-slate-400 placeholder:font-medium resize-none shadow-inner" 
                placeholder="مثال: رقم العملية غير صحيح، المبلغ غير مكتمل، أو تم إلغاء الطلب من قبل العميل..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />

              <div className="mt-4 group">
                <button 
                  disabled={ !rejectReason.trim()}
                  onClick={rejectPayment} 
                  className="w-full py-3.5 bg-white text-rose-600 font-black rounded-2xl transition-all border-2 border-rose-100 hover:bg-rose-600 hover:text-white hover:border-rose-600 hover:shadow-lg hover:shadow-rose-100 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden relative"
                >
                  <XCircle size={20} className="relative z-10" />
                  <span className="relative z-10">تأكيد رفض الطلب </span>
                  
                  {/* تأثير بسيط عند الهوفر لإعطاء إحساس بالخطر/التحذير */}
                  <div className="absolute inset-0 bg-rose-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
                
                {!rejectReason.trim() && order.payment.status !== 'paid' && (
                  <p className="text-center text-[10px] text-slate-400 mt-2 font-bold italic">
                    * يجب كتابة سبب الرفض أولاً لتفعيل الزر
                  </p>
                )}
              </div>
            </div>}
            </div>}
          </div>
        </div>}

      {order.payment.status === "rejected" && (
        <div className="mt-4 p-4 bg-red-50 rounded-xl flex items-start gap-3 shadow-sm transition-all animate-in fade-in slide-in-from-top-2">
          {/* أيقونة التحذير */}
          <div className="bg-red-100 p-2 rounded-lg text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          <div className="flex-1">
            <h4 className="text-sm font-black text-red-800 mb-1">
              تم إلغاء حالة الدفع
            </h4>
            {order.rejectionReason ? (
              <p className="text-sm text-red-600 font-medium">
                <span className="opacity-70 font-bold ml-1">السبب:</span>
                {order.rejectionReason}
              </p>
            ) : (
              <p className="text-xs text-red-500 italic">لا يوجد تفاصيل إضافية للرفض.</p>
            )}
          </div>
        </div>
      )}




        {/* Admin Notes */}
        {/* <div className="bg-slate-900 p-6 rounded-xl -xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
              <Edit3 size={16} />
            </div>
            <h3 className="font-black text-white text-md">ملاحظات داخلية</h3>
          </div>
          <textarea 
            className="w-full p-4 bg-slate-800 border-none rounded-xl text-slate-200 text-md focus:ring-1 focus:ring-slate-700 outline-none h-32 mb-4 placeholder:text-slate-600 -inner" 
            placeholder="هذه الملاحظات لا يراها العميل..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />
          <button 
            onClick={saveAdminNote} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black transition-all -lg -blue-900/20"
          >
            حفظ التغييرات
          </button>
        </div> */}

      </div>
    </div>
  </div>
);

// مكونات مساعدة بسيطة لتقليل تكرار الكود
function InfoRow({ label, value, isشركه, isTruncate }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-lg font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className={`text-base font-bold text-slate-700 ${isشركه ? 'font-شركه' : ''} ${isTruncate ? 'truncate' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function TimelineItem({ label, date, isCompleted }) {
  return (
    <div className="relative">
      {/* النقطة الجانبية */}
      <div className={`absolute -right-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 transition-colors duration-300 ${
        isCompleted ? 'bg-blue-600 ring-2 ring-blue-100' : 'bg-slate-300'
      }`} />

      <div className={`flex flex-col ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
        <span className={`text-md font-black ${isCompleted ? 'text-slate-800' : 'text-slate-500'}`}>
          {label}
        </span>
        
        {date ? (
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-md font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
              {new Date(date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="text-md font-medium text-slate-400">
              {new Date(date).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        ) : (
          <span className="text-[10px] font-medium text-slate-400 italic">بانتظار التحديث...</span>
        )}
      </div>
    </div>
  );
}
};

export default OrderDetail;