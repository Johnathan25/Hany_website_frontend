// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import {
//     Loader2,
//     CreditCard,
//     ShieldCheck,
//     AlertCircle,
//     FileText,
//     Calendar,
//     Wallet,
//     User,
//     Phone,
//     Mail,
//     MapPin,
//     ExternalLink,
// } from "lucide-react";
// import api from "../../services/api";

// const InventionDepositPayment = () => {
//     const [searchParams] = useSearchParams();
//     const inventionId = searchParams.get("inventionId");
//     const pricingOptionId = searchParams.get("pricingOptionId");

//     // ==========================================
//     // STATES
//     // ==========================================
//     const [invention, setInvention] = useState(null);
//     const [pricingOption, setPricingOption] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [paymentLoading, setPaymentLoading] = useState(false);
//     const [paymentUrl, setPaymentUrl] = useState("");
//     const [error, setError] = useState("");

//     // ==========================================
//     // CUSTOMER FORM
//     // ==========================================
//     const [formData, setFormData] = useState({
//         customerName: "",
//         phone: "",
//         address: "",
//         email: "",
//     });

//     // ==========================================
//     // GET INVENTION
//     // ==========================================
//     useEffect(() => {
//         const getInvention = async () => {
//             try {
//                 setLoading(true);
//                 setError("");

//                 if (!inventionId || !pricingOptionId) {
//                     setError("بيانات براءة الاختراع أو خيار الترخيص غير موجودة");
//                     return;
//                 }

//                 const response = await api.get(
//                     `/invention/client/${inventionId}`
//                 );
//                 const data = response.data?.invention;

//                 if (!data) {
//                     setError("لم يتم العثور على براءة الاختراع");
//                     return;
//                 }

//                 setInvention(data);

//                 // ==========================================
//                 // FIND SELECTED PRICING OPTION
//                 // ==========================================
//                 const selectedOption = (data.pricingOptions || []).find(
//                     (option) => String(option._id) === String(pricingOptionId)
//                 );

//                 if (!selectedOption) {
//                     setError("خيار الترخيص الذي اخترته غير موجود أو غير متاح");
//                     return;
//                 }

//                 setPricingOption(selectedOption);
//             } catch (err) {
//                 console.error("Get invention error:", err);
//                 setError(
//                     err.response?.data?.message || "حدث خطأ أثناء جلب بيانات البراءة"
//                 );
//             } finally {
//                 setLoading(false);
//             }
//         };

//         getInvention();
//     }, [inventionId, pricingOptionId]);

//     // ==========================================
//     // FORM CHANGE
//     // ==========================================
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // ==========================================
//     // VALIDATE FORM
//     // ==========================================
//     const validateForm = () => {
//         if (!formData.customerName.trim()) {
//             setError("يرجى إدخال الاسم");
//             return false;
//         }
//         if (!formData.phone.trim()) {
//             setError("يرجى إدخال رقم الهاتف");
//             return false;
//         }
//         if (!formData.email.trim()) {
//             setError("يرجى إدخال البريد الإلكتروني");
//             return false;
//         }
//         if (!formData.address.trim()) {
//             setError("يرجى إدخال العنوان");
//             return false;
//         }

//         setError("");
//         return true;
//     };

//     // ==========================================
//     // CREATE REQUEST + PAYMENT
//     // ==========================================
//     const handlePayment = async () => {
//         if (!validateForm()) {
//             return;
//         }

//         try {
//             setPaymentLoading(true);
//             setError("");

//             const response = await api.post(
//                 "/inventionRequest",
//                 {
//                     inventionId,
//                     pricingOptionId,
//                     customerName: formData.customerName.trim(),
//                     phone: formData.phone.trim(),
//                     address: formData.address.trim(),
//                     email: formData.email.trim(),
//                 },
//                 {
//                     withCredentials: true,
//                 }
//             );

//             console.log("Create invention request response:", response.data);

