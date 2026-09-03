import api from './api';
import { InspectionReport } from '../types/inspection';

export const inspectionService = {
  async getInspections(): Promise<InspectionReport[]> {
    try {
      const res = await api.get<InspectionReport[]>('/inspections');
      return res.data || [];
    } catch {
      return [];
    }
  },

  async getInspectionsByVehicle(vehicleId: string): Promise<InspectionReport[]> {
    try {
      const res = await api.get<InspectionReport[]>(`/inspections/vehicle/${vehicleId}`);
      return res.data || [];
    } catch {
      return [];
    }
  },

  async createInspection(data: Partial<InspectionReport>): Promise<InspectionReport> {
    const res = await api.post<InspectionReport>('/inspections', data);
    return res.data;
  },

  async deleteInspection(id: string): Promise<void> {
    await api.delete(`/inspections/${id}`);
  },
};
