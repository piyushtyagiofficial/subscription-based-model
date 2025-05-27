import { validationResult } from 'express-validator';
import ErrorResponse from '../utils/errorResponse.js';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorResponse(errors.array()[0].msg, 400));
  }
  next();
};

export default validateRequest;