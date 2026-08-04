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
        showToast('Vehicle updated successfully', 'success');
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
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      await vehicleService.deleteVehicle(id);
      showToast('Vehicle removed successfully', 'info');
      fetchVehicles();
    }
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E7EB] pb-3">
        <div>
          <h1 className="text-lg font-semibold text-[#111827]">Vehicles</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage corporate vehicle inventory and track statuses.
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex space-x-2">
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
      <div className="bg-white p-3 rounded border border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-3 gap-3">
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
          onCancel={() => {
            setIsModalOpen(false);
            setEditingVehicle(null);
          }}
        />
      </Modal>
    </div>
  );
};
