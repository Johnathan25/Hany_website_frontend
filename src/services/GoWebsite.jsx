import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, ShoppingBag, Percent, Layers, Store, X } from 'lucide-react';

export default function StoreNavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);


  const menuItems = [
    {
      title: 'الرئيسية',
      path: '/',
      icon: <Store size={18} />,
      color: 'bg-slate-900/90 hover:bg-slate-800 backdrop-blur-md'
    },
    {
      title: 'كل المنتجات',
      path: '/كل_المنتجات', 
      icon: <ShoppingBag size={18} />,
      color: 'bg-sky-600 hover:bg-sky-700'
    },
    {
      title: 'أقوى العروض',
      path: '/العروض_والخصومات', 
      icon: <Percent size={18} />,
      color: 'bg-amber-500 hover:bg-amber-600'
    },
    {
      title: 'عروض الكومبو',
      path: '/العروض_والخصومات_الكومبو', 
      icon: <Layers size={18} />,
      color: 'bg-emerald-600 hover:bg-emerald-700'
    }
  ];

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event) {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
<div
  ref={menuRef}
  className={`fixed bottom-28 left-8 z-50 flex flex-col items-end gap-3 ${
    isOpen ? "pointer-events-auto" : "pointer-events-none"
  }`}
  dir="rtl"
>
      

      <div className={`flex flex-col items-end gap-2.5 transition-all duration-300 origin-bottom ${
        isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-75 translate-y-4 pointer-events-none'
      }`}>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            onClick={() => setIsOpen(false)} 
            className={`flex items-center gap-2.5 text-white font-medium px-4 py-2.5 rounded-xl -lg transition-all duration-300 hover:-translate-x-1 border border-white/10 ${
              item.color
            }`}
            style={{ 
              transitionDelay: isOpen ? `${index * 80}ms` : '0ms' 
            }}
          >
            <span className="flex items-center justify-center bg-white/10 p-1.5 rounded-lg">
              {item.icon}
            </span>
            <span className="text-xs font-semibold tracking-wide whitespace-nowrap">{item.title}</span>
          </Link>
        ))}
      </div>

      {/* الزر الرئيسي الثابت */}
<button
  onClick={() => setIsOpen(!isOpen)}
  className={`pointer-events-auto cursor-pointer w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white -xl transition-all duration-300 border border-white/10 active:scale-95 ${
    isOpen
      ? 'bg-[#0284ca] rotate-95'
      : 'bg-[#0284c7]'
  }`}

        title="الانتقال للمتجر"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-0.5">
            <LayoutGrid size={22} />
            <span className="text-[9px] font-bold">المتجر</span>
          </div>
        )}
      </button>

    </div>
  );
}