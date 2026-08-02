import React from 'react';
import { DoughnutChart } from './DoughnutChart';

export interface FleetUtilizationChartProps {
  available: number;
  inTransit: number;
  inMaintenance: number;
  rented: number;
  outOfService: number;
}

export const FleetUtilizationChart: React.FC<FleetUtilizationChartProps> = ({
  available,
  inTransit,
  inMaintenance,
  rented,
  outOfService,
}) => {
  return (
    <DoughnutChart
      labels={['Available', 'In Transit', 'Maintenance', 'Rented', 'Out of Service']}
      dataValues={[available, inTransit, inMaintenance, rented, outOfService]}
      colors={['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444']}
      height={260}
    />
  );
};
