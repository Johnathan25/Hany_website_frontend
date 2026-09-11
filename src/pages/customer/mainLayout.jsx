import { lazy, Suspense, useEffect } from "react";
import HowItWorks from "./main/HowItWorks";
import CategoryPromos from "./main/CategoryPromos";
import DeliveryBanner from "./main/deliveryMan";
import FAQ from "./main/FAQ";
import AppDownloadSection from "./main/phoneMobile";


const Hero = lazy(() => import("./main/heroSection"));
const ProductCarousel = lazy(() => import("./main/ProductCarousel"));
const AbuElDahabDiscountBanner = lazy(() => import("./main/AbuElDahabDiscountBanner"));
const BestSellersCard = lazy(() => import("./main/bestSaller"));
const BrandsGrid = lazy(() => import("./products/brands"));
const BestReviews = lazy(() => import("./review/heroReview"));

export default function Main() {
          useEffect (() => {
        document.title = "  أبو الدهب للمجمدات في مصر | أطياب، كوكي، حلواني - جملة وقطاعي بأفضل سعر";
      }, []);
  return (
    <div dir="rtl" className="max-w-[100vw]">



      <Suspense fallback={<div className="h-screen bg-gray-100" />}>
        <Hero />
      </Suspense>

            <Suspense fallback={<div className="h-60 bg-gray-100" />}>
        <CategoryPromos />
      </Suspense>


      

      <Suspense fallback={<div className="h-60" />}>
        <ProductCarousel />
      </Suspense>

            <Suspense fallback={<div className="h-60" />}>
        <DeliveryBanner />
      </Suspense>

      
      <Suspense fallback={<div className="h-60" />}>
        <HowItWorks />
      </Suspense>


      <Suspense fallback={null}>
        <AbuElDahabDiscountBanner />
      </Suspense>

      <Suspense fallback={<div className="h-96" />}>
        <BestSellersCard />
      </Suspense>
{/* 
      <Suspense fallback={null}>
        <BrandsGrid />
      </Suspense> */}

      <Suspense fallback={null}>
        <BestReviews />
      </Suspense>

            <Suspense fallback={null}>
        <      AppDownloadSection />
      </Suspense>


            <Suspense fallback={null}>
        <      FAQ />
      </Suspense>


    </div>
  )
}
