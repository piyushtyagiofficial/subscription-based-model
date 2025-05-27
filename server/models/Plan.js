import mongoose from 'mongoose';

const { Schema } = mongoose;

const PlanSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a plan name'],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide a plan price'],
  },
  features: [String],
  duration: {
    type: Number,
    required: [true, 'Please provide a duration in days'],
    comment: 'Duration in days',
  },
  active: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Plan', PlanSchema);