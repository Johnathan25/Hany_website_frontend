import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  HiOutlineShoppingCart, 
  HiOutlineHeart, 
  HiOutlineArrowRight, 
  HiOutlineCube, 
  HiOutlineTag, 
  HiOutlineShieldCheck, 
  HiOutlineTruck,
  HiOutlineFire
} from 'react-icons/hi';
import api from '../../../services/api';
import ProductCard from './productCard';
import AllProducts from './allProducts';
import { MyContext } from '../../../context/cartContext';
import { showAlertConfirm } from '../../../services/alertConfirm';
import { showAlert } from '../../../services/alert';
import defaultimg from '../../../../public/defaultimg.png'
import StarRating from '../review/rating';
import ReviewsList from '../review/getReview';
import ReviewBox from '../review/createReview';
import comboBg from '/combo.png';
import  offerBg from '/offer.png';
const ProductDetails = () => {
  const defaultProductImg =defaultimg || "https://kokishoponline.com/wp-content/uploads/2024/07/11-1024x1024.png";
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviews,setReviews ] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
   const [subloading, setSubLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('قطعة');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const {setCounts}=useContext(MyContext);


  const fetchReviews = async () => {
    setSubLoading(true)
  const res = await api.get(`/review/product/${id}`);
  setReviews(res.data.data);
    setSubLoading(false)

};

useEffect(() => {
  if (id) fetchReviews();
   

}, [id]);

  // fetch all product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/product/${id}`);
        const data = response.data.data;
        setProduct(data);
        document.title = `${data.description}`;
        
        // all product related to this product base on catehgory
        if (data.category) {
          const res = await api.get(`/product/getProductsByCategory?category=${data.category}&limit=50`);
          setRelatedProducts(res.data.data);
        }
      } catch (err) {
        setError("عذراً، لم نتمكن من العثور على المنتج المطلوب.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

 


  }, [id]);

  const handleAddToCart = async () => {
      const token=localStorage.getItem("token");
      if(! token){
       const alert= await showAlertConfirm({title:"يجب تسجيل الدخول ",text:"يجب عليك تسجيل الدخول لكي تضيف هذا المنتج الي العربه ",icon:"warning",confirmButtonColor:"black"})
       if(alert.isConfirmed){
        navigate("/تسجيل_الدخول");
       }else{
        return
       }
      }else{

      
    const item = {
      product: product._id,
      quantity: quantity,
      unit_type: orderType,
      isOffer:false,
      isCombo:false
    };
  
     const itemsCart=JSON.parse(localStorage.getItem("cart")) || [];
    
     itemsCart.push(item);
    const mergedCart = itemsCart.reduce((acc, item) => {
    const index = acc.findIndex(
      (i) =>
        i.product === item.product &&
        i.unit_type === item.unit_type
         && 
         i.isOffer == item.isOffer
    );
  
    if (index !== -1) {
      acc[index].quantity += item.quantity;
    } else {
      acc.push({ ...item });
    }
  
    return acc;
  }, []);
  


  
       let Counter =0;
       mergedCart.forEach(element => {
          if(element.product == product._id){
              if(element.unit_type=="كرتونة"){
                 Counter+=element.quantity * product.unitsPerPackage;
              }else{
                  Counter+=element.quantity
              }
          }
       });
  
        if(Counter > product.totalUnits){
         return   showAlert({ title:"المخزون لايكفي ", icon: "error", time: 800 });
        }
       


      showAlert({ title: "تم إضافة المنتج للسلة", icon: "success", time: 800 });
     setCounts(mergedCart.length)
     localStorage.setItem("cart",JSON.stringify(mergedCart))
     
  


    try {
     const res= await api.post("/user/cart", {
        items: [item]   
      });
  
  
  
    } catch (err) {
      console.log(err);
    }
  }};

  // (Logic)
  const isPackage = orderType === 'كرتونة';
  const unitsPerPkg = product?.unitsPerPackage || 1; // unit per package 
  const stockAvailable = product?.totalUnits || 0;  // toal unit 

