import React, { useState, useEffect } from 'react';
import { rentalService } from '../../services/rentalService';
import { customerService } from '../../services/customerService';
import { vehicleService } from '../../services/vehicleService';
import { Rental, Customer, Vehicle } from '../../types';
import { RentalTable } from '../../components/tables/RentalTable';
import { SearchInput } from '../../components/common/SearchInput';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { RentalForm } from '../../components/forms/RentalForm';
import { useNotification } from '../../hooks/useNotification';
import { useDebounce } from '../../hooks/useDebounce';
import { KeyRound } from 'lucide-react';

export const RentalManagementPage: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const { showToast } = useNotification();

  const fetchRentals = async () => {
    setIsLoading(true);
    try {
      const [rRes, cRes, vRes] = await Promise.all([
        rentalService.getRentals({ search: debouncedSearch }),
        customerService.getCustomers(),
        vehicleService.getVehicles(),
      ]);
      setRentals(rRes);
      setCustomers(cRes);
      setVehicles(vRes);
    } catch {
      showToast('Failed to load rental contracts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [debouncedSearch]);

  const handleCreateRental = async (formData: any) => {
    try {
      await rentalService.createRental(formData);
      showToast('Rental contract generated', 'success');
      setIsModalOpen(false);
      fetchRentals();
    } catch {
      showToast('Failed to generate rental agreement', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vehicle Rental & Commercial Leases</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage long-term corporate leases, daily rates, deposits, and vehicle rental bookings.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<KeyRound className="w-4 h-4" />}
          >
            Create Lease Contract
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search rental code, customer company, vehicle plate..."
        />
      </div>

      <RentalTable rentals={rentals} isLoading={isLoading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Lease Agreement"
        maxWidth="lg"
      >
        <RentalForm
          customers={customers.map((c) => ({ id: c.id, companyName: c.companyName }))}
          vehicles={vehicles.map((v) => ({ id: v.id, plateNumber: v.plateNumber }))}
          onSubmit={handleCreateRental}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
