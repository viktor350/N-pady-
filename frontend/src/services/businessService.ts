import api from './api';
import { Business } from '../types';

interface BusinessesResponse {
  businesses: Business[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const businessService = {
  async getBusinesses(params?: {
    page?: number;
    limit?: number;
    search?: string;
    city?: string;
  }): Promise<BusinessesResponse> {
    const response = await api.get<BusinessesResponse>('/businesses', { params });
    return response.data;
  },

  async getBusiness(id: string): Promise<Business> {
    const response = await api.get<Business>(`/businesses/${id}`);
    return response.data;
  },

  async getMyBusinesses(): Promise<Business[]> {
    const response = await api.get<Business[]>('/businesses/my');
    return response.data;
  },

  async createBusiness(data: Partial<Business>): Promise<Business> {
    const response = await api.post<Business>('/businesses', data);
    return response.data;
  },

  async updateBusiness(id: string, data: Partial<Business>): Promise<Business> {
    const response = await api.put<Business>(`/businesses/${id}`, data);
    return response.data;
  },

  async deleteBusiness(id: string): Promise<void> {
    await api.delete(`/businesses/${id}`);
  },
};
