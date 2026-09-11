import React, { useEffect, useState, useCallback, useRef } from 'react';
import api from '../../../services/api';
import Swal from 'sweetalert2';
import { Eye, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrackOrderSystem = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loading2, setLoading2] = useState(false); // لويدر خاص بقائمة الطلبات
  const [detailLoading, setDetailLoading] = useState(false); // لويدر مخصص لتفاصيل الطلب
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [err, setErr] = useState(null);
  const [cancelLod, setCancelLod] = useState(false);

  const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);
const sidebarRef = React.useRef(null);

  const navigate = useNavigate();
const fetchOrders = async (pageNumber = 1) => {
  try {
    if (pageNumber === 1) {setLoading2(true);
     
    }
    else setLoadingMore(true);

    const res = await api.get(
      `/order?page=${pageNumber}&limit=20&search=${searchTerm}&status=${statusFilter}`
    );

    const newOrders = res.data.orders || [];

    if (pageNumber === 1) {
      setOrders(newOrders);

      if (newOrders.length > 0) {
        fetchOrderDetails(newOrders[0]._id);
      }
    } else {
      setOrders((prev) => [...prev, ...newOrders]);
    }

    setHasMore(res.data.hasMore);
    setPage(pageNumber);

  } catch (err) {
    setErr(err.response?.data || { message: "حدث خطأ أثناء جلب الطلبات" });
  } finally {
     setLoading2(false)
    setLoadingMore(false);
    setLoading(false);
  }
};

const loadMore = async () => {
  if (loadingMore || !hasMore) return;

  const nextPage = page + 1;

  await fetchOrders(nextPage);
};
const scrollTimeout = useRef(null);

const handleScroll = () => {
  const el = sidebarRef.current;
  if (!el || loadingMore || !hasMore) return;

  if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

  scrollTimeout.current = setTimeout(() => {
    const isBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

    if (isBottom) {
      loadMore();
    }
  }, 100);
};

