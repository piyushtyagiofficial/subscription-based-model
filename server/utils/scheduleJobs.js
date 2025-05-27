import Subscription from '../models/Subscription.js';

// Function to check and update expired subscriptions
const checkExpiredSubscriptions = async () => {
  try {
    const now = new Date();

    // Find all active subscriptions that have passed their end date
    const expiredSubscriptions = await Subscription.find({
      status: 'ACTIVE',
      endDate: { $lt: now },
    });

    // Update each expired subscription
    for (const subscription of expiredSubscriptions) {
      subscription.status = 'EXPIRED';
      await subscription.save();
      console.log(`Subscription ${subscription._id} marked as EXPIRED`);
    }

    console.log(`${expiredSubscriptions.length} subscriptions expired`);
  } catch (error) {
    console.error('Error checking expired subscriptions:', error);
  }
};

// Schedule the job to run once a day
const scheduleJobs = () => {
  // Check for expired subscriptions every 24 hours
  setInterval(checkExpiredSubscriptions, 24 * 60 * 60 * 1000);
  
  // Also run immediately on startup
  checkExpiredSubscriptions();
  
  console.log('Scheduled jobs initialized');
};

export default scheduleJobs;