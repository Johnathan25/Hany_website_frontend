import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, LogOut, User, ChevronDown } from 'lucide-react';
import logo from '../../public/logo.jpeg';

export default function Navbar() {
  const { isAr } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSectionsDropdownOpen, setIsSectionsDropdownOpen] = useState(false);
  const [isMobileSectionsOpen, setIsMobileSectionsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  const dropdownRef = useRef(null);
  const isLoggedIn = Boolean(localStorage.getItem("token") || localStorage.getItem("user"));

  // Navigation items grouped under Home
  const homeSections = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { id: 'services', labelAr: 'خدماتنا', labelEn: 'Services' },
    { id: 'about', labelAr: 'من نحن', labelEn: 'About Us' },
    { id: 'complaints', labelAr: 'الشكاوى والاقتراحات', labelEn: 'Complaints' },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSectionsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync auth state
  useEffect(() => {
    const token = localStorage.getItem('token');
    let rawName = localStorage.getItem('userName');

    if (!rawName || rawName === 'undefined' || rawName === 'null') {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        rawName = user?.name || user?.userName || '';
      } catch {
        rawName = '';
      }
    }

    const validName = rawName && rawName !== 'undefined' && rawName !== 'null' ? rawName : '';
    setIsAuthenticated(!!token);
    setUserName(validName);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserName('');
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleNavClick = (sectionId) => {
    setIsMobileMenuOpen(false);
    setIsSectionsDropdownOpen(false);
    setIsMobileSectionsOpen(false);

    if (location.pathname === '/') {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate('/', { state: { scrollTo: sectionId } });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-blue-100/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* 1. Auth & Mobile Trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="hidden md:flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {userName && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-semibold">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>{userName}</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold text-sm tracking-wide transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-full text-slate-700 hover:text-blue-600 hover:bg-blue-50 font-bold text-sm tracking-wide transition-all cursor-pointer"
                >
                  {isAr ? 'تسجيل الدخول' : 'Log In'}
                </button>

                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm tracking-wide transition-all shadow-sm hover:shadow-md hover:shadow-blue-500/20 whitespace-nowrap transform hover:-translate-y-0.5 cursor-pointer"
                >
                  {isAr ? 'إنشاء حساب' : 'Register'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* 2. Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <nav className="flex items-center gap-5 lg:gap-7 text-sm lg:text-base font-bold text-slate-700">
            
            {/* Dropdown for Home and sub-sections */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsSectionsDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 py-1.5 hover:text-blue-600 transition-colors group cursor-pointer"
              >
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isSectionsDropdownOpen ? 'rotate-180 text-blue-600' : 'text-slate-400 group-hover:text-blue-600'
                  }`}
                />
              </button>

              {isSectionsDropdownOpen && (
                <div className="absolute top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {homeSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => handleNavClick(sec.id)}
                      className="w-full text-start px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {isAr ? sec.labelAr : sec.labelEn}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/Invention"
              className={({ isActive }) =>
                `relative py-1.5 transition-colors cursor-pointer ${
                  isActive ? "text-blue-600" : "hover:text-blue-600"
                }`
              }
            >
              {isAr ? "براءات الاختراع" : "Inventions"}
            </NavLink>

            <NavLink
              to="/portfolio"
              className={({ isActive }) =>
                `relative py-1.5 transition-colors cursor-pointer ${
                  isActive ? "text-blue-600" : "hover:text-blue-600"
                }`
              }
            >
              {isAr ? "معرض الأعمال" : "Portfolio"}
            </NavLink>

            {isLoggedIn && (
              <NavLink
                to="/my-orders"
                className={({ isActive }) =>
                  `relative py-1.5 transition-colors cursor-pointer ${
                    isActive ? "text-blue-600" : "hover:text-blue-600"
                  }`
                }
              >
                {isAr ? "طلباتي وسجلاتي" : "My Requests"}
              </NavLink>
            )}
          </nav>
        </div>

        {/* 3. Logo & Brand Name */}
        <div className="flex items-center justify-end shrink-0">
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <span className="text-lg sm:text-xl font-extrabold tracking-wider text-slate-800 uppercase font-serif group-hover:text-blue-600 transition-colors">
              Large Step
            </span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-blue-500 overflow-hidden group-hover:scale-105 transition-transform shadow-sm group-hover:shadow-blue-500/20">
              <img
                src={logo}
                alt="Large Step Logo"
                className="w-full h-full object-cover rounded-lg block"
              />
            </div>
          </div>
        </div>

      </div>

      {/* 4. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-lg px-6 py-6 shadow-xl space-y-5 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1 font-bold text-slate-700">
            
            {/* Accordion for Home + Sub-sections */}
            <div className="border-b border-slate-100 pb-2">
              <button
                onClick={() => setIsMobileSectionsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between py-2 text-slate-800 hover:text-blue-600 transition-colors"
              >
                <span>{isAr ? 'الرئيسية وأقسامها' : 'Home & Sections'}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileSectionsOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
                  }`}
                />
              </button>

              {isMobileSectionsOpen && (
                <div className="flex flex-col gap-1 pr-3 pl-3 pt-1">
                  {homeSections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => handleNavClick(sec.id)}
                      className="py-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 text-start transition-colors"
                    >
                      {isAr ? sec.labelAr : sec.labelEn}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/Invention"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 text-slate-800 hover:text-blue-600 transition-colors border-b border-slate-100 text-start"
            >
              {isAr ? 'براءات الاختراع' : 'Inventions'}
            </NavLink>

            <NavLink
              to="/portfolio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 text-slate-800 hover:text-blue-600 transition-colors border-b border-slate-100 text-start"
            >
              {isAr ? 'معرض الأعمال' : 'Portfolio'}
            </NavLink>

            {isLoggedIn && (
              <NavLink
                to="/my-orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 text-blue-600 font-bold border-b border-slate-100 text-start"
              >
                {isAr ? 'طلباتي وسجلاتي' : 'My Requests'}
              </NavLink>
            )}
          </nav>

          {/* Mobile Auth Buttons */}
          <div className="pt-2 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                {userName && (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>{userName}</span>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isAr ? 'تسجيل الخروج' : 'Log Out'}</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl border border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors"
                >
                  {isAr ? 'تسجيل الدخول' : 'Log In'}
                </button>

                <button
                  onClick={() => {
                    navigate('/register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
                >
                  {isAr ? 'إنشاء حساب' : 'Register'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}