import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { showAlert } from '../../../services/alert';
import { showAlertConfirm } from '../../../services/alertConfirm';
import { Loader2 } from 'lucide-react';

export default function AdminCouponDashboard() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    expiresAt: "",
    usageLimit: 1
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get('/coupons');
      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء جلب الكوبونات من السيرفر");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "code" ? value.toUpperCase() : value
    });
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount || !formData.expiresAt) {
      showAlert({ title: "الرجاء ملء كافة الحقول الإلزامية", icon: "error" });
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const response = await api.post('/coupons', {
        code: formData.code.trim(),
        discount: Number(formData.discount),
        expiresAt: formData.expiresAt,
        usageLimit: Number(formData.usageLimit)
      });

      if (response.data.success) {
        showAlert({ icon: "success", title: "تم إنشاء الكوبون بنجاح" });
        setFormData({ code: "", discount: "", expiresAt: "", usageLimit: 1 });
        fetchCoupons();
      }
    } catch (err) {

      const serverMessage = err.response?.data?.message || "";
      

      if (serverMessage.includes("11000") || serverMessage.includes("duplicate")) {
        showAlert({ 
          icon: "error", 
          title: "خطأ في الإنشاء", 
          text: `رمز الكوبون (${formData.code.trim()}) مستخدم مسبقاً، يرجى اختيار رمز آخر.` 
        });
      } else {
    
        showAlert({ 
          icon: "error", 
          title: err.response?.data?.message || "فشلت عملية إنشاء الكوبون" 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    const confirmDelete = await showAlertConfirm({
      title: "هل أنت متأكد من حذف هذا الكوبون؟",
      text: "لا يمكن التراجع عن هذا الإجراء",
      icon: "warning",
      confirmButtonText: "نعم، احذف الكوبون",
      cancelButtonText: "لا، إلغاء"
    });
    if (!confirmDelete.isConfirmed) return;

    try {
      setError("");
      const response = await api.delete(`/coupons/${id}`);
      if (response.data.success) {
        showAlert({ icon: "success", title: "تم حذف الكوبون بنجاح" });
        setCoupons(coupons.filter(c => c._id !== id));
      }
    } catch (err) {
      showAlert({ icon: "error", title: err.response?.data?.message || "فشلت عملية حذف الكوبون" });
    }
  };

  const filteredCoupons = coupons.filter(c => {
    const matchesSearch = c.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStatus === "active") return matchesSearch && c.isValid;
    return matchesSearch;
  });

return (
  <div className="p-6 bg-gray-50/50 min-h-screen text-right font-" dir="rtl">
    
    {/* الرأس واللوحات الإحصائية العلوية المقتبسة من التقسيمة الجديدة */}
    <div className="mb-8 border-b border-gray-100 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-wide">لوحة التحكم بالكوبونات</h1>
        <p className="text-xs text-gray-400 mt-1">إدارة وإصدار قسائم التخفيض </p>
      </div>
      

  
    </div>

        <div className="grid grid-cols-3 gap-3 w-full md:w-auto min-w-full mb-10">
        <div className="bg-white border border-gray-100 rounded-md p-3 text-center shadow-sm">
          <span className="text-[14px] font-black text-gray-400 block mb-1"> إجمالي الكوبونات</span>
          <span className="text-sm font-black text-slate-800 font-">{coupons.length}</span>
        </div>
        <div className="bg-white border  border-gray-100 rounded-md p-3 text-center shadow-sm">
          <span className="text-[14px] font-black  text-sky-600 block mb-1"> الكوبونات النشطة</span>
          <span className="text-sm font-black text-emerald-600 font-">
            {coupons.filter(c => c.isValid).length}
          </span>
        </div>
        <div className="bg-white border border-gray-100 rounded-md p-3 text-center shadow-sm">
          <span className="text-[14px] font-black text-gray-400 block mb-1"> المنتهية</span>
          <span className="text-sm font-black text-rose-600 font-">
            {coupons.filter(c => !c.isValid).length}
          </span>
        </div>
      </div>

    {/* رسائل الخطأ */}
    {error && (
      <div className="mb-6 p-3.5 bg-rose-50 text-rose-600 text-xs rounded-xl border border-rose-100 font-bold flex items-center gap-2">
        <span>⚠️</span> خطأ: {error}
      </div>
    )}


    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      

      <div className="bg-white p-5 rounded-md border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-50">
          <span className="text-[#0284c7] font-black text-lg">＋</span>
          <h2 className="text-sm font-black text-slate-800">إنشاء كوبون جديد</h2>
        </div>
        
        <form onSubmit={handleCreateCoupon} className="space-y-4">
          <div>
            <label className="block text-[14px] font-black text-slate-500 mb-1.5">
              رمز الكوبون (كود) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="مثال: SUMMER30"
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-left font-شركه font-bold text-slate-800 placeholder-gray-400 focus:ring-1 focus:ring-[#0284c7] focus:border-[#0284c7] focus:outline-none transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[14px] font-black text-slate-500 mb-1.5">
              نسبة الخصم % <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="discount"
              min="0"
              step="any"
              max="100"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder="100 - 0"
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-slate-800 placeholder-gray-400 focus:ring-1 focus:ring-[#0284c7] focus:border-[#0284c7] focus:outline-none transition-all text-sm font-"
              required
            />
          </div>

          <div>
            <label className="block text-[14px] font-black text-slate-500 mb-1.5">
              تاريخ انتهاء الصلاحية <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleInputChange}
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-slate-700 focus:ring-1 focus:ring-[#0284c7] focus:border-[#0284c7] focus:outline-none transition-all text-sm font- text-right"
              required
            />
          </div>

          <div>
            <label className="block text-[14px] font-black text-slate-500 mb-1.5">حد الاستخدام الأقصى</label>
            <input
              type="number"
              name="usageLimit"
              min="1"
              value={formData.usageLimit}
              onChange={handleInputChange}
              placeholder="غير محدود"
              className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-slate-800 placeholder-gray-400 focus:ring-1 focus:ring-[#0284c7] focus:border-[#0284c7] focus:outline-none transition-all text-sm font-"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white cursor-pointer font-black py-2.5 rounded-xl transition duration-200 text-xs shadow-sm mt-2 flex justify-center items-center gap-2 active:scale-[0.99] ${
              isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-[#0284c7] hover:bg-[#0274b0]'
            }`}
          >
            {isSubmitting ? (
              <>
                  <Loader2 className="animate-spin" size={16} />      
                جاري الحفظ والجدولة...
              </>
            ) : (
              ' حفظ وتفعيل الكوبون'
            )}
          </button>
        </form>
      </div>


      <div className="lg:col-span-2 bg-white p-5 rounded-md border border-gray-100 shadow-sm flex flex-col gap-4">
  
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-gray-50">
          <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
        الكوبونات المخزنة بالسيرفر 
            <span className="text-xs text-[#0284c7] bg-sky-50 border border-sky-100/60 px-2 py-0.5 rounded-md font-">
              {coupons.length}
            </span>
          </h2>
          
      
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
            <button
              type="button"
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1 cursor-pointer rounded-lg text-xs font-black transition ${filterStatus === 'all' ? 'bg-white text-slate-800 border border-gray-100 shadow-sm' : 'text-gray-400 hover:text-slate-600'}`}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus("active")}
              className={`px-3 py-1 rounded-lg cursor-pointer text-xs font-black transition ${filterStatus === 'active' ? 'bg-sky-50 text-[#0284c7] border border-sky-100/50 shadow-sm' : 'text-gray-400 hover:text-slate-600'}`}
            >
              النشطة
            </button>
          </div>
        </div>


        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن رمز الكوبون..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-slate-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0284c7] focus:border-[#0284c7] text-xs font-bold"
          />
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-xs font-bold animate-pulse">
            🔄 جاري الاتصال الآمن بالسيرفر وجلب سجلات الكوبونات...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse text-right">
              <thead>
                <tr className="text-gray-400 text-[14px] font-black border-b border-gray-50">
                  <th className="py-3 px-3">الكود</th>
                  <th className="py-3 px-3 text-center">الخصم</th>
                  <th className="py-3 px-3 text-center">الاستخدام</th>
                  <th className="py-3 px-3 text-center">الانتهاء</th>
                  <th className="py-3 px-3 text-center">الحالة</th>
                  <th className="py-3 px-3 text-center">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/50">
                {filteredCoupons.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400 text-xs font-bold">
                       لا توجد قسائم تخفيض مطابقة للبحث حالياً
                    </td>
                  </tr>
                ) : (
                  filteredCoupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50/60 transition text-xs font-bold">
                      <td className="py-3.5 px-3 font-شركه text-slate-800 text-sm tracking-wide">{coupon.code}</td>
                      <td className="py-3.5 px-3 text-center text-[#0284c7] font- text-sm">{coupon.discount}%</td>
                      <td className="py-3.5 px-3 text-center text-slate-600 font-">
                        {coupon.usedCount} <span className="text-gray-300 font-normal">/</span> {coupon.usageLimit || '∞'}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-500 font-">
                        {new Date(coupon.expiresAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {coupon.isValid ? (
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100/60 px-2 py-0.5 rounded-md text-[14px]">
                            صالح
                          </span>
                        ) : (
                          <span className="bg-rose-50 text-rose-600 border border-rose-100/60 px-2 py-0.5 rounded-md text-[14px]">
                            مُنتهٍ
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          className="text-gray-400 cursor-pointer hover:text-rose-600 hover:bg-rose-50 border border-gray-100 hover:border-rose-100 rounded-xl px-2.5 py-1 text-[14px] font-black transition-all"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  </div>
);
}