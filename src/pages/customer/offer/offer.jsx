import React, { useState, useEffect, useContext } from 'react';
import api from '../../../services/api'; 
import { showAlert } from '../../../services/alert';
import { MyContext } from '../../../context/cartContext'; 
import { Loader2, Search, Percent, Calendar, ShieldCheck, Flame, History, ShoppingCart, X, Plus, Minus, Inbox } from 'lucide-react';
import offer from "/offer.png"
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { showAlertConfirm } from '../../../services/alertConfirm';
export default function ClientOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("active");

  const [syncingProductId, setSyncingProductId] = useState(null);

  // الحالات الخاصة بالنافذة المنبثقة لاختيار الكمية
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [modalData, setModalData] = useState({
    product: null,
    offerPrice: 0,
    offerId: null,
    maxPerUser: 0,
    usedCount: 0,
    currentCartQuantity: 0,
    allowedRemaining: 0
  });
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { setCounts } = useContext(MyContext);

  const navigate=useNavigate();
  
     const isTokenValid = () => {
        const token = localStorage.getItem("token");
        if (!token) return false;
      
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
      
          if (decoded.exp <= currentTime) {
            localStorage.removeItem("token");
            localStorage.removeItem("userName");
            return false; 
          }
          
          return true; 
        } catch (err) {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          return false; 
        }
      };
  
  useEffect(() => {
    const getClientOffers = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get('/offer'); 
        if (response.data && response.data.offers) {
          setOffers(response.data.offers);
        }
      } catch (err) {
        setError(err.response?.data?.message || "حدث خطأ أثناء تحميل العروض الحالية");
      } finally {
        setLoading(false);
      }
    };
    getClientOffers();
  }, []);

  const updateGlobalCartCount = (cartItems) => {
    const totalCount = cartItems.length
    setCounts(totalCount);
  };


  const handleOpenQuantityModal = async (product, offerPrice, offerId) => {
            if (!isTokenValid()) {
          const alert = await showAlertConfirm({ 
            title: "يجب تسجيل الدخول", 
            text: "يجب عليك تسجيل الدخول أولاً لتتمكن من استعراض العروض وإضافة المنتجات إلى سلة التسوق.", 
            icon: "warning" 
          });
          
          if (alert.isConfirmed) {
            navigate("/تسجيل_الدخول");
          }
          return; 
        }
    if (syncingProductId === product._id) return;

    try {
      setSyncingProductId(product._id);

      // جلب البيانات المحدثة من الباك إند
      const response = await api.get(`/offer/checkOfferUsage/${offerId}/${product._id}`);
      const { maxPerUser, usedCount } = response.data.data;

      let localCart = JSON.parse(localStorage.getItem("cart")) || [];

      const existingItemIndex = localCart.findIndex(
        (item) => (item.product?._id || item.product) === product._id && item.isOffer === true
      );

      const currentCartQuantity = existingItemIndex !== -1 ? localCart[existingItemIndex].quantity : 0;
      const totalAllowedRemaining = Math.max(0, maxPerUser - usedCount);

      // حساب المتبقي الفعلي المتاح إضافته للسلة حالياً
      const actualRemainingToOrder = totalAllowedRemaining - currentCartQuantity;

      if (actualRemainingToOrder <= 0) {
        showAlert({
          icon: "warning",
          title: `عفواً، لقد استهلكت الحد الأقصى المسموح به لك وهو (${maxPerUser} قطع)! تم شراء ${usedCount} مسبقاً ولديك ${currentCartQuantity} في السلة.`
        });
        return;
      }

      // تجهيز بيانات الـ Modal وتثبيت الكمية الافتراضية بـ 1
      setModalData({
        product,
        offerPrice,
        offerId,
        maxPerUser,
        usedCount,
        currentCartQuantity,
        allowedRemaining: actualRemainingToOrder
      });
      setSelectedQuantity(1);
      setShowQuantityModal(true);

    } catch (err) {
      console.error(err);
      showAlert({
        icon: "error",
        title: err.response?.data?.message || "عذراً، فشل في التحقق من صلاحية العرض"
      });
    } finally {
      setSyncingProductId(null);
    }
  };


