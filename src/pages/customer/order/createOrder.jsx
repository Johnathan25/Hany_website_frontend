import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, MapPin, CreditCard, Upload, AlertCircle, CheckCircle2, Search, Navigation } from 'lucide-react';
import api from '../../../services/api';
import { showAlert } from '../../../services/alert';
import { MyContext } from '../../../context/cartContext';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Checkout = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [proofFile, setProofFile] = useState(null);
  const [walletNumber, setWalletNumber] = useState(["01270857659"]);
  const { setCounts } = useContext(MyContext);
  
const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0); // حفظ النسبة المئوية الراجعة من الباك إند (مثلاً 10)
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    phone: '',
    city: 'القاهرة',
    street: '',
    building: '',
    region: "",
    paymentMethod: 'cash',
    walletPhone: ''
  });
  const { about } = useContext(MyContext);


const locations = useMemo(() => {
  return about[0]?.shippingAddress  ?? ["القاهرة", "الجيزة", "القليوبية", "السادس من اكتوبر"];
}, [about])
  const STORE_LOCATION = { lat: 30.148119, lng: 31.270578 }; // بهتيم

  const [selectedLocation, setSelectedLocation] = useState(null);
  
  const [shippingPrice, setShippingPrice] = useState(50);
  const [distance, setDistance] = useState(0);
  const [gpsLoading, setGpsLoading] = useState(false); 

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const debounceTimeoutRef = useRef(null);
  const LOCATION_IQ_TOKEN = "pk.00f3bd5a0f7989e01e474c054256f12b";

        useEffect(() => {
      document.title = " إتمام الطلب - نظام أبو الدهب";
    }, []);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user/cart');
        setCartData(response.data.items || []);
      } catch (err) {
        console.error("Error fetching cart", err);
        showAlert({ title: "فشل تحميل بيانات السلة، يرجى المحاولة لاحقاً", icon: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response2 = await api.get('/about/wallet');
        setWalletNumber(response2?.data?.walletNumbers || ["01270857659"]);
      } catch (err) {
        console.error("Error fetching wallet", err);
      }
    };
    fetchWallet();
  }, []);

