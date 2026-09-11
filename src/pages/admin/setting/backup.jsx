import React, { useEffect, useState } from 'react';


import { 
  Cloud, 
  RefreshCcw, 
  ShieldCheck, 
  Settings, 
  Database, 
  Lock, 
  CheckCircle2, 
  Loader2,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { isLastBackupValid } from '../../../services/lastBackupNotification';
import api from '../../../services/api';
import { showAlert } from '../../../services/alert';

const BackupSettings = () => {
  const [loading, setLoading] = useState(false);
  const [lastBackup, setLastBackup] = useState(new Date().toLocaleString("ar-EG") || null);
   const [lastBackupManual, setLastBackupManual] = useState(localStorage.getItem("lastBackup") ||(new Date().toLocaleString("ar-EG")));
   const [ isLastBackup , setIsLastBackup]=useState(true)
  const [loadingMan, setLoadingMan] = useState(false);
   const [googleAccount,setGoogleAccount]=useState({
    email:"",
    name:"",
    picture:""
   });
const handleGoogleAuth = () => {
const token = localStorage.getItem("token");
  const url = `https://e-commerce-eight-pi-39.vercel.app/v1/auth/google?token=${token}`;
  
  const popup = window.open(
    url,
    "_blank",
    "width=500,height=600"
  );

  if (!popup) {
    alert("Allow popups to continue Google login");
  }
};


const handleManualBackup = async () => {

  setLoadingMan(true);

  try {

    const response = await api.get('/backupManual');

    if (response.data.success) {

      // تحويل الداتا لملف JSON
      const dataStr = JSON.stringify(
        response.data.data,
        null,
        2
      );

      const blob = new Blob(
        [dataStr],
        { type: "application/json" }
      );

      // إنشاء لينك تحميل
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `backup-${Date.now()}.json`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);


      localStorage.setItem("lastBackup",new Date().toLocaleString("ar-EG"))


      setLastBackupManual(localStorage.getItem("lastBackup"));
      showAlert({
        title: "تم تنزيل النسخة الاحتياطية",
        text: "تم حفظ الملف على جهازك",
        icon: "success"
      });

    }

  } catch (error) {

    console.error(error);

    showAlert({
      title: "فشل النسخ الاحتياطي",
      text: "حدث خطأ أثناء التحميل",
      icon: "error"
    });

  } finally {

    setLoadingMan(false);

  }

};



const handleGoogleDriveBackup = async () => {
  setLoading(true); 
  
  try {
   
    const response = await api.get('/backup');

    if (response.data.success) {

      showAlert({
        title: "تم النسخ الاحتياطي!",
        text: "تم تحديث ملف البيانات بنجاح على Google Drive",
        icon: "success"
      });
      

    } else {
      throw new Error(response.data.error || "حدث خطأ غير متوقع");
    }

  } catch (err) {
    console.error("Backup Error:", err);
    

    showAlert({
      title: "فشل النسخ السحابي",
      text: err.response?.data?.error || "تأكد من ربط حساب جوجل أولاً ومن اتصال الإنترنت",
      icon: "error"
    });
  } finally {
    setLoading(false); 
  }
};

const lastUpdate=async()=>{
  try{
      const response = await api.get('/lastUpdate');

      setLastBackup(new Date(response.data.updatedAt).toLocaleString("ar-EG"))


  }catch(err){
 console.error("Backup Error:", err);
  }
}

const backupLocation=async()=>{
     try{
      const response = await api.get('/google-account');

      setGoogleAccount({
        email:response.data.email,
        name:response.data.name,
        picture:response.data.picture,

      })


  }catch(err){
 console.error("Backup Error:", err);
  }
}

const MakeSureIsLastBackup=async()=>{
  const res=  await isLastBackupValid();
  setIsLastBackup(res);

}
useEffect(()=>{
  lastUpdate();
  MakeSureIsLastBackup();
  backupLocation();

  
},[loading])

return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-right" dir="rtl">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="p-4 bg-slate-900 rounded-xl text-white shadow-md shadow-slate-950/20">
          <Settings className="w-8 h-8 animate-spin-slow" />
        </div>
        <div>
          <h1 className="text-xl md:text-xl font-black text-slate-900 tracking-tight">إعدادات النسخ الاحتياطي</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">تأمين بيانات نظام شركه أبو الذهب وسجلات العمال والمبيعات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Control Card */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Status Card */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-sky-50 rounded-xl text-[#0284c7]">
                  <Database size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900">حالة قاعدة البيانات الحالية</h3>
              </div>
              <span className={`flex items-center gap-1.5 font-extrabold text-xs px-4 py-2 rounded-full border transition-all ${
                isLastBackup 
                  ? "text-sky-700 bg-sky-50 border-sky-100" 
                  : "text-amber-700 bg-amber-50 border-amber-100 animate-pulse"
              }`}>
                <ShieldCheck size={16} /> 
                {isLastBackup ? "النظام مؤمن بالكامل" : "يرجى ربط الحساب لتأمين النظام"}
              </span>
            </div>

            {/* Information Grid */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-slate-50 rounded-xl border border-slate-200 gap-2">
                <span className="text-slate-700 font-bold text-sm">آخر نسخة احتياطية ناجحة على السحابة (Cloud):</span>
                <span className="text-[#0284c7] font-black tabular-nums bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs text-left" dir="ltr">
                  {lastBackup || "لا يوجد"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-slate-50 rounded-xl border border-slate-200 gap-2">
                <span className="text-slate-700 font-bold text-sm">آخر نسخة احتياطية ناجحة على الجهاز المحلي:</span>
                <span className="text-slate-900 font-black tabular-nums bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-2xs text-left" dir="ltr">
                  {lastBackupManual || "لا يوجد"}
                </span>
              </div>

              {googleAccount?.email && (
                <div className="flex flex-col sm:flex-row justify-between sm:items-center p-4 bg-slate-50 rounded-xl border border-slate-200 gap-2">
                  <span className="text-slate-700 font-bold text-sm">مساحة التخزين السحابية الحالية:</span>
                  <span className="flex items-center gap-2 text-sky-700 font-black text-sm bg-sky-50/50 px-3 py-1 rounded-lg border border-sky-100" dir="ltr">
                    <Cloud size={16} className="text-[#0284c7]" />
                    {googleAccount.email} {googleAccount.name && `(| ${googleAccount.name})`}
                  </span>
                </div>
              )}

              {/* Google Account Profile Glassmorphism Style */}
              {googleAccount?.picture && (
                <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">الحساب النشط حالياً</span>
                    <span className="text-base font-black text-slate-800">Google Drive Account</span>
                    <span className="text-xs text-slate-500 font-medium max-w-xs">{googleAccount.name}</span>
                  </div>
                  <img
                    src={googleAccount.picture}
                    alt="Google Account"
                    className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover ring-2 ring-sky-100"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleManualBackup}
                disabled={loadingMan}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
              >
                {loadingMan ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                بدء النسخ الاحتياطي اليدوي (جهازك)
              </button>

              <button 
                onClick={handleGoogleDriveBackup}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl font-black transition-all shadow-md ${
                  loading 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-[#0284c7] hover:bg-[#026ba3] text-white'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري رفع البيانات للسحابة...
                  </>
                ) : (
                  <>
                    <Cloud className="w-5 h-5" />
                    تحديث النسخة السحابية الآن
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Cards Documentation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Manual Backup Info */}
            <div className="bg-white text-slate-800 p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900">النسخ الاحتياطي اليدوي</h3>
                </div>
                
                <p className="text-slate-600 font-bold text-sm leading-relaxed mb-4">
                  عند الضغط على النسخ اليدوي، يتم استخراج ملف فوري وشامل لكافة جداول النظام بصيغة 
                  <span className="text-[#0284c7] font-black mx-1 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">JSON</span> 
                  ويحفظ مباشرة في تنزيلات جهازك.
                </p>
                
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-xs text-amber-800 font-bold">
                  💡 نصيحة أمان: يُفضل الاحتفاظ بنسخة أسبوعية على وحدة تخزين خارجية (فلاشة) لضمان أعلى درجات الحماية.
                </div>
              </div>
              <Lock className="absolute -left-6 -bottom-6 w-24 h-24 text-slate-50 opacity-40 group-hover:text-slate-100 transition-colors pointer-events-none" />
            </div>

            {/* Cloud Backup Info */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white/10 rounded-xl text-sky-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-black text-white">النسخ التلقائي السحابي</h3>
                  </div>
                  <span className="bg-[#0284c7] text-white font-black text-[10px] px-2 py-1 rounded-md tracking-wider animate-pulse">
                    AUTOMATIC
                  </span>
                </div>

                <p className="text-slate-300 font-bold text-sm leading-relaxed mb-4">
                  النظام مهيأ برمجياً للقيام بجدولة نسخ احتياطي تلقائي يومي مباشر بدون أي تدخل في تمام الساعة:
                  <span className="text-sky-400 font-black mx-1 text-base">09:00 مساءً</span>
                </p>

                <div className="space-y-2.5 bg-black/30 p-3.5 rounded-xl border border-white/5 text-xs text-slate-300 font-medium">
                  <p>• يتطلب ربط الحساب بـ <span className="text-sky-400 font-bold">Google Drive</span> لتفعيل الميزة.</p>
                  <p dir="ltr" className="text-right">• معرف الملف: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-شركه">backupAbuAlDahabFrozen.json</code></p>
                  <p>• <span className="text-sky-400 font-bold">الذكاء البرمجي:</span> يقوم النظام بتحديث نفس الملف دورياً لتوفير مساحة التخزين السحابية الخاصة بك.</p>
                </div>
              </div>
              <Cloud className="absolute -left-6 -bottom-6 w-24 h-24 text-white/5 group-hover:text-white/10 transition-colors pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Side Panel - Google Connection */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" 
                alt="Google Drive" 
                className="w-10 h-10"
              />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1">صلاحية الوصول للسحابة</h3>
            <p className="text-slate-400 text-xs font-bold mb-6 max-w-xs mx-auto">
              تأمين ربط التطبيق بمساحة التخزين الخاصة بجوجل لرفع وتأمين الملفات.
            </p>
            
            <button 
              onClick={handleGoogleAuth}
              className="w-full bg-white border-2 border-[#0284c7] text-[#0284c7] hover:bg-[#0284c7] hover:text-white p-3.5 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-2xs"
            >
              <ExternalLink size={18} /> ربط أو تجديد صلة Google Drive
            </button>
            
            <p className="mt-4 text-[10px] text-slate-400 font-bold">
              * يتم تشفير الـ Token وحفظه برقم سري بداخل السيرفر لضمان أمان تام وسهولة وصول مجدولة.
            </p>
          </div>

          {/* Warnings & Notices */}
          <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 shadow-2xs">
            <h4 className="text-amber-800 font-black mb-2 flex items-center gap-2 text-sm">
              <AlertTriangle size={18} className="text-amber-600" />
              تنبيه هام جداً لتحديث البيانات
            </h4>
            <p className="text-slate-700 text-xs font-bold leading-relaxed">
              في حالة دخولك لهذه الصفحة وملاحظتك أن تحديث البيانات السحابية متوقف لمدة تزيد عن <span className="text-amber-800 font-black">24 ساعة كاملة</span>، يرجى الضغط فوراً على زر 
              <span 
                onClick={handleGoogleAuth} 
                title='اضغط لتجديد الصلاحية الآن' 
                className='underline font-black text-amber-700 px-1.5 cursor-pointer hover:text-[#0284c7] transition-colors'
              >
                تجديد صلة Google Drive
              </span> 
              لإعادة تنشيط الـ Token المنتهي وتجنب توقف الحفظ التلقائي للشركه.
            </p>
          </div>

          <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 shadow-2xs">
            <h4 className="text-[#0284c7] font-black mb-2 flex items-center gap-2 text-sm">
              <Lock size={16} />
              سياسة أمان البيانات للشركه
            </h4>
            <p className="text-slate-600 text-xs font-bold leading-relaxed">
              يرجى العلم أن هذه البيانات حساسة للغاية وتحتوي على الحسابات والماليات الخاصة  بشركه أبو الذهب؛ حافظ على سرية حساب جوجل المرتبط.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BackupSettings;