import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'style'> {
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
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C87A38]/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs',
    lg: 'px-5 py-2.5 text-sm',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-[#C87A38] to-[#B36423] hover:from-[#D48B46] hover:to-[#C87A38] text-white shadow-[#C87A38]/30 glow-accent',
    secondary: 'bg-[#2E1F18] hover:bg-[#3D2920] text-[#FBF8F3] border border-[#4D352A]',
    outline: 'border border-slate-300 dark:border-[#382218] bg-white/80 dark:bg-[#1A110C]/80 hover:bg-slate-100 dark:hover:bg-[#281A12] text-slate-800 dark:text-[#FBF8F3] backdrop-blur',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/25',
    success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/25',
    ghost: 'bg-transparent hover:bg-slate-200/60 dark:hover:bg-[#281A12] text-slate-600 dark:text-[#C5B7AE] hover:text-slate-900 dark:hover:text-white border-0 shadow-none',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...(props as any)}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin shrink-0" />
      ) : icon ? (
        <span className="mr-1.5 inline-flex shrink-0">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  );
};

