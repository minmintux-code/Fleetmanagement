import React, { ReactNode, useEffect } from 'react';
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

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#0F172A]/70 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${maxWidthClasses[maxWidth]} rounded-[10px] bg-[#1E293B] border border-[#334155] z-10 shadow-lg`}
        >
          <div className="flex items-center justify-between border-b border-[#334155] px-5 py-3.5">
            <h3 className="text-sm font-semibold text-[#F8FAFC]">{title}</h3>
            <button
              onClick={onClose}
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors p-1 rounded hover:bg-[#334155]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-5 py-4 text-[#F8FAFC]">{children}</div>
        </div>
      </div>
    </div>
  );
};
