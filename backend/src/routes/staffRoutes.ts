import { Router } from 'express';
import * as staffController from '../controllers/staffController';
import { authenticate, authorize } from '../middleware/auth';
import { idValidation } from '../utils/validation';
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
  authorize('PROVIDER', 'ADMIN'),
  staffController.createStaff
);

router.get('/', staffController.getStaff);

router.put(
  '/:id',
  authenticate,
  authorize('PROVIDER', 'ADMIN'),
  idValidation,
  validate,
  staffController.updateStaff
);

router.post(
  '/assign-service',
  authenticate,
  authorize('PROVIDER', 'ADMIN'),
  staffController.assignServiceToStaff
);

router.post(
  '/working-hours',
  authenticate,
  authorize('PROVIDER', 'ADMIN'),
  staffController.setWorkingHours
);

export default router;
