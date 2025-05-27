import Plan from '../models/Plan.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all plans
// @route   GET /api/plans
// @access  Public
export const getPlans = asyncHandler(async (req, res, next) => {
  const plans = await Plan.find({ active: true });

  res.status(200).json({
    success: true,
    count: plans.length,
    data: plans,
  });
});

// @desc    Get single plan
// @route   GET /api/plans/:id
// @access  Public
export const getPlan = asyncHandler(async (req, res, next) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return next(
      new ErrorResponse(`Plan not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: plan,
  });
});

// @desc    Create new plan
// @route   POST /api/plans
// @access  Private/Admin
export const createPlan = asyncHandler(async (req, res, next) => {
  const plan = await Plan.create(req.body);

  res.status(201).json({
    success: true,
    data: plan,
  });
});

// @desc    Update plan
// @route   PUT /api/plans/:id
// @access  Private/Admin
export const updatePlan = asyncHandler(async (req, res, next) => {
  let plan = await Plan.findById(req.params.id);

  if (!plan) {
    return next(
      new ErrorResponse(`Plan not found with id of ${req.params.id}`, 404)
    );
  }

  plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: plan,
  });
});

// @desc    Delete plan
// @route   DELETE /api/plans/:id
// @access  Private/Admin
export const deletePlan = asyncHandler(async (req, res, next) => {
  const plan = await Plan.findById(req.params.id);

  if (!plan) {
    return next(
      new ErrorResponse(`Plan not found with id of ${req.params.id}`, 404)
    );
  }

  // Instead of deleting, just mark as inactive
  plan.active = false;
  await plan.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});