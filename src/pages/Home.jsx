import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import About from './About';
import Properties from './Properties';
import Services from './Services';
import Complaints from './Complaints';

const logo = "/logo.jpeg";
const bgImage = "/building.jpeg";


export default function Home() {
    const { isAr, toggleLang } = useLanguage();
    const navigate = useNavigate();
    


    return (
        <div className="w-full flex flex-col bg-white">

            {/* ========================================================
          1. Hero Section (نفس تصميمك وألوانك بالكامل وبكامل الشاشة)
         ======================================================== */}
            <section
                id="home"
                className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden font-sans select-none bg-white"
            >
                {/* Background Image with Deep Blue / Slate Vignette */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-blue-950/40 to-slate-950/80 pointer-events-none" />

                {/* Hero Center Content */}
                <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 text-center my-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-medium text-white tracking-wide drop-shadow-md">
                            LUXURY REAL ESTATE{' '}
                            <span className="opacity-75 font-light mx-2">
                                <br />
                            </span>{' '}
                            العقارات الفاخرة
                        </h1>

                        <p className="text-slate-100 text-base sm:text-xl font-light tracking-wider drop-shadow">
                            Exceptional Living in Prestigious Locations
                        </p>

                    
                    </div>
                </main>

    
            </section>

            {/* ========================================================
          2. About Us Section (من نحن)
         ======================================================== */}
            <section id="about" className="scroll-mt-20">
                <About />
            </section>

            {/* ========================================================
          3. Properties Section (العقارات)
         ======================================================== */}
            {/* <section id="properties" className="scroll-mt-20">
                <Properties />
            </section> */}

            {/* ========================================================
          4. Services Section (خدماتنا)
         ======================================================== */}
            <section id="services" className="scroll-mt-20">
                <Services />
            </section>
               <section id="complaints" className="scroll-mt-20">
                <Complaints />
            </section>

        </div>
    );
}
