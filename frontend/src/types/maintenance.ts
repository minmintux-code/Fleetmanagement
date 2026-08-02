export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type MaintenanceType = 'PREVENTIVE' | 'CORRECTIVE' | 'INSPECTION' | 'REPAIR' | 'TIRE_SERVICE';

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  type: MaintenanceType;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  description: string;
  serviceCenter: string;
  technicianName?: string;
  estimatedCost: number;
  actualCost?: number;
  scheduledDate: string;
  completionDate?: string;
  odometerReading: number;
  notes?: string;
}

export interface MaintenanceFilterParams {
  search?: string;
  status?: MaintenanceStatus;
  priority?: MaintenancePriority;
  vehicleId?: string;
}
