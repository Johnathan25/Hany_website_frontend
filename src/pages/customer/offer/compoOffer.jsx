import React, { useState, useEffect, useContext } from 'react';
import api from '../../../services/api'; 
import { showAlert } from '../../../services/alert';
import { MyContext } from '../../../context/cartContext'; 
import { Loader2, Search, Percent, ShieldCheck, ShoppingCart, X, Plus, Minus, Inbox, Layers, Calendar, Info, Box, BoxIcon } from 'lucide-react';
import offer from "/combo.png";
import { BiDetail } from 'react-icons/bi';
import { jwtDecode } from 'jwt-decode';
import { showAlertConfirm } from '../../../services/alertConfirm';
import { useNavigate } from 'react-router-dom';

export default function ComboOffersList() {
  const [comboOffers, setComboOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [syncingId, setSyncingId] = useState(null);
  const navigate=useNavigate()
  // حالات النافذة المنبثقة لتحديد الكمية
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    title: "",
    items: [],
    finalPrice: 0,
    originalPrice: 0,
    discountPercentage: 0,
    maxPerUser: 1,
    usedCount: 0,
    currentCartQuantity: 0,
    allowedRemaining: 0
  });
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { setCounts } = useContext(MyContext);

  // 1. جلب عروض الكومبو من الباك إند
  useEffect(() => {
    const fetchComboOffers = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get('/compoOffer');
        
        if (response.data && response.data.combos) {
          setComboOffers(response.data.combos);
        } else if (response.data && response.data.comboOffers) {
          setComboOffers(response.data.comboOffers);
        } else if (response.data && response.data.data) {
          setComboOffers(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching combos:", err);
        setError("حدث خطأ أثناء تحميل العروض المجمعة (Combo Offers)");
      } finally {
        setLoading(false);
      }
    };

    fetchComboOffers();
  }, []);

  // تحديث عدد العناصر في أيكونة السلة العلوية
  const updateGlobalCartCount = (cartItems) => {
    setCounts(cartItems.length);
  };

  // مساعد لحساب أسعار الكومبو ونسبة الخصم بدقة
  const calculatePrices = (combo) => {
    const originalPrice = combo.items?.reduce((sum, item) => {
      const isCarton = item.unit_type === 'كرتونة';
      const price = isCarton 
        ? (item.product?.packageSellingPrice || 0) 
        : (item.product?.pieceSellingPrice || 0);
      return sum + (price * item.quantity);
    }, 0) || 0;

    let finalPrice = originalPrice;
    if (combo.discountType === 'percentage') {
      finalPrice = originalPrice - (originalPrice * (combo.discountValue / 100));
    } else if (combo.discountType === 'fixed') {
      finalPrice = Math.max(0, originalPrice - combo.discountValue);
    }

    const discountPercentage = originalPrice > finalPrice ? ((originalPrice - finalPrice) / originalPrice) : 0;

    return {
      originalPrice: Number(originalPrice.toFixed(2)),
      finalPrice: Number(finalPrice.toFixed(2)),
      discountPercentage: discountPercentage // النسبة ككسر عشري لاستخدامها في حساب سعر القطعة المنفردة
    };
  };


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


       useEffect (() => {
        document.title = " العروض المجمعة - نظام أبو الدهب";
      }, []);

  // 2. معالجة فتح المودال والتحقق من الـ Usage
  const handleOpenComboModal = async (combo) => {

        if (!isTokenValid()) {
      const alert = await showAlertConfirm({ 
        title: "يجب تسجيل الدخول", 
        text: " يجب عليك تسجيل الدخول أولاً لتتمكن من استعراض العروض المجمعة المتاحة وإضافة المنتجات إلى سلة التسوق.", 
        icon: "warning" 
      });
      
      if (alert.isConfirmed) {
        navigate("/تسجيل_الدخول");
      }
      return; 
    }
    if (syncingId === combo._id) return;



    try {
      setSyncingId(combo._id);
      
      const response = await api.get(`/compoOffer/${combo._id}/usage`);
      const usageData = response.data.data; 
      
      const usedCount = usageData.usedCount || 0;
      const allowedRemaining = usageData.remaining || 0;
      const canTake = usageData.canTake;

      if (!canTake || allowedRemaining <= 0) {
        showAlert({
          icon: "warning",
          title: `عفواً، لقد استهلكت الحد الأقصى المسموح لك من هذا العرض المجمع!`
        });
        return;
      }




      let localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = localCart.find(item => item.comboId === combo._id && item.isCombo === true);
      const currentCartQuantity = existingItem ? existingItem.quantity : 0;

      const actualRemainingToOrder = allowedRemaining - currentCartQuantity;

      if (actualRemainingToOrder <= 0) {
        showAlert({
          icon: "warning",
          title: `العرض موجودة بالفعل في السلة بالحد الأقصى المتاح لك حالياً (${allowedRemaining} عرضة).`
        });
        return;
      }

      const { originalPrice, finalPrice, discountPercentage } = calculatePrices(combo);

      setModalData({
        id: combo._id,
        title: combo.title,
        items: combo.items,
        finalPrice: finalPrice,
        originalPrice: originalPrice,
        discountPercentage: discountPercentage,
        maxPerUser: combo.maxPerUser || (usedCount + allowedRemaining),
        usedCount: usedCount,
        currentCartQuantity: currentCartQuantity,
        allowedRemaining: actualRemainingToOrder 
      });
      
      setSelectedQuantity(1);
      setShowQuantityModal(true);
      
    } catch (err) {
      console.error("Error validating combo usage:", err);
      showAlert({ icon: "error", title: "فشل في التحقق من صلاحية العرض من السيرفر" });
    } finally {
      setSyncingId(null);
    }
  };

  // 3. تأكيد إضافة الكومبو بالكامل إلى السلة ومالزامنتها
  const handleConfirmAddToCart = async () => {
    try {
      let localCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = localCart.findIndex(item => item.comboId === modalData.id && item.isCombo === true);

      const itemsPayload = modalData.items.map(i => ({
        product: i.product?._id || i.product,
        productName: i.product?.productName,
        quantity: i.quantity,
        unit_type: i.unit_type || "قطعة",

      }));

      if (existingItemIndex !== -1) {
        localCart[existingItemIndex].quantity += selectedQuantity;
      } else {
        localCart.push({
          comboId: modalData.id,
          title: modalData.title,
          isCombo: true,
          quantity: selectedQuantity,
          offerPrice: modalData.finalPrice,
          items: itemsPayload,
         
        });
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      updateGlobalCartCount(localCart);

      const newItemPayload = {
        isCombo: true,
        comboId: modalData.id,
        title: modalData.title,
        quantity: selectedQuantity,
        offerPrice: modalData.finalPrice,
        items: itemsPayload,
          allowedRemaining: modalData.allowedRemaining 

      };
      
      await api.post("/user/cart", { items: [newItemPayload] });

      setShowQuantityModal(false); 
      showAlert({ icon: "success", title: "تم إضافة العرض المجمع بنجاح!", time: 1500 });
    } catch (err) {
      console.error(err);
      showAlert({ icon: "error", title: "فشل في مزامنة السلة مع الحساب المعرف" });
    }
  };

  // 4. فلترة وعمل بحث في العروض المجمعة
  const filteredCombos = comboOffers.filter((combo) => {
    const matchesSearch = (
      combo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      combo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      combo.items?.some(i => i.product?.productName?.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    const now = new Date();
    const isAvailable = combo.active && (now >= new Date(combo.startDate) && now <= new Date(combo.endDate));
    
    return matchesSearch && isAvailable;
  });

  return (
    <div className="mx-auto px-4 py-8 bg-gray-50/40 min-h-screen text-right font-cairo" dir="rtl">
      
      <div
        className="rounded-xl overflow-hidden min-h-[220px] md:min-h-[380px] xl:min-h-[480px] bg-cover bg-center bg-no-repeat relative mb-10 flex items-end"
        style={{ backgroundImage:`url(${offer})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900/40 via-transparent to-transparent"/>
      </div>

      {/* الرأس والبحث */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/80 backdrop-blur-md p-5 rounded-xl border border-gray-100 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 text-[#0284c7] rounded-xl">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black text-slate-800">العروض المجمعة الاقتصادية</h1>
            <p className="text-xs font-bold text-gray-400">تابع أسعار الوحدات المنفردة وقارن نسبة توفيرك بوضوح</p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="ابحث باسم العرض أو المنتج بداخل العرض..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-11 py-2.5 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-[#0284c7] bg-gray-50 focus:bg-white transition-all duration-200"
          />
          <Search className="absolute right-4 top-3.5 text-gray-400 w-4 h-4" />
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-900 rounded-xl mb-6 font-bold text-xs">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-pulse">
          <div className="bg-slate-100 rounded-xl h-56 border border-slate-200"></div>
          <div className="bg-slate-100 rounded-xl h-56 border border-slate-200"></div>
        </div>
      ) : filteredCombos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100 p-6">
          <Inbox size={44} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-sm font-black text-slate-700">لا تتوفر عروض مجمعة مطابقة للبحث حالياً</h3>
        </div>
      ) : (
        /* قائمة عرض كروت الكومبو */
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  {filteredCombos.map((combo) => {
    const { originalPrice, finalPrice, discountPercentage } = calculatePrices(combo);
    const displayDiscountPercent = originalPrice > finalPrice ? Math.round(discountPercentage * 100) : 0;
    
    // حساب المتبقي من العرض بشكل ديناميكي
    const remainingCount = (combo.totalLimit || 1000) - (combo.soldCount || 0);

    return (
      <div key={combo._id} className="bg-white rounded-lg border border-slate-300 -sm overflow-hidden flex flex-col relative transition-all hover:-md duration-300">
        
        {/* شارة نسبة الخصم الملونة بلون الموقع في أعلى الزاوية اليسرى */}
        {displayDiscountPercent > 0 && (
          <div className="absolute top-4 left-4 bg-[#0284c7] text-white text-[11px] font-black px-2.5 py-1 rounded-lg z-10">
            خصم {displayDiscountPercent}%
          </div>
        )}

        {/* ==================== القسم العلوي: الصورة والأسعار ==================== */}
        <div className="p-5 flex flex-col sm:flex-row gap-5 items-center sm:items-start border-b border-slate-50">
          
          {/* حاوية صورة المنتج مع خلفية ناعمة مشتقة من لون الموقع */}
          <div className="w-full sm:w-44 h-40 bg-slate-50/70 rounded-xl flex items-center justify-center relative flex-shrink-0 border border-slate-100/50">
            {combo.items?.[0]?.product?.image?.url ? (
              <img 
                src={combo.image.url || combo.items[0].product.image.url || offer} 
                alt={combo.title} 
                className="max-h-full max-w-full object-coveer"
              />
            ) : (
              <span className="text-3xl">📦</span>
            )}
            {combo.items?.[0]?.product?.unitsPerPackage && combo.items?.[0]?.product?.unit_type=="كرتونة" && (
              <div className="absolute bottom-2 right-2 bg-slate-900/60 text-white text-[9px] font-sans font-bold px-2 py-0.5 rounded">
                {combo.items[0].product.unitsPerPackage} {combo.items[0].unit_type === 'كرتونة' ? 'قطعة/كرتونة' : combo.items[0].unit_type}
              </div>
            )}
          </div>

          {/* تفاصيل العرض، العنوان، وأسعار الكومبو الإجمالية */}
          <div className="flex-1 w-full flex flex-col justify-between h-auto sm:h-40 pt-1">
            <div>
              <h3 className="text-sm md:text-base font-black text-slate-800 mb-0.5">{combo.title}</h3>
              <p className="text-xs font-bold text-slate-400 mb-4">{combo.description || "الحق العرض"}</p>
              
              {/* شارات نوع ومحتويات الحزمة بلون هادئ متناسق */}
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                  <BoxIcon size={14} />{combo.items?.length || 1} منتج
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                  {combo.items?.[0]?.quantity || 1} {combo.items?.[0]?.unit_type || 'كرتونة'}
                </span>
              </div>
            </div>

            {/* عرض الأسعار ونسبة التوفير الصافية بالملي */}
            <div className="flex justify-between items-end mt-4 sm:mt-0">
              <div className="font-sans text-right">
                {displayDiscountPercent > 0 && (
                  <span className="text-[11px] text-slate-300 line-through block font-bold">
                    {originalPrice.toFixed(2)} ج.م
                  </span>
                )}
                <span className="text-base md:text-lg font-black text-slate-800">
                  {finalPrice.toFixed(2)} <span className="text-xs font-bold text-slate-400">ج.م</span>
                </span>
              </div>
              
              {displayDiscountPercent > 0 && (
                <div className="text-[11px] font-black px-3 py-1.5 rounded-lg font-sans bg-sky-50 text-sky-600 border border-sky-100/50">
                  وفر {(originalPrice - finalPrice).toFixed(2)} ج.م
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ==================== القسم الأوسط: تفاصيل قائمة المنتجات بداخل العرض ==================== */}

<div className="px-5 py-3 bg-slate-50/50 border-b border-slate-100 flex flex-col gap-2.5">
  {combo.items?.map((item, idx) => {
    const hasImage = !!item.product?.image?.url;
    return (
      <div 
        key={idx} 
        className="flex items-center justify-between gap-4 text-xs font-medium text-slate-600 bg-white p-2 rounded-xl border border-slate-100 shadow-3xs transition-all hover:border-slate-200"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* صورة المنتج */}
          <div className="w-9 h-9 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex-shrink-0 flex items-center justify-center">
            {hasImage ? (
              <img 
                src={item.product.image.url} 
                alt={item.product?.productName || "Product"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-4 h-4 text-slate-400" />
            )}
          </div>
          
          {/* تفاصيل المنتج: الاسم والوصف بشكل رأسي منظم */}
          <div className="flex flex-col min-w-0 gap-0.5">
            <span className="font-bold text-slate-800 truncate text-[13px]">
              {item.product?.productName || "منتج غير مدرج"}
            </span>
            {item.product?.description && (
              <p className="text-[11px] text-slate-400 font-normal line-clamp-1">
                {item.product.description}
              </p>
            )}
          </div>
        </div>
        
        {/* شارة الكمية والوحدة */}
        <div className="flex-shrink-0">
          <span className="inline-flex items-center gap-1 bg-sky-50/60 border border-sky-100 text-sky-700 font-bold px-2.5 py-1 rounded-lg text-[11px]">
            <span className="text-slate-400 font-normal text-[10px]">الكمية:</span>
            {item.quantity} {item.unit_type || 'كرتونة'}
          </span>
        </div>
      </div>
    );
  })}
</div>

        {/* ==================== القسم السفلي: إحصائيات العرض وأزرار التفاعل ==================== */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-white">
          
          {/* مؤشرات التحكم بالحدود والمخزون المتوفر */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-bold text-slate-400">
            <div className="flex items-center gap-1">
              <span className="text-slate-600 font-black">الحد الأقصى للعميل:</span>
              <span className="bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md font-sans border border-slate-100/60">
                {combo.maxPerUser || 1} مرة
              </span>
            </div>
            <div className="flex items-center gap-1 border-r pr-4 border-slate-100">
              <span className="text-slate-600 font-black">المتبقي من العرض:</span>
              <span className="font-sans text-slate-500">{remainingCount}</span>
            </div>
          </div>

          {/* زر إضافة الكومبو للسلة بلون الموقع الموحد */}
          <button
            type="button"
            disabled={syncingId === combo._id}
            onClick={() => handleOpenComboModal(combo)}
            className="px-5 py-2.5 rounded-xl text-white text-xs font-black flex items-center justify-center gap-2 transition-all duration-200 bg-[#0284c7] hover:bg-[#0274b0] active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:scale-100"
          >
            {syncingId === combo._id ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <ShoppingCart size={14} />
            )}
            <span>أضف إلى السلة</span>
          </button>
        </div>

        {/* ==================== ذيل الكرت: فترات صلاحية العرض ==================== */}
        <div className="bg-slate-50/50 px-5 py-2.5 flex justify-between items-center text-[10px] font-bold text-slate-400 border-t border-slate-100/50">
          <div className="flex items-center gap-1">
            <Calendar size={12} className="text-slate-300" />
            <span>يبدأ في: {new Date(combo.startDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1 border-r pr-4 border-slate-100">
            <Calendar size={12} className="text-slate-300" />
            <span>ينتهي في: {new Date(combo.endDate).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

      </div>
    );
  })}
</div>
      )}

      {/* ==================== نافذة تحديد كمية العرض المجمع المنبثقة ==================== */}
{showQuantityModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-slate-100 shadow-xl transform scale-100 text-right animate-in zoom-in-95 duration-200 flex flex-col gap-4">
      
      {/* الرأس السفلي للمودال */}
      <div className="flex justify-between items-center border-b border-slate-50 pb-3">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
          <span className="text-base text-[#0284c7]"><BoxIcon size={20}/></span> تأكيد تفاصيل كمية العرض
        </h3>
        <button 
          onClick={() => setShowQuantityModal(false)} 
          className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* بطاقة السعر الإجمالي والتوفير الديناميكي */}
      <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-100/50 flex justify-between items-center">
        <div>
          <h4 className="text-sm font-black text-slate-800 mb-0.5">{modalData.title}</h4>
          <p className="text-[11px] font-bold text-slate-400">إجمالي السعر للكمية المحددة</p>
        </div>
        <div className="text-left font-sans flex flex-col items-end">
          <span className="text-base font-black text-slate-800">
            {(modalData.finalPrice * selectedQuantity).toFixed(2)} <span className="text-xs font-bold text-slate-400 font-cairo">ج.م</span>
          </span>
          {modalData.originalPrice > modalData.finalPrice && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs text-slate-300 line-through">
                {(modalData.originalPrice * selectedQuantity).toFixed(2)} ج.م
              </span>
              <span className="text-[10px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded font-black font-cairo">
                وفر {((modalData.originalPrice - modalData.finalPrice) * selectedQuantity).toFixed(2)} ج.م
              </span>
            </div>
          )}
        </div>
      </div>

      {/* تفصيل محتويات العرض لكل وحدة بوضوح */}
      <div>
        <span className="text-[11px] font-black text-slate-500 block mb-2"><BiDetail/> تفاصيل السلع داخل العرض الحالي:</span>
        <div className="max-h-36 overflow-y-auto space-y-2 border border-slate-100 bg-slate-50/30 p-2.5 rounded-xl">
          {modalData.items?.map((item, idx) => {
            const isCarton = item.unit_type === 'كرتونة';
            const priceOutside = isCarton ? (item.product?.packageSellingPrice || 0) : (item.product?.pieceSellingPrice || 0);
            const priceInside = priceOutside - (priceOutside * modalData.discountPercentage);
            
            return (
              <div key={idx} className="flex justify-between items-center text-[11px] bg-white border border-slate-100/60 p-2.5 rounded-lg font-bold text-slate-700">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0284c7]"></span>
                  <span className="truncate max-w-[180px] text-slate-800">
                    {item.product?.productName}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="bg-slate-50 text-slate-500 text-[10px] px-2 py-0.5 rounded-md border border-slate-100">
                    {item.quantity * selectedQuantity} {item.unit_type}
                  </span>
                  <span className="font-sans text-slate-500 border-r pr-2 border-slate-100 text-[10px]">
                    {(priceInside * item.quantity * selectedQuantity).toFixed(2)} ج.م
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* تحليل حالة الحساب والمتبقي بناءً على الـ API */}
      <div className="bg-sky-50/30 border border-sky-100/50 rounded-xl p-3 text-[11px] font-bold text-slate-600 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-slate-500">الحد الأقصى المسموح به للحساب:</span>
          <span className="text-slate-800 font-black bg-white px-2 py-0.5 rounded border border-sky-100/30 font-sans">
            {modalData.maxPerUser || 1} عروض
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 border-t border-sky-100/40 pt-2 text-[10px]">
          <div className="flex justify-between bg-white/60 p-1.5 rounded border border-slate-100/50">
            <span className="text-slate-400">تم استهلاك:</span>
            <span className="text-slate-700 font-black font-sans">{modalData.usedCount || 0}</span>
          </div>
          <div className="flex justify-between bg-white/60 p-1.5 rounded border border-slate-100/50">
            <span className="text-slate-400">المتبقي لك:</span>
            <span className="text-[#0284c7] font-black font-sans">{modalData.allowedRemaining || 0}</span>
          </div>
        </div>

        {modalData.allowedRemaining <= 0 && (
          <p className="text-red-500 text-[10px] font-black text-center pt-1 flex items-center justify-center gap-1">
            ⚠️ لقد استنفدت الحد الأقصى المتاح لهذا العرض بالكامل.
          </p>
        )}
      </div>

      {/* التحكم في كمية الطلب */}
      <div className="flex flex-col items-center justify-center gap-1.5 py-1">
        <span className="text-[11px] font-black text-slate-400">تحديد عدد مرات طلب العرض</span>
        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
          <button
            type="button"
            disabled={selectedQuantity >= (modalData.allowedRemaining || 1)}
            onClick={() => setSelectedQuantity(prev => prev + 1)}
            className="w-8 h-8 rounded-lg bg-white text-slate-800 border border-slate-100 hover:bg-slate-50 font-bold flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
          >
            <Plus size={14} />
          </button>
          
          <span className="text-sm font-black font-sans text-slate-800 w-10 text-center">{selectedQuantity}</span>

          <button
            type="button"
            disabled={selectedQuantity <= 1}
            onClick={() => setSelectedQuantity(prev => prev - 1)}
            className="w-8 h-8 rounded-lg bg-white text-slate-800 border border-slate-100 hover:bg-slate-50 font-bold flex items-center justify-center disabled:opacity-30 transition-all active:scale-95"
          >
            <Minus size={14} />
          </button>
        </div>
      </div>

      {/* أزرار اتخاذ القرار التفاعلية */}
      <div className="flex gap-2.5 mt-2">
        <button 
          onClick={handleConfirmAddToCart} 
          disabled={modalData.allowedRemaining <= 0}
          className="flex-1 bg-[#0284c7] hover:bg-[#0274b0] disabled:bg-slate-100 disabled:text-slate-400 text-white py-2.5 rounded-xl font-black text-xs transition-all active:scale-[0.99]"
        >
          تأكيد الإضافة للسلة
        </button>
        <button 
          onClick={() => setShowQuantityModal(false)} 
          className="px-5 bg-slate-100 hover:bg-slate-200/80 text-slate-500 py-2.5 rounded-xl font-black text-xs transition-all"
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