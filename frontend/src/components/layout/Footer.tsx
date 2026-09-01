import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-3 px-6 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between">
      <div>
        &copy; {new Date().getFullYear()} <span className="font-semibold text-slate-700 dark:text-slate-300">NexFleet</span>. All rights reserved.
      </div>
      <div className="flex items-center space-x-4 mt-2 sm:mt-0">
        <span className="inline-flex items-center text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
          Backend API v1.0 Connected
        </span>
        <a href="#privacy" className="hover:text-blue-600">Privacy Policy</a>
        <a href="#terms" className="hover:text-blue-600">Terms of Service</a>
      </div>
    </footer>
  );
};
