import { useContext, useEffect, useState } from "react";
import api from "../../services/api";
import { showAlert } from "../../services/alert";
import { 
  User, Package, MapPin, Phone, Mail, 
  Navigation, Edit3, X, Check, 
  ShoppingBag, Plus, Loader2, Calendar, CreditCard, ExternalLink,
  MessageSquare,
  Trash,
  Trash2
} from "lucide-react";
import { AlertCircle, RefreshCcw } from "lucide-react"; // مكتبة أيقونات شهيرة

import { useNavigate } from "react-router-dom";


import { getCurrentUser } from "../../services/getCurrentUser";
import { showAlertConfirm } from "../../services/alertConfirm";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false); // حالة تحميل الطلبات
  const [orders, setOrders] = useState([]); // مصفوفة الطلبات
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [err,setErr]=useState(null)
  const navigate=useNavigate();
   const userToken = getCurrentUser();
  const [form, setForm] = useState({
    userName: "", email: "", city: "", street: "", building: "", floor: "", region:"",
    newPhoneNumber: "" 
  });
  const [deleteLoading, setdeleteLoading] = useState(false); // حالة تحميل الطلبات


  const getProfile = async () => {

    
        if(!(localStorage.getItem("userName"))){
          
        showAlert({icon:"error" , title :" يجب عليك تسجيل الدخول اولا سيتم توجيهك الي صفحه تسجيل الدخول "});
          
        return  setTimeout(()=>{
             navigate("/تسجيل_الدخول")
        },500)
    
        }

    try {
      const res = await api.get("/users/profile");
      const u = res.data.user;
      setUser(u);
      setForm({
        userName: u.userName || "",
        email: u.email || "",
        city: u.address?.city || "",
        street: u.address?.street || "",
        building: u.address?.building || "",
        floor: u.address?.floor || "",
        region: u.address?.region || "",
        newPhoneNumber: u.phoneNumber || ""
      });
    } catch (err) {
      console.log()
      setErr(err.response.data)
      showAlert({ title: "خطأ في تحميل البيانات", icon: "error" });
    }
  };

 
  const getDeliveredOrders = async () => {
        
        if(!(localStorage.getItem("userName"))){
          
        showAlert({icon:"error" , title :" يجب عليك تسجيل الدخول اولا سيتم توجيهك الي صفحه تسجيل الدخول "});
          
        return  setTimeout(()=>{
             navigate("/تسجيل_الدخول")
        },500)
    
        }
    setOrdersLoading(true);
    try {
      const res = await api.get("/order/viewMyOrdersDeliverd");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Orders Fetch Error:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => { 
    getProfile(); 
  }, []);

 
  useEffect(() => {
    if (activeTab === "orders") {
      getDeliveredOrders();
    }
  }, [activeTab]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const updateProfile = async () => {
        
        if(!(localStorage.getItem("userName"))){
          
        showAlert({icon:"error" , title :" يجب عليك تسجيل الدخول اولا سيتم توجيهك الي صفحه تسجيل الدخول "});
          
        return  setTimeout(()=>{
             navigate("/تسجيل_الدخول")
        },500)
    
        }
    setLoading(true);
    try {
      await api.put(`/users/updateProfile/`, {
        userName: form.userName,
        email: form.email,
        address: { 
          city: form.city, street: form.street, 
          building: form.building, floor: form.floor,
           region:form.region
        },
        phoneNumber: form.newPhoneNumber || undefined 
      });
      showAlert({ title: "تم التحديث بنجاح", icon: "success" });
      setIsEditing(false);
      getProfile();
    } catch (err) {
      showAlert({ title: "حدث خطأ أثناء التحديث", icon: "error" });
    } finally {
      setLoading(false);
    }
  };


        useEffect(() => {
      document.title = " الملف الشخصي - نظام أبو الدهب";
    }, []);

 async function deleteAccount() {
  try {

    const result = await showAlertConfirm({
      title: "حذف الحساب",
      text: "هل أنت متأكد أنك تريد حذف الحساب؟ لا يمكن التراجع عن هذا الإجراء.",
      icon: "warning",
      confirmButtonText: "نعم احذف",
      cancelButtonText: "إلغاء",
      confirmButtonColor: "#dc2626"
    });



    if (!result.isConfirmed) return;

    setdeleteLoading(true)
    await api.delete("/users");

    // نجاح
    await showAlertConfirm({
      title: "تم الحذف",
      text: "تم حذف الحساب بنجاح",
      icon: "success",
      confirmButtonText: "حسناً",
      showCancelButton: false
    });

    // logout / redirect
    localStorage.clear();
    window.location.href = "/تسجيل_الدخول";

  } catch (err) {
    console.error(err);

    showAlertConfirm({
      title: "خطأ",
      text: err.response?.data?.message || "حدث خطأ أثناء حذف الحساب",
      icon: "error",
      confirmButtonText: "حسناً",
      showCancelButton: false
    });
  }finally{
    setdeleteLoading(false)
  }
}

  if (err) {
      return (
          <div className="flex h-screen w-full items-center justify-center text-red-500 text-xl font-bold">
              {err.message}
          </div>
      );
  }
  return (
     
 

    <div className={`min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-8 ${userToken.role =="admin" ? "font-cairo" :"font-cairo"} `} dir="rtl">
      <div className=" mx-auto flex flex-col lg:flex-row gap-8">

        {/* --- Sidebar Section --- */}
   { userToken.role =="customer" &&      <div className="lg:w-80">
          <div className="bg-white rounded-lg p-6 -sm border border-slate-100 sticky top-10">
            <div className="flex flex-col gap-2">
{ userToken.role =="customer" &&               <SidebarLink 
                active={activeTab === "profile"} 
                onClick={() => setActiveTab("profile")} 
                icon={User} 
                label="الملف الشخصي" 
              />}
   


            </div>
          </div>
        </div>}
        
        {/* --- Main Content Section --- */}
        <div className="flex-grow space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header Card */}
          <div className="bg-white rounded-lg -sm border border-slate-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-l from-[#0F172A] to-[#1E293B] relative">
              <div className="absolute -bottom-12 right-10">
                <div className="w-28 h-28 p-1.5 bg-white rounded-lg -lg">
                  <div className="w-full h-full rounded-lg bg-sky-50 flex items-center justify-center text-[#0284c7]">
                    <User size={48} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-16 pb-8 px-10">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h1 className="text-3xl font-black text-[#0F172A]">{form.userName || "مستخدم جديد"}</h1>
                  <p className="text-slate-400 font-bold flex items-center gap-2 mt-1">
                    <MapPin size={16} className="text-[#0284c7]" /> {form.city || "لم يحدد الموقع بعد"}
                  </p>
                </div>
                {!isEditing && activeTab === "profile" && (
                
                <>
                   <button disabled={deleteLoading} onClick={() => deleteAccount()} className="delete-trigger-btn">
                    <Trash2 size={18} /> حذف الحساب
                  </button>


                  <button onClick={() => setIsEditing(true)} className="edit-trigger-btn">
                    <Edit3 size={18} /> تعديل الحساب
                  </button>

                </>
                  
                )}
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-lg -sm border border-slate-100 p-8 md:p-12 min-h-[500px]">
            {activeTab === "profile" ? (
              <div className="max-w-4xl">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-2 h-10 bg-[#0284c7] rounded-lg"></div>
                  <h3 className="text-2xl font-black text-[#0F172A]">
                    {isEditing ? "تحديث معلوماتك" : "معلومات الحساب الشخصي"}
                  </h3>
                </div>

                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h4 className="section-title">البيانات الأساسية</h4>
                      <DetailItem label="الاسم الكامل" value={form.userName} icon={User} />
                      <DetailItem label="البريد الإلكتروني" value={form.email} icon={Mail} />
                      
                      <div className="p-6 bg-[#F8FAFC] rounded-lg border border-slate-50">
                         <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] block mb-4">أرقام التواصل</span>
                         <div className="flex flex-wrap gap-2">
                          
                              <span  className="bg-white -sm border border-slate-100 px-4 py-2 rounded-lg text-sm font-bold text-[#0F172A] flex items-center gap-2">
                                <Phone size={14} className="text-[#0284c7]" /> {user?.phoneNumber}
                              </span>
                        
                         </div>
                      </div>
                    </div>
       {      <div className="space-y-6">
              <h4 className="section-title">العناوين والموقع</h4>
              
              <DetailItem 
                label="المدينة / المنطقة" 
                value={`${form.city} / ${form.region}`} 
                icon={MapPin} 
              />
              
              <DetailItem 
                label="تفاصيل العنوان" 
                value={`${form.street} ${form.building ? `- مبنى ${form.building}، الدور ${form.floor}` : ''}`} 
                icon={Navigation} 
              />
            </div>}
                  </div>
                ) :(
                  <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div className="input-group">
                          <label className="field-label">اسم المستخدم</label>
                          <input name="userName" value={form.userName} onChange={handleChange} className="modern-input-no-icon" />
                        </div>
                        <div className="input-group">
                          <label className="field-label text-[#0284c7] font-black flex items-center gap-2">
                            <Plus size={16} />  رقم هاتف 
                          </label>
                          <input 
                            name="newPhoneNumber" 
                            value={form.newphoneNumber} 
                            
                            onChange={handleChange} 
                            className="modern-input-no-icon border-[#E0F2FE] focus:border-[#0284c7]" 
                            placeholder="أدخل الرقم الجديد..." 
                          />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="input-group">
                            <label className="field-label">المدينة</label>
                            <input name="city" value={form.city} onChange={handleChange} className="modern-input-no-icon" />
                          </div>
                    
                    <div className="input-group">
                            <label className="field-label">المنطقة</label>
                            <input name="region" value={form.region} onChange={handleChange} className="modern-input-no-icon" />
                          </div>
                          <div className="input-group">
                            <label className="field-label">الشارع</label>
                            <input name="street" value={form.street} onChange={handleChange} className="modern-input-no-icon" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="input-group">
                            <label className="field-label">المبنى</label>
                            <input name="building" value={form.building} onChange={handleChange} className="modern-input-no-icon" />
                          </div>
                          <div className="input-group">
                            <label className="field-label">الطابق</label>
                            <input name="floor" value={form.floor} onChange={handleChange} className="modern-input-no-icon" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-slate-100">
                      <button
                        onClick={updateProfile}
                        disabled={loading}
                        className={`save-btn ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#0369a1] active:scale-95"}`}
                      >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />}
                        {loading ? "جاري الحفظ..." : "حفظ التغييرات الجديدة"}
                      </button>

                      <button onClick={() => setIsEditing(false)} className="cancel-btn hover:bg-slate-200 active:scale-95 transition-all">
                        <X size={20} /> إلغاء الأمر
                      </button>
                    </div>
                  </div>
                
    )}
              </div>
            ) :  activeTab === "orders" ?(
              /* --- My Orders Delivered View --- */
              <div className="max-w-5xl animate-in fade-in duration-500">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-10 bg-[#0284c7] rounded-lg"></div>
                    <h3 className="text-2xl font-black text-[#0F172A]">الطلبات المكتملة</h3>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg text-xs font-black border border-emerald-100">
                    تم توصيلها بنجاح
                  </div>
                </div>

                {ordersLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 size={40} className="animate-spin text-[#0284c7]" />
                    <p className="font-bold text-slate-400">جاري جلب سجل طلباتك...</p>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-[#F8FAFC] border border-slate-100 rounded-lg p-6 md:p-8 hover:bg-white hover:-xl hover:-[#0284c7] 900/5 transition-all duration-300 group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-[#0284c7] -sm group-hover:bg-[#0284c7] group-hover:text-white transition-colors">
                              <Package size={28} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-sm font-black text-slate-400">كود الطلب:</span>
                                <span className="text-sm font-black text-[#0F172A]">#{order._id.slice(-6).toUpperCase()}</span>
                              </div>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                  <Calendar size={14} className="text-[#0284c7]" />
                                  {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                                  <CreditCard size={14} className="text-[#0284c7]" />
                                  {order.totalPrice} جنيه
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] font-black text-slate-400 uppercase mb-1">حالة الدفع</span>
                              <span className="text-sm font-black text-emerald-600">مدفوع</span>
                            </div>
                            <button className="p-4 bg-white rounded-lg text-slate-400 hover:text-[#0284c7] -sm border border-slate-50 transition-all">
                              <ExternalLink size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 mb-4">
                      <ShoppingBag size={40} />
                    </div>
                    <h4 className="text-xl font-black text-[#0F172A] mb-2">لا توجد طلبات سابقة</h4>
                    <p className="text-slate-400 font-bold max-w-xs">يبدو أنك لم تقم بإجراء أي طلبات مكتملة حتى الآن.</p>
                  </div>
                )}
              </div>
            ): (
      /* --- My Reviews View --- */
      <div className="animate-in fade-in duration-500">
   
      </div>
    )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .edit-trigger-btn { 
          display: flex; align-items: center; gap: 8px; 
          background: #F0F9FF; color: #0284c7; 
          padding: 12px 24px; border-radius: 1.25rem; 
          font-weight: 800; border: 2px solid #E0F2FE; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .edit-trigger-btn:hover { background: #0284c7; color: white; border-color: #0284c7; box-: 0 10px 15px -3px rgba(2, 132, 199, 0.2); }
.delete-trigger-btn { 
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fef2f2;
  color: #dc2626;
  padding: 12px 24px;
  border-radius: 1.25rem;
  font-weight: 800;
  border: 2px solid #fecaca;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.delete-trigger-btn:hover { 
  background: #dc2626;
  color: white;
  border-color: #dc2626;
  box-shadow: 0 10px 15px -3px rgba(220, 38, 38, 0.25);
}

        .section-title { font-size: 11px; font-weight: 900; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1.5rem; }
        .field-label { display: block; font-size: 13px; font-weight: 800; color: #475569; margin-bottom: 10px; padding-right: 4px; }
        .modern-input-no-icon { 
          width: 100%; padding: 16px; border-radius: 1.25rem; 
          background: #F8FAFC; border: 2px solid #F1F5F9; 
          font-weight: 700; color: #1E293B; outline: none; 
          transition: all 0.2s ease; 
        }
        .modern-input-no-icon:focus { background: white; border-color: #0284c7; box-: 0 0 0 4px rgba(2, 132, 199, 0.05); }
        .save-btn { 
          background: #0284c7; color: white; 
          padding: 16px 32px; border-radius: 1.25rem; 
          font-weight: 900; display: flex; align-items: center; gap: 10px; 
          transition: all 0.3s ease; 
        }
        .cancel-btn { 
          background: #F1F5F9; color: #64748B; 
          padding: 16px 32px; border-radius: 1.25rem; 
          font-weight: 900; display: flex; align-items: center; gap: 10px; 
        }
      `}</style>
    </div>
  );
}

const DetailItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-5 p-5 bg-[#F8FAFC] rounded-lg border border-slate-50 transition-all hover:bg-white hover:border-slate-100 hover:-sm group">
    <div className="bg-white p-3.5 rounded-lg -sm text-[#0284c7] group-hover:scale-110 transition-transform"><Icon size={22} /></div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-base font-bold text-[#1E293B]">{value || "---"}</p>
    </div>
  </div>
);

const SidebarLink = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-lg mb-2 transition-all duration-300 ${
      active 
      ? "bg-[#0F172A] text-white -lg -[#0284c7] 900/10 translate-x-1" 
      : "text-slate-500 hover:bg-slate-50 hover:text-[#0F172A]"
    }`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    <span className="font-black text-sm">{label}</span>
  </button>
);

export default Profile;
