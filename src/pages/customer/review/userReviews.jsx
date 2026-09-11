import { useEffect, useState } from "react";
import api from "../../../services/api";
import { Star, Trash2, Edit3, Package, Calendar, X, Check, Loader2 } from "lucide-react";
import { showAlertConfirm } from "../../../services/alertConfirm";
import { showAlert } from "../../../services/alert";

const UserReviewsList = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ comment: "", rating: 0 });
  const [isUpdating, setIsUpdating] = useState(false); // حالة التحميل عند الحفظ

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    fetchUserReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/review/userReviews");
      setReviews(res.data.data);
    } catch (err) {
      console.error("Error fetching user reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await showAlertConfirm({
      title: "حذف التقييم؟",
      text: "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.",
      icon: "warning",
      confirmText: "نعم، احذف",
      cancelText: "إلغاء"
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/review/${id}`);
        setReviews(reviews.filter(r => r._id !== id));
        showAlert({ title: "تم حذف التقييم بنجاح", icon: "success" });
      } catch (err) {
        showAlert({ title: "حدث خطأ أثناء الحذف", icon: "error" });
      }
    }
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setEditForm({ comment: review.comment, rating: review.rating });
  };

  const handleUpdate = async (id) => {
    try {
      setIsUpdating(true);
      const res = await api.put(`/review/${id}`, editForm);
      setReviews(reviews.map(r => r._id === id ? { ...r, ...res.data.data } : r));
      setEditingId(null);
      showAlert({ title: "تم تحديث تقييمك بنجاح", icon: "success" });
    } catch (err) {
      showAlert({ title: "فشل التحديث، حاول مرة أخرى", icon: "error" });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
    </div>
  );

  return (
    <div className=" mx-auto  rtl font-cairo">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg- bg-[#0284c7] -600 rounded-md flex items-center justify-center -lg -blue-200">
          <Edit3 className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-800">إدارة تقييماتي</h2>
          <p className="text-gray-500 text-sm">لديك {reviews.length} تقييمات منشورة</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-md border border-gray-100 -sm">
          <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-bold">لا توجد مراجعات حالية</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div 
              key={review._id} 
              className={`relative bg-white border-2 rounded-md p-6 transition-all duration-300 ${
                editingId === review._id ? "border-blue-500 bg-blue-50/10" : "border-gray-50 hover:border-blue-100 hover:-xl hover:-gray-200/40"
              }`}
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                      <img src={review.userId?.profileImg || defaultAvatar} alt="user" className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{review.productId?.productName}</h3>
                      <h3 className="font- text-gray-900 text-sm line-clamp-1">{review.productId?.description}</h3>

                      <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                   </div>
                </div>
                {editingId !== review._id && (
                   <div className="flex bg-yellow-50 px-2 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold text-yellow-700 mr-1">{review.rating}</span>
                   </div>
                )}
              </div>

              {editingId === review._id ? (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="flex gap-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <Star
                        key={num}
                        onClick={() => setEditForm({ ...editForm, rating: num })}
                        className={`w-7 h-7 cursor-pointer transition-all ${num <= editForm.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                  <textarea
                    className="w-full bg-gray-50 border-0 rounded-md p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    rows="3"
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdate(review._id)}
                      disabled={isUpdating}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        isUpdating ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white -md"
                      }`}
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      {isUpdating ? "جاري الحفظ..." : "حفظ التعديلات"}
                    </button>
                    <button 
                      onClick={() => setEditingId(null)}
                      className="px-4 bg-gray-100 text-gray-500 py-2.5 rounded-xl font-bold text-xs"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 italic">
                    "{review.comment}"
                  </p>
                  <div className="flex justify-end gap-3 border-t border-gray-50 pt-4">
                    <button 
                      onClick={() => startEdit(review)}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> تعديل
                    </button>
                    <button 
                      onClick={() => handleDelete(review._id)}
                      className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 bg-red-50 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> حذف
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviewsList;