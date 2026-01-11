import { Response } from 'express';
import { PrismaClient, BookingStatus } from '@prisma/client';
import { AuthRequest } from '../types';
import { addMinutes, isAfter, isBefore, parseISO } from 'date-fns';

const prisma = new PrismaClient();

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { businessId, serviceId, staffId, startTime, notes } = req.body;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const startDate = parseISO(startTime);
    const endDate = addMinutes(startDate, service.duration);

    // Check for conflicts
    const conflicts = await prisma.booking.findMany({
      where: {
        businessId,
        ...(staffId && { staffId }),
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
        OR: [
          {
            AND: [
              { startTime: { lte: startDate } },
              { endTime: { gt: startDate } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endDate } },
              { endTime: { gte: endDate } },
            ],
          },
        ],
      },
    });

    if (conflicts.length > 0) {
      return res.status(400).json({ error: 'Time slot not available' });
    }

    const booking = await prisma.booking.create({
      data: {
        businessId,
        serviceId,
        staffId,
        clientId: req.user!.id,
        startTime: startDate,
        endTime: endDate,
        totalPrice: service.price,
        currency: service.currency,
        notes,
        status: 'PENDING',
      },
      include: {
        service: true,
        staff: true,
        business: {
          select: {
            name: true,
            address: true,
            phone: true,
          },
        },
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Create notification for business owner
    await prisma.notification.create({
      data: {
        userId: (await prisma.business.findUnique({ where: { id: businessId } }))!.ownerId,
        title: 'New Booking',
        message: `New booking from ${booking.client.firstName} ${booking.client.lastName}`,
        type: 'booking',
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const getBookings = async (req: AuthRequest, res: Response) => {
  try {
    const { businessId, status, startDate, endDate, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (businessId) {
      where.businessId = businessId as string;
    }

    if (req.user!.role === 'CLIENT') {
      where.clientId = req.user!.id;
    }

    if (status) {
      where.status = status as BookingStatus;
    }

    if (startDate || endDate) {
      where.startTime = {};
      if (startDate) {
        where.startTime.gte = parseISO(startDate as string);
      }
      if (endDate) {
        where.startTime.lte = parseISO(endDate as string);
      }
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          service: true,
          staff: true,
          business: {
            select: {
              name: true,
              address: true,
              phone: true,
            },
          },
          client: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              avatar: true,
            },
          },
        },
        orderBy: { startTime: 'desc' },
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      bookings,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        staff: true,
        business: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
        review: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (
      booking.clientId !== req.user!.id &&
      booking.business.ownerId !== req.user!.id &&
      req.user!.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, cancelReason } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { business: true, client: true },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (
      booking.clientId !== req.user!.id &&
      booking.business.ownerId !== req.user!.id &&
      req.user!.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: status as BookingStatus,
        ...(cancelReason && { cancelReason }),
      },
      include: {
        service: true,
        staff: true,
        business: true,
        client: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create notification
    const notificationUserId =
      req.user!.id === booking.clientId
        ? booking.business.ownerId
        : booking.clientId;

    await prisma.notification.create({
      data: {
        userId: notificationUserId,
        title: 'Booking Updated',
        message: `Booking status changed to ${status}`,
        type: 'booking',
      },
    });

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

export const getAvailableSlots = async (req: AuthRequest, res: Response) => {
  try {
    const { businessId, serviceId, staffId, date } = req.query;

    if (!businessId || !serviceId || !date) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId as string },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const targetDate = parseISO(date as string);
    const dayOfWeek = targetDate.toLocaleDateString('en-US', { weekday: 'LONG' }).toUpperCase();

    // Get working hours
    const workingHours = await prisma.workingHours.findFirst({
      where: {
        businessId: businessId as string,
        dayOfWeek: dayOfWeek as any,
        isActive: true,
        ...(staffId && { staffId: staffId as string }),
      },
    });

    if (!workingHours) {
      return res.json({ slots: [] });
    }

    // Get existing bookings
    const bookings = await prisma.booking.findMany({
      where: {
        businessId: businessId as string,
        ...(staffId && { staffId: staffId as string }),
        status: { notIn: ['CANCELLED'] },
        startTime: {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lt: new Date(targetDate.setHours(23, 59, 59, 999)),
        },
      },
    });

    // Generate time slots (every 30 minutes)
    const slots = [];
    const [startHour, startMinute] = workingHours.startTime.split(':').map(Number);
    const [endHour, endMinute] = workingHours.endTime.split(':').map(Number);

    let currentTime = new Date(targetDate);
    currentTime.setHours(startHour, startMinute, 0, 0);

    const endTime = new Date(targetDate);
    endTime.setHours(endHour, endMinute, 0, 0);

    while (isBefore(currentTime, endTime)) {
      const slotEnd = addMinutes(currentTime, service.duration);

      if (isAfter(slotEnd, endTime)) {
        break;
      }

      const isBooked = bookings.some((booking) => {
        return (
          isBefore(currentTime, booking.endTime) &&
          isAfter(slotEnd, booking.startTime)
        );
      });

      slots.push({
        start: new Date(currentTime),
        end: slotEnd,
        available: !isBooked,
      });

      currentTime = addMinutes(currentTime, 30);
    }

    res.json({ slots });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch available slots' });
  }
};
