import api from './api';
import { DashboardSummary, AnalyticsReportData } from '../types';

const EMPTY_SUMMARY: DashboardSummary = {
  totalVehicles: 0,
  activeVehicles: 0,
  maintenanceVehicles: 0,
  totalDrivers: 0,
  activeDrivers: 0,
  totalCustomers: 0,
  ongoingTrips: 0,
  completedTripsThisMonth: 0,
  totalRevenue: 0.0,
  totalExpenses: 0.0,
  totalFuelCostThisMonth: 0.0,
  totalMaintenanceCostThisMonth: 0.0,
  fleetUtilizationRate: 0.0,
};

const EMPTY_ANALYTICS: AnalyticsReportData = {
  monthlyExpenses: [],
  utilizationByVehicleType: [],
  topFuelConsumingVehicles: [],
  driverPerformanceMetrics: [],
};

export const reportService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    try {
      const res = await api.get<DashboardSummary>('/analytics/dashboard-summary');
      return res.data || EMPTY_SUMMARY;
    } catch {
      return EMPTY_SUMMARY;
    }
  },

  async getAnalyticsData(): Promise<AnalyticsReportData> {
    try {
      const res = await api.get<AnalyticsReportData>('/analytics/reports');
      return res.data || EMPTY_ANALYTICS;
    } catch {
      return EMPTY_ANALYTICS;
    }
  },
};
