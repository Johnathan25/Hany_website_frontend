import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { showAlert } from '../../../services/alert';
import { showAlertConfirm } from '../../../services/alertConfirm';

export default function AdminOfferDashboard() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // حالات تتبع وضع التعديل
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState(null);

  // حالات تتبع العمليات الحية للأزرار لمنع النقر المتكرر
  const [isToggling, setIsToggling] = useState([]); 
  const [isDeleting, setIsDeleting] = useState([]); 

  // حالات البحث عن المنتجات
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // البيانات الأساسية للنموذج
  const [formData, setFormData] = useState({
    title: "",
     startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    totalLimit: 2000,
  });
  
  const [imageUrl, setImageUrl] = useState("");
  const [addedProducts, setAddedProducts] = useState([]);
  
  const [currentProductSelection, setCurrentProductSelection] = useState({
    productId: "",
    productName: "",
    unitType: "", // كرتونة أو قطعة
    availableQuantity: 0, // عدد الكراتين المتاحة
    totalUnits: 0, // إجمالي القطع المتاحة
    packageSellingPrice: 0, // سعر بيع الكرتونة الأصلي
    pieceSellingPrice: 0, // سعر بيع القطعة الأصلي
    purchasePrice: 0, // سعر الشراء الأساسي
    offerPrice: "",
    maxPerUser: 1
  });

  // جلب العروض الحالية من السيرفر
  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError("");
      const offersRes = await api.get('/offer');
      if (offersRes.data) {
        setOffers(offersRes.data.offers || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء جلب البيانات من السيرفر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
  setFormData(prev => ({
    ...prev,
    startDate: new Date().toISOString().split("T")[0]
  }));
}, []);

  // دالة البحث الحي عن المنتجات
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await api.get(`/offer/searchProducts?query=${encodeURIComponent(searchQuery)}`);
        if (res.data && res.data.data) {
          setSearchResults(res.data.data);
        }
      } catch (err) {
        console.error("خطأ أثناء البحث عن المنتجات:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // إغلاق قائمة البحث عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectProductFromSearch = (product) => {
    setCurrentProductSelection({
      productId: product._id,
      productName: product.productName,
      unitType: product.unit_type || "كرتونة",
      availableQuantity: product.availableQuantity || 0,
      totalUnits: product.totalUnits || 0,
      packageSellingPrice: product.packageSellingPrice || 0,
      pieceSellingPrice: product.pieceSellingPrice || 0,
      purchasePrice: product.purchasePrice || 0,
      offerPrice: "",
      maxPerUser: 1
    });
    setSearchQuery(""); 
    setSearchResults([]);
    setShowDropdown(false);
  };

  const addProductToOfferList = () => {
    const { 
      productId, 
      productName, 
      unitType,
      availableQuantity,
      totalUnits,
      packageSellingPrice,
      pieceSellingPrice,
      purchasePrice,
      offerPrice, 
      maxPerUser 
    } = currentProductSelection;
    
    const numericOfferPrice = Number(offerPrice);
    const numericMaxPerUser = Number(maxPerUser);

    if (!productId) {
      showAlert({ title: "الرجاء البحث واختيار منتج أولاً", icon: "error" });
      return;
    }
    if (!offerPrice || numericOfferPrice <= 0) {
      showAlert({ title: "الرجاء كتابة سعر عرض صحيح", icon: "error" });
      return;
    }

    //  التحقق من كمية العرض مقارنة بالمخزن الحالي وموع الوحدة
    if (unitType === "كرتونة" && numericMaxPerUser > availableQuantity) {
      showAlert({ 
        title: `الكمية المحددة تتعدى المخزون الحالي! المتاح هو ${availableQuantity} كرتونة فقط.`, 
        icon: "error" 
      });
      return;
    }
    if (unitType === "قطعة" && numericMaxPerUser > totalUnits) {
      showAlert({ 
        title: `الكمية المحددة تتعدى إجمالي القطع بالمخزن! المتاح هو ${totalUnits} قطعة فقط.`, 
        icon: "error" 
      });
      return;
    }

    //  التحقق من أن سعر العرض لا يتجاوز سعر البيع الأصلي للوحدة المحددة
    if (unitType === "كرتونة" && numericOfferPrice > packageSellingPrice) {
      showAlert({ 
        title: `سعر العرض (${numericOfferPrice} ج.م) لا يمكن أن يتجاوز سعر بيع الكرتونة الأصلي (${packageSellingPrice} ج.م)`, 
        icon: "error" 
      });
      return;
    }
    if (unitType === "قطعة" && numericOfferPrice > pieceSellingPrice) {
      showAlert({ 
        title: `سعر العرض (${numericOfferPrice} ج.م) لا يمكن أن يتجاوز سعر بيع القطعة الأصلي (${pieceSellingPrice} ج.م)`, 
        icon: "error" 
      });
      return;
    }

    // 3️⃣ التحقق من أن سعر العرض ليس أقل من سعر الشراء الأساسي (حماية من الخسارة)
    if (numericOfferPrice < purchasePrice) {
      showAlert({ 
        title: `خطأ حسّاس: سعر العرض أقل من سعر الشراء الأصلي للشركة (${purchasePrice} ج.م)`, 
        icon: "error" 
      });
      return;
    }

    // التحقق من التكرار بالقائمة المؤقتة
    if (addedProducts.some(p => p.product === productId)) {
      showAlert({ title: "هذا المنتج مضاف بالفعل في العرض الحالي", icon: "warning" });
      return;
    }

    setAddedProducts([
      ...addedProducts,
      {
        product: productId,
        name: productName,
        unitType: unitType,
        offerPrice: numericOfferPrice,
        maxPerUser: numericMaxPerUser
      }
    ]);

    // إعادة تعيين حقول الاختيار
    setCurrentProductSelection({
      productId: "",
      productName: "",
      unitType: "",
      availableQuantity: 0,
      totalUnits: 0,
      packageSellingPrice: 0,
      pieceSellingPrice: 0,
      purchasePrice: 0,
      offerPrice: "",
      maxPerUser: 1
    });
  };

  const removeProductFromOfferList = (pId) => {
    setAddedProducts(addedProducts.filter(p => p.product !== pId));
  };

  // دالة الحفظ النهائي
  const handleSubmit = async (e) => {
  e.preventDefault();

  
    if (addedProducts.length === 0) {
      showAlert({ title: "يجب إضافة منتج واحد على الأقل للمجلة", icon: "error" });
      return;
    }
    

const maxPerProduct = Math.max(
  ...addedProducts.map(p => Number(p.maxPerUser))
);

if (maxPerProduct > Number(formData.totalLimit)) {
  showAlert({
    title: "الحد الكلي للعرض يجب أن يكون أكبر من أو يساوي أكبر حد مسموح به لأي منتج",
    icon: "error"
  });
  return;
}

if (!formData.startDate || !formData.endDate) {
  showAlert({
    title: "يجب تحديد تاريخ البداية والنهاية",
    icon: "error"
  });
  return;
}

const startDate = new Date(formData.startDate);
const endDate = new Date(formData.endDate);
const today = new Date();

today.setHours(0, 0, 0, 0);

if (startDate.getTime() === endDate.getTime()) {
  showAlert({
    title: "تاريخ البداية لا يمكن أن يساوي تاريخ النهاية",
    icon: "error"
  });
  return;
}

if (startDate > endDate) {
  showAlert({
    title: "تاريخ البداية يجب أن يكون قبل تاريخ النهاية",
    icon: "error"
  });
  return;
}

if (endDate < today) {
  showAlert({
    title: "تاريخ الانتهاء لا يمكن أن يكون في الماضي",
    icon: "error"
  });
  return;
}



if (!formData.title.trim()) {
  showAlert({
    title: "عنوان العرض مطلوب",
    icon: "error"
  });
  return;
}

if (formData.title.trim().length < 3) {
  showAlert({
    title: "عنوان العرض يجب أن يكون 3 أحرف على الأقل",
    icon: "error"
  });
  return;
}

if (
  !formData.totalLimit ||
  Number(formData.totalLimit) <= 0
) {
  showAlert({
    title: "الحد الأقصى للعرض يجب أن يكون أكبر من صفر",
    icon: "error"
  });
  return;
}
  



    try {
      setIsSubmitting(true);
      setError("");

      const preparedProducts = addedProducts.map(p => ({
        product: p.product,
        offerPrice: Number(p.offerPrice),
        maxPerUser: Number(p.maxPerUser)
      }));

      const payload = {
        title: formData.title.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalLimit: Number(formData.totalLimit),
        imageUrl: imageUrl.trim(), 
        products: preparedProducts
      };

      let response;
      if (isEditMode) {
        response = await api.put(`/offer/${editingOfferId}`, payload);
      } else {
        response = await api.post('/offer', payload);
      }

      if (response.data) {
        showAlert({ 
          icon: "success", 
          title: isEditMode ? "تم تعديل مجلة العروض بنجاح" : "تم إنشاء مجلة العروض بنجاح" 
        });
        resetForm();
        fetchOffers(); 
      }
    } catch (err) {
showAlert({
  icon: "error",
  time:err.response?.data?.conflicts ? 5000 : 3000,
  title:
    err.response?.data?.message + "  "+
    `المنتج: ${err.response?.data?.conflicts[0]?.productName || ""} موجود بالفعل في عرض: ${err.response?.data?.conflicts[0]?.offerTitle || ""}` ||
    "فشلت العملية"
});
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (offer) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsEditMode(true);
    setEditingOfferId(offer._id);
    
    const formattedStartDate = offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : "";
    const formattedEndDate = offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : "";

    setFormData({
      title: offer.title || "",
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      totalLimit: offer.totalLimit || 2000,
    });

    const imgUrl = typeof offer.image === 'string' ? offer.image : (offer.image?.url || offer.imageUrl || "");
    setImageUrl(imgUrl);

    const mappedProducts = (offer.products || []).map(p => ({
      product: p.product?._id || p.product,
      name: p.product?.productName || "منتج مدرج",
      unitType: p.product?.unit_type || "كرتونة",
      offerPrice: Number(p.offerPrice),
      maxPerUser: Number(p.maxPerUser || 1)
    }));
    
    setAddedProducts(mappedProducts);
  };

  const resetForm = () => {
    setIsEditMode(false);
    setEditingOfferId(null);
    setFormData({ title: "",   startDate: new Date().toISOString().split("T")[0], endDate: "", totalLimit: 2000 });
    setAddedProducts([]);
    setImageUrl("");
    setSearchQuery("");
    setSearchResults([]);
    setCurrentProductSelection({
      productId: "",
      productName: "",
      unitType: "",
      availableQuantity: 0,
      totalUnits: 0,
      packageSellingPrice: 0,
      pieceSellingPrice: 0,
      purchasePrice: 0,
      offerPrice: "",
      maxPerUser: 1
    });
  };

  const handleDeleteOffer = async (id) => {
    const confirmDelete = await showAlertConfirm({
      title: "هل أنت متأكد من حذف هذه المجلة؟",
      text: "سيتم إزالة العرض نهائياً من قاعدة البيانات ولا يمكن التراجع",
      icon: "warning",
      confirmButtonText: "نعم، احذف المجلة",
      cancelButtonText: "إلغاء"
    });
    if (!confirmDelete.isConfirmed) return;

    try {
      setIsDeleting(prev => [...prev, id]);
      const response = await api.delete(`/offer/${id}`);
      if (response.data) {
        showAlert({ icon: "success", title: "تم حذف المجلة بنجاح" });
        setOffers(offers.filter(o => o._id !== id));
        if (editingOfferId === id) resetForm();
      }
    } catch (err) {
      showAlert({ icon: "error", title: err.response?.data?.message || "فشلت عملية الحذف" });
    } finally {
      setIsDeleting(prev => prev.filter(item => item !== id));
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      setIsToggling(prev => [...prev, id]);
      const response = await api.patch(`/offer/${id}/toggle`);
      if (response.data) {
        showAlert({ icon: "success", title: response.data.message });
        setOffers(offers.map(o => o._id === id ? { ...o, active: response.data.offer.active } : o));
      }
    } catch (err) {
      showAlert({ icon: "error", title: err.response?.data?.message || "فشلت العملية" });
    } finally {
      setIsToggling(prev => prev.filter(item => item !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-right" dir="rtl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم بمجلات العروض</h1>
        <p className="text-gray-500 mt-1">إنشاء، وتعديل، وإدارة المنتجات المخفضة </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium">
          ⚠️ خطأ: {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
  {/* عمود الإنشاء / التعديل الاحترافي */}
<div className="bg-white p-6 rounded-2xl border border-slate-100 -xl/5 h-fit xl:col-span-1" dir="rtl">
  
  {/* الهيدر العلوي للنظام */}
  <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
    <h2 className="text-lg font-black text-slate-800 tracking-tight">
      {isEditMode ? "تعديل مجلة العروض الحالية" : "إنشاء مجلة عروض جديدة"}
    </h2>
    {isEditMode && (
      <button 
        type="button" 
        onClick={resetForm}
        className="text-[11px] font-bold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl transition active:scale-95"
      >
        إلغاء التعديل
      </button>
    )}
  </div>

  <form onSubmit={handleSubmit} className="space-y-5">
    
    {/* حقل العنوان */}
    <div className="space-y-1.5">
      <label className="block text-xs font-black text-slate-700">عنوان المجلة <span className="text-rose-500">*</span></label>
      <input
        type="text"
        name="title"
        disabled={isSubmitting}
        value={formData.title}
        onChange={handleInputChange}
        placeholder="مثال: مجلة عيد الأضحى المبارك"
        className="w-full p-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none disabled:bg-slate-100 text-slate-800 font-medium transition-all"
        required
      />
    </div>

    {/* حقول التواريخ المدمجة */}
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="block text-xs font-black text-slate-700">تاريخ البدء <span className="text-rose-500">*</span></label>
        <input
          type="date"
          name="startDate"
          disabled={true}
          value={formData.startDate}
          onChange={handleInputChange}
          className="w-full p-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none disabled:bg-slate-100 font-medium text-slate-700 transition-all"
          required
        />
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-black text-slate-700">تاريخ الانتهاء <span className="text-rose-500">*</span></label>
        <input
          type="date"
          name="endDate"
          disabled={isSubmitting}
          value={formData.endDate}
          onChange={handleInputChange}
          className="w-full p-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none disabled:bg-slate-100 font-medium text-slate-700 transition-all"
          required
        />
      </div>
    </div>

    {/* الحد الأقصى وصورة المجلة */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label className="block text-xs font-black text-slate-700">الحد الأقصى للمبيعات الكلية</label>
        <input
          type="number"
          name="totalLimit"
          min="1"
          disabled={isSubmitting}
          value={formData.totalLimit}
          onChange={handleInputChange}
          placeholder="اتركه فارغاً ليكون مفتوحاً"
          className="w-full p-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none disabled:bg-slate-100 text-slate-800 font-medium transition-all"
        />
      </div>
      
      <div className="space-y-1.5">
        <label className="block text-xs font-black text-slate-700">رابط صورة المجلة (URL)</label>
        <input
          type="url"
          placeholder="https://example.com/banner.jpg"
          disabled={isSubmitting}
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-3 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:outline-none text-left disabled:bg-slate-100 font-mono text-slate-600 transition-all"
          dir="ltr"
        />
      </div>
    </div>

    {/* لوحة البحث الذكي وإدراج المنتجات */}
    <div className="border border-slate-100 p-4 rounded-2xl bg-slate-50/40 space-y-4 relative" ref={dropdownRef}>
      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-2">محرك إدراج المنتجات الذكي</h3>
      
      <div className="relative">
        <label className="block text-[11px] font-bold text-slate-600 mb-1.5">ابحث عن المنتج بالاسم...</label>
        <input
          type="text"
          placeholder="اكتب اسم المنتج لبدء البحث الفوري..."
          disabled={isSubmitting}
          value={searchQuery}
          onFocus={() => setShowDropdown(true)}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          className="w-full p-3 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium text-slate-800 transition-all"
        />
        
        {/* صندوق نتائج البحث المنسدل الفاخر */}
        {showDropdown && (searchQuery.trim().length >= 2 || searchLoading) && (
          <div className="absolute z-30 w-full bg-white border border-slate-100 mt-1.5 rounded-xl -2xl max-h-56 overflow-y-auto divide-y divide-slate-50">
            {searchLoading ? (
              <div className="p-4 text-xs text-slate-400 font-bold text-center animate-pulse">جاري فحص قاعدة البيانات...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-xs text-slate-400 font-bold text-center">عذراً، لم نجد منتجاً بهذا الاسم</div>
            ) : (
              searchResults.map((product) => (
                <div
                  key={product._id}
                  onClick={() => !isSubmitting && handleSelectProductFromSearch(product)}
                  className="p-3 text-xs hover:bg-slate-50/80 cursor-pointer flex flex-col gap-1 text-right transition-colors"
                >
                  <span className="font-black text-slate-800 text-[13px]">{product.productName}</span>
                  {product.description && <span className="text-slate-400 truncate text-[11px] font-normal">{product.description}</span>}
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="bg-sky-50 text-sky-600 px-2 py-0.5 rounded text-[10px] font-bold">وحدة البيع: {product.unit_type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* بطاقة تفاصيل المنتج المحدد الحالي */}
      {currentProductSelection.productId && (
        <div className="p-4 bg-white border border-slate-100 rounded-xl -sm space-y-4">
          
          {/* تفاصيل تسعير المخزن كـ Badges صريحة */}
          <div className="grid grid-cols-2 gap-2 text-xs font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="col-span-2 border-b border-slate-200/60 pb-1 text-slate-800">
              المنتج النشط: <span className="text-sky-600 font-black">{currentProductSelection.productName}</span>
            </div>
            
            <div className="text-slate-500">
              طبيعة المعاملة: <span className="text-slate-800 font-black">{currentProductSelection.unitType}</span>
            </div>
            
            <div className="text-slate-500">
              التكلفة الأساسية: <span className="text-emerald-600 font-black">{currentProductSelection.purchasePrice} ج</span>
            </div>

            {currentProductSelection.unitType === "كرتونة" ? (
              <>
                <div className="text-slate-500">
                  سعر البيع الافتراضي: <span className="text-slate-800 font-black">{currentProductSelection.packageSellingPrice} ج</span>
                </div>
                <div className="text-slate-500">
                  المتاح بالمخزن: <span className="text-rose-600 font-black">{currentProductSelection.availableQuantity} كرتونة</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-slate-500">
                  سعر البيع الافتراضي: <span className="text-slate-800 font-black">{currentProductSelection.pieceSellingPrice} ج</span>
                </div>
                <div className="text-slate-500">
                  المتاح بالمخزن: <span className="text-rose-600 font-black">{currentProductSelection.totalUnits} قطعة</span>
                </div>
              </>
            )}
          </div>
          
          {/* مدخلات أسعار العرض */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-black text-slate-700">السعر داخل المجلة *</label>
              <input
                type="number"
                min="0"
                step="any"
                disabled={isSubmitting}
                placeholder="0.00 ج.م"
                value={currentProductSelection.offerPrice}
                onChange={(e) => setCurrentProductSelection({...currentProductSelection, offerPrice: e.target.value})}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-black text-slate-800 focus:outline-none focus:border-sky-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[11px] font-black text-slate-700">أقصى حد لكل عميل</label>
              <input
                type="number"
                min="1"
                disabled={isSubmitting}
                placeholder="بدون حد"
                value={currentProductSelection.maxPerUser}
                onChange={(e) => setCurrentProductSelection({...currentProductSelection, maxPerUser: e.target.value})}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-black text-slate-800 focus:outline-none focus:border-sky-500 transition-all"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={addProductToOfferList}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 rounded-xl text-xs transition duration-200 disabled:bg-slate-200 disabled:text-slate-400 active:scale-98 -sm"
          >
            تأكيد إدراج المنتج في القائمة
          </button>
        </div>
      )}

      {/* لوحة التنبيهات المؤسسية النظيفة */}
      <div className="bg-amber-50/60 border-r-4 border-amber-500 p-3 rounded-xl text-[11px] text-amber-900 font-medium leading-relaxed">
        شروط الانضمام للمجلة: يجب ألا يتجاوز حد العميل الكمية الفعلية المتاحة في مخازنك، كما يشترط أن يكون سعر المجلة أقل من سعر البيع الخارجي وأعلى من تكلفة الشراء الأساسية.
      </div>
    </div>

    {/* قسم عرض المنتجات المدرجة مؤقتاً */}
    {addedProducts.length > 0 && (
      <div className="space-y-2">
        <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">المنتجات الجاهزة للاعتماد ({addedProducts.length})</label>
        <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-100 p-2 rounded-2xl bg-slate-50/30 divide-y divide-slate-100/10">
          {addedProducts.map((p) => (
            <div key={p.product} className="flex justify-between items-center text-xs p-2.5 bg-white rounded-xl border border-slate-100 -sm/5 group/item">
              <div className="flex flex-col gap-0.5">
                <span className="font-black text-slate-800 text-[12px]">{p.name}</span>
                <span className="text-slate-400 font-bold text-[10px]">الحد الأقصى: {p.maxPerUser || 'مفتوح'} {p.unitType}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-black text-[12px]">
                  {p.offerPrice} ج.م
                </span>
                <button 
                  type="button" 
                  disabled={isSubmitting}
                  onClick={() => removeProductFromOfferList(p.product)}
                  className="text-slate-300 hover:text-rose-600 font-bold p-1 text-sm transition-colors disabled:text-slate-200"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* زر الإرسال والحفظ النهائي الفاخر */}
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full cursor-pointer text-white font-black py-3.5 rounded-xl transition duration-200 -lg flex justify-center items-center text-sm active:scale-98 ${
        isSubmitting 
          ? 'bg-slate-300 cursor-not-allowed text-slate-500 -none' 
          : isEditMode 
            ? 'bg-amber-600 hover:bg-amber-700 -amber-600/10' 
            : 'bg-sky-600 hover:bg-sky-700 -sky-600/10'
      }`}
    >
      {isSubmitting ? 'جاري مزامنة وحفظ البيانات...' : isEditMode ? 'تحديث وتعديل المجلة بالكامل' : 'حفظ وتفعيل المجلة بالكامل'}
    </button>
  </form>
</div>

        {/* عمود استعراض المجلات */}
        <div className="xl:col-span-2 bg-white p-6 rounded-xl -sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">مجلات العروض النشطة والأرشيف ({offers.length})</h2>

          {loading ? (
            <div className="text-center py-12 text-gray-500">جاري الاتصال بالسيرفر وجلب العروض الحالية...</div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">لا يوجد عروض أو مجلات منشأة حالياً</div>
          ) : (
            <div className="space-y-4">
              {offers.map((offer) => {
                const changing = isToggling.includes(offer._id);
                const deleting = isDeleting.includes(offer._id);
                
                const currentImgUrl = typeof offer.image === 'string' ? offer.image : (offer.image?.url || offer.imageUrl || "");

                return (
         <div 
  key={offer._id} 
  className="relative bg-white border border-slate-100 rounded-2xl p-5 hover:-xl hover:border-sky-200 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group overflow-hidden"
  dir="rtl"
>
  
  {/* شريط جانبي جمالي يظهر بملء الكارد عند تمرير الماوس */}
  <div className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-sky-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

  {/* 1. قسم الوسائط / الصورة الإعلانية المطور (3 أعمدة) */}
  <div className="md:col-span-3 flex justify-center items-center relative">
    {offer.image?.url ? (
      <div className="relative w-full h-32 rounded-xl overflow-hidden -inner border border-slate-100">
        <img 
          src={offer.image.url} 
          alt={offer.title} 
          className="h-full w-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
        />
        {/* شارة الحالة عائمة فوق الصورة بشكل ذكي */}
        <span className={`absolute top-2 right-2 px-2.5 py-1 rounded-md text-[11px] font-black tracking-wide -sm ${
          offer.active 
            ? 'bg-emerald-500 text-white animate-pulse' 
            : 'bg-rose-500 text-white'
        }`}>
          {offer.active ? 'نشط الآن' : 'موقوف'}
        </span>
      </div>
    ) : (
      <div className="h-32 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-xs text-slate-400 font-bold gap-1">
        <span>بدون صورة إعلانية</span>
      </div>
    )}
  </div>

  {/* 2. قسم البيانات والمؤشرات البصرية (6 أعمدة) */}
  <div className="md:col-span-6 space-y-4">
    <div>
      <h3 className="font-black text-xl text-slate-800 tracking-tight mb-2 group-hover:text-sky-600 transition-colors">
        {offer.title}
      </h3>
      
      {/* كبسولة هندسية نظيفة لعرض فترات الصلاحية */}
      <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-lg text-xs font-bold text-slate-600">
        <span className="text-slate-400">فترة الصلاحية:</span>
        <span className="text-slate-800">{offer.startDate ? new Date(offer.startDate).toLocaleDateString('ar-EG') : 'فوري'}</span>
        <span className="text-slate-400">←</span>
        <span className="text-rose-600">{offer.endDate ? new Date(offer.endDate).toLocaleDateString('ar-EG') : 'غير محدد'}</span>
      </div>
    </div>

    {/* شريط تقدم تفاعلي لقياس حجم المبيعات أوتوماتيكيًا بدلاً من الكتابة الجافة */}
    <div className="space-y-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100/70">
      <div className="flex justify-between text-xs font-black text-slate-700">
        <span>مؤشر استهلاك مخزون العرض</span>
        <span className="text-sky-600 font-mono">
          {offer.soldCount || 0} / {offer.totalLimit || 0} قطعة
        </span>
      </div>
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
        <div 
          className="bg-gradient-to-r from-sky-500 to-cyan-500 h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(((offer.soldCount || 0) / (offer.totalLimit || 1)) * 100, 100)}%` }}
        ></div>
      </div>
    </div>

    {/* كبسولات المنتجات المرتبطة (Badges) المنفصلة */}
    <div className="space-y-1.5">
      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">المنتجات المشمولة بالعرض</h4>
      <div className="flex flex-wrap gap-1.5">
        {offer.products && offer.products.length > 0 ? (
          offer.products.map((p, idx) => (
            <div key={idx} className="bg-white border border-slate-200 text-[12px] font-bold px-2.5 py-1 rounded-lg text-slate-700 -sm flex items-center gap-2 hover:border-sky-300 transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              <span>{p.product?.productName || "منتج غير مدرج"}</span>
              <span className="bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded-md font-black text-[11px]">
                {p.offerPrice} ج.م
              </span>
            </div>
          ))
        ) : (
          <span className="text-xs text-slate-400 font-medium">لا توجد منتجات مرتبطة بهذا العرض حالياً</span>
        )}
      </div>
    </div>
  </div>

  {/* 3. لوحة أزرار التحكم والعمليات الحادة (3 أعمدة) */}
  <div className="md:col-span-3 flex flex-row md:flex-col justify-end gap-2.5 w-full pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
    
    {/* <button
      type="button"
      disabled={changing || deleting || isSubmitting}
      onClick={() => handleToggleStatus(offer._id)}
      className={`text-xs font-black tracking-wide py-2.5 px-4 rounded-xl border transition-all duration-200 w-full text-center disabled:opacity-50 -sm active:scale-95 ${
        offer.active 
          ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-500' 
          : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600'
      }`}
    >
      {changing ? 'جاري المعالجة...' : offer.active ? 'تعطيل مؤقت' : 'تنشيط العرض'}
    </button> */}

    <button
      type="button"
      disabled={changing || deleting || isSubmitting}
      onClick={() => handleEditClick(offer)}
      className="text-xs font-black cursor-pointer tracking-wide py-2.5 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 w-full text-center disabled:opacity-50 -sm active:scale-95"
    >
      تعديل البيانات
    </button>
    
    <button
      type="button"
      disabled={changing || deleting || isSubmitting}
      onClick={() => handleDeleteOffer(offer._id)}
      className="text-xs font-black cursor-pointer tracking-wide py-2.5 px-4 rounded-xl border border-rose-100 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all duration-200 w-full text-center disabled:opacity-50 -sm active:scale-95"
    >
      {deleting ? 'جاري الحذف...' : 'حذف نهائي'}
    </button>

  </div>

</div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}