//    maxAllowed
  const maxAllowed = isPackage ? Math.floor(stockAvailable / unitsPerPkg) : stockAvailable;

   
  useEffect(() => {
    if (quantity > maxAllowed) {
      setQuantity(maxAllowed > 0 ? maxAllowed : 1);
    }
  }, [orderType, maxAllowed]);

  const handleIncrease = () => {
    if (quantity < maxAllowed) setQuantity(prev => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };
if (loading) return (
  <div className="min-h-screen bg-[#fafafa] animate-pulse" dir="rtl">
    {/* Navbar Skeleton */}
    <nav className="bg-white border-b border-slate-100 static top-0 z-50">
      <div className=" mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="h-6 bg-slate-200 rounded w-20"></div>
        <div className="hidden md:block h-6 bg-slate-100 rounded w-24"></div>
      </div>
    </nav>

    <div className=" mx-auto px-6 md:px-12 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Image Skeleton - متوافق مع الحجم الجديد */}
        <div className="lg:col-span-5 w-full max-w-lg  mx-auto lg:mx-0">
          <div className="bg-slate-200 aspect-[7/5] rounded-2xl -inner border border-slate-100"></div>
        </div>

        {/* Details Skeleton */}
        <div className="lg:col-span-7 flex flex-col space-y-8">
          <div className="space-y-4">
            <div className="h-5 bg-blue-50/50 rounded w-24 border border-blue-50"></div>
            <div className="h-12 bg-slate-200 rounded-lg w-3/4 md:w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            </div>
            <div className="h-6 bg-slate-100 rounded w-32 mt-2"></div>
          </div>

          {/* Pricing Selection Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-28 bg-white border-2 border-slate-100 rounded-xl"></div>
            <div className="h-28 bg-white border-2 border-slate-100 rounded-xl"></div>
          </div>

          {/* Total Price Box Skeleton */}
          <div className="h-32 bg-slate-900/5 rounded-2xl border border-slate-100 flex items-center justify-between px-8">
             <div className="space-y-3">
                <div className="h-3 bg-slate-200 rounded w-20"></div>
                <div className="h-10 bg-slate-200 rounded w-28"></div>
             </div>
             <div className="hidden sm:block h-16 w-px bg-slate-200"></div>
             <div className="space-y-3">
                <div className="h-3 bg-slate-200 rounded w-20 ml-auto"></div>
                <div className="h-12 bg-slate-200 rounded w-32"></div>
             </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex gap-4">
            <div className="h-16 bg-slate-200 rounded-xl flex-[4]"></div>
            <div className="h-16 bg-slate-200 rounded-xl flex-1"></div>
          </div>
        </div>
      </div>

      {/* Reviews Section Skeleton */}
      <div className="my-16 space-y-8">
         <div className="h-40 bg-white border border-slate-100 rounded-2xl"></div>
         <div className="h-60 bg-white border border-slate-100 rounded-2xl"></div>
      </div>

      {/* Related Products Section Skeleton */}
      <div className="mt-16 pt-16 border-t border-slate-100">
        <div className="flex justify-between items-end mb-10">
           <div className="space-y-3">
              <div className="h-8 bg-slate-200 rounded w-48"></div>
              <div className="h-4 bg-slate-100 rounded w-64"></div>
           </div>
           <div className="h-6 bg-slate-200 rounded w-20"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-slate-100 h-[380px] rounded-xl -sm overflow-hidden">
              <div className="h-52 bg-slate-100 w-full"></div>
              <div className="p-4 space-y-4">
                 <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                 <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                 <div className="h-8 bg-slate-50 rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-right" dir="rtl">
      <h2 className="text-2xl font-black mb-4">{error}</h2>
      <button onClick={() => navigate('/products')} className="bg-[#0f172a] text-white px-8 py-3 font-black">العودة للمنتجات</button>
    </div>
  );

  const currentPrice = isPackage ? product.packageSellingPrice : product.pieceSellingPrice;
  const totalPrice = currentPrice * quantity;
  const totalFinalItems = isPackage ? (quantity * unitsPerPkg) : quantity;
  const isOutOfStock = stockAvailable === 0;

return (
  <div className="min-h-screen pb-20 text-right" dir="rtl">

    <nav className=" bg-white border-b border-slate-100 static top-0 z-50">
      <div className=" mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-[#0284c7] font-bold transition-colors">
          <HiOutlineArrowRight className="w-5 h-5" /> الرجوع
        </button>
        <span className="hidden md:block text-[10px] font-black text-slate-400 bg-slate-50 px-3 py-1 border border-slate-100 uppercase tracking-tighter">
          Code: {product.code}
        </span>
      </div>
    </nav>

    <div className=" mx-auto px-6 md:px-12 mt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Product Image Section */}
        <div className="lg:col-span-5 w-full max-w-lg xl:max-w-[50vw] xl:col-span-4 mx-auto lg:mx-0">
          <div className="relative bg-white border border-slate-100 rounded-2xl overflow-hidden group aspect-[4/5] flex items-center justify-center shadow-sm">
            <img 
              loading="lazy" 
              src={product.image?.url || defaultProductImg} 
              alt={product.productName} 
              className={`w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
            />
            {isOutOfStock ? (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-rose-600 text-white px-8 py-3 font-black text-xl rounded-xl">نفذت الكمية</span>
              </div>
            ) : stockAvailable <= 10 ? (
              <div className="absolute top-4 right-4 bg-rose-500 text-white px-3 py-1.5 text-[10px] font-black flex items-center gap-2 rounded-full shadow-lg">
                <HiOutlineFire className="text-sm" /> متبقي {stockAvailable} قطعة فقط!
              </div>
            ) : product.hasDiscount && (
              /* شارة الخصم الجذابة فوق الصورة */
              <div className="absolute top-4 right-4 bg-amber-500 text-slate-900 px-3 py-1.5 text-xs font-black flex items-center gap-1.5 rounded-full shadow-md animate-bounce">
                🔥 عرض لفترة محدودة
              </div>
            )}
          </div>
        </div>

        {/* Product Details Section */}
        <div className="lg:col-span-7 flex flex-col">
          <header className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-[#0284c7] font-black text-[10px] bg-blue-50 px-3 py-1 inline-block tracking-widest rounded-sm">
                {product.category}
              </span>
              
              {/* فكرة فئة العرض الجذابة */}
              {product.hasDiscount && (
                <span className="text-emerald-700 font-black text-[10px] bg-emerald-50 px-3 py-1 inline-block tracking-wide rounded-sm border border-emerald-100 animate-pulse">
                  وفر {product.discountPercentage || 15}% الآن
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-3 leading-tight">{product.productName}</h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-2xl">{product.description || "أعلى معايير الجودة من مصانع أبو الذهب للأغذية."}</p>
            <div className='mt-4'>
               <StarRating rating={product.averageRating} reviewsCount={product.reviewsCount} />
            </div>
          </header>

          {/* Pricing Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button 
              onClick={() => setOrderType('قطعة')}
              className={`p-4 rounded-xl border-2 transition-all relative text-right flex flex-col gap-1 ${orderType === 'قطعة' ? 'border-[#0284c7] bg-white shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            >
              <div className="flex justify-between items-start">
                  <HiOutlineTag className={`w-5 h-5 ${orderType === 'قطعة' ? 'text-[#0284c7]' : 'text-slate-300'}`} />
                  {orderType === 'قطعة' && <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>}
              </div>
              <div className="text-[11px] font-bold text-slate-400 mt-1">سعر القطعة</div>
              <div className="flex items-baseline gap-2">
                <div className="text-xl font-black text-[#0f172a]">{product.pieceSellingPrice} <span className="text-xs">ج.م</span></div>
                {product.hasDiscount && product.oldPiecePrice && (
                  <div className="text-xs font-bold text-slate-400 line-through">{product.oldPiecePrice} ج.م</div>
                )}
              </div>
            </button>

            <button 
              onClick={() => setOrderType('كرتونة')}
              disabled={stockAvailable < unitsPerPkg || product.unit_type !== "كرتونة"}
              className={`p-4 rounded-xl border-2 transition-all relative text-right flex flex-col gap-1 ${orderType === 'كرتونة' ? 'border-[#0284c7] bg-white shadow-md' : 'border-slate-100 bg-white'} ${product.unit_type !== "كرتونة" || stockAvailable < unitsPerPkg ? 'bg-slate-50 opacity-50 cursor-not-allowed grayscale' : 'hover:border-slate-200'}`}
            >
              <div className="flex justify-between items-start">
                  <HiOutlineCube className={`w-5 h-5 ${orderType === 'كرتونة' ? 'text-[#0284c7]' : 'text-slate-300'}`} />
                  {orderType === 'كرتونة' && <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span>}
              </div>
              <div className="text-[11px] font-bold text-slate-400 mt-1">سعر الـ {product.unit_type} ({unitsPerPkg} قطعة)</div>
              <div className="flex items-baseline gap-2">
                <div className="text-xl font-black text-[#0284c7]">{product.packageSellingPrice} <span className="text-xs">ج.م</span></div>
                {product.hasDiscount && product.oldPackagePrice && (
                  <div className="text-xs font-bold text-slate-400 line-through">{product.oldPackagePrice} ج.م</div>
                )}
              </div>
              
              {/* لمسة إضافية: تشجيع شراء الجملة (الكرتونة) */}
              {product.unit_type === "كرتونة" && !isOutOfStock && (
                <div className="absolute -bottom-2.5 left-4 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm">
                  توفير أكبر كرتونة
                </div>
              )}
            </button>
          </div>

          {/* Total & Quantity Card */}
          <div className={`bg-[#0f172a] p-6 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 relative overflow-hidden ${isOutOfStock ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
            
            {/* خلفية جمالية مائية توحي بالعرض */}
            {product.hasDiscount && (
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>
            )}

            <div className="flex flex-col items-center sm:items-start gap-2 z-10">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">الكمية المطلوبة ({isPackage ? product.unit_type : 'قطع'})</div>
              <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                <button onClick={handleIncrease} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-md transition-all font-bold text-xl">+</button>
                <span className="w-16 text-center text-xl font-black font-mono">{quantity}</span>
                <button onClick={handleDecrease} className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-md transition-all font-bold text-xl">-</button>
              </div>
            </div>

            <div className="text-center sm:text-left border-t sm:border-t-0 sm:border-r border-white/10 pt-4 sm:pt-0 sm:pr-8 z-10 flex flex-col items-center sm:items-end">
              <div className="text-slate-400 text-[10px] font-bold mb-1 uppercase">إجمالي المبلغ النهائي</div>
              <div className="text-4xl font-black text-[#38bdf8] font-mono tracking-tight">
                {totalPrice.toLocaleString()} <span className="text-xs text-white ml-1">ج.م</span>
              </div>
              
              {/* تفاصيل التوفير داخل كارت السعر الإجمالي */}
              {product.hasDiscount && quantity > 0 && (
                <div className="text-emerald-400 text-[11px] font-bold mt-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  لقد وفرت مبلعاً رائعاً بهذا العرض! 🎉
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleAddToCart} 
              disabled={isOutOfStock} 
              className="flex-[4] bg-[#0284c7] text-white py-5 rounded-xl flex items-center justify-center gap-3 hover:bg-[#0369a1] transition-all font-black text-lg shadow-lg active:scale-[0.98]"
            >
              <HiOutlineShoppingCart className="w-6 h-6" /> تأكيد الإضافة للسلة
            </button>
            <button className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-sm">
              <HiOutlineHeart className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Reviews & Related Products Sections */}
    <div className=' mx-auto px-6 md:px-12'>
        <div className="my-16 grid grid-cols-1 gap-8">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <ReviewsList productId={product._id} reviews={reviews} setReviews={setReviews} loading={subloading} setLoading={setSubLoading}/>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <ReviewBox productId={product._id} onReviewAdded={setReviews} reviews={reviews} />
          </div>
        </div>
              
{/* offer And combo */}
<div className="mt-16">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    {/* البنر الأول: العروض والخصومات العامة */}
    <div
      onClick={() => navigate('/العروض_والخصومات')}
      className="cursor-pointer relative overflow-hidden rounded-2xl p-6 md:p-8 text-white transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] group flex flex-col justify-between min-h-[200px]"
      style={{ background: '#0284c7' }}
    >
      <div className="absolute w-48 h-48 rounded-full pointer-events-none -right-12 -top-12" style={{ background: 'rgba(255,255,255,0.07)' }}></div>
      <div className="absolute w-28 h-28 rounded-full pointer-events-none -left-8 -bottom-8" style={{ background: 'rgba(0,0,0,0.10)' }}></div>

      <div className="absolute bottom-4 left-4 pointer-events-none" style={{ opacity: 0.07 }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-24 h-24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 14l-4-4 4-4m6 8l4-4-4-4M14 5l-4 14" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full w-fit" style={{ background: 'rgba(255,255,255,0.15)', border: '0.5px solid rgba(255,255,255,0.25)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
          لفترة محدودة
        </span>
        <h4 className="text-xl md:text-2xl font-black tracking-wide leading-snug">
          مهرجان التوفير من أبو الذهب!
        </h4>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)' }}>
          لا تفوت أقوى الخصومات والتخفيضات الكبرى على المنتجات الغذائية.
        </p>
      </div>

      <div className="relative z-10 mt-6">
        <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 group-hover:gap-4 w-full sm:w-auto justify-center sm:justify-start" style={{ color: '#0284c7' }}>
          تصفح التخفيضات الآن
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>
    </div>


    {/* البنر الثاني: عروض الكومبو */}
    <div
      onClick={() => navigate('/العروض_والخصومات_الكومبو')}
      className="cursor-pointer relative overflow-hidden rounded-2xl p-6 md:p-8 text-white transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] group flex flex-col justify-between min-h-[200px]"
      style={{ background: '#0272ae' }}
    >
      <div className="absolute w-48 h-48 rounded-full pointer-events-none -right-12 -top-12" style={{ background: 'rgba(255,255,255,0.07)' }}></div>
      <div className="absolute w-28 h-28 rounded-full pointer-events-none -left-8 -bottom-8" style={{ background: 'rgba(0,0,0,0.14)' }}></div>

      <div className="absolute bottom-4 left-4 pointer-events-none" style={{ opacity: 0.07 }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-24 h-24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col gap-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full w-fit bg-emerald-500 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          أعلى توفير
        </span>
        <h4 className="text-xl md:text-2xl font-black tracking-wide leading-snug">
          عروض الكومبو والباقات الكبرى!
        </h4>
        <p className="text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)' }}>
          اشترِ مجموعات كاملة ووفر أكثر مع كراتين التوفير وباقات التشكيل الاقتصادية.
        </p>
      </div>

      <div className="relative z-10 mt-6">
        <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 group-hover:gap-4 w-full sm:w-auto justify-center sm:justify-start" style={{ color: '#0272ae' }}>
          اكتشف باقات الكومبو
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </div>
      </div>
    </div>

  </div>
</div>

        {/* Related Products */}
        <section className="mt-16 border-t border-slate-100 pt-16">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-[#0f172a] flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#0284c7] rounded-full inline-block"></span>
                منتجات ذات صلة
              </h3>
              <p className="text-sm text-slate-400 font-medium">اكتشف المزيد من قسم {product.category}</p>
            </div>
            <button 
              onClick={() => navigate(`/كل_المنتجات`)}
              className="text-[#0284c7] font-black text-sm hover:underline underline-offset-8"
            >
              عرض الكل
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.length > 0 ? (
              relatedProducts
                .filter(item => item._id !== product._id)
                .map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-xl aspect-[3/4] animate-pulse"></div>
              ))
            )}
          </div>
        </section>
    </div>
  </div>
);
};

export default ProductDetails;