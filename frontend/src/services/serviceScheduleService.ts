import api from './api';
import { ServiceSchedule } from '../types/serviceSchedule';

export const serviceScheduleService = {
  async getSchedules(): Promise<ServiceSchedule[]> {
    try {
      const res = await api.get<ServiceSchedule[]>('/service-schedules');
      return res.data || [];
    } catch {
      return [];
    }
  },

  async getSchedulesByVehicle(vehicleId: string): Promise<ServiceSchedule[]> {
    try {
      const res = await api.get<ServiceSchedule[]>(`/service-schedules/vehicle/${vehicleId}`);
      return res.data || [];
    } catch {
      return [];
    }
  },

  async createSchedule(data: Partial<ServiceSchedule>): Promise<ServiceSchedule> {
    const res = await api.post<ServiceSchedule>('/service-schedules', data);
    return res.data;
  },

  async updateSchedule(id: string, data: Partial<ServiceSchedule>): Promise<ServiceSchedule> {
    const res = await api.put<ServiceSchedule>(`/service-schedules/${id}`, data);
    return res.data;
  },

  async convertToMaintenance(id: string): Promise<any> {
    const res = await api.post(`/service-schedules/${id}/convert-to-maintenance`);
    return res.data;
  },

  async deleteSchedule(id: string): Promise<void> {
    await api.delete(`/service-schedules/${id}`);
  },
};
