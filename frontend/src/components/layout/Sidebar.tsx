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
      ],
    },
    {
      group: 'Fleet Management',
      items: [
        { name: 'Vehicles', path: '/vehicles', icon: <Truck className="w-4 h-4" /> },
        { name: 'Drivers', path: '/drivers', icon: <Users className="w-4 h-4" /> },
        { name: 'Trips & Dispatch', path: '/trips', icon: <Navigation className="w-4 h-4" /> },
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
      className={`fixed top-0 left-0 z-40 h-screen text-[#F8FAFC] transition-all duration-150 flex flex-col border-r border-[#334155] ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}
      style={{ backgroundColor: '#1E293B' }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-[#334155]">
        <div className="flex items-center space-x-2.5 overflow-hidden">
          <div className="p-1.5 bg-[#2563EB] rounded-[8px] text-white shrink-0 flex items-center justify-center w-8 h-8">
            <Truck className="w-5 h-5" />
          </div>
          {sidebarOpen && (
            <span className="text-sm font-semibold text-[#F8FAFC] truncate tracking-tight">
              {APP_NAME}
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-[#334155] text-[#94A3B8] hover:text-[#F8FAFC] transition-colors hidden md:block"
          title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Group Items */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
        {navigationGroups.map((group, idx) => (
          <div key={idx}>
            {sidebarOpen && (
              <h4 className="px-2.5 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">
                {group.group}
              </h4>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-2.5 py-2 rounded-[8px] text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-[#2563EB] text-white font-semibold'
                        : 'text-[#94A3B8] hover:bg-[#334155]/60 hover:text-[#F8FAFC]'
                    }`
                  }
                >
                  <span className="shrink-0 mr-2.5">{item.icon}</span>
                  {sidebarOpen && <span className="truncate">{item.name}</span>}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