const getRoadDistance = async (
  userLat,
  userLng,
  storeLat,
  storeLng
) => {
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/` +
      `${storeLng},${storeLat};${userLng},${userLat}` +
      `?overview=false`
    );

    const data = await res.json();

    console.log(data)
    if (data.routes && data.routes.length > 0) {
      // بالمتر → كم
      const distanceKm = data.routes[0].distance / 1000;

      return Number(distanceKm.toFixed(2));
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

  const isWithinDeliveryZone =async (lat, lng) => {
    const dist = await  getRoadDistance(STORE_LOCATION.lat, STORE_LOCATION.lng, lat, lng);
    if (dist === null) return true;
    return dist <=  ( about[0]?.allowedDistance || 70); 
  };

  const getFallbackShippingPrice = (city) => {
  if (!city) return 50;

  if (city.includes("القاهرة")) return 60;
  if (city.includes("Cairo")) return 60;

  if (
    city.includes("أكتوبر") ||
    city.includes("6 أكتوبر") ||
    city.includes("6 October")
  ) {
    return 100;
  }

  return 50; 
};

const handleLocationSelect = async (lat, lng) => {
if (!lat || !lng) {
      const price = getFallbackShippingPrice(customerInfo.city);
      setShippingPrice(price);
      return;
    }
  const allowed = await isWithinDeliveryZone(lat, lng);

  if (!allowed) {
    return showAlert({
      title: "عذراً، خدمة التوصيل غير متوفرة لهذه المنطقة.",
      icon: "warning"
    });
  }



  setSelectedLocation({ lat, lng });
const dist = await getRoadDistance(STORE_LOCATION.lat, STORE_LOCATION.lng, lat, lng);
    if (dist) {
      setDistance(dist);
      const calculatedPrice = Math.ceil(Math.min(100, 20 + dist * (about[0]?.pricePerKm ||4)));
      setShippingPrice(calculatedPrice);
    } else {
      // Fallback في حال فشل حساب المسافة بدقة من الخريطة
      const price = getFallbackShippingPrice(customerInfo.city);
      setShippingPrice(price);
      setDistance(0.1); // قيمة وهمية لتخطي الفحص
    }
};

const fetchAddressFromCoords = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=${LOCATION_IQ_TOKEN}&lat=${lat}&lon=${lng}&format=json&accept-language=ar`
    );

    if (!response.ok) throw new Error("Reverse geocoding failed");

    const data = await response.json();

    console.log(data)
    if (data) {
      const address = data.address || {};
    console.log(address)

      const street =
        address.road ||
        address.pedestrian ||
        address.residential ||
        "";

      const region =
        address.suburb ||
        address.city ||
        address.neighbourhood ||
        address.quarter ||
        address.city_district ||
        "";

      // تنظيف اسم المدينة القادم من الـ API (إزالة كلمة محافظة إن وجدت ليتطابق مع القائمة)
      let rawCity =  address.state ?? address.city ?? address.county ?? "القليوبية";
      let city = rawCity.replace("محافظة ", "").trim();

      // التأكد من أن المدينة المستخرجة موجودة ضمن الخيارات المتاحة لديك، وإلا نضع الافتراضي
      if (!locations.includes(city)) {
        // محاولة مطابقة بديلة (مثلا لو رجع "Cairo" أو "Giza")
        if (city.includes("القاهرة") || rawCity.includes("Cairo")) city = "القاهرة";
        else if (city.includes("الجيزة") || rawCity.includes("Giza")) city = "الجيزة";
        else if (city.includes("القليوبية")) city = "القليوبية";
        else if (city.includes("أكتوبر") || city.includes("6 October")) city = "السادس من اكتوبر";
        else city = "القاهرة"; // الافتراضي
      }

      handleLocationSelect(lat, lng);

      setCustomerInfo((prev) => ({
        ...prev,
        city,
        region,
        street,
      }));
    }
  } catch (error) {
    const fallbackCity = "القاهرة";

setCustomerInfo((prev) => ({
  ...prev,
  city: fallbackCity,
  region: "منطقة غير محددة (Fallback)",
  street: "غير محدد",
}));

const price = getFallbackShippingPrice(fallbackCity);
setShippingPrice(price);
setDistance(0);
    console.error("Error fetching address text:", error);

    handleLocationSelect(lat, lng);

    setCustomerInfo((prev) => ({
      ...prev,
      region: "منطقة محددة من الخريطة",
      street: "شارع محدد من الخريطة",
    }));
  }
};
  // دالة التقاط الـ GPS من المتصفح
  const handleGetCurrentLocation = () => {

    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      return showAlert({ 
        title: "المتصفح يمنع تحديد الموقع لأن الموقع يعمل برابط غير مشفر (HTTP). يرجى اختيار موقعك يدوياً من الخريطة أو البحث.", 
        icon: "warning" 
      });
    } 
    if (!navigator.geolocation) {
      return showAlert({ title: "خاصية تحديد الموقع غير مدعومة في متصفحك", icon: "error" });
    }



    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // التحقق الجغرافي السريع قبل مناداة الـ API
        const allowed = await isWithinDeliveryZone(
  latitude,
  longitude
);

