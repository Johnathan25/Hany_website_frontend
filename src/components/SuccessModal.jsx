import React from 'react';
import { CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function SuccessModal({ 
  isOpen = true, 
  onClose, 
  title, 
  message, 
  actionText,
  onAction 
}) {
  const { isAr } = useLanguage();
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center shadow-2xl border border-slate-100 transform transition-all animate-in zoom-in-95 duration-200">
        
        {/* أيقونة الصح مع تأثير النبض المتناسق */}
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="h-10 w-10 animate-in zoom-in spin-in-12 duration-300" />
        </div>

        {/* العنوان */}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2 font-serif">
          {title || (isAr ? 'تمت العملية بنجاح!' : 'Operation Successful!')}
        </h3>

        {/* النص التفصيلي */}
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          {message || (isAr 
            ? 'تم حفظ وتأكيد بيانات طلبك بنجاح، وسيقوم فريقنا بمتابعة الإجراءات فوراً.' 
            : 'Your request has been successfully processed and recorded.')}
        </p>

        {/* أزرار التفاعل */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={onAction || onClose}
            className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-blue-500/25 transition-all"
          >
            <span>{actionText || (isAr ? 'حسناً، متابعة' : 'Continue')}</span>
            <Arrow className="w-4 h-4" />
          </button>

          {onClose && onAction && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}