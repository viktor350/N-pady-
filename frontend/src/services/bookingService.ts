import api from './api';
import { Booking, BookingStatus, TimeSlot } from '../types';

interface BookingsResponse {
  bookings: Booking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface CreateBookingData {
  businessId: string;
  serviceId: string;
  staffId?: string;
  startTime: string;
  notes?: string;
}

export const bookingService = {
  async getBookings(params?: {
    businessId?: string;
    status?: BookingStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<BookingsResponse> {
    const response = await api.get<BookingsResponse>('/bookings', { params });
    return response.data;
  },

  async getBooking(id: string): Promise<Booking> {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  async createBooking(data: CreateBookingData): Promise<Booking> {
    const response = await api.post<Booking>('/bookings', data);
    return response.data;
  },

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
    cancelReason?: string
  ): Promise<Booking> {
    const response = await api.patch<Booking>(`/bookings/${id}/status`, {
      status,
      cancelReason,
    });
    return response.data;
  },

  async getAvailableSlots(params: {
    businessId: string;
    serviceId: string;
    staffId?: string;
    date: string;
  }): Promise<{ slots: TimeSlot[] }> {
    const response = await api.get<{ slots: TimeSlot[] }>('/bookings/available-slots', {
      params,
    });
    return response.data;
  },
};
