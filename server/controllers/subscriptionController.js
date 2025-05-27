import Subscription from '../models/Subscription.js'
import Plan from '../models/Plan.js'
import ErrorResponse from '../utils/errorResponse.js'
import asyncHandler from '../utils/asyncHandler.js'

// @desc    Create new subscription
// @route   POST /api/subscriptions
// @access  Private
export const createSubscription = asyncHandler(async (req, res, next) => {
  const { planId } = req.body
  const userId = req.user.id

  const existingSubscription = await Subscription.findOne({
    user: userId,
    status: 'ACTIVE'
  })

  if (existingSubscription) {
    return next(
      new ErrorResponse('User already has an active subscription', 400)
    )
  }

  const plan = await Plan.findById(planId)
  if (!plan) {
    return next(
      new ErrorResponse(`Plan not found with id of ${planId}`, 404)
    )
  }

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + plan.duration)

  const subscription = await Subscription.create({
    user: userId,
    plan: planId,
    startDate,
    endDate,
    status: 'ACTIVE'
  })

  await subscription.populate('plan')

  res.status(201).json({
    success: true,
    data: subscription
  })
})

// @desc    Get user's subscription
// @route   GET /api/subscriptions/:userId
// @access  Private
export const getSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to access this subscription', 401)
    )
  }

  const subscription = await Subscription.findOne({
    user: userId,
    status: 'ACTIVE'
  }).populate('plan')

  if (!subscription) {
    return next(
      new ErrorResponse(
        `No active subscription found for this user`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: subscription
  })
})

// @desc    Update subscription (upgrade/downgrade plan)
// @route   PUT /api/subscriptions/:userId
// @access  Private
export const updateSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId
  const { planId } = req.body

  if (req.user.id !== userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to update this subscription', 401)
    )
  }

  let subscription = await Subscription.findOne({
    user: userId,
    status: 'ACTIVE'
  })
  if (!subscription) {
    return next(
      new ErrorResponse(
        `No active subscription found for this user`,
        404
      )
    )
  }

  const plan = await Plan.findById(planId)
  if (!plan) {
    return next(
      new ErrorResponse(`Plan not found with id of ${planId}`, 404)
    )
  }

  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + plan.duration)

  subscription = await Subscription.findByIdAndUpdate(
    subscription._id,
    { plan: planId, startDate, endDate },
    { new: true, runValidators: true }
  ).populate('plan')

  res.status(200).json({
    success: true,
    data: subscription
  })
})

// @desc    Cancel subscription
// @route   DELETE /api/subscriptions/:userId
// @access  Private
export const cancelSubscription = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('Not authorized to cancel this subscription', 401)
    )
  }

  const subscription = await Subscription.findOne({
    user: userId,
    status: 'ACTIVE'
  })
  if (!subscription) {
    return next(
      new ErrorResponse(
        `No active subscription found for this user`,
        404
      )
    )
  }

  subscription.status = 'CANCELLED'
  await subscription.save()

  res.status(200).json({
    success: true,
    data: {},
    message: 'Subscription successfully cancelled'
  })
})

// @desc    Check and update expired subscriptions
// @route   GET /api/subscriptions/check-expired
// @access  Private/Admin
export const checkExpiredSubscriptions = asyncHandler(
  async (req, res, next) => {
    const now = new Date()
    const expiredSubscriptions = await Subscription.find({
      status: 'ACTIVE',
      endDate: { $lt: now }
    })

    for (const subscription of expiredSubscriptions) {
      subscription.status = 'EXPIRED'
      await subscription.save()
    }

    res.status(200).json({
      success: true,
      count: expiredSubscriptions.length,
      data: expiredSubscriptions
    })
  }
)
