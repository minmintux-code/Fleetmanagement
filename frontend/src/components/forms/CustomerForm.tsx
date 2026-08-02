import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { customerSchema } from '../../utils/validators';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export interface CustomerFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      companyName: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      status: 'ACTIVE',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company Name"
          placeholder="Apex Logistics Inc."
          error={errors.companyName?.message as string}
          {...register('companyName')}
        />
        <Input
          label="Primary Contact Person"
          placeholder="Robert Sterling"
          error={errors.name?.message as string}
          {...register('name')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Business Email"
          type="email"
          placeholder="r.sterling@apex.com"
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

      <Input
        label="Corporate Office Address"
        placeholder="100 Enterprise Way, Suite 400, Chicago, IL"
        error={errors.address?.message as string}
        {...register('address')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Tax ID / FEIN"
          placeholder="US-99182374"
          error={errors.taxId?.message as string}
          {...register('taxId')}
        />
        <Select
          label="Account Status"
          options={[
            { value: 'ACTIVE', label: 'Active Account' },
            { value: 'INACTIVE', label: 'Inactive / Suspended' },
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
          Create Customer Account
        </Button>
      </div>
    </form>
  );
};
