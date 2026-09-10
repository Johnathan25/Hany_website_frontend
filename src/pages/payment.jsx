"use client";

import { useEffect, useState } from "react";
import api from "../services/api";
import { Check, X, Clock, AlertTriangle } from "lucide-react";

export default function PaymentResult() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getPaymentStatus = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const orderNumber = params.get("order");

        if (!orderNumber) {
          setError("رقم الطلب غير موجود");
          setLoading(false);
          return;
        }

        const response = await api.get(
          `/serviceRequests/payment-status/${orderNumber}`
        );

        setPayment(response.data.data);
      } catch (err) {
        console.error(err);
        setError("تعذر الاتصال بالسيرفر");
      } finally {
        setLoading(false);
      }
    };

    getPaymentStatus();
  }, []);

  // Loading
  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-teal-500 rounded-full animate-spin" />
          <p className="text-slate-500 text-sm">جاري التحقق من عملية الدفع...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 p-8 text-center">
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">حدث خطأ</h2>
          <p className="mt-2 text-slate-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const isPaid = payment?.status === "paid";
  const isFailed = payment?.status === "failed";
  const isProcessing =
    payment?.status === "processing" || payment?.status === "pending";

  const statusLabels = {
    paid: "تم الدفع",
    failed: "فشلت العملية",
    processing: "قيد المعالجة",
    pending: "قيد الانتظار",
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-md">

        {/* حالة العملية */}
        <div className="rounded-2xl border border-slate-200 p-8 text-center">

          {isPaid && (
            <>
              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center">
                <Check className="w-9 h-9 text-white" strokeWidth={3} />
              </div>
              <h1 className="text-xl font-bold text-slate-900">تم الدفع بنجاح</h1>
              <p className="mt-2 text-slate-500 text-sm">
                تم استلام عملية الدفع بنجاح.
              </p>
            </>
          )}

          {isFailed && (
            <>
              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-red-500 flex items-center justify-center">
                <X className="w-9 h-9 text-white" strokeWidth={3} />
              </div>
              <h1 className="text-xl font-bold text-slate-900">فشلت عملية الدفع</h1>
              <p className="mt-2 text-slate-500 text-sm">
                لم تتم عملية الدفع، يرجى المحاولة مرة أخرى.
              </p>
            </>
          )}

          {isProcessing && (
            <>
              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Clock className="w-8 h-8 text-slate-500" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">جاري التحقق من الدفع</h1>
              <p className="mt-2 text-slate-500 text-sm">
                يرجى الانتظار لحظات حتى يتم تأكيد العملية.
              </p>
            </>
          )}

          {!isPaid && !isFailed && !isProcessing && payment && (
            <>
              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-slate-500" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">حالة غير معروفة</h1>
              <p className="mt-2 text-slate-500 text-sm">{payment.status}</p>
            </>
          )}
        </div>

        {/* تفاصيل الدفع */}
        {payment && (
          <div className="mt-6 rounded-2xl border border-slate-200 p-6 sm:p-7">
            <h2 className="text-base font-bold text-slate-900 mb-4">معلومات الدفع</h2>

            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-500">رقم الطلب</span>
                <strong className="text-slate-900 font-semibold">{payment.orderNumber}</strong>
              </div>

              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-500">المبلغ</span>
                <strong className="text-slate-900 font-semibold">
                  {payment.amount} {payment.currency}
                </strong>
              </div>

              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-500">نوع الدفع</span>
                <strong className="text-slate-900 font-semibold">
                  {payment.paymentType === "full" ? "دفع كامل" : "عربون"}
                </strong>
              </div>

              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-500">حالة الدفع</span>
                <strong
                  className={
                    "font-semibold " +
                    (isPaid
                      ? "text-teal-600"
                      : isFailed
                      ? "text-red-600"
                      : "text-slate-700")
                  }
                >
                  {statusLabels[payment.status] || payment.status}
                </strong>
              </div>

              {payment.transactionId && (
                <div className="flex items-center justify-between py-3 text-sm">
                  <span className="text-slate-500">رقم العملية</span>
                  <strong className="text-slate-900 font-semibold">
                    {payment.transactionId}
                  </strong>
                </div>
              )}

              {payment.paidAt && (
                <div className="flex items-center justify-between py-3 text-sm">
                  <span className="text-slate-500">تاريخ الدفع</span>
                  <strong className="text-slate-900 font-semibold">
                    {new Date(payment.paidAt).toLocaleString("ar-EG")}
                  </strong>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

