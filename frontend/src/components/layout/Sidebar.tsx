import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Truck,
  Users,
  Navigation,
  Fuel,
  Wrench,
  DollarSign,
  UserCheck,
  KeyRound,
  BarChart3,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  MapPin,
  CalendarCheck,
} from 'lucide-react';
import { LayoutContext } from '../../context/LayoutContext';
import { Logo } from '../common/Logo';
import { ThemeToggleSwitch } from '../common/ThemeToggleSwitch';

interface NavGroup {
  group: string;
  items: {
    name: string;
    path: string;
    icon: React.ReactNode;
  }[];
}

export const Sidebar: React.FC = () => {
  const layout = useContext(LayoutContext);
  const sidebarOpen = layout?.sidebarOpen ?? true;
  const toggleSidebar = layout?.toggleSidebar;

  const navigationGroups: NavGroup[] = [
    {
      group: 'Overview',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { name: 'Live Telematics Map', path: '/live-map', icon: <MapPin className="w-4 h-4 text-emerald-400" /> },
      ],
    },
    {
      group: 'Fleet Management',
      items: [
        { name: 'Vehicles', path: '/vehicles', icon: <Truck className="w-4 h-4" /> },
        { name: 'Drivers', path: '/drivers', icon: <Users className="w-4 h-4" /> },
        { name: 'Trips & Dispatch', path: '/trips', icon: <Navigation className="w-4 h-4" /> },
        { name: 'Service Schedules', path: '/service-schedules', icon: <CalendarCheck className="w-4 h-4 text-indigo-400" /> },
      ],
    },
    {
      group: 'Operations & Costs',
      items: [
        { name: 'Fuel Logs', path: '/fuel', icon: <Fuel className="w-4 h-4" /> },
        { name: 'Maintenance', path: '/maintenance', icon: <Wrench className="w-4 h-4" /> },
        { name: 'Expenses', path: '/expenses', icon: <DollarSign className="w-4 h-4" /> },
      ],
    },
    {
      group: 'Clients & Commercial',
      items: [
        { name: 'Customers', path: '/customers', icon: <UserCheck className="w-4 h-4" /> },
        { name: 'Rentals & Leases', path: '/rentals', icon: <KeyRound className="w-4 h-4" /> },
      ],
    },
    {
      group: 'System',
      items: [
        { name: 'Reports & Analytics', path: '/reports', icon: <BarChart3 className="w-4 h-4" /> },
        { name: 'Notifications', path: '/notifications', icon: <Bell className="w-4 h-4" /> },
        { name: 'Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-[#140D09] text-slate-100 transition-all duration-300 ease-out flex flex-col border-r border-[#382218]/80 shadow-2xl ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-[#382218]/80 bg-[#1A110C]/90 backdrop-blur">
        <Logo showText={sidebarOpen} size="sm" variant="light" />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg hover:bg-[#2C1C14] text-[#A39185] hover:text-white transition-colors hidden md:block shrink-0"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navigationGroups.map((group, idx) => (
          <div key={idx}>
            {sidebarOpen && (
              <h4 className="px-3 text-[10px] font-bold text-[#A39185] uppercase tracking-widest mb-1.5">
                {group.group}
              </h4>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative flex items-center px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-[#C87A38] to-[#B36423] text-white shadow-lg shadow-[#C87A38]/30 glow-accent'
                        : 'text-[#C5B7AE] hover:bg-[#281A12] hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`shrink-0 mr-3 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`}>
                        {item.icon}
                      </span>
                      {sidebarOpen && <span className="truncate">{item.name}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Theme Sliding Switch Footer */}
      <div className="p-3 border-t border-[#382218]/80 bg-[#1A110C]/80 flex items-center justify-between">
        {sidebarOpen && <span className="text-[11px] font-bold text-[#A39185] uppercase tracking-wider">Appearance</span>}
        <ThemeToggleSwitch size="sm" showLabels={false} />
      </div>
    </aside>
  );
};


