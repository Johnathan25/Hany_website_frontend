import { useEffect } from "react";

export default function OfflinePage() {
    useEffect(() => {
        document.title = "فقد الأتصال بالإنترنت -ابو الدهب";
    }
    , []);

  return (
  <>
  

      <div className="min-h-screen w-full flex flex-col items-center justify-between bg-gradient-to-b from-[#f0f7ff] via-[#e6f2ff] to-[#3b82f6] text-center px-4 relative overflow-hidden select-none">

        <div className="pt-20"></div>

  
        <div className="z-10 max-w-md mx-auto flex flex-col items-center">
          

          <div className="relative flex items-center justify-center w-32 h-32 mb-6 rounded-full border border-blue-100/50 bg-gradient-to-b from-white/40 to-transparent">
            <div className="absolute w-24 h-24 rounded-full border border-blue-200/40"></div>
            
          
            <div className="relative text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-16 h-16">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.284 16.284A3 3 0 0 1 12 15c.412 0 .81.083 1.173.233M6.16 14.16a6 6 0 0 1 8.528 0M3.61 11.61A10 10 0 0 1 12 8.5c2.47 0 4.735.894 6.486 2.378M12 18h.008v.008H12V18Z" />
              </svg>

              <div className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-0.5 border-2 border-[#f0f7ff]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          {/* النصوص الرسمية */}
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            عذراً، لا يوجد اتصال بالإنترنت
          </h1>
          
          <p className="text-slate-600 text-sm mb-8 leading-relaxed">
            يرجى التحقق من إعدادات الشبكة الخاصة بك والمحاولة مرة أخرى للوصول إلى الموقع.
          </p>


          <button 
            onClick={() => window.location="/"} 
            className="flex items-center gap-2 bg-[#2196f3] hover:bg-[#1976d2] text-white font-medium py-2.5 px-6 rounded-lg shadow-md transition-all duration-200 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 animate-spin-slow">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Try Again
          </button>
        </div>

        <div className="w-full relative h-32 opacity-80 pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/20 to-transparent rounded-[100%_10%_0_0] scale-110 translate-y-4"></div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/30 to-transparent rounded-[10%_8%_0_0] scale-105"></div>
        </div>
        
      </div>
    </>
  );
}