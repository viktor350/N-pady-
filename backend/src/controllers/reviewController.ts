import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { review: true },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.clientId !== req.user!.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Can only review completed bookings' });
    }

    if (booking.review) {
      return res.status(400).json({ error: 'Booking already reviewed' });
    }

    const review = await prisma.review.create({
      data: {
        bookingId,
        clientId: req.user!.id,
        businessId: booking.businessId,
        rating,
        comment,
      },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Update business average rating
    const businessReviews = await prisma.review.findMany({
      where: { businessId: booking.businessId },
      select: { rating: true },
    });

    const averageRating =
      businessReviews.reduce((sum, r) => sum + r.rating, 0) / businessReviews.length;

    await prisma.business.update({
      where: { id: booking.businessId },
      data: {
        averageRating,
        totalReviews: businessReviews.length,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
};

export const getReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { businessId, page = 1, limit = 10 } = req.query;

    if (!businessId) {
      return res.status(400).json({ error: 'Business ID is required' });
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { businessId: businessId as string },
        skip,
        take: Number(limit),
        include: {
          client: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          booking: {
            select: {
              service: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where: { businessId: businessId as string } }),
    ]);

    res.json({
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

export const respondToReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { response } = req.body;

    const review = await prisma.review.findUnique({
      where: { id },
      include: { business: true },
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.business.ownerId !== req.user!.id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { response },
      include: {
        client: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: 'Failed to respond to review' });
  }
};
