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
    <div className={`bg-[#1E293B] rounded-[10px] border border-[#334155] ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-[#334155] px-5 py-3.5">
          <div>
            {title && <h3 className="text-sm font-semibold text-[#F8FAFC]">{title}</h3>}
            {subtitle && <p className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={padding ? 'p-5' : ''}>{children}</div>
    </div>
  );
};
