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
    success: 'bg-emerald-950/60 text-[#22C55E] border-emerald-800/60',
    warning: 'bg-amber-950/60 text-[#F59E0B] border-amber-800/60',
    danger: 'bg-red-950/60 text-[#EF4444] border-red-800/60',
    info: 'bg-blue-950/60 text-[#2563EB] border-blue-800/60',
    secondary: 'bg-slate-800 text-[#94A3B8] border-slate-700',
    purple: 'bg-purple-950/60 text-purple-400 border-purple-800/60',
  };

  const sizeMap = {
    sm: 'px-1.5 py-0.5 text-[11px] font-medium',
    md: 'px-2 py-0.5 text-xs font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded border ${variantMap[variant]} ${sizeMap[size]}`}
    >
      {children}
    </span>
  );
};
