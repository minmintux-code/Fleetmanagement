import React from 'react';
import { Driver } from '../../types';
import { DataTable, Column } from './DataTable';
import { Badge } from '../common/Badge';
import { DRIVER_STATUS_LABELS } from '../../utils/constants';
import { Shield, Edit, Trash2 } from 'lucide-react';

export interface DriverTableProps {
  drivers: Driver[];
  isLoading?: boolean;
  onEdit?: (driver: Driver) => void;
  onDelete?: (id: string) => void;
}

export const DriverTable: React.FC<DriverTableProps> = ({
  drivers,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const columns: Column<Driver>[] = [
    {
      header: 'Driver Name & Contact',
      cell: (d) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
            {d.firstName.charAt(0)}
          </div>
          <div>
            <span className="font-semibold text-slate-900 block">{d.fullName}</span>
            <span className="text-xs text-slate-500">{d.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'License No.',
      cell: (d) => (
        <div>
          <span className="font-mono text-xs text-slate-800 font-medium block">{d.licenseNumber}</span>
          <span className="text-[10px] text-slate-500">{d.licenseCategory}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (d) => {
        const meta = DRIVER_STATUS_LABELS[d.status] || { label: d.status, variant: 'secondary' };
        return <Badge variant={meta.variant as any}>{meta.label}</Badge>;
      },
    },
    {
      header: 'Safety Score',
      cell: (d) => (
        <div className="flex items-center space-x-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-bold text-slate-900 text-xs">{d.safetyScore} / 100</span>
        </div>
      ),
    },
    {
      header: 'Assigned Vehicle',
      cell: (d) => (
        <span className="text-xs font-semibold text-blue-600">
          {d.assignedVehiclePlate || 'Unassigned'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (d) => (
        <div className="flex items-center justify-end space-x-1">
          {onEdit && (
            <button
              onClick={() => onEdit(d)}
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100"
              title="Edit Driver"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(d.id)}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
              title="Delete Driver"
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
      data={drivers}
      keyExtractor={(d) => d.id}
      isLoading={isLoading}
      emptyMessage="No drivers found."
    />
  );
};
