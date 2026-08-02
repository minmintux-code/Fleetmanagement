import React from 'react';
import { Rental } from '../../types';
import { DataTable, Column } from './DataTable';
import { Badge } from '../common/Badge';
import { RENTAL_STATUS_LABELS } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const RentalTable: React.FC<{ rentals: Rental[]; isLoading?: boolean }> = ({
  rentals,
  isLoading,
}) => {
  const columns: Column<Rental>[] = [
    {
      header: 'Rental Code',
      cell: (r) => <span className="font-mono font-bold text-xs text-slate-900">{r.rentalCode}</span>,
    },
    {
      header: 'Customer',
      cell: (r) => <span className="font-semibold text-slate-800 text-xs">{r.customerName}</span>,
    },
    {
      header: 'Vehicle Plate',
      cell: (r) => <span className="font-bold text-blue-600 text-xs">{r.vehiclePlate}</span>,
    },
    {
      header: 'Duration',
      cell: (r) => (
        <span className="text-xs text-slate-600">
          {formatDate(r.startDate)} &rarr; {formatDate(r.endDate)}
        </span>
      ),
    },
    {
      header: 'Daily Rate & Total',
      cell: (r) => (
        <div className="text-xs">
          <span className="font-bold text-slate-900 block">{formatCurrency(r.totalCost)}</span>
          <span className="text-slate-500">₹{r.dailyRate}/day</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (r) => {
        const meta = RENTAL_STATUS_LABELS[r.status] || { label: r.status, variant: 'secondary' };
        return <Badge variant={meta.variant as any}>{meta.label}</Badge>;
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={rentals}
      keyExtractor={(r) => r.id}
      isLoading={isLoading}
      emptyMessage="No rental or lease records found."
    />
  );
};
