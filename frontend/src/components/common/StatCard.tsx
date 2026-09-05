import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
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
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="glass-card rounded-2xl p-5 border border-slate-200/90 dark:border-[#382218] shadow-lg relative overflow-hidden group"
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 dark:text-[#A39185] uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2.5 rounded-xl bg-[#C87A38]/15 text-[#C87A38] dark:text-[#E89A4F] group-hover:scale-110 transition-transform shadow-sm">
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-black text-slate-900 dark:text-[#FBF8F3] tracking-tight">{value}</div>
        {trend && (
          <div
            className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
              trend.isPositive
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
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
      {description && <p className="mt-1.5 text-xs text-slate-500 dark:text-[#A39185] font-medium">{description}</p>}
    </motion.div>
  );
};

