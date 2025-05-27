import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Middleware to protect routes
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from Authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // If token doesn't exist
  if (!token) {
    return next(new ErrorResponse('Not authorized: No token provided', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and attach to request
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new ErrorResponse('Not authorized: User not found', 404));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized: Invalid token', 401));
  }
});

// Middleware to restrict access by role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new ErrorResponse(
          `Access denied: Role '${req.user?.role}' is not allowed`,
          403
        )
      );
    }
    next();
  };
};
