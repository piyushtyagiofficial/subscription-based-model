import express from 'express';
import {
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  checkExpiredSubscriptions,
} from '../controllers/subscriptionController.js';
import { protect, authorize } from '../middleware/auth.js';
import { check } from 'express-validator';
import validateRequest from '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .post(
    [
      check('planId', 'Plan ID is required').not().isEmpty(),
    ],
    validateRequest,
    protect,
    createSubscription
  );

router.get(
  '/check-expired',
  protect,
  authorize('admin'),
  checkExpiredSubscriptions
);

router
  .route('/:userId')
  .get(protect, getSubscription)
  .put(
    [
      check('planId', 'Plan ID is required').not().isEmpty(),
    ],
    validateRequest,
    protect,
    updateSubscription
  )
  .delete(protect, cancelSubscription);

export default router;