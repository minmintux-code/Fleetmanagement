import api from './api';
import { Driver, DriverFilterParams } from '../types';

export const driverService = {
  async getDrivers(params?: DriverFilterParams): Promise<Driver[]> {
    try {
      const res = await api.get<Driver[]>('/drivers', { params });
      return res.data || [];
    } catch {
      return [];
    }
  },

  async getDriverById(id: string): Promise<Driver> {
    const res = await api.get<Driver>(`/drivers/${id}`);
    return res.data;
  },

  async createDriver(data: Partial<Driver>): Promise<Driver> {
    const res = await api.post<Driver>('/drivers', data);
    return res.data;
  },

  async updateDriver(id: string, data: Partial<Driver>): Promise<Driver> {
    const res = await api.put<Driver>(`/drivers/${id}`, data);
    return res.data;
  },

  async deleteDriver(id: string): Promise<void> {
    await api.delete(`/drivers/${id}`);
  },
};
