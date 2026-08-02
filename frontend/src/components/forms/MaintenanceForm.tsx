import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { maintenanceSchema } from '../../utils/validators';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';

export interface MaintenanceFormProps {
  vehicles: { id: string; plateNumber: string }[];
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
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
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      vehicleId: vehicles[0]?.id || '',
      type: 'PREVENTIVE',
      priority: 'MEDIUM',
      status: 'SCHEDULED',
      description: 'Scheduled engine oil and brake line inspection',
      serviceCenter: 'FleetMaster Internal Workshop',
      technicianName: 'Dave Kowalski',
      estimatedCost: 350,
      scheduledDate: new Date().toISOString().split('T')[0],
      odometerReading: 120000,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select
        label="Select Vehicle"
        options={vehicles.map((v) => ({ value: v.id, label: v.plateNumber }))}
        error={errors.vehicleId?.message as string}
        {...register('vehicleId')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Maintenance Type"
          options={[
            { value: 'PREVENTIVE', label: 'Preventive Service' },
            { value: 'CORRECTIVE', label: 'Corrective Repair' },
            { value: 'INSPECTION', label: 'Safety Inspection' },
            { value: 'REPAIR', label: 'Major Overhaul' },
            { value: 'TIRE_SERVICE', label: 'Tire & Alignment' },
          ]}
          error={errors.type?.message as string}
          {...register('type')}
        />
        <Select
          label="Urgency Priority"
          options={[
            { value: 'LOW', label: 'Low Priority' },
            { value: 'MEDIUM', label: 'Medium Priority' },
            { value: 'HIGH', label: 'High Priority' },
            { value: 'CRITICAL', label: 'Critical Alert' },
          ]}
          error={errors.priority?.message as string}
          {...register('priority')}
        />
        <Select
          label="Status"
          options={[
            { value: 'SCHEDULED', label: 'Scheduled' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
          error={errors.status?.message as string}
          {...register('status')}
        />
      </div>

      <Input
        label="Detailed Work Description"
        placeholder="Replaced transmission synchro and hydraulic fluid..."
        error={errors.description?.message as string}
        {...register('description')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Service Center / Repair Shop"
          placeholder="Apex Heavy Repairs"
          error={errors.serviceCenter?.message as string}
          {...register('serviceCenter')}
        />
        <Input
          label="Technician Name"
          placeholder="Dave Kowalski"
          error={errors.technicianName?.message as string}
          {...register('technicianName')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Estimated Cost (₹)"
          type="number"
          error={errors.estimatedCost?.message as string}
          {...register('estimatedCost')}
        />
        <Input
          label="Scheduled Date"
          type="date"
          error={errors.scheduledDate?.message as string}
          {...register('scheduledDate')}
        />
        <Input
          label="Odometer (KM)"
          type="number"
          error={errors.odometerReading?.message as string}
          {...register('odometerReading')}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save Maintenance Record
        </Button>
      </div>
    </form>
  );
};
