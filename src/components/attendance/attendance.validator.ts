import { body, param } from 'express-validator';

const validateAddAttendance = [
  param('id').isMongoId().withMessage('Invalid student ID'),
  body('isPresent')
    .isBoolean().withMessage('isPresent must be a boolean value')
    .notEmpty().withMessage('isPresent is required')
];

const validateUpdateAttendance = [
  param('id').isMongoId().withMessage('Invalid student ID'),
  param('date').isISO8601().withMessage('Date must be a valid ISO 8601 format'),
  body('isPresent')
    .isBoolean().withMessage('isPresent must be a boolean value')
    .notEmpty().withMessage('isPresent is required')
];

export {validateAddAttendance, validateUpdateAttendance}
