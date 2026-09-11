import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'بحث...',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      {/* أيقونة البحث */}
      <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3 text-slate-400 pointer-events-none" />

      {/* حقل الإدخال */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none shadow-xs transition-all"
      />

      {/* زر مسح النص عند وجود قيمة */}
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}