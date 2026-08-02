export interface DashboardSummary {
  totalVehicles: number;
  activeVehicles: number;
  maintenanceVehicles: number;
  totalDrivers: number;
  activeDrivers: number;
  totalCustomers: number;
  ongoingTrips: number;
  completedTripsThisMonth: number;
  totalRevenue: number;
  totalExpenses: number;
  totalFuelCostThisMonth: number;
  totalMaintenanceCostThisMonth: number;
  fleetUtilizationRate: number; // percentage
}

export interface AnalyticsReportData {
  monthlyExpenses: { month: string; fuel: number; maintenance: number; operational: number }[];
  utilizationByVehicleType: { type: string; count: number; percentage: number }[];
  topFuelConsumingVehicles: { vehiclePlate: string; liters: number; cost: number }[];
  driverPerformanceMetrics: { driverName: string; trips: number; safetyScore: number }[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  timestamp: string;
  isRead: boolean;
  category: 'VEHICLE' | 'DRIVER' | 'TRIP' | 'MAINTENANCE' | 'SYSTEM';
  linkUrl?: string;
}
