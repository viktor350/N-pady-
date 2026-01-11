import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const createStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { businessId, name, email, phone, avatar, title, bio } = req.body;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    if (business.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const staff = await prisma.staff.create({
      data: {
        businessId,
        name,
        email,
        phone,
        avatar,
        title,
        bio,
      },
    });

    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create staff' });
  }
};

export const getStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { businessId } = req.query;

    const where: any = { isActive: true };
    if (businessId) {
      where.businessId = businessId as string;
    }

    const staff = await prisma.staff.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            name: true,
          },
        },
        staffServices: {
          include: {
            service: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
    });

    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
};

export const updateStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const staff = await prisma.staff.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    if (staff.business.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedStaff = await prisma.staff.update({
      where: { id },
      data: req.body,
    });

    res.json(updatedStaff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update staff' });
  }
};

export const assignServiceToStaff = async (req: AuthRequest, res: Response) => {
  try {
    const { staffId, serviceId } = req.body;

    const staff = await prisma.staff.findUnique({
      where: { id: staffId },
      include: { business: true },
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff not found' });
    }

    if (staff.business.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const assignment = await prisma.staffService.create({
      data: {
        staffId,
        serviceId,
      },
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign service to staff' });
  }
};

export const setWorkingHours = async (req: AuthRequest, res: Response) => {
  try {
    const { businessId, staffId, dayOfWeek, startTime, endTime } = req.body;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    if (business.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const workingHours = await prisma.workingHours.create({
      data: {
        businessId,
        staffId,
        dayOfWeek,
        startTime,
        endTime,
      },
    });

    res.status(201).json(workingHours);
  } catch (error) {
    res.status(500).json({ error: 'Failed to set working hours' });
  }
};
