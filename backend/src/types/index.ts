import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface TokenPayload {
  id: string;
  email: string;
  role: UserRole;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface BookingFilter {
  businessId?: string;
  clientId?: string;
  staffId?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface BusinessStats {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
}
