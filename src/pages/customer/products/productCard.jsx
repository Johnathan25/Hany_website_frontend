import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineHeart, HiPlus, HiMinus, HiOutlineCube, HiOutlineShoppingBag } from 'react-icons/hi';
import api from '../../../services/api';
import { MyContext } from '../../../context/cartContext';
import { showAlertConfirm } from '../../../services/alertConfirm';
import { showAlert } from '../../../services/alert';
import defaultimg from '/defaultimg.png'
import StarRating from '../review/rating';
import { jwtDecode } from 'jwt-decode';

const ProductCard = ({ product, isLast, lastProductElementRef }) => {
  const { setCounts } = useContext(MyContext);
  const navigate = useNavigate();
  const defaultProductImg = defaultimg || "https://kokishoponline.com/wp-content/uploads/2024/07/11-1024x1024.png";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 500080);


   function isTokenValid() {
    const token = localStorage.getItem("token");
    if (!token) return false;
  
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
  
      if (decoded.exp <= currentTime) {
        // const res = await api.post("/users/refresh-token");
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        
  
      }
  
      
    } catch {
      return false;
    }
  }
useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 500080);
  };

  window.addEventListener("resize", handleResize);

  isTokenValid()
  return () => {
    window.removeEventListener("resize", handleResize);
  };
}, [])

  const [buyType, setBuyType] = useState("قطعة"); 
  const [count, setCount] = useState(1);
  const [showCartSheet, setShowCartSheet] = useState(false);

  if (!product) return null;

  const maxCount = buyType === "كرتونة"
      ? product.availableQuantity
      : product.totalUnits || (product.availableQuantity * product.unitsPerPackage);

  const handleAddToCart = async () => {
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

    const item = { product: product._id, quantity: count, unit_type: buyType  , isOffer:false ,
      isCombo:false};
    const itemsCart = JSON.parse(localStorage.getItem("cart")) || [];
    const newCart = [...itemsCart, item];
    const mergedCart = newCart.reduce((acc, current) => {      const index = acc.findIndex((i) => i.product === current.product && i.unit_type === current.unit_type && i.isOffer === current.isOffer);

      if (index !== -1) { acc[index].quantity += current.quantity; } 
      else { acc.push({ ...current }); }
      return acc;
    }, []);

    let Counter = 0;
    mergedCart.forEach(element => {
      if (element.product == product._id) {
        Counter += element.unit_type === "كرتونة" ? element.quantity * product.unitsPerPackage : element.quantity;
      }
    });

    if (Counter > product.totalUnits) {
      return showAlert({ title: "المخزون لايكفي ", icon: "error", time: 800 });
    }

    showAlert({ title: "تم إضافة المنتج للسلة", icon: "success", time: 800 });
    setCounts(mergedCart.length);
    localStorage.setItem("cart", JSON.stringify(mergedCart));
    try { await api.post("/user/cart", { items: [item] }); } catch (err) { console.error(err); }
  };

  const handleToCount = (type) => {
    setCount(prev => {
      if (type === "+") return prev < maxCount ? prev + 1 : prev;
      if (type === "-") return prev > 1 ? prev - 1 : prev;
      return prev;
    });
  };

  useEffect(() => { setCount(1); }, [buyType]);

  return (
    <div
      ref={isLast ? lastProductElementRef : null}
      className="group bg-white rounded-lg border border-slate-100 hover:border-[#0284c7]/30 hover:-[0_20px_50px_rgba(2,132,199,0.1)] transition-all duration-500 relative flex flex-col w-full overflow-hidden mx-auto h-full"
    >
      {/* --- Image Section --- */}
      <div className="relative h-56 md:h-64 overflow-hidden w-full bg-slate-50/50 flex items-center justify-center p-4">
        <div 
          onClick={() => navigate(`/تفاصيل المنتج/${product._id}?الاسم=${product.productName}`)}
          className="w-full h-full cursor-pointer flex items-center justify-center"
        >
          <img 
            loading="lazy"
            src={product.image?.url || defaultProductImg}
            alt={product.productName}
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 "
          />
        </div>

        {/* Desktop Overlay Controls */}
        {!isMobile && (
          <div className="absolute inset-x-0 bottom-0 p-4 z-20 bg-gradient-to-t from-white via-white/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col gap-3">
            <div className="flex p-1 bg-slate-100/80 rounded-xl">
              <button
                onClick={() => setBuyType("قطعة")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${buyType === "قطعة" ? "bg-white text-[#0284c7] -sm" : "text-slate-500"}`}
              >
                بالقطعة
              </button>
              {product.unit_type === "كرتونة" && (
                <button
                  onClick={() => setBuyType("كرتونة")}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${buyType === "كرتونة" ? "bg-white text-[#0284c7] -sm" : "text-slate-500"}`}
                >
                  بالكرتونة
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="flex-[2] flex items-center justify-between bg-white border border-slate-200 rounded-xl px-1">
                <button onClick={() => handleToCount("+")} className="text-[#0284c7] p-2 hover:bg-slate-50 rounded-full transition-colors"><HiPlus size={14}/></button>
                <span className="font-bold text-slate-800 text-sm">{count}</span>
                <button onClick={() => handleToCount("-")} className="text-slate-300 p-2 hover:bg-slate-50 rounded-full transition-colors"><HiMinus size={14}/></button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.totalUnits === 0}
                className="flex-[3] bg-[#0284c7] text-white py-2.5 rounded-xl text-xs font-bold -lg -blue-200 active:scale-95 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <HiOutlineShoppingBag size={16}/>
                إضافة للسلة
              </button>
            </div>
          </div>
        )}

        {/* Badges & Heart */}
        <div className="absolute top-4 right-4 z-10">
          {product.availableQuantity < 5 && product.availableQuantity > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-full animate-pulse uppercase tracking-wider -lg -rose-200">
              كمية محدودة 
            </span>
          )}
        </div>
        
        <button className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center bg-white rounded-full text-slate-300 hover:text-rose-500 transition-all -sm hover:-md active:scale-90">
            <HiOutlineHeart size={20} />
        </button>

        {product.totalUnits === 0 && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center z-30">
            <span className="bg-white text-slate-900 font-black px-6 py-2 rounded-xl transform -rotate-12 border-2 border-slate-900 -2xl">
              نفذت الكمية
            </span>
          </div>
        )}
      </div>

      {/* --- Details Section --- */}
      <div className="p-5 flex flex-col flex-grow text-right" dir="rtl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black text-[#0284c7] bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
            {product.category}
          </span>
          <span className="text-[11px] font-bold text-slate-300 font-mono tracking-tighter">ID: {product.code}</span>
        </div>

        <h3 className="font-bold text-slate-800 text-base mb-1 line-clamp-1 group-hover:text-[#0284c7] transition-colors">
          {product.productName}
        </h3>

        <p className="text-md text-slate-500 font-semibold line-clamp-2 mb-4 leading-relaxed min-h-[32px]">
          {product.description}
        </p>

        {/* Inventory Stats Box */}
        <div className="bg-slate-50/80 rounded-lg p-3 mb-4 border border-slate-100/50 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 text-slate-500">
              <HiOutlineCube size={14} className="text-slate-400" />
              <span className="text-[11px] font-medium">نظام البيع:</span>
            </div>
            <span className="text-[11px] font-bold text-slate-700">
              {product.unit_type === "كرتونة" ? `كرتونة (${product.unitsPerPackage} قطعة)` : "بالقطعة فقط"}
            </span>
          </div>
          <div className="h-[1px] w-full bg-slate-200/50"></div>
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-medium text-slate-500">المخزون المتوفر:</span>
            <span className={`text-[11px] font-black ${product.totalUnits > 10 ? 'text-green-600' : 'text-rose-500'}`}>
              {product.totalUnits} قطعة
            </span>
          </div>
        </div>

        {/* Pricing & Stars */}
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-3">
             <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold mb-0.5">سعر القطعة</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 leading-none">{product.pieceSellingPrice}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">ج.م</span>
                </div>
             </div>
             <StarRating rating={product.averageRating} reviewsCount={product.reviewsCount} />
          </div>

          {product.unit_type === "كرتونة" && (
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#0284c7] font-bold">سعر الكرتونة</span>
                <span className="text-sm font-black text-[#0284c7]">{product.packageSellingPrice} ج.م</span>
              </div>
              
              {isMobile && (
                <button
                  onClick={() => setShowCartSheet(true)}
                  disabled={product.totalUnits === 0}
                  className={`bg-[#0284c7]  ${product.totalUnits==0 ? "bg-slate-500 cursor-not-allowed" :"cursor-pointer "} text-white px-5 py-2 rounded-xl text-xs font-bold -md -blue-100 active:scale-90`}
                >
                  إضافة سريعة
                </button>
              )}
            </div>
          )}
          
          {/* Mobile Add Button for "Piece-only" products */}
          {isMobile && product.unit_type !== "كرتونة" && (
            <button
              disabled={product.totalUnits === 0}
              onClick={() => setShowCartSheet(true)}
              className={`w-full bg-[#0284c7] text-white py-2.5 rounded-xl text-xs font-bold -md  ${product.totalUnits==0 ? "bg-slate-500 cursor-not-allowed" :"cursor-pointer"} -blue-100 active:scale-90 mt-2`}
            >
              إضافة للسلة
            </button>
          )}
        </div>
      </div>

      {/* --- Mobile Bottom Sheet --- */}
      {showCartSheet && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm px-0 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-t-[32px] p-6 -2xl animate-slideUp">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-start mb-6">
              <div className="text-right flex-grow">
                <h3 className="font-black text-slate-800 text-lg">{product.productName}</h3>
                <p className="text-slate-400 text-xs">حدد الكمية ونوع البيع المطلوب</p>
              </div>
              <button 
                onClick={() => setShowCartSheet(false)} 
                className=" cursor-pointer w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500"
              >✕</button>
            </div>

            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setBuyType("قطعة")}
                className={`flex-1 cursor-pointer py-3.5 rounded-lg font-bold text-sm transition-all border-2 ${buyType === "قطعة" ? "border-[#0284c7] bg-blue-50 text-[#0284c7]" : "border-slate-100 text-slate-500"}`}
              >
                شراء بالقطعة
              </button>
              {product.unit_type === "كرتونة" && (
                <button
                  onClick={() => setBuyType("كرتونة")}
                  className={`flex-1 py-3.5 cursor-pointer rounded-lg font-bold text-sm transition-all border-2 ${buyType === "كرتونة" ? "border-[#0284c7] bg-blue-50 text-[#0284c7]" : "border-slate-100 text-slate-500"}`}
                >
                  شراء بالكرتونة
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mb-8 bg-slate-50 p-2 rounded-lg">
              <button onClick={() => handleToCount("+")} className="w-12  cursor-pointer h-12 flex items-center justify-center bg-white rounded-xl text-[#0284c7] -sm"><HiPlus/></button>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-slate-800">{count}</span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest">الكمية</span>
              </div>
              <button onClick={() => handleToCount("-")} className="w-12 cursor-pointer h-12 flex items-center justify-center bg-white rounded-xl text-slate-300 -sm"><HiMinus/></button>
            </div>

            <button
              onClick={() => { handleAddToCart(); setShowCartSheet(false); }}
              className="w-full bg-[#0284c7] cursor-pointer text-white py-4 rounded-lg font-black text-base -xl -blue-200 active:scale-95 transition-transform"
            >
              تأكيد الإضافة للسلة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;