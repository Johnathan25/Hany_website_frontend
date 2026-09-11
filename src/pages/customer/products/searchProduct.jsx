import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, Package, Layers, Tag, ArrowUpDown } from 'lucide-react';
import api from '../../../services/api';
import { useNavigate } from 'react-router-dom';
import StarRating from '../review/rating';
import normalizeArabic from '../../../services/normalization';

function ProductSearch() {
  const [allSuggestions, setAllSuggestions] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]); 
  const [categories, setCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const defaultProductImg = "https://kokishoponline.com/wp-content/uploads/2024/07/11-1024x1024.png";
  const navigate=useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    maxPrice: "",
    sort: "newest"
  });

  const refProduct=useRef();
  const limit=20;
  const [hasMore, setHasMore] = useState(true);

  


  useEffect(() => {
    const initData = async () => {
      try {
          let category=""
        if(filters.category!=="كل الأصناف"){
           category=filters.category
        }else{
           category=""
        }
            const [suggestRes, catRes] = await Promise.all([
            api.get('/product/suggestion', {
                params: { category }
            }),
            api.get('/product/categories/all')
            ]);
        setAllSuggestions(suggestRes.data.data);
        setCategories(catRes.data.data);
      } catch (err) {
        console.error("Error loading data", err);
      }
    };
    initData();
  }, [filters.category]);

  const filteredSuggestions = useMemo(() => {
    const term = normalizeArabic(searchTerm)
    if (!term) return localStorage.getItem("searchHistory") ? JSON.parse(localStorage.getItem("searchHistory")).map(e => ({
      productName: e.name,
      category: e.category,
      description: e.term,
      localStorage: true
      
    })) : [];

    return allSuggestions.filter(item => 
      item.productName.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term) 


    )
  }, [searchTerm, allSuggestions]);


  const getBySearch = async (term ,reset=false) => {
   if (!term.trim()) return;
  
    setLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      console.log(term)
      const res = await api.get(`/product/search/query?search=${normalizeArabic(term)}&category=${filters.category}&limit=${limit * currentPage}`);
      setProducts(res.data.data);
      setHasMore(res.data.data.length >= limit * currentPage);
      if (!reset) setPage(prev => prev + 1);
    } catch (err) {
      console.error("Search API error:", err);
    } finally {
      setLoading(false);

    }
  };


  const executeSearch = async (term ) => {
    
    setSearchTerm(term);
    setShowSuggestions(false);
    await getBySearch(term );
    setHasMore(false)

       const searchSaved = localStorage.getItem("searchHistory") || "[]";
      const searchHistory = JSON.parse(searchSaved);
      const category = allSuggestions.find(item => item.description === term)?.category || "";
      const name = allSuggestions.find(item => item.description === term)?.productName || "";

      const newEntry = { name, category:category || filters.category , term, timestamp: Date.now() };
      const updatedHistory = [newEntry, ...searchHistory.filter(e => e.term !== term)].slice(0, 10);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };


      useEffect(() => {
      document.title ="بحث عن منتجات ابو الدهب";
    }, []);
  