//             // ==========================================
//             // GET PAYMENT URL
//             // ==========================================
//             const url =
//                 response.data?.sessionUrl ||
//                 response.data?.payment?.sessionUrl ||
//                 response.data?.payment?.kashier?.sessionUrl ||
//                 response.data?.payment?.kashier?.paymentUrl ||
//                 response.data?.payment?.kashier?.url ||
//                 response.data?.paymentUrl;

//             if (!url) {
//                 console.error("Full payment response with missing URL:", response.data);
//                 throw new Error("لم يتم استلام رابط الدفع من الخادم");
//             }

//             setPaymentUrl(url);
//         } catch (err) {
//             console.error("Payment error:", err);
//             setError(
//                 err.response?.data?.message ||
//                 err.message ||
//                 "حدث خطأ أثناء إنشاء عملية الدفع"
//             );
//         } finally {
//             setPaymentLoading(false);
//         }
//     };

//     // ==========================================
//     // LOADING
//     // ==========================================
//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="flex flex-col items-center gap-3">
//                     <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
//                     <p className="text-gray-600">جاري تحميل بيانات البراءة...</p>
//                 </div>
//             </div>
//         );
//     }

//     // ==========================================
//     // ERROR
//     // ==========================================
//     if (error && !invention) {
//         return (
//             <div
//                 dir="rtl"
//                 className="min-h-screen bg-gray-50 flex items-center justify-center p-6"
//             >
//                 <div className="bg-white border rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
//                     <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//                     <h2 className="text-xl font-bold text-gray-800 mb-2">حدث خطأ</h2>
//                     <p className="text-gray-600">{error}</p>
//                 </div>
//             </div>
//         );
//     }

//     // ==========================================
//     // PAYMENT IFRAME + DIRECT BUTTON
//     // ==========================================
//     if (paymentUrl) {
//         return (
//             <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8">
//                 <div className="max-w-5xl mx-auto">
//                     <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
//                         <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">
//                                     <ShieldCheck className="w-6 h-6 text-green-600" />
//                                 </div>
//                                 <div>
//                                     <h2 className="font-bold text-gray-800 text-lg">
//                                         إتمام دفع العربون
//                                     </h2>
//                                     <p className="text-sm text-gray-500 mt-0.5">
//                                         أكمل عملية الدفع بأمان عبر بوابة الدفع الإلكتروني
//                                     </p>
//                                 </div>
//                             </div>

//                             <a
//                                 href={paymentUrl}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
//                             >
//                                 <span>فتح نافذة الدفع مباشرة</span>
//                                 <ExternalLink className="w-4 h-4" />
//                             </a>
//                         </div>

//                         <iframe
//                             src={paymentUrl}
//                             title="Kashier Payment"
//                             className="w-full border-0"
//                             style={{ height: "750px" }}
//                             allow="payment"
//                         />
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     // ==========================================
//     // MAIN PAGE
//     // ==========================================
//     return (
//         <div dir="rtl" className="min-h-screen bg-gray-50 py-8 px-4">
//             <div className="max-w-5xl mx-auto">
//                 {/* PAGE HEADER */}
//                 <div className="mb-7">
//                     <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//                         طلب براءة الاختراع
//                     </h1>
//                     <p className="text-gray-500 mt-2">
//                         راجع بيانات البراءة والترخيص وأدخل بياناتك لدفع العربون
//                     </p>
//                 </div>

//                 {/* ERROR */}
//                 {error && (
//                     <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
//                         <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
//                         <p className="text-red-700 text-sm">{error}</p>
//                     </div>
//                 )}

//                 {/* INVENTION INFO */}
//                 <div className="bg-white rounded-2xl border shadow-sm p-6 mb-6">
//                     <div className="flex items-start gap-4">
//                         <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
//                             <FileText className="w-6 h-6 text-blue-600" />
//                         </div>
//                         <div className="flex-1">
//                             <p className="text-sm text-gray-500 mb-1">براءة الاختراع</p>
//                             <h2 className="text-xl font-bold text-gray-800">
//                                 {invention?.title}
//                             </h2>
//                             {invention?.shortDescription && (
//                                 <p className="text-gray-600 mt-3 leading-7">
//                                     {invention.shortDescription}
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                 </div>

