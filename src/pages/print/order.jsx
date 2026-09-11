import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import api from '../../services/api';
import { getCurrentUser } from '../../services/getCurrentUser';

const OrderInvoice = () => {
  const [order, setOrder] = useState(null);
  const [about, setAbout] = useState([]);

  const [loading, setLoading] = useState(false);
  const { orderId } = useParams();
   const userToken = getCurrentUser();

  const fetchOrder = async () => {
    try {
      setLoading(true);
     

  const  [orderRes, aboutRes]=  await Promise.all(
   [    api.get(`/order/by-id/${orderId}`),
       api.get(`/about`)]
      )
      setOrder(orderRes.data.order);
      setAbout(aboutRes.data.data[0])
                  document.title ="فاتورة طلب رقم " + orderRes.data.order?.orderNumber + " - نظام أبو الدهب";
     
      setLoading(false);
      
    } catch (err) {
      console.error(err);
      Swal.fire({ title: "خطأ في تحميل البيانات", icon: "error" });
      setLoading(false);
    }
  };

    const getStatusText = (status) => {
    const texts = {
      pending: 'قيد الانتظار',
      confirmed: 'تم التأكيد',
      shipped: 'تم الشحن',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي'
    };
    return texts[status] || status;
  };



  useEffect(() => {
    if (orderId) fetchOrder();

  }, [orderId]);

  if (loading) return <div className="text-center p-5 font-bold">جاري التحميل...</div>;
  if (!order) return <div className="text-center p-5 text-red-500">لا توجد بيانات</div>;

  return (
  <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
  
  <button onClick={() => window.history.back()} className="no-print mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-6 rounded shadow">
    رجوع
  </button>

  {/* منطقة الفاتورة */}
  <div 
    id="invoice-print-area"
    dir="rtl"
    className="printable bg-white shadow-none text-black font-sans leading-tight border border-gray-100"
    style={userToken.role=="customer" ?{ width: '80mm', padding: '5mm', boxSizing: 'border-box' }  : { width: '100%', padding: '5mm', boxSizing: 'border-box' }}
  >
    {/* Header */}
    <div className="text-center mb-2 border-b-2 border-black pb-2">
      <h1 className="text-xl font-black">ابو الدهب</h1>
      <p className="text-[14px] font-bold">للمنتجات الغذائية والمجمدات</p>
      {/* <p className="text-[9px] mt-1 italic">تصميم: كيرلس رضا (01270857659)</p> */}
    </div>

    {/* Info Table */}
    <table className="w-full text-[15px]  mb-2 border-b border-dashed border-black pb-2">
<tbody>
        <tr>
          <td className="font-bold py-1">رقم الطلب:</td>
          <td className="py-1 text-left font-mono">{order.orderNumber}</td>
        </tr>
        <tr>
          <td className="font-bold py-1">تاريخ الطلب:</td>
          <td className="py-1 text-left">{new Date(order.createdAt).toLocaleString("ar-EG")}</td>
        </tr>
        {order.confirmedAt && (
          <tr>
            <td className="font-bold py-1">تاريخ التأكيد:</td>
            <td className="py-1 text-left">{new Date(order.confirmedAt).toLocaleString("ar-EG")}</td>
          </tr>
        )}
        {order.deliveredAt && (
          <tr>
            <td className="font-bold py-1">تاريخ الاستلام:</td>
            <td className="py-1 text-left font-bold">{new Date(order.deliveredAt).toLocaleString("ar-EG")}</td>
          </tr>
        )}
        <tr className="">
          <td className="font-bold py-1">حالة الطلب:</td>
          <td className="py-1 text-left font-black underline">
            {getStatusText(order.status)}
          </td>
        </tr>
      </tbody>
    </table>

    {/* Customer Info */}
    <div className="text-[15px]  flex justify-between flex-wrap mb-3 border-b border-dashed border-black pb-2">
       <p><span className="font-bold">العميل:</span> {order.customerName}</p>
       <p><span className="font-bold">الموبايل:</span> {order.phone}</p>
    </div>

    {/* Items Table */}
    <table className="w-full text-[14px] border-collapse">
      <thead>
        <tr className="border-b border-black text-right">
          <th className="py-1">الصنف</th>
          <th className="text-center py-1">الكمية</th>
          <th className="text-center py-1">سعر الوحدة</th>
          <th className="text-left py-1">الإجمالي</th>
        </tr>
      </thead>
      <tbody>
        {order.items.map((item, index) => (
          <tr key={index} className="border-b border-dashed border-gray-300">
            <td className="py-2 text-right">
              <div className="font-bold text-[15px] ">{item.productName}</div>
              <div className="font-thin text-[15px] ">{item.product?.description}</div>
              <div className="font-thin text-[15px] ">{item?.offerTitle}</div>
              <div className="font-thin  text-[15px] ">{item?.comboTitle}</div>


              
            </td>
            <td className="text-center flex justify-center items-center gap-2 font-bold">
               <div className=' gap-2 items-center justify-center'>
                   <div className="text-[15px] text-gray-600">{item.quantity}</div>
              <div className="text-[15px] text-gray-600">[{item.unit_type}]</div>
               </div>
            </td>
            <td className="text-center text-[12px]">{item.price}</td>
            <td className="text-left text-[12px] font-bold">{item.subtotal}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Totals Section */}
    <div className="mt-2 border-t border-black pt-2 space-y-1 text-[15px] ">
      <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
        <span>إجمالي البضاعة:</span>
        <span className="font-bold">{order.totalPrice} ج.م</span>
      </div>
      <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
        <span>التوصيل:</span>
        <span className="text-[14px] italic">
          {order.shippingPrice === 0 ? "  التوصيل مجاني" : `${order.shippingPrice} ج.م`}
        </span>
      </div>
      <div className="flex justify-between text-[14px] font-black border-t-2 border-double border-black pt-1">
        <span>الصافي النهائي:</span>
        <span>{order.finalPrice} ج.م</span>
      </div>
    </div>

    {/* Rejection Reason (If Cancelled) */}
    {order.status === 'cancelled' && order.rejectionReason && (
      <div className="mt-2 p-1 border border-dashed border-red-500 text-[14px] text-red-700">
        <span className="font-bold">سبب الإلغاء:</span> {order.rejectionReason}
      </div>
    )}

    {/* Shipping Address */}
    <div className="mt-4 border border-black p-2 text-[14px] leading-tight">
      <p className="font-bold underline mb-1 text-center">عنوان التوصيل</p>
      <p>{order.address.city}، {order.address.region}</p>
      <p>شارع {order.address.street} - عمارة {order.address.building}</p>
    </div>

    {/* Footer */}
<div className="mt-6 text-center border-t border-black pt-3">
  <p className="text-sm font-bold text-black mb-3">شكراً لتعاملكم مع شركة ابو الدهب</p>

  {/* الحاوية السفلية: بدون ظلال، أبيض وأسود صريح، ومحاذاة منسقة */}
  <div className="bg-white border border-black p-3 text-right space-y-2.5 text-xs text-black shadow-none">
    
    {about?.phones && about.phones.length > 0 && (
      <div>
        <h3 className="font-bold text-black mb-1"> أرقام التواصل:</h3>
        <div className="flex gap-2 flex-wrap">
          {about.phones.map((phone, index) => (
            <span 
              key={index} 
              className=" px-2 py-0.5 font- font-bold bg-white text-black"
            >
              {phone}
            </span>
          ))}
        </div>
      </div>
    )}

    {about?.address && (
      <div className="border-t border-black pt-2">
        <span className="font-bold text-black"> المركز الرئيسي: </span>
        <span className="text-black">{about.address}</span>
      </div>
    )}

    {about?.workingHours && (
      <div className="border-t border-black pt-2">
        <span className="font-bold text-black"> مواعيد العمل الرسمية: </span>
        <span className="text-black">{about.workingHours}</span>
      </div>
    )}
    
  </div>
</div>
  </div>

  {/* زر الطباعة */}
  <button 
    onClick={() => window.print()} 
    className="no-print mt-6 bg-blue-900 text-white font-bold py-3 px-10 rounded-lg shadow-xl hover:bg-blue-800 transition-all"
  >
    اطبع الفاتورة 
  </button>
{/* الستايل السحري للطباعة */}
  { userToken.role=="customer" &&   <style>{`
        @media print {
          @page {
            size: 80mm auto;
            margin: auto;
         
          }
          body {
            margin: 0;
            padding: 0;
            background: #fff;
          }
          .no-print {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          #invoice-print-area, #invoice-print-area * {
            visibility: visible;
          }
          #invoice-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 80mm !important;
            padding: 5mm !important;
            border: none !important;
          }
          table {
            width: 100% !important;
          }
        }
      `}</style>}

        { userToken.role!="customer" &&   <style>{`
        @media print {

          body {
            margin: 0;
            padding: 0;
            background: #fff;
          }
          .no-print {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          #invoice-print-area, #invoice-print-area * {
            visibility: visible;
          }
          #invoice-print-area {
            position: absolute;
            left: 0;
            top: 0;
            
            padding: 5mm !important;
            border: none !important;
          }
          table {
            width: 100% !important;
          }
        }
      `}</style>}
</div>
  );
};

export default OrderInvoice;