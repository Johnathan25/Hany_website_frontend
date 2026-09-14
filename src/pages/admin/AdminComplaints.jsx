import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { 
  Loader2, 
  Phone, 
  Calendar, 
  AlertCircle, 
  RefreshCw, 
  Eye, 
  X, 
  User, 
  Tag, 
  FileText, 
  AlignLeft,
  Clock
} from 'lucide-react';

export default function AdminComplaints() {
  const { isAr } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

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
      {/* رأس الصفحة */}
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
          type="button"
          onClick={fetchComplaints}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 shadow-xs cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{isAr ? 'تحديث' : 'Refresh'}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* جدول الشكاوى */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
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
                  <th className="py-3.5 px-4 text-start">{isAr ? 'العميل' : 'Client'}</th>
                  <th className="py-3.5 px-4 text-start">{isAr ? 'الهاتف' : 'Phone'}</th>
                  <th className="py-3.5 px-4 text-start">{isAr ? 'النوع' : 'Type'}</th>
                  <th className="py-3.5 px-4 text-start">{isAr ? 'العنوان' : 'Subject'}</th>
                  <th className="py-3.5 px-4 text-start">{isAr ? 'التفاصيل' : 'Details'}</th>
                  <th className="py-3.5 px-4 text-start">{isAr ? 'التاريخ' : 'Date'}</th>
                  <th className="py-3.5 px-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <a 
                        href={`tel:${item.phone}`} 
                        className="inline-flex items-center gap-1 font-mono text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.phone}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800 max-w-[180px] truncate">
                      {item.title}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-[240px] truncate">
                      {item.details}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono text-xs">
                      {new Date(item.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedComplaint(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 text-xs font-medium cursor-pointer transition-all active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isAr ? 'عرض' : 'View'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* نافذة عرض تفاصيل الشكوى (Details Modal) */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] font-mono text-blue-600 uppercase tracking-wider font-semibold">
                  #{selectedComplaint._id?.slice(-8)?.toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedComplaint.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* بيانات العميل والمعاملة */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500">{isAr ? 'اسم العميل:' : 'Client:'}</span>
                <strong className="text-slate-900">{selectedComplaint.name}</strong>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500">{isAr ? 'رقم الهاتف:' : 'Phone:'}</span>
                <a 
                  href={`tel:${selectedComplaint.phone}`} 
                  className="font-mono text-blue-600 hover:underline font-bold"
                >
                  {selectedComplaint.phone}
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500">{isAr ? 'التصنيف:' : 'Category:'}</span>
                <span className="font-semibold text-slate-900">{selectedComplaint.type}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500">{isAr ? 'تاريخ التقديم:' : 'Submitted:'}</span>
                <span className="font-mono text-slate-900">
                  {new Date(selectedComplaint.createdAt).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                </span>
              </div>
            </div>

            {/* تفاصيل الشكوى الكاملة */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <AlignLeft className="w-4 h-4 text-blue-600" />
                <span>{isAr ? 'نص الشكوى والملاحظات:' : 'Complaint Body & Description:'}</span>
              </h4>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {selectedComplaint.details}
              </div>
            </div>

            {/* إجراءات الإغلاق والاتصال */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
             

              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}