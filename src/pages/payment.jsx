"use client";

import { useEffect, useState } from "react";
import api from "../services/api";

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



        setPayment(response.data);
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
      <div className="payment-result">
        <div className="payment-loading">
          جاري التحقق من عملية الدفع...
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="payment-result">
        <div className="payment-error">
          <div className="payment-icon">✕</div>

          <h2>حدث خطأ</h2>

          <p>{error}</p>
        </div>
      </div>
    );
  }

  const isPaid = payment?.status === "paid";
  const isFailed = payment?.status === "failed";
  const isProcessing =
    payment?.status === "processing" ||
    payment?.status === "pending";

  return (
    <div className="payment-result">

      {/* SUCCESS */}
      {isPaid && (
        <div className="payment-success">
          <div className="payment-icon success-icon">
            ✓
          </div>

          <h1>تم الدفع بنجاح</h1>

          <p>تم استلام عملية الدفع بنجاح.</p>
        </div>
      )}

      {/* FAILED */}
      {isFailed && (
        <div className="payment-failed">
          <div className="payment-icon failed-icon">
            ✕
          </div>

          <h1>فشلت عملية الدفع</h1>

          <p>
            لم تتم عملية الدفع، يرجى المحاولة مرة أخرى.
          </p>
        </div>
      )}

      {/* PROCESSING */}
      {isProcessing && (
        <div className="payment-processing">
          <div className="payment-icon">
            ⏳
          </div>

          <h1>جاري التحقق من الدفع</h1>

          <p>
            يرجى الانتظار لحظات حتى يتم تأكيد العملية.
          </p>
        </div>
      )}

      {/* PAYMENT INFORMATION */}
      {payment && (
        <div className="payment-info">

          <h2>معلومات الدفع</h2>

          <div className="info-row">
            <span>رقم الطلب</span>
            <strong>
              {payment.orderNumber}
            </strong>
          </div>

          <div className="info-row">
            <span>المبلغ</span>
            <strong>
              {payment.amount} {payment.currency}
            </strong>
          </div>

          <div className="info-row">
            <span>نوع الدفع</span>
            <strong>
              {payment.paymentType === "full"
                ? "دفع كامل"
                : "عربون"}
            </strong>
          </div>

          <div className="info-row">
            <span>حالة الدفع</span>
            <strong>
              {payment.status}
            </strong>
          </div>

          {payment.transactionId && (
            <div className="info-row">
              <span>رقم العملية</span>
              <strong>
                {payment.transactionId}
              </strong>
            </div>
          )}

          {payment.paidAt && (
            <div className="info-row">
              <span>تاريخ الدفع</span>
              <strong>
                {new Date(payment.paidAt).toLocaleString(
                  "ar-EG"
                )}
              </strong>
            </div>
          )}

        </div>
      )}
    </div>
  );
}