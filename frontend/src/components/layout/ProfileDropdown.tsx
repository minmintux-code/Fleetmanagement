import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const ProfileDropdown: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogout = async () => {
    onClose();
    await logout();
    navigate('/login');
  };

  return (
    <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white shadow-xl border border-slate-200 z-50 py-1 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
        <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Administrator'}</p>
        <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@fleetmaster.com'}</p>
        <div className="mt-1.5 inline-flex items-center text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          <Shield className="w-3 h-3 mr-1" /> {user?.role || 'ADMIN'}
        </div>
      </div>

      <div className="py-1">
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <UserIcon className="w-4 h-4 mr-2.5 text-slate-400" /> My Profile
        </Link>
        <Link
          to="/settings"
          onClick={onClose}
          className="flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Settings className="w-4 h-4 mr-2.5 text-slate-400" /> Account Settings
        </Link>
      </div>

      <div className="border-t border-slate-100 pt-1">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2.5" /> Sign Out
        </button>
      </div>
    </div>
  );
};
