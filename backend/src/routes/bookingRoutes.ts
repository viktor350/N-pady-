import { Router } from 'express';
import * as bookingController from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';
import { createBookingValidation, idValidation } from '../utils/validation';
import { validationResult } from 'express-validator';

const router = Router();

const validate = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/',
  authenticate,
  createBookingValidation,
  validate,
  bookingController.createBooking
);

router.get('/', authenticate, bookingController.getBookings);
router.get('/available-slots', bookingController.getAvailableSlots);
router.get('/:id', authenticate, idValidation, validate, bookingController.getBooking);

router.patch(
  '/:id/status',
  authenticate,
  idValidation,
  validate,
  bookingController.updateBookingStatus
);

export default router;
