import React, { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-[#94A3B8] mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#94A3B8]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-[10px] border text-xs text-[#F8FAFC] bg-[#0F172A] placeholder-[#64748B] transition-colors focus:outline-none focus:border-[#2563EB] disabled:bg-slate-800 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-8' : 'pl-2.5'
            } pr-2.5 py-1.5 ${
              error
                ? 'border-[#EF4444] focus:border-[#EF4444]'
                : 'border-[#334155]'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-[#EF4444]">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-[#94A3B8]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