//                 {/* CONTENT */}
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                     {/* DETAILS & FORM */}
//                     <div className="lg:col-span-2 space-y-6">
//                         {/* SELECTED PRICING */}
//                         {pricingOption && (
//                             <div className="bg-white rounded-2xl border shadow-sm p-6">
//                                 <h2 className="text-lg font-bold text-gray-800 mb-5">
//                                     تفاصيل الترخيص المختار
//                                 </h2>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="border rounded-xl p-4">
//                                         <p className="text-sm text-gray-500 mb-2">نوع الترخيص</p>
//                                         <p className="font-bold text-gray-800">
//                                             {pricingOption.type}
//                                         </p>
//                                     </div>

//                                     <div className="border rounded-xl p-4">
//                                         <div className="flex items-center gap-2 mb-2">
//                                             <Calendar className="w-4 h-4 text-gray-500" />
//                                             <p className="text-sm text-gray-500">مدة الترخيص</p>
//                                         </div>
//                                         <p className="font-bold text-gray-800">
//                                             {pricingOption.durationYears
//                                                 ? `${pricingOption.durationYears} سنة`
//                                                 : "غير محددة"}
//                                         </p>
//                                     </div>

//                                     <div className="border rounded-xl p-4">
//                                         <p className="text-sm text-gray-500 mb-2">السعر النهائي</p>
//                                         <p className="text-xl font-bold text-gray-800">
//                                             {Number(pricingOption.price).toLocaleString("ar-EG")}{" "}
//                                             جنيه
//                                         </p>
//                                     </div>

//                                     <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
//                                         <div className="flex items-center gap-2 mb-2">
//                                             <Wallet className="w-4 h-4 text-blue-600" />
//                                             <p className="text-sm text-blue-700">العربون المطلوب</p>
//                                         </div>
//                                         <p className="text-2xl font-bold text-blue-700">
//                                             {Number(pricingOption.depositAmount).toLocaleString(
//                                                 "ar-EG"
//                                             )}{" "}
//                                             جنيه
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* CUSTOMER FORM */}
//                         <div className="bg-white rounded-2xl border shadow-sm p-6">
//                             <div className="mb-6">
//                                 <h2 className="text-lg font-bold text-gray-800">
//                                     بيانات العميل
//                                 </h2>
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     أدخل بياناتك لإتمام طلب براءة الاختراع
//                                 </p>
//                             </div>

//                             <div className="space-y-5">
//                                 {/* NAME */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         الاسم بالكامل
//                                     </label>
//                                     <div className="relative">
//                                         <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                         <input
//                                             type="text"
//                                             name="customerName"
//                                             value={formData.customerName}
//                                             onChange={handleChange}
//                                             placeholder="اكتب اسمك بالكامل"
//                                             className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* PHONE */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         رقم الهاتف
//                                     </label>
//                                     <div className="relative">
//                                         <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                         <input
//                                             type="tel"
//                                             name="phone"
//                                             value={formData.phone}
//                                             onChange={handleChange}
//                                             placeholder="01012345678"
//                                             className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* EMAIL */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         البريد الإلكتروني
//                                     </label>
//                                     <div className="relative">
//                                         <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                                         <input
//                                             type="email"
//                                             name="email"
//                                             value={formData.email}
//                                             onChange={handleChange}
//                                             placeholder="example@gmail.com"
//                                             className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* ADDRESS */}
//                                 <div>
//                                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                         العنوان
//                                     </label>
//                                     <div className="relative">
//                                         <MapPin className="absolute right-3 top-4 w-5 h-5 text-gray-400" />
//                                         <textarea
//                                             name="address"
//                                             value={formData.address}
//                                             onChange={handleChange}
//                                             placeholder="اكتب العنوان بالتفصيل"
//                                             rows={4}
//                                             className="w-full pr-11 pl-4 py-3 border border-gray-200 rounded-xl outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
//                                         />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* SUMMARY & ACTION */}
//                     <div>
//                         <div className="bg-white rounded-2xl border shadow-sm p-6 lg:sticky lg:top-5">
//                             <h2 className="text-lg font-bold text-gray-800 mb-5">
//                                 ملخص الطلب
//                             </h2>

