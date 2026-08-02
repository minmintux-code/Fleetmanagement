import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { AnalyticsReportData } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { BarChart } from '../../components/charts/BarChart';
import { DoughnutChart } from '../../components/charts/DoughnutChart';
import { useNotification } from '../../hooks/useNotification';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { Download, Calendar } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useNotification();

  useEffect(() => {
    reportService.getAnalyticsData().then((res) => {
      setData(res);
      setIsLoading(false);
    });
  }, []);

  const handleExportCSV = () => {
    showToast('Analytics report exported as CSV document', 'info');
  };

  if (isLoading || !data) return <LoadingSpinner label="Generating executive analytics..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Executive Analytics & Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep dive into fleet financial expenditures, fuel efficiency, and driver safety performance metrics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button variant="outline" size="sm" icon={<Calendar className="w-3.5 h-3.5" />}>
            Year to Date (2026)
          </Button>
          <Button variant="primary" size="sm" onClick={handleExportCSV} icon={<Download className="w-3.5 h-3.5" />}>
            Export CSV Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Cost Distribution" subtitle="Fuel vs Maintenance vs Operational Expenses">
          <BarChart
            labels={data.monthlyExpenses.map((m) => m.month)}
            datasets={[
              {
                label: 'Fuel (₹)',
                data: data.monthlyExpenses.map((m) => m.fuel),
                backgroundColor: '#2563EB',
              },
              {
                label: 'Maintenance (₹)',
                data: data.monthlyExpenses.map((m) => m.maintenance),
                backgroundColor: '#F59E0B',
              },
              {
                label: 'Operational Overhead (₹)',
                data: data.monthlyExpenses.map((m) => m.operational),
                backgroundColor: '#64748B',
              },
            ]}
            height={280}
          />
        </Card>

        <Card title="Fleet Vehicle Type Composition" subtitle="Share of heavy trucks vs vans vs electric semis">
          <DoughnutChart
            labels={data.utilizationByVehicleType.map((u) => u.type)}
            dataValues={data.utilizationByVehicleType.map((u) => u.count)}
            colors={['#2563EB', '#10B981', '#F59E0B', '#8B5CF6']}
            height={280}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Fuel Consuming Vehicles Table */}
        <Card title="Highest Fuel Consuming Vehicles" subtitle="Monthly fuel volume and cost tracking">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Vehicle Plate & Model</th>
                  <th className="py-2.5 px-3">Monthly Liters</th>
                  <th className="py-2.5 px-3">Total Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.topFuelConsumingVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-500">No fuel records found in database.</td>
                  </tr>
                ) : (
                  data.topFuelConsumingVehicles.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{item.vehiclePlate}</td>
                      <td className="py-2.5 px-3 text-slate-600">{formatNumber(item.liters)} L</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-600">{formatCurrency(item.cost)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Driver Performance Metrics */}
        <Card title="Driver Safety & Trip Performance" subtitle="Rankings based on completed trips and safety index">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Driver Name</th>
                  <th className="py-2.5 px-3">Completed Trips</th>
                  <th className="py-2.5 px-3">Safety Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.driverPerformanceMetrics.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-500">No driver performance records found in database.</td>
                  </tr>
                ) : (
                  data.driverPerformanceMetrics.map((driver, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{driver.driverName}</td>
                      <td className="py-2.5 px-3 text-slate-600">{driver.trips} trips</td>
                      <td className="py-2.5 px-3 font-bold text-blue-600">{driver.safetyScore} / 100</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
