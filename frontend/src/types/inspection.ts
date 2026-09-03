export type InspectionType = 'PRE_TRIP' | 'POST_TRIP';
export type InspectionItemStatus = 'PASS' | 'FAIL' | 'N_A';
export type OverallInspectionStatus = 'PASS' | 'FAIL';

export interface InspectionReport {
  id: string;
  vehicleId: string;
  vehiclePlateNumber?: string;
  vehicleMakeModel?: string;
  driverId?: string;
  driverName?: string;
  inspectionType: InspectionType;
  inspectionDate: string;
  overallStatus: OverallInspectionStatus;
  brakesStatus: InspectionItemStatus;
  tiresStatus: InspectionItemStatus;
  lightsStatus: InspectionItemStatus;
  steeringStatus: InspectionItemStatus;
  fluidsStatus: InspectionItemStatus;
  defectsDescription?: string;
  repaired?: boolean;
  createdAt: string;
}
