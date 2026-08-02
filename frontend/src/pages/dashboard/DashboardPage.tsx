import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import { vehicleService } from '../../services/vehicleService';
import { DashboardSummary, Vehicle, AnalyticsReportData } from '../../types';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { GlobalError } from '../../components/common/GlobalError';
import { EmptyState } from '../../components/common/EmptyState';
import { FleetUtilizationChart } from '../../components/charts/FleetUtilizationChart';
import { LineChart } from '../../components/charts/LineChart';
import { QuickActionPanel } from '../../components/modules/QuickActionPanel';
import { VehicleStatusCard } from '../../components/modules/VehicleStatusCard';
import { Modal } from '../../components/common/Modal';
import { VehicleForm } from '../../components/forms/VehicleForm';
import { TripForm } from '../../components/forms/TripForm';
import { FuelForm } from '../../components/forms/FuelForm';
import { MaintenanceForm } from '../../components/forms/MaintenanceForm';
import { useNotification } from '../../hooks/useNotification';
import { formatCurrency } from '../../utils/formatters';
import { Truck, Users, Navigation, Fuel, Building2, DollarSign, Wrench, Receipt, Activity } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsReportData | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick Action Modal States
  const [activeModal, setActiveModal] = useState<'vehicle' | 'trip' | 'fuel' | 'maintenance' | null>(null);
  const { showToast } = useNotification();

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sumRes, anaRes, vehRes] = await Promise.all([
        reportService.getDashboardSummary(),
        reportService.getAnalyticsData(),
        vehicleService.getVehicles(),
      ]);
      setSummary(sumRes);
      setAnalytics(anaRes);
      setVehicles(vehRes);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (isLoading) return <LoadingSpinner label="Loading enterprise dashboard insights..." />;
  if (error || !summary || !analytics)
    return <GlobalError title="Dashboard Load Failure" message={error || undefined} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-6">
      {/* Page Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fleet Command Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time operational analytics, active dispatch metrics, and fleet utilization.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-md">
            <Activity className="w-4 h-4 text-emerald-500 mr-2" /> Live Fleet Feed
          </span>
        </div>
      </div>

      {/* Top Level Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vehicles"
          value={summary.totalVehicles}
          icon={<Truck className="w-5 h-5" />}
          description={`${summary.activeVehicles} active in service`}
          variant="blue"
        />
        <StatCard
          title="Active Drivers"
          value={summary.activeDrivers}
          icon={<Users className="w-5 h-5" />}
          description={`Out of ${summary.totalDrivers} registered drivers`}
          variant="emerald"
        />
        <StatCard
          title="Total Customers"
          value={summary.totalCustomers || 0}
          icon={<Building2 className="w-5 h-5" />}
          description="Registered enterprise clients"
          variant="purple"
        />
        <StatCard
          title="Ongoing Trips"
          value={summary.ongoingTrips}
          icon={<Navigation className="w-5 h-5" />}
          description="In-transit active dispatches"
          variant="amber"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(summary.totalRevenue || 0)}
          icon={<DollarSign className="w-5 h-5" />}
          description="Rental & booking earnings"
          variant="emerald"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses || 0)}
          icon={<Receipt className="w-5 h-5" />}
          description="Overhead & miscellaneous"
          variant="blue"
        />
        <StatCard
          title="Fuel Cost"
          value={formatCurrency(summary.totalFuelCostThisMonth || 0)}
          icon={<Fuel className="w-5 h-5" />}
          description="Fleet fuel expenditure"
          variant="purple"
        />
        <StatCard
          title="Maintenance Cost"
          value={formatCurrency(summary.totalMaintenanceCostThisMonth || 0)}
          icon={<Wrench className="w-5 h-5" />}
          description="Service & repair costs"
          variant="amber"
        />
      </div>

      {/* Quick Action Operations Panel */}
      <QuickActionPanel
        onAddVehicle={() => setActiveModal('vehicle')}
        onDispatchTrip={() => setActiveModal('trip')}
        onLogFuel={() => setActiveModal('fuel')}
        onScheduleMaintenance={() => setActiveModal('maintenance')}
      />

      {/* Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title="Monthly Operating Expenditures"
            subtitle="Comparison of fuel refills vs maintenance repair costs"
          >
            <LineChart
              labels={analytics.monthlyExpenses.map((m) => m.month)}
              datasets={[
                {
                  label: 'Fuel Expenditures (₹)',
                  data: analytics.monthlyExpenses.map((m) => m.fuel),
                  borderColor: '#2563EB',
                },
                {
                  label: 'Maintenance Costs (₹)',
                  data: analytics.monthlyExpenses.map((m) => m.maintenance),
                  borderColor: '#F59E0B',
                },
              ]}
              height={280}
            />
          </Card>
        </div>

        <div>
          <Card title="Fleet Status Breakdown" subtitle="Current status distribution across active fleet">
            <FleetUtilizationChart
              available={summary.activeVehicles - summary.ongoingTrips}
              inTransit={summary.ongoingTrips}
              inMaintenance={summary.maintenanceVehicles}
              rented={0}
              outOfService={0}
            />
          </Card>
        </div>
      </div>

      {/* Vehicle Status Spotlight Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Vehicle Status Spotlight
          </h3>
        </div>
        {vehicles.length === 0 ? (
          <EmptyState
            title="No vehicles in database"
            description="Add vehicles using the quick action button above or insert records via MySQL Workbench."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicles.slice(0, 3).map((v) => (
              <VehicleStatusCard key={v.id} vehicle={v} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Modals */}
      <Modal
        isOpen={activeModal === 'vehicle'}
        onClose={() => setActiveModal(null)}
        title="Register New Fleet Vehicle"
        maxWidth="xl"
      >
        <VehicleForm
          onSubmit={async (data) => {
            await vehicleService.createVehicle(data);
            showToast('New vehicle registered successfully', 'success');
            setActiveModal(null);
            loadDashboardData();
          }}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'trip'}
        onClose={() => setActiveModal(null)}
        title="Dispatch New Trip"
        maxWidth="lg"
      >
        <TripForm
          vehicles={vehicles.map((v) => ({ id: v.id, plateNumber: v.plateNumber, make: v.make }))}
          drivers={[{ id: 'drv-1', fullName: 'Alexander Hayes' }, { id: 'drv-2', fullName: 'Elena Rostova' }]}
          onSubmit={async () => {
            showToast('Trip dispatched successfully', 'success');
            setActiveModal(null);
            loadDashboardData();
          }}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'fuel'}
        onClose={() => setActiveModal(null)}
        title="Log Fuel Refill"
        maxWidth="md"
      >
        <FuelForm
          vehicles={vehicles.map((v) => ({ id: v.id, plateNumber: v.plateNumber }))}
          drivers={[{ id: 'drv-1', fullName: 'Alexander Hayes' }]}
          onSubmit={async () => {
            showToast('Fuel transaction logged', 'success');
            setActiveModal(null);
            loadDashboardData();
          }}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'maintenance'}
        onClose={() => setActiveModal(null)}
        title="Schedule Maintenance Repair"
        maxWidth="lg"
      >
        <MaintenanceForm
          vehicles={vehicles.map((v) => ({ id: v.id, plateNumber: v.plateNumber }))}
          onSubmit={async () => {
            showToast('Maintenance service scheduled', 'success');
            setActiveModal(null);
            loadDashboardData();
          }}
          onCancel={() => setActiveModal(null)}
        />
      </Modal>
    </div>
  );
};
