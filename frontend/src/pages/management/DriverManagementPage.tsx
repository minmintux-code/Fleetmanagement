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
import { exportToCsv } from '../../utils/csvExporter';
import { Plus, Download } from 'lucide-react';

export const DriverManagementPage: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearch = useDebounce(search, 300);
  const { showToast } = useNotification();

  const handleExportCsv = () => {
    exportToCsv('fleet_drivers', drivers, [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'licenseNumber', label: 'License Number' },
      { key: 'licenseCategory', label: 'Category' },
      { key: 'licenseExpiryDate', label: 'Expiry Date' },
      { key: 'status', label: 'Status' },
      { key: 'safetyScore', label: 'Safety Index' },
    ]);
  };

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const data = await driverService.getDrivers({
        search: debouncedSearch,
        status: statusFilter as DriverStatus || undefined,
      });
      setDrivers(data);
    } catch {
      showToast('Failed to fetch drivers list', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [debouncedSearch, statusFilter]);

  const handleSave = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingDriver) {
        await driverService.updateDriver(editingDriver.id, formData);
        showToast('Driver updated successfully', 'success');
      } else {
        await driverService.createDriver(formData);
        showToast('Driver registered successfully', 'success');
      }
      setIsModalOpen(false);
      setEditingDriver(null);
      fetchDrivers();
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to save driver profile. Please check your input and try again.';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this driver?')) {
      await driverService.deleteDriver(id);
      showToast('Driver removed successfully', 'info');
      fetchDrivers();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E7EB] dark:border-slate-700 pb-3">
        <div>
          <h1 className="text-lg font-semibold text-[#111827] dark:text-slate-100">Drivers</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage commercial drivers, license details, and status.
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
            variant="primary"
            onClick={() => {
              setEditingDriver(null);
              setIsModalOpen(true);
            }}
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Driver
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-3 rounded border border-[#E5E7EB] dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search name, email, license..."
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Driver Statuses"
          options={[
            { value: 'AVAILABLE', label: 'Available' },
            { value: 'ON_TRIP', label: 'On Trip' },
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
        title={editingDriver ? `Edit Driver (${editingDriver.fullName})` : 'Add Driver'}
        maxWidth="lg"
      >
        <DriverForm
          initialValues={editingDriver || undefined}
          onSubmit={handleSave}
          isSubmitting={isSubmitting}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingDriver(null);
          }}
        />
      </Modal>
    </div>
  );
};
