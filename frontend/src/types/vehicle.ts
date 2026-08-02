export type VehicleStatus = 'AVAILABLE' | 'IN_TRANSIT' | 'IN_MAINTENANCE' | 'OUT_OF_SERVICE' | 'RENTED';
export type FuelType = 'DIESEL' | 'PETROL' | 'ELECTRIC' | 'HYBRID';
export type VehicleType = 'TRUCK' | 'VAN' | 'SEDAN' | 'SUV' | 'TRAILER' | 'BUS';

export interface Vehicle {
  id: string;
  vin: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  fuelType: FuelType;
  status: VehicleStatus;
  mileage: number; // in km
  fuelCapacity: number; // in liters
  currentFuelLevel: number; // percentage or liters
  assignedDriverId?: string;
  assignedDriverName?: string;
  lastServiceDate?: string;
  nextServiceDueDate?: string;
  insuranceExpiryDate?: string;
  location?: string;
  createdAt: string;
}

export interface VehicleFilterParams {
  search?: string;
  status?: VehicleStatus;
  type?: VehicleType;
  fuelType?: FuelType;
}