if (!allowed){
          setGpsLoading(false);
          return showAlert({
            title: "عذراً، موقعك الحالي خارج نطاق خدمة التوصيل (متاح القاهرة والجيزة والقليوبية وأكتوبر فقط).",
            icon: "warning"
          });
        }

        // جلب العنوان النصي الفعلي وملء الـ fields
        await fetchAddressFromCoords(latitude, longitude);
        setGpsLoading(false);
        showAlert({ title: "تم قراءة عنوانك الحالي تلقائياً وحساب الشحن!", icon: "success" });
      },
      (error) => {
        console.error("Geolocation error:", error);
        setGpsLoading(false);
        showAlert({ 
          title: "فشل الوصول لموقعك الحالي. يرجى تفعيل الـ GPS في متصفحك أو اختيار موقعك يدوياً.", 
          icon: "warning" 
        });
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  function LocationPicker() {
    useMapEvents({
      async click(e) {
await fetchAddressFromCoords(
  e.latlng.lat,
  e.latlng.lng
);
      },
    });
    return null;
  }

  function MapController() {
    const map = useMap();
    useEffect(() => {
      if (selectedLocation) {
        map.setView([selectedLocation.lat, selectedLocation.lng], 16);
      }
    }, [selectedLocation, map]);
    return null;
  }

const handleSearch = (e) => {
  const value = e.target.value;
  setSearchQuery(value);

  if (debounceTimeoutRef.current) {
    clearTimeout(debounceTimeoutRef.current);
  }

  if (value.trim().length < 3) {
    setSearchResults([]);
    return;
  }

  debounceTimeoutRef.current = setTimeout(async () => {
    try {

      const viewbox = "30.9000,29.6000,31.7000,30.5000"; 


      const optimizedQuery = `${value} , Egypt`;

      const response = await fetch(
        `https://us1.locationiq.com/v1/autocomplete?key=${LOCATION_IQ_TOKEN}&q=${encodeURIComponent(optimizedQuery)}&format=json&accept-language=ar&viewbox=${viewbox}&bounded=1&limit=50`
      );

      
      
      if (!response.ok) throw new Error("Autocomplete API error");
      const data = await response.json();

      if (Array.isArray(data)) {
        const formattedResults = data.map(item => ({
          label: item.display_name,
          y: parseFloat(item.lat),
          x: parseFloat(item.lon),
          address: item.address 
        })).filter(result => isWithinDeliveryZone(result.y, result.x));

        setSearchResults(formattedResults);
      }
    } catch (error) {
      console.error("Search error", error);
      setSearchResults([]);
    }
  }, 400); 
};

  const selectSearchResult = (result) => {
    const { x: lng, y: lat, label } = result;
   handleLocationSelect(lat, lng);
fetchAddressFromCoords(lat, lng);
    setSearchResults([]);
    setSearchQuery('');
  };

const calculateTotal = () => {
  return cartData.reduce((total, item) => {
    let price = 0;


    if (item.isOffer === true || item.isOffer === 'true') {

      price = item.offerPrice !== null ? item.offerPrice : item.product.packageSellingPrice;
    }
    else if(item.isCombo === true || item.isCombo === 'true'){
      price = item.offerPrice !== null ? item.offerPrice : item.product.packageSellingPrice;
   
    }
    else {

      price = item.unit_type === "قطعة" 
        ? item.product.pieceSellingPrice 
        : item.product.packageSellingPrice;
    }


    return total + (price * item.quantity);
  }, 0);
};

  const validateEgyptPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return /^01[0-9]{9}$/.test(cleaned);
  };

  const validateName = (name) => name.trim().length >= 3;

  const validateAddress = (info) => {
    return info.city && info.region.trim().length >= 2 && info.street.trim().length >= 3;
  };

  const handleInputChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };


  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      return showAlert({ title: "يرجى إدخال كود الخصم أولاً", icon: "warning" });
    }

    try {
      setCouponLoading(true);

      const response = await api.post('/coupons/apply', { code: couponCode });


      if (response.data.success) {
        setDiscountPercent(response.data.discount || 0);
        setCouponApplied(true);
        showAlert({ title: response.data.message || "تم تطبيق الكوبون بنجاح!", icon: "success" });
      }
    } catch (err) {
      console.error("Coupon error", err);

      const errorMessage = err.response?.data?.message || "كود الكوبون غير صحيح";
      showAlert({ title: errorMessage, icon: "error" });
      setDiscountPercent(0);
      setCouponApplied(false);
    } finally {
      setCouponLoading(false);
    }
  };



