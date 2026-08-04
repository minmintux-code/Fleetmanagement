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
          <label className="block text-xs font-medium text-[#94A3B8] mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full rounded-[10px] border text-xs text-[#F8FAFC] bg-[#0F172A] transition-colors focus:outline-none focus:border-[#2563EB] disabled:bg-slate-800 disabled:cursor-not-allowed px-2.5 py-1.5 ${
            error
              ? 'border-[#EF4444] focus:border-[#EF4444]'
              : 'border-[#334155]'
          } ${className}`}
          {...props}
        >
          {placeholder && <option value="" className="bg-[#1E293B] text-[#94A3B8]">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1E293B] text-[#F8FAFC]">
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
