import React, { useState, useEffect } from 'react';
import { maintenanceService } from '../../services/maintenanceService';
import { vehicleService } from '../../services/vehicleService';
import { MaintenanceRecord, MaintenanceStatus, MaintenancePriority, Vehicle } from '../../types';
import { MaintenanceTable } from '../../components/tables/MaintenanceTable';
import { SearchInput } from '../../components/common/SearchInput';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { MaintenanceForm } from '../../components/forms/MaintenanceForm';
import { useNotification } from '../../hooks/useNotification';
import { useDebounce } from '../../hooks/useDebounce';
import { Wrench } from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const { showToast } = useNotification();

  const fetchMaintenance = async () => {
    setIsLoading(true);
    try {
      const [mRes, vRes] = await Promise.all([
        maintenanceService.getRecords({
          search: debouncedSearch,
          status: statusFilter as MaintenanceStatus || undefined,
          priority: priorityFilter as MaintenancePriority || undefined,
        }),
        vehicleService.getVehicles(),
      ]);
      setRecords(mRes);
      setVehicles(vRes);
    } catch {
      showToast('Failed to load maintenance records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenance();
  }, [debouncedSearch, statusFilter, priorityFilter]);

  const handleCreateRecord = async (formData: any) => {
    try {
      await maintenanceService.createRecord(formData);
      showToast('Maintenance work order scheduled', 'success');
      setIsModalOpen(false);
      fetchMaintenance();
    } catch {
      showToast('Failed to schedule maintenance', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Maintenance & Service Repairs</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage work orders, scheduled preventive servicing, repairs, and vendor shop logs.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Wrench className="w-4 h-4" />}
          >
            Schedule Repair / Service
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search work order, plate number, service center..."
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Maintenance Statuses"
          options={[
            { value: 'SCHEDULED', label: 'Scheduled' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
        />
        <Select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          placeholder="All Priorities"
          options={[
            { value: 'LOW', label: 'Low Priority' },
            { value: 'MEDIUM', label: 'Medium Priority' },
            { value: 'HIGH', label: 'High Priority' },
            { value: 'CRITICAL', label: 'Critical Emergency' },
          ]}
        />
      </div>

      <MaintenanceTable records={records} isLoading={isLoading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Maintenance Service"
        maxWidth="lg"
      >
        <MaintenanceForm
          vehicles={vehicles.map((v) => ({ id: v.id, plateNumber: v.plateNumber }))}
          onSubmit={handleCreateRecord}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
