import api from './api';
import { Trip, TripFilterParams } from '../types';

export const tripService = {
  async getTrips(params?: TripFilterParams): Promise<Trip[]> {
    try {
      const res = await api.get<Trip[]>('/trips', { params });
      return res.data || [];
    } catch {
      return [];
    }
  },

  async createTrip(data: Partial<Trip>): Promise<Trip> {
    const res = await api.post<Trip>('/trips', data);
    return res.data;
  },

  async updateTripStatus(id: string, status: Trip['status']): Promise<Trip> {
    const res = await api.patch<Trip>(`/trips/${id}/status`, { status });
    return res.data;
  },
};
