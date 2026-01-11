import { Router } from 'express';
import * as businessController from '../controllers/businessController';
import { authenticate, authorize } from '../middleware/auth';
import { createBusinessValidation, idValidation } from '../utils/validation';
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
  createBusinessValidation,
  validate,
  businessController.createBusiness
);

router.get('/', businessController.getBusinesses);
router.get('/my', authenticate, businessController.getMyBusinesses);
router.get('/:id', idValidation, validate, businessController.getBusiness);

router.put(
  '/:id',
  authenticate,
  authorize('PROVIDER', 'ADMIN'),
  idValidation,
  validate,
  businessController.updateBusiness
);

router.delete(
  '/:id',
  authenticate,
  authorize('PROVIDER', 'ADMIN'),
  idValidation,
  validate,
  businessController.deleteBusiness
);

export default router;
