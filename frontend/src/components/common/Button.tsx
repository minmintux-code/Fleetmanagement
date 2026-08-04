import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors rounded-[10px] focus:outline-none focus:ring-1 focus:ring-[#2563EB] disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-1.5 text-xs',
    lg: 'px-4 py-2 text-sm',
  };

  const variantClasses = {
    primary: 'bg-[#2563EB] hover:bg-blue-600 text-[#F8FAFC]',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-[#F8FAFC]',
    outline: 'border border-[#334155] bg-[#1E293B] hover:bg-[#334155] text-[#F8FAFC]',
    danger: 'bg-[#EF4444] hover:bg-red-600 text-white',
    success: 'bg-[#22C55E] hover:bg-green-600 text-white',
    ghost: 'bg-transparent hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC]',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
      ) : icon ? (
        <span className="mr-1.5 inline-flex">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
