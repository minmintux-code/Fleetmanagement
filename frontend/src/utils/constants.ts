export const APP_NAME = 'Fleet Manager';
export const API_BASE_URL = '/api';

export const VEHICLE_STATUS_LABELS: Record<string, { label: string; variant: string }> = {
  AVAILABLE: { label: 'Available', variant: 'success' },
  IN_TRANSIT: { label: 'In Transit', variant: 'info' },
  IN_MAINTENANCE: { label: 'In Maintenance', variant: 'warning' },
  OUT_OF_SERVICE: { label: 'Out of Service', variant: 'danger' },
  RENTED: { label: 'Rented', variant: 'purple' },
};

export const DRIVER_STATUS_LABELS: Record<string, { label: string; variant: string }> = {
  AVAILABLE: { label: 'Available', variant: 'success' },
  ON_TRIP: { label: 'On Trip', variant: 'info' },
  OFF_DUTY: { label: 'Off Duty', variant: 'secondary' },
  SUSPENDED: { label: 'Suspended', variant: 'danger' },
};

export const TRIP_STATUS_LABELS: Record<string, { label: string; variant: string }> = {
  SCHEDULED: { label: 'Scheduled', variant: 'secondary' },
  IN_PROGRESS: { label: 'In Progress', variant: 'info' },
  COMPLETED: { label: 'Completed', variant: 'success' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
  DELAYED: { label: 'Delayed', variant: 'warning' },
};

export const RENTAL_STATUS_LABELS: Record<string, { label: string; variant: string }> = {
  RESERVED: { label: 'Reserved', variant: 'info' },
  ACTIVE: { label: 'Active', variant: 'success' },
  COMPLETED: { label: 'Completed', variant: 'secondary' },
  CANCELLED: { label: 'Cancelled', variant: 'danger' },
  OVERDUE: { label: 'Overdue', variant: 'warning' },
};

export const MAINTENANCE_PRIORITY_LABELS: Record<string, { label: string; variant: string }> = {
  LOW: { label: 'Low', variant: 'secondary' },
  MEDIUM: { label: 'Medium', variant: 'info' },
  HIGH: { label: 'High', variant: 'warning' },
  CRITICAL: { label: 'Critical', variant: 'danger' },
};