useEffect(() => {
  if (!searchTerm.trim()) {
    setProducts([]);
    return;
  }



  const timer = setTimeout(() => {
    getBySearch(searchTerm, true);
  }, 500);

  return () => clearTimeout(timer);
}, [searchTerm]);

    // Observer for Infinite Scroll
    const lastProductElementRef = useCallback(node => {
      if (loading) return;
      if (refProduct.current) refProduct.current.disconnect();
      refProduct.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore ) {
          getBySearch(searchTerm );
        }
      });
      if (node) refProduct.current.observe(node);
    }, [loading, hasMore ]);

 
  const displayProducts = useMemo(() => {
    let result = [...products];
    if (filters.maxPrice) {
      result = result.filter(p => p.pieceSellingPrice <= Number(filters.maxPrice));
    }
    if (filters.sort === "lowPrice") result.sort((a, b) => a.pieceSellingPrice - b.pieceSellingPrice);
    if (filters.sort === "highPrice") result.sort((a, b) => b.pieceSellingPrice - a.pieceSellingPrice);
if (filters.category && filters.category !== "كل الأصناف") {
  result = result.filter(p => p.category === filters.category);
}
    return result;
  }, [products, filters])

  return (
    <div className="px-6 mx-auto p-4 font-[cairo]" dir="rtl">
      
      {/* Search Header */}
      <div className="relative mb-6">
        <div className="relative group">
          <Search className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${loading ? 'text-sky-500 animate-pulse' : 'text-slate-400'}`} size={22} />
          <input 
            type="text"
            className="w-full   p-5 pr-14 rounded-md  border-2 border-slate-100 bg-white  outline-none focus:border-[#0284c7] transition-all font-bold text-[#0F172A]"
            placeholder="ابحث عن اسم المنتج..."
            value={searchTerm}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
          setTimeout(() => {
            setShowSuggestions(false);
          }, 500);
        }}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeSearch(searchTerm)}
          />
        </div>

        {/* Suggestions Dropdown (Filtered Locally) */}
        {showSuggestions && filteredSuggestions.length > 0 && (
 <div className=" absolute z-50 w-full mt-2 bg-white  rounded-xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-auto  max-h-96 backdrop-blur-sm bg-white/fb">
  {filteredSuggestions.length > 0 ? (
    filteredSuggestions.map((item, index) => (
      <div 
        key={index}
        onClick={() => executeSearch(item.description)}
        className="p-3 hover:bg-blue-50/50 cursor-pointer flex items-center justify-between border-b border-slate-50 last:border-none group transition-colors duration-200"
      >
        <div className="flex items-center gap-4 flex-grow">
          {/* أيقونة أو صورة مصغرة */}
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white transition-colors">
            {item.image?.url ? (
              <img src={item.image.url} alt="" className="w-8 h-8 object-contain rounded" />
            ) : (
              <Search size={16} className="text-slate-400 group-hover:text-[#0284c7] 600" />
            )}
          </div>

          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-slate-800 group-hover:text-[#0284c7] 700 transition-colors line-clamp-1">
              {item.productName}
            </span>
            {item.description && (
              <span className="text-[12px] text-slate-600 line-clamp-1 font-semibold leading-tight">
                {item.description}
              </span>

            )}

            
              {item.localStorage && (
                <span className="text-[10px] text-slate-500 mt-1 font-light italic">
                       هذا نتيجة من تاريخ بحثك السابق في {item.category}
                </span>
               )
              }
          </div>
        </div>

        {/* التصنيف كـ Badge أنيق */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-wider bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md font-bold group-hover:bg-[#0284c7] 600 group-hover:text-white transition-all duration-300">
            {item.category}
          </span>
        </div>
      </div>
    ))
  ) : (
    <div className="p-8 text-center text-slate-400 text-sm">
      لا توجد نتائج مطابقة لبحثك
    </div>
  )}
</div>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-4 mb-8 bg-white/50 p-3  border border-white">
        <div className="flex items-center gap-2 bg-white px-4 py-2   border border-slate-100 flex-grow md:flex-none">
          <Layers size={16} className="text-[#0284c7]" />
          <select 
            className="outline-none cursor-pointer bg-transparent font-bold text-xs text-slate-600 w-full"
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">كل الأصناف</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2   border border-slate-100 flex-grow md:flex-none">
          <Tag size={16} className="text-[#0284c7]" />
          <input 
            type="number" 
            placeholder="أقصى سعر..." 
            className="outline-none bg-transparent font-bold text-xs w-full md:w-24"
            onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
          />
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-2   border border-slate-100 flex-grow md:flex-none">
          <ArrowUpDown size={16} className="text-[#0284c7]" />
          <select 
            className="outline-none cursor-pointer bg-transparent font-bold text-xs text-slate-600 w-full"
            onChange={(e) => setFilters({...filters, sort: e.target.value})}
          >
            <option value="newest">الأحدث</option>
            <option value="lowPrice">السعر: من الأقل</option>
            <option value="highPrice">السعر: من الأعلى</option>
          </select>
        </div>
      </div>

      {/* Products List (Horizontal Layout) */}
      <div className="grid grid-cols-1 gap-6">
        {displayProducts.map((product,i) => {

       const  isLast=   displayProducts.length===i+1 
        return(
             <div key={product._id} 
           ref={isLast ? lastProductElementRef :null}

          className="bg-white rounded-md p-5 flex flex-col md:flex-row gap-6 border border-slate-100  hover: transition-all group relative overflow-hidden">
            
            {/* Image Section */}
            <div
            onClick={() => navigate(`/تفاصيل المنتج/${product._id}?الاسم=${product.productName}`)} 
             className="w-full cursor-pointer md:w-44 h-44 bg-slate-50 rounded-md flex items-center justify-center shrink-0 border border-slate-50">
               <img 
                    loading="lazy" 
                src={product.image?.url || defaultProductImg} 
                alt={product.productName} 
                className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Details Section */}
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-[#0F172A]">{product.productName}</h3>
                    <span className="text-[10px] font-black bg-[#0284c7]/10 text-[#0284c7] px-3 py-1 rounded-md uppercase tracking-wider">
                        {product.category}
                    </span>
                </div>
                <p className="text-slate-400 text-sm font-bold leading-relaxed mb-1 line-clamp-2">
                  {product.description || "وصف المنتج رقم " + product.productName}
                </p>

                 <StarRating rating={product.averageRating} reviewsCount={product.reviewsCount} />
                
              </div>

              {/* Pricing Grid */}
          <div className="flex flex-wrap items-center gap-4 border-t border-slate-50 pt-5">
    {product.unit_type=="كرتونة"       &&             <div className=" text-white p-4  flex flex-col min-w-[140px] rounded-md ">
                  <span className="text-[10px] font-bold text-slate-400 mb-1">سعر الكرتونة</span>
                  <span className="text-xl font-black text-sky-400">{product.packageSellingPrice} <small className="text-[10px]">ج.م</small></span>
                </div>}

                <div className="flex flex-col min-w-[140px] rounded-md">
                  <span className="text-[10px] font-bold text-sky-600 mb-1">سعر الـ القطعه</span>
                  <span className="text-xl font-black text-[#0F172A]">{product.pieceSellingPrice} <small className="text-[10px]">ج.م</small></span>
                </div>

                <div className="flex items-center gap-3 mr-auto  px-5 py-3    rounded-md">
                   <div className="p-2 bg-white  "><Package size={18} className="text-[#0284c7]" /></div>
{    product.unit_type=="كرتونة"       &&        <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase">الكرتونة فيها</span>
                      <span className="text-sm font-black text-[#0F172A]">{product.unitsPerPackage} قطعة</span>
                   </div>}
                </div>
              </div>
            </div>
          </div>
        )}
)}
      </div>

      {/* Empty State */}
      {!loading && displayProducts.length === 0 && (
        <div className="text-center py-32 bg-white rounded-md border-2 border-dashed border-slate-100">
           <div className="w-16 h-16 bg-slate-50 rounded-md flex items-center justify-center mx-auto mb-4">
              <Search size={32} className="text-slate-200" />
           </div>
           <h3 className="text-lg font-black text-[#0F172A]">ابدأ البحث عن منتجاتك</h3>
           <p className="text-slate-400 font-bold mt-1">اكتب اسم المنتج أو استخدم الفلاتر بالأعلى</p>
        </div>
      )}
    </div>
  );
}

export default ProductSearch;