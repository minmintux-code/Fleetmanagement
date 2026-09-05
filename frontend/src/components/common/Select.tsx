import { SelectHTMLAttributes, forwardRef } from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full rounded-xl border text-xs text-slate-800 dark:text-[#FBF8F3] bg-white/90 dark:bg-[#120B08]/90 transition-all focus:outline-none focus:ring-2 focus:ring-[#C87A38]/40 focus:border-[#C87A38] disabled:bg-slate-100 dark:disabled:bg-[#281A12] disabled:cursor-not-allowed px-3 py-2 ${
            error
              ? 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500'
              : 'border-slate-200 dark:border-[#382218]'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="" className="bg-white dark:bg-[#1A110C] text-slate-400">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#1A110C] text-slate-800 dark:text-[#FBF8F3]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-[11px] font-medium text-rose-500 animate-fade-in">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
