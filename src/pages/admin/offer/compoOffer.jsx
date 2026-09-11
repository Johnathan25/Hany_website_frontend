import React, { useState, useEffect, useRef } from 'react';
import api from '../../../services/api';
import { showAlert } from '../../../services/alert';
import { showAlertConfirm } from '../../../services/alertConfirm';
import { Calendar, Edit3, Layers, Package, Tag, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

export default function AdminComboDashboard() {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // حالات تتبع وضع التعديل
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingComboId, setEditingComboId] = useState(null);

  // حالات منع النقر المتكرر أثناء العمليات الحية
  const [isToggling, setIsToggling] = useState([]); 
  const [isDeleting, setIsDeleting] = useState([]); 

  // حالات البحث الحي عن المنتجات
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // البيانات الأساسية لنموذج الكومبو (بما يتوافق مع Schema الباكيند)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    totalLimit: 1000,
    discountType: "fixed", // fixed أو percentage
    discountValue: "",
    maxPerUser: 1
  });
  
  const [imageUrl, setImageUrl] = useState("");
  const [addedItems, setAddedItems] = useState([]); // لحفظ كائنات الـ items: { product, name, quantity, unit_type, purchasePrice, sellingPrice }
  
  // الاحتفاظ ببيانات المنتج الأصلي القادم من السيرفر لعمل الحسابات والـ Validation
  const [selectedProductRaw, setSelectedProductRaw] = useState(null);

  const [currentProductSelection, setCurrentProductSelection] = useState({
    productId: "",
    productName: "",
    quantity: 1,
    unit_type: "قطعة" // الافتراضي "قطعة" وتتغير إلى "كرتونة" إذا كانت متاحة
  });

  // جلب جميع عروض الكومبو من السيرفر
  const fetchCombos = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get('/compoOffer'); 
      if (res.data) {
        setCombos(res.data.combos || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء جلب عروض الكومبو من السيرفر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  // دالة البحث الحي Debounce عن المنتجات
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

  // إغلاق قائمة البحث المنبثقة عند الضغط خارجها
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
    setSelectedProductRaw(product); // حفظ البيانات الكاملة للمنتج لإجراء الـ Validation لاحقاً
    setCurrentProductSelection({
      productId: product._id,
      productName: product.productName,
      quantity: 1,
      unit_type: product.unit_type === "كرتونة" ? "كرتونة" : "قطعة" // مطابقة الوحدة الافتراضية للمنتج
    });
    setSearchQuery(""); 
    setSearchResults([]);
    setShowDropdown(false);
  };

  const addItemToComboList = () => {
    const { productId, productName, quantity, unit_type } = currentProductSelection;
    
    if (!productId || !selectedProductRaw) {
      showAlert({ title: "الرجاء البحث واختيار منتج أولاً", icon: "error" });
      return;
    }
    if (!quantity || Number(quantity) <= 0) {
      showAlert({ title: "الرجاء تحديد كمية صحيحة للمنتج", icon: "error" });
      return;
    }

    if (addedItems.some(item => item.product === productId)) {
      showAlert({ title: "هذا المنتج مضاف بالفعل في هذا الكومبو، يمكنك تعديل كميته أو حذفه", icon: "warning" });
      return;
    }


    let itemPurchasePrice = 0;
    let itemSellingPrice = 0;

        
    console.log("المنتج المختار للتحقق:", selectedProductRaw);
    if ((unit_type === "كرتونة") && (quantity > selectedProductRaw.availableQuantity)) {
     return  showAlert({ title: `الكمية المطلوبة (${quantity} كرتونة) تتجاوز الكمية المتاحة (${selectedProductRaw.availableQuantity} كرتونة) لهذا المنتج`, icon: "error"  , time:5000});
    }
    if((unit_type === "قطعة") && (quantity > selectedProductRaw.totalUnits)) {
     return  showAlert({ title: `الكمية المطلوبة (${quantity} قطعة) تتجاوز الكمية المتاحة (${selectedProductRaw.totalUnits} قطعة) لهذا المنتج`, icon: "error"  , time:5000});
    }

    if (unit_type === "كرتونة") {
      itemPurchasePrice = selectedProductRaw.purchasePrice || 0; 
      itemSellingPrice = selectedProductRaw.packageSellingPrice || 0; 
      
    } else {

      const unitsPerPkg = selectedProductRaw.unitsPerPackage || 1;
      itemPurchasePrice = selectedProductRaw.purchasePrice ? (selectedProductRaw.purchasePrice / unitsPerPkg) : 0;
      itemSellingPrice = selectedProductRaw.pieceSellingPrice || 0;
    }

    setAddedItems([
      ...addedItems,
      {
        product: productId,
        name: productName,
        quantity: Number(quantity),
        unit_type: unit_type,
        purchasePrice: Number(itemPurchasePrice),
        sellingPrice: Number(itemSellingPrice)
      }
    ]);

    // تصفير الاختيار الحالي
    setCurrentProductSelection({
      productId: "",
      productName: "",
      quantity: 1,
      unit_type: "قطعة"
    });
    setSelectedProductRaw(null);
  };

  const removeItemFromComboList = (productId) => {
    setAddedItems(addedItems.filter(item => item.product !== productId));
  };

  // دالة الحفظ والتحقق الشامل (Form Validation)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. التحقق من الحقول الأساسية
    if (!formData.title || !formData.discountValue || !formData.startDate || !formData.endDate) {
      showAlert({ title: "الرجاء ملء كافة الحقول الإلزامية للكومبو", icon: "error" });
      return;
    }

    // 2. التحقق من وجود منتجات داخل العرض
    if (addedItems.length === 0) {
      showAlert({ title: "يجب إضافة منتج واحد على الأقل لتكوين الكومبو", icon: "error" });
      return;
    }

    // 3. حساب إجمالي أسعار الشراء وإجمالي أسعار البيع الرسمية للمنتجات المضافة
    let totalComboPurchasePrice = 0;
    let totalComboOriginalSellingPrice = 0;

    addedItems.forEach(item => {
      totalComboPurchasePrice += (item.purchasePrice * item.quantity);
      totalComboOriginalSellingPrice += (item.sellingPrice * item.quantity);
    });

    // 4. حساب السعر النهائي للكومبو بعد الخصم المطبق للتحقق منه
    let finalComboPriceAfterDiscount = 0;
    const discountVal = Number(formData.discountValue);

    if (formData.discountType === "percentage") {
      if (discountVal <= 0 || discountVal >= 100) {
        showAlert({ title: "نسبة الخصم المئوية يجب أن تكون أكبر من 0 وأقل من 100%", icon: "error" });
        return;
      }
      finalComboPriceAfterDiscount = totalComboOriginalSellingPrice * (1 - (discountVal / 100));
    }
    //  else if (formData.discountType === "fixed") {
    //   if (discountVal <= 0 || discountVal >= totalComboOriginalSellingPrice) {
    //     showAlert({ title: `قيمة الخصم الثابت يجب أن تكون أقل من القيمة الإجمالية الأصلية للكومبو (${totalComboOriginalSellingPrice} ج.م)`, icon: "error" });
    //     return;
    //   }
    //   finalComboPriceAfterDiscount = totalComboOriginalSellingPrice - discountVal;
    // }

    // 5. تطبيق الـ Validation المالي الصارم لحماية أرباح المصنع
    // التحقق: السعر بعد الخصم يجب أن يكون أكبر من تكلفة الشراء لضمان عدم الخسارة، وأقل من سعر البيع الأصلي ليكون عرضاً حقيقياً
    // if (finalComboPriceAfterDiscount <= totalComboPurchasePrice) {
    //   showAlert({ 
    //     title: "خطأ في تسعير العرض ⚠️", 
    //     text: `قيمة الخصم كبيرة جداً وتجعل سعر الكومبو (${finalComboPriceAfterDiscount.toFixed(2)} ج.م) أقل من أو يساوي سعر تكلفة الشراء الأصلية (${totalComboPurchasePrice.toFixed(2)} ج.م). يرجى تقليل قيمة الخصم لحماية هامش الربح.`, 
    //     icon: "error" 
    //   });
    //   return;
    // }

    if (finalComboPriceAfterDiscount >= totalComboOriginalSellingPrice) {
      showAlert({
        title: "تنبيه في التسعير",
        text: `سعر الكومبو بعد الخصم لا يقدم أي توفير للعميل مقارنة بسعر البيع الفردي الأصلي.`,
        icon: "warning"
      });
      return;
    }

    // 6. التحقق من تواريخ الصلاحية منطقياً
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      showAlert({ title: "تاريخ بدء العرض لا يمكن أن يكون بعد تاريخ انتهائه", icon: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // تجهيز البيانات المطابقة للـ Schema بوضوح
      const preparedItems = addedItems.map(item => ({
        product: item.product,
        quantity: Number(item.quantity),
        unit_type: item.unit_type
      }));

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalLimit: Number(formData.totalLimit),
        discountType: formData.discountType,
        discountValue: discountVal,
        maxPerUser: Number(formData.maxPerUser),
        image: {
          url: imageUrl.trim(),
          publicId: "" 
        },
        items: preparedItems
      };

      let response;
      if (isEditMode) {
        response = await api.put(`/compoOffer/${editingComboId}`, payload);
      } else {
        response = await api.post('/compoOffer', payload);
      }

      if (response.data) {
        showAlert({ 
          icon: "success", 
          title: isEditMode ? "تم تعديل عرض الكومبو بنجاح" : "تم إنشاء عرض الكومبو بنجاح" 
        });
        resetForm();
        fetchCombos(); 
      }
    } catch (err) {
      showAlert({ icon: "error", title: err.response?.data?.message || "فشلت العملية" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // إعداد حقول الاستمارة للتعديل بأمان
  const handleEditClick = (combo) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsEditMode(true);
    setEditingComboId(combo._id);
    
    const formattedStartDate = combo.startDate ? new Date(combo.startDate).toISOString().split('T')[0] : "";
    const formattedEndDate = combo.endDate ? new Date(combo.endDate).toISOString().split('T')[0] : "";

    setFormData({
      title: combo.title || "",
      description: combo.description || "",
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      totalLimit: combo.totalLimit || 1000,
      discountType: combo.discountType || "fixed",
      discountValue: combo.discountValue || "",
      maxPerUser: combo.maxPerUser || 1
    });

    const imgUrl = combo.image && typeof combo.image === 'object' ? (combo.image.url || "") : (combo.image || "");
    setImageUrl(imgUrl);

    // إعادة بناء مصفوفة العناصر مع حساب أسعارها بناءً على الوحدة المخزنة بالـ داتابيز
    const mappedItems = (combo.items || []).map(item => {
      const prod = item.product || {};
      const uType = item.unit_type || "قطعة";
      
      let uPurchase = 0;
      let uSelling = 0;

      if (uType === "كرتونة") {
        uPurchase = prod.purchasePrice || 0;
        uSelling = prod.packageSellingPrice || 0;
      } else {
        const unitsPerPkg = prod.unitsPerPackage || 1;
        uPurchase = prod.purchasePrice ? (prod.purchasePrice / unitsPerPkg) : 0;
        uSelling = prod.pieceSellingPrice || 0;
      }

      return {
        product: prod._id || item.product,
        name: prod.productName || "منتج مدرج",
        quantity: Number(item.quantity || 1),
        unit_type: uType,
        purchasePrice: uPurchase,
        sellingPrice: uSelling
      };
    });
    
    setAddedItems(mappedItems);
  };

  const resetForm = () => {
    setIsEditMode(false);
    setEditingComboId(null);
    setFormData({
      title: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      totalLimit: 1000,
      discountType: "fixed",
      discountValue: "",
      maxPerUser: 1
    });
    setAddedItems([]);
    setImageUrl("");
    setSearchQuery("");
    setSearchResults([]);
    setSelectedProductRaw(null);
    setCurrentProductSelection({
      productId: "",
      productName: "",
      quantity: 1,
      unit_type: "قطعة"
    });
  };

  const handleDeleteCombo = async (id) => {
    const confirmDelete = await showAlertConfirm({
      title: "هل أنت متأكد من حذف هذا الكومبو؟",
      text: "سيتم إزالة العرض نهائياً من قاعدة البيانات ولا يمكن تدويره لاحقاً",
      icon: "warning",
      confirmButtonText: "نعم، احذف الكومبو",
      cancelButtonText: "إلغاء"
    });
    if (!confirmDelete.isConfirmed) return;

    try {
      setIsDeleting(prev => [...prev, id]);
      const response = await api.delete(`/compoOffer/${id}`);
      if (response.data) {
        showAlert({ icon: "success", title: "تم حذف عرض الكومبو بنجاح" });
        setCombos(combos.filter(c => c._id !== id));
        if (editingComboId === id) resetForm();
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
      const response = await api.patch(`/compoOffer/${id}/toggle`);
      if (response.data) {
        showAlert({ icon: "success", title: response.data.message });
        setCombos(combos.map(c => c._id === id ? { ...c, active: response.data.combo.active } : c));
      }
    } catch (err) {
      showAlert({ icon: "error", title: err.response?.data?.message || "فشلت العملية" });
    } finally {
      setIsToggling(prev => prev.filter(item => item !== id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-right font-" dir="rtl">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم بعروض الكومبو (المجموعات)</h1>
        <p className="text-gray-500 mt-1">إنشاء وإدارة عروض المنتجات التي تباع معاً كباقة واحدة بخصومات محددة ومعايير أمان مالي</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 font-medium">
          ⚠️ خطأ: {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* عمود الإنشاء والتعديل */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit xl:col-span-1">
          <div className="flex justify-between items-center mb-6 pb-2 border-b">
            <h2 className="text-xl font-bold text-gray-800">
              {isEditMode ? "تعديل عرض الكومبو الحالي" : "إنشاء باقة كومبو جديدة"}
            </h2>
            {isEditMode && (
              <button 
                type="button" 
                onClick={resetForm}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1 rounded"
              >
                إلغاء التعديل
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم / عنوان الكومبو *</label>
              <input
                type="text"
                name="title"
                disabled={isSubmitting}
                value={formData.title}
                onChange={handleInputChange}
                placeholder="مثال: كومبو التوفير من برجر الحسن"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:outline-none disabled:bg-gray-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">وصف العرض</label>
              <textarea
                name="description"
                disabled={isSubmitting}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="اكتب وصفاً أو تفاصيل إضافية عن مكونات هذه الباقة..."
                rows="2"
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:outline-none disabled:bg-gray-100 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع الخصم الكلي *</label>
                <select
                  name="discountType"
                  disabled={isSubmitting}
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:outline-none bg-white text-sm disabled:bg-gray-100"
                >
                  <option value="fixed">مبلغ ثابت الكسر (ج.م)</option>
                  <option value="percentage">نسبة مئوية (%)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">قيمة الخصم للكومبو *</label>
                <input
                  type="number"
                  name="discountValue"
                  min="0"
                  step="any"
                  disabled={isSubmitting}
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  placeholder={formData.discountType === 'percentage' ? "مثال: 10" : "مثال: 150"}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:outline-none disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البدء *</label>
                <input
                  type="date"
                  name="startDate"
                  disabled={true}
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:outline-none text-sm disabled:bg-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء *</label>
                <input
                  type="date"
                  name="endDate"
                  disabled={isSubmitting}
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:outline-none text-sm disabled:bg-gray-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحد الكلي للكومبو</label>
                <input
                  type="number"
                  name="totalLimit"
                  min="1"
                  disabled={isSubmitting}
                  value={formData.totalLimit}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:outline-none text-sm disabled:bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحد لكل مستخدم</label>
                <input
                  type="number"
                  name="maxPerUser"
                  min="1"
                  disabled={isSubmitting}
                  value={formData.maxPerUser}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:outline-none text-sm disabled:bg-gray-100"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رابط صورة الكومبو (URL)</label>
              <input
                type="url"
                placeholder="https://example.com/combo.jpg"
                disabled={isSubmitting}
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[#0284c7] focus:outline-none text-left text-sm disabled:bg-gray-100"
                dir="ltr"
              />
            </div>

            {/* محرك البحث وإضافة المنتجات بربط الوحدة والتحقق من الأسعار */}
            <div className="border p-4 rounded-xl bg-gray-50/50 mt-4 space-y-3 relative" ref={dropdownRef}>
              <h3 className="text-sm font-bold text-gray-800 border-b pb-1 flex justify-between items-center">
                <span>ابحث عن منتج لضمه للباقة</span>
                <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded">ربط تلقائي بالوحدة والأسعار</span>
              </h3>
              
              <div className="relative">
                <label className="block text-xs font-medium text-gray-600 mb-1">اسم المنتج للبحث السريع...</label>
                <input
                  type="text"
                  placeholder="اكتب حرفين أو أكثر (مثل: الحسن)..."
                  disabled={isSubmitting}
                  value={searchQuery}
                  onFocus={() => setShowDropdown(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  className="w-full p-2 border rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#0284c7] disabled:bg-gray-100"
                />
                
                {showDropdown && (searchQuery.trim().length >= 2 || searchLoading) && (
                  <div className="absolute z-30 w-full bg-white border mt-1 rounded-lg shadow-lg max-h-56 overflow-y-auto">
                    {searchLoading ? (
                      <div className="p-3 text-xs text-gray-400 text-center">جاري تصفح المنتجات...</div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-3 text-xs text-gray-400 text-center">لا توجد نتائج مطابقة</div>
                    ) : (
                      searchResults.map((product) => (

<div
  key={product._id}
  onClick={() => !isSubmitting && handleSelectProductFromSearch(product)}
  className={`p-3 text-xs hover:bg-sky-50/50 cursor-pointer border-b last:border-b-0 flex items-center gap-3 text-right transition-all duration-150 ${
    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  {/* صورة المنتج المصغرة (اختيارية - تعطي مظهر احترافي جداً) */}
  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
    {product.image?.url ? (
      <img src={product.image.url} alt={product.productName} className="w-full h-full object-cover" />
    ) : (
      <Package className="w-5 h-5 text-gray-400" />
    )}
  </div>

  {/* تفاصيل المنتج */}
  <div className="flex-1 min-w-0 space-y-1">
    <div className="flex justify-between items-start gap-2">
      {/* الاسم والوصف */}
      <div className="space-y-0.5 min-w-0">
        <h4 className="font-bold text-gray-900 text-sm truncate">{product.productName}</h4>
        {product.description && (
          <p className="text-[11px] text-gray-400 truncate max-w-[200px] sm:max-w-[300px]">
            {product.description}
          </p>
        )}
      </div>
      
      {/* شارة الوحدة الأصلية والكمية المتاحة */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-600 border border-gray-200/40 flex items-center gap-1">
          <Layers className="w-3 h-3 text-gray-400" />
          {product.unit_type}
        </span>
        {product.availableQuantity !== undefined && (
          <span className={`text-[10px] font-bold ${product.availableQuantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            المتاح: {product.availableQuantity} {product.unit_type}
          </span>
        )}
      </div>
    </div>

    {/* قسم الأسعار المحسن */}
    <div className="flex gap-2 pt-1">
      {/* سعر القطعة */}
      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md text-gray-600">
        <Tag className="w-3 h-3 text-sky-500" />
        <span>قطعة: <b className="text-gray-800 font-bold">{product.pieceSellingPrice}</b> ج.م</span>
      </div>

      {/* سعر الكرتونة */}
      <div className="flex items-center gap-1.5 bg-emerald-50/40 border border-emerald-100/50 px-2 py-1 rounded-md text-emerald-700">
        <Package className="w-3 h-3 text-emerald-500" />
        <span>كرتونة: <b className="text-emerald-800 font-bold">{product.packageSellingPrice}</b> ج.م</span>
      </div>
    </div>
  </div>
</div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {currentProductSelection.productId && selectedProductRaw && (
                <div className="p-3 bg-sky-50/50 border border-sky-100 rounded-lg space-y-3">
                  <div className="text-xs text-sky-900 font-medium border-b pb-1">
                    المنتج المختار: <span className="font-bold text-gray-800">{currentProductSelection.productName}</span>
                  </div>
                  
                  {/* تحديد وحساب نوع الوحدة المستهدفة في العرض */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1">بيع العرض بـ:</label>
                      <select
                        value={currentProductSelection.unit_type}
                        onChange={(e) => setCurrentProductSelection({...currentProductSelection, unit_type: e.target.value})}
                        className="w-full p-1.5 border rounded bg-white text-xs focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
                      >
                        <option value="قطعة">قطعة individual</option>
                        {selectedProductRaw.unit_type === "كرتونة" && (
                          <option value="كرتونة">كرتونة كاملة</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-600 mb-1">الكمية داخل الباقة:</label>
                      <input
                        type="number"
                        min="1"
                        disabled={isSubmitting}
                        value={currentProductSelection.quantity}
                        onChange={(e) => setCurrentProductSelection({...currentProductSelection, quantity: e.target.value})}
                        className="w-full p-1.5 border rounded text-xs bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* استعراض النطاق السعري التوضيحي للمسؤول بناء على اختياره */}
                  <div className="bg-white p-2 rounded border border-gray-200 text-[11px] space-y-1 text-gray-600">
                    <p className="font-semibold text-gray-700">🔍 النطاق السعري للوحدة المختارة:</p>
                    {currentProductSelection.unit_type === "كرتونة" ? (
                      <>
                        <p>• سعر تكلفة الشراء: <span className="text-red-600 font-medium">{(selectedProductRaw.purchasePrice || 0).toFixed(2)} ج.م</span></p>
                        <p>• سعر البيع الرسمي: <span className="text-emerald-600 font-medium">{(selectedProductRaw.packageSellingPrice || 0).toFixed(2)} ج.م</span></p>
                        <p>•   الكميه المتاحة: <span className="text-emerald-600 font-medium">{(selectedProductRaw.availableQuantity || 0)} </span></p>

                      </>
                    ) : (
                      <>
                        <p>• سعر تكلفة الشراء (محسوب): <span className="text-red-600 font-medium">{((selectedProductRaw.purchasePrice || 0) / (selectedProductRaw.unitsPerPackage || 1)).toFixed(2)} ج.م</span></p>
                        <p>• سعر البيع الرسمي: <span className="text-emerald-600 font-medium">{(selectedProductRaw.pieceSellingPrice || 0).toFixed(2)} ج.م</span></p>
                        <p>•   الكميه المتاحة: <span className="text-emerald-600 font-medium">{(selectedProductRaw.totalUnits || 0)} </span></p>

                        
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={addItemToComboList}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-1.5 rounded-lg text-xs transition duration-200"
                  >
                    + تأكيد إدراج المنتج بمواصفاته
                  </button>
                </div>
              )}
            </div>

            {/* استعراض المنتجات المجهزة لتأليف الكومبو الحالي */}
            {addedItems.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">مكونات باقة الكومبو الحالية ({addedItems.length}):</label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 border p-2 rounded-lg bg-white">
                  {addedItems.map((item) => (
                    <div key={item.product} className="text-xs p-2.5 bg-gray-50 rounded border flex flex-col gap-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800 truncate max-w-[180px]">{item.name}</span>
                        <button 
                          type="button" 
                          disabled={isSubmitting}
                          onClick={() => removeItemFromComboList(item.product)}
                          className="text-red-500 hover:text-red-700 font-bold px-1"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-gray-500 bg-white p-1 rounded border border-gray-100">
                        <span>الكمية: <b className="text-blue-600">{item.quantity} ({item.unit_type})</b></span>
                        <span>شراء للوحدة: {item.purchasePrice.toFixed(1)}</span>
                        <span>بيع فردي: {item.sellingPrice.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white font-medium py-2.5 rounded-lg transition duration-200 shadow-sm mt-2 flex justify-center items-center gap-2 ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : isEditMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#0284c7] hover:bg-[#026694]'
              }`}
            >
              {isSubmitting ? 'جاري تدوين وحساب البيانات...' : isEditMode ? 'تحديث وتطبيق تعديلات الكومبو' : 'حفظ ونشر الباقة الكومبو للعملاء'}
            </button>
          </form>
        </div>

{/* عمود استعراض الكومبوهات المنشأة */}
<div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100/80 backdrop-blur-sm">
  <div className="flex items-center justify-between mb-6">
    <div className="space-y-1">
      <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
        <Layers className="w-5 h-5 text-sky-600" />
        قائمة عروض ومجموعات الكومبو الحالية
      </h2>
      <p className="text-xs text-gray-500">إجمالي العروض المسجلة حالياً: {combos.length} باقة</p>
    </div>
  </div>

  {loading ? (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500 space-y-3">
      <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium animate-pulse">جاري قراءة البيانات والاتصال بقاعدة البيانات...</p>
    </div>
  ) : combos.length === 0 ? (
    <div className="text-center py-16 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
      <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-sm font-medium text-gray-400">لا توجد عروض باقات كومبو متوفرة حالياً بالمنصة</p>
    </div>
  ) : (
    <div className="space-y-4">
      {combos.map((combo) => {
        const changing = isToggling.includes(combo._id);
        const deleting = isDeleting.includes(combo._id);
        const currentImgUrl = combo.image && typeof combo.image === 'object' ? (combo.image.url || "") : (combo.image || "");

        const totalLimit = combo.totalLimit || 1000;
        const soldCount = combo.soldCount || 0;

        const soldPercentage = totalLimit > 0
          ? Math.min(100, Math.round((soldCount / totalLimit) * 100))
          : 0;

        const remainingCount = totalLimit - soldCount;
        
        return (
          <div key={combo._id} className="group border border-gray-100 rounded-xl p-4 hover:border-sky-100 hover:shadow-md hover:shadow-sky-50/30 transition-all duration-300 bg-white grid grid-cols-1 md:grid-cols-4 gap-5 items-center">
            
            {/* تفاصيل الكومبو الأساسية */}
            <div className="md:col-span-2 space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center flex-wrap gap-2">
                  <h3 className="font-bold text-base text-gray-800 group-hover:text-sky-950 transition-colors">{combo.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                    combo.active 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-rose-50 text-rose-700 border border-rose-100'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${combo.active ? 'bg-emerald-500' : 'bg-rose-500'} ml-1.5`}></span>
                    {combo.active ? 'نشط حالياً' : 'معطل مؤقتاً'}
                  </span>
                </div>
                
                {combo.description && (
                  <p className="text-xs text-gray-500 leading-relaxed pl-1 line-clamp-2">{combo.description}</p>
                )}
              </div>
              
              {/* تفاصيل المالية والصلاحية */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-gray-50/60 p-2.5 rounded-lg border border-gray-100/50 text-xs text-gray-600">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" />
                  <span>الخصم المطبق: <b className="text-emerald-700">{combo.discountValue} {combo.discountType === 'percentage' ? '%' : 'ج.م'}</b></span>
                </div>
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[11px]">
                    ينتهي: {combo.endDate ? new Date(combo.endDate).toLocaleDateString('ar-EG') : 'غير محدد'}
                  </span>
                </div>
              </div>

              {/* شريط تقدم المبيعات (Progress Sold) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-gray-500 px-0.5">
                  <span className="flex items-center gap-1">المباع: <b className="text-gray-700">{soldCount}</b></span>
                  <span className="flex items-center gap-1">المتبقي: <b className="text-gray-700">{remainingCount}</b></span>
                  <span className="text-sky-600 font-extrabold">{soldPercentage}%</span>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      soldPercentage >= 90 ? 'bg-rose-500' : soldPercentage >= 60 ? 'bg-amber-500' : 'bg-sky-500'
                    }`}
                    style={{ width: `${soldPercentage}%` }}
                  />
                </div>
              </div>
              
              {/* المنتجات داخل الكومبو */}
              <div className="pt-1.5 space-y-1.5">
                <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-gray-400" />
                  المنتجات المشمولة بالعرض ({combo.items?.length || 0}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {combo.items?.map((item, idx) => (
                    <span key={idx} className="bg-white border border-gray-200/80 text-[11px] px-2 py-1 rounded-md shadow-2xs text-gray-700 flex items-center gap-1.5 hover:border-gray-300 transition-colors">
                      <span className="font-medium">{item.product?.productName || "منتج مدرج"}</span>
                      <span className="text-gray-400 text-[10px]">×</span>
                      <span className="bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-bold text-[10px]">
                        {item.quantity || 1} {item.unit_type || 'قطعة'}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* عمود البوستر الإعلاني */}
            <div className="flex justify-center items-center md:justify-center">
              {currentImgUrl ? (
                <div className="relative group/img overflow-hidden rounded-xl border border-gray-100 shadow-xs bg-gray-50 aspect-video w-full max-w-[160px] md:max-w-none flex items-center justify-center">
                  <img 
                    src={currentImgUrl} 
                    alt={combo.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-105" 
                  />
                </div>
              ) : (
                <div className="aspect-video w-full max-w-[160px] md:max-w-none bg-gray-50 border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center p-3 text-[11px] text-gray-400">
                  <Layers className="w-5 h-5 text-gray-300 mb-1" />
                  <span>بدون بوستر إعلاني</span>
                </div>
              )}
            </div>

            {/* أزرار التحكم والعمليات */}
            <div className="flex flex-row md:flex-col justify-center gap-2 md:items-end w-full">
              {/* <button
                type="button"
                disabled={changing || deleting || isSubmitting}
                onClick={() => handleToggleStatus(combo._id)}
                className={`flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium border transition-all duration-200 w-full md:w-32 shadow-2xs disabled:opacity-50 ${
                  combo.active 
                    ? 'border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-50 hover:text-amber-800' 
                    : 'border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                {combo.active ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                <span className="truncate">{changing ? 'جاري...' : combo.active ? 'تعطيل مؤقت' : 'تنشيط الباقة'}</span>
              </button> */}

              <button
                type="button"
                disabled={changing || deleting || isSubmitting}
                onClick={() => handleEditClick(combo)}
                className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-2xs transition-all duration-200 w-full md:w-32 disabled:opacity-50"
              >
                <Edit3 className="w-3.5 h-3.5 text-sky-600" />
                <span>تعديل البيانات</span>
              </button>
              
              <button
                type="button"
                disabled={changing || deleting || isSubmitting}
                onClick={() => handleDeleteCombo(combo._id)}
                className="flex items-center justify-center gap-1.5 text-xs px-3 py-2 rounded-lg font-medium border border-rose-100 bg-rose-50/30 text-rose-600 hover:bg-rose-50 hover:text-rose-700 shadow-2xs transition-all duration-200 w-full md:w-32 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="truncate">{deleting ? 'جاري الحذف...' : 'إلغاء الباقة'}</span>
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