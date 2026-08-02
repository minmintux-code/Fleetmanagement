import React, { useState, useEffect } from 'react';
import { fuelService } from '../../services/fuelService';
import { vehicleService } from '../../services/vehicleService';
import { driverService } from '../../services/driverService';
import { FuelLog, Vehicle, Driver } from '../../types';
import { FuelTable } from '../../components/tables/FuelTable';
import { SearchInput } from '../../components/common/SearchInput';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { FuelForm } from '../../components/forms/FuelForm';
import { useNotification } from '../../hooks/useNotification';
import { useDebounce } from '../../hooks/useDebounce';
import { Fuel } from 'lucide-react';

export const FuelManagementPage: React.FC = () => {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const { showToast } = useNotification();

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const [fData, vData, dData] = await Promise.all([
        fuelService.getFuelLogs({ search: debouncedSearch }),
        vehicleService.getVehicles(),
        driverService.getDrivers(),
      ]);
      setFuelLogs(fData);
      setVehicles(vData);
      setDrivers(dData);
    } catch {
      showToast('Failed to load fuel records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [debouncedSearch]);

  const handleCreateFuel = async (formData: any) => {
    try {
      await fuelService.createFuelLog(formData);
      showToast('Fuel refill transaction recorded', 'success');
      setIsModalOpen(false);
      fetchLogs();
    } catch {
      showToast('Failed to log fuel refill', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fuel Log & Consumption Tracking</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor fuel consumption, cost per liter, station logs, and fuel card transactions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<Fuel className="w-4 h-4" />}
          >
            Log Fuel Refill
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search fuel log by plate number, driver, or station..."
        />
      </div>

      <FuelTable fuelLogs={fuelLogs} isLoading={isLoading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Vehicle Fuel Refill"
        maxWidth="md"
      >
        <FuelForm
          vehicles={vehicles.map((v) => ({ id: v.id, plateNumber: v.plateNumber }))}
          drivers={drivers.map((d) => ({ id: d.id, fullName: d.fullName }))}
          onSubmit={handleCreateFuel}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
