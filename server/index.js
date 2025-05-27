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

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Subscription Service API',
    version: '1.0.0',
  });
});

app.use(errorHandler);

// Connect to DB and schedule jobs ONCE when the function cold starts
let isConnected = false;
const connect = async () => {
  if (!isConnected) {
    await connectDB();
    scheduleJobs();
    isConnected = true;
  }
};

connect().catch(console.error);

// Export the Express app as a Vercel serverless function
export default app;
