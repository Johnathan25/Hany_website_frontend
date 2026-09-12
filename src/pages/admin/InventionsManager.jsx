import React, { useEffect, useState, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import {
  Lightbulb,
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronRight,
  ChevronLeft,
  Coins,
} from "lucide-react";

const PRICING_TYPE_OPTIONS = [
  { value: "license", labelAr: "ترخيص عادي (License)", labelEn: "License" },
  {
    value: "exclusive_license",
    labelAr: "ترخيص حصري (Exclusive License)",
    labelEn: "Exclusive License",
  },
  {
    value: "full_purchase",
    labelAr: "شراء كامل للبراءة (Full Purchase)",
    labelEn: "Full Purchase",
  },
  { value: "custom", labelAr: "مخصص / اتفاق خاص (Custom)", labelEn: "Custom" },
];

const emptyForm = {
  title: "",
  shortDescription: "",
  description: "",
  details: "",
  pricingOptions: [], // [{ name: "", type: "license", price: "", depositAmount: 0 }]
  isActive: true,
};

export default function AdminInventionsManager() {
  const { isAr } = useLanguage();

  const [inventions, setInventions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [selectedForDelete, setSelectedForDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchInventions = useCallback(
    async (page = 1, searchQuery = search) => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page: Number(page) || 1,
          limit: Number(pagination.limit) || 10,
        };

        const trimmed = (searchQuery || "").trim();
        if (trimmed) params.search = trimmed;

        if (isActiveFilter === "true" || isActiveFilter === "false") {
          params.isActive = isActiveFilter;
        }

        const res = await api.get("/invention", { params });

        setInventions(res.data?.data || []);
        if (res.data?.pagination) {
          setPagination(res.data.pagination);
        }
      } catch (err) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          (isAr
            ? "فشل تحميل بيانات براءات الاختراع"
            : "Failed to load inventions catalog")
        );
      } finally {
        setLoading(false);
      }
    },
    [isActiveFilter, pagination.limit, isAr, search]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventions(1, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, isActiveFilter, fetchInventions]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(item._id);
    setForm({
      title: item.title || "",
      shortDescription: item.shortDescription || "",
      description: item.description || "",
      details: item.details || "",
      pricingOptions: Array.isArray(item.pricingOptions)
        ? item.pricingOptions.map((opt) => ({
          durationYears:opt.durationYears|| 0,
          type: opt.type || "license",
          price: opt.price !== undefined ? opt.price : "",
          depositAmount:
            opt.depositAmount !== undefined ? opt.depositAmount : 0,
          isActive: opt.isActive !== false,
        }))
        : [],
      isActive: item.isActive !== false,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Add new tier with depositAmount initialized
const addPricingOption = () => {
  setForm((prev) => ({
    ...prev,
    pricingOptions: [
      ...prev.pricingOptions,
      {
        type: "license",        // or your default enum value
        durationYears: 1,        // default to 1 or null
        price: "",
        depositAmount: "",
        isActive: true,
      },
    ],
  }));
};

 const updatePricingOption = (index, field, value) => {
  setForm((prev) => {
    const updated = [...prev.pricingOptions];
    
    if (field === "type") {
      updated[index] = {
        ...updated[index],
        type: value,
        // Reset duration to null automatically when selecting full_purchase
        durationYears: value === "full_purchase" ? null : updated[index].durationYears || 1,
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }

    return { ...prev, pricingOptions: updated };
  });
};

  const removePricingOption = (index) => {
    setForm((prev) => ({
      ...prev,
      pricingOptions: prev.pricingOptions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError(
        isAr ? "عنوان براءة الاختراع مطلوب" : "Invention title is required"
      );
      return;
    }

    setSaving(true);
    setError("");

    // Ensure depositAmount is strictly present and converted to a number
    const payload = {
      ...form,
      title: form.title.trim(),
      shortDescription: form.shortDescription.trim(),
      description: form.description.trim(),
      details: form.details.trim(),
      pricingOptions: form.pricingOptions.map((opt) => ({
       
        type: opt.type,
        price: opt.price !== "" ? Number(opt.price) : 0,
        depositAmount:
          opt.depositAmount !== "" && opt.depositAmount !== undefined
            ? Number(opt.depositAmount)
            : 0,
        durationYears:opt.durationYears,
        isActive: opt.isActive !== false,
      })),
    };

    try {
      if (editingId) {
        await api.put(`/invention/${editingId}`, payload);
        setFeedback(
          isAr
            ? "تم تحديث براءة الاختراع والأسعار بنجاح"
            : "Invention and rates updated successfully"
        );
      } else {
        await api.post("/invention", payload);
        setFeedback(
          isAr
            ? "تم إضافة براءة الاختراع بنجاح"
            : "Invention registered successfully"
        );
      }

      closeForm();
      await fetchInventions(pagination.currentPage, search);
      setTimeout(() => setFeedback(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        (isAr
          ? "حدث خطأ أثناء حفظ التعديلات"
          : "Error saving invention changes")
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedForDelete?._id) return;

    setDeleting(true);
    setError("");
    try {
      await api.delete(`/invention/${selectedForDelete._id}`);
      setFeedback(
        isAr ? "تم حذف السجل بنجاح" : "Invention deleted successfully"
      );
      setSelectedForDelete(null);
      await fetchInventions(pagination.currentPage, search);
      setTimeout(() => setFeedback(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        (isAr ? "فشل حذف براءة الاختراع" : "Failed to delete invention")
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            {isAr ? "براءات الاختراع والتراخيص" : "Inventions & Licensing"}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAr
              ? "إدارة بنود الحلول المسجلة، خيارات التراخيص، ونماذج الشراء"
              : "Manage patent items, licensing configurations, and purchase models"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fetchInventions(pagination.currentPage, search)}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg shadow-xs cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin text-slate-500" : ""}`}
            />
            <span>{isAr ? "تحديث" : "Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? "إضافة براءة اختراع" : "New Invention"}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              isAr
                ? "ابحث بالعنوان أو الوصف أو المواصفات..."
                : "Search by title, description, or specs..."
            }
            className="w-full pl-8 pr-9 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:border-slate-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute top-1/2 -translate-y-1/2 left-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={isActiveFilter}
          onChange={(e) => setIsActiveFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 font-medium outline-none cursor-pointer"
        >
          <option value="">{isAr ? "كافة الحالات" : "All Statuses"}</option>
          <option value="true">{isAr ? "مفعّل" : "Active"}</option>
          <option value="false">{isAr ? "غير مفعّل" : "Inactive"}</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            <span>{isAr ? "جاري التحميل..." : "Loading..."}</span>
          </div>
        ) : inventions.length === 0 ? (
          <div className="py-14 text-center text-slate-400 text-xs">
            {isAr ? "لا توجد براءات اختراع مسجلة" : "No invention records found"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="py-3 px-4 text-start">{isAr ? "العنوان" : "Title"}</th>
                  <th className="py-3 px-4 text-start">{isAr ? "الوصف" : "Summary"}</th>
                  <th className="py-3 px-4 text-start">{isAr ? "الأسعار والعربون" : "Pricing & Deposit"}</th>
                  <th className="py-3 px-4 text-start">{isAr ? "الحالة" : "Status"}</th>
                  <th className="py-3 px-4 text-center w-20">{isAr ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventions.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/75 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
                          <Lightbulb className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{item.title}</div>
                          <span className="font-mono text-[11px] text-slate-400">
                            #{item._id?.slice(-6)?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-slate-500 line-clamp-1">
                        {item.shortDescription || item.description || "—"}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      {item.pricingOptions?.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {item.pricingOptions.map((opt, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-slate-50 border border-slate-200 text-slate-700"
                            >
                             
                              <span className="font-mono font-semibold text-slate-900">
                                {opt.price} EGP
                              </span>
                              <span className="text-[10px] text-amber-600 font-medium">
                                ({isAr ? "عربون:" : "Dep:"} {opt.depositAmount || 0})
                              </span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${item.isActive !== false
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                      >
                        {item.isActive !== false
                          ? isAr
                            ? "مفعّل"
                            : "Active"
                          : isAr
                            ? "معطّل"
                            : "Inactive"}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 rounded-md cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedForDelete(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="py-2.5 px-4 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>
              {isAr
                ? `صفحة ${pagination.currentPage} من ${pagination.totalPages}`
                : `Page ${pagination.currentPage} of ${pagination.totalPages}`}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={!pagination.hasPreviousPage}
                onClick={() => fetchInventions(pagination.currentPage - 1)}
                className="p-1 border border-slate-200 rounded disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => fetchInventions(pagination.currentPage + 1)}
                className="p-1 border border-slate-200 rounded disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-lg max-w-2xl w-full p-5 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                {editingId
                  ? isAr
                    ? "تعديل بيانات براءة الاختراع"
                    : "Edit Invention"
                  : isAr
                    ? "إضافة براءة اختراع جديدة"
                    : "Add New Invention"}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isAr ? "عنوان براءة الاختراع" : "Invention Title"} *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isAr ? "الوصف المختصر" : "Short Description"}
                </label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={(e) => updateField("shortDescription", e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isAr ? "الوصف التفصيلي" : "Full Description"}
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs outline-none focus:border-slate-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {isAr ? "المواصفات الفنية وشروط التنفيذ" : "Technical Specs"}
                </label>
                <textarea
                  rows={2}
                  value={form.details}
                  onChange={(e) => updateField("details", e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-xs outline-none focus:border-slate-500 resize-none"
                />
              </div>

              {/* Dynamic Pricing with required depositAmount */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-slate-900 font-medium text-xs">
                    <Coins className="w-3.5 h-3.5 text-slate-600" />
                    <span>{isAr ? "خطط الأسعار والعربون المطلوب" : "Pricing & Required Deposit"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={addPricingOption}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{isAr ? "إضافة خطة تسعير" : "Add Rate Tier"}</span>
                  </button>
                </div>

                {form.pricingOptions.length === 0 ? (
                  <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-md text-center text-slate-400 text-xs">
                    {isAr
                      ? "لا توجد أسعار محددة. اضغط على \"إضافة خطة تسعير\"."
                      : "No price tiers added. Click \"Add Rate Tier\"."}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {/* Column Headers */}
                    {form.pricingOptions.length > 0 && (
                      <div className="hidden sm:grid sm:grid-cols-12 gap-2 bg-sla px-2.5 text-[11px] font-semibold text-slate-500">
                        <div className="col-span-3">
                          {isAr ? "نوع الترخيص" : "Pricing Type"}
                        </div>
                        <div className="col-span-2">
                          {isAr ? "المدة (بالسنوات)" : "Duration (Years)"}
                        </div>
                        <div className="col-span-3">
                          {isAr ? "السعر الكلي" : "Full Price"}
                        </div>
                        <div className="col-span-3">
                          {isAr ? "العربون" : "Deposit"}
                        </div>
                        <div className="col-span-1 text-center">
                          {isAr ? "إجراء" : "Action"}
                        </div>
                      </div>
                    )}

                    {/* Pricing Options Rows */}
                    {form.pricingOptions.map((opt, idx) => {
                      const isFullPurchase = opt.type === "full_purchase";

                      return (
                        <div
                          key={idx}
                          className="grid grid-cols-1 sm:grid-cols-12 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-md items-center"
                        >
                          {/* Enum Select */}
                          <div className="sm:col-span-3">
                            <label className="block sm:hidden text-[11px] font-medium text-slate-500 mb-1">
                              {isAr ? "نوع التسعير" : "Pricing Type"}
                            </label>
                            <select
                              value={opt.type}
                              onChange={(e) => {
                                const newType = e.target.value;
                                updatePricingOption(idx, "type", newType);
                                if (newType === "full_purchase") {
                                  updatePricingOption(idx, "durationYears", null);
                                }
                              }}
                              className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs outline-none cursor-pointer focus:border-slate-400"
                            >
                              {PRICING_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {isAr ? option.labelAr : option.labelEn}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Duration (Years) */}
                          <div className="sm:col-span-2">
                            <label className="block sm:hidden text-[11px] font-medium text-slate-500 mb-1">
                              {isAr ? "المدة (بالسنوات)" : "Duration (Years)"}
                            </label>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              disabled={isFullPurchase}
                              placeholder={
                                isFullPurchase
                                  ? (isAr ? "دائم" : "Perpetual")
                                  : (isAr ? "المدة" : "Years")
                              }
                              value={isFullPurchase ? "" : (opt.durationYears ?? "")}
                              onChange={(e) =>
                                updatePricingOption(
                                  idx,
                                  "durationYears",
                                  e.target.value === "" ? null : Number(e.target.value)
                                )
                              }
                              className={`w-full px-2 py-1.5 bg-white border border-slate-300 disabled:bg-white disabled:border-slate-300 rounded text-xs font-mono outline-none focus:border-slate-400 ${isFullPurchase ? "text-slate-400 cursor-not-allowed" : "text-slate-800"
                                }`}
                            />
                          </div>

                          {/* Full Price */}
                          <div className="sm:col-span-3">
                            <label className="block sm:hidden text-[11px] font-medium text-slate-500 mb-1">
                              {isAr ? "السعر الكلي" : "Full Price"}
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                step="any"
                                required
                                placeholder={isAr ? "السعر الكلي" : "Full Price"}
                                value={opt.price ?? ""}
                                onChange={(e) =>
                                  updatePricingOption(
                                    idx,
                                    "price",
                                    e.target.value === "" ? "" : Number(e.target.value)
                                  )
                                }
                                className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono outline-none focus:border-slate-400"
                              />
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none font-medium">
                                EGP
                              </span>
                            </div>
                          </div>

                          {/* Deposit */}
                          <div className="sm:col-span-3">
                            <label className="block sm:hidden text-[11px] font-medium text-slate-500 mb-1">
                              {isAr ? "العربون" : "Deposit"}
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="0"
                                step="any"
                                required
                                placeholder={isAr ? "العربون" : "Deposit"}
                                value={opt.depositAmount ?? ""}
                                onChange={(e) =>
                                  updatePricingOption(
                                    idx,
                                    "depositAmount",
                                    e.target.value === "" ? "" : Number(e.target.value)
                                  )
                                }
                                className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded text-xs font-mono outline-none focus:border-slate-400"
                              />
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 pointer-events-none font-medium">
                                EGP
                              </span>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <div className="sm:col-span-1 flex justify-center items-center">
                            <button
                              type="button"
                              onClick={() => removePricingOption(idx)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                              title={isAr ? "حذف" : "Remove"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 cursor-pointer"
                />
                <label
                  htmlFor="isActive"
                  className="text-xs font-medium text-slate-700 cursor-pointer select-none"
                >
                  {isAr ? "تفعيل ونشر براءة الاختراع للجمهور" : "Active"}
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isAr ? "حفظ التغييرات" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      {selectedForDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-lg max-w-sm w-full p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              {isAr ? "تأكيد الحذف" : "Confirm Delete"}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isAr
                ? `هل تريد بالتأكيد حذف "${selectedForDelete.title}"؟`
                : `Are you sure you want to delete "${selectedForDelete.title}"?`}
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setSelectedForDelete(null)}
                className="px-3 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isAr ? "حذف" : "Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}