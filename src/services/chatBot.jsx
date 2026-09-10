import { useState, useEffect, useRef } from "react";
import { 
  MessageCircle, X, Send, HelpCircle, Sparkles, Trash2, Package, Info, Bot, 
  Tag, Archive, CheckCircle, XCircle, LayoutGrid, Truck, Calendar, DollarSign,
  Maximize2, Minimize2 
} from "lucide-react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import { RiArrowRightCircleFill } from "react-icons/ri";

const foodStoreFaq = [
  {
    id: "order_how",
    keywords: ["اشتري", "شراء", "اطلب", "طلب", "عايز", "ازاي", "طريقه", "اعمل", "اوردر", "تسوق", "خطوات", "اضيف"],
    answer: "تقدر تطلب بسهولة! اختر المنتج اللي يعجبك، حدد الكمية، وأضفه للسلة، وبعدين اضغط على زرار السلة فوق وكمل البيانات (الاسم، العنوان، ورقم التليفون) واضغط إتمام الطلب."
  },
     {
    id: "who_are_you",
    keywords: ["مين" ,"من انت"],
    answer: "انا عباره عن شات بوت تم تجهيزي للرد علي استفسارات العملاء"
  },
  {
    id: "frozen_chicken",
    keywords: ["فراخ", "بانيه", "شيش", "طاووق", "صدور", "أوراك", "دواجن", "كوكى", "اطياف", "ناجتس", "استربس", "أجنحة"],
    answer: "قسم الدواجن عندنا مميز جداً! بنوفر صدور مخلية، بانيه متبل وجاهز على القلي، شيش طاووق، وفراخ كاملة. كل المنتجات بتوصلك مبردة أو مجمدة ومغلفة سحب هواء للحفاظ على الطعم طازج."
  },
  {
    id: "meat_products",
    keywords: ["لحمه", "لحوم", "اطياب", "كفته", "برجر", "سجق", "بوفتيك", "استيك", "شاورما", "كندوز", "مستورد", "بلدي"],
    answer: "نوفر تشكيلة فاخرة من اللحوم (اطياب، كفتة جاهزة للسيخ، برجر لحم صافي، وسجق شرقي). متاح لحوم بلدي طازجة ومستوردة درجة أولى مغلفة ومجمّدة بأعلى معايير الجودة."
  },
  {
    id: "vegetables_fries",
    keywords: ["خضار", "بسلة", "فاصوليا", "ملوخية", "بامية", "بطاطس", "بوم", "فريت", "فارم", "ستس", "مجمدات", "شوربة"],
    answer: "عندنا خضار مجمد (ملوخية خضراء، بسلة بالجزر، بامية ممتازة) مفرز بأحدث تقنيات الصدمة الكهربائية للحفاظ على الفيتامينات، بالإضافة للبطاطس نصف المقلية الجاهزة للتحمير فوراً."
  },
  {
    id: "cart_issues",
    keywords: ["سلة", "السلة", "ازود", "اضافة", "كارت", "cart", "سلتي", "تمسح", "تعديل", "الكمية"],
    answer: "لو حابب تزود أو تعدل منتجاتك، اضغط على أيقونة السلة أعلى الشاشة، تقدر تزود عدد القطع أو تمسح أي منتج مش محتاجه قبل ما تروح لصفحة الدفع."
  },
  {
    id: "shipping_time",
    keywords: ["توصيل", "دليفري", "شحن", "يوصل", "امتى", "وقت", "ساعة", "يوم", "يومين", "ميعاد", "المندوب"],
    answer: "علشان دي مواد غذائية، شحننا سريع وفي عربيات مبردة ومخصصة للمجمدات. الأوردر بيوصلك خلال 24 إلى 48 ساعة "
  },
  {
    id: "shipping_fees",
    keywords: ["مصاريف", "الشحن", "بكام", "توصيلها", "كم", "أجرة", "تمن", "المحافظات", "قاهرة", "جيزة", "اسكندرية"],
    answer: "مصاريف الشحن بتتحسب تلقائياً في صفحة الدفع على حسب محافظتك ومنطقتك. تظهر لك التكلفة بالمليم قبل ما تؤكد الطلب."
  },
  {
    id: "tracking_order",
    keywords: ["تتبع", " الاوردر ", "اشوف", "فين", "حالة", "الطلب", "اوردري", "شحنوه", "طلع", "فينك", "مكان"],
    answer: "تقدر تتابع حالة أوردرك (قيد المراجعة - جاري التجهيز - مع المندوب) من خلال الدخول على حسابك ثم صفحة 'تتبع الطلب' وهيظهرلك تحديث لحظي."
  },
  {
    id: "discounts_coupons",
    keywords: ["خصم", "خصومات", "الخصم", "كوبون", "كوبونات", "تخفيض", "عروض", "عرض", "كومبو", "وفر", "توفير", "رخيص", "هدية", "اكواد" ,"العروض"],
    answer: "أبو الدهب دايماً مدلع زباينه! ادخل قسم 'العروض والكومبو' هتلاقي باقات توفير ، وكمان تابع المجلات أو الكوبونات  من الصفحة الرئيسيه "
  },
  {
    id: "payment_methods",
    keywords: ["دفع", "الدفع", "فيزا", "كاش", "بطاقة", "ائتمان", "طرق", "ادفع", "فودافون", "انستا", "باي"],
    answer: "تقدر تدفع كاش نقداً عند الاستلام للمندوب بعد ما تعاين حاجتك، أو تدفع ببطاقتك الائتمانية (فيزا / ماستر كارد) أونلاين بأمان تام أثناء الطلب."
  },
  {
    id: "cancel_order",
    keywords: ["الغاء", "إلغاء", "الغي", "احذف", "تراجع", "مش", "عايز", "بطلت"],
    answer: "لو غيرت رأيك وحابب تلغي الطلب، يرجى التواصل مع الدعم الفني فوراً من خلال الواتساب قبل ما الأوردر يتجهز ويخرج مع عربيات الشحن المبردة. و في حاله ان الاورد لسه في حاله قيد الأنتظار يمكنك الألغاء الطلب من عندك من خلال صفحه تتبع الطلب "
  },
  {
    id: "returns_policy",
    keywords: ["استرجاع", "ارجاع", "مرتجع", "استبدال", "ترجيع", "رجع", "ابدل", "حق", "شروط"],
    answer: "لأنها منتجات غذائية، الاسترجاع الفوري بيكون وقت الاستلام مع المندوب لو الحاجة مش عاجباك. لو فتحت المنتج ولقيت فيه عيب مصنعي، تواصل معانا فوراً وهنحلها."
  },
  {
    id: "damaged_frozen",
    keywords: ["تالف", "بايظ", "فاسد", "مفكوك", "ذَاب", "سايح", "ريحة", "سائح", "بايت", "مفكوكه"],
    answer: "سلامتكم هي أهم شيء! لو استلمت منتج فك تجميده تماماً أو تالف بسبب الشحن، صوره فوراً وابعته لينا على الواتساب، وهيتم تعويضك وشحن بديل مجاني فوراً."
  },
  {
    id: "customer_support",
    keywords: ["تواصل", "اتصل", "دعم", "رقم", "واتس", "واتساب", "خدمة", "العملاء", "اشتكي", "اكلم", "تلفون", "موبايل"],
    answer: "إحنا في الخدمة! تقدر تكلّم خدمة عملاء أبو الدهب مباشرة عبر الواتساب (من الأيقونة الخضراء بالموقع) أو تزور صفحة 'اتصل بنا' لمعرفة أرقامنا الحالية."
  },
 
  
];

const QUICK_SUGGESTIONS = [
  "كيفية الشراء والطلب؟",
  "مواعيد وطريقة التوصيل",
  "عايز أتبع أوردري",
  "عندكم خصومات أو كوبونات?",
  "كيفيه اضافه منتج للسله",
  
];


const STOP_WORDS = ["في", "من", "على", "إلى", "عايز" , "يا", "هو", "هي", "طيب", "لو", "عايز", "حابب", "بقولك", "معلش", "انا", "عندي", "عن"];

function ProductCard({ prod }) {
  const isBox = prod.unit_type === "كرتونة";
  const total = prod.totalUnits || 0;
  const available = total > 0;
  const navigate=useNavigate()

  return (
    <div className="bg-white border w-full border-slate-200 rounded-2xl p-3 mt-2 text-xs">
      <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
          <img src={prod.image.url} alt="" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-slate-800 text-[12.5px] leading-tight truncate">
            {prod.productName} ({prod.description})
          </p>
          <p className="text-slate-400 text-[10px] mt-0.5">
            كود: {prod.code || "---"} &middot; {prod.category || "عام"}
          </p>
          <p className="text-slate-400 text-[10px] mt-0.5">
            تباع ك: {prod.unit_type === "قطعة" ? "قطعة فقط" : "كرتونة او قطعة"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-2.5">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
          <div className="flex items-center gap-1 mb-1">
            <Tag size={9} className="text-slate-400" />
            <span className="text-[10px] text-slate-400 font-semibold">سعر القطعة</span>
          </div>
          <p className="font-bold text-sky-600 text-[13px]">{prod.pieceSellingPrice || "---"} جنيه</p>
        </div>

        {isBox && (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
            <div className="flex items-center gap-1 mb-1">
              <Archive size={9} className="text-slate-400" />
              <span className="text-[10px] text-slate-400 font-semibold">سعر الكرتونة</span>
            </div>
            <p className="font-bold text-sky-600 text-[13px]">{prod.packageSellingPrice || "---"} جنيه</p>
          </div>
        )}

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
          <div className="flex items-center gap-1 mb-1">
            <LayoutGrid size={9} className="text-slate-400" />
            <span className="text-[10px] text-slate-400 font-semibold">القطع المتوفرة</span>
          </div>
          <p className="font-bold text-slate-800 text-[13px]">{total} قطعة</p>
        </div>

        {isBox && (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-2">
            <div className="flex items-center gap-1 mb-1">
              <Archive size={9} className="text-slate-400" />
              <span className="text-[10px] text-slate-400 font-semibold">الكراتين</span>
            </div>
            <p className="font-bold text-slate-800 text-[13px]">{prod.availableQuantity || 0} كرتونة</p>
          </div>
        )}
      </div>

      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${available ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
        {available ? <><CheckCircle size={11} /> جاهز للتسليم</> : <><XCircle size={11} /> غير متوفر حالياً</>}
      </div>

          <div
           onClick={()=>navigate(`تفاصيل المنتج/${prod._id}`)}
          className={`my-2 flex bg-slate-100 w-fit items-center cursor-pointer gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold underline`}>
          انتقل الي تفاصيل المنتج  <RiArrowRightCircleFill size={18}/>
      </div>

      
    </div>
  );
}

// ── Order Card Component ──────────────────
function OrderCard({ order }) {
  const statusTranslations = {
    pending: { text: "قيد الانتظار", color: "bg-amber-50 text-amber-700 border-amber-200" },
    shipped: { text: "تم الشحن", color: "bg-blue-50 text-blue-700 border-blue-200" },
    delivered: { text: "تم التوصيل", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    cancelled: { text: "ملغي", color: "bg-red-50 text-red-700 border-red-200" }
  };

  const currentStatus = statusTranslations[order.status] || { text: order.status, color: "bg-slate-50 text-slate-700 border-slate-200" };
  const formattedDate = new Date(order.createdAt).toLocaleDateString("ar-EG", {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="bg-white w-full border border-slate-200 rounded-2xl p-3.5 mt-2 text-xs shadow-sm">
      <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-100">
        <div>
          <p className="font-bold text-slate-800 text-[12px]">{order.orderNumber}</p>
          <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border mt-1 ${currentStatus.color}`}>
            {currentStatus.text}
          </span>
        </div>
        <div className="text-left">
          <p className="font-black text-sky-600 text-[14px]">{order.finalPrice} ج.م</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-slate-400 text-[10px]">
        <Calendar size={12} />
        <span>تاريخ الطلب: {formattedDate}</span>
      </div>
    </div>
  );
}

// ── Message Bubble Component ────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.sender === "user";
  const isModeSwitch = msg.sender === "bot" && (msg.text?.startsWith("🔄") || msg.isSystem);

  if (isModeSwitch) {
    return (
      <div className="text-center mx-auto max-w-[90%] my-1">
        <span className="inline-block bg-slate-100 text-slate-600 text-[11px] font-semibold px-3 py-1.5 rounded-xl border border-slate-200">
          {msg.text}
        </span>
      </div>
    );
  }

  return (
    <div className={` flex  items-end gap-1.5 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0 mb-0.5">
          <Bot size={14} className="text-sky-600" />
        </div>
      )}
      <div className="max-w-[85%]">
        {msg.text && (
          <div className={`px-3.5 py-2.5 text-[12.5px] font-medium leading-relaxed whitespace-pre-line ${isUser ? "bg-sky-500 text-white rounded-[18px] rounded-tr-[4px]" : "bg-white text-slate-800 border border-slate-200 rounded-[18px] rounded-tl-[4px] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"}`}>
            {msg.text}
          </div>
        )}

        {msg.products && msg.products.length > 0 && (
          <div>
            <p className="text-[11px] font-bold text-slate-400 mt-2 mb-1 pr-1">تم العثور على {msg.products.length} منتج(ات)</p>
           < div className=" flex flex-col md:flex-row md:flex-wrap gap-10"> {msg.products.map((prod, i) => <ProductCard   key={i} prod={prod} />)} </ div>
          </div>
        )}

        {msg.orders && msg.orders.length > 0 && (
          <div className="space-y-1 max-h-fit overflow-y-auto pr-1">
                 < div className=" flex flex-col md:flex-row md:flex-wrap gap-10">  {msg.orders.map((order) => <OrderCard key={order._id} order={order} /> ) }</ div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ChatBot Component ──────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false); // ── 1. إضافة الـ State الخاص بالـ Fullscreen ──
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("general");
  const messagesEndRef = useRef(null);

  const DEFAULT_MESSAGES = [
    {
      sender: "bot",
      text: "مرحباً بك في متجر أبو الدهب! ✨\n\nقسم الاستفسارات العامة مفتوح الآن.\nيمكنك التبديل للبحث عن الأسعار والمنتجات مباشرة.",
    },
  ];

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat_history_v2");
    return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages, open]);

  useEffect(() => {
    localStorage.setItem("chat_history_v2", JSON.stringify(messages));
  }, [messages]);

  const clearChat = () => {
    localStorage.removeItem("chat_history_v2");
    setMessages([{ sender: "bot", text: "تم مسح المحادثة. كيف يمكنني مساعدتك؟ " }]);
  };

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get("/order");
      const result = response.data;

      if (response.status === 200 && result?.orders?.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: ` تم العثور على آخر ${result.orders.length} طلب لك:`,
            orders: result.orders
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "صديقنا العزيز، ليس لديك أي طلبات مسجلة حتى الآن في حسابك. 🛒" }
        ]);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      if (err.response?.status === 401 || err.response?.status === 403 || !localStorage.getItem("token")) {
        setMessages((prev) => [
          ...prev,
          { 
            sender: "bot", 
            text: " عفواً، يجب عليك تسجيل الدخول أولاً أو تجديد الجلسة لتتمكن من استعراض طلباتك.\n\nمن فضلك قم بتسجيل الدخول للموقع وحاول مجدداً." 
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "عفواً، حدث خطأ أثناء تحميل طلباتك. يرجى المحاولة مرة أخرى لاحقاً." }
        ]);
      }
    } finally{
      setLoading(false);
    }
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    
    let modeText = "";
    if (mode === "general") modeText = "🔄 تم الانتقال إلى: الاستفسارات العامة";
    if (mode === "products") modeText = "🔄 تم الانتقال إلى: محرك البحث عن المنتجات";
    if (mode === "myOrder") modeText = "🔄 تم الانتقال إلى: عرض طلباتي";

    setMessages((prev) => [...prev, { sender: "bot", text: modeText, isSystem: true }]);

    if (mode === "myOrder") {
      fetchUserOrders();
    }
  };

  const normalize = (s) =>
    s.toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/b[ال]/g, "")
      .replace(/ة/g, "ه")
      .replace(/[^\u0621-\u064A\s\w]/g, "")
      .trim();

  const isSimilar = (a, b) => {
    if (a === b) return true;
    if (a.length < 3 || b.length < 3) return false;
    let m = 0;
    const l = Math.min(a.length, b.length);
    for (let i = 0; i < l; i++) if (a[i] === b[i]) m++;
    return m / Math.max(a.length, b.length) >= 0.55;
  };

  const getSmartAnswer = async (userQuestion) => {
    const words = normalize(userQuestion)
      .split(/\s+/)

      .filter((w) => !STOP_WORDS.includes(w));

    if (!words.length) {
      return { text: "من فضلك اكتب سؤالك بشكل واضح لكي أتمكن من مساعدتك." };
    }

    if (activeMode === "general") {
      let best = null, top = 0;
      foodStoreFaq.forEach((item) => {
        let score = 0;
        words.forEach((uw) => {
          item.keywords.forEach((kw) => {
            const ck = normalize(kw);
            if (uw === ck) score += 3;
            else if (isSimilar(uw, ck)) score += 1;
          });
        });
        if (score > top) { top = score; best = item; }
      });

      if (top >= 2 && best) return { text: best.answer };
      return {
        text: "سؤالك غير واضح في هذا القسم \n\nجرب التبديل لـ \"البحث عن المنتجات\" لو كنت تسأل عن سعر أو مخزون.",
      };
    }

    if (activeMode === "products") {
      try {
        setLoading(true);
        const response = await api.get("/product/search/query", {
          params: { search: userQuestion, limit: 3},
        });
        const result = response.data;
        if (response.status === 200 && result?.data?.length > 0) {
          return { products: result.data };
        }
      } catch (err) {
        console.error("Chatbot API error:", err);
      } finally {
        setLoading(false);
      }
      return {
        text: " لم نجد منتجات مطابقة لهذا الاسم حالياً!\n\nجرب اسماً أكثر تحديداً (مثال: بانيه متبل، اطياب، كاتشب ميزة).",
      };
    }

    if (activeMode === "myOrder") {
      return { text: "أنت الآن في وضع استعراض الطلبات. لرؤية طلباتك المحدثة اضغط مجدداً على زر 'عرض طلباتي' بالأعلى." };
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || message;
    if (!text.trim() || loading) return;

  setMessages((prev) => [...prev, { sender: "user", text }]);
    setMessage("");
    setLoading(true);

    const reply = await getSmartAnswer(text);
    if (reply) {
      setMessages((prev) => [...prev, { sender: "bot", ...reply }]);
    }
    setLoading(false);
  };

  return (
    // <>
    //   {open && (
    //     /* ── 2. تعديل كلاسات الحاوية الرئيسية لتتغير ديناميكياً مع الـ Fullscreen ── */
    //     <div 
    //       className={`fixed bg-white  shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-200 flex flex-col overflow-hidden transition-all duration-300
    //         ${isFullscreen 
    //           ? "inset-0 w-full h-full rounded-none bottom-0 left-0" // كلاسات ملء الشاشة الكاملة
    //           : "bottom-24 left-5 w-[340px] sm:w-[380px] h-[500px]  md:h-[580px] rounded-[24px]" // الكلاسات الأصلية
    //         }`} 
    //       style={{ zIndex: 9999 }} 
    //       dir="rtl"
    //     >
    //       {/* ── Header ── */}
    //       <div className="bg-[#0f172a] px-4 py-3.5 flex items-center justify-between border-b border-white/5 flex-shrink-0">
    //         <div className="flex items-center gap-2.5">
    //           <div className="w-10 h-10 rounded-[14px] bg-sky-500/10 border border-sky-500/20 flex items-center justify-center relative flex-shrink-0">
    //             <Package size={18} className="text-sky-400" />
    //           </div>
    //           <div>
    //             <h2 className="text-white font-black text-[13px] tracking-wide flex items-center gap-1">مساعد أبو الدهب</h2>
    //             <p className="text-slate-400 text-[10px] mt-0.5">انا هنا لمساعدتك</p>
    //           </div>
    //         </div>
    //         <div className="flex items-center gap-1.5">
    //           {/* ── 3. إضافة زر التكبير / التصغير داخل الهيدر ── */}
    //           <button 
    //             onClick={() => setIsFullscreen(!isFullscreen)} 
    //             title={isFullscreen ? "تصغير الشاشة" : "شاشة كاملة"} 
    //             className="w-8 h-8 rounded-[10px] bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
    //           >
    //             {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
    //           </button>

    //           <button onClick={clearChat} title="حذف المحادثه" className="w-8 h-8 rounded-[10px] bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all cursor-pointer">
    //             <Trash2 size={14} />
    //           </button>
    //           <button title="غلق المحادثة" onClick={() => setOpen(false)} className="w-8 h-8 rounded-[10px] bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer">
    //             <X size={14} />
    //           </button>
    //         </div>
    //       </div>

    //       {/* ── Mode Tabs ── */}
    //       <div className="flex gap-1 p-2 bg-slate-100 border-b border-slate-200 flex-shrink-0">
    //         <button onClick={() => handleModeChange("general")} className={`flex-1 flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[10.5px] font-bold transition-all cursor-pointer ${activeMode === "general" ? "bg-white text-sky-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
    //           <Info size={12} /> استفسار عام
    //         </button>
    //         <button onClick={() => handleModeChange("products")} className={`flex-1 flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[10.5px] font-bold transition-all cursor-pointer ${activeMode === "products" ? "bg-sky-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
    //           <Package size={12} /> البحث عن المنتجات
    //         </button>
    //         <button onClick={() => handleModeChange("myOrder")} className={`flex-1 flex items-center justify-center gap-1 py-2 px-1.5 rounded-xl text-[10.5px] font-bold transition-all cursor-pointer ${activeMode === "myOrder" ? "bg-sky-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
    //           <Truck size={12} /> عرض طلباتي
    //         </button>
    //       </div>

    //       {/* ── Messages ── */}
    //       <div className="flex-1 overflow-y-auto p-3 flex flex-col  gap-3 bg-gradient-to-b from-slate-50/60 to-white">
    //         {messages.map((msg, i) => (
    //           <MessageBubble key={i} msg={msg} />
    //         ))}

    //         {loading && (
    //           <div className="flex items-end gap-1.5">
    //             <div className="w-7 h-7 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
    //               <Bot size={14} className="text-sky-600" />
    //             </div>
    //             <div className="bg-white border border-slate-200 rounded-[18px] rounded-tl-[4px] px-4 py-3 flex items-center gap-1.5">
    //               <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:0ms]" />
    //               <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:150ms]" />
    //               <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:300ms]" />
    //             </div>
    //           </div>
    //         )}

    //         {activeMode === "general" && !loading && (
    //           <div className="pt-1">
    //             <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mb-2 px-1 uppercase tracking-wider">
    //               <HelpCircle size={11} className="text-sky-500" /> أسئلة شائعة
    //             </p>
    //             <div className="flex flex-wrap gap-1.5">
    //               {QUICK_SUGGESTIONS.map((s, i) => (
    //                 <button key={i} onClick={() => handleSendMessage(s)} className="bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-600 hover:text-sky-700 text-[11px] font-bold py-1.5 px-3 rounded-2xl transition-all cursor-pointer active:scale-95">
    //                   {s}
    //                 </button>
    //               ))}
    //             </div>
    //           </div>
    //         )}

    //         <div ref={messagesEndRef} />
    //       </div>

    //       {/* ── Input ── */}
    //       <div className="p-3 border-t border-slate-100 bg-white/90 flex gap-2 items-center flex-shrink-0">
    //         <input
    //           type="text"
    //           value={message}
    //           disabled={loading}
    //           placeholder={activeMode === "general" ? "اسأل عن مواعيد التوصيل، طرق الدفع..." : activeMode === "products" ? "اكتب اسم المنتج (مثال: بانيه، اطياب)" : "يمكنك كتابة استفسار هنا..."}
    //           onChange={(e) => setMessage(e.target.value)}
    //           onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
    //           className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-[12px] font-semibold outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10 bg-slate-50 text-slate-800 transition-all disabled:opacity-60"
    //         />
    //         <button onClick={() => handleSendMessage()} disabled={loading || !message.trim()} className="w-10 h-10 bg-sky-500 hover:bg-sky-600 rounded-2xl text-white flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 flex-shrink-0">
    //           <Send size={15} className="rotate-180" />
    //         </button>
    //       </div>
    //     </div>
    //   )}

    //   {/* ── FAB ── */}
    //   <button onClick={() => setOpen(!open)} className="fixed bottom-8 cursor-pointer left-6 w-14 h-14 rounded-[18px] bg-[#0f172a] text-sky-400 shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-all flex items-center justify-center border border-slate-800" style={{ zIndex: 9999 }}>
    //     {open ? <X size={22} className="text-white" /> : <div className="relative"><MessageCircle size={24} /><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-sky-500 rounded-full border-2 border-[#0f172a] animate-pulse" /></div>}
    //   </button>
    // </>
    <div></div>
  );
}