import React from 'react';
import { Vehicle } from '../../types';
import { DataTable, Column } from './DataTable';
import { Badge } from '../common/Badge';
import { VEHICLE_STATUS_LABELS } from '../../utils/constants';
import { formatNumber } from '../../utils/formatters';
import { Truck, Edit, Trash2, Eye } from 'lucide-react';

export interface VehicleTableProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (id: string) => void;
  onView?: (vehicle: Vehicle) => void;
}

export const VehicleTable: React.FC<VehicleTableProps> = ({
  vehicles,
  isLoading,
  onEdit,
  onDelete,
  onView,
}) => {
  const columns: Column<Vehicle>[] = [
    {
      header: 'Vehicle & Plate',
      cell: (v) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-100 text-slate-600 rounded-md shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{v.plateNumber}</span>
            <span className="text-xs text-slate-500">
              {v.year} {v.make} {v.model}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'VIN',
      cell: (v) => <span className="font-mono text-xs text-slate-600">{v.vin}</span>,
    },
    {
      header: 'Type & Fuel',
      cell: (v) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800 block">{v.type}</span>
          <span className="text-slate-500 uppercase">{v.fuelType}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (v) => {
        const meta = VEHICLE_STATUS_LABELS[v.status] || { label: v.status, variant: 'secondary' };
        return <Badge variant={meta.variant as any}>{meta.label}</Badge>;
      },
    },
    {
      header: 'Mileage & Location',
      cell: (v) => (
        <div>
          <span className="font-semibold text-slate-800 block text-xs">
            {formatNumber(v.mileage)} km
          </span>
          <span className="text-[11px] text-slate-500 truncate max-w-xs block">
            {v.location || 'Depot Yard'}
          </span>
        </div>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (v) => (
        <div className="flex items-center justify-end space-x-1">
          {onView && (
            <button
              onClick={() => onView(v)}
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100"
              title="View Vehicle Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(v)}
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100"
              title="Edit Vehicle"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(v.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
              title="Delete Vehicle"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={vehicles}
      keyExtractor={(v) => v.id}
      isLoading={isLoading}
      emptyMessage="No vehicles match your search filters."
    />
  );
};
