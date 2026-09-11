import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "كيف يمكنني تقديم طلب؟",
      answer: "تختلف مواعيد التوصيل حسب موقعك. الشحن العادي يستغرق عادةً من يومين لثلاثة."
    },
    {
      question: "هل تقدمون خدمة الشحن الدولي؟",
      answer: "حالياً نقوم بالتوصيل داخل ( القاهرة , الجيزة السادس من اكتوبر و القليوبية )  فقط لضمان وصول المنتجات طازجة وبأعلى جودة."
    },
    {
      question: "ما هي طرق الدفع المقبولة؟",
      answer: "نقبل الدفع عند الاستلام، و أيضاً المحافظ الإلكترونية المتوفرة."
    },
    {
      question: "ما هي سياسة الإرجاع الخاصة بكم؟",
      answer: "يمكنك إرجاع أي منتج غير مطابق للمواصفات أو تالف فور الاستلام مع مندوبنا."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className=" mx-auto my-10 px-4 py-12 font-cairo" dir="rtl">
      <h2  data-aos="fade-down"  className="text-4xl font-black text-gray-800 mb-8 text-center">الأسئلة <span className='text-5xl text-[#0284c7] '>الشائعة</span></h2>
                <div className="w-20 h-1.5 bg-[#0284c7] mx-auto rounded-full mb-16"></div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border  border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all bg-white hover:border-sky-100"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-5 text-right transition-colors hover:bg-sky-50/50"
            >
              <span className={`text-lg font-bold ${openIndex === index ? 'text-sky-600' : 'text-gray-700'}`}>
                {faq.question}
              </span>
              <ChevronDown 
                className={`w-6  cursor-pointer h-6 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-sky-600' : ''}`} 
              />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40' : 'max-h-0'}`}
            >
              <div className="p-5 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;