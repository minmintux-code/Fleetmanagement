import React from 'react';
import { Trip } from '../../types';
import { DataTable, Column } from './DataTable';
import { Badge } from '../common/Badge';
import { TRIP_STATUS_LABELS } from '../../utils/constants';
import { formatDateTime, formatDistance } from '../../utils/formatters';
import { MapPin, Navigation } from 'lucide-react';

export interface TripTableProps {
  trips: Trip[];
  isLoading?: boolean;
  onStatusChange?: (id: string, status: Trip['status']) => void;
}

export const TripTable: React.FC<TripTableProps> = ({ trips, isLoading }) => {
  const columns: Column<Trip>[] = [
    {
      header: 'Trip Code',
      cell: (t) => (
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-bold text-slate-900 font-mono text-xs">{t.tripCode}</span>
        </div>
      ),
    },
    {
      header: 'Route (Origin -> Dest)',
      cell: (t) => (
        <div className="text-xs">
          <div className="flex items-center text-slate-900 font-medium">
            <MapPin className="w-3 h-3 text-emerald-600 mr-1 shrink-0" /> {t.origin}
          </div>
          <div className="flex items-center text-slate-600 mt-0.5">
            <MapPin className="w-3 h-3 text-red-500 mr-1 shrink-0" /> {t.destination}
          </div>
        </div>
      ),
    },
    {
      header: 'Driver & Vehicle',
      cell: (t) => (
        <div className="text-xs">
          <span className="font-semibold text-slate-800 block">{t.driverName}</span>
          <span className="text-blue-600 font-mono font-medium">{t.vehiclePlate}</span>
        </div>
      ),
    },
    {
      header: 'Distance & Time',
      cell: (t) => (
        <div className="text-xs">
          <span className="font-bold text-slate-800 block">{formatDistance(t.distanceKm)}</span>
          <span className="text-[11px] text-slate-500">{formatDateTime(t.scheduledDeparture)}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (t) => {
        const meta = TRIP_STATUS_LABELS[t.status] || { label: t.status, variant: 'secondary' };
        return <Badge variant={meta.variant as any}>{meta.label}</Badge>;
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={trips}
      keyExtractor={(t) => t.id}
      isLoading={isLoading}
      emptyMessage="No active or scheduled trips found."
    />
  );
};