const handleCheckout = async (e) => {
    e.preventDefault();

    if (cartData.length === 0) {
      return showAlert({ title: "السلة فارغة، أضف بعض المنتجات أولاً", icon: "warning" });
    }
    if (!validateName(customerInfo.customerName)) {
      return showAlert({ title: "يرجى إدخال اسم صحيح (3 حروف على الأقل)", icon: "warning" });
    }
    if (!validateEgyptPhone(customerInfo.phone)) {
      return showAlert({ title: "رقم الهاتف غير صحيح (يجب أن يكون 11 رقم ويبدأ بـ 01)", icon: "warning" });
    }
    if (!validateAddress(customerInfo)) {
      return showAlert({ title: "يرجى إدخال عنوان صحيح كامل التفاصيل بالأسفل", icon: "warning" });
    }

    if (distance <= 0) {
      return showAlert({ title: "يرجى تحديد العنوان من الخريطه او استخدم عنوانك الحالي ", icon: "warning" });
    }

    if (customerInfo.paymentMethod === "wallet") {
      if (!validateEgyptPhone(customerInfo.walletPhone)) {
        return showAlert({ title: "رقم المحفظة غير صحيح", icon: "warning" });
      }
      if (!proofFile) {
        return showAlert({ title: "يرجى رفع صورة التحويل", icon: "warning" });
      }
    }


    let finalShippingPrice = shippingPrice;
    if (distance <= 0 && !selectedLocation) {
      finalShippingPrice = getFallbackShippingPrice(customerInfo.city);
    }
    setOrderLoading(true);
    const formData = new FormData();
    formData.append('customerName', customerInfo.customerName);
    formData.append('phone', customerInfo.phone);
formData.append('shippingPrice', finalShippingPrice);
    formData.append('discount', discountAmount);
    formData.append('address', JSON.stringify({
      city: customerInfo.city,
      street: customerInfo.street,
      building: customerInfo.building,
      region: customerInfo.region
    }));

    // ================= الضبط المطور لـ الـ Items المتوافقة مع المنتجات والكومبو =================
    const formattedItems = cartData.map(item => {
      let currentPrice = 0;
      const isComboItem = item.isCombo === true || item.isCombo === 'true';
      const isOfferItem = item.isOffer === true || item.isOffer === 'true';

      // 1. حساب السعر الفعلي بناءً على نوع العنصر لحمايته من الـ Crash
      if (isComboItem || isOfferItem) {
        // لو كومبو أو عرض بناخد الـ offerPrice مباشرة، وإذا لم يوجد نعود لسعر المنتج كـ fallback
        currentPrice = item.offerPrice !== null ? item.offerPrice : (item.product?.packageSellingPrice || 0);
      } else {
        currentPrice = item.unit_type === "قطعة" 
          ? (item.product?.pieceSellingPrice || 0)
          : (item.product?.packageSellingPrice || 0);
      }

      // 2. بناء الـ Object المرسل مع حماية البيانات وحساب الـ Subtotal
      return {
        // لو كومبو بنرسل الـ comboId والـ product بـ null، والعكس صحيح للمنتج العادي
        product: isComboItem ? null : (item.product?._id || item.product),
        comboId: isComboItem ? (item.comboId?._id || item.comboId) : null,
        
        // جلب الاسم الصحيح سواء من الكومبو أو من المنتج
        productName: isComboItem ? (item.title || item.comboId?.title || "عرض كومبو") : item.product?.productName,
        
        unit_type: isComboItem ? "عرض" : (item.unit_type || "علبة"),
        quantity: item.quantity,
        price: currentPrice,
        subtotal: currentPrice * item.quantity,
        isOffer: isOfferItem,
        isCombo: isComboItem
      };
    });
    
    formData.append('items', JSON.stringify(formattedItems));
    // ============================================================================

    formData.append('payment', JSON.stringify({
      method: customerInfo.paymentMethod,
      walletPhone: customerInfo.walletPhone
    }));

    if (proofFile) formData.append('file', proofFile);

    try {
      await api.post('/order/v2', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCounts(0);
      showAlert({ title: "تم استلام طلبك بنجاح! سنتواصل معك قريباً", icon: "success" });
      try {
        localStorage.setItem("cart", JSON.stringify([]));
      } catch (err) {
        console.warn("Cart clear skip");
      }
      setTimeout(() => { navigate('/'); }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "عذراً، حدث خطأ أثناء تنفيذ الطلب";
      showAlert({ title: errorMessage, icon: "error" });
    } finally {
      setOrderLoading(false);
    }
  };



  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950"></div>
    </div>
  );

const subTotal = calculateTotal();
  

  const discountAmount = Math.ceil(((subTotal + shippingPrice ) * discountPercent) / 100); 
  

  const total = Math.max(0, subTotal + shippingPrice - discountAmount);
  return (
    <div className="mx-auto p-4 md:p-10 font-cairo bg-[#fafafa]" dir="rtl">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b border-gray-200 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#0f172a] rounded-md flex items-center justify-center">
            <ShoppingCart className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">إتمام الطلب</h1>
            <p className="text-sm text-gray-500 font-bold mt-1">يرجى تحديد موقعك بدقة (متاح القاهرة، الجيزة، القليوبية، أكتوبر فقط)</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-8">
          
          {/* قسم المعلومات الشخصية */}
          <section className="bg-white p-8 rounded-md border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 text-[#0f172a]">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <User size={18} className="text-[#0284c7]" />
              </div>
              <h3 className="font-black text-xl">المعلومات الشخصية</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 mr-2">اسم العميل</label>
                <input 
                  name="customerName" 
                  placeholder="الاسم الثلاثي..." 
                  onChange={handleInputChange} 
                  required 
                  className="w-full bg-slate-50/50 border border-gray-200 rounded-md px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#0284c7] focus:bg-white transition-all shadow-sm" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 mr-2">رقم الهاتف</label>
                <input 
                  name="phone" 
                  placeholder="01xxxxxxxxx" 
                  onChange={handleInputChange} 
                  required 
                  className="w-full bg-slate-50/50 border border-gray-200 rounded-md px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#0284c7] focus:bg-white transition-all shadow-sm" 
                />
              </div>
            </div>
          </section>

          {/* تحديد موقع التوصيل */}
          <section className="bg-white p-8 rounded-md border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-[#0f172a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <MapPin size={18} className="text-[#0284c7]" />
                </div>
                <h3 className="font-black text-xl">تحديد موقع التوصيل على الخريطة</h3>
              </div>
              
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={gpsLoading}
                className="flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white px-4 py-2.5 rounded-md text-xs font-black transition-all shadow-sm active:scale-95 disabled:opacity-60"
              >
                {gpsLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Navigation size={14} />
                )}
                استخدم موقعي الحالي الآن (GPS)
              </button>
            </div>

            {/* صندوق البحث المحمي */}
            <div className="relative mb-4 z-10">
              <div className="flex items-center bg-slate-50 border border-gray-200 rounded-md px-4 py-3 focus-within:border-[#0284c7] transition-all">
                <Search size={18} className="text-gray-400 ml-2" />
                <input
                  type="text"
                  placeholder="ابحث عن منطقتك (مثال: المعادي، المهندسين، شبرا)..."
                  value={searchQuery}
                  onChange={handleSearch}
                    onBlur={() => {
    setTimeout(() => {
      setSearchResults([]);
    }, 200);
  }}
                  className="w-full bg-transparent text-sm font-bold focus:outline-none"
                />
              </div>
              
              {searchResults.length > 0 && (
                <div className="absolute top-full right-0 left-0 bg-white border border-gray-200 mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectSearchResult(result)}
                  
                      className="p-3 text-sm font-bold text-gray-700 hover:bg-slate-50 cursor-pointer border-b last:border-0 border-gray-100"
                    >
                      {result.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <MapContainer
                center={[30.1236, 31.2468]}
                zoom={13}
                style={{ height: "350px", width: "100%" }}
                className="rounded-xl overflow-hidden z-0"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker />
                <MapController />
                {selectedLocation && (
                  <Marker position={[selectedLocation.lat, selectedLocation.lng]} />
                )}
              </MapContainer>

              {distance > 0 && (
                <div className="mt-3 p-3 bg-blue-50/50 rounded-md border border-blue-100 text-sm font-bold text-slate-800">
                   المسافة عن المتجر: {distance.toFixed(2)} كم |  
                  <span className="text-[#0284c7] mr-1">تكلفة الشحن: {shippingPrice} جنيه</span>
                </div>
              )}
            </div>

     <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-md my-4" dir="rtl">
  <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
  <div>
    <h4 className="text-xs font-black text-amber-800">تنبيه هام للشحن</h4>
    <p className="text-xs font-bold text-amber-700 leading-relaxed mt-0.5">
      يرجى كتابة العنوان بشكل مفصل ودقيق في الحقول أدناه (رقم المبنى، الشارع، والدور) لضمان وصول المندوب إليك بأسرع وقت ممكن.
    </p>
  </div>
</div>

            {/* الحقول النصية للعنوان التي تعبأ تلقائياً للباك اند */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 mr-2">المدينة / المحافظة</label>
                      <select
                        name="city"
                        value={customerInfo.city}
                        onChange={handleInputChange} 
                        className="w-full bg-slate-50/50 border border-gray-200 rounded-md px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#0284c7] transition-all"
                      >
                        {locations.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 mr-2">المنطقة / الحي</label>
                <input
                  name="region"
                  value={customerInfo.region} 
                  placeholder="يرجى إدخال اسم المنطقة أو الحي..." 
                  onChange={handleInputChange} 
                  required 
                  className="w-full bg-slate-50/50 border border-gray-200 rounded-md px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#0284c7]" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-gray-400 mr-2">اسم الشارع</label>
                <input
                  name="street"
                  value={customerInfo.street} 
                  placeholder="اسم الشارع بالتفصيل وعلامة مميزة..." 
                  onChange={handleInputChange} 
                  required 
                  className="w-full bg-slate-50/50 border border-gray-200 rounded-md px-5 py-4 text-sm font-bold focus:outline-none focus:border-[#0284c7]" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <input name="building" value={customerInfo.building} placeholder="رقم المبنى " onChange={handleInputChange} className="bg-slate-50/50 border border-gray-200 rounded-md px-5 py-4 text-sm font-bold" />
                <input name="floor" value={customerInfo.floor || ''} placeholder="الدور / الشقة " onChange={handleInputChange} className="bg-slate-50/50 border border-gray-200 rounded-md px-5 py-4 text-sm font-bold" />
              </div>
            </div>
          </section>

          {/* طريقة الدفع */}
          <section className="bg-white p-8 rounded-md border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6 text-[#0f172a]">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <CreditCard size={18} className="text-[#0284c7]" />
              </div>
              <h3 className="font-black text-xl">وسيلة الدفع</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <label className={`flex flex-col p-6 rounded-md border-2 cursor-pointer transition-all ${customerInfo.paymentMethod === 'cash' ? 'border-[#0284c7] bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                <input type="radio" name="paymentMethod" value="cash" className="hidden" onChange={handleInputChange} checked={customerInfo.paymentMethod === 'cash'} />
                <span className="font-black text-slate-900">الدفع نقداً</span>
                <span className="text-[10px] text-gray-500 font-bold mt-1">الدفع كاش عند استلام الطلب</span>
              </label>
              
              <label className={`flex flex-col p-6 rounded-md border-2 cursor-pointer transition-all ${customerInfo.paymentMethod === 'wallet' ? 'border-[#0284c7] bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}`}>
                <input type="radio" name="paymentMethod" value="wallet" className="hidden" onChange={handleInputChange} checked={customerInfo.paymentMethod === 'wallet'} />
                <span className="font-black text-slate-900">محفظة إلكترونية</span>
                <span className="text-[10px] text-gray-500 font-bold mt-1">فودافون كاش / اتصالات كاش</span>
              </label>
            </div>

            {customerInfo.paymentMethod === 'wallet' && (
              <div className="space-y-4 p-6 bg-[#0f172a] rounded-md border border-blue-900 shadow-2xl">
                <div className="flex items-start gap-3 text-white">
                  <AlertCircle size={20} className="text-[#0284c7]" />
                  <p className="text-xs font-bold leading-relaxed">
                    حول المبلغ إلى أي رقم من هذه الأرقام: 
                    <span className="text-[#0284c7] flex flex-col md:flex-row gap-2 items-center text-lg font-black underline mx-1">
                      {walletNumber.map((e, index) => <span key={index}>{e}</span>)}
                    </span> <br/>
                    ثم أرفق صورة من عملية التحويل لتأكيد الطلب.
                  </p>
                </div>
                <input 
                  name="walletPhone" 
                  placeholder="الرقم الذي تم التحويل منه" 
                  onChange={handleInputChange} 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#0284c7]" 
                />
                <div className="relative border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:border-[#0284c7] transition-all cursor-pointer bg-slate-800/50">
                  <input type="file" accept="image/*" onChange={(e) => setProofFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="flex flex-col items-center gap-3">
                    {proofFile ? <CheckCircle2 className="text-green-400" size={32} /> : <Upload className="text-slate-500" size={32} />}
                    <span className="text-xs font-black text-slate-300">{proofFile ? proofFile.name : "اضغط لرفع صورة التحويل"}</span>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>

{/* الفاتورة */}
        <div dir='ltr' className="lg:col-span-1">
          <div className="relative bg-white pt-10 pb-14 px-8 rounded-t-md border border-gray-100 sticky top-24 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-[#0f172a]"></div>
            
            <div className="text-center mb-10">
              <h2 className="text-2xl font-black text-[#0f172a] uppercase tracking-tighter">فاتورة الطلب</h2>
              <div className="flex justify-center items-center gap-2 mt-2">
                <span className="h-[1px] w-6 bg-gray-200"></span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Summary</span>
                <span className="h-[1px] w-6 bg-gray-200"></span>
              </div>
            </div>

            {/* حقل كود الخصم (Coupon) متناسق تماماً */}
            <div className="mb-6 bg-slate-50 p-4 rounded-md border border-slate-100" dir="rtl">
              <label className="block text-xs font-black text-gray-400 mb-2 mr-1 text-right">كود الخصم (Coupon)</label>
              <div className="flex gap-2" dir="rtl">
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || couponApplied}
                  className="bg-[#0f172a] text-white px-4 py-2.5 rounded-md text-xs font-black hover:bg-black transition-all disabled:opacity-50 shrink-0"
                >
                  {couponLoading ? "..." : couponApplied ? "تم الحصول علي الخصم" : "احصل علي الخصم"}
                </button>
                <input
                  type="text"
                  placeholder="ENTER CODE"
                  value={couponCode}
                  disabled={couponApplied}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm font-bold uppercase tracking-wider focus:outline-none focus:border-[#0284c7] text-left disabled:bg-slate-100 disabled:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-slate-900">
                  {subTotal.toLocaleString()} <small className="text-[10px] text-gray-400 font-bold mr-1">EGP</small>
                </span>
                <span className="text-gray-500 font-bold text-sm">الإجمالي الفرعي</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-slate-900">
                  {shippingPrice} EGP
                </span>
                <span className="text-gray-500 font-bold text-sm">الشحن</span>
              </div>


              {discountPercent > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="text-lg font-black">
                    -{discountAmount} EGP <small className="text-xs font-bold text-green-500">({discountPercent}%)</small>
                  </span>
                  <span className="font-bold text-sm">الخصم</span>
                </div>
              )}

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-slate-100"></div>
                </div>
              </div>

              <div className="flex justify-between items-end bg-slate-50 p-5 rounded-md border border-slate-100">
                <div className="text-left">
                  <div className="flex items-baseline gap-1 leading-none">
                    <span className="text-4xl font-black text-[#0f172a] tracking-tighter">
                      {total.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black text-slate-400">EGP</span>
                  </div>
                  <p className="text-[8px] text-gray-400 font-black mt-2 tracking-widest uppercase">Total To Pay</p>
                </div>
                <span className="text-lg font-black text-[#0f172a]">الإجمالي الكلي</span>
              </div>
            </div>

            <div className="mt-10">
              <button 
                type="submit" 
                disabled={orderLoading} 
                className="w-full bg-[#0f172a] text-white py-5 rounded-md font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
              >
                {orderLoading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <CheckCircle2 size={16} className="text-[#0284c7]" />
                    تأكيد طلبك الآن
                  </>
                )}
              </button>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-4 flex">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-[#fafafa] rotate-45 transform origin-top-left -mt-2 border-l border-t border-gray-100"></div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;