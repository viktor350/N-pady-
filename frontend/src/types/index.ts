export enum UserRole {
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  name: string;
  description?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  logo?: string;
  coverImage?: string;
  website?: string;
  timezone: string;
  currency: string;
  averageRating: number;
  totalReviews: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: User;
  services?: Service[];
  staff?: Staff[];
  workingHours?: WorkingHours[];
  reviews?: Review[];
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
  currency: string;
  isActive: boolean;
  color?: string;
  createdAt: string;
  updatedAt: string;
  businessId: string;
  business?: Business;
}

export interface Staff {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  title?: string;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  businessId: string;
  business?: Business;
}

export interface WorkingHours {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
  businessId?: string;
  staffId?: string;
}

export interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  currency: string;
  notes?: string;
  cancelReason?: string;
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  clientId: string;
  businessId: string;
  serviceId: string;
  staffId?: string;
  client?: User;
  business?: Business;
  service?: Service;
  staff?: Staff;
  review?: Review;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
  bookingId: string;
  clientId: string;
  businessId: string;
  client?: User;
  business?: Business;
  booking?: Booking;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  userId: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: UserRole;
}
