import React, { useState, useEffect } from "react";
import { 
  FaStore, FaWallet, FaSave, FaPlus, FaTrash, 
  FaClock, FaEnvelope, FaGlobe, FaEdit, 
  FaInfoCircle, FaFacebook, FaInstagram, FaWhatsapp, FaLink, FaTag
} from "react-icons/fa";
import api from "../../../services/api";
import { showAlert } from "../../../services/alert";

export default function SettingsAdmin() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    storeName: "",
    about: "",
    heroText: "",
    socialMedia: { facebook: "", instagram: "", whatsapp: "" },
    links: { googleDrive: "", googlePlay: "" },
    allowedDistance: 70,
    shippingAddress: [],
    pricePerKm:4,
    address: "",
    email: "",
    workingHours: "",
    walletNumber: [],
    brands: [], 
    phones: [],
  });
  const [phoneErrors, setPhoneErrors] = useState([]);

  const validatePhone = (phone) => {
    const egyptPhoneRegex = /^01[0125][0-9]{8}$/;
    return egyptPhoneRegex.test(phone);
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get("/about/");
      if (res.data.data && res.data.data[0]) {
        // تأكيد وجود الكائنات الفرعية لتجنب الأخطاء البرمجية واختفاء الحقول
        const fetchedData = res.data.data[0];
        setData({
          ...fetchedData,
          socialMedia: fetchedData.socialMedia || { facebook: "", instagram: "", whatsapp: "" },
          links: fetchedData.links || { googleDrive: "", googlePlay: "" },
          walletNumber: fetchedData.walletNumber || [],
          brands: fetchedData.brands || [],
          phones: fetchedData.phones || [],
          allowedDistance: fetchedData.allowedDistance || 70,
            pricePerKm: fetchedData.pricePerKm || 4,
          shippingAddress: fetchedData.shippingAddress ||  ["القاهرة", "الجيزة", "القليوبية", "السادس من اكتوبر"],
        });
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleUpdate = async () => {
    // التحقق من صحة أرقام الهواتف العادية المضافة
    const errors = data.phones.map(phone =>
      validatePhone(phone) ? "" : "رقم غير صحيح"
    );
    setPhoneErrors(errors);

    const hasError = errors.some(err => err !== "");
    if (hasError) {
      return showAlert({
        title: "تأكد من صحة أرقام الهاتف المضافة في قسم التواصل",
        icon: "warning"
      });
    }

    try {
      setLoading(true);
      await api.put("/about/", data);
      showAlert({ title: "تم حفظ كل التغييرات بنجاح", icon: "success" });
      fetchSettings(); // إعادة جلب البيانات للتأكيد
    } catch (err) {
      showAlert({ title: "حدث خطأ أثناء التحديث", icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-right bg-slate-50/50 pb-20" dir="rtl">
      {/* Header الثابت */}
      <div className="bg-white/80 backdrop-blur-lg sticky top-0 z-30 border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">إعدادات المنصة</h1>
            <p className="text-slate-500 text-xs mt-1">تخصيص الهوية البصرية، الروابط، والمحافظ المالي و الطلبات ة من مكان واحد</p>
          </div>
          
          <button 
            onClick={handleUpdate}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-black text-white px-8 py-3 rounded-xl transition-all shadow-md shadow-blue-900/10 active:scale-95 disabled:opacity-50 font-bold"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaSave className="text-base" />}
            <span className="text-sm">حفظ كل التغييرات الحاليّة</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* القائمة الجانبية (Tabs) */}
          <div className="lg:col-span-3 space-y-2">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-4">الأقسام الإدارية</h3>
            <NavButton active={activeTab === "general"} onClick={() => setActiveTab("general")} icon={<FaStore />} label="الهوية الأساسية" />
            <NavButton active={activeTab === "social"} onClick={() => setActiveTab("social")} icon={<FaGlobe />} label="التواصل والروابط" />
            <NavButton active={activeTab === "brands"} onClick={() => setActiveTab("brands")} icon={<FaTag />} label="العلامات التجارية" />
            <NavButton active={activeTab === "wallets"} onClick={() => setActiveTab("wallets")} icon={<FaWallet />} label="البيانات والمحافظ المالية" />
            <NavButton active={activeTab === "orders"} onClick={() => setActiveTab("orders")} icon={<FaClock />} label="إدارة الطلبات" />
          </div>

          {/* محتوى القسم النشط */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl border border-slate-200/70 p-6 md:p-10 shadow-sm relative overflow-hidden">
              <div className="relative z-10">
                {activeTab === "general" && <GeneralSection data={data} setData={setData} />}
                {activeTab === "social" && <SocialSection data={data} setData={setData} validatePhone={validatePhone} phoneErrors={phoneErrors} setPhoneErrors={setPhoneErrors} />}
                {activeTab === "brands" && <BrandsSection data={data} setData={setData} />}
                {activeTab === "wallets" && <WalletSection data={data} setData={setData} validateWallet={validatePhone} />}
                {activeTab === "orders" && <OrderSection data={data} setData={setData} />} {/* تم تعديل هذا السطر ليتوافق مع اسم الدالة الجديد */}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* تنسيقات الـ CSS المحسنة */}
      <style>{`
        .modern-input {
          width: 100%;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 14px;
          color: #334155;
          transition: all 0.2s ease-in-out;
          outline: none;
        }
        .modern-input:focus {
          background-color: #fff;
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
        .animate-fade {
          animation: fadeIn 0.35s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// الكيانات المساعدة الواجهة (Sub-Components)
const NavButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 ${
      active 
      ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100 font-bold" 
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
    }`}
  >
    <span className={`text-xl ${active ? "text-blue-600" : "text-slate-400"}`}>{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const Field = ({ label, children, icon }) => (
  <div className="flex flex-col gap-2">
    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mr-1">
      <span className="text-slate-400 text-sm">{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

// 1. قسم الهوية الأساسية
function GeneralSection({ data, setData }) {
  return (
    <div className="animate-fade space-y-8">
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-black text-slate-800">الهوية الأساسية</h2>
        <p className="text-slate-400 text-xs mt-1">تحكم في الكلمات الافتتاحية واسم علامتك التجارية الموجهة للعملاء</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="اسم المتجر" icon={<FaStore className="text-blue-500" />}>
          <input className="modern-input" value={data.storeName} onChange={(e) => setData({...data, storeName: e.target.value})} />
        </Field>
        <Field label="النص الترويجي (Hero Text)" icon={<FaEdit className="text-purple-500" />}>
          <input className="modern-input" value={data.heroText} onChange={(e) => setData({...data, heroText: e.target.value})} />
        </Field>
      </div>
      <Field label="نبذة تعريفية عن المتجر" icon={<FaInfoCircle className="text-amber-500" />}>
        <textarea rows="4" className="modern-input resize-none" value={data.about} onChange={(e) => setData({...data, about: e.target.value})} />
      </Field>
    </div>
  );
}

// 2. قسم التواصل والروابط الرقمية (تم إضافة الروابط هنا بشكل أوضح)
function SocialSection({ data, setData, validatePhone, phoneErrors, setPhoneErrors }) {
  
  const handleAddPhoneField = () => {
    setData({ ...data, phones: [...data.phones, ""] });
  };

  const handleRemovePhoneField = (indexToRemove) => {
    const updatedPhones = data.phones.filter((_, idx) => idx !== indexToRemove);
    setData({ ...data, phones: updatedPhones });
    const updatedErrors = phoneErrors.filter((_, idx) => idx !== indexToRemove);
    setPhoneErrors(updatedErrors);
  };

  return (
    <div className="animate-fade space-y-8">
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-black text-slate-800">قنوات الاتصال والروابط الخارجية</h2>
        <p className="text-slate-400 text-xs mt-1">إدارة حسابات التواصل الاجتماعي وروابط تحميل تطبيقاتك الذكية</p>
      </div>

      {/* روابط التطبيقات والملفات */}
      <h3 className="text-xs font-bold text-blue-600 bg-blue-50/60 px-3 py-1.5 rounded-md inline-block">روابط التحميل والملفات</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="رابط جوجل درايف (Google Drive)" icon={<FaLink className="text-amber-600" />}>
          <input 
            placeholder="https://drive.google.com/..." 
            className="modern-input" 
            value={data.links?.googleDrive || ""} 
            onChange={(e) => setData({...data, links: {...data.links, googleDrive: e.target.value}})} 
          />
        </Field>
        <Field label="رابط متجر جوجل (Google Play)" icon={<FaLink className="text-green-600" />}>
          <input 
            placeholder="https://play.google.com/store/..." 
            className="modern-input" 
            value={data.links?.googlePlay || ""} 
            onChange={(e) => setData({...data, links: {...data.links, googlePlay: e.target.value}})} 
          />
        </Field>
      </div>

      <hr className="border-slate-100" />

      {/* حسابات السوشيال ميديا */}
      <h3 className="text-xs font-bold text-slate-500 block">منصات التواصل الاجتماعي والمعلومات العامة</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="حساب فيسبوك" icon={<FaFacebook className="text-[#1877F2]" />}>
          <input placeholder="رابط الحساب" className="modern-input" value={data.socialMedia?.facebook} onChange={(e) => setData({...data, socialMedia: {...data.socialMedia, facebook: e.target.value}})} />
        </Field>
        <Field label="حساب إنستغرام" icon={<FaInstagram className="text-[#E1306C]" />}>
          <input placeholder="رابط الحساب" className="modern-input" value={data.socialMedia?.instagram} onChange={(e) => setData({...data, socialMedia: {...data.socialMedia, instagram: e.target.value}})} />
        </Field>
        <Field label="رقم واتساب" icon={<FaWhatsapp className="text-[#25D366]" />}>
          <input maxLength={11} placeholder="مثال: 010XXXXXXXX" className="modern-input" value={data.socialMedia?.whatsapp} onChange={(e) => setData({...data, socialMedia: {...data.socialMedia, whatsapp: e.target.value}})} />
        </Field>
        <Field label="البريد الإلكتروني للمتجر" icon={<FaEnvelope className="text-red-400" />}>
          <input placeholder="mail@store.com" className="modern-input" value={data.email} onChange={(e) => setData({...data, email: e.target.value})} />
        </Field>
        <Field label="مواعيد وساعات العمل" icon={<FaClock className="text-cyan-500" />}>
          <input placeholder="يومياً من 9 صباحاً إلى 10 مساءً" className="modern-input" value={data.workingHours} onChange={(e) => setData({...data, workingHours: e.target.value})} />
        </Field>
        <Field label="العنوان أو الموقع الجغرافي" icon={<FaGlobe className="text-emerald-500" />}>
          <input placeholder="القاهرة، مصر" className="modern-input" value={data.address} onChange={(e) => setData({...data, address: e.target.value})} />
        </Field>
      </div>

      {/* أرقام الهواتف التفاعلية */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs font-bold text-slate-700">أرقام هواتف استقبال اتصالات العملاء</label>
          <button 
            type="button"
            onClick={handleAddPhoneField} 
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            + إضافة رقم هاتف
          </button>
        </div>
        
        <div className="space-y-3">
          {data.phones?.map((phone, index) => (
            <div key={index} className="flex gap-2 items-center animate-fade">
              <div className="flex-1">
                <input
                  maxLength={11}
                  placeholder="01XXXXXXXXX"
                  className={`modern-input bg-white ${phoneErrors[index] ? "border-red-500" : ""}`}
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, "");
                    const updatedPhones = [...data.phones];
                    updatedPhones[index] = value;
                    setData({ ...data, phones: updatedPhones });

                    const errors = [...phoneErrors];
                    errors[index] = !validatePhone(value) && value !== "" ? "رقم غير صحيح" : "";
                    setPhoneErrors(errors);
                  }}
                />
                {phoneErrors[index] && <p className="text-red-500 text-[11px] mt-1 mr-1">{phoneErrors[index]}</p>}
              </div>
              <button 
                onClick={() => handleRemovePhoneField(index)}
                className="bg-red-50 hover:bg-red-100 text-red-600 p-3 rounded-xl transition"
                title="حذف الرقم"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
          {data.phones?.length === 0 && <p className="text-center text-xs text-slate-400 py-2">لا توجد أرقام اتصال مضافة حالياً.</p>}
        </div>
      </div>
    </div>
  );
}

// 3. قسم العلامات التجارية
function BrandsSection({ data, setData }) {
  const [newBrand, setNewBrand] = useState({ name: "", desc: "" });

  const addBrand = () => {
    if (!newBrand.name) return showAlert({ title: "يجب إدخال اسم البراند أولاً", icon: "warning" });
    const brandWithId = { ...newBrand, id: Date.now() };
    setData({ ...data, brands: [...data.brands, brandWithId] });
    setNewBrand({ name: "", desc: "" });
  };

  const removeBrand = (id) => {
    const filtered = data.brands.filter(b => b.id !== id && b._id !== id);
    setData({ ...data, brands: filtered });
  };

  return (
    <div className="animate-fade space-y-8">
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-black text-slate-800">العامات التجارية والشركاء</h2>
        <p className="text-slate-400 text-xs mt-1">أضف العلامات والماركات المتوفرة في متجرك لرفع مصداقية المنصة</p>
      </div>

      <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="اسم العلامة التجارية" icon={<FaTag className="text-blue-500" />}>
            <input placeholder="مثال: أطياب" className="modern-input bg-white" value={newBrand.name} onChange={(e) => setNewBrand({...newBrand, name: e.target.value})} />
          </Field>
          <Field label="وصف موجز للماركة" icon={<FaInfoCircle className="text-slate-400" />}>
            <input placeholder="مثال: أجود منتجات اللحوم والدواجن المجمدة" className="modern-input bg-white" value={newBrand.desc} onChange={(e) => setNewBrand({...newBrand, desc: e.target.value})} />
          </Field>
        </div>
        <button 
          onClick={addBrand}
          className="w-full bg-slate-800 text-white h-[46px] rounded-xl hover:bg-black transition-all font-bold text-xs flex items-center justify-center gap-2"
        >
          <FaPlus /> إدراج في القائمة المؤقتة
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {data.brands?.map((brand) => (
          <div key={brand.id || brand._id} className="flex justify-between items-center p-4 bg-slate-50/40 border border-slate-200/70 rounded-xl group transition hover:border-blue-300">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-black text-sm">
                {brand.name ? brand.name.charAt(0) : "B"}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-700">{brand.name}</h4>
                <p className="text-xs text-slate-400">{brand.desc}</p>
              </div>
            </div>
            <button onClick={() => removeBrand(brand.id || brand._id)} className="text-slate-300 hover:text-red-500 p-2 transition">
              <FaTrash size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. قسم الإدارة المالية (تم تعديله ليصبح الحفظ موحداً ومريحاً)
function WalletSection({ data, setData, validateWallet }) {
  const [inputWallet, setInputWallet] = useState("");
  const [walletError, setWalletError] = useState("");

  const handlePushWalletToList = () => {
    if (!validateWallet(inputWallet)) {
      setWalletError("رقم محفظة غير صحيح");
      return;
    }
    if (data.walletNumber.includes(inputWallet)) {
      setWalletError("هذا الرقم مضاف بالفعل مسبقاً");
      return;
    }

    // يتم التحديث محلياً فقط دون إرسال طلب مستقل للخلفية
    setData({
      ...data,
      walletNumber: [...data.walletNumber, inputWallet]
    });
    setInputWallet("");
    setWalletError("");
  };

  const handleRemoveWalletFromList = (numToRemove) => {
    setData({
      ...data,
      walletNumber: data.walletNumber.filter(num => num !== numToRemove)
    });
  };

  return (
    <div className="animate-fade space-y-8">
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-black text-slate-800">البيانات والمحافظ المالية</h2>
        <p className="text-slate-400 text-xs mt-1">أضف أرقام كاش (فودافون، اتصالات، أورانج، وي) المعتمدة لاستقبال الدفع</p>
      </div>

      <div className="bg-blue-50/40 p-5 rounded-xl border border-blue-100 flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <Field label="اكتب رقم المحفظة الإلكترونية الجديد" icon={<FaPlus className="text-blue-600" />}>
            <input
              maxLength={11}
              placeholder="مثال: 01012345678"
              className={`modern-input bg-white ${walletError ? "border-red-500" : ""}`}
              value={inputWallet}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setInputWallet(value);
                if (value !== "" && !validateWallet(value)) {
                  setWalletError("رقم محفظة غير صحيح (يجب أن يبدأ بـ 010، 011، 012، 015 ويتكون من 11 رقم)");
                } else {
                  setWalletError("");
                }
              }}
            />
            {walletError && <p className="text-red-500 text-xs mt-1 mr-1">{walletError}</p>}
          </Field>
        </div>
        <button
          type="button"
          onClick={handlePushWalletToList}
          disabled={!inputWallet || walletError}
          className="bg-blue-600 text-white h-[48px] px-6 rounded-xl hover:bg-blue-700 transition active:scale-95 font-bold text-xs whitespace-nowrap disabled:opacity-50"
        >
          إدراج الرقم بالقائمة
        </button>
      </div>

      {/* عرض الأرقام المدرجة حالياً مع إمكانية الحذف الفوري قبل الحفظ الكلي */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-500 mr-1">المحافظ الجاهزة للحفظ والعمل:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.walletNumber?.map((num, i) => (
            <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 transition animate-fade">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <FaWallet size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400">محفظة دفع نشطة</p>
                  <span className="font-mono font-bold text-sm text-slate-700">{num}</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => handleRemoveWalletFromList(num)} 
                className="text-slate-300 hover:text-red-500 p-2 transition"
                title="حذف الرقم"
              >
                <FaTrash size={13} />
              </button>
            </div>
          ))}
        </div>
        
        {data.walletNumber?.length === 0 && (
          <p className="text-center text-xs text-slate-400 py-6 border border-dashed border-slate-200 rounded-xl">
            لا توجد محافظ مضافة، يرجى كتابة رقم وإدراجه ثم الضغط على "حفظ كل التغييرات الحاليّة" بالأعلى.
          </p>
        )}
      </div>
    </div>
  );
}

function OrderSection({ data, setData }) {
  const [newCity, setNewCity] = useState("");
  const [allowedDistance, setAllowedDistance] = useState(data.allowedDistance || 70);
  const [pricePerKm ,SetPricePerKm]=useState(data.pricePerKm || 4);

  const handleAlowedDistanceChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= 500)) {
      setAllowedDistance(value);
      setData({ ...data, allowedDistance: value });
    }
  };

  const handlePricePerKm=(e)=>{
        const value = e.target.value;
    if (value === "" || (Number(value) >= 1 && Number(value) <= 500)) {
      SetPricePerKm(value);
      setData({ ...data, pricePerKm: value });
    }
  };
  

 

  const handlePushWalletToList = () => {


    setData({
      ...data,
      shippingAddress: [...data.shippingAddress, newCity]
    });
  
  };

  const handleRemoveWalletFromList = (numToRemove) => {
    setData({
      ...data,
      shippingAddress: data.shippingAddress.filter(num => num !== numToRemove)
    });
  };

  return (
    <div className="animate-fade space-y-8"> 
      <div className="border-b border-slate-100 pb-5">
        <h2 className="text-xl font-black text-slate-800">   الطلبات واماكن الشحن</h2>
        <p className="text-slate-400 text-xs mt-1">أضف المدن المتاحة للتوصيل لتظهر تلقائياً في صفحة إنشاء الطلبات</p>
      </div>
      <div className="bg-blue-50/40 p-5 rounded-xl border border-blue-100 grid grid-cols-1 gap-4 items-end">

        <div className="flex-1 w-full">
          <Field label="اكتب اسم المدينة الجديدة" icon={<FaPlus className="text-blue-600" />}>
            <input
              placeholder="مثال: القاهرة"
              className={`modern-input bg-white `}
              value={newCity}
              onChange={(e) => {
                const value = e.target.value;
                setNewCity(value);
              }}
            />
          </Field>
        </div>
        <button
          type="button"
          onClick={handlePushWalletToList}
          disabled={!newCity}
          className="bg-blue-600 text-white h-[48px] px-6 rounded-xl hover:bg-blue-700 transition active:scale-95 font-bold text-xs whitespace-nowrap disabled:opacity-50"
        >
          إدراج المدينة بالقائمة
        </button>

        {/* handle remove  */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-500 mr-1">مدن التوصيل الجاهزة للحفظ والعمل:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.shippingAddress?.map((city, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-blue-300 transition animate-fade">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <FaGlobe size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400">مدينة توصيل نشطة</p>
                    <span className="font-mono font-bold text-sm text-slate-700">{city}</span>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => handleRemoveWalletFromList(city)}
                  className="text-slate-300 hover:text-red-500 p-2 transition"
                  title="حذف المدينة"
                >
                  <FaTrash size={13} />
                </button>
              </div>
            ))}
          </div>
          {data.shippingAddress?.length === 0 && (
            <p className="text-center text-xs text-slate-400 py-6 border border-dashed border-slate-200 rounded-xl">
              لا توجد مدن مضافة، يرجى كتابة اسم مدينة وإدراجها ثم الضغط على "حفظ كل التغييرات الحاليّة" بالأعلى.
            </p>
          )}
          




      </div>

      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60">
          
        <div className="flex justify-between items-center mb-4">
          <label className=" ml-5 text-xs font-bold text-slate-700">الحد الأقصى المسموح به للمسافة بين المتجر وعنوان العميل (كم)</label>
          <input

            type="number"
            min={1}
            
            value={allowedDistance}
            onChange={(e) => handleAlowedDistanceChange(e)}
            className="modern-input w-24 text-center"
          />
          <span className=" mr-5 text-xs font-bold text-slate-700">   (كم)</span>
        </div>
        <p p className="text-xs text-slate-400">تأكد من أن المسافة المحددة كافية لتغطية المناطق التي تخدمه.</p>

        </div>
         


    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60">
          
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs ml-5 font-bold text-slate-700">سعر الكيلو متر للشحن (جنيه/كم) </label>
          <input

            type="number"
            min={1}
            
            value={pricePerKm}
            onChange={(e) => handlePricePerKm(e)}
            className="modern-input w-24 text-center"
          />
                    <span className=" mr-5 text-xs font-bold text-slate-700"> (جنية/متر)</span>
        </div>
        <p p className="text-xs text-slate-400">طريقه الحساب السعر 20ج ثابته + الكيلو مترفي السعر الي يتم تحديده</p>

        </div>


    </div>
    </div>
  );
}

