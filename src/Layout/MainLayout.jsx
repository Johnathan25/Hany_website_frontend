import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MainLayout from './layouts/MainLayout';
import { useLanguage } from '../context/LanguageContext';

export default function MainLayout() {
  const { isAr } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Elite Properties Consultants. All rights reserved.</p>
        <p className="mt-1 text-slate-400">
          {isAr
            ? 'مرخصة رسمياً ومسجلة لممارسة أعمال المعاينات والاستشارات العقارية'
            : 'Officially registered for real estate inspection & investment consultancy'}
        </p>
      </footer>
    </div>
  );
}