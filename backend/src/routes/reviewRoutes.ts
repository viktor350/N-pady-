import { Router } from 'express';
import * as reviewController from '../controllers/reviewController';
import { authenticate, authorize } from '../middleware/auth';
import { createReviewValidation, idValidation } from '../utils/validation';
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
  createReviewValidation,
  validate,
  reviewController.createReview
);

router.get('/', reviewController.getReviews);

router.post(
  '/:id/respond',
  authenticate,
  authorize('PROVIDER', 'ADMIN'),
  idValidation,
  validate,
  reviewController.respondToReview
);

export default router;
