export type DriverStatus = 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';
export type LicenseCategory = 'CLASS_A' | 'CLASS_B' | 'CLASS_C' | 'COMMERCIAL_CDL';

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseCategory: LicenseCategory;
  licenseExpiryDate: string;
  status: DriverStatus;
  safetyScore: number; // 0 to 100
  totalTripsCompleted: number;
  assignedVehicleId?: string;
  assignedVehiclePlate?: string;
  joinedDate: string;
  avatarUrl?: string;
}

export interface DriverFilterParams {
  search?: string;
  status?: DriverStatus;
  licenseCategory?: LicenseCategory;
}
