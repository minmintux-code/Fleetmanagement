import React, { useState, useEffect } from 'react';
import { expenseService } from '../../services/expenseService';
import { vehicleService } from '../../services/vehicleService';
import { Expense, ExpenseCategory, Vehicle } from '../../types';
import { ExpenseTable } from '../../components/tables/ExpenseTable';
import { SearchInput } from '../../components/common/SearchInput';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ExpenseForm } from '../../components/forms/ExpenseForm';
import { useNotification } from '../../hooks/useNotification';
import { useDebounce } from '../../hooks/useDebounce';
import { DollarSign } from 'lucide-react';

export const ExpenseManagementPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);
  const { showToast } = useNotification();

  const fetchExpenses = async () => {
    setIsLoading(true);
    try {
      const [eRes, vRes] = await Promise.all([
        expenseService.getExpenses({
          search: debouncedSearch,
          category: categoryFilter as ExpenseCategory || undefined,
        }),
        vehicleService.getVehicles(),
      ]);
      setExpenses(eRes);
      setVehicles(vRes);
    } catch {
      showToast('Failed to load expense records', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [debouncedSearch, categoryFilter]);

  const handleCreateExpense = async (formData: any) => {
    try {
      await expenseService.createExpense(formData);
      showToast('Operational expense recorded', 'success');
      setIsModalOpen(false);
      fetchExpenses();
    } catch {
      showToast('Failed to record expense', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Fleet Expense Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Record, audit, and categorize operational costs, fuel receipts, tolls, and maintenance bills.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            icon={<DollarSign className="w-4 h-4" />}
          >
            Submit New Expense
          </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search expense code, vehicle plate, vendor..."
        />
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          placeholder="All Categories"
          options={[
            { value: 'FUEL', label: 'Fuel' },
            { value: 'MAINTENANCE', label: 'Maintenance' },
            { value: 'TOLL', label: 'Tolls' },
            { value: 'INSURANCE', label: 'Insurance' },
            { value: 'PERMIT', label: 'Permits' },
            { value: 'DRIVER_ALLOWANCE', label: 'Driver Allowance' },
            { value: 'MISCELLANEOUS', label: 'Miscellaneous' },
          ]}
        />
      </div>

      <ExpenseTable expenses={expenses} isLoading={isLoading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Operational Expense"
        maxWidth="lg"
      >
        <ExpenseForm
          vehicles={vehicles.map((v) => ({ id: v.id, plateNumber: v.plateNumber }))}
          onSubmit={handleCreateExpense}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
