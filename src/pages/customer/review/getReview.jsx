
import { useEffect, useState } from "react";
import api from "../../../services/api";
import { getCurrentUser } from "../../../services/getCurrentUser";
import { Trash2, Edit3, CheckCircle, X, Send } from "lucide-react";
import { showAlertConfirm } from "../../../services/alertConfirm";
import { showAlert } from "../../../services/alert";


const ReviewsList = ({ productId , reviews ,setReviews ,loading, setLoading }) => {
    const ReviewSkeleton = () => (
  <div className="animate-pulse border border-gray-100 p-5 rounded-md bg-white space-y-4">
    <div className="flex gap-3">
      <div className="w-11 h-11 rounded-full bg-gray-200"></div>
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
    <div className="h-16 bg-gray-100 rounded-md w-full"></div>
  </div>
);

  
 
  const [editingId, setEditingId] = useState(null); // لتحديد أي مراجعة يتم تعديلها
  const [editData, setEditData] = useState({ comment: "", rating: 5 });
  const [editLoading , setEditLoading] = useState(false);
  const user = getCurrentUser();
  const currentUserId = user?.userId || user?.id;



  const handleDelete = async (id) => {
    const confirm = await showAlertConfirm({
      title: "حذف تعليقك",
      text: "هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.",
      icon: "warning",
      confirmText: "نعم، احذف",
      cancelText: "إلغاء"
    });
    
    if (confirm.isConfirmed) {
      try {
        await api.delete(`/review/${id}`);
        setReviews(reviews.filter((r) => r._id !== id));
        showAlert({title:"تم حذف المراجعة بنجاح",icon:"success"});

      } catch (err) {
        showAlert({title:"فشل الحذف، حاول مرة أخرى",icon:"error"});
      }
    }
  };

 
  const startEdit = (review) => {
    setEditingId(review._id);
    setEditData({ comment: review.comment, rating: review.rating });
  };


  const handleUpdate = async (id) => {
    try {
        setEditLoading(true);
      const res = await api.put(`/review/${id}`, editData);
      setReviews(reviews.map(r => r._id === id ? { ...r, ...res.data.data } : r));
      setEditingId(null);
      showAlert({title:"تم تحديث مراجعتك",icon:"success"});
    } catch (err) {
            showAlert({title:err?.message || "حدث خطاء اثناء التعديل",icon:"error"});

    }finally{
        setEditLoading(false);
    }
  };

  const Stars = ({ rating, interactive = false }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          onClick={() => interactive && setEditData({ ...editData, rating: i })}
          className={`w-3.5 h-3.5 ${i <= rating ? "text-yellow-400" : "text-gray-200"} ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09L5.82 11.545 1 7.91l6.09-.545L10 2l2.91 5.364 6.09.545-4.82 3.636 1.697 6.545z" />
        </svg>
      ))}
    </div>
  );

  if (loading) return (
    <div className="space-y-5">
      {[1, 2, 3].map(i => <ReviewSkeleton key={i} />)}
    </div>
  );

  if (reviews.length === 0) return (
    <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-md bg-gray-50/50">
      لا توجد مراجعات حالياً لهذا المنتج
    </div>
  );

  return (

<>
    { <div>
                 {/* Header Section */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-[#0284c7] inline-block"></div> {/* لمسة جمالية جانبية */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              آراء ومراجعات العملاء
            </h2>
          </div>
          
          {/* يمكنك هنا عرض إجمالي عدد التقييمات لو متاح عندك */}
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
            {reviews.length || 0} تقييم
          </span>
        </div>
    <div className="space-y-5 max-h-[600px] overflow-y-auto pl-3 pr-1 custom-scrollbar rtl">
 
      {reviews.map((review) => {
        const isOwner = (review.userId?._id || review.userId) === currentUserId;
        const isEditing = editingId === review._id;

        return (
          <div
            key={review._id}
            className={`group relative border p-5 rounded-md transition-all duration-300 ${
              isEditing ? "border-[#0284c7] 400 bg-[#0284c7] 50/20" : "border-gray-100 bg-white hover:-lg"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-[#0284c7] 600 font-bold text-sm -sm">
                  {review.userId?.userName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{review.userId?.userName || "مستخدم"}</h4>
                  <div className="mt-1">
                    {isEditing ? (
                      <Stars rating={editData.rating} interactive={true} />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Stars rating={review.rating} />
                        <span className="text-[10px] text-green-600 font-bold">مشتري مؤكد</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!isEditing && (
                <span className="text-[10px] text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                </span>
              )}
            </div>

            {/* Content or Edit Form */}
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  className="w-full p-3 text-sm border border-[#0284c7] 200 rounded-md focus:ring-2 focus:ring-[#0284c7] 500 outline-none"
                  rows="3"
                  value={editData.comment}
                  onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                  >
                    <X className="w-3.5 h-3.5" /> إلغاء
                  </button>
{    !editLoading    ?          <button
                    disabled={editLoading}
                    onClick={() => handleUpdate(review._id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#0284c7] 600 rounded-md hover:bg-[#0284c7] 700 -md -[#0284c7] 100"
                  >
                    <Send className="w-3.5 h-3.5" /> حفظ التعديلات
                  </button>
                :  
                  <button
                
             
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#0284c7] 600 rounded-md hover:bg-[#0284c7] 700 -md -[#0284c7] 100"
                  >
                    <Send className="w-3.5 h-3.5" /> جاري الحفظ...
                  </button>
                
                }
                </div>
              </div>
            ) : (
              <div className="relative bg-gray-50/50 p-4 rounded-md border border-gray-50 group-hover:bg-blue-50/30 transition-colors">
                <p className="text-[13px] text-gray-600 leading-relaxed whitespace-pre-line">
                  {review.comment}
                </p>
                <span className="absolute top-1 left-2 text-gray-200 text-3xl font-serif">"</span>
              </div>
            )}

            {/* Actions (Owner Only) */}
            {isOwner && !isEditing && (
              <div className="flex justify-end gap-4 mt-3 pt-3 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(review)}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#0284c7] 600 hover:scale-105 transition-transform"
                >
                  <Edit3 className="w-3.5 h-3.5" /> تعديل
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:scale-105 transition-transform"
                >
                  <Trash2 className="w-3.5 h-3.5" /> حذف
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
     </div>}
    </>
  );
};

export default ReviewsList;