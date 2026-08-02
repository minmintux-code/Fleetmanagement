import React from 'react';
import { MaintenanceRecord } from '../../types';
import { DataTable, Column } from './DataTable';
import { Badge } from '../common/Badge';
import { MAINTENANCE_PRIORITY_LABELS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Wrench } from 'lucide-react';

export interface MaintenanceTableProps {
  records: MaintenanceRecord[];
  isLoading?: boolean;
}

export const MaintenanceTable: React.FC<MaintenanceTableProps> = ({ records, isLoading }) => {
  const columns: Column<MaintenanceRecord>[] = [
    {
      header: 'Vehicle & Service',
      cell: (m) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-md shrink-0">
            <Wrench className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-xs block">{m.vehiclePlate}</span>
            <span className="text-xs font-semibold text-slate-600 uppercase">{m.type}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      cell: (m) => (
        <p className="text-xs text-slate-700 max-w-xs truncate font-medium">{m.description}</p>
      ),
    },
    {
      header: 'Priority',
      cell: (m) => {
        const meta = MAINTENANCE_PRIORITY_LABELS[m.priority] || { label: m.priority, variant: 'secondary' };
        return <Badge variant={meta.variant as any}>{meta.label}</Badge>;
      },
    },
    {
      header: 'Service Center',
      cell: (m) => <span className="text-xs text-slate-700 font-medium">{m.serviceCenter}</span>,
    },
    {
      header: 'Estimated Cost',
      cell: (m) => <span className="font-bold text-slate-900 text-xs">{formatCurrency(m.estimatedCost)}</span>,
    },
    {
      header: 'Scheduled Date',
      cell: (m) => <span className="text-xs text-slate-500">{formatDate(m.scheduledDate)}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={records}
      keyExtractor={(m) => m.id}
      isLoading={isLoading}
      emptyMessage="No maintenance work orders found."
    />
  );
};
