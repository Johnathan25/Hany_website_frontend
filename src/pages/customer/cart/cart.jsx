import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import api from "../../../services/api";
import { showAlert } from "../../../services/alert";
import { Trash2, Plus, Minus, ShoppingCart, AlertCircle, Loader2, ShieldCheck, Box } from "lucide-react";
import { MyContext } from "../../../context/cartContext";
import { useNavigate } from "react-router-dom";
import { showAlertConfirm } from "../../../services/alertConfirm";
import { HiOutlineTrash } from "react-icons/hi";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const syncTimeout = useRef(null);
  const defaultProductImg = "https://kokishoponline.com/wp-content/uploads/2024/07/11-1024x1024.png";
  const { setCounts } = useContext(MyContext);

  // حساب إجمالي كميات قطع السلة لتحديث عداد الهيدر بشكل دقيق
  const updateGlobalCartCount = (items) => {
    // const totalCount = items.reduce((total, item) => total + (item.quantity || 0), 0);
    setCounts(items.length);
  };

      useEffect(() => {
    document.title = " سله منتجات ابو الدهب "
  }, []);

  // Load cart (backend -> local)
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await api.get("/user/cart");
        let items = res.data?.items || [];
        
        // جلب المتبقي لكل منتج عرض ديناميكي (للـ Offers فقط)
        items = await Promise.all(items.map(async (item) => {
          if (item.isOffer && item.offerId) {
            try {
              const prodId = item.product?._id || item.product;
              const offerRes = await api.get(`/offer/check/${item.offerId}/${prodId}`);
              if (offerRes.data?.data) {
                return {
                  ...item,
                  maxPerUser: offerRes.data.data.maxPerUser,
                  remainingOfferQty: offerRes.data.data.remaining
                };
              }
            } catch (offerErr) {
              console.log("Error checking offer usage for item:", offerErr);
            }
          }
          return item;
        }));

        setCartItems(items);
        localStorage.setItem("cart", JSON.stringify(items));
        updateGlobalCartCount(items);
      } catch (err) {
        console.log(err);
        const localCart = JSON.parse(localStorage.getItem("cart")) || [];

        if (err.response?.data?.message?.trim() === "هذا الحساب لم يعد موجودا") {
          localStorage.removeItem("cart");
          setCounts(0);
          setCartItems([]);
          return;
        }
        setCartItems(localCart);
        updateGlobalCartCount(localCart);
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, []);

  // تعديل الـ Debounce لدعم صيغة الـ Combo والـ Regular Product معاً عند الرفع للباكيند
  const debounceSync = (items) => {
    clearTimeout(syncTimeout.current);
    syncTimeout.current = setTimeout(async () => {
      try {
        const itemsToSync = items.map(item => ({
          product: item.isCombo ? null : (item.product?._id || item.product),
          comboId: item.isCombo ? item.comboId : null,
          isCombo: item.isCombo || false,
          quantity: item.quantity,
          unit_type: item.isCombo ? null : item.unit_type,
          isOffer: item.isCombo ? false : (item.isOffer || false),
          offerPrice: item.offerPrice || null,
          offerId: item.isCombo ? null : (item.offerId || null),
          title: item.isCombo ? item.title : null,
          items: item.isCombo ? item.items : null,
          allowedRemaining: item.allowedRemaining !== undefined ? item.allowedRemaining : 0

        }));
        await api.put("/user/cart", { items: itemsToSync });
      } catch (err) {
        console.log("Sync Error:", err);
      }
    }, 800);
  };

  // تحديث الكميات مع الفصل التام بين الكومبو والمنتج العادي
  const updateQuantity = (id, unitType, isOffer, isCombo, newQty) => {
    // العثور على العنصر المستهدف بالاعتماد على نوعه (كومبو أو منتج عادي)
    const itemToUpdate = cartItems.find(item => {
      if (isCombo) {
        return item.isCombo === true && item.comboId === id;
      } else {
        return (item.product?._id || item.product) === id &&
               item.unit_type === unitType &&
               (item.isOffer === true) === (isOffer === true);
      }
    });

    if (!itemToUpdate) return;

    if (newQty < 1) {
      return removeItem(id, unitType, isOffer, isCombo);
    }

    // إذا كان العنصر عبارة عن عرض كومبو
    if (isCombo) {

        const allowedRemaining = itemToUpdate.allowedRemaining

                if (newQty > allowedRemaining) {
          showAlert({
            icon: "warning",
            title: `عفواً، الكمية المتبقية المتاحة لك في هذا العرض هي ${allowedRemaining} قطع فقط!`
          });

        return;
      
    }} else {
      // 1. التحقق الذكي من قيود العروض العادية (Offers)
      if (isOffer ) {
        const allowedRemaining = itemToUpdate.allowedRemaining
        if (newQty > allowedRemaining) {
          showAlert({
            icon: "warning",
            title: `عفواً، الكمية المتبقية المتاحة لك في هذا العرض هي ${allowedRemaining} قطع فقط!`
          });
          return;
        }
      }



      

      // 2. التحقق من المخزون العام للمستودع للمنتجات العادية
      let maxAvailable = unitType === "كرتونة" ? (itemToUpdate.product?.availableQuantity || 999) : (itemToUpdate.product?.totalUnits || 999);
      if (newQty > maxAvailable) {
        showAlert({ icon: "error", title: `عفواً، المتاح في المخزن هو ${maxAvailable} فقط` });
        return;
      }
    }

    // إنشاء المصفوفة المؤقتة المحدثة
    const tempCart = cartItems.map(item => {
      if (isCombo) {
        return item.isCombo === true && item.comboId === id ? { ...item, quantity: newQty } : item;
      } else {
        return (item.product?._id || item.product) === id && item.unit_type === unitType && (item.isOffer === true) === (isOffer === true)
          ? { ...item, quantity: newQty }
          : item;
      }
    });

    // حساب إجمالي الوحدات المستهلكة من نفس الصنف (للمنتجات العادية فقط)
    if (!isCombo) {
      let totalUnitsCounter = 0;
      tempCart.forEach(element => {
        if (!element.isCombo) {
          const currentProdId = element.product?._id || element.product;
          const targetProdId = itemToUpdate.product?._id || itemToUpdate.product;
          
          if (currentProdId === targetProdId) {
            if (element.unit_type === "كرتونة") {
              totalUnitsCounter += element.quantity * (itemToUpdate.product?.unitsPerPackage || 1);
            } else {
              totalUnitsCounter += element.quantity;
            }
          }
        }
      });

      if (totalUnitsCounter > (itemToUpdate.product?.totalUnits || 999)) {
        return showAlert({ title: "المخزون الكلي لا يكفي لتغطية الكميات المطلوبة", icon: "error", time: 1200 });
      }
    }

    setCartItems(tempCart);
    localStorage.setItem("cart", JSON.stringify(tempCart));
    updateGlobalCartCount(tempCart);
    debounceSync(tempCart);
  };

  // حذف العنصر من السلة لدعم الكومبو والمنتج العادي
  const removeItem = (id, unitType, isOffer, isCombo) => {
    const updated = cartItems.filter((item) => {
      if (isCombo) {
        return !(item.isCombo === true && item.comboId === id);
      } else {
        return !(
          (item.product?._id || item.product) === id && 
          item.unit_type === unitType && 
          (item.isOffer === true) === (isOffer === true)
        );
      }
    });
    
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    showAlert({ title: "تم إزالة العنصر من السلة", icon: "success", time: 800 });
    
    updateGlobalCartCount(updated);
    debounceSync(updated);
  };

  const handleCheckout = async () => {
    try {
      if (!localStorage.getItem("userName")) {
        showAlert({ icon: "error", title: "يجب عليك تسجيل الدخول أولاً، سيتم توجيهك لصفحة تسجيل الدخول" });
        return setTimeout(() => { navigate("/login"); }, 500);
      }

      if ((JSON.parse(localStorage.getItem("cart")) || []).length === 0) {
        return showAlert({ icon: "error", title: "يجب وضع منتجات في السلة أولاً" });
      }

      navigate("/انشاء_طلب");
      await api.put("/user/cart", { items: cartItems });
      showAlert({ icon: "success", title: "تم تحديث السلة وجاري تحويلك لإتمام الطلب" });
    } catch (err) {
      showAlert({ icon: "error", title: "فشل في عملية المزامنة الحالية" });
    }
  };

  const deleteAll = async () => {
    try {
      if ((JSON.parse(localStorage.getItem("cart")) || []).length === 0) {
        return showAlert({ title: "لا يوجد منتجات في السلة للحذف", icon: "error" });
      }
      const confirm = await showAlertConfirm({
        title: "حذف جميع المنتجات في السلة",
        text: "عند تأكيد الحذف سيتم تفريغ محتويات السلة نهائياً",
        icon: "warning"
      });
      if (!confirm.isConfirmed) return;

      await api.delete("/user/cart");
      localStorage.removeItem("cart");
      setCounts(0);
      setCartItems([]);

      showAlert({ icon: "success", title: "تم تفريغ حقيبة التسوق بنجاح" });
      setTimeout(() => { navigate("/"); }, 500);
    } catch (err) {
      showAlert({ icon: "error", title: "فشل في عملية الحذف" });
    }
  };

  // تحديث الحسابات لتشمل أسعار عروض الكومبو المضافة حديثاً
  const totalPrice = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      if (item.isCombo) {
        return acc + ((item.offerPrice || 0) * item.quantity);
      }
      
      const p = item.product;
      if (!p) return acc;
      
      const price = item.isOffer && item.offerPrice 
        ? item.offerPrice 
        : (item.unit_type === "كرتونة" ? p.packageSellingPrice : p.pieceSellingPrice);
        
      return acc + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-[#0284c7]" size={32} />
    </div>
  );

  return (
    <div className="mx-auto p-4 md:p-10 font-cairo" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-8 border-b-2 border-gray-100 pb-6">
        <div className="flex gap-2 items-center">
          <ShoppingCart className="text-[#0F172A]" size={32} />
          <h1 className="text-3xl font-black text-[#0F172A]">حقيبة التسوق</h1>
        </div>

        <div className="flex justify-end">
          <button
            onClick={deleteAll}
            className="group flex items-center gap-2 px-5 py-2.5 bg-red-50/50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 hover:border-red-500 rounded-2xl transition-all duration-300 shadow-sm"
          >
            <HiOutlineTrash className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span className="font-black text-sm md:text-base">حذف محتويات السلة</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List Section */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.length > 0 ? cartItems.map((item) => {
            
            // في حالة كان العنصر عبارة عن عرض كومبو مجمع
            if (item.isCombo) {
              return (
                <div 
                  key={`combo-${item.comboId}`}
                  className="rounded-xl bg-white border-2 border-purple-50 bg-purple-50/5 p-4 flex flex-col md:flex-row items-center gap-6 group hover:border-[#0284c7] -500 transition-all"
                >
                  {/* كارد أيقونة الكومبو المتكامل */}
                  <div className="w-24 h-24 bg-purple-50 border rounded-xl border-purple-100 p-2 flex items-center justify-center flex-shrink-0 text-purple-600">
                       <img 
                    loading="lazy" 
                    src={item?.comboId.image?.url || defaultProductImg} 
                    alt={item?.title || "Product"} 
                       onClick={()=>navigate("/العروض_والخصومات_الكومبو")}
                    className="w-full h-full object-contain cursor-pointer" 
                  />
                  </div>

              {/* تفاصيل الكومبو */}
              <div className="flex-grow text-center md:text-right min-w-0">

                <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                  <h3 className="text-lg font-black text-[#0F172A] truncate">
                    {item.title || "عرض كومبو مجمع"}
                  </h3>

                  <span className="bg-[#0284c7] text-white text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
                    عرض كومبو مجمّع
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  محتويات العرض:
                </p>

                <div className="mt-3 space-y-2">

                  {item.comboId?.items?.map((subItem, idx) => (

                    <div
                      key={idx} className=" flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3 "
                    >

                      <img
                        src={
                          subItem.product?.image?.url ||
                          defaultProductImg
                        }
                        alt=""
                     
                        className=" w-14 h-14 rounded-lg object-contain bg-white border  border-gray-200 p-1 flex-shrink-0"
                      />

                      <div className="flex-1">
                        <h4 className="font-black text-sm text-[#0F172A]">
                          {subItem.product?.productName}
                        </h4>
                        <p className="text-[11px] text-gray-500 line-clamp-2">
                          {subItem.product?.description}
                        </p>
                      </div>

                      <div
                        className=" bg-[#0284c7] text-white px-3 py-1 rounded-lg font-black text-xs "
                      >

                        × {subItem.quantity}

                      </div>

                    </div>

                  ))}

                </div>

              </div>

                  {/* السعر النهائي للكومبو */}
                  <div className="text-center min-w-[110px]">
                    <p className="text-[10px] text-gray-400 font-bold mb-0.5 uppercase tracking-wider">سعر العرض</p>
                    <p className="text-xl font-black text-[#0284c7] -700">
                      {item.offerPrice} <span className="text-xs font-bold">ج.م</span>
                    </p>
                  </div>

                  {/* عداد كمية عروض الكومبو */}
                  <div className="flex items-center rounded-xl border-2 border-purple-50 overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.comboId, null, false, true, item.quantity - 1)}
                      className="p-3 hover:bg-white transition-colors text-[#0284c7] -900"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-black text-sm text-[#0284c7] -900 border-x-2 border-purple-100 bg-white py-1">
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.comboId, null, false, true, item.quantity + 1)}
                      className="p-3 hover:bg-white transition-colors text-[#0284c7] -900"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* حذف الكومبو */}
                  <button 
                    onClick={() => removeItem(item.comboId, null, false, true)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            }

            // في حالة كان العنصر منتج عادي أو عرض مفرد من مجلة العروض (المنطق القديم مستقر تماماً)
            const p = item.product;
            const id = p?._id || item.product;
            
            const isOutOfStock = item.unit_type === "قطعة" 
              ? item.quantity >= (p?.totalUnits || 0) 
              : item.quantity >= (p?.availableQuantity || 0);

            const allowedRemaining = item.remainingOfferQty !== undefined ? item.remainingOfferQty : item.maxPerUser;
            const isOfferLimitReached = ((item.isOffer || item.isCombo ) && allowedRemaining !== null && item.quantity >= allowedRemaining);

            const activePrice = item.isOffer && item.offerPrice 
              ? item.offerPrice 
              : (item.unit_type === "كرتونة" ? p?.packageSellingPrice : p?.pieceSellingPrice);

            return (
              <div 
                key={`${id}-${item.unit_type}-${item.isOffer ? 'offer' : 'regular'}`} 
                className={`rounded-xl bg-white border p-4 flex flex-col md:flex-row items-center gap-6 group hover:border-[#0284c7] transition-all ${
                  item.isOffer ? 'border -200 bg-amber-50/10' : 'border-gray-200'
                }`}
              >
                <div 
                  onClick={() => navigate(`/تفاصيل المنتج/${id}`)}  
                  className="w-24 h-24 cursor-pointer bg-gray-50 border rounded-xl border-gray-100 p-2 flex-shrink-0"
                >
                  <img 
                    loading="lazy" 
                    src={p?.image?.url || defaultProductImg} 
                    alt={p?.productName || "Product"} 
                    className="w-full h-full object-contain" 
                  />
                </div>

                <div className="flex-grow text-center md:text-right min-w-0">
                  <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    <h3 className="text-lg font-black text-[#0F172A] truncate">{p?.productName}</h3>
                    {item.isOffer && (
                      <span className="bg-[#0284c7] text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                         سعر مجلة العروض
                      </span>
                    )}
                  </div>
                  <h5 className="text-xs text-gray-400 font-medium mt-1 truncate">{p?.description}</h5>

                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      item.unit_type === 'قطعة' ? 'border-[#0284c7] text-[#0284c7] bg-sky-50/30' : 'border-[#0F172A] text-[#0F172A] bg-slate-50'
                    }`}>
                      النظام: {item.unit_type}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-100 rounded text-gray-500">
                      {p?.category}
                    </span>
                  </div>

                  {isOutOfStock && !item.isOffer && (
                    <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center justify-center md:justify-start gap-1">
                      <AlertCircle size={12} /> لقد وصلت للحد الأقصى المتاح بالمخزن
                    </p>
                  )}
                  {isOfferLimitReached && (
                    <p className="text-[10px] text-[#0284c7] -600 font-bold mt-2 flex items-center justify-center md:justify-start gap-1">
                      <ShieldCheck size={12} /> مضاف بالحد الأقصى المتاح لك حالياً ({allowedRemaining} {item.unit_type})
                    </p>
                  )}
                </div>

                <div className="text-center min-w-[110px]">
                  <p className="text-[10px] text-gray-400 font-bold mb-0.5 uppercase tracking-wider">السعر الحالي</p>
                  <p className={`text-xl font-black ${item.isOffer ? 'text-[#0284c7]  -600' : 'text-[#0F172A]'}`}>
                    {activePrice} <span className="text-xs font-bold">ج.م</span>
                  </p>
                  {item.isOffer && item.unit_type === "قطعة" && p?.pieceSellingPrice > item.offerPrice && (
                    <p className="text-[9px] text-gray-400 line-through">بدلاً من: {p.pieceSellingPrice} ج.م</p>
                  )}
                </div>

                <div className="flex items-center rounded-xl border-2 border-gray-100 bg-gray-50 overflow-hidden">
                  <button 
                    onClick={() => updateQuantity(id, item.unit_type, item.isOffer, false, item.quantity - 1)}
                    className="p-3 hover:bg-white transition-colors text-[#0F172A]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-black text-sm text-[#0F172A] border-x-2 border-gray-100 bg-white py-1">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(id, item.unit_type, item.isOffer, false, item.quantity + 1)}
                    disabled={isOutOfStock || isOfferLimitReached}
                    className={`p-3 transition-colors ${(isOutOfStock || isOfferLimitReached) ? 'opacity-20 cursor-not-allowed bg-gray-100' : 'hover:bg-white text-[#0F172A]'}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button 
                  onClick={() => removeItem(id, item.unit_type, item.isOffer, false)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          }) : (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-20 text-center bg-white">
              <p className="font-black text-gray-400 uppercase tracking-widest text-sm">السلة فارغة حالياً</p>
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="relative bg-white pt-10 pb-14 px-8 rounded-2xl border border-gray-100 sticky top-24 overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-black uppercase tracking-widest italic">فاتورة طلب</h2>
              <div className="flex justify-center items-center gap-2 mt-2">
                <span className="h-[1px] w-8 bg-gray-300"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Abu Al-Dahab Food</span>
                <span className="h-[1px] w-8 bg-gray-300"></span>
              </div>
            </div>

            <div dir="ltr" className="space-y-6 text-right relative">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-slate-900 tabular-nums">
                    {totalPrice.toLocaleString()} 
                    <small className="text-[10px] text-gray-400 font-bold mr-1">EGP</small>
                  </span>
                  <span className="text-gray-500 font-bold text-sm">الإجمالي الفرعي</span>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <div className="text-left flex flex-col items-end">
                    <span className="text-[11px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded">يُحدد عند الطلب</span>
                    <span className="text-[9px] text-gray-400 font-bold mt-1 max-w-[150px]">بناءً على موقع التوصيل</span>
                  </div>
                  <span className="text-gray-500 font-bold text-sm">خدمة التوصيل</span>
                </div>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-gray-300"></div>
                </div>
              </div>

              <div className="flex justify-between items-end pt-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="text-left">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-black tracking-tighter tabular-nums">
                      {totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs font-black text-gray-950 uppercase">EGP</span>
                  </div>
                  <p className="text-[9px] text-gray-400 font-bold mt-1 tracking-wider uppercase">Total Amount Due</p>
                </div>
                <span className="text-xl font-black text-black">الإجمالي</span>
              </div>
            </div>

            <div className="space-y-3 mt-10 relative">
              <button 
                onClick={handleCheckout}
                className="w-full bg-[#0f172a] text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                إتمام الطلب والدفع
              </button>
              <p className="text-[9px] text-center text-gray-400 font-bold px-4 leading-relaxed">
                بالضغط على "إتمام الطلب" أنت توافق على شروط وأحكام <span className="text-black">أبو الدهب للأغذية</span>
              </p>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-4 flex overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="w-4 h-4 bg-[#fafafa] rotate-45 transform origin-top-left -mt-2 border-l border-t border-gray-100"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;