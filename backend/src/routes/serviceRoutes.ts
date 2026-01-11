import { Router } from 'express';
import * as serviceController from '../controllers/serviceController';
import { authenticate, authorize } from '../middleware/auth';
import { createServiceValidation, idValidation } from '../utils/validation';
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
  createServiceValidation,
  validate,
  serviceController.createService
);

router.get('/', serviceController.getServices);
router.get('/:id', idValidation, validate, serviceController.getService);

router.put(
  '/:id',
  authenticate,
  authorize('PROVIDER', 'ADMIN'),
  idValidation,
  validate,
  serviceController.updateService
);

router.delete(
  '/:id',
  authenticate,
  authorize('PROVIDER', 'ADMIN'),
  idValidation,
  validate,
  serviceController.deleteService
);

export default router;
