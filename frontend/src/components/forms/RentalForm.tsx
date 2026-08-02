import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { rentalSchema } from '../../utils/validators';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export interface RentalFormProps {
  customers: { id: string; companyName: string }[];
  vehicles: { id: string; plateNumber: string }[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const RentalForm: React.FC<RentalFormProps> = ({
  customers,
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
    resolver: zodResolver(rentalSchema),
    defaultValues: {
      rentalCode: `RNT-2026-${Math.floor(100 + Math.random() * 900)}`,
      customerId: customers[0]?.id || '',
      vehicleId: vehicles[0]?.id || '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      dailyRate: 150,
      depositAmount: 500,
      status: 'RESERVED',
      notes: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Rental Agreement Code"
        error={errors.rentalCode?.message as string}
        {...register('rentalCode')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Corporate Client / Customer"
          options={customers.map((c) => ({ value: c.id, label: c.companyName }))}
          error={errors.customerId?.message as string}
          {...register('customerId')}
        />
        <Select
          label="Leased Vehicle"
          options={vehicles.map((v) => ({ value: v.id, label: v.plateNumber }))}
          error={errors.vehicleId?.message as string}
          {...register('vehicleId')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Lease Start Date"
          type="date"
          error={errors.startDate?.message as string}
          {...register('startDate')}
        />
        <Input
          label="Lease End Date"
          type="date"
          error={errors.endDate?.message as string}
          {...register('endDate')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Daily Rental Rate (₹)"
          type="number"
          error={errors.dailyRate?.message as string}
          {...register('dailyRate')}
        />
        <Input
          label="Security Deposit (₹)"
          type="number"
          error={errors.depositAmount?.message as string}
          {...register('depositAmount')}
        />
        <Select
          label="Booking Status"
          options={[
            { value: 'RESERVED', label: 'Reserved' },
            { value: 'ACTIVE', label: 'Active Contract' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
          error={errors.status?.message as string}
          {...register('status')}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create Lease Contract
        </Button>
      </div>
    </form>
  );
};
