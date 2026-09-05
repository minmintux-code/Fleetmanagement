import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface ThemeToggleSwitchProps {
  size?: 'sm' | 'md';
  className?: string;
  showLabels?: boolean;
}

export const ThemeToggleSwitch: React.FC<ThemeToggleSwitchProps> = ({
  size = 'md',
  className = '',
  showLabels = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const containerDimensions = {
    sm: 'w-12 h-6 p-0.5',
    md: 'w-16 h-8 p-1',
  };

  const knobDimensions = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={toggleTheme}
        type="button"
        aria-label="Toggle Theme"
        title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        className={`relative ${containerDimensions[size]} rounded-full transition-colors duration-300 flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#C87A38]/50 shadow-inner ${
          isDark
            ? 'bg-[#1C120D] border border-[#462D20]'
            : 'bg-[#EFE7DC] border border-[#D9CFC4]'
        }`}
      >
        {/* Background Sun/Moon Icons */}
        <Sun
          className={`${iconSizes[size]} text-amber-500 ml-1 opacity-70 transition-opacity ${
            isDark ? 'opacity-30' : 'opacity-100'
          }`}
        />
        <Moon
          className={`${iconSizes[size]} text-amber-400 mr-1 opacity-70 transition-opacity ${
            isDark ? 'opacity-100' : 'opacity-30'
          }`}
        />

        {/* Sliding Knob with Spring Animation */}
        <motion.div
          className={`absolute ${knobDimensions[size]} rounded-full bg-gradient-to-tr from-[#C87A38] to-[#B36423] text-white flex items-center justify-center shadow-md shadow-[#C87A38]/40`}
          animate={{
            x: isDark ? (size === 'sm' ? 24 : 32) : 0,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        >
          {isDark ? (
            <Moon className={`${iconSizes[size]} text-white fill-white`} />
          ) : (
            <Sun className={`${iconSizes[size]} text-white fill-white`} />
          )}
        </motion.div>
      </button>

      {showLabels && (
        <span className="text-xs font-bold text-slate-700 dark:text-[#C5B7AE] capitalize">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </div>
  );
};
