import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { Loader2, Phone, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminComplaints() {
  const { isAr } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/complaints/all');
      setComplaints(res.data?.data || []);
    } catch (err) {
      console.error(err);
      setError(isAr ? 'فشل تحميل الشكاوى من الخادم' : 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isAr ? 'إدارة الشكاوى والملاحظات' : 'Complaints & Field Issues'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isAr ? 'متابعة كافة الشكاوى المسجلة من العملاء عبر الموقع' : 'Review incoming issues and inspection reports.'}
          </p>
        </div>
        <button
          onClick={fetchComplaints}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 -xs cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{isAr ? 'تحديث' : 'Refresh'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 -xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium">{isAr ? 'جاري تحميل الشكاوى...' : 'Loading records...'}</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            {isAr ? 'لا توجد شكاوى مسجلة حالياً.' : 'No complaints recorded yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-start">{isAr ? 'العميل' : 'Client'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'الهاتف' : 'Phone'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'النوع' : 'Type'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'العنوان' : 'Subject'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'التفاصيل' : 'Details'}</th>
                  <th className="py-3 px-4 text-start">{isAr ? 'التاريخ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{item.name}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {item.phone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-[200px] truncate">{item.title}</td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[300px] truncate">{item.details}</td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}