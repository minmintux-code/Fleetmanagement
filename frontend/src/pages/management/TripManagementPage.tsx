import React, { useState, useEffect } from 'react';
import { tripService } from '../../services/tripService';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';
import { Trip, TripStatus, Vehicle, Driver } from '../../types';
import { TripTable } from '../../components/tables/TripTable';
import { SearchInput } from '../../components/common/SearchInput';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { TripForm } from '../../components/forms/TripForm';
import { useNotification } from '../../hooks/useNotification';
import { useDebounce } from '../../hooks/useDebounce';
import { Navigation } from 'lucide-react';

export const TripManagementPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const { showToast } = useNotification();

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const [tData, vData, dData] = await Promise.all([
        tripService.getTrips({
          search: debouncedSearch,
          status: statusFilter as TripStatus || undefined,
        }),
        vehicleService.getVehicles(),
        driverService.getDrivers(),
      ]);
      setTrips(tData);
      setVehicles(vData);
      setDrivers(dData);
    } catch {
      showToast('Failed to load trips schedule', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [debouncedSearch, statusFilter]);

  const handleCreateTrip = async (formData: any) => {
    try {
      await tripService.createTrip(formData);
      showToast('Trip successfully dispatched', 'success');
      setIsModalOpen(false);
      fetchTrips();
    } catch {
      showToast('Failed to dispatch trip', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Trip Dispatch & Cargo Tracking</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Schedule route dispatches, assign available drivers & vehicles, track progress.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Navigation className="w-4 h-4" />}
          >
            Dispatch New Trip
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search trip code, origin, destination, driver..."
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Trip Statuses"
          options={[
            { value: 'SCHEDULED', label: 'Scheduled' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' },
            { value: 'DELAYED', label: 'Delayed' },
          ]}
        />
      </div>

      <TripTable trips={trips} isLoading={isLoading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Dispatch New Operational Trip"
        maxWidth="lg"
      >
        <TripForm
          vehicles={vehicles.map((v) => ({ id: v.id, plateNumber: v.plateNumber, make: v.make }))}
          drivers={drivers.map((d) => ({ id: d.id, fullName: d.fullName }))}
          onSubmit={handleCreateTrip}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