//                             <div className="space-y-4">
//                                 <div>
//                                     <p className="text-sm text-gray-500">براءة الاختراع</p>
//                                     <p className="font-semibold text-gray-800 mt-1">
//                                         {invention?.title}
//                                     </p>
//                                 </div>

//                                 <div className="flex justify-between gap-3">
//                                     <span className="text-gray-500">نوع الترخيص</span>
//                                     <span className="font-semibold text-gray-800">
//                                         {pricingOption?.type}
//                                     </span>
//                                 </div>

//                                 {pricingOption?.durationYears && (
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-500">المدة</span>
//                                         <span className="font-semibold text-gray-800">
//                                             {pricingOption.durationYears} سنة
//                                         </span>
//                                     </div>
//                                 )}

//                                 <div className="flex justify-between">
//                                     <span className="text-gray-500">السعر النهائي</span>
//                                     <span className="font-semibold text-gray-800">
//                                         {Number(pricingOption?.price || 0).toLocaleString("ar-EG")}{" "}
//                                         جنيه
//                                     </span>
//                                 </div>

//                                 <div className="border-t pt-4">
//                                     <div className="flex justify-between items-center">
//                                         <span className="font-bold text-gray-800">العربون المطلوب</span>
//                                         <span className="text-2xl font-bold text-blue-600">
//                                             {Number(
//                                                 pricingOption?.depositAmount || 0
//                                             ).toLocaleString("ar-EG")}{" "}
//                                             جنيه
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="mt-5 bg-green-50 border border-green-100 rounded-xl p-4">
//                                 <div className="flex gap-2">
//                                     <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
//                                     <p className="text-xs text-green-800 leading-5">
//                                         سيتم دفع العربون فقط الآن، وسيتم حفظ السعر النهائي للترخيص في
//                                         طلبك. في حالة محاولة استرداد المبلغ يتم استرجاع ثلثي المبلغ.
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* SUBMIT BUTTON */}
//                             <button
//                                 type="button"
//                                 onClick={handlePayment}
//                                 disabled={paymentLoading || !pricingOption}
//                                 className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
//                             >
//                                 {paymentLoading ? (
//                                     <>
//                                         <Loader2 className="w-5 h-5 animate-spin" />
//                                         <span>جاري تجهيز الدفع...</span>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <CreditCard className="w-5 h-5" />
//                                         <span>دفع العربون</span>
//                                     </>
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default InventionDepositPayment;


import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Loader2,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  FileText,
  Calendar,
  Wallet,
  User,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Lock,
  X,
  Layers,
} from "lucide-react";
import api from "../../services/api";

