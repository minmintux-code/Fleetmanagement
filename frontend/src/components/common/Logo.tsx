import React from 'react';

export interface LogoProps {
  /** Size variant: 'sm' (sidebar/header), 'md' (standard), 'lg' (auth/hero) */
  size?: 'sm' | 'md' | 'lg';
  /** Toggle brand text display alongside logo icon */
  showText?: boolean;
  /** Text color variant: 'auto' (adapts to light/dark mode), 'light' (always light text for dark backgrounds), 'dark' (always dark text) */
  variant?: 'auto' | 'light' | 'dark';
  /** Extra container styling */
  className?: string;
}

/**
 * Fleet Master Brand Logo Component
 * Renders the official Fleet Master heavy-duty commercial truck emblem.
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  variant = 'auto',
  className = '',
}) => {
  const containerSizes = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  const imageSizes = {
    sm: 'h-7 w-auto',
    md: 'h-9 w-auto',
    lg: 'h-12 w-auto',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
  };

  const textColors = {
    auto: 'text-slate-900 dark:text-[#FBF8F3]',
    light: 'text-[#FBF8F3]',
    dark: 'text-slate-900',
  };

  return (
    <div className={`flex items-center space-x-3 overflow-hidden transition-all duration-300 ${containerSizes[size]} ${className}`}>
      {/* Official Fleet Master Emblem */}
      <img
        src="/logo.png"
        alt="Fleet Master"
        className={`${imageSizes[size]} object-contain shrink-0 filter drop-shadow-md transition-transform duration-300 hover:scale-105`}
      />

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={`${textSizes[size]} font-extrabold tracking-wider ${textColors[variant]} uppercase truncate transition-colors duration-300 font-sans`}
          >
            FLEET<span className="text-[#C87A38]">MASTER</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;

