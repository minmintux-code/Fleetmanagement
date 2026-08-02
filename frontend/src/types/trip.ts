export type TripStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DELAYED';

export interface Trip {
  id: string;
  tripCode: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  origin: string;
  destination: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture?: string;
  actualArrival?: string;
  distanceKm: number;
  status: TripStatus;
  cargoDescription?: string;
  notes?: string;
  createdAt: string;
}

export interface TripFilterParams {
  search?: string;
  status?: TripStatus;
  vehicleId?: string;
  driverId?: string;
}
