import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import api from "../../services/api";
import {
  Lightbulb,
  Search,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Coins,
  ShieldCheck,
  FileText,
  X,
  ArrowLeft,
  Building2,
} from "lucide-react";

// قائمة صور لمبانٍ معمارية فائقة الفخامة والحداثة (عالية الجودة وبأبعاد موحدة)
const LUXURY_BUILDING_IMAGES = [

  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80", // عمارة سكنية فاخرة ومودرن
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", // فيلا وفيو معماري فخم
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", // مجمع إداري فخم
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", // تصميم معماري مستقبلي مع إضاءة

];

// دالة لربط كل براءة بصورة ثابتة ومميزة بناءً على الـ _id
const getBuildingImageForId = (id) => {
  if (!id) return LUXURY_BUILDING_IMAGES[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % LUXURY_BUILDING_IMAGES.length;
  return LUXURY_BUILDING_IMAGES[index];
};

export default function Inventions() {
  const { isAr } = useLanguage();

  const [inventions, setInventions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 9,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
   const navigate= useNavigate()

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvention, setSelectedInvention] = useState(null);

  // جلب البيانات من مسار /invention/client (بصيغة المفرد كما تم تثبيتها في الباك إند)
  const fetchClientInventions = useCallback(
    async (page = 1, searchQuery = search) => {
      setLoading(true);
      setError("");
      try {
        const params = {
          page,
          limit: pagination.limit,
          search: searchQuery.trim(),
          isActive: true,
        };

        let responseData = null;
        let paginationData = null;

        try {
          const res = await api.get("/invention/client", { params });
          responseData = res.data?.data;
          paginationData = res.data?.pagination;
        } catch (clientErr) {
          // في حال عدم توفر /client، الانتقال التلقائي للراوتر الرئيسي
          if (
            clientErr.response?.status === 404 ||
            clientErr.response?.status === 401
          ) {
            const fallbackRes = await api.get("/invention", { params });
            responseData = fallbackRes.data?.data;
            paginationData = fallbackRes.data?.pagination;
          } else {
            throw clientErr;
          }
        }

        const activeItems = (responseData || [])
          .filter((item) => item.isActive !== false)
          .map((item) => ({
            ...item,
            pricingOptions: (item.pricingOptions || []).filter(
              (opt) => opt.isActive !== false
            ),
          }));

        setInventions(activeItems);
        if (paginationData) {
          setPagination(paginationData);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          (isAr
            ? "تعذر تحميل براءات الاختراع والحلول المسجلة حالياً"
            : "Failed to load registered innovations")
        );
      } finally {
        setLoading(false);
      }
    },
    [pagination.limit, isAr, search]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClientInventions(1, search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, fetchClientInventions]);

  const formatPricingType = (type) => {
    const types = {
      license: isAr ? "ترخيص عادي" : "License",
      exclusive_license: isAr ? "ترخيص حصري" : "Exclusive License",
      full_purchase: isAr ? "شراء كامل للبراءة" : "Full Purchase",
      custom: isAr ? "مخصص / اتفاق خاص" : "Custom",
    };
    return types[type] || type;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* رأس الصفحة */}
        <div className="text-center max-w-3xl mx-auto space-y-3">

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {isAr ? "براءات الاختراع والحلول الهندسية" : "Patented Innovations & IP"}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isAr
              ? "استكشف أحدث ابتكاراتنا وتقنياتنا المعمارية المسجلة رسمياً لحل أعقد المشكلات الإنشائية وتوفير أقصى درجات الأمان والفخامة."
              : "Explore our patented structural technologies, offering robust field applications and flexible licensing models."}
          </p>
        </div>

        {/* البحث */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isAr
                  ? "ابحث بالعنوان أو الوصف أو المواصفات..."
                  : "Search innovations and structural patents..."
              }
              className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm shadow-xs outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* رسائل الخطأ */}
        {error && (
          <div className="max-w-xl mx-auto p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* شبكة الكروت بصور المباني الفخمة */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs">
              {isAr ? "جاري تحميل الحلول والابتكارات..." : "Loading innovations catalog..."}
            </span>
          </div>
        ) : inventions.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-8 max-w-md mx-auto">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">
              {isAr ? "لا توجد نتائج مطابقة" : "No innovations found"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isAr ? "جرب البحث بكلمات أخرى أو مسح الفلتر." : "Try clearing your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventions.map((item) => {
              const buildingImage = getBuildingImageForId(item._id);

              return (
                <div
                  key={item._id}
                  className="bg-white border border-slate-200 hover:border-blue-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* صورة المبنى الحديث الفخم في قمة الكارت */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={buildingImage}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                      {/* شارة التوثيق فوق الصورة */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-white bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          {isAr ? "براءة موثقة" : "Registered IP"}
                        </span>
                      </div>

                      {/* كود الابتكار فوق الصورة */}
                      <div className="absolute bottom-3 right-3 text-white text-xs font-mono font-medium drop-shadow-md">
                        #{item._id?.slice(-6)?.toUpperCase()}
                      </div>
                    </div>

                    {/* محتوى الكارت */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                          {item.shortDescription || item.description}
                        </p>
                      </div>

                      {/* خطط الأسعار والتراخيص */}
                      {item.pricingOptions?.length > 0 && (
                        <div className="pt-3 border-t border-slate-100 space-y-1.5">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            {isAr ? "خيارات التراخيص:" : "Available Plans:"}
                          </span>
                          <div className="space-y-1">
                            {item.pricingOptions.slice(0, 2).map((opt, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-50 border border-slate-100"
                              >
                                <span className="text-slate-700 font-medium truncate">
                                  {opt.name || formatPricingType(opt.type)}
                                </span>
                                <span className="font-mono font-bold text-blue-600 whitespace-nowrap">
                                  {Number(opt.price || 0).toLocaleString()}{" "}
                                  <span className="text-[10px] text-slate-400 font-normal">
                                    EGP
                                  </span>
                                </span>
                              </div>
                            ))}
                            {item.pricingOptions.length > 2 && (
                              <span className="text-[10px] text-slate-400 block px-1">
                                +{item.pricingOptions.length - 2} {isAr ? "خيارات إضافية" : "more options"}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* زر استعراض التفاصيل */}
                  <div className="p-6 pt-0">
                    <button
                      type="button"
                      onClick={() => setSelectedInvention(item)}
                      className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{isAr ? "عرض التفاصيل والمواصفات" : "View Specifications"}</span>
                      <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ترقيم الصفحات */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              type="button"
              disabled={!pagination.hasPreviousPage}
              onClick={() => fetchClientInventions(pagination.currentPage - 1)}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-600 cursor-pointer shadow-xs"
            >
              <ChevronRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
            <span className="text-xs text-slate-600 px-3 font-medium">
              {isAr
                ? `صفحة ${pagination.currentPage} من ${pagination.totalPages}`
                : `Page ${pagination.currentPage} of ${pagination.totalPages}`}
            </span>
            <button
              type="button"
              disabled={!pagination.hasNextPage}
              onClick={() => fetchClientInventions(pagination.currentPage + 1)}
              className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none text-slate-600 cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </button>
          </div>
        )}
      </div>

      {/* النافذة المنبثقة للتفاصيل الكاملة */}
      {selectedInvention && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col">
            {/* صورة المبنى في أعلى الـ Modal مع زر الإغلاق */}
            <div className="relative h-44 w-full shrink-0 bg-slate-900">
              <img
                src={getBuildingImageForId(selectedInvention._id)}
                alt={selectedInvention.title}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

              <button
                type="button"
                onClick={() => setSelectedInvention(null)}
                className="absolute top-3 left-3 p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-xs cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 right-4 left-4">
                <span className="text-[10px] font-mono text-blue-300 uppercase tracking-widest font-semibold block">
                  #{selectedInvention._id?.slice(-8)?.toUpperCase()}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5 line-clamp-1">
                  {selectedInvention.title}
                </h2>
              </div>
            </div>

            {/* تفاصيل المحتوى القابل للتمرير */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
  <div className="space-y-2">
    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
      {isAr ? "الوصف التفصيلي وآلية العمل" : "Technical Overview"}
    </h4>
    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
      {selectedInvention.description || selectedInvention.shortDescription}
    </p>
  </div>

  {selectedInvention.details && (
    <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
        <FileText className="w-4 h-4 text-blue-600" />
        <span>{isAr ? "المواصفات الفنية وشروط التنفيذ" : "Technical Specifications"}</span>
      </h4>
      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
        {selectedInvention.details}
      </p>
    </div>
  )}

  {selectedInvention.pricingOptions?.length > 0 && (
    <div className="space-y-3">
      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
        <Coins className="w-4 h-4 text-blue-600" />
        <span>{isAr ? "خيارات التراخيص والأسعار" : "Licensing Models"}</span>
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {selectedInvention.pricingOptions.map((opt, idx) => {
          const formatYears = (years) => {
            if (!years) return isAr ? "دائم / غير محدد" : "Perpetual";
            if (!isAr) return `${years} ${years === 1 ? "Year" : "Years"}`;
            if (years === 1) return "سنة واحدة";
            if (years === 2) return "سنتان";
            if (years >= 3 && years <= 10) return `${years} سنوات`;
            return `${years} سنة`;
          };

          const handleSelectPlan = () => {
            const queryParams = new URLSearchParams({
              inventionId: selectedInvention._id,
              pricingOptionId: opt._id || idx,
            }).toString();

            navigate(`/inventions/request?${queryParams}`);
          };

          return (
            <div
              key={opt._id || idx}
              className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 transition-all space-y-3 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Top row: Pricing Model Name & Duration Tag */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {opt.name || formatPricingType(opt.type)}
                  </span>

                  {/* Duration Badge */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-slate-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>
                      {opt.type === "full_purchase"
                        ? isAr
                          ? "شراء كامل (دائم)"
                          : "Perpetual"
                        : formatYears(opt.durationYears)}
                    </span>
                  </span>
                </div>

                {/* Pricing row: Full Price & Deposit */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                  {/* Full Price */}
                  <div>
                    <span className="block text-[10px] font-medium text-slate-400 mb-0.5">
                      {isAr ? "السعر الكلي" : "Total Price"}
                    </span>
                    <div className="text-sm font-black font-mono text-blue-600">
                      {Number(opt.price || 0).toLocaleString()}{" "}
                      <span className="text-[10px] font-normal text-slate-500">EGP</span>
                    </div>
                  </div>

                  {/* Deposit */}
                  <div className="text-end">
                    <span className="block text-[10px] font-medium text-slate-400 mb-0.5">
                      {isAr ? "العربون المطلوب" : "Deposit Required"}
                    </span>
                    <div className="text-sm font-bold font-mono text-emerald-600">
                      {Number(opt.depositAmount || 0).toLocaleString()}{" "}
                      <span className="text-[10px] font-normal text-slate-500">EGP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button: Navigate with Query Params */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSelectPlan}
                  className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{isAr ? "طلب حجز / ترخيص" : "Request License"}</span>
                  <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )}
</div>

            {/* الأزرار السفلية */}
            <div className="p-4 sm:px-8 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setSelectedInvention(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-white cursor-pointer transition-colors"
              >
                {isAr ? "إغلاق" : "Close"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}