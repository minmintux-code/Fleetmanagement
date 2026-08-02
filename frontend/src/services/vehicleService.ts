import api from './api';
import { Vehicle, VehicleFilterParams } from '../types';

export const vehicleService = {
  async getVehicles(params?: VehicleFilterParams): Promise<Vehicle[]> {
    try {
      const res = await api.get<Vehicle[]>('/vehicles', { params });
      return res.data || [];
    } catch {
      return [];
    }
  },

  async getVehicleById(id: string): Promise<Vehicle> {
    const res = await api.get<Vehicle>(`/vehicles/${id}`);
    return res.data;
  },

  async createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    const res = await api.post<Vehicle>('/vehicles', data);
    return res.data;
  },

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    const res = await api.put<Vehicle>(`/vehicles/${id}`, data);
    return res.data;
  },

  async deleteVehicle(id: string): Promise<void> {
    await api.delete(`/vehicles/${id}`);
  },
};
