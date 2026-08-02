import React, { useState, useEffect } from 'react';
import { driverService } from '../../services/driverService';
import { Driver, DriverStatus } from '../../types';
import { DriverTable } from '../../components/tables/DriverTable';
import { SearchInput } from '../../components/common/SearchInput';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { DriverForm } from '../../components/forms/DriverForm';
import { useNotification } from '../../hooks/useNotification';
import { useDebounce } from '../../hooks/useDebounce';
import { Plus } from 'lucide-react';

export const DriverManagementPage: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const debouncedSearch = useDebounce(search, 300);
  const { showToast } = useNotification();

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const data = await driverService.getDrivers({
        search: debouncedSearch,
        status: statusFilter as DriverStatus || undefined,
      });
      setDrivers(data);
    } catch {
      showToast('Failed to fetch drivers directory', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [debouncedSearch, statusFilter]);

  const handleSave = async (formData: any) => {
    try {
      if (editingDriver) {
        await driverService.updateDriver(editingDriver.id, formData);
        showToast('Driver profile updated', 'success');
      } else {
        await driverService.createDriver(formData);
        showToast('Driver profile registered', 'success');
      }
      setIsModalOpen(false);
      setEditingDriver(null);
      fetchDrivers();
    } catch {
      showToast('Failed to save driver profile', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this driver profile?')) {
      await driverService.deleteDriver(id);
      showToast('Driver removed from database', 'info');
      fetchDrivers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Driver & Operator Directory</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track commercial licenses, safety ratings, active trip assignments, and statuses.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            onClick={() => {
              setEditingDriver(null);
              setIsModalOpen(true);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Register New Driver
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search driver name, email, license number..."
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Driver Statuses"
          options={[
            { value: 'AVAILABLE', label: 'Available' },
            { value: 'ON_TRIP', label: 'On Active Trip' },
            { value: 'OFF_DUTY', label: 'Off Duty' },
            { value: 'SUSPENDED', label: 'Suspended' },
          ]}
        />
      </div>

      <DriverTable
        drivers={drivers}
        isLoading={isLoading}
        onEdit={(d) => {
          setEditingDriver(d);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDriver(null);
        }}
        title={editingDriver ? `Edit Driver (${editingDriver.fullName})` : 'Register New Driver'}
        maxWidth="lg"
      >
        <DriverForm
          initialValues={editingDriver || undefined}
          onSubmit={handleSave}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingDriver(null);
          }}
        />
      </Modal>
    </div>
  );
};
