import React, { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
  const location = useLocation();

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
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 mr-2 shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 mr-2 shrink-0" />,
    info: <Info className="w-4 h-4 text-blue-500 mr-2 shrink-0" />,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B132B] flex text-slate-800 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-out ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-16'
        }`}
      >
        {/* Top Header Navigation */}
        <TopNavigation onOpenSearchModal={() => setIsSearchOpen(true)} />

        {/* Breadcrumb Bar */}
        <div className="bg-slate-50/80 dark:bg-[#0B132B]/80 backdrop-blur border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-6 py-2 sticky top-14 z-20">
          <Breadcrumb />
        </div>

        {/* Page Main Content Container with Framer Motion Route Transition */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{
                duration: 0.22,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Quick Search Modal */}
      <Modal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        title="Global System Search"
        maxWidth="lg"
      >
        <div className="space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Type vehicle plate, driver name, trip code, or module..."
          />
          <div>
            <h4 className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Quick Navigation Modules
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickNavLinks.map((item) => (
                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  key={item.path}
                  onClick={() => handleQuickNav(item.path)}
                  className="flex items-center justify-between p-2.5 text-left rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 text-xs font-medium text-slate-800 dark:text-slate-100 transition-colors"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-blue-500 font-bold">&rarr;</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Animated Toast Alert Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2.5 max-w-sm pointer-events-none">
        <AnimatePresence>
          {notifCtx &&
            notifCtx.toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 80, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="pointer-events-auto flex items-center justify-between glass-modal text-slate-800 dark:text-slate-100 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium shadow-xl"
              >
                <div className="flex items-center pr-2">
                  {toastIcons[toast.type]}
                  <span>{toast.message}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => notifCtx.removeToast(toast.id)}
                  className="ml-3 text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

