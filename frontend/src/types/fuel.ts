export interface FuelLog {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driverId: string;
  driverName: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  odometerReading: number;
  stationName: string;
  fuelCardNumber?: string;
  filledAt: string;
  notes?: string;
}

export interface FuelFilterParams {
  search?: string;
  vehicleId?: string;
  startDate?: string;
  endDate?: string;
}
