import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

import {
  User,
  MapPin,
  Phone,
  Briefcase,
  Search,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Loader2,
  CreditCard,
  X,
  ChevronDown,
  Check,
} from "lucide-react";

import api from "../../services/api";

export default function BookService() {
  const { isAr } = useLanguage();
  const [searchParams] = useSearchParams();

  // جلب الخدمة من الـ URL query e.g. /book?service=inspection
  const queryService = searchParams.get("service");

  const Arrow = isAr ? ArrowLeft : ArrowRight;

  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] = useState({
    userName: "",
    location: "",
    phone: "",
    serviceType: "",
    serviceItem: "",
    description: "",
  });

  // =====================================================
  // SYNC QUERY PARAM WITH FORM STATE & SET INITIAL VALUE
  // =====================================================

  useEffect(() => {
    const validServices = ["inspection", "consultation", "maintenance"];

    if (queryService && validServices.includes(queryService)) {
      setFormData((prev) => ({
        ...prev,
        serviceType: queryService,
      }));
    }
  }, [queryService]);

  // =====================================================
  // SERVICE ITEMS (DROPDOWN & SEARCH)
  // =====================================================

  const [items, setItems] = useState([]);
  const [itemSearch, setItemSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // جلب البنود من الباك إند
  const fetchServiceItems = async (searchQuery = "") => {
    setItemsLoading(true);
    try {
      const params = {
        limit: 50,
        search: searchQuery.trim() || undefined,
      };

      let res;
      try {
        res = await api.get("/serviceMangement/items", { params });
      } catch (err1) {
        if (err1.response?.status === 404) {
          res = await api.get("/serviceItem", { params });
        } else {
          throw err1;
        }
      }

      setItems(res.data?.data || []);
    } catch (err) {
      console.error("Fetch Service Items Error:", err);
    } finally {
      setItemsLoading(false);
    }
  };

  // جلب البنود عند فتح القائمة أو الكتابة في حقل البحث
  useEffect(() => {
    if (isDropdownOpen) {
      const timer = setTimeout(() => {
        fetchServiceItems(itemSearch);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [itemSearch, isDropdownOpen]);

  // إغلاق القائمة عند النقر في أي مكان خارجها
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // اختيار بند
  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setFormData((prev) => ({
      ...prev,
      serviceItem: item._id,
    }));
    setIsDropdownOpen(false);
    setItemSearch("");
    setError("");
  };

  // مسح الاختيار
  const clearSelectedItem = (e) => {
    e.stopPropagation();
    setSelectedItem(null);
    setFormData((prev) => ({
      ...prev,
      serviceItem: "",
    }));
    setItemSearch("");
  };

  // =====================================================
  // PRICE
  // =====================================================

  const [price, setPrice] = useState(null);
  const [currency, setCurrency] = useState("EGP");
  const [priceLoading, setPriceLoading] = useState(false);

  // =====================================================
  // PAYMENT
  // =====================================================

  const [paymentUrl, setPaymentUrl] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  // =====================================================
  // GENERAL
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // SERVICES LIST
  // =====================================================

  const servicesList = [
    {
      id: "consultation",
      titleAr: "جلسة استشارة عقارية وقانونية متخصصة",
      titleEn: "Specialized Real Estate & Legal Consultation",
    },
    {
      id: "inspection",
      titleAr: "معاينة هندسية ميدانية دقيقة",
      titleEn: "Field Engineering & Structural Inspection",
    },
    {
      id: "maintenance",
      titleAr: "صيانة مستعجلة وتدخل فوري",
      titleEn: "Emergency Maintenance & Urgent Repairs",
    },
  ];

  // =====================================================
  // DYNAMIC HEADER HELPER
  // =====================================================

  const getHeaderTitle = () => {
    switch (formData.serviceType) {
      case "inspection":
        return isAr ? "طلب معاينة هندسية" : "Request an Engineering Inspection";
      case "consultation":
        return isAr ? "طلب استشارة عقارية وقانونية" : "Request a Consultation";
      case "maintenance":
        return isAr ? "طلب خدمة صيانة مستعجلة" : "Request Urgent Maintenance";
      default:
        return isAr ? "طلب خدمة أو معاينة هندسية" : "Request a Service / Inspection";
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =====================================================
  // GET PRICE
  // =====================================================

  useEffect(() => {
    if (!formData.serviceType) {
      setPrice(null);
      return;
    }

    let cancelled = false;

    const getPrice = async () => {
      try {
        setPriceLoading(true);
        setError("");

        const response = await api.get(
          `/serviceMangement/getPricingByName/${formData.serviceType}`
        );

        if (cancelled) return;

        const data = response.data?.data;

        setPrice(data?.price ?? null);
        setCurrency(data?.currency || "EGP");
      } catch (err) {
        if (cancelled) return;

        console.error("Get Price Error:", err);

        setPrice(null);

        setError(
          err.response?.data?.message ||
            (isAr
              ? "تعذر الحصول على سعر الخدمة"
              : "Failed to get service price")
        );
      } finally {
        if (!cancelled) {
          setPriceLoading(false);
        }
      }
    };

    getPrice();

    return () => {
      cancelled = true;
    };
  }, [formData.serviceType, isAr]);

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.userName.trim()) {
      setError(
        isAr ? "برجاء إدخال الاسم بالكامل" : "Please enter your full name"
      );
      return;
    }

    if (!formData.phone.trim()) {
      setError(
        isAr ? "برجاء إدخال رقم الهاتف" : "Please enter your phone number"
      );
      return;
    }

    if (!formData.location.trim()) {
      setError(
        isAr ? "برجاء إدخال العنوان" : "Please enter your address"
      );
      return;
    }

    if (!formData.serviceType) {
      setError(
        isAr ? "برجاء اختيار نوع الخدمة" : "Please select a service type"
      );
      return;
    }

    if (!formData.serviceItem) {
      setError(
        isAr ? "برجاء اختيار البند" : "Please select a service item"
      );
      return;
    }

    if (price === null) {
      setError(
        isAr ? "سعر الخدمة غير متاح" : "Service price is not available"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/serviceRequests", {
        serviceItem: formData.serviceItem,
        requestType: formData.serviceType,
        description: formData.description,
        userName: formData.userName.trim(),
        phone: formData.phone.trim(),
        address: formData.location.trim(),
      });

      console.log("Create Service Request:", response.data);

      const data = response.data?.data;

      if (!data?.paymentUrl) {
        setError(
          isAr
            ? "تم إنشاء الطلب ولكن رابط الدفع غير موجود"
            : "Order created but payment URL is missing"
        );
        return;
      }

      setPaymentUrl(data.paymentUrl);
      setShowPayment(true);
    } catch (err) {
      console.error("Create Service Request Error:", err);

      setError(
        err.response?.data?.message ||
          (isAr
            ? "حدث خطأ أثناء إنشاء الطلب"
            : "Failed to create service request")
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CLOSE PAYMENT
  // =====================================================

  const closePayment = () => {
    setShowPayment(false);
    setPaymentUrl("");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <div className="min-h-[calc(100vh-5rem)] bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-xl">

          {/* DYNAMIC HEADER */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {getHeaderTitle()}
            </h1>

            <p className="text-sm text-slate-500">
              {isAr
                ? "أدخل بياناتك واختر الخدمة والبند ثم أكمل عملية الدفع."
                : "Enter your details, select your service and item, then proceed to payment."}
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-2xl -sm border border-slate-200/80 p-6 sm:p-8">

            {/* ERROR */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAME */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isAr ? "الاسم بالكامل" : "Full Name"}
                  <span className="text-rose-500"> *</span>
                </label>

                <div className="relative">
                  <User className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    placeholder={
                      isAr
                        ? "مثال: أحمد مصطفى"
                        : "e.g. John Doe"
                    }
                    className="w-full ps-10 pe-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isAr ? "رقم الهاتف" : "Phone Number"}
                  <span className="text-rose-500"> *</span>
                </label>

                <div className="relative">
                  <Phone className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    dir="ltr"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+20 100 000 0000"
                    className="w-full ps-10 pe-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              {/* LOCATION */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isAr
                    ? "الموقع أو العنوان بالتفصيل"
                    : "Location / Detailed Address"}
                  <span className="text-rose-500"> *</span>
                </label>

                <div className="relative">
                  <MapPin className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder={
                      isAr
                        ? "مثال: التجمع الخامس"
                        : "e.g. 5th Settlement"
                    }
                    className="w-full ps-10 pe-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              {/* SERVICE TYPE */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isAr
                    ? "نوع الخدمة المطلوبة"
                    : "Service Type"}
                  <span className="text-rose-500"> *</span>
                </label>

                <div className="relative">
                  <Briefcase className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    disabled={Boolean(queryService)}
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full ps-10 pe-8 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:opacity-75 disabled:cursor-not-allowed"
                    required
                  >
                    <option value="">
                      {isAr
                        ? "-- اختر نوع الخدمة --"
                        : "-- Select Service Type --"}
                    </option>

                    {servicesList.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {isAr ? srv.titleAr : srv.titleEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PRICE */}
              {formData.serviceType && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-bold text-slate-700">
                      {isAr ? "سعر الخدمة" : "Service Price"}
                    </span>

                    {priceLoading ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm">
                          {isAr ? "جاري تحميل السعر..." : "Loading price..."}
                        </span>
                      </div>
                    ) : (
                      <strong className="text-xl text-blue-600">
                        {price !== null
                          ? `${price.toLocaleString()} ${currency}`
                          : "--"}
                      </strong>
                    )}
                  </div>
                </div>
              )}

              {/* SERVICE ITEM - CUSTOM SEARCHABLE DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isAr ? "البند والخدمة المطلوبة" : "Service Item"}
                  <span className="text-rose-500"> *</span>
                </label>

                {/* Dropdown Toggle Header */}
                <div
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 bg-slate-50/50 border rounded-xl cursor-pointer transition-all ${
                    isDropdownOpen
                      ? "border-blue-500 ring-2 ring-blue-100 bg-white"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex-1 truncate">
                    {selectedItem ? (
                      <span className="text-sm font-bold text-slate-900">
                        {selectedItem.name}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">
                        {isAr ? "اختر الخدمة من القائمة..." : "Select a service item..."}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 ms-2">
                    {selectedItem && (
                      <button
                        type="button"
                        onClick={clearSelectedItem}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition"
                        title={isAr ? "إلغاء التحديد" : "Clear"}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        isDropdownOpen ? "rotate-180 text-blue-500" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-2xl -xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {/* Search Field inside dropdown */}
                    <div className="p-2.5 border-b border-slate-100 bg-slate-50/50">
                      <div className="relative">
                        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        <input
                          type="text"
                          autoFocus
                          value={itemSearch}
                          onChange={(e) => setItemSearch(e.target.value)}
                          placeholder={isAr ? "ابحث عن بند أو خدمة..." : "Filter services..."}
                          className="w-full ps-8 pe-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 p-1">
                      {itemsLoading ? (
                        <div className="p-6 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                          <span className="text-xs">
                            {isAr ? "جاري تحميل البنود..." : "Loading items..."}
                          </span>
                        </div>
                      ) : items.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs font-medium">
                          {isAr ? "لا توجد خدمات مطابقة" : "No services found"}
                        </div>
                      ) : (
                        items.map((item) => {
                          const isSelected = selectedItem?._id === item._id;
                          return (
                            <button
                              key={item._id}
                              type="button"
                              onClick={() => handleSelectItem(item)}
                              className={`w-full text-start p-2.5 rounded-xl transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                                isSelected
                                  ? "bg-blue-50 text-blue-700"
                                  : "hover:bg-slate-50 text-slate-800"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <div className="font-bold text-xs sm:text-sm truncate">
                                  {item.name}
                                </div>
                                {item.description && (
                                  <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                    {item.description}
                                  </div>
                                )}
                              </div>

                              {isSelected && (
                                <Check className="w-4 h-4 text-blue-600 shrink-0" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isAr
                    ? "تفاصيل إضافية"
                    : "Additional Details"}
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder={
                    isAr
                      ? "اكتب أي تفاصيل إضافية..."
                      : "Write additional details..."
                  }
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm resize-none outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* SUBMIT */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={
                    loading ||
                    priceLoading ||
                    price === null ||
                    !formData.serviceItem
                  }
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>
                        {isAr
                          ? "جاري إنشاء الطلب..."
                          : "Creating request..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>
                        {isAr
                          ? `المتابعة للدفع - ${
                              price !== null
                                ? price.toLocaleString()
                                : "--"
                            } ${currency}`
                          : `Proceed to Payment - ${
                              price !== null
                                ? price.toLocaleString()
                                : "--"
                            } ${currency}`}
                      </span>
                      <Arrow className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* =====================================================
          PAYMENT MODAL
      ===================================================== */}

      {showPayment && paymentUrl && (
        <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white w-full max-w-5xl h-[95vh] rounded-2xl overflow-hidden -2xl relative">
            {/* HEADER */}
            <div className="h-14 px-4 sm:px-5 border-b flex items-center justify-between bg-white">
              <h2 className="font-bold text-slate-800">
                {isAr
                  ? "إتمام عملية الدفع"
                  : "Complete Payment"}
              </h2>

              <button
                type="button"
                onClick={closePayment}
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PAYMENT IFRAME */}
            <div className="h-[calc(95vh-3.5rem)] bg-slate-100">
              <iframe
                src={paymentUrl}
                title="Kashier Payment"
                className="w-full h-full border-0"
                allow="payment *"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}