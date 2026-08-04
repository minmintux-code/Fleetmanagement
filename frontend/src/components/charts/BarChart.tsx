import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface BarChartProps {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
  }[];
  height?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ labels, datasets, height = 300 }) => {
  const data = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      backgroundColor: ds.backgroundColor || '#2563EB',
      borderRadius: 4,
    })),
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: '#F8FAFC', font: { family: 'Inter', size: 12 }, usePointStyle: true },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 11 } },
      },
      y: {
        grid: { color: '#334155' },
        ticks: { color: '#94A3B8', font: { family: 'Inter', size: 11 } },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={data} options={options} />
    </div>
  );
};
