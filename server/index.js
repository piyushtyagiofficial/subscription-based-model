import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import scheduleJobs from './utils/scheduleJobs.js';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import planRoutes from './routes/planRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';

const app = express();

// Global Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet()); // Adds security headers

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Health check / Base route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Subscription Service API',
    version: '1.0.0',
  });
});

// Custom Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    scheduleJobs();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
