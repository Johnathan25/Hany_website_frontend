import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import {
  MessageSquareWarning,
  CalendarCheck,
  Users,
  CheckCircle,
  DollarSign,
  Briefcase,
  Lightbulb,
  CreditCard,
  RefreshCw,
  Clock,
  XCircle,
  RotateCcw
} from 'lucide-react';

export default function AdminDashboard() {
  const { isAr } = useLanguage();
  const [loading, setLoading] = useState(true);

  // حالة البيانات الأساسية للوحة التحكم
  const [data, setData] = useState({
    users: { totalCustomers: 0, totalManagers: 0 },
    services: { total: 0, paid: 0, unpaid: 0, inspection: 0, consultation: 0, maintenance: 0 },
    inventions: {
      total: 0,
      pendingPayment: 0,
      paid: 0,
      underReview: 0,
      approved: 0,
      rejected: 0,
      completed: 0,
      cancelled: 0
    },
    payments: { total: 0, paid: 0, unpaid: 0, failed: 0, refunded: 0, totalPaidAmount: 0 },
    complaints: { total: 0 }
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);

    try {
      // 1. المحاولة الأولى: طلب راوت الداشبورد المخصص إن وجد
      let res;
      try {
        res = await api.get('/dash');
      } catch (err1) {
        try {
          res = await api.get('/admin/dash');
        } catch (err2) {
          res = null;
        }
      }

      if (res?.data?.data || res?.data?.dashboard) {
        const d = res.data.data || res.data.dashboard;
        setData(d);
        setLoading(false);
        return;
      }

      // 2. المحاولة الثانية: جلب الأرقام الحية من راوترات المشروع الأساسية في آن واحد
      const [
        usersRes,
        servicesRes,
        inventionsRes,
        paymentsRes,
        complaintsRes
      ] = await Promise.allSettled([
        api.get('/admins').catch(() => api.get('/admin')),
        api.get('/serviceRequests').catch(() => api.get('/serviceRequests/all')),
        api.get('/inventionRequest'),
        api.get('/invoiceTypePayments'),
        api.get('/complaints/all').catch(() => api.get('/complaints'))
      ]);

      // استخراج ومعالجة المستخدمين / المدراء
      const usersList = usersRes.status === 'fulfilled' ? (usersRes.value.data?.admins || usersRes.value.data?.data || []) : [];
      const totalManagers = usersList.filter(u => u.role === 'manager' || u.role === 'superadmin' || u.role === 'admin').length;
      const totalCustomers = usersList.filter(u => u.role === 'customer').length || usersList.length - totalManagers;

      // استخراج ومعالجة طلبات الخدمات
      const servicesList = servicesRes.status === 'fulfilled' ? (servicesRes.value.data?.data || servicesRes.value.data?.requests || []) : [];
      const servicesTotal = servicesList.length;
      const servicesPaid = servicesList.filter(s => s.status === 'paid').length;
      const servicesUnpaid = servicesTotal - servicesPaid;
      const inspectionsCount = servicesList.filter(s => s.requestType === 'inspection' || s.serviceItem?.id === 'inspection').length;
      const consultationsCount = servicesList.filter(s => s.requestType === 'consultation' || s.serviceItem?.id === 'consultation').length;
      const maintenanceCount = servicesList.filter(s => s.requestType === 'maintenance' || s.serviceItem?.id === 'maintenance').length;

      // استخراج ومعالجة براءات الاختراع
      const inventionsList = inventionsRes.status === 'fulfilled' ? (inventionsRes.value.data?.data || inventionsRes.value.data || []) : [];
      const inventionsTotal = inventionsList.length;
      const pendingPayment = inventionsList.filter(i => i.status === 'pending_payment').length;
      const inventionsPaid = inventionsList.filter(i => i.status === 'paid').length;
      const underReview = inventionsList.filter(i => i.status === 'under_review').length;
      const approved = inventionsList.filter(i => i.status === 'approved').length;
      const completed = inventionsList.filter(i => i.status === 'completed').length;
      const rejected = inventionsList.filter(i => i.status === 'rejected').length;
      const cancelled = inventionsList.filter(i => i.status === 'cancelled').length;

      // استخراج ومعالجة المدفوعات والفواتير
      const paymentsList = paymentsRes.status === 'fulfilled' ? (paymentsRes.value.data?.data || paymentsRes.value.data?.payments || []) : [];
      const paymentsTotal = paymentsList.length;
      const paymentsPaidList = paymentsList.filter(p => p.status === 'paid');
      const paymentsPaidCount = paymentsPaidList.length;
      const paymentsFailed = paymentsList.filter(p => p.status === 'failed').length;
      const paymentsRefunded = paymentsList.filter(p => p.status === 'refunded').length;
      const paymentsUnpaid = paymentsTotal - (paymentsPaidCount + paymentsFailed + paymentsRefunded);

      // إجمالي الإيرادات المحصلة
      const totalPaidAmount = paymentsPaidList.reduce((sum, p) => {
        const val = Number(p.amount ?? p.gatewayResponse?.data?.amount ?? 0);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);

      // استخراج عدد الشكاوى
      const complaintsData = complaintsRes.status === 'fulfilled' ? (complaintsRes.value.data?.data || complaintsRes.value.data || []) : [];
      const complaintsTotal = Array.isArray(complaintsData) ? complaintsData.length : Number(complaintsData?.total || 0);

      setData({
        users: {
          totalCustomers: totalCustomers >= 0 ? totalCustomers : 0,
          totalManagers: totalManagers >= 0 ? totalManagers : 0
        },
        services: {
          total: servicesTotal,
          paid: servicesPaid,
          unpaid: servicesUnpaid,
          inspection: inspectionsCount,
          consultation: consultationsCount,
          maintenance: maintenanceCount
        },
        inventions: {
          total: inventionsTotal,
          pendingPayment,
          paid: inventionsPaid,
          underReview,
          approved,
          rejected,
          completed,
          cancelled
        },
        payments: {
          total: paymentsTotal,
          paid: paymentsPaidCount,
          unpaid: paymentsUnpaid >= 0 ? paymentsUnpaid : 0,
          failed: paymentsFailed,
          refunded: paymentsRefunded,
          totalPaidAmount
        },
        complaints: {
          total: complaintsTotal
        }
      });
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const { users = {}, services = {}, inventions = {}, payments = {}, complaints = {} } = data || {};

  const metrics = [
    {
      title: isAr ? 'إجمالي الإيرادات المحصلة' : 'Realized Revenue',
      value: (payments?.totalPaidAmount || 0).toLocaleString(),
      currency: isAr ? 'الجنيه المصري' : 'EGP',
      indicator: isAr ? `${payments?.paid || 0} معاملة ناجحة` : `${payments?.paid || 0} settled`,
      indicatorType: 'success',
      icon: DollarSign,
    },
    {
      title: isAr ? 'طلبات الخدمات' : 'Service Orders',
      value: services?.total || 0,
      currency: '',
      indicator: isAr ? `${services?.paid || 0} مؤكد الدفع` : `${services?.paid || 0} paid`,
      indicatorType: 'neutral',
      icon: CalendarCheck,
    },
    {
      title: isAr ? 'العملاء المسجلين' : 'Active Clients',
      value: users?.totalCustomers || 0,
      currency: '',
      indicator: isAr ? `${users?.totalManagers || 0} مدراء ومسؤولين` : `${users?.totalManagers || 0} staff`,
      indicatorType: 'neutral',
      icon: Users,
    },
    {
      title: isAr ? 'تذاكر المتابعة والشكاوى' : 'Support Tickets',
      value: complaints?.total || 0,
      currency: '',
      indicator: isAr ? 'تتطلب المتابعة' : 'Requires action',
      indicatorType: 'warning',
      icon: MessageSquareWarning,
    },
  ];

  return (
    <div className="w-full space-y-8 font-sans antialiased text-slate-800 text-base" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* 1. Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900">
            {isAr ? 'لوحة المتابعة التشغيلية' : 'Operations Overview'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-medium">
            {isAr ? 'بيانات حية وفورية لحركات الدفع، الخدمات الهندسية، وبراءات الاختراع من الخادم' : 'Live tracking for billing, services, and invention lifecycle.'}
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 shadow-2xs active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? 'animate-spin' : ''}`} />
          <span>{isAr ? 'تحديث البيانات' : 'Sync Records'}</span>
        </button>
      </header>

      {/* 2. كروت الأرقام الأساسية */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <article
              key={idx}
              className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-2xs flex flex-col justify-between"
            >
              <header className="flex items-center justify-between mb-4 text-slate-400">
                <span className="text-xs sm:text-sm font-bold text-slate-600 tracking-wide">{m.title}</span>
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  <Icon className="w-4 h-4" />
                </div>
              </header>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-mono">
                    {m.value}
                  </span>
                  {m.currency && (
                    <span className="text-xs font-bold text-slate-500 font-sans">{m.currency}</span>
                  )}
                </div>

                <footer className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-medium">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      m.indicatorType === 'success'
                        ? 'bg-emerald-500'
                        : m.indicatorType === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="text-slate-600 font-semibold">{m.indicator}</span>
                </footer>
              </div>
            </article>
          );
        })}
      </section>

      {/* 3. القطاعات التشغيلية */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* قطاع الخدمات */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <header className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {isAr ? 'تصنيف الخدمات' : 'Services Registry'}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
              {services?.total || 0}
            </span>
          </header>

          <div className="space-y-2.5">
            {[
              { label: isAr ? 'معاينات هندسية' : 'Inspections', value: services?.inspection || 0 },
              { label: isAr ? 'استشارات عقارية وقانونية' : 'Consultations', value: services?.consultation || 0 },
              { label: isAr ? 'صيانة تشغيلية ومستعجلة' : 'Maintenance', value: services?.maintenance || 0 }
            ].map(({ label, value }, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2.5 px-3.5 rounded-xl hover:bg-slate-50 transition-colors text-xs sm:text-sm"
              >
                <span className="text-slate-700 font-semibold">{label}</span>
                <span className="font-mono font-bold text-slate-900 text-sm sm:text-base">{value}</span>
              </div>
            ))}
          </div>

          <footer className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle className="w-3.5 h-3.5" />
              {isAr ? 'تم السداد:' : 'Paid:'} <span className="font-mono font-bold">{services?.paid || 0}</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-600">
              <Clock className="w-3.5 h-3.5" />
              {isAr ? 'غير مسدد:' : 'Unpaid:'} <span className="font-mono font-bold">{services?.unpaid || 0}</span>
            </span>
          </footer>
        </section>

        {/* قطاع براءات الاختراع */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <header className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2.5">
              <Lightbulb className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {isAr ? 'مسار براءات الاختراع' : 'Patent Pipeline'}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
              {inventions?.total || 0}
            </span>
          </header>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            {[
              { label: isAr ? 'انتظار الدفع' : 'Pending Payment', value: inventions?.pendingPayment || 0, color: 'text-amber-700' },
              { label: isAr ? 'مدفوعة' : 'Paid', value: inventions?.paid || 0, color: 'text-blue-700' },
              { label: isAr ? 'قيد المراجعة' : 'In Review', value: inventions?.underReview || 0, color: 'text-purple-700' },
              { label: isAr ? 'معتمدة / منجزة' : 'Approved', value: (inventions?.approved || 0) + (inventions?.completed || 0), color: 'text-emerald-700' }
            ].map(({ label, value, color }, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-semibold text-slate-500 block mb-1">{label}</span>
                <span className={`font-mono text-base sm:text-lg font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          <footer className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600">{isAr ? 'ملغاة أو مرفوضة:' : 'Terminated / Closed:'}</span>
            <span className="font-mono font-bold text-rose-600 text-sm">
              {(inventions?.rejected || 0) + (inventions?.cancelled || 0)}
            </span>
          </footer>
        </section>

        {/* قطاع المدفوعات */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <header className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div className="flex items-center gap-2.5">
              <CreditCard className="w-5 h-5 text-slate-700" />
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {isAr ? 'حالات بوابات الدفع' : 'Payment Status'}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
              {payments?.total || 0}
            </span>
          </header>

          <div className="space-y-2 text-xs">
            {[
              { label: isAr ? 'عمليات ناجحة' : 'Settled', value: payments?.paid || 0, Icon: CheckCircle, color: 'text-emerald-600' },
              { label: isAr ? 'بانتظار التحصيل' : 'Pending', value: payments?.unpaid || 0, Icon: Clock, color: 'text-amber-500' },
              { label: isAr ? 'محاولات فاشلة' : 'Failed', value: payments?.failed || 0, Icon: XCircle, color: 'text-rose-500' },
              { label: isAr ? 'مبالغ مستردة' : 'Refunded', value: payments?.refunded || 0, Icon: RotateCcw, color: 'text-slate-400' }
            ].map(({ label, value, Icon, color }, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2 text-slate-700 font-semibold">
                  <Icon className={`w-3.5 h-3.5 ${color}`} />
                  {label}
                </span>
                <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">{value}</span>
              </div>
            ))}
          </div>

          <footer className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>{isAr ? 'بوابة كاشير الإلكترونية' : 'Kashier Gateway'}</span>
            <span className="font-mono font-semibold text-emerald-600">Active</span>
          </footer>
        </section>

      </section>

    </div>
  );
}