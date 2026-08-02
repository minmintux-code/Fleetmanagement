import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vehicleSchema } from '../../utils/validators';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Vehicle } from '../../types';

export interface VehicleFormProps {
  initialValues?: Partial<Vehicle>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({
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
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      vin: initialValues?.vin || '',
      plateNumber: initialValues?.plateNumber || '',
      make: initialValues?.make || '',
      model: initialValues?.model || '',
      year: initialValues?.year || new Date().getFullYear(),
      type: initialValues?.type || 'TRUCK',
      fuelType: initialValues?.fuelType || 'DIESEL',
      status: initialValues?.status || 'AVAILABLE',
      mileage: initialValues?.mileage || 0,
      fuelCapacity: initialValues?.fuelCapacity || 200,
      currentFuelLevel: initialValues?.currentFuelLevel || 100,
      location: initialValues?.location || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="License Plate Number"
          placeholder="e.g. FLT-9082"
          error={errors.plateNumber?.message as string}
          {...register('plateNumber')}
        />
        <Input
          label="VIN (17 Characters)"
          placeholder="e.g. 1HGCR2F83HA000101"
          error={errors.vin?.message as string}
          {...register('vin')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Make / Manufacturer"
          placeholder="Freightliner, Ford, etc."
          error={errors.make?.message as string}
          {...register('make')}
        />
        <Input
          label="Model"
          placeholder="Cascadia, Transit, etc."
          error={errors.model?.message as string}
          {...register('model')}
        />
        <Input
          label="Manufacturing Year"
          type="number"
          error={errors.year?.message as string}
          {...register('year')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Vehicle Classification"
          options={[
            { value: 'TRUCK', label: 'Heavy Duty Truck' },
            { value: 'VAN', label: 'Cargo Van' },
            { value: 'SEDAN', label: 'Executive Sedan' },
            { value: 'SUV', label: 'Utility SUV' },
            { value: 'TRAILER', label: 'Flatbed Trailer' },
            { value: 'BUS', label: 'Passenger Bus' },
          ]}
          error={errors.type?.message as string}
          {...register('type')}
        />
        <Select
          label="Fuel Mechanism"
          options={[
            { value: 'DIESEL', label: 'Diesel Fuel' },
            { value: 'PETROL', label: 'Unleaded Petrol' },
            { value: 'ELECTRIC', label: 'Full Electric (EV)' },
            { value: 'HYBRID', label: 'Plug-in Hybrid' },
          ]}
          error={errors.fuelType?.message as string}
          {...register('fuelType')}
        />
        <Select
          label="Initial Status"
          options={[
            { value: 'AVAILABLE', label: 'Available for Dispatch' },
            { value: 'IN_TRANSIT', label: 'Currently In Transit' },
            { value: 'IN_MAINTENANCE', label: 'Under Maintenance' },
            { value: 'OUT_OF_SERVICE', label: 'Out of Service' },
            { value: 'RENTED', label: 'Leased / Rented' },
          ]}
          error={errors.status?.message as string}
          {...register('status')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Current Mileage (KM)"
          type="number"
          error={errors.mileage?.message as string}
          {...register('mileage')}
        />
        <Input
          label="Fuel Capacity (Liters)"
          type="number"
          error={errors.fuelCapacity?.message as string}
          {...register('fuelCapacity')}
        />
        <Input
          label="Fuel Level (%)"
          type="number"
          error={errors.currentFuelLevel?.message as string}
          {...register('currentFuelLevel')}
        />
      </div>

      <Input
        label="Depot / Current Location"
        placeholder="e.g. Chicago Logistics Hub Yard A"
        error={errors.location?.message as string}
        {...register('location')}
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save Vehicle Record
        </Button>
      </div>
    </form>
  );
};
