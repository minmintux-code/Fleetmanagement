import { ReactNode } from 'react';
import { EmptyState } from '../common/EmptyState';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available',
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-[#1E293B] rounded-[10px] border border-[#334155] p-6 text-center text-[#94A3B8] text-xs">
        <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-[#2563EB] border-t-transparent mb-2" />
        <p>Loading table records...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title={emptyMessage} />;
  }

  return (
    <div className="overflow-x-auto bg-[#1E293B] rounded-[10px] border border-[#334155]">
      <table className="w-full text-left text-xs text-[#F8FAFC] border-collapse">
        <thead className="bg-[#0F172A] text-[#94A3B8] font-semibold border-b border-[#334155]">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className={`px-3.5 py-2.5 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#334155]/60">
          {data.map((item, idx) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick && onRowClick(item)}
              className={`${
                idx % 2 === 0 ? 'bg-[#1E293B]' : 'bg-[#152032]'
              } hover:bg-[#334155]/50 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((col, index) => (
                <td key={index} className={`px-3.5 py-2.5 ${col.className || ''}`}>
                  {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey] ?? '') : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
