export type RentalStatus = 'RESERVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';

export interface Rental {
  id: string;
  rentalCode: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  vehiclePlate: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  totalCost: number;
  depositAmount: number;
  status: RentalStatus;
  notes?: string;
  createdAt: string;
}

export interface RentalFilterParams {
  search?: string;
  status?: RentalStatus;
  customerId?: string;
  vehicleId?: string;
}
