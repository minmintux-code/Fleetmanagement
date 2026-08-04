import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const PATH_NAME_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  vehicles: 'Vehicle Management',
  drivers: 'Driver Management',
  trips: 'Trip Management',
  fuel: 'Fuel Management',
  maintenance: 'Maintenance & Repairs',
  expenses: 'Expense Management',
  customers: 'Customer Management',
  rentals: 'Rental & Lease Management',
  reports: 'Analytics & Reports',
  notifications: 'Notifications',
  settings: 'System Settings',
  profile: 'User Profile',
};

export const Breadcrumb: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center text-xs font-medium text-[#94A3B8] py-1" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-[#94A3B8] hover:text-[#2563EB] transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            Home
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = PATH_NAME_MAP[name] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <li key={routeTo} className="inline-flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B] mx-1" />
              {isLast ? (
                <span className="text-[#F8FAFC] font-medium">{displayName}</span>
              ) : (
                <Link to={routeTo} className="text-[#94A3B8] hover:text-[#2563EB] transition-colors">
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
