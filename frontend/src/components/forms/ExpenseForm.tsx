import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema } from '../../utils/validators';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export interface ExpenseFormProps {
  vehicles: { id: string; plateNumber: string }[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  vehicles,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseNumber: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      category: 'MISCELLANEOUS',
      amount: 150,
      vehicleId: vehicles[0]?.id || '',
      incurredDate: new Date().toISOString().split('T')[0],
      vendorName: '',
      receiptNumber: '',
      status: 'PENDING',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Expense Reference No."
          error={errors.expenseNumber?.message as string}
          {...register('expenseNumber')}
        />
        <Select
          label="Category"
          options={[
            { value: 'FUEL', label: 'Fuel Fillup' },
            { value: 'MAINTENANCE', label: 'Maintenance & Parts' },
            { value: 'TOLL', label: 'Highway Tolls' },
            { value: 'INSURANCE', label: 'Insurance Policy' },
            { value: 'PERMIT', label: 'Road Permits & Licensing' },
            { value: 'DRIVER_ALLOWANCE', label: 'Driver Per Diem / Allowance' },
            { value: 'MISCELLANEOUS', label: 'Miscellaneous Operational' },
          ]}
          error={errors.category?.message as string}
          {...register('category')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Expense Amount (₹)"
          type="number"
          step="0.01"
          error={errors.amount?.message as string}
          {...register('amount')}
        />
        <Select
          label="Associated Vehicle"
          options={vehicles.map((v) => ({ value: v.id, label: v.plateNumber }))}
          error={errors.vehicleId?.message as string}
          {...register('vehicleId')}
        />
        <Input
          label="Incurred Date"
          type="date"
          error={errors.incurredDate?.message as string}
          {...register('incurredDate')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Vendor / Merchant"
          placeholder="EZPass, Shell, Goodyear, etc."
          error={errors.vendorName?.message as string}
          {...register('vendorName')}
        />
        <Input
          label="Receipt / Voucher No."
          placeholder="RCP-99201"
          error={errors.receiptNumber?.message as string}
          {...register('receiptNumber')}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Submit Expense
        </Button>
      </div>
    </form>
  );
};
