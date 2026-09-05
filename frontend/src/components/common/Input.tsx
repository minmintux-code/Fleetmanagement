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
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full rounded-xl border text-xs text-slate-800 dark:text-[#FBF8F3] bg-white/90 dark:bg-[#120B08]/90 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#C87A38]/40 focus:border-[#C87A38] disabled:bg-slate-100 dark:disabled:bg-[#281A12] disabled:cursor-not-allowed ${
              leftIcon ? 'pl-9' : 'pl-3'
            } pr-3 py-2 ${
              error
                ? 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500'
                : 'border-slate-200 dark:border-[#382218]'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-[11px] font-medium text-rose-500 animate-fade-in">{error}</p>}
        {helperText && !error && <p className="mt-1 text-[11px] text-slate-400 font-medium">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

