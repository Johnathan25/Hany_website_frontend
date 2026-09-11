import React from 'react';

const steps = [
  {
    id: '01',
    title: 'تسوّق ذكي',
    description: 'اختر منتجاتك المفضلة بضغطة واحدة من مجموعتنا المختارة.',
    align: 'right',
  },
  {
    id: '02',
    title: 'دفع آمن',
    description: 'أتمم طلبيتك بأمان عبر خيارات دفع متعددة وسريعة.',
    align: 'left',
  },
  {
    id: '03',
    title: 'توصيل فائق',
    description: 'استلم شحنتك عند باب منزلك في أسرع وقت ممكن.',
    align: 'right',
  },
];

const HowItWorks = () => {
  return (
    <div className="w-full py-20 bg-white mx-auto " dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
       
        <div
          data-aos="zoom-in"
        className="text-center mb-20">
          <h2 className="text-4xl font-black text-gray-900 mb-4">كيف نبدأ؟</h2>
          <div className="w-20 h-1.5 bg-[#0284c7] mx-auto rounded-full"></div>
        </div>

        <div className="relative">
          
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px border-l-2 border-dashed border-[#0284c7]/30 hidden md:block"></div>

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex flex-col md:flex-row items-center w-full">
             
                <div className="flex-1 w-full md:w-1/2 flex justify-end">
                  {step.align === 'right' && (
                    <div
                     data-aos={step.align === 'right' ? 'fade-left' : 'fade-right'}
                    className="md:pl-16 text-right group">
                      <div className="inline-block px-4 py-1 rounded-full bg-[#0284c7]/10 text-[#0284c7] text-sm font-bold mb-3 transition-colors group-hover:bg-[#0284c7] group-hover:text-white">
                        الخطوة {step.id}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-500 leading-relaxed max-w-xs">{step.description}</p>
                    </div>
                  )}
                </div>

                {/* الدائرة المركزية (النقطة) */}
                <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10">
                  <div 
                       data-aos="zoom-in"                 
                  className="w-10 h-10 rounded-full bg-white border-4 border-[#0284c7] shadow-xl flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#0284c7] animate-pulse"></div>
                  </div>
                </div>

         
                <div  className="flex-1 w-full md:w-1/2 flex justify-start mt-8 md:mt-0">
                  {step.align === 'left' && (
                    <div
                                         data-aos={step.align === 'right' ? 'fade-left' : 'fade-right'}
                    className="md:pr-16 text-right md:text-right group w-full">
                      <div className="inline-block px-4 py-1 rounded-full bg-[#0284c7]/10 text-[#0284c7] text-sm font-bold mb-3 transition-colors group-hover:bg-[#0284c7] group-hover:text-white">
                         الخطوة {step.id}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-500 leading-relaxed  md:mr-auto">{step.description}</p>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;