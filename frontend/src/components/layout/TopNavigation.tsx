import React, { useState, useContext } from 'react';
import { Bell, Search, Menu, User as UserIcon } from 'lucide-react';
import { LayoutContext } from '../../context/LayoutContext';
import { NotificationContext } from '../../context/NotificationContext';
import { useAuth } from '../../hooks/useAuth';
import { NotificationPanel } from './NotificationPanel';
import { ProfileDropdown } from './ProfileDropdown';

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
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shadow-2xs">
      {/* Mobile Toggle Button & Quick Search Input */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => layout?.setSidebarOpen(!layout.sidebarOpen)}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSearchModal}
          className="flex items-center text-xs text-slate-400 bg-slate-100 hover:bg-slate-200/80 px-3 py-2 rounded-lg border border-slate-200 w-48 sm:w-72 justify-between transition-all"
        >
          <span className="flex items-center">
            <Search className="w-4 h-4 mr-2 text-slate-500" />
            <span>Search vehicles, drivers...</span>
          </span>
          <kbd className="hidden sm:inline-block text-[10px] font-semibold bg-white border border-slate-300 rounded px-1.5 py-0.5 text-slate-500">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Header Actions: Notifications & Profile Menu */}
      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* Vertical Separator */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* User Profile Dropdown Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              {user?.name ? user.name.charAt(0) : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-500 leading-tight">{user?.role || 'Admin'}</span>
            </div>
          </button>
          <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
      </div>
    </header>
  );
};
