import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
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
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { LayoutContext } from '../../context/LayoutContext';
import { APP_NAME } from '../../utils/constants';

interface NavGroup {
  group: string;
  items: {
    name: string;
    path: string;
    icon: React.ReactNode;
    badge?: string;
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
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      ],
    },
    {
      group: 'Fleet Management',
      items: [
        { name: 'Vehicles', path: '/vehicles', icon: <Truck className="w-5 h-5" />, badge: '48' },
        { name: 'Drivers', path: '/drivers', icon: <Users className="w-5 h-5" /> },
        { name: 'Trips & Dispatch', path: '/trips', icon: <Navigation className="w-5 h-5" />, badge: '14' },
      ],
    },
    {
      group: 'Operations & Costs',
      items: [
        { name: 'Fuel Logs', path: '/fuel', icon: <Fuel className="w-5 h-5" /> },
        { name: 'Maintenance', path: '/maintenance', icon: <Wrench className="w-5 h-5" />, badge: 'Alert' },
        { name: 'Expenses', path: '/expenses', icon: <DollarSign className="w-5 h-5" /> },
      ],
    },
    {
      group: 'Clients & Commercial',
      items: [
        { name: 'Customers', path: '/customers', icon: <UserCheck className="w-5 h-5" /> },
        { name: 'Rentals & Leases', path: '/rentals', icon: <KeyRound className="w-5 h-5" /> },
      ],
    },
    {
      group: 'Intelligence & System',
      items: [
        { name: 'Reports & Analytics', path: '/reports', icon: <BarChart3 className="w-5 h-5" /> },
        { name: 'Notifications', path: '/notifications', icon: <Bell className="w-5 h-5" /> },
        { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col border-r border-slate-800 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Sidebar Header / Brand Logo */}
      <div className="flex items-center justify-between h-16 px-4 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="p-2 bg-blue-600 rounded-lg text-white font-bold text-lg shrink-0 flex items-center justify-center w-10 h-10 shadow-md">
            <Truck className="w-6 h-6" />
          </div>
          {sidebarOpen && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white tracking-tight">{APP_NAME}</span>
              <span className="text-[10px] uppercase font-semibold text-blue-400 tracking-wider">
                Enterprise v5.0
              </span>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors hidden md:block"
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navigationGroups.map((group, idx) => (
          <div key={idx}>
            {sidebarOpen && (
              <h4 className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {group.group}
              </h4>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <span className="shrink-0">{item.icon}</span>
                    {sidebarOpen && <span className="truncate">{item.name}</span>}
                  </div>
                  {sidebarOpen && item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.badge === 'Alert'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer Info */}
      {sidebarOpen && (
        <div className="p-3 bg-slate-950/60 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="text-slate-200 font-semibold">System Operational</p>
              <p className="text-slate-500 text-[11px]">All endpoints healthy</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
