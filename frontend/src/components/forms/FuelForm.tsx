import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fuelSchema } from '../../utils/validators';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export interface FuelFormProps {
  vehicles: { id: string; plateNumber: string }[];
  drivers: { id: string; fullName: string }[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const FuelForm: React.FC<FuelFormProps> = ({
  vehicles,
  drivers,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(fuelSchema),
    defaultValues: {
      vehicleId: vehicles[0]?.id || '',
      driverId: drivers[0]?.id || '',
      liters: 150,
      costPerLiter: 1.45,
      odometerReading: 120000,
      stationName: 'Pilot Travel Center #402',
      fuelCardNumber: 'FC-9912',
      filledAt: new Date().toISOString().slice(0, 16),
      notes: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Vehicle"
          options={vehicles.map((v) => ({ value: v.id, label: v.plateNumber }))}
          error={errors.vehicleId?.message as string}
          {...register('vehicleId')}
        />
        <Select
          label="Driver"
          options={drivers.map((d) => ({ value: d.id, label: d.fullName }))}
          error={errors.driverId?.message as string}
          {...register('driverId')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Liters Refilled"
          type="number"
          step="0.1"
          error={errors.liters?.message as string}
          {...register('liters')}
        />
        <Input
          label="Cost Per Liter (₹)"
          type="number"
          step="0.01"
          error={errors.costPerLiter?.message as string}
          {...register('costPerLiter')}
        />
        <Input
          label="Current Odometer (KM)"
          type="number"
          error={errors.odometerReading?.message as string}
          {...register('odometerReading')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Station / Supplier Name"
          placeholder="Speedway Station #109"
          error={errors.stationName?.message as string}
          {...register('stationName')}
        />
        <Input
          label="Fuel Card No."
          placeholder="FC-9912-8812"
          error={errors.fuelCardNumber?.message as string}
          {...register('fuelCardNumber')}
        />
      </div>

      <Input
        label="Refill Date & Time"
        type="datetime-local"
        error={errors.filledAt?.message as string}
        {...register('filledAt')}
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Log Fuel Transaction
        </Button>
      </div>
    </form>
  );
};
