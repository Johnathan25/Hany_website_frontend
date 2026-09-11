import { HiOutlineShoppingCart, HiOutlineHeart, HiOutlineCube, HiOutlineTag, HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { useContext, useEffect, useState } from "react";
import api from "../../../services/api";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../products/productCard";
import { MyContext } from "../../../context/cartContext";
import { getCurrentUser } from "../../../services/getCurrentUser";

export default function AbuElDahabProductGrid() {
  const [products, setProducts] = useState( JSON.parse(localStorage.getItem("products")) ||[]);
  const [isLoading, setIsLoading] = useState(true);
  
  const categories = [
    { id: 2, name: "دواجن", icon: "🍗", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=200" },
    { id: 3, name: "لحوم", icon: "🥩", img: "https://images.unsplash.com/photo-1551028150-64b9f398f678?w=200" },
    { id: 4, name: "خضروات", icon: "🥦", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200" },
    { id: 5, name: "ألبان", icon: "🥛", img: "https://tse4.mm.bing.net/th/id/OIP.zc2altcYK-JD_EcZk_fJ5wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
  ];

    const navigate=useNavigate()

  const defaultProductImg = "https://kokishoponline.com/wp-content/uploads/2024/07/11-1024x1024.png";

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true);
        let res;
        let limit = 4
        if(localStorage.getItem("token")){
                 res = await api.get(`product/allClientsLimit?limit=${limit}`,{
                  params :{ userId: getCurrentUser().userId}
        }

        );  
        }else{
          res = await api.get(`product/allClientsLimit?limit=${limit}`,{
               
        }

        );
        }

        setProducts(res.data.data);
        localStorage.setItem("products", JSON.stringify(res.data.data));
      } catch (err) {
        console.log("Error fetching products:", err);
      } finally {
        setIsLoading(false); // إيقاف التحميل سواء نجح الطلب أو فشل
      }
    };
    getProducts();
  }, []);

  // مكون الهيكل العظمي (Skeleton Loader)
  const ProductSkeleton = () => (
    <div className="bg-white border-4 border-slate-50 overflow-hidden animate-pulse flex flex-col h-full">
      <div className="aspect-square bg-slate-200 w-full"></div>
    
      <div className="p-4 space-y-4 flex-grow">
       <div className="flex  gap-2 justify-between">
        <div className="h-12 bg-slate-200 rounded w-2/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
       </div>

        <div className="h-14 bg-slate-200 rounded w-full"></div>
        <div className="h-14 bg-slate-200 rounded w-full"></div>

  
      </div>
    </div>
  );

  return (
    <>
    

      <section className="w-full bg-white pb-20 font-cairo my-10 mt-16" dir="rtl">
        <div className=" mx-auto px-12 mb-16 relative">
          <div
          data-aos="fade-down"
          className="flex flex-col items-center">
            <span className="bg-blue-50 text-[#0284c7] text-xs font-black px-4 py-2 rounded-full mb-4 tracking-widest uppercase animate-pulse">
              القائمة الحصرية
            </span>
            <h2
            data-aos="zoom-in"
            className="text-4xl md:text-6xl font-black text-[#0f172a] text-center leading-tight">

              منتجات <span className="relative inline-block text-[#0284c7]">أبو الدهب
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#0284c7]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
            <div className="w-24 h-1.5 bg-[#0284c7]/10 rounded-full mt-6 flex justify-center">
              <div className="w-8 h-full bg-[#0284c7] rounded-full"></div>
            </div>
            <p 
            data-aos="fade-up"
            className="text-gray-400 mt-4 font-bold text-lg max-w-md text-center">
              ننتقي لك أجود أنواع اللحوم والمجمدات من المصنع إليك مباشرة
            </p>
          </div>
        </div>

        <div   data-aos="fade-up" className=" mx-auto px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
          {(isLoading && products.length === 0)
            ? 
              Array(10).fill(0).map((_, index) => <ProductSkeleton key={index} />)
            : 
              products.map((product,index) => (
                         <ProductCard
      key={product._id} 
      product={product} 
      isLast={null}
      lastProductElementRef={null} 
       data-aos="fade-up"
       data-aos-delay={index * 100}
    />
              ))}


        </div>

        <div  
        data-aos="fade-down"
        className="w-full mt-12 flex  justify-center">
         <Link to={"كل_المنتجات"}>
            <button  className="group relative cursor-pointer  flex items-center justify-center gap-3 bg-white   text-[#0284c7] px-12 py-4 rounded-md font-black text-lg transition-all duration-300 hover:bg-[#0284c7] hover:border-[#0284c9] hover:text-white  active:scale-95 overflow-hidden">
            

            <span className="relative z-10">عرض كل المنتجات</span>
            

            <HiOutlineArrowNarrowLeft className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-2 relative z-10" />


            <div className="absolute inset-0 bg-gradient-to-r from-[#0284c7] to-[#0369a1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
         </Link>
       
        </div>
      </section>
    </>
  );
}