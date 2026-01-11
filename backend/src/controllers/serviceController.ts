import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const createService = async (req: AuthRequest, res: Response) => {
  try {
    const { businessId, name, description, duration, price, currency, color } =
      req.body;

    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    if (business.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        duration,
        price,
        currency: currency || 'EUR',
        color,
        businessId,
      },
    });

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
};

export const getServices = async (req: AuthRequest, res: Response) => {
  try {
    const { businessId } = req.query;

    const where: any = { isActive: true };
    if (businessId) {
      where.businessId = businessId as string;
    }

    const services = await prisma.service.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const getService = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        business: true,
      },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

export const updateService = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (
      service.business.ownerId !== req.user!.id &&
      req.user!.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedService = await prisma.service.update({
      where: { id },
      data: req.body,
    });

    res.json(updatedService);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (
      service.business.ownerId !== req.user!.id &&
      req.user!.role !== 'ADMIN'
    ) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.service.delete({ where: { id } });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
