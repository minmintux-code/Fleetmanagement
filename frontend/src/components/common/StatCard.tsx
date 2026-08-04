import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
  variant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'slate';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  description,
}) => {
  return (
    <div className="bg-[#1E293B] rounded-[10px] border border-[#334155] p-4 transition-colors hover:border-[#475569]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
          {title}
        </span>
        {icon && <div className="text-[#94A3B8] shrink-0">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-xl font-bold text-[#F8FAFC] tracking-tight">{value}</div>
        {trend && (
          <div
            className={`flex items-center text-xs font-medium ${
              trend.isPositive ? 'text-[#22C55E]' : 'text-[#EF4444]'
            }`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
            )}
            {trend.value}
          </div>
        )}
      </div>
      {description && <p className="mt-1 text-xs text-[#94A3B8]">{description}</p>}
    </div>
  );
};
