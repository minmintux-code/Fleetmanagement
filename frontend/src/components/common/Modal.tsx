import React, { ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Animated Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/60 dark:bg-[#060D1F]/80 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Animated Spring Pop-up Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 28,
            }}
            className={`relative w-full ${maxWidthClasses[maxWidth]} rounded-[14px] glass-modal z-10 shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/60`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-700/60 px-6 py-4 bg-slate-50/50 dark:bg-slate-800/40">
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                {title}
              </h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700/60"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 text-slate-800 dark:text-slate-100 max-h-[80vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

