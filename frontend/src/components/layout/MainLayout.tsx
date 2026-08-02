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
    { label: 'Maintenance & Service Workorders', path: '/maintenance' },
    { label: 'Rentals & Leases', path: '/rentals' },
  ];

  const handleQuickNav = (path: string) => {
    setIsSearchOpen(false);
    navigate(path);
  };

  const toastIcons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-500 mr-2 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-500 mr-2 shrink-0" />,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        {/* Top Header Navigation */}
        <TopNavigation onOpenSearchModal={() => setIsSearchOpen(true)} />

        {/* Breadcrumb Bar */}
        <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-2.5">
          <Breadcrumb />
        </div>

        {/* Page Main Content Container */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Quick Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Fleet Enterprise Global Search"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Type vehicle plate, driver name, trip code, or module..."
          />
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Quick Module Navigation
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickNavLinks.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleQuickNav(item.path)}
                  className="flex items-center justify-between p-2.5 text-left rounded-md border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-xs font-medium text-slate-700 transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-slate-400">&rarr;</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Toast Alert Queue Container */}
      {notifCtx && notifCtx.toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm">
          {notifCtx.toasts.map((toast) => (
            <div
              key={toast.id}
              className="flex items-center justify-between bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg border border-slate-800 text-xs font-medium"
            >
              <div className="flex items-center">
                {toastIcons[toast.type]}
                <span>{toast.message}</span>
              </div>
              <button
                onClick={() => notifCtx.removeToast(toast.id)}
                className="ml-3 text-slate-400 hover:text-white"
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