const handleConfirmAddToCart = async () => {
    const { product, offerPrice, maxPerUser } = modalData;
    
    try {
      let localCart = JSON.parse(localStorage.getItem("cart")) || [];

      // البحث عن المنتج في السلة المحلية (مع التأكد من مطابقة الـ isOffer)
      const existingItemIndex = localCart.findIndex(
        (item) => (item.product?._id || item.product) === product._id && item.isOffer === true
      );


      if (existingItemIndex !== -1) {
        localCart[existingItemIndex].quantity += selectedQuantity;
      } else {
        const newCartItem = {
          product: product, 
          quantity: selectedQuantity,
          unit_type: product.unit_type || "قطعة", 
          isOffer: true,          
          offerPrice: offerPrice, 
          maxPerUser: maxPerUser ,
          allowedRemaining: modalData.allowedRemaining || null,
        };
        localCart.push(newCartItem);
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      updateGlobalCartCount(localCart);


      const newItemPayload = {
        product: product._id,
        quantity: selectedQuantity,
        unit_type: product.unit_type || "قطعة",
        isOffer: true, 
        offerPrice: offerPrice || null,
        maxPerUser: maxPerUser || null,
        allowedRemaining: modalData.allowedRemaining || null,
        isCombo: false 
      };
      

      await api.post("/user/cart", { items: [newItemPayload] });

      setShowQuantityModal(false); 
      
      showAlert({
        icon: "success",
        title: `تم إضافة ${selectedQuantity} ${product.unit_type || 'قطعة'} بنجاح!`,
        time: 1500
      });

    } catch (err) {
      console.error(err);
      showAlert({
        icon: "error",
        title: "عذراً، فشل في حفظ السلة ومزامنتها"
      });
    }
  };

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch = (
      offer.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      offer.products?.some(p => p.product?.productName.toLowerCase().includes(searchQuery.toLowerCase()))||
      offer.products?.some(p => p.product?.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      offer.products?.some(p => p.product?.category.toLowerCase().includes(searchQuery.toLowerCase()))


    );
    


  
    const isLimitValid = offer.soldCount < offer.totalLimit;
    const isCustomerValid = !offer.maxCustomers || offer.customersUsed.length < offer.maxCustomers;
    
    const isOfferAvailable = offer.active  && isLimitValid && isCustomerValid;

    if (activeTab === "active") {
      return matchesSearch && isOfferAvailable;
    } else {
      return matchesSearch && !isOfferAvailable;
    }
  });

         useEffect (() => {
        document.title = " العروض والخصومات - نظام أبو الدهب";
      }, []);

