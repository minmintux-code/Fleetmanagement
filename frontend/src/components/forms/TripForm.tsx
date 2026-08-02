import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tripSchema } from '../../utils/validators';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export interface TripFormProps {
  vehicles: { id: string; plateNumber: string; make: string }[];
  drivers: { id: string; fullName: string }[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TripForm: React.FC<TripFormProps> = ({
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
    resolver: zodResolver(tripSchema),
    defaultValues: {
      tripCode: `TRIP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleId: vehicles[0]?.id || '',
      driverId: drivers[0]?.id || '',
      origin: '',
      destination: '',
      scheduledDeparture: new Date().toISOString().slice(0, 16),
      scheduledArrival: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      distanceKm: 500,
      status: 'SCHEDULED',
      cargoDescription: '',
      notes: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Trip Reference Code"
        error={errors.tripCode?.message as string}
        {...register('tripCode')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Assigned Vehicle"
          options={vehicles.map((v) => ({
            value: v.id,
            label: `${v.plateNumber} (${v.make})`,
          }))}
          error={errors.vehicleId?.message as string}
          {...register('vehicleId')}
        />
        <Select
          label="Assigned Driver"
          options={drivers.map((d) => ({
            value: d.id,
            label: d.fullName,
          }))}
          error={errors.driverId?.message as string}
          {...register('driverId')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Origin Address / Hub"
          placeholder="Chicago Logistics Hub"
          error={errors.origin?.message as string}
          {...register('origin')}
        />
        <Input
          label="Destination Terminal"
          placeholder="Atlanta Freight Depot"
          error={errors.destination?.message as string}
          {...register('destination')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Scheduled Departure"
          type="datetime-local"
          error={errors.scheduledDeparture?.message as string}
          {...register('scheduledDeparture')}
        />
        <Input
          label="Scheduled Arrival"
          type="datetime-local"
          error={errors.scheduledArrival?.message as string}
          {...register('scheduledArrival')}
        />
        <Input
          label="Estimated Distance (KM)"
          type="number"
          error={errors.distanceKm?.message as string}
          {...register('distanceKm')}
        />
      </div>

      <Input
        label="Cargo / Freight Manifest Summary"
        placeholder="Electronics, Medical Supplies, Temperature Sensitive"
        error={errors.cargoDescription?.message as string}
        {...register('cargoDescription')}
      />

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Dispatch & Create Trip
        </Button>
      </div>
    </form>
  );
};
