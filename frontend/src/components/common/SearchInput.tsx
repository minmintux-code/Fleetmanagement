import React from 'react';
import { Search, X } from 'lucide-react';

export interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search records...',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-500 dark:text-[#94A3B8]">
        <Search className="w-3.5 h-3.5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 pr-7 py-1.5 border border-slate-200 dark:border-[#334155] rounded-[10px] text-xs bg-slate-50 dark:bg-[#0F172A] text-slate-800 dark:text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] dark:focus:border-blue-500 transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-500 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-slate-800 dark:text-[#F8FAFC]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