return (
  <div className="mx-auto px-4 sm:px-6 py-10 bg-gray-50/60 min-h-screen text-right font-cairo selection:bg-sky-500 selection:text-white" dir="rtl">
    
    {/* البانر الرئيسي للمجلة */}
    <div
      className="rounded-3xl overflow-hidden min-h-[200px] md:min-h-[340px] xl:min-h-[420px] bg-cover bg-center bg-no-repeat relative mb-10 -lg -sky-900/5 flex items-end"
      style={{ backgroundImage: `url(${offer})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/20 to-transparent" />
    </div>

    {/* شريط التحكم: التبويبات وأداة البحث */}
    <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl -sm border border-gray-100/80 mb-8">
      <div className="flex bg-gray-100 p-1.5 rounded-xl w-full lg:w-auto">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex-1 lg:flex-none px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === "active"
              ? "bg-[#0284c7] text-white -sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
          }`}
        >
          <Flame size={16} className={activeTab === 'active' ? 'text-amber-400 animate-pulse' : ''} />
          المجلات والخصومات الحالية
        </button>

        {/* <button
          onClick={() => setActiveTab("expired")}
          className={`flex-1 lg:flex-none px-6 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            activeTab === "expired"
              ? "bg-[#0284c7] text-white -sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
          }`}
        >
          <History size={16} />
          أرشيف المجلات السابقة
        </button> */}
      </div>

      <div className="relative w-full lg:w-96">
        <input
          type="text"
          placeholder="ابحث عن مجلة، منتج، أو قسم داخل العروض..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-11 py-2.5 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0284c7]/20 focus:border-[#0284c7] bg-gray-50 focus:bg-white transition-all duration-200"
        />
        <Search className="absolute right-4 top-3.5 text-gray-400 w-4 h-4" />
      </div>
    </div>

    {/* رسالة الخطأ */}
    {error && (
      <div className="relative overflow-hidden p-4 bg-red-50/80 backdrop-blur-md text-red-900 rounded-2xl border border-red-100 text-right -sm mb-6 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-red-500 rounded-r-2xl"></div>
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
          <AlertTriangle size={16} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <h5 className="text-xs font-bold text-red-900 mb-0.5">حدث خطأ أثناء المعالجة</h5>
          <p className="text-[11px] md:text-xs font-medium text-red-700/90">{error}</p>
        </div>
        {typeof setError === 'function' && (
          <button onClick={() => setError(null)} className="flex-shrink-0 p-1 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-700 transition-colors">
            <X size={14} />
          </button>
        )}
      </div>
    )}

    {/* حالة التحميل والـ Skeletons */}
    {loading ? (
      <div className="space-y-8">
        {[1, 2].map((n) => (
          <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-gray-100 -sm"></div>
        ))}
      </div>
    ) : filteredOffers.length === 0 ? (
      /* شاشة القسم فارغ */
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 relative overflow-hidden flex flex-col items-center justify-center p-6 -sm">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-slate-50 rounded-full blur-3xl z-0"></div>
        <div className="relative z-10 flex flex-col items-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mb-4 -inner">
            <Inbox size={28} strokeWidth={1.5} className="text-gray-400 animate-bounce duration-1000" />
          </div>
          <h3 className="text-base md:text-lg font-bold text-slate-800 mb-2">القسم فارغ حالياً</h3>
          <p className="text-xs font-medium text-gray-400 leading-relaxed px-4">
            لا توجد مجلات عروض متوفرة في هذا القسم حالياً. يمكنك متابعة باقي الأقسام أو العودة لاحقاً لمشاهدة أحدث خصومات <span className="text-[#0284c7] font-bold">أبو الدهب</span>.
          </p>
        </div>
      </div>
    ) : (
      /* قائمة مجلات العروض والخصومات */
      <div className="space-y-8">
        {filteredOffers.map((offer) => {
          const startDateStr = new Date(offer.startDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
          const endDateStr = new Date(offer.endDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });

          const displayProducts = offer.products?.filter(item => {
            if (!item.product) return false;
            if (!searchQuery.trim()) return true;
            
            const matchesProduct = item.product.productName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = item.product.category?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDes = item.product.description?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesOfferTitle = offer.title.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesProduct || matchesCategory || matchesOfferTitle || matchesDes;
          }) || [];

          if (displayProducts.length === 0) return null;

          return (
            <div 
              key={offer._id} 
              className={`bg-white rounded-2xl -sm border overflow-hidden flex flex-col lg:flex-row hover:-md transition-all duration-300 ${
                activeTab === 'active' ? 'border-gray-100' : 'border-gray-200 opacity-80'
              }`}
            >
              {/* الجزء الأيمن: غلاف وصورة غلاف المجلة */}
              <div className="relative w-full lg:w-56 bg-gradient-to-br from-slate-50 to-slate-100 flex-shrink-0 min-h-[180px] lg:min-h-full border-b lg:border-b-0 lg:border-l border-gray-100 flex items-center justify-center overflow-hidden">
                {offer.image?.url ? (
                  <img 
                    src={offer.image.url} 
                    alt={offer.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <img 
                    src={"/offer.png"} 
                    alt={offer.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                )}
                
                <div className="absolute top-3 right-3 z-10">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md -sm text-white ${
                    activeTab === 'active' ? 'bg-emerald-600' : 'bg-gray-500'
                  }`}>
                    {activeTab === 'active' ? 'نشط ومتاح' : 'منتهي'}
                  </span>
                </div>
              </div>

              {/* الجزء الأيسر والأكبر: تفاصيل المجلة والمنتجات التابعة لها */}
              <div className="p-5 md:p-6 flex-1 flex flex-col justify-between min-w-0 text-right">
                <div>
                  {/* رأس الكارت (اسم المجلة والتواريخ) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-6 bg-[#0284c7] rounded-full"></span>
                      <h2 className="text-base md:text-lg font-black text-slate-800">
                        {offer.title}
                      </h2>
                    </div>
                    
                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400 font-medium">
                      <p className="flex items-center gap-1">
                        <Calendar size={12} /> <span>من:</span> <span className="text-gray-600 font-bold">{startDateStr}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <Calendar size={12} /> <span>إلى:</span> <span className="text-gray-600 font-bold">{endDateStr}</span>
                      </p>
                    </div>
                  </div>

                  {/* مساحة عرض المنتجات */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-1">
                      المنتجات المتاحة داخل المجله: 
                      {searchQuery.trim() && <span className="text-amber-600 font-bold text-[10px]">(نتائج مصفاة)</span>}
                    </p>
                    
                    {/* شبكة المنتجات (Grid العصرية البديلة للـ List القديمة) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto pl-1 pr-0.5 dir-scrollbar">
                      {displayProducts.map((item, index) => {
                        const prod = item.product;
                        const originalPrice = prod.unit_type === "قطعة" ? prod.pieceSellingPrice : prod.packageSellingPrice || 0;
                        const discountPercent = originalPrice > item.offerPrice 
                          ? Math.round(((originalPrice - item.offerPrice) / originalPrice) * 100) 
                          : 0;

                        const isThisProductSyncing = syncingProductId === prod._id;

                        return (
                          <div 
                            key={index} 
                            className="group bg-white border border-gray-100 hover:border-gray-200/80 rounded-2xl p-3 flex gap-3 hover:-md hover:-slate-200/30 transition-all duration-200 relative overflow-hidden"
                          >
                            {/* شارة الخصم العائمة فوق كارت المنتج */}
                            {discountPercent > 0 && (
                              <span className="absolute top-2 right-2 z-10 text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-md font-sans">
                                %{discountPercent}-
                              </span>
                            )}

                            {/* صورة المنتج */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50/60 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 flex items-center justify-center">
                              <img 
                                src={prod.image?.url || "/placeholder-product.png"} 
                                alt={prod.productName} 
                                className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>

                            {/* تفاصيل المنتج وأسعاره */}
                            <div className="flex flex-col justify-between flex-1 min-w-0">
                              <div className="space-y-0.5">
                                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{prod.productName}</h4>
                                <p className="text-[11px] text-slate-400 line-clamp-1">{prod.description}</p>
                                
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 pt-0.5">
                                  <span className="bg-slate-100 px-1 py-0.5 rounded text-slate-500">{prod.category}</span>
                                  <span>•</span>
                                  <span>{prod.unit_type || "قطعة"}</span>
                                </div>
                              </div>

                              {/* الأسعار وزر الإضافة */}
                              <div className="flex justify-between items-end gap-1 mt-2 pt-1.5 border-t border-gray-50">
                                <div className="font-sans">
                                  <span className="text-xs font-black text-emerald-600 block">
                                    {item.offerPrice} <small className="text-[9px] font-bold font-cairo text-emerald-700">ج.م</small>
                                  </span>
                                  {originalPrice > item.offerPrice && (
                                    <span className="text-[9px] text-gray-400 line-through block">
                                      {originalPrice} ج.م
                                    </span>
                                  )}
                                </div>

                                {activeTab === "active" && (
                                  <button
                                    type="button"
                                    disabled={isThisProductSyncing}
                                    onClick={() => handleOpenQuantityModal(prod, item.offerPrice, offer._id)}
                                    className="bg-[#0284c7] hover:bg-slate-900 disabled:bg-gray-200 text-white p-2 rounded-lg -sm transition-all duration-200 flex items-center justify-center active:scale-[0.95]"
                                    title="أضف للسلة"
                                  >
                                    {isThisProductSyncing ? (
                                      <Loader2 size={13} className="animate-spin text-white" />
                                    ) : (
                                      <ShoppingCart size={13} className="text-white" />
                                    )}
                                  </button>
                                )}
                              </div>
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
        })}
      </div>
    )}

    {/* ==================== نافذة اختيار الكمية المنبثقة (Quantity Modal) ==================== */}
    {showQuantityModal && modalData.product && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
        <div className="bg-white w-full max-w-sm rounded-2xl p-5 -xl border border-gray-50 transform scale-100 transition-transform duration-300 text-right animate-in fade-in zoom-in-95 duration-200 dir-rtl">
          
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-3">
            <h3 className="text-sm md:text-base font-bold text-slate-800 flex items-center gap-1.5">
              <span><ShoppingCart/></span> تحديد كمية العرض
            </h3>
            <button 
              onClick={() => setShowQuantityModal(false)}
              className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100/70">
            <h4 className="text-xs font-bold text-slate-800 mb-0.5">{modalData.product.productName}</h4>
            <p className="text-xs text-emerald-600 font-bold">السعر بالعرض: {modalData.offerPrice} ج.م</p>
            

            
          </div>

          {/* جدول الحسابات الذكي بالمودال */}
          <div className="space-y-2 border border-amber-100 bg-amber-50/20 rounded-xl p-3 text-[11px] font-bold text-slate-600 mb-5">
            <div className="flex justify-between">
              <span className="text-gray-400">الحد الأقصى المسموح لك:</span>
              <span className="text-slate-800">{modalData.maxPerUser} {modalData.product.unit_type || 'قطعة'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">اشتريت مسبقاً:</span>
              <span className="text-slate-800">{modalData.usedCount || 0} {modalData.product.unit_type || 'قطعة'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">موجود بالسلة حالياً:</span>
              <span className="text-slate-800">{modalData.currentCartQuantity || 0} {modalData.product.unit_type || 'قطعة'}</span>
            </div>
            <div className="border-t border-amber-200/40 my-1.5 pt-1.5 flex justify-between text-amber-800 font-black text-xs">
              <span>المتاح لك إضافته الآن:</span>
              <span className="text-amber-900 font-sans">
                {modalData.allowedRemaining} {modalData.product.unit_type || 'قطعة'}
              </span>
            </div>
          </div>

          {/* عداد التحكم في الكمية */}
          <div className="flex flex-col items-center justify-center gap-1.5 mb-5">
            <span className="text-[11px] font-bold text-gray-400">الكمية المطلوبة</span>
            <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
              <button
                type="button"
                disabled={selectedQuantity >= modalData.allowedRemaining}
                onClick={() => setSelectedQuantity(prev => prev + 1)}
                className="w-8 h-8 rounded-lg bg-white text-slate-800 hover:bg-gray-100 font-bold flex items-center justify-center -sm border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                <Plus size={14} />
              </button>
              
              <span className="text-base font-bold font-sans text-slate-800 w-10 text-center select-none">
                {selectedQuantity}
              </span>

              <button
                type="button"
                disabled={selectedQuantity <= 1}

                onClick={() => setSelectedQuantity(prev => Math.max(1, prev - 1))}
                className="w-8 h-8 rounded-lg bg-white text-slate-800 hover:bg-gray-100 font-bold flex items-center justify-center -sm border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all"
              >
                <Minus size={14} />
              </button>
            </div>
          </div>

          {/* أزرار الحفظ أو الإلغاء */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleConfirmAddToCart}
              className="flex-1 bg-[#0284c7] hover:bg-slate-900 text-white py-2.5 rounded-xl font-bold text-xs -sm transition-all duration-200 active:scale-[0.99]"
            >
              تأكيد وإضافة للسلة
            </button>
            <button
              type="button"
              onClick={() => setShowQuantityModal(false)}
              className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2.5 rounded-xl font-bold text-xs transition-all duration-200"
            >
              إلغاء
            </button>
          </div>

        </div>
      </div>
    )}
  </div>
);
}