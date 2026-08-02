import React from 'react';
import { Vehicle } from '../../types';
import { Badge } from '../common/Badge';
import { VEHICLE_STATUS_LABELS } from '../../utils/constants';
import { Truck, MapPin, Gauge, Fuel } from 'lucide-react';

export const VehicleStatusCard: React.FC<{ vehicle: Vehicle; onClick?: () => void }> = ({
  vehicle,
  onClick,
}) => {
  const meta = VEHICLE_STATUS_LABELS[vehicle.status] || { label: vehicle.status, variant: 'secondary' };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-slate-100 rounded-lg text-slate-700">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{vehicle.plateNumber}</h4>
            <p className="text-xs text-slate-500">
              {vehicle.make} {vehicle.model} ({vehicle.year})
            </p>
          </div>
        </div>
        <Badge variant={meta.variant as any}>{meta.label}</Badge>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-600">
        <div className="flex items-center space-x-1.5">
          <Gauge className="w-3.5 h-3.5 text-slate-400" />
          <span>{vehicle.mileage.toLocaleString()} km</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Fuel className="w-3.5 h-3.5 text-slate-400" />
          <span>{vehicle.currentFuelLevel}% Fuel</span>
        </div>
        <div className="flex items-center space-x-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">{vehicle.location || 'Depot'}</span>
        </div>
      </div>
    </div>
  );
};
