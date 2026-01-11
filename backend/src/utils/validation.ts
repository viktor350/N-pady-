import { body, param, query } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
];

export const loginValidation = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const createBusinessValidation = [
  body('name').notEmpty().withMessage('Business name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('phone').notEmpty().withMessage('Phone number is required'),
];

export const createServiceValidation = [
  body('name').notEmpty().withMessage('Service name is required'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be positive'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
];

export const createBookingValidation = [
  body('businessId').isUUID().withMessage('Invalid business ID'),
  body('serviceId').isUUID().withMessage('Invalid service ID'),
  body('startTime').isISO8601().withMessage('Invalid start time'),
];

export const createReviewValidation = [
  body('bookingId').isUUID().withMessage('Invalid booking ID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
];

export const idValidation = [
  param('id').isUUID().withMessage('Invalid ID format'),
];

export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
];
