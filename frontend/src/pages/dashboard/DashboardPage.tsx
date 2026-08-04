import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';
import { tripService } from '../../services/tripService';
import { DashboardSummary, Vehicle, Driver, Trip, AnalyticsReportData } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { GlobalError } from '../../components/common/GlobalError';
import { BarChart } from '../../components/charts/BarChart';
import { LineChart } from '../../components/charts/LineChart';
import { Badge } from '../../components/common/Badge';
import { Truck, Users, Building2, Navigation } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsReportData | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumRes, anaRes, vehRes, drvRes, tripRes] = await Promise.all([
        reportService.getDashboardSummary(),
        reportService.getAnalyticsData(),
        vehicleService.getVehicles(),
        driverService.getDrivers(),
        tripService.getTrips(),
      ]);
      setSummary(sumRes);
      setAnalytics(anaRes);
      setVehicles(vehRes);
      setDrivers(drvRes);
      setTrips(tripRes);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (isLoading) return <LoadingSpinner label="Loading dashboard analytics..." />;
  if (error || !summary || !analytics)
    return <GlobalError title="Dashboard Load Failure" message={error || undefined} onRetry={loadDashboardData} />;

  // Checks for real data presence
  const hasOverviewData =
    (summary.totalVehicles || 0) > 0 ||
    (summary.totalDrivers || 0) > 0 ||
    (summary.totalCustomers || 0) > 0 ||
    (summary.ongoingTrips || 0) > 0;

  const hasAnalyticsData =
    analytics.monthlyExpenses &&
    analytics.monthlyExpenses.length > 0 &&
    analytics.monthlyExpenses.some((m) => m.fuel > 0 || m.maintenance > 0 || m.operational > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#334155] pb-3">
        <div>
          <h1 className="text-xl font-bold text-[#F8FAFC]">Fleet Management Dashboard</h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">
            Real-time fleet activity, operations metrics, and inventory summary.
          </p>
        </div>
      </div>

      {/* Top Row: 4 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vehicles"
          value={`${summary.totalVehicles || 0} Vehicles`}
          icon={<Truck className="w-5 h-5 text-[#2563EB]" />}
        />
        <StatCard
          title="Total Drivers"
          value={`${summary.totalDrivers || 0} Drivers`}
          icon={<Users className="w-5 h-5 text-[#22C55E]" />}
        />
        <StatCard
          title="Total Customers"
          value={`${summary.totalCustomers || 0} Customers`}
          icon={<Building2 className="w-5 h-5 text-[#F59E0B]" />}
        />
        <StatCard
          title="Total Trips"
          value={`${summary.ongoingTrips || 0} Trips`}
          icon={<Navigation className="w-5 h-5 text-[#EF4444]" />}
        />
      </div>

      {/* Dashboard Graphs: Fleet Overview & Monthly Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Fleet Overview (Bar Chart) */}
        <Card title="Fleet Overview" subtitle="Activity overview across key categories">
          {hasOverviewData ? (
            <BarChart
              labels={['Vehicles', 'Drivers', 'Customers', 'Trips']}
              datasets={[
                {
                  label: 'Count',
                  data: [
                    summary.totalVehicles || 0,
                    summary.totalDrivers || 0,
                    summary.totalCustomers || 0,
                    summary.ongoingTrips || 0,
                  ],
                  backgroundColor: ['#2563EB', '#22C55E', '#F59E0B', '#EF4444'],
                },
              ]}
              height={260}
            />
          ) : (
            <div className="flex items-center justify-center h-52 text-xs text-[#94A3B8] border border-dashed border-[#334155] rounded-[10px]">
              No data available
            </div>
          )}
        </Card>

        {/* Chart 2: Monthly Fleet Analytics (Line Chart) */}
        <Card title="Monthly Fleet Analytics" subtitle="Trips volume, fuel cost, and maintenance cost trends">
          {hasAnalyticsData ? (
            <LineChart
              labels={analytics.monthlyExpenses.map((m) => m.month)}
              datasets={[
                {
                  label: 'Fuel Cost (₹)',
                  data: analytics.monthlyExpenses.map((m) => m.fuel),
                  borderColor: '#22C55E',
                },
                {
                  label: 'Maintenance Cost (₹)',
                  data: analytics.monthlyExpenses.map((m) => m.maintenance),
                  borderColor: '#F59E0B',
                },
                {
                  label: 'Operational Expense (₹)',
                  data: analytics.monthlyExpenses.map((m) => m.operational),
                  borderColor: '#2563EB',
                },
              ]}
              height={260}
            />
          ) : (
            <div className="flex items-center justify-center h-52 text-xs text-[#94A3B8] border border-dashed border-[#334155] rounded-[10px]">
              No data available
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-5">
        <h2 className="text-base font-semibold text-[#F8FAFC]">Recent Activity</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Vehicles Table */}
          <Card title="Recent Vehicles" subtitle="Latest registered fleet vehicles">
            {vehicles.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#94A3B8]">No records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#F8FAFC]">
                  <thead className="bg-[#0F172A] text-[#94A3B8] font-semibold border-b border-[#334155]">
                    <tr>
                      <th className="px-3 py-2">Plate</th>
                      <th className="px-3 py-2">Make / Model</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/60">
                    {vehicles.slice(0, 5).map((v, idx) => (
                      <tr
                        key={v.id}
                        className={`${
                          idx % 2 === 0 ? 'bg-[#1E293B]' : 'bg-[#152032]'
                        } hover:bg-[#334155]/50 transition-colors`}
                      >
                        <td className="px-3 py-2.5 font-medium">{v.plateNumber}</td>
                        <td className="px-3 py-2.5 text-[#94A3B8]">
                          {v.make} {v.model}
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge
                            variant={
                              v.status === 'AVAILABLE'
                                ? 'success'
                                : v.status === 'IN_TRANSIT'
                                ? 'info'
                                : v.status === 'IN_MAINTENANCE'
                                ? 'warning'
                                : 'secondary'
                            }
                          >
                            {v.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Recent Drivers Table */}
          <Card title="Recent Drivers" subtitle="Latest active fleet operators">
            {drivers.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#94A3B8]">No records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#F8FAFC]">
                  <thead className="bg-[#0F172A] text-[#94A3B8] font-semibold border-b border-[#334155]">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">License</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/60">
                    {drivers.slice(0, 5).map((d, idx) => (
                      <tr
                        key={d.id}
                        className={`${
                          idx % 2 === 0 ? 'bg-[#1E293B]' : 'bg-[#152032]'
                        } hover:bg-[#334155]/50 transition-colors`}
                      >
                        <td className="px-3 py-2.5 font-medium">{d.fullName}</td>
                        <td className="px-3 py-2.5 text-[#94A3B8]">{d.licenseNumber}</td>
                        <td className="px-3 py-2.5">
                          <Badge
                            variant={
                              d.status === 'AVAILABLE'
                                ? 'success'
                                : d.status === 'ON_TRIP'
                                ? 'info'
                                : 'secondary'
                            }
                          >
                            {d.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Recent Trips Table */}
          <Card title="Recent Trips" subtitle="Latest dispatches and trips">
            {trips.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#94A3B8]">No records found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#F8FAFC]">
                  <thead className="bg-[#0F172A] text-[#94A3B8] font-semibold border-b border-[#334155]">
                    <tr>
                      <th className="px-3 py-2">Trip Code</th>
                      <th className="px-3 py-2">Route</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155]/60">
                    {trips.slice(0, 5).map((t, idx) => (
                      <tr
                        key={t.id}
                        className={`${
                          idx % 2 === 0 ? 'bg-[#1E293B]' : 'bg-[#152032]'
                        } hover:bg-[#334155]/50 transition-colors`}
                      >
                        <td className="px-3 py-2.5 font-medium">{t.tripCode || t.id.slice(0, 8)}</td>
                        <td className="px-3 py-2.5 text-[#94A3B8]">
                          {t.origin} &rarr; {t.destination}
                        </td>
                        <td className="px-3 py-2.5">
                          <Badge
                            variant={
                              t.status === 'COMPLETED'
                                ? 'success'
                                : t.status === 'IN_PROGRESS'
                                ? 'info'
                                : t.status === 'SCHEDULED'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {t.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
