import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const createBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      email,
      phone,
      address,
      city,
      country,
      logo,
      coverImage,
      website,
      timezone,
      currency,
    } = req.body;

    const business = await prisma.business.create({
      data: {
        name,
        description,
        email,
        phone,
        address,
        city,
        country,
        logo,
        coverImage,
        website,
        timezone: timezone || 'Europe/Bratislava',
        currency: currency || 'EUR',
        ownerId: req.user!.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(business);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create business' });
  }
};

export const getBusinesses = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, search, city } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (city) {
      where.city = { equals: city as string, mode: 'insensitive' };
    }

    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              services: true,
              bookings: true,
              reviews: true,
            },
          },
        },
        orderBy: { averageRating: 'desc' },
      }),
      prisma.business.count({ where }),
    ]);

    res.json({
      businesses,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
};

export const getBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        services: {
          where: { isActive: true },
        },
        staff: {
          where: { isActive: true },
        },
        workingHours: {
          where: { isActive: true },
        },
        reviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    res.json(business);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch business' });
  }
};

export const updateBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    if (business.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedBusiness = await prisma.business.update({
      where: { id },
      data: req.body,
    });

    res.json(updatedBusiness);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update business' });
  }
};

export const deleteBusiness = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const business = await prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    if (business.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await prisma.business.delete({ where: { id } });

    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete business' });
  }
};

export const getMyBusinesses = async (req: AuthRequest, res: Response) => {
  try {
    const businesses = await prisma.business.findMany({
      where: { ownerId: req.user!.id },
      include: {
        _count: {
          select: {
            services: true,
            staff: true,
            bookings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(businesses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch businesses' });
  }
};
