import React, { ReactNode } from 'react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  padding = true,
}) => {
  return (
    <div className={`glass-card rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-lg ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/60 px-6 py-4 bg-slate-50/40 dark:bg-slate-800/30">
          <div>
            {title && <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={padding ? 'p-6' : ''}>{children}</div>
    </div>
  );
};

