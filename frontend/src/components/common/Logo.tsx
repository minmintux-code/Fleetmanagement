import React from 'react';
import { Truck } from 'lucide-react';
import { APP_NAME } from '../../utils/constants';

export interface LogoProps {
  /** Size variant: 'sm' (sidebar/header), 'md' (standard), 'lg' (auth/hero) */
  size?: 'sm' | 'md' | 'lg';
  /** Toggle brand text display alongside logo icon */
  showText?: boolean;
  /** Extra container styling */
  className?: string;
}

/**
 * NexFleet Logo Component
 * A clean, modern brand logo with smooth gradient badge and text.
 * Simple, modular, and easy to explain.
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  // Sizing definitions for easy adjustments and clear code explanation
  const iconSizes = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-xl',
  };

  const svgSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  return (
    <div className={`flex items-center space-x-2.5 overflow-hidden transition-all duration-300 ${className}`}>
      {/* Emblem Icon with Gradient & Shadow */}
      <div
        className={`${iconSizes[size]} bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 transition-transform duration-300 hover:scale-105`}
      >
        <Truck className={`${svgSizes[size]} text-white`} />
      </div>

      {/* Brand Text */}
      {showText && (
        <span
          className={`${textSizes[size]} font-bold tracking-tight text-slate-900 dark:text-white truncate transition-opacity duration-300`}
        >
          {APP_NAME}
        </span>
      )}
    </div>
  );
};

export default Logo;
