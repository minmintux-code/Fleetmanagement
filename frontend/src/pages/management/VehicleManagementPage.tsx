import React, { useState, useEffect } from 'react';
import { vehicleService } from '../../services/vehicleService';
import { Vehicle, VehicleStatus, VehicleType } from '../../types';
import { VehicleTable } from '../../components/tables/VehicleTable';
import { SearchInput } from '../../components/common/SearchInput';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { VehicleForm } from '../../components/forms/VehicleForm';
import { useNotification } from '../../hooks/useNotification';
import { useDebounce } from '../../hooks/useDebounce';
import { Plus } from 'lucide-react';

export const VehicleManagementPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { showToast } = useNotification();

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await vehicleService.getVehicles({
        search: debouncedSearch,
        status: statusFilter as VehicleStatus || undefined,
        type: typeFilter as VehicleType || undefined,
      });
      setVehicles(data);
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
    try {
      if (editingVehicle) {
        await vehicleService.updateVehicle(editingVehicle.id, formData);
        showToast('Vehicle record updated successfully', 'success');
      } else {
        await vehicleService.createVehicle(formData);
        showToast('Vehicle registered successfully', 'success');
      }
      setIsModalOpen(false);
      setEditingVehicle(null);
      fetchVehicles();
    } catch {
      showToast('Failed to save vehicle record', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this vehicle from the fleet?')) {
      await vehicleService.deleteVehicle(id);
      showToast('Vehicle removed from fleet database', 'info');
      fetchVehicles();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vehicle Fleet Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage corporate vehicles, track statuses, mileage, and service schedules.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button
            variant="primary"
            onClick={() => {
              setEditingVehicle(null);
              setIsModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add New Vehicle
          </Button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by license plate, VIN, make or model..."
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Fleet Statuses"
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
          placeholder="All Vehicle Classifications"
          options={[
            { value: 'TRUCK', label: 'Heavy Duty Trucks' },
            { value: 'VAN', label: 'Cargo Vans' },
            { value: 'SEDAN', label: 'Executive Sedans' },
            { value: 'SUV', label: 'Utility SUVs' },
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
        title={editingVehicle ? `Edit Vehicle (${editingVehicle.plateNumber})` : 'Register New Fleet Vehicle'}
        maxWidth="xl"
      >
        <VehicleForm
          initialValues={editingVehicle || undefined}
          onSubmit={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingVehicle(null);
          }}
        />
      </Modal>
    </div>
  );
};
