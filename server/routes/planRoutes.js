import express from 'express';
import {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
} from '../controllers/planController.js';
import { protect, authorize } from '../middleware/auth.js';
import { check } from 'express-validator';
import validateRequest from '../middleware/validation.js';

const router = express.Router();

router
  .route('/')
  .get(getPlans)
  .post(
    [
      check('name', 'Name is required').not().isEmpty(),
      check('price', 'Price is required and must be a number').isNumeric(),
      check('duration', 'Duration is required and must be a number').isNumeric(),
    ],
    validateRequest,
    protect,
    authorize('admin'),
    createPlan
  );

router
  .route('/:id')
  .get(getPlan)
  .put(protect, authorize('admin'), updatePlan)
  .delete(protect, authorize('admin'), deletePlan);

export default router;