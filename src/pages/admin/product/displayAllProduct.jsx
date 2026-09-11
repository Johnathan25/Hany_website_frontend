import { useState, useEffect, useRef, useCallback } from "react";
import api from "../../../services/api";
import { 
  FaEdit, FaTrash, FaImage, FaSpinner, FaSearch, FaBoxOpen, 
  FaStar, FaFilter, FaTimes, FaSave, FaCamera, FaTrashAlt, FaFileExcel,
  FaChevronRight, FaChevronLeft
} from "react-icons/fa";
import { showAlertConfirm } from "../../../services/alertConfirm";
import { showAlert } from "../../../services/alert";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["الكل"]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const fileInputRef = useRef(null);
  
  const navigate = useNavigate();
  
  // States للفلترة والـ Pagination (المرتبطة بالباك الجديد)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("الكل");
  const [filterStatus, setFilterStatus] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [itemsLimit] = useState(10); // عدد العناصر في الصفحة الواحدة

  // States للتعديل
  const [editModal, setEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageDeleted, setImageDeleted] = useState(false);

  // 1. جلب التصنيفات من الـ Endpoint الخاص بها
  const fetchCategories = async () => {
    try {
      const res = await api.get("/product/categories/all");
      // افتراضاً أن الريكويست برجع array من الأسماء مباشرة أو كائن داتا
      const fetchedCats = res.data.data || res.data || [];
      setCategories(["الكل", ...fetchedCats]);
    } catch (err) {
      console.error("فشل في تحميل التصنيفات", err);
    }
  };

  // 2. جلب المنتجات من الباك-إند مع تمرير كل الفلاتر كـ Query Params
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: itemsLimit,
        search: searchTerm.trim() || undefined,
        category: filterCategory !== "الكل" ? filterCategory : undefined,
        status: filterStatus !== "الكل" ? filterStatus : undefined
      };

      const res = await api.get("/product/all", { params });
      
      // بناءً على ريسبرنس الـ aggregate facet الجديد عندك
      setProducts(res.data.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalProducts(res.data.total || 0);
    } catch (err) {
      showAlert({ icon: 'error', title:  err.response.data.message  ||'فشل في تحميل المنتجات' });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterCategory, filterStatus, itemsLimit]);

  // تشغيل جلب الداتا عند تغيير الفلاتر أو الصفحات
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // جلب التصنيفات مرة واحدة عند فتح الصفحة
  useEffect(() => {
    fetchCategories();
  }, []);

  // إعادة الصفحة لـ 1 عند تغيير أي فلتر بحث أو تصنيف
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    const result = await showAlertConfirm({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف هذا المنتج نهائياً من قاعدة البيانات!",
      icon: "warning",
      confirmButtonColor: "#ef4444",
      confirmButtonText: "نعم، احذف"
    });

    if (result.isConfirmed) {
      try {
        setActionLoading(id);
        await api.delete(`/product/${id}`);
        showAlert({ icon: 'success', title: 'تم الحذف بنجاح' });
        fetchProducts(); // إعادة جلب الصفحة الحالية لتحديث أرقام الـ Pagination
      } catch (err) {
        showAlert({ icon: 'error', title: 'فشل الحذف' });
      } finally {
        setActionLoading(null);
      }
    }
  };

  const openEditModal = (product) => {
    setEditingProduct({ ...product });
    setPreviewImage(product.image?.url || null);
    setNewImageFile(null);
    setImageDeleted(false);
    setEditModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setImageDeleted(false);
    }
  };

  const handleRemoveImage = () => {
    setNewImageFile(null);
    setPreviewImage(null);
    setImageDeleted(true);
  };

  const handleUpdate = async () => {
    try {
      setActionLoading("updating");
      const productId = editingProduct._id;

      const purchasePrice = Number(editingProduct.purchasePrice);
      const piecePrice = Number(editingProduct.pieceSellingPrice);
      const packagePrice = Number(editingProduct.packageSellingPrice);
      const availableQty = Number(editingProduct.availableQuantity);
      const unitsPerPackage = Number(editingProduct.unitsPerPackage);

      if (
        !editingProduct.productName?.trim() ||
        !editingProduct.category?.trim() ||
        !editingProduct.unit_type?.trim() ||
        !editingProduct.description?.trim() ||
        purchasePrice <= 0 ||
        piecePrice <= 0 ||
        availableQty <= 0 ||
        isNaN(purchasePrice) ||
        isNaN(piecePrice) ||
        isNaN(availableQty)
      ) {
        showAlert({ icon: "error", title: "يجب ملء جميع الحقول بشكل صحيح" });
        return;
      }

      if (purchasePrice < 0 || piecePrice < 0 || packagePrice < 0 || availableQty < 0 || unitsPerPackage < 0) {
        showAlert({ icon: "error", title: "لا يمكن إدخال أرقام سالبة" });
        return;
      }

      if (editingProduct.unit_type === "كرتونة") {
        if (!unitsPerPackage || unitsPerPackage <= 0) {
          showAlert({ icon: "error", title: "عدد القطع داخل الكرتونة غير صحيح" });
          return;
        }
        const expectedPiecePrice = packagePrice / unitsPerPackage;
        if (piecePrice < expectedPiecePrice) {
          showAlert({ icon: "error", title: `سعر القطعة أقل من السعر الحقيقي (${expectedPiecePrice.toFixed(2)})` });
          return;
        }
        if (packagePrice < purchasePrice) {
          showAlert({ icon: "error", title: "سعر بيع الكرتونة أقل من سعر الشراء" });
          return;
        }
      }

      if (editingProduct.unit_type === "قطعة" && piecePrice < purchasePrice) {
        showAlert({ icon: "error", title: "سعر بيع القطعة أقل من سعر الشراء" });
        return;
      }

      const textData = {
        productName: editingProduct.productName,
        purchasePrice,
        pieceSellingPrice: piecePrice,
        packageSellingPrice: packagePrice,
        availableQuantity: availableQty,
        unitsPerPackage,
        category: editingProduct.category,
        unit_type: editingProduct.unit_type,
        description: editingProduct.description,
        image: { url: editingProduct.image?.url || "" },
      };

      await api.put(`/product/${productId}`, textData);

      if (newImageFile) {
        const imgFormData = new FormData();
        imgFormData.append("image", newImageFile);
        await api.post(`/product/${productId}/upload-image`, imgFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else if (imageDeleted) {
        await api.delete(`/product/${productId}/delete-image`);
      }

      showAlert({ icon: "success", title: "تم تحديث البيانات بنجاح" });
      setEditModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      showAlert({ icon: "error", title: err.response?.data?.message || "حدث خطأ أثناء التحديث" });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAllProducts = async () => {
    const confirm = await showAlertConfirm({
      title: "هل أنت متأكد؟",
      text: "سيتم حذف جميع المنتجات والصور نهائيًا",
      confirmButtonText: "نعم، احذف الكل",
      cancelButtonText: "إلغاء",
      icon: "warning"
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      const res = await api.delete("/product/");
      showAlert({ title: "تم الحذف", text: res.data.message || "تم حذف جميع المنتجات بنجاح", icon: 'success' });
      setProducts([]);
      setCurrentPage(1);
    } catch (err) {
      showAlert({ title: "خطأ", text: err.response?.data?.message || "فشل حذف المنتجات", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

const exportToExcelArabic = async () => {
  try {
    const res = await api.get("/product/data/export", {
      params: {
        page: 1,
        limit: 100000,
      },
    });

    const allProducts = res.data.data || [];

    if (allProducts.length === 0) {
      showAlert({
        icon: "info",
        title: "لا توجد بيانات لتصديرها",
      });
      return;
    }

    const excelData = allProducts.map((p, index) => ({
      "م": index + 1,
      "كود المنتج": p.code || "N/A",
      "اسم المنتج": p.productName,
      "التصنيف": p.category,
      "الوصف": p.description || "",
      "نوع الوحدة": p.unit_type,
      "القطع داخل العبوة":
        p.unit_type === "كرتونة"
          ? p.unitsPerPackage
          : 1,
      "الكمية المتاحة": p.availableQuantity,
      "إجمالي المخزون (قطع)":
        p.totalUnits || p.availableQuantity,
      "سعر الشراء": p.purchasePrice,
      "سعر بيع القطعة": p.pieceSellingPrice,
      "سعر بيع الكرتونة":
        p.unit_type === "كرتونة"
          ? p.packageSellingPrice
          : "-",
      "إجمالي قيمة المخزون": (
        p.availableQuantity * p.purchasePrice
      ).toFixed(2),
      "الحالة":
        p.availableQuantity <= 0
          ? "نافذ"
          : "متوفر",
      "التقييم":
        p.averageRating?.toFixed(1) || "0.0",
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    worksheet["!dir"] = "rtl";

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "المنتجات"
    );

    const dateStr =
      new Date().toISOString().split("T")[0];

    XLSX.writeFile(
      workbook,
      `تقرير_جميع_المنتجات_${dateStr}.xlsx`
    );

    showAlert({
      icon: "success",
      title: `تم تصدير ${allProducts.length} منتج بنجاح`,
    });
  } catch (err) {
    console.error(err);

    showAlert({
      icon: "error",
      title: "فشل تصدير البيانات",
    });
  }
};
const exportToExcelEnglish = async () => {
  try {
    const res = await api.get("/product/data/export"
    );

    const allProducts = res.data.data || [];

    if (allProducts.length === 0) {
      showAlert({
        icon: "info",
        title: "No data available to export",
      });
      return;
    }

    const excelData = allProducts.map((p, index) => ({
      "No.": index + 1,
      code: p.code || "N/A",
      productName: p.productName,
      category: p.category,
      description: p.description || "",
      unit_type: p.unit_type,
      unitsPerPackage:
        p.unit_type === "كرتونة"
          ? p.unitsPerPackage
          : 1,
      availableQuantity: p.availableQuantity,
      totalUnits:
        p.totalUnits || p.availableQuantity,
      purchasePrice: p.purchasePrice,
      pieceSellingPrice:
        p.pieceSellingPrice,
      packageSellingPrice:
        p.unit_type === "كرتونة"
          ? p.packageSellingPrice
          : 0,
      totalStockValue: (
        p.availableQuantity * p.purchasePrice
      ).toFixed(2),
      status:
        p.availableQuantity <= 0
          ? "Out of Stock"
          : "In Stock",
      averageRating: p.averageRating || 0,
      imageUrl: p.image?.url || "",
    }));

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    worksheet["!dir"] = "ltr";

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Products"
    );

    const dateStr =
      new Date().toISOString().split("T")[0];

    XLSX.writeFile(
      workbook,
      `All_Products_Report_${dateStr}.xlsx`
    );

    showAlert({
      icon: "success",
      title: `Successfully exported ${allProducts.length} products`,
    });
  } catch (err) {
    console.error(err);

    showAlert({
      icon: "error",
      title: "Export failed",
    });
  }
};

  return (
    <div className="bg-[#F1F5F9] min-h-screen w-full" dir="rtl">
      <div className="w-full px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
          <div>
            <h1 className="text-xl font-black text-slate-800 flex items-center gap-4">
              <span className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 text-white"><FaBoxOpen /></span>
              مخزون المنتجات
            </h1>
            <p className="text-slate-500 mt-2 font-bold text-md">عرض وإدارة تفاصيل المنتجات والأسعار (إجمالي المتاح بالمخزن: {totalProducts} منتج)</p>
          </div>
          
          <div className="flex gap-6">
             <div className="bg-blue-50 px-6 py-4 rounded-2xl border border-blue-100 text-center">
                <p className="text-xs text-blue-400 font-black uppercase mb-1">إجمالي الأصناف</p>
                <p className="text-xl font-black text-blue-700">{totalProducts}</p>
             </div>
             <div className="bg-red-50 px-6 py-4 rounded-2xl border border-red-100 text-center">
                <p className="text-xs text-red-400 font-black uppercase mb-1">نواقص (صفحة حالية)</p>
                <p className="text-xl font-black text-red-700">{products.filter(p => p.availableQuantity <= 0).length}</p>
             </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={exportToExcelArabic} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-bold transition flex items-center gap-2 shadow-sm">
              <FaFileExcel size={18} /> تصدير Excel 
            </button>
            <button onClick={exportToExcelEnglish} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2.5 rounded-lg font-bold transition flex items-center gap-2 shadow-sm">
              <FaFileExcel size={18} /> Export Excel 
            </button>
            <button onClick={handleDeleteAllProducts} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-bold transition shadow-sm">
              حذف  المنتجات
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white text-[12px] p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative">
              <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="بحث بالاسم أو كود المنتج (مثلاً: P1001)..." 
                className="w-full pr-14 pl-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-blue-500 focus:bg-white transition-all font-black text-md shadow-inner"
                value={searchTerm} 
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex items-center gap-3">
               <span className="text-md font-black text-slate-500 whitespace-nowrap"><FaFilter/> التصنيف:</span>
               <select 
                 className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-black text-slate-700 outline-none focus:border-blue-500"
                 value={filterCategory} 
                 onChange={handleCategoryChange}
               >
                 {categories.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
            </div>

            <div className="flex items-center gap-3">
               <span className="text-md font-black text-slate-500 whitespace-nowrap">الحالة:</span>
               <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full border border-slate-200">
                 {["الكل", "متوفر", "نافذ"].map(s => (
                   <button 
                     key={s} 
                     onClick={() => handleStatusChange(s)}
                     className={`flex-1 py-3 rounded-lg text-md font-black transition-all ${filterStatus === s ? "bg-white shadow-md text-blue-600" : "text-slate-500 hover:bg-white/50"}`}
                   >
                     {s}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="p-6 bg-white rounded-lg border border-gray-100 shadow-sm mb-8">
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-500 rounded-full"></span> الإجراءات الإدارية
          </h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => navigate("/admin_dashboard/MaybeSellProducts")} className="flex items-center gap-2 px-5 py-2.5 bg-[#f8fafc] text-slate-600 border border-slate-200 rounded-md hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200 shadow-sm font-medium text-md">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div> المنتجات المحتمل بيعها
            </button>
            <button onClick={() => navigate("/admin_dashboard/BestSellerAdmin")} className="flex items-center gap-2 px-5 py-2.5 bg-[#f8fafc] text-slate-600 border border-slate-200 rounded-md hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all duration-200 shadow-sm font-medium text-md">
              <div className="w-2 h-2 rounded-full bg-green-400"></div> المنتجات الأكثر مبيعاً
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg border border-slate-200 mx-auto shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 font-bold text-md text-slate-600 w-1/3">المنتج</th>
                  <th className="p-4 font-bold text-md text-slate-600 text-center">الأسعار</th>
                  <th className="p-4 font-bold text-md text-slate-600 text-center">المخزون</th>
                  <th className="p-4 font-bold text-md text-slate-600 text-center">إجمالي الوحدات</th>
                  <th className="p-4 font-bold text-md text-slate-600 text-center">التقييم</th>
                  <th className="p-4 font-bold text-md text-slate-600 text-center">الحالة</th>
                  <th className="p-4 font-bold text-md text-slate-600 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-20 text-center">
                      <FaSpinner className="animate-spin text-4xl mx-auto text-blue-500" />
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                           <img loading="lazy" src={p.image?.url || "https://placehold.co/100"} className="w-14 h-14 rounded-lg object-cover border border-slate-200" alt={p.productName} />
                          <div>
                            <p className="text-xs font-medium text-blue-500 mb-0.5">{p.code}</p>
                            <p className="text-slate-700 font-bold text-base">{p.productName}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{p.description}</p>
                            <p className="text-slate-400 text-xs truncate max-w-[200px] mt-0.5">{p.category}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="p-4 text-center">
                        <div className="flex flex-col text-[9px]">
                          <span className="text-slate-500">بيع قطعة: {p.pieceSellingPrice}</span>
                          {p.unit_type === "كرتونة" && <span className="text-slate-500">بيع كرتونة: {p.packageSellingPrice}</span>}
                          <span className="text-slate-400">شراء: {p.purchasePrice}</span>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <div className="text-md">
                          <span className={`font-bold ${p.availableQuantity <= 5 ? 'text-red-500' : 'text-slate-700'}`}>
                            {p.unit_type === "كرتونة" ? `${p.unitsPerPackage}/${p.availableQuantity}` : p.availableQuantity}
                          </span>
                          <span className="text-slate-400 text-xs mr-1">{p.unit_type === "كرتونة" ? ` كرتونة / قطعة ` : " قطعة "}</span>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <div className="text-md font-bold text-slate-700">{p.totalUnits || p.availableQuantity}</div>
                      </td>

                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-amber-500">
                          <FaStar size={12} />
                          <span className="text-md font-semibold">{p.averageRating?.toFixed(1) || "0.0"}</span>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[9px] font-bold ${p.availableQuantity <= 0 ? "bg-red-50 text-red-600 border border-red-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}>
                          {p.availableQuantity <= 0 ? 'نافذ' : 'متوفر'}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => openEditModal(p)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="تعديل"><FaEdit size={16} /></button>
                          <button onClick={() => handleDelete(p._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="حذف">
                            {actionLoading === p._id ? <FaSpinner className="animate-spin" /> : <FaTrash size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-slate-400 font-medium">لا توجد منتجات تطابق البحث أو الفلترة الحالية</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination UI Control */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm overflow-x-auto  mx-auto">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronRight size={14} />
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${currentPage === pageNum ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-all text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <FaChevronLeft size={14} />
            </button>
          </div>
        )}

        {/* Edit Modal */}
        {editModal && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden border border-slate-200">
              <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
                <div>
                  <h3 className="text-md font-bold text-slate-800 flex items-center gap-2"><FaEdit className="text-blue-500"/> تعديل بيانات المنتج</h3>
                  <p className="text-slate-400 text-xs mt-0.5">كود المنتج: {editingProduct.code}</p>
                </div>
                <button onClick={() => setEditModal(false)} className="text-slate-400 hover:text-red-500 transition-colors"><FaTimes size={20}/></button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8 max-h-[75vh] overflow-y-auto">
                <div className="md:col-span-4 flex flex-col items-center border-l border-slate-100 pl-4">
                   <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-3 w-full text-center">صورة المنتج</label>
                   <div className="relative group w-40 h-40 bg-slate-50 rounded-lg overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
                      {previewImage ? (
                        <>
                          <img loading="lazy" src={previewImage} className="w-full h-full object-cover" alt="preview" />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                             <button onClick={() => fileInputRef.current.click()} className="p-2 bg-white text-blue-600 rounded-lg shadow-md hover:scale-110 transition-transform"><FaCamera size={16}/></button>
                             <button onClick={handleRemoveImage} className="p-2 bg-white text-red-600 rounded-lg shadow-md hover:scale-110 transition-transform"><FaTrashAlt size={16}/></button>
                          </div>
                        </>
                      ) : (
                        <button onClick={() => fileInputRef.current.click()} className="flex flex-col items-center text-slate-300 hover:text-blue-500 transition-colors gap-2">
                           <FaImage size={40} /> <span className="text-[10px] font-bold">اختر صورة</span>
                        </button>
                      )}
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                   </div>
                   {imageDeleted && <span className="mt-2 text-[10px] text-red-500 font-bold">سيتم حذف الصورة عند الحفظ</span>}
                </div>

                <div className="md:col-span-8 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[9px] font-bold text-slate-500 mb-1.5 block mr-1">اسم المنتج</label>
                    <input value={editingProduct.productName} onChange={(e) => setEditingProduct({...editingProduct, productName: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 text-md font-semibold transition-all"/>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-bold text-slate-500 mb-1.5 block mr-1">اسم الصنف</label>
                    <input value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 text-md font-semibold transition-all"/>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 mb-1.5 block mr-1">سعر الشراء</label>
                    <input type="number" min={0} value={editingProduct.purchasePrice} onChange={(e) => setEditingProduct({...editingProduct, purchasePrice: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-orange-400 outline-none text-orange-600 font-bold text-md"/>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 mb-1.5 block mr-1">سعر بيع القطعة</label>
                    <input type="number" min={0} value={editingProduct.pieceSellingPrice} onChange={(e) => setEditingProduct({...editingProduct, pieceSellingPrice: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-emerald-400 outline-none text-emerald-600 font-bold text-md"/>
                  </div>
                  {editingProduct.unit_type === 'كرتونة' && (
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 mb-1.5 block mr-1">سعر بيع الكرتونة</label>
                      <input type="number" min={0} value={editingProduct.packageSellingPrice} onChange={(e) => setEditingProduct({...editingProduct, packageSellingPrice: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-emerald-400 outline-none text-emerald-600 font-bold text-md"/>
                    </div>
                  )}
                  {editingProduct.unit_type === 'كرتونة' && (
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 mb-1.5 block mr-1">عدد القطع في الكرتونة</label>
                      <input type="number" min={1} value={editingProduct.unitsPerPackage} onChange={(e) => setEditingProduct({...editingProduct, unitsPerPackage: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 font-bold text-md"/>
                    </div>
                  )}
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 mb-1.5 block mr-1">الكمية المتاحة</label>
                    <input type="number" min={0} value={editingProduct.availableQuantity} onChange={(e) => setEditingProduct({...editingProduct, availableQuantity: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 font-bold text-md"/>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-500 mb-1.5 block mr-1">الوحدة</label>  
                    <input disabled={true} value={editingProduct.unit_type} className="w-full px-4 py-2.5 bg-slate-200 border border-slate-300 rounded-lg outline-none text-slate-500 text-md cursor-not-allowed"/>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-bold text-slate-500 mb-1.5 block mr-1">وصف المنتج</label>  
                    <textarea value={editingProduct.description} onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 text-md"/>
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-bold text-slate-500 mb-1.5 block mr-1">لينك الصوره</label>  
                    <textarea value={editingProduct.image?.url || ""} onChange={(e) => { const newUrl = e.target.value; setEditingProduct({ ...editingProduct, image: { ...editingProduct.image, url: newUrl } }); setPreviewImage(newUrl); }} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none text-slate-700 text-md"/>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button onClick={handleUpdate} disabled={actionLoading === 'updating'} className="bg-slate-800 text-white px-8 py-2.5 rounded-lg font-bold text-md hover:bg-blue-600 transition-all flex items-center gap-2 disabled:opacity-50">
                  {actionLoading === 'updating' ? <FaSpinner className="animate-spin" /> : <><FaSave /> حفظ التغييرات</>}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}