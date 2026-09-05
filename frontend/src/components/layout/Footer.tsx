import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-[#F9F6F0]/90 dark:bg-[#1A110C]/90 border-t border-slate-200/80 dark:border-[#382218] py-3.5 px-6 text-xs text-slate-500 dark:text-[#A39185] flex flex-col sm:flex-row items-center justify-between">
      <div>
        &copy; {new Date().getFullYear()} <span className="font-bold text-slate-800 dark:text-[#FBF8F3]">Fleet Master</span>. Commercial Logistics Operations.
      </div>
      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
        <span className="inline-flex items-center text-[11px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
          SQL DB & REST API Connected
        </span>
        <a href="#privacy" className="hover:text-[#C87A38] transition-colors">Privacy Policy</a>
        <a href="#terms" className="hover:text-[#C87A38] transition-colors">Terms of Service</a>
      </div>
    </footer>
  );
};

