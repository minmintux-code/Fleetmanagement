import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DoughnutChartProps {
  labels: string[];
  dataValues: number[];
  colors?: string[];
  height?: number;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  labels,
  dataValues,
  colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
  height = 260,
}) => {
  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { font: { family: 'Inter', size: 12 }, usePointStyle: true },
      },
    },
    cutout: '70%',
  };

  return (
    <div style={{ height }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};
