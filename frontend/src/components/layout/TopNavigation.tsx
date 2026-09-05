import React, { useState, useContext } from 'react';
import { Bell, Search, Menu, User as UserIcon } from 'lucide-react';
import { LayoutContext } from '../../context/LayoutContext';
import { NotificationContext } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';
import { NotificationPanel } from './NotificationPanel';
import { ProfileDropdown } from './ProfileDropdown';
import { ThemeToggleSwitch } from '../common/ThemeToggleSwitch';

export const TopNavigation: React.FC<{ onOpenSearchModal: () => void }> = ({
  onOpenSearchModal,
}) => {
  const layout = useContext(LayoutContext);
  const notifCtx = useContext(NotificationContext);
  const { user } = useAuth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const unreadCount = notifCtx?.unreadCount || 0;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#F9F6F0]/90 dark:bg-[#1A110C]/90 backdrop-blur border-b border-slate-200/80 dark:border-[#382218]/80 px-4 md:px-6 flex items-center justify-between transition-colors duration-300">
      {/* Left side: Mobile Toggle Button & Quick Search Input */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => layout?.setSidebarOpen(!layout.sidebarOpen)}
          className="p-2 text-slate-600 dark:text-[#C5B7AE] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#281A12] rounded-xl md:hidden transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSearchModal}
          className="flex items-center text-xs text-slate-500 dark:text-[#C5B7AE] bg-white/80 dark:bg-[#120B08]/80 hover:border-[#C87A38] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#382218] w-52 sm:w-72 justify-between transition-colors shadow-sm"
        >
          <span className="flex items-center truncate">
            <Search className="w-4 h-4 mr-2 text-[#C87A38] shrink-0" />
            <span className="truncate">Search fleet vehicles, drivers...</span>
          </span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono text-[#A39185] bg-slate-100 dark:bg-[#241710] px-1.5 py-0.5 rounded">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right side: Notifications & Profile Menu */}
      <div className="flex items-center space-x-3">
        {/* Sliding Theme Switch */}
        <ThemeToggleSwitch size="md" />

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="p-2 text-slate-600 dark:text-[#C5B7AE] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-[#281A12] rounded-xl transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[#C87A38] ring-2 ring-white dark:ring-[#1A110C]"></span>
            )}
          </button>
          <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        <div className="h-4 w-px bg-slate-300 dark:bg-[#382218]" />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-200/50 dark:hover:bg-[#281A12] transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C87A38] to-[#B36423] text-white font-bold flex items-center justify-center text-xs uppercase shadow-md shadow-[#C87A38]/20">
              {user?.username ? user.username.charAt(0) : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 dark:text-[#FBF8F3] leading-tight capitalize">
                {user?.username || user?.fullName || 'Master Administrator'}
              </span>
              <span className="text-[10px] font-semibold text-[#C87A38] leading-tight">Fleet Master Admin</span>
            </div>
          </button>
          <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
      </div>
    </header>
  );
};

