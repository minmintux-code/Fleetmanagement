export type ScheduleStatus = 'PENDING' | 'OVERDUE' | 'COMPLETED';

export interface ServiceSchedule {
  id: string;
  vehicleId: string;
  vehiclePlateNumber?: string;
  vehicleMakeModel?: string;
  serviceName: string;
  intervalKm: number;
  intervalMonths: number;
  lastServiceDate?: string;
  lastServiceKm?: number;
  nextDueDate?: string;
  nextDueKm?: number;
  status: ScheduleStatus;
  createdAt: string;
}
