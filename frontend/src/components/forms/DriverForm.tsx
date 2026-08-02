import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { driverSchema } from '../../utils/validators';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Driver } from '../../types';

export interface DriverFormProps {
  initialValues?: Partial<Driver>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const DriverForm: React.FC<DriverFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      firstName: initialValues?.firstName || '',
      lastName: initialValues?.lastName || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      licenseNumber: initialValues?.licenseNumber || '',
      licenseCategory: initialValues?.licenseCategory || 'COMMERCIAL_CDL',
      licenseExpiryDate: initialValues?.licenseExpiryDate || '',
      status: initialValues?.status || 'AVAILABLE',
      safetyScore: initialValues?.safetyScore || 95,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          placeholder="Alexander"
          error={errors.firstName?.message as string}
          {...register('firstName')}
        />
        <Input
          label="Last Name"
          placeholder="Hayes"
          error={errors.lastName?.message as string}
          {...register('lastName')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="driver@fleetmaster.com"
          error={errors.email?.message as string}
          {...register('email')}
        />
        <Input
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          error={errors.phone?.message as string}
          {...register('phone')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="License Number"
          placeholder="CDL-99201"
          error={errors.licenseNumber?.message as string}
          {...register('licenseNumber')}
        />
        <Select
          label="License Class"
          options={[
            { value: 'COMMERCIAL_CDL', label: 'Commercial CDL Class A' },
            { value: 'CLASS_A', label: 'Class A License' },
            { value: 'CLASS_B', label: 'Class B License' },
            { value: 'CLASS_C', label: 'Class C License' },
          ]}
          error={errors.licenseCategory?.message as string}
          {...register('licenseCategory')}
        />
        <Input
          label="License Expiry Date"
          type="date"
          error={errors.licenseExpiryDate?.message as string}
          {...register('licenseExpiryDate')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Operational Status"
          options={[
            { value: 'AVAILABLE', label: 'Available' },
            { value: 'ON_TRIP', label: 'On Active Trip' },
            { value: 'OFF_DUTY', label: 'Off Duty / On Leave' },
            { value: 'SUSPENDED', label: 'Suspended' },
          ]}
          error={errors.status?.message as string}
          {...register('status')}
        />
        <Input
          label="Safety Rating Score (0-100)"
          type="number"
          error={errors.safetyScore?.message as string}
          {...register('safetyScore')}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save Driver Record
        </Button>
      </div>
    </form>
  );
};
