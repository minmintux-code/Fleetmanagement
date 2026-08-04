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
    <header className="sticky top-0 z-30 h-14 bg-[#1E293B] border-b border-[#334155] px-4 md:px-6 flex items-center justify-between">
      {/* Left side: Mobile Toggle Button & Quick Search Input */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => layout?.setSidebarOpen(!layout.sidebarOpen)}
          className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155] rounded md:hidden transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSearchModal}
          className="flex items-center text-xs text-[#94A3B8] bg-[#0F172A] hover:bg-[#152032] px-3 py-1.5 rounded-[10px] border border-[#334155] w-48 sm:w-64 justify-between transition-colors"
        >
          <span className="flex items-center truncate">
            <Search className="w-3.5 h-3.5 mr-2 text-[#94A3B8] shrink-0" />
            <span className="truncate">Search vehicles, drivers...</span>
          </span>
          <kbd className="hidden sm:inline-block text-[10px] font-mono text-[#64748B] ml-2">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right side: Notifications & Profile Menu */}
      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="p-1.5 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155] rounded transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#EF4444]"></span>
            )}
          </button>
          <NotificationPanel isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        <div className="h-4 w-px bg-[#334155]" />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center space-x-2 p-1 rounded hover:bg-[#334155] transition-colors"
          >
            <div className="w-7 h-7 rounded-[8px] bg-[#2563EB] text-white font-medium flex items-center justify-center text-xs">
              {user?.name ? user.name.charAt(0) : <UserIcon className="w-3.5 h-3.5" />}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-medium text-[#F8FAFC] leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-[#94A3B8] leading-tight">{user?.role || 'Admin'}</span>
            </div>
          </button>
          <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
      </div>
    </header>
  );
};
