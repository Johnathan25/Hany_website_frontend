import React, { useEffect, useState } from "react";
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
} from "lucide-react";

import api from "../../services/api";

export default function BookService() {
  const { isAr } = useLanguage();

  const Arrow = isAr ? ArrowLeft : ArrowRight;

  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] = useState({
    userName: "",
    location: "",
    phoneNumber: "",
    serviceType: "",
    serviceItem: "",
    description: "",
  });

  // =====================================================
  // ITEMS
  // =====================================================

  const [items, setItems] = useState([]);
  const [itemSearch, setItemSearch] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
  const [itemsLoading, setItemsLoading] = useState(false);

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
  // SERVICES
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
  // SEARCH SERVICE ITEMS
  // =====================================================

  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      try {
        setItemsLoading(true);

        const response = await api.get(
          `/serviceMangement/items?page=1&limit=10&search=${encodeURIComponent(
            itemSearch
          )}`
        );

        if (cancelled) return;

        setItems(response.data?.data || []);
      } catch (err) {
        if (cancelled) return;

        console.error("Get Items Error:", err);

        setError(
          err.response?.data?.message ||
            (isAr
              ? "تعذر تحميل البنود"
              : "Failed to load service items")
        );
      } finally {
        if (!cancelled) {
          setItemsLoading(false);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [itemSearch, isAr]);

  // =====================================================
  // SELECT ITEM
  // =====================================================

  const handleSelectItem = (item) => {
    setFormData((prev) => ({
      ...prev,
      serviceItem: item._id,
    }));

    setSelectedItemName(item.name);
    setItemSearch("");
    setError("");
  };

  // =====================================================
  // CLEAR SELECTED ITEM
  // =====================================================

  const clearSelectedItem = () => {
    setSelectedItemName("");

    setFormData((prev) => ({
      ...prev,
      serviceItem: "",
    }));

    setItemSearch("");
  };

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

    if (!formData.phoneNumber.trim()) {
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

          {/* HEADER */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isAr
                ? "طلب معاينة أو خدمة هندسية"
                : "Request a Service / Inspection"}
            </h1>

            <p className="text-sm text-slate-500">
              {isAr
                ? "أدخل بياناتك واختر الخدمة والبند ثم أكمل عملية الدفع."
                : "Enter your details, select your service and item, then proceed to payment."}
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 sm:p-8">

            {/* ERROR */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

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
                    name="phoneNumber"
                    value={formData.phoneNumber}
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
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full ps-10 pe-8 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  >
                    <option value="">
                      {isAr
                        ? "-- اختر نوع الخدمة --"
                        : "-- Select Service Type --"}
                    </option>

                    {servicesList.map((srv) => (
                      <option
                        key={srv.id}
                        value={srv.id}
                      >
                        {isAr
                          ? srv.titleAr
                          : srv.titleEn}
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
                      {isAr
                        ? "سعر الخدمة"
                        : "Service Price"}
                    </span>

                    {priceLoading ? (
                      <div className="flex items-center gap-2 text-blue-600">
                        <Loader2 className="w-5 h-5 animate-spin" />

                        <span className="text-sm">
                          {isAr
                            ? "جاري تحميل السعر..."
                            : "Loading price..."}
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

              {/* SERVICE ITEM */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  {isAr ? "البند" : "Service Item"}

                  <span className="text-rose-500"> *</span>
                </label>

                <div className="relative">
                  <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                  <input
                    type="text"
                    value={
                      selectedItemName
                        ? selectedItemName
                        : itemSearch
                    }
                    onChange={(e) => {
                      setSelectedItemName("");

                      setFormData((prev) => ({
                        ...prev,
                        serviceItem: "",
                      }));

                      setItemSearch(e.target.value);
                    }}
                    placeholder={
                      isAr
                        ? "اكتب اسم البند..."
                        : "Type service item..."
                    }
                    className="w-full ps-10 pe-10 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {selectedItemName && (
                    <button
                      type="button"
                      onClick={clearSelectedItem}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* RESULTS */}
                {!selectedItemName && itemSearch.trim() && (
                  <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">

                    {itemsLoading ? (
                      <div className="p-4 text-center text-slate-500">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />

                        <p className="text-xs mt-2">
                          {isAr
                            ? "جاري البحث..."
                            : "Searching..."}
                        </p>
                      </div>
                    ) : items.length === 0 ? (
                      <div className="p-4 text-center text-slate-500 text-sm">
                        {isAr
                          ? "لا توجد نتائج"
                          : "No results found"}
                      </div>
                    ) : (
                      items.map((item) => (
                        <button
                          type="button"
                          key={item._id}
                          onClick={() =>
                            handleSelectItem(item)
                          }
                          className="w-full text-start px-4 py-3 hover:bg-slate-50 border-b last:border-b-0 border-slate-100 transition"
                        >
                          <div className="font-bold text-slate-800">
                            {item.name}
                          </div>

                          {item.description && (
                            <div className="text-xs text-slate-500 mt-1">
                              {item.description}
                            </div>
                          )}
                        </button>
                      ))
                    )}
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
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition"
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

          <div className="bg-white w-full max-w-5xl h-[95vh] rounded-2xl overflow-hidden shadow-2xl relative">

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
                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PAYMENT */}
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