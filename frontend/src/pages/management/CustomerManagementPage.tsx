import React, { useState, useEffect } from 'react';
import { customerService } from '../../services/customerService';
import { Customer } from '../../types';
import { CustomerTable } from '../../components/tables/CustomerTable';
import { SearchInput } from '../../components/common/SearchInput';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { CustomerForm } from '../../components/forms/CustomerForm';
import { useNotification } from '../../hooks/useNotification';
import { useDebounce } from '../../hooks/useDebounce';
import { UserCheck } from 'lucide-react';

export const CustomerManagementPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const { showToast } = useNotification();

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getCustomers({ search: debouncedSearch });
      setCustomers(data);
    } catch {
      showToast('Failed to load customer list', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearch]);

  const handleCreateCustomer = async (formData: any) => {
    try {
      await customerService.createCustomer(formData);
      showToast('New customer profile created', 'success');
      setIsModalOpen(false);
      fetchCustomers();
    } catch {
      showToast('Failed to create customer profile', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customer Accounts & Clients</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage corporate client relationships, contact info, contracts, and revenue totals.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<UserCheck className="w-4 h-4" />}
          >
            Add Customer Profile
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search customer by name, company, email..."
        />
      </div>

      <CustomerTable customers={customers} isLoading={isLoading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Corporate Customer Account"
        maxWidth="lg"
      >
        <CustomerForm
          onSubmit={handleCreateCustomer}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
