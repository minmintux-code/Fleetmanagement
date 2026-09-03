import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';
import { Vehicle, VehicleStatus, VehicleType, Driver } from '../../types';
import { VehicleTable } from '../../components/tables/VehicleTable';
import { SearchInput } from '../../components/common/SearchInput';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { VehicleForm } from '../../components/forms/VehicleForm';
import { InspectionModal } from '../../components/forms/InspectionModal';
import { useNotification } from '../../hooks/useNotification';
import { useDebounce } from '../../hooks/useDebounce';
import { exportToCsv } from '../../utils/csvExporter';
import { Plus, Download, ShieldCheck } from 'lucide-react';

export const VehicleManagementPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const { showToast } = useNotification();

  const handleExportCsv = () => {
    exportToCsv('fleet_vehicles', vehicles, [
      { key: 'plateNumber', label: 'Plate Number' },
      { key: 'vin', label: 'VIN' },
      { key: 'make', label: 'Make' },
      { key: 'model', label: 'Model' },
      { key: 'year', label: 'Year' },
      { key: 'type', label: 'Type' },
      { key: 'fuelType', label: 'Fuel Type' },
      { key: 'status', label: 'Status' },
      { key: 'mileage', label: 'Odometer (KM)' },
      { key: 'location', label: 'Location' },
    ]);
  };

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const [data, driverList] = await Promise.all([
        vehicleService.getVehicles({
          search: debouncedSearch,
          status: statusFilter as VehicleStatus || undefined,
          type: typeFilter as VehicleType || undefined,
        }),
        driverService.getDrivers(),
      ]);
      setVehicles(data);
      setDrivers(driverList);
    } catch {
      showToast('Failed to fetch vehicles list', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [debouncedSearch, statusFilter, typeFilter]);

  const handleSave = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle.id, formData);
        showToast('Vehicle updated successfully', 'success');
      } else {
        await vehicleService.createVehicle(formData);
        showToast('Vehicle registered successfully', 'success');
      }
      setIsModalOpen(false);
      setEditingVehicle(null);
      fetchVehicles();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to save vehicle record. Please check your input and try again.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      await vehicleService.deleteVehicle(id);
      showToast('Vehicle removed successfully', 'info');
      fetchVehicles();
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E7EB] dark:border-slate-700 pb-3">
        <div>
          <h1 className="text-lg font-semibold text-[#111827] dark:text-slate-100">Vehicles</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage corporate vehicle inventory and track statuses.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleExportCsv}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsInspectionOpen(true)}
            icon={<ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />}
          >
            Run DVIR Check
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditingVehicle(null);
              setIsModalOpen(true);
            }}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-3 rounded border border-[#E5E7EB] dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search plate, VIN, make, model..."
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Statuses"
          options={[
            { value: 'AVAILABLE', label: 'Available' },
            { value: 'IN_TRANSIT', label: 'In Transit' },
            { value: 'IN_MAINTENANCE', label: 'In Maintenance' },
            { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
            { value: 'RENTED', label: 'Rented' },
          ]}
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          placeholder="All Classifications"
          options={[
            { value: 'TRUCK', label: 'Trucks' },
            { value: 'VAN', label: 'Vans' },
            { value: 'SEDAN', label: 'Sedans' },
            { value: 'SUV', label: 'SUVs' },
            { value: 'TRAILER', label: 'Trailers' },
          ]}
        />
      </div>

      {/* Vehicle Data Table */}
      <VehicleTable
        vehicles={vehicles}
        isLoading={isLoading}
        onEdit={(v) => {
          setEditingVehicle(v);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Add / Edit Vehicle Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVehicle(null);
        }}
        title={editingVehicle ? `Edit Vehicle (${editingVehicle.plateNumber})` : 'Add Vehicle'}
        maxWidth="xl"
      >
        <VehicleForm
          initialValues={editingVehicle || undefined}
          onSubmit={handleSave}
          isSubmitting={isSubmitting}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingVehicle(null);
          }}
        />
      </Modal>

      {/* DVIR Safety Inspection Modal */}
      <InspectionModal
        isOpen={isInspectionOpen}
        onClose={() => setIsInspectionOpen(false)}
        vehicles={vehicles}
        drivers={drivers}
        onSuccess={fetchVehicles}
      />
    </div>
  );
};
