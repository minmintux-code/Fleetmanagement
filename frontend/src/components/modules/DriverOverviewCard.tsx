import React from 'react';
import { Driver } from '../../types';
import { Badge } from '../common/Badge';
import { DRIVER_STATUS_LABELS } from '../../utils/constants';
import { Shield, Phone, Award } from 'lucide-react';

export const DriverOverviewCard: React.FC<{ driver: Driver }> = ({ driver }) => {
  const meta = DRIVER_STATUS_LABELS[driver.status] || { label: driver.status, variant: 'secondary' };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
            {driver.firstName.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{driver.fullName}</h4>
            <p className="text-xs text-slate-500">{driver.licenseCategory}</p>
          </div>
        </div>
        <Badge variant={meta.variant as any}>{meta.label}</Badge>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Shield className="w-3.5 h-3.5 mr-1.5 text-emerald-600" /> Safety Rating:
          </span>
          <span className="font-bold text-slate-900">{driver.safetyScore} / 100</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <Award className="w-3.5 h-3.5 mr-1.5 text-blue-600" /> Total Trips:
          </span>
          <span className="font-bold text-slate-900">{driver.totalTripsCompleted}</span>
        </div>
        <div className="flex items-center text-slate-500 pt-1">
          <Phone className="w-3.5 h-3.5 mr-1.5" /> {driver.phone}
        </div>
      </div>
    </div>
  );
};
