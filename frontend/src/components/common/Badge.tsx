import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'purple';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
}) => {
  const variantMap = {
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-[#C87A38]/15 text-[#C87A38] dark:text-[#E89A4F] border-[#C87A38]/30',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    info: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
    secondary: 'bg-slate-200/70 dark:bg-[#281A12] text-slate-700 dark:text-[#C5B7AE] border-slate-300 dark:border-[#382218]',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/20',
  };

  const sizeMap = {
    sm: 'px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase',
    md: 'px-2.5 py-0.5 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-lg border ${variantMap[variant]} ${sizeMap[size]}`}
    >
      {children}
    </span>
  );
};

