import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Info, Menu, X } from 'lucide-react';

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const menuItems = [
    {
      title: 'سياسة الخصوصية',
      path: '/سياسة_الخصوصية',
      icon: <ShieldCheck size={20} />,
      color: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      title: 'تواصل معنا',
      path: '/تواصل_معانا',
      icon: <Phone size={20} />,
      color: 'bg-cyan-500 hover:bg-cyan-600'
    },
    {
      title: 'من نحن',
      path: '/من_نحن',
      icon: <Info size={20} />,
      color: 'bg-sky-500 hover:bg-sky-600'
    }
  ];
  

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
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
      className="fixed bottom-24 left-6 z-50"
      dir="rtl"
    >
      <div className="relative flex items-center justify-center">

        {/* القائمة */}
        <div
          className={`absolute bottom-20 left-32 -translate-x-1/2 flex flex-col items-end gap-3 transition-all duration-300 origin-bottom ${
            isOpen
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-75 pointer-events-none'
          }`}
        >
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-full shadow-lg transition-all duration-500 hover:-translate-y-1 ${
                item.color
              } ${
                isOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0'
              }`}
              style={{
                transitionDelay: isOpen ? `${index * 120}ms` : '0ms'
              }}
            >
              <span>{item.icon}</span>
              <span className="text-sm whitespace-nowrap">
                {item.title}
              </span>
            </Link>
          ))}
        </div>

        {/* الزر الرئيسي */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 cursor-pointer rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-300 border-2 border-white/20 active:scale-95 ${
            isOpen
              ? 'bg-slate-800 rotate-180'
              : 'bg-gradient-to-tr from-sky-600 to-cyan-500 hover:from-sky-700 hover:to-cyan-600'
          }`}
          title="روابط سريعة"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>
    </div>
  );
}
