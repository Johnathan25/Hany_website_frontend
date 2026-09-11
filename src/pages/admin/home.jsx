import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MessageSquareWarning, CalendarCheck, Users, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const { isAr } = useLanguage();

  const metrics = [
    {
      title: isAr ? 'إجمالي الشكاوى' : 'Total Complaints',
      value: '24',
      icon: MessageSquareWarning,
      color: 'bg-amber-500',
    },
    {
      title: isAr ? 'طلبات المعاينة والحجز' : 'Booking Inquiries',
      value: '18',
      icon: CalendarCheck,
      color: 'bg-blue-600',
    },
    {
      title: isAr ? 'العملاء المسجلين' : 'Registered Clients',
      value: '95',
      icon: Users,
      color: 'bg-indigo-600',
    },
    {
      title: isAr ? 'تمت معالجتها' : 'Resolved Tickets',
      value: '21',
      icon: CheckCircle,
      color: 'bg-emerald-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isAr ? 'لوحة المتابعة العامة' : 'Operational Dashboard'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isAr ? 'نظرة عامة على طلبات العملاء وشكاوى الميدان' : 'High-level real-time performance summary.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">{m.title}</p>
                <h3 className="text-2xl font-black text-slate-900">{m.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl text-white flex items-center justify-center ${m.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}