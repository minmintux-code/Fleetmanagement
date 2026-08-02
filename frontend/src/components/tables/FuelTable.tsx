import React from 'react';
import { FuelLog } from '../../types';
import { DataTable, Column } from './DataTable';
import { formatCurrency, formatDateTime, formatNumber } from '../../utils/formatters';
import { Fuel } from 'lucide-react';

export interface FuelTableProps {
  fuelLogs: FuelLog[];
  isLoading?: boolean;
}

export const FuelTable: React.FC<FuelTableProps> = ({ fuelLogs, isLoading }) => {
  const columns: Column<FuelLog>[] = [
    {
      header: 'Vehicle & Driver',
      cell: (f) => (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-md shrink-0">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-xs block">{f.vehiclePlate}</span>
            <span className="text-xs text-slate-500">{f.driverName}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Liters Refilled',
      cell: (f) => <span className="font-bold text-slate-800 text-xs">{f.liters} L</span>,
    },
    {
      header: 'Cost per Liter',
      cell: (f) => <span className="text-xs text-slate-600">₹{f.costPerLiter.toFixed(2)}/L</span>,
    },
    {
      header: 'Total Cost',
      cell: (f) => <span className="font-bold text-emerald-600 text-xs">{formatCurrency(f.totalCost)}</span>,
    },
    {
      header: 'Odometer',
      cell: (f) => <span className="text-xs text-slate-600">{formatNumber(f.odometerReading)} km</span>,
    },
    {
      header: 'Station & Date',
      cell: (f) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800 block">{f.stationName}</span>
          <span className="text-[11px] text-slate-500">{formatDateTime(f.filledAt)}</span>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={fuelLogs}
      keyExtractor={(f) => f.id}
      isLoading={isLoading}
      emptyMessage="No fuel logs found."
    />
  );
};