const InventionDepositPayment = () => {
  const [searchParams] = useSearchParams();
  const inventionId = searchParams.get("inventionId");
  const pricingOptionId = searchParams.get("pricingOptionId");

  // ==========================================
  // STATES
  // ==========================================
  const [invention, setInvention] = useState(null);
  const [pricingOption, setPricingOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // CUSTOMER FORM
  // ==========================================
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    email: "",
  });

  // ==========================================
  // GET INVENTION
  // ==========================================
  useEffect(() => {
    const getInvention = async () => {
      try {
        setLoading(true);
        setError("");

        if (!inventionId || !pricingOptionId) {
          setError("بيانات براءة الاختراع أو خيار الترخيص غير مكتملة في الرابط");
          return;
        }

        const response = await api.get(`/invention/client/${inventionId}`);
        const data = response.data?.invention;

        if (!data) {
          setError("لم يتم العثور على براءة الاختراع المطلوبة");
          return;
        }

        setInvention(data);

        // العثور على خيار التسعير
        const selectedOption = (data.pricingOptions || []).find(
          (option) => String(option._id) === String(pricingOptionId)
        );

        if (!selectedOption) {
          setError("خيار الترخيص الذي اخترته غير متاح حالياً");
          return;
        }

        setPricingOption(selectedOption);
      } catch (err) {
        console.error("Get invention error:", err);
        setError(
          err.response?.data?.message || "حدث خطأ أثناء جلب بيانات البراءة"
        );
      } finally {
        setLoading(false);
      }
    };

    getInvention();
  }, [inventionId, pricingOptionId]);

  // ==========================================
  // FORM CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // VALIDATE FORM
  // ==========================================
  const validateForm = () => {
    if (!formData.customerName.trim()) {
      setError("يرجى إدخال اسمك بالكامل");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("يرجى إدخال رقم الهاتف");
      return false;
    }
    if (!formData.email.trim()) {
      setError("يرجى إدخال البريد الإلكتروني بشكل صحيح");
      return false;
    }
    if (!formData.address.trim()) {
      setError("يرجى كتابة العنوان بالتفصيل");
      return false;
    }

    setError("");
    return true;
  };

  // ==========================================
  // CREATE REQUEST + PAYMENT
  // ==========================================
  const handlePayment = async () => {
    if (!validateForm()) return;

    try {
      setPaymentLoading(true);
      setError("");

      const response = await api.post(
        "/inventionRequest",
        {
          inventionId,
          pricingOptionId,
          customerName: formData.customerName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          email: formData.email.trim(),
        },
        {
          withCredentials: true,
        }
      );

      const url =
        response.data?.sessionUrl ||
        response.data?.payment?.sessionUrl ||
        response.data?.payment?.kashier?.sessionUrl ||
        response.data?.payment?.kashier?.paymentUrl ||
        response.data?.payment?.kashier?.url ||
        response.data?.paymentUrl;

      if (!url) {
        throw new Error("تعذر استلام رابط بوابة الدفع من السيرفر");
      }

      setPaymentUrl(url);
    } catch (err) {
      console.error("Payment error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "حدث خطأ أثناء إعداد جلسة الدفع الإلكتروني"
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  // ==========================================
  // LOADING STATE
  // ==========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center gap-4 text-center max-w-sm w-full">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">جاري تحميل بيانات البراءة...</h3>
            <p className="text-xs text-slate-400 mt-1">يرجى الانتظار للحظات</p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR STATE
  // ==========================================
  if (error && !invention) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-rose-100 rounded-3xl shadow-sm p-8 max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-black text-slate-900">تعذر فتح الطلب</h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{error}</p>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            العودة لصفحة البراءات
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAYMENT OVERLAY / IFRAME
  // ==========================================
  if (paymentUrl) {
    return (
      <div dir="rtl" className="min-h-screen bg-slate-900/40 backdrop-blur-xs p-3 sm:p-6 flex items-center justify-center">
        <div className="max-w-5xl w-full bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                  إتمام سداد العربون
                </h2>
                <p className="text-[11px] text-slate-500">
                  جلسة آمنة ومشفرة عبر بوابة Kashier المعتمدة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={paymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold rounded-xl transition-colors"
              >
                <span>فتح في نافذة مستقلة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setPaymentUrl("")}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-white transition-colors cursor-pointer"
                title="إلغاء وإغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <iframe
            src={paymentUrl}
            title="Kashier Payment Gateway"
            className="w-full border-0 bg-slate-50"
            style={{ height: "76vh" }}
            allow="payment"
          />
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN FORM PAGE
  // ==========================================
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            استكمال طلب البراءة ودفع العربون
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            راجع تفاصيل الترخيص وأدخل بيانات الاتصال المعتمدة لإنشاء الفاتورة ورابط السداد الإلكتروني.
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Invention Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-bold">
                #{invention?._id?.slice(-8)?.toUpperCase()}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> براءة موثقة ومحمية
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1.5">
              {invention?.title}
            </h2>
            {invention?.shortDescription && (
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                {invention.shortDescription}
              </p>
            )}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Right Column: Pricing details & Customer Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Selected Pricing Model */}
            {pricingOption && (
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <span>تفاصيل نموذج الترخيص المختار</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="block text-[10px] text-slate-400 font-medium">نوع الترخيص</span>
                    <span className="text-xs font-bold text-slate-800 block mt-1 truncate">
                      {pricingOption.type}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="block text-[10px] text-slate-400 font-medium">مدة الترخيص</span>
                    <span className="text-xs font-bold text-slate-800 block mt-1">
                      {pricingOption.durationYears ? `${pricingOption.durationYears} سنة` : "دائم / غير محدد"}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="block text-[10px] text-slate-400 font-medium">السعر الإجمالي</span>
                    <span className="text-xs font-black font-mono text-slate-800 block mt-1">
                      {Number(pricingOption.price).toLocaleString()} الجنيه المصري
                    </span>
                  </div>

                  <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl">
                    <span className="block text-[10px] text-blue-700 font-medium">العربون المطلوب</span>
                    <span className="text-xs font-black font-mono text-blue-700 block mt-1">
                      {Number(pricingOption.depositAmount).toLocaleString()} الجنيه المصري
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Customer Inputs Form */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>بيانات المستفيد وصاحب التعاقد</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  تُسجل هذه البيانات رسمياً في سجلات الفاتورة وعقد براءة الاختراع.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      الاسم بالكامل <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder="مثال: أحمد مصطفى كامل"
                        className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      رقم الهاتف <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="tel"
                        name="phone"
                        dir="ltr"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="010xxxxxxxx"
                        className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 text-right font-mono outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    البريد الإلكتروني <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="client@example.com"
                      className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 font-mono outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    العنوان بالتفصيل <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="المدينة، الحي، رقم العقار أو الموقع الميداني..."
                      rows={3}
                      className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Left Column: Order Summary & Checkout Action */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 lg:sticky lg:top-6 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">ملخص العملية المالية</h3>
                <Lock className="w-4 h-4 text-slate-400" />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-500">
                  <span>براءة الاختراع:</span>
                  <span className="font-bold text-slate-800 max-w-[150px] truncate">
                    {invention?.title}
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span>نوع الاتفاق:</span>
                  <span className="font-semibold text-slate-700">{pricingOption?.type}</span>
                </div>

                <div className="flex justify-between items-center text-slate-500">
                  <span>السعر الإجمالي:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {Number(pricingOption?.price || 0).toLocaleString()} الجنيه المصري
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <div>
                    <span className="block text-slate-900 font-black text-sm">المطلوب سداده الآن:</span>
                    <span className="text-[10px] text-slate-400">(عربون مقدم)</span>
                  </div>
                  <span className="text-xl font-black font-mono text-blue-600">
                    {Number(pricingOption?.depositAmount || 0).toLocaleString()}{" "}
                    <span className="text-xs font-normal text-slate-500">الجنيه المصري</span>
                  </span>
                </div>
              </div>

              {/* Legal Note */}
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  يُحسب هذا المبلغ كعربون لتثبيت الترخيص. في حال طلب الإلغاء والاسترداد، يتم استرجاع ثلثي المبلغ وفقاً للشروط المعتمدة.
                </p>
              </div>

              {/* Submit CTA Button */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={paymentLoading || !pricingOption}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري تجهيز بوابة الدفع...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>دفع العربون ({Number(pricingOption?.depositAmount || 0).toLocaleString()} الجنيه المصري)</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InventionDepositPayment;