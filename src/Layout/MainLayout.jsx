import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import MainLayout from './layouts/MainLayout';
import { useLanguage } from '../context/LanguageContext';
import Footer from '../pages/footer';

export default function MainLayout() {
  const { isAr } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
}