import api from './api';
import { FuelLog, FuelFilterParams } from '../types';

export const fuelService = {
  async getFuelLogs(params?: FuelFilterParams): Promise<FuelLog[]> {
    try {
      const res = await api.get<FuelLog[]>('/fuel', { params });
      return res.data || [];
    } catch {
      return [];
    }
  },

  async createFuelLog(data: Partial<FuelLog>): Promise<FuelLog> {
    const res = await api.post<FuelLog>('/fuel', data);
    return res.data;
  },
};
