import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ShieldAlert, Home } from 'lucide-react';

export const PermissionDeniedPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-red-50 text-red-600 rounded-full mb-4">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">403</h1>
      <h2 className="text-lg font-semibold text-slate-700 mt-2">Access Denied</h2>
      <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
        You do not have the required administrative role or privileges to access this module.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" icon={<Home className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
