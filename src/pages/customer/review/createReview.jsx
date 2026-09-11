import { useState } from "react";
import api from "../../../services/api";
import { Star, Send } from "lucide-react"; // أيقونات لإضافة لمسة جمالية
import { showAlert } from "../../../services/alert";
import { showAlertConfirm } from "../../../services/alertConfirm";
import { useNavigate } from "react-router-dom";


const ReviewBox = ({ productId, onReviewAdded  }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          const alert = await showAlertConfirm({ 
            title: "يجب تسجيل الدخول", 
            text: "يجب عليك تسجيل الدخول لكي تضيف هذا المنتج الي العربه", 
            icon: "warning" 
          });
          if (alert.isConfirmed) navigate("/تسجيل_الدخول");
          return;
        }
    if (rating === 0 || !comment.trim() ) {
      showAlert({
        title: "تقييم غير كامل يرجى اختيار تقييم وإضافة تعليق قبل الإرسال.",
        icon: "error"});
      return;
    }
    if(comment.length < 3 || comment.length > 50) {
      showAlert({
        title: "التعليق يجب أن يكون بين 3 و 50 حرفًا.",
        icon: "error"});
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/review", {
        productId,
        rating,
        comment,
      });

      showAlert({title:"تم إضافة تقييمك بنجاح",icon:"success"});
      setRating(0);
      setComment("");
      
onReviewAdded(prev => [...prev, res.data.data]);
      

    } catch (err) {
        console.log(err)
      showAlert({title:err.response.data.message || "فشل إرسال التقييم، حاول مرة أخرى",icon:"error"});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-cairo bg-white border border-gray-100 font-['cairo']  -gray-100/50 p-6 w-full  mx-auto transition-all">
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 bg-blue-50 rounded-lg">
           <Star className="w-5 h-5 text-[#0284c7] 600 fill-[#0284c7] 600" />
        </div>
        <h2 className="text-lg font-bold text-gray-800">ما رأيك في هذا المنتج؟</h2>
      </div>

      <p className="text-sm text-gray-500 mb-2">تقييمك يساعدنا ويساعد العملاء الآخرين في اتخاذ القرار الصحيح.</p>

      {/* Stars Section */}
      <div className="flex flex-col items-center justify-center p-6 mb-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <span className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">اضغط للتقييم</span>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none transition-transform active:scale-90"
            >
              <Star
                className={`w-7 h-7 transition-colors duration-200 ${
                  (hover || rating) >= star
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>

      </div>

      {/* Comment Section */}
      <div className="relative group">
        <textarea
          className="w-full bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700 min-h-[50px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0284c7] 500 transition-all resize-none -sm placeholder:text-gray-400"
          placeholder="اكتب تجربتك مع المنتج بكل صراحة..."
          value={comment}
          maxLength={50}
          minLength={3}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="absolute bottom-3 left-3 text-[10px] text-gray-300 pointer-events-none">
            {comment.length} حرف
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 ${
          loading 
          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
          : "bg-[#0284c7] 600 text-white hover:bg-[#0284c7] 700 hover:-lg hover:-[#0284c7] 200 active:scale-95"
        }`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            إرسال التقييم
          </>
        )}
      </button>
    </div>
  );
};

export default ReviewBox;