useEffect(() => {
  fetchOrders();
}, [searchTerm, statusFilter]);


  // 2. جلب تفاصيل طلب معين بناءً على الـ ID من الـ Endpoint الجديد
  const fetchOrderDetails = useCallback(async (id) => {
    try {
      setDetailLoading(true);
      const res = await api.get(`/order/my/${id}`);
      // افتراضاً أن الـ Endpoint بيرجع كائن الطلب مباشرة أو داخل خاصية order
      const orderData = res.data.order || res.data;
      setSelectedOrder(orderData);
    } catch (err) {
      console.error("Error fetching order details", err);
      Swal.fire('خطأ!', 'فشل في تحميل تفاصيل الطلب المختار.', 'error');
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

        useEffect(() => {
      document.title = " تتبع الطلبات - نظام أبو الدهب";
    }, []);

  // عند الضغط يدوياً على أي طلب من القائمة
  const handleOrderClick = (order) => {
    fetchOrderDetails(order._id);
  };

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: 'إلغاء الطلب؟',
      text: "هل أنت متأكد من إلغاء هذا الطلب؟",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، قم بالإلغاء',
      cancelButtonText: 'لا، تراجع'
    });

    if (result.isConfirmed) {
      try {
        setCancelLod(true);
        await api.patch(`/order/cancel/${id}`, { status: 'cancelled' });
        
        Swal.fire('تم الإلغاء!', 'تم إلغاء طلبك بنجاح.', 'success');
        
        // إعادة جلب القائمة وتحديث الطلب الحالي ليظهر ملغي
        fetchOrders();
      } catch (err) {
        Swal.fire('فشل!', 'حدث خطأ أثناء محاولة إلغاء الطلب.', 'error');
      } finally {
        setSelectedOrder(null);
        setCancelLod(false);
      }
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      pending: 'status-pending',
      confirmed: 'status-shipped',
      shipped: 'status-shipped',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return classes[status] || 'status-pending';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'قيد الانتظار',
      confirmed: 'تم التأكيد',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي'
    };
    return texts[status] || status;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-red-500 text-xl font-bold">
        {err.message || "حدث خطأ ما"}
      </div>
    );
  }

  return (
    <div className="font-['cairo'] bg-[#F3F4F6] min-h-screen text-right" dir="rtl">
      <main className="mx-auto py-8 px-4 md:px-8">
        <section className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar - Orders List */}
          <aside className="w-full lg:w-[380px] flex flex-col gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-8">
              <div className="p-6 bg-white border-b border-gray-50">
                <h2 className="text-xl font-black text-slate-800 mb-5 flex items-center gap-2">
                  <i className="fas fa-box-open text-blue-600"></i> طلباتي
                </h2>
                
                <div className="space-y-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="ابحث برقم الطلب..."
                      className="w-full pr-11 pl-4 py-3 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>

                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="pending">قيد الانتظار</option>
                    <option value="confirmed">مؤكد</option>
                    <option value="shipped">تم الشحن</option>
                    <option value="delivered">تم التوصيل</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>

                <div
                  
                  ref={sidebarRef}
                  onScroll={handleScroll}
                  className="p-3 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar"
                >
                                {filteredOrders.map((order) => (
                                  <div 
                                    key={order._id}
                                    onClick={() => handleOrderClick(order)}
                                    className={`group p-4 rounded-lg transition-all cursor-pointer border-2 ${
                                      selectedOrder?._id === order._id 
                                        ? 'border-blue-600 bg-blue-50/50' 
                                        : 'border-transparent hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <span className={`font-bold ${selectedOrder?._id === order._id ? 'text-blue-700' : 'text-slate-700'}`}>
                                        #{order.orderNumber}
                                      </span>
                                      <span className="text-[10px] text-gray-400 font-medium">
                                        {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                      <div>
                                        <p className="text-xs text-gray-500 mb-1 italic">إجمالي المبلغ</p>
                                        <p className={`font-black text-sm ${selectedOrder?._id === order._id ? 'text-blue-800' : 'text-slate-900'}`}>
                                          {order.finalPrice} ج.م
                                        </p>
                                      </div>
                                      <span className={`text-[10px] px-3 py-1 rounded-lg font-bold ${getStatusClass(order.status)}`}>
                                        {getStatusText(order.status)}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                                {loadingMore && (
                  <p className="text-center text-xs text-gray-400 py-2">
                    جاري تحميل المزيد...
                  </p>
                )}
                {
                  !loadingMore && !hasMore && filteredOrders.length > 0 && (
                    <p className="text-center text-xs text-gray-400 py-2">
                      لا توجد طلبات أخرى للتحميل
                    </p>
                  )

                }
                {
                  loading2 && (
                    <div className="text-center py-6">
                      <i className="fas fa-spinner fa-spin text-2xl text-blue-500 mb-2"></i>
                      <p className="text-sm text-gray-400">جاري تحميل الطلبات...</p>
                    </div>

                  )
                }

                {filteredOrders.length === 0 && (
                  <p className="text-center text-sm text-gray-400 py-6">لا توجد طلبات مطابقة</p>
                )}
                
              </div>
            </div>
          </aside>

          {/* Main Content - Order Details */}
          <div className="flex-1 min-h-[400px] relative">
            {detailLoading ? (
              /* لودر داخلي مخصص لعرض التفاصيل الجديدة بسلاسة */
              <div className="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-lg flex justify-center items-center z-20">
                <div className="text-center">
                  <i className="fas fa-spinner fa-spin text-3xl text-blue-600 mb-2"></i>
                  <p className="text-sm font-bold text-slate-600">جاري تحميل كامل تفاصيل الطلب...</p>
                </div>
              </div>
            ) : null}

            {selectedOrder ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                
                {/* 1. Header Card */}
                <div className="bg-[#0f172a] rounded-lg p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <i className="fas fa-file-invoice absolute -bottom-10 -left-10 text-[150px] rotate-12"></i>
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/10">
                        <i className="fas fa-receipt text-2xl text-blue-400"></i>
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-black tracking-tighter text-white">طلب #{selectedOrder.orderNumber}</h2>
                          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${getStatusClass(selectedOrder.status)}`}>
                            {getStatusText(selectedOrder.status)}
                          </span>
                          <button 
                            onClick={() => navigate(`/order/${selectedOrder._id}`)}
                            className="p-2 text-slate-400 hover:text-white rounded-xl transition-all"
                          >
                            <Printer size={25} />
                          </button>
                        </div>
                        <p className="text-slate-400 text-xs mt-1 font-bold">بتاريخ {new Date(selectedOrder.createdAt).toLocaleString('ar-EG')}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-slate-400 font-bold tracking-widest uppercase">المبلغ الإجمالي</span>
                      <div className="text-3xl font-black text-blue-400 tabular-nums">
                        {selectedOrder.finalPrice?.toLocaleString()} <small className="text-xs">ج.م</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  
                  {/* 2. Timeline Section */}
                  <div className="xl:col-span-4 bg-white rounded-lg p-8 shadow-sm border border-gray-100 h-fit">
                    <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                      <i className="fas fa-stream text-blue-600"></i> مسار الطلب
                    </h3>
                    
                    <div className="relative pr-2">
                      <div className="absolute right-[13px] top-2 bottom-2 w-[2px] bg-slate-50"></div>
                      
                      {selectedOrder.status === 'cancelled' ? (
                        <div className="space-y-6">
                          <div className="relative flex items-start gap-6">
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center z-10 bg-red-500 shadow-lg shadow-red-200 text-white">
                              <i className="fas fa-times text-[10px]"></i>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-black text-red-600">تم إلغاء الطلب</h4>
                              <p className="text-[10px] text-gray-400 mt-1 italic">
                                بتاريخ: {selectedOrder.cancelledAt ? new Date(selectedOrder.cancelledAt).toLocaleString('ar-EG') : 'غير محدد'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-4">
                            <div className="flex items-center gap-2 mb-2 text-red-700">
                              <i className="fas fa-exclamation-circle text-sm"></i>
                              <span className="text-xs font-black uppercase">سبب الإلغاء</span>
                            </div>
                            <p className="text-sm text-red-600 leading-relaxed font-bold">
                              {selectedOrder.rejectionReason 
                                ? `الإدارة: ${selectedOrder.rejectionReason}` 
                                : "تم الإلغاء بواسطة العميل (User)."}
                            </p>
                          </div>
                        </div>
                      ) : (
                        [
                          { key: 'pending', label: 'قيد المراجعة', icon: 'fa-clock' },
                          { key: 'confirmed', label: 'تم التأكيد', icon: 'fa-check-double' },
                          { key: 'shipped', label: 'خرج للشحن', icon: 'fa-truck-fast' },
                          { key: 'delivered', label: 'تم الاستلام', icon: 'fa-gift' }
                        ].map((step, idx) => {
                          const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered'];
                          const currentIdx = statusOrder.indexOf(selectedOrder.status);
                          const isDone = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;

                          return (
                            <div key={idx} className="relative flex items-start gap-6 mb-10 last:mb-0 group">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center z-10 transition-all duration-500 ${
                                isDone 
                                  ? 'bg-[#0f172a] shadow-xl shadow-slate-200 text-white' 
                                  : 'bg-white border-2 border-slate-100 text-slate-200'
                              } ${isCurrent ? 'ring-4 ring-blue-50 scale-110' : ''}`}>
                                <i className={`fas ${step.icon} text-[10px]`}></i>
                              </div>
                              <div className="flex-1">
                                <h4 className={`text-sm font-black transition-colors ${isDone ? 'text-slate-800' : 'text-slate-300'}`}>
                                  {step.label}
                                </h4>
                                {isDone && (
                                  <p className={`text-[10px] font-bold mt-1 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                                    {isCurrent ? 'نشط الآن' : 'مكتمل'}
                                  </p>
                                )}

                                {idx === 0 && selectedOrder.createdAt && (
                                  <p className="text-[10px] font-bold mt-1 text-slate-400">{formatDate(selectedOrder.createdAt)}</p>
                                )}
                                {idx === 1 && selectedOrder.confirmedAt && (
                                  <p className="text-[10px] font-bold mt-1 text-slate-400">{formatDate(selectedOrder.confirmedAt)}</p>
                                )}
                                {idx === 2 && selectedOrder.shippedAt && (
                                  <p className="text-[10px] font-bold mt-1 text-slate-400">{formatDate(selectedOrder.shippedAt)}</p>
                                )}
                                {idx === 3 && selectedOrder.deliveredAt && (
                                  <p className="text-[10px] font-bold mt-1 text-slate-400">{formatDate(selectedOrder.deliveredAt)}</p>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* 3. Details Section */}
                  <div className="xl:col-span-8 space-y-6">
                    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 overflow-hidden relative">
                      <div className="grid md:grid-cols-2 gap-10">
                        {/* بيانات الاستلام */}
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span> بيانات الاستلام
                          </h4>
                          <div className="space-y-4">
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">الاسم الكامل</p>
                              <p className="text-sm font-black text-slate-800">{selectedOrder.customerName}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">رقم التواصل</p>
                              <p className="text-sm font-bold text-slate-800 tracking-wider">{selectedOrder.phone}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">العنوان بالتفصيل</p>
                              <p className="text-sm font-bold text-slate-800 leading-relaxed">
                                {selectedOrder.address?.city}، {selectedOrder.address?.region}<br/>
                                {selectedOrder.address?.street}، بناء {selectedOrder.address?.building}، دور {selectedOrder.address?.floor}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* ملخص الحساب */}
                        <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-600 rounded-full"></span> ملخص الحساب
                          </h4>
                          <div className="bg-slate-50/50 rounded-lg p-5 space-y-3 border border-slate-100">
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                              <span>إجمالي المنتجات</span>
                              <span className="text-slate-800">{selectedOrder.totalPrice} ج.م</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                              <span>مصاريف الشحن</span>
                              <span className="text-emerald-600">+{selectedOrder.shippingPrice || 0} ج.م</span>
                            </div>


                            {selectedOrder.discount > 0 && (
                              <div className="flex justify-between text-xs font-bold text-red-500">
                                <span>خصم</span>
                                <span>-{selectedOrder.discount} ج.م</span>
                              </div>
                            )}

                                                                                      <div className="h-[1px] bg-slate-200 my-2 border-dashed border-t"></div>
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                              <span> الأجمالي </span>
                              <span className="text--600">{selectedOrder.finalPrice || 0} ج.م</span>
                            </div>
                            <div className="h-[1px] bg-slate-200 my-2 border-dashed border-t"></div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-black text-slate-800">طريقة الدفع</span>
                              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black">
                                {selectedOrder.payment?.method === 'wallet' ? 'محفظة' : 'كاش'}
                              </span>
                              <span className={`text-sm font-black px-3 py-1 rounded-full ${
                                selectedOrder.payment?.status === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {selectedOrder.payment?.status === "paid" ? "مدفوع" : "غير مدفوع"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* صورة إثبات التحويل */}
                    {selectedOrder.payment?.method !== "cash" && (
                      <div className="bg-blue-50/50 border border-blue-100 rounded-[1.5rem] p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            <Eye size={20} />
                          </div>
                          <h3 className="font-black text-blue-800 text-lg">صورة إثبات التحويل</h3>
                        </div>

                        {selectedOrder.payment?.proofImage?.url ? (
                          <div className="relative group">
                            <img
                              loading="lazy"
                              src={selectedOrder.payment.proofImage.url}
                              alt="صورة الإثبات"
                              className="w-full max-h-[350px] object-contain rounded-xl border border-blue-100 shadow-sm"
                            />
                            <a
                              href={selectedOrder.payment.proofImage.url}
                              target="_blank"
                              rel="noreferrer"
                              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-xl"
                            >
                              <span className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold text-sm">عرض بالحجم الكامل</span>
                            </a>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400 italic">لا يوجد صورة إثبات مرفقة</p>
                        )}
                      </div>
                    )}

                    {/* الأصناف المطلوبة */}
                    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100">
                      <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                        <i className="fas fa-shopping-basket text-blue-500"></i>
                        الأصناف المطلوبة
                        <span className="text-xs bg-slate-100 text-slate-400 px-2 py-0.5 rounded-lg mr-auto">
                          {selectedOrder.items?.length || 0} Items
                        </span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedOrder.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="relative flex gap-4 p-4 rounded-[1.5rem] bg-slate-50/50 border border-transparent hover:border-blue-100 hover:bg-white transition-all group duration-300"
                          >
                            {(item.isOfferItem || item.isComboItem) && (
                              <div className={`absolute top-0 left-0 px-3 py-1 rounded-full text-white text-xs font-bold shadow-md ${item.isOfferItem ? "bg-blue-500" : "bg-purple-500"}`}>
                                {item.isOfferItem ? item.offerTitle : item.comboTitle}
                              </div>
                            )}

                            <div className="w-20 h-20 rounded-lg overflow-hidden shadow-sm flex-shrink-0 relative">
                              <img
                                loading="lazy"
                                src={item.product?.image?.url || "/placeholder.png"}
                                alt="order item"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute top-0 right-0 bg-slate-900 text-white text-sm font-black px-2 py-1 rounded-bl-lg">
                                {item.quantity}
                              </div>
                            </div>

                            <div className="flex flex-col justify-between py-1 flex-1">
                              <h4 className="text-sm font-black text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-1">
                                {item.productName}
                              </h4>
                              <h5 className="text-sm text-slate-500 line-clamp-2">
                                {item.product?.description}
                              </h5>
                              <p className="text-[10px] text-slate-400 font-bold uppercase">
                                {item.unit_type} | السعر: {item.price} ج.م
                              </p>
                              <p className="text-sm font-black text-slate-900 italic">
                                {item.subtotal} ج.م
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* أزرار الإلغاء */}
                    {selectedOrder.status === 'pending' && !cancelLod && (
                      <button 
                        onClick={() => handleCancel(selectedOrder._id)}
                        className="w-full py-4 rounded-lg bg-white border-2 border-red-50 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        إلغاء هذا الطلب نهائياً
                      </button>
                    )}
                    {selectedOrder.status === 'pending' && cancelLod && (
                      <div className="w-full py-4 rounded-lg bg-slate-200 text-slate-500 font-black text-xs uppercase text-center tracking-widest transition-all shadow-sm">
                        ...............جاري الإلغاء
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 text-slate-200">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <i className="fas fa-mouse-pointer text-3xl opacity-20"></i>
                </div>
                <p className="text-xl font-black opacity-40 tracking-tighter italic">اختر طلب من القائمة اليمنى</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        
        .status-pending { background-color: #FEF3C7; color: #92400E; }
        .status-confirmed { background-color: #E0F2FE; color: #0369A1; }
        .status-shipped { background-color: #E0E7FF; color: #4338CA; }
        .status-delivered { background-color: #DCFCE7; color: #15803D; }
        .status-cancelled { background-color: #FEE2E2; color: #B91C1C; }
      `}</style>
    </div>
  );
};

export default TrackOrderSystem;