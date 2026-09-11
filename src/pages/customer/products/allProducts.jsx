import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { HiSearch, HiChevronDown, HiCheck } from "react-icons/hi";
import { Search, Loader2 } from "lucide-react"; 
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import ProductCard from "./productCard";
import normalizeArabic from "../../../services/normalization";

export default function AllProducts() {
  // State Management
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false); // حالة تحميل خاصة بالفلاتر لتجربة سلسة
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [categorySearch, setCategorySearch] = useState(""); // نص البحث داخل الـ Select
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); // فتح وإغلاق قائمة الأصناف
  const [selectedUnitType, setSelectedUnitType] = useState("الكل"); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [allSuggestions, setAllSuggestions] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  const observer = useRef();
  const selectRef = useRef();
  const limit = 16;
  const navigate = useNavigate();

  // إغلاق قائمة الأصناف عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("product/categories/all");
        setCategories(["الكل", ...res.data.data]);
      } catch (err) {
        console.error("Error fetching categories", err);
      }
    };
    fetchCategories();
  }, []);

  // 2. Main Fetch Logic
const fetchData = useCallback(async (reset = false) => {
  if (loading) return;
  
  if (reset) {
    setFilterLoading(true);
    setProducts([]); // 👈 خطوة سحرية: فضي المصفوفة فوراً عشان الـ Observer يفصل
  } else {
    setLoading(true);
  }

  try {
    const currentPage = reset ? 1 : page;
    
    const params = new URLSearchParams({
      page: currentPage,
      limit: limit,
      category: selectedCategory,
      unit_type: selectedUnitType,
      search: searchQuery
    });

    const res = await api.get(`product/getAllProductsClients2?${params.toString()}`);
    const newData = res.data.data || [];
    const pagination = res.data.pagination || {};

    if (reset) {
      setProducts(newData);
      setPage(2);
    } else {
      // منع التكرار بناءً على الـ ID في حالة استجابة الـ Observer السريعة
      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const filteredNewData = newData.filter(p => !existingIds.has(p._id));
        return [...prev, ...filteredNewData];
      });
      setPage(prev => prev + 1);
    }

    if (pagination.totalPages) {
      setHasMore(currentPage < pagination.totalPages);
    } else {
      setHasMore(newData.length >= limit);
    }
  } catch (err) {
    console.error("Error fetching data", err);
  } finally {
    setLoading(false);
    setFilterLoading(false);
  }
}, [selectedCategory, selectedUnitType, searchQuery, page, loading]);
  // 3. Suggestions Data Fetch
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const category = selectedCategory !== "الكل" ? selectedCategory : "";
        const res = await api.get('/product/suggestion', { params: { category } });
        setAllSuggestions(res.data.data || []);
      } catch (err) {
        console.error("Error loading suggestions", err);
      }
    };
    loadSuggestions();
  }, [selectedCategory]);

  // 4. Trigger Fetch on Filter Changes (Debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData(true); 
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, selectedUnitType, searchQuery]);

  // 5. Infinite Scroll Observer
  const lastProductElementRef = useCallback(node => {
    if (loading || filterLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchData(false);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, filterLoading, hasMore, fetchData]);

  // 6. Price Filter Logic
  const filteredProducts = useMemo(() => {
    if (currentPrice === 0) return products;
    return products.filter(p => (p.pieceSellingPrice || 0) <= currentPrice);
  }, [products, currentPrice]);

  const maxValue = useMemo(() => {
    if (products.length === 0) return 1000;
    const max = Math.max(...products.map(p => p.pieceSellingPrice || 0), 0);
    return max === 0 ? 1000 : max;
  }, [products]);

  useEffect(() => {
    if (currentPrice === 0) setCurrentPrice(maxValue);
  }, [maxValue]);

  // فلترة الأصناف داخل السيلكت بناءً على كتابة المستخدم
  const filteredCategoriesList = useMemo(() => {
    const term = normalizeArabic(categorySearch);
    if (!term) return categories;
    return categories.filter(cat => normalizeArabic(cat).includes(term));
  }, [categorySearch, categories]);

  // 7. Suggestions Filtering
  const filteredSuggestions = useMemo(() => {
    const term = normalizeArabic(searchQuery);
    if (!term) return [];
    return allSuggestions.filter(item => 
      normalizeArabic(item.productName || "").includes(term) ||
      normalizeArabic(item.category || "").includes(term) ||
      normalizeArabic(item.description || "").includes(term)
    ).slice(0, 10); 
  }, [searchQuery, allSuggestions]);

  const executeSearch = (term) => {
    setSearchQuery(term);
    setShowSuggestions(false);
  };

  useEffect(() => {
    document.title = "منتجات ابو الدهب";
  }, []);

  return (
<div className="min-h-screen bg-slate-50/50 font-cairo text-right pb-20" dir="rtl">
      
      {/* Header Section */}
      <section className="pt-10 mb-6 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl text-[#0284c7] font-black mb-2 drop--sm">
            تصفح 
            <span className="inline-block mr-3 px-4 py-1 rounded-2xl bg-slate-900 text-white transform -rotate-2 hover:rotate-0 transition-transform duration-300 cursor-default text-3xl md:text-4xl">
              منتجاتنا
            </span>
          </h1>
        </div>
      </section>

      {/* شريط الأدوات الموحد الجديد (البحث + الفلاتر الذكية بجانب بعض) */}
      <div className=" mx-auto px-6 mb-10">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 -sm flex flex-col lg:flex-row gap-4 items-stretch lg:items-end justify-between">
          
          {/* 1. حقل البحث الذكي */}
          <div className="flex-grow relative">
            <label className="block text-xs font-bold text-slate-500 mb-1.5 mr-1">ابحث عن منتج</label>
            <div className="relative w-full">
              <HiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="ابحث بالاسم أو الوصف ..."
                className="w-full pr-11 pl-4 py-3 bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:bg-white rounded-xl font-bold transition-all text-sm text-slate-800 border border-transparent focus:border-transparent"
                value={searchQuery}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') executeSearch(searchQuery);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} 
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-xl border border-slate-200 -2xl overflow-auto max-h-96 text-right">
                  {filteredSuggestions.map((item, index) => (
                    <div 
                      key={index}
                      onMouseDown={() => executeSearch(item.productName)}
                      className="p-3 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none group transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4 flex-grow">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
                          {item.image?.url ? (
                            <img src={item.image.url} alt="" className="w-8 h-8 object-contain rounded" />
                          ) : (
                            <Search size={16} className="text-slate-400 group-hover:text-[#0284c7]" />
                          )}
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-sm font-bold text-slate-800 group-hover:text-[#0284c7] transition-colors line-clamp-1">
                            {item.productName}
                          </span>
                          <span className="text-[11px] text-slate-400 line-clamp-1 font-light leading-tight">
                            {item.description}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md font-bold group-hover:bg-[#0284c7] group-hover:text-white transition-all">
                        {item.category}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 2. السيلكت الذكي القابل للكتابة والبحث بداخل الأصناف */}
          <div className="w-full lg:w-64 relative shrink-0" ref={selectRef}>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 mr-1">تصفية حسب الصنف</label>
            <div 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full bg-slate-100 hover:bg-slate-200/70 border border-transparent focus-within:border-[#0284c7] focus-within:bg-white rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer transition-all duration-200"
            >
              <span className="font-bold text-slate-800 text-sm">
                {selectedCategory === "الكل" ? "جميع الأصناف" : selectedCategory}
              </span>
              <HiChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isCategoryOpen ? "transform rotate-180" : ""}`} />
            </div>

            {isCategoryOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 -xl rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                  <Search size={14} className="text-slate-400 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="اكتب اسم الصنف..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()} 
                    className="w-full bg-transparent text-xs font-bold text-slate-700 focus:outline-none"
                  />
                </div>
                
                <div className="max-h-60 overflow-y-auto py-1">
                  {filteredCategoriesList.length === 0 ? (
                    <div className="p-3 text-xs text-center text-slate-400 font-medium">لا توجد أصناف</div>
                  ) : (
                    filteredCategoriesList.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryOpen(false);
                          setCategorySearch(""); 
                        }}
                        className={`px-4 py-2.5 text-sm font-bold flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                          selectedCategory === cat 
                            ? "bg-blue-50 text-[#0284c7]" 
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{cat === "الكل" ? "جميع الأصناف" : cat}</span>
                        {selectedCategory === cat && <HiCheck className="w-4 h-4 text-[#0284c7]" />}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. فلاتر نوع البيع (قطعة / كرتونة) */}
          <div className="w-full lg:w-auto flex flex-col items-start shrink-0">
            <span className="text-xs font-bold text-slate-500 mb-1.5 mr-1">طريقة العرض</span>
            <div className="flex bg-slate-100 p-1 rounded-xl w-full lg:w-auto">
              {[
                { key: "الكل", label: "الكل" },
                { key: "قطعة", label: "بالقطعة" },
                { key: "كرتونة", label: "بالكرتونة" }
              ].map((unit) => (
                <button
                  key={unit.key}
                  onClick={() => setSelectedUnitType(unit.key)}
                  className={`flex-1 lg:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    selectedUnitType === unit.key
                      ? "bg-white text-[#0284c7] -sm font-black transform scale-[1.01]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {unit.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Grid المنتجات مع معالجة تأثيرات الـ Loading الفورية */}
      <section className="container mx-auto px-6 md:px-2 relative">
        
        {/* شاشة التحميل الشفافة الفورية عند الفلترة */}
        {filterLoading && (
          <div className="absolute inset-0 z-20 bg-slate-50/60 backdrop-blur-[1px] flex items-start justify-center pt-20 transition-all duration-200">
            <div className="bg-white px-6 py-4 rounded-2xl -xl border border-slate-100 flex items-center gap-3">
              <Loader2 className="w-6 h-6 text-[#0284c7] animate-spin" />
              <span className="font-bold text-slate-700 text-sm">جاري تحديث المنتجات...</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* عرض المنتجات الحالية */}
          {filteredProducts.map((product, index) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              isLast={filteredProducts.length === index + 1}
              lastProductElementRef={lastProductElementRef}
            />
          ))}

          {/* حالة عدم وجود نتائج */}
          {filteredProducts.length === 0 && !filterLoading && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">مفيش نتائج للأسف!</h3>
              <p className="text-gray-500 text-center max-w-xs text-sm">جرب تغير اختيارات الفلاتر أو ابحث عن كلمة تانية.</p>
            </div>
          )}

          {/* تأثير الـ Skeleton عند تحميل المزيد بالـ Infinite Scroll فقط */}
          {loading && Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-white border-2 border-slate-100 rounded-xl h-[420px] animate-pulse p-4">
              <div className="bg-slate-100 aspect-square w-full rounded-lg mb-4"></div>
              <div className="bg-slate-100 h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-slate-100 h-8 w-full rounded"></div>
            </div>
          ))}
        </div>

        {/* نهاية المنتجات */}
        {!hasMore && filteredProducts.length > 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-full max-w-md flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-slate-200"></div>
              <span className="text-slate-400 font-bold text-xs">وصلت للنهاية، تصفحت كافة المنتجات</span>
              <div className="h-[1px] flex-1 bg-slate-200"></div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}