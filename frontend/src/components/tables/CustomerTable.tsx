import React from 'react';
import { Customer } from '../../types';
import { DataTable, Column } from './DataTable';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const CustomerTable: React.FC<{ customers: Customer[]; isLoading?: boolean }> = ({
  customers,
  isLoading,
}) => {
  const columns: Column<Customer>[] = [
    {
      header: 'Company & Contact',
      cell: (c) => (
        <div>
          <span className="font-bold text-slate-900 text-xs block">{c.companyName}</span>
          <span className="text-xs text-slate-500">{c.name} ({c.email})</span>
        </div>
      ),
    },
    {
      header: 'Phone & Tax ID',
      cell: (c) => (
        <div className="text-xs">
          <span className="text-slate-800 block">{c.phone}</span>
          <span className="text-slate-400 font-mono">{c.taxId || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (c) => (
        <Badge variant={c.status === 'ACTIVE' ? 'success' : 'secondary'}>{c.status}</Badge>
      ),
    },
    {
      header: 'Bookings',
      cell: (c) => <span className="font-bold text-slate-800 text-xs">{c.totalBookings}</span>,
    },
    {
      header: 'Total Revenue',
      cell: (c) => <span className="font-bold text-emerald-600 text-xs">{formatCurrency(c.totalSpent)}</span>,
    },
    {
      header: 'Customer Since',
      cell: (c) => <span className="text-xs text-slate-500">{formatDate(c.createdAt)}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={customers}
      keyExtractor={(c) => c.id}
      isLoading={isLoading}
      emptyMessage="No customer profiles found."
    />
  );
};
