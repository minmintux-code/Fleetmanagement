import React from 'react';
import { Expense } from '../../types';
import { DataTable, Column } from './DataTable';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const ExpenseTable: React.FC<{ expenses: Expense[]; isLoading?: boolean }> = ({
  expenses,
  isLoading,
}) => {
  const columns: Column<Expense>[] = [
    {
      header: 'Expense No.',
      cell: (e) => <span className="font-mono font-bold text-xs text-slate-900">{e.expenseNumber}</span>,
    },
    {
      header: 'Category',
      cell: (e) => (
        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
          {e.category}
        </span>
      ),
    },
    {
      header: 'Vehicle / Vendor',
      cell: (e) => (
        <div className="text-xs">
          <span className="font-bold text-blue-600 block">{e.vehiclePlate || 'Fleet General'}</span>
          <span className="text-slate-500">{e.vendorName || 'N/A'}</span>
        </div>
      ),
    },
    {
      header: 'Amount',
      cell: (e) => <span className="font-bold text-slate-900 text-xs">{formatCurrency(e.amount)}</span>,
    },
    {
      header: 'Status',
      cell: (e) => {
        const variant = e.status === 'APPROVED' ? 'success' : e.status === 'REJECTED' ? 'danger' : 'warning';
        return <Badge variant={variant}>{e.status}</Badge>;
      },
    },
    {
      header: 'Date Incurred',
      cell: (e) => <span className="text-xs text-slate-500">{formatDate(e.incurredDate)}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={expenses}
      keyExtractor={(e) => e.id}
      isLoading={isLoading}
      emptyMessage="No expenses recorded."
    />
  );
};
