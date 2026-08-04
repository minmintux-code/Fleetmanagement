import React, { useState, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavigation } from './TopNavigation';
import { Breadcrumb } from './Breadcrumb';
import { Footer } from './Footer';
import { Modal } from '../common/Modal';
import { SearchInput } from '../common/SearchInput';
import { LayoutContext } from '../../context/LayoutContext';
import { NotificationContext } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const layout = useContext(LayoutContext);
  const notifCtx = useContext(NotificationContext);
  const navigate = useNavigate();

  const sidebarOpen = layout?.sidebarOpen ?? true;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const quickNavLinks = [
    { label: 'Vehicles Management', path: '/vehicles' },
    { label: 'Drivers & Operators', path: '/drivers' },
    { label: 'Active Trips & Dispatch', path: '/trips' },
    { label: 'Fuel Logs & Expense', path: '/fuel' },
    { label: 'Maintenance & Service', path: '/maintenance' },
    { label: 'Rentals & Leases', path: '/rentals' },
  ];

  const handleQuickNav = (path: string) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  const toastIcons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#22C55E] mr-2 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[#EF4444] mr-2 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-[#F59E0B] mr-2 shrink-0" />,
    info: <Info className="w-4 h-4 text-[#2563EB] mr-2 shrink-0" />,
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex text-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-150 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-16'
        }`}
      >
        {/* Top Header Navigation */}
        <TopNavigation onOpenSearchModal={() => setIsSearchOpen(true)} />

        {/* Breadcrumb Bar */}
        <div className="bg-[#0F172A] border-b border-[#334155] px-4 md:px-6 py-2">
          <Breadcrumb />
        </div>

        {/* Page Main Content Container */}
        <main className="flex-1 p-4 md:p-6 bg-[#0F172A]">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Quick Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Global Search"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Type vehicle plate, driver name, trip code, or module..."
          />
          <div>
            <h4 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Navigation Links
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickNavLinks.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleQuickNav(item.path)}
                  className="flex items-center justify-between p-2 text-left rounded-[10px] border border-[#334155] hover:border-[#2563EB] hover:bg-[#1E293B] text-xs font-medium text-[#F8FAFC] transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-[#94A3B8]">&rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Toast Alert Queue Container */}
      {notifCtx && notifCtx.toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 max-w-sm">
          {notifCtx.toasts.map((toast) => (
            <div
              key={toast.id}
              className="flex items-center justify-between bg-[#1E293B] text-[#F8FAFC] px-3.5 py-2.5 rounded-[10px] border border-[#334155] text-xs font-medium shadow-md"
            >
              <div className="flex items-center">
                {toastIcons[toast.type]}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => notifCtx.removeToast(toast.id)}
                className="ml-3 text-[#94A3B8] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
