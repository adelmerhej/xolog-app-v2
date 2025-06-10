import cron from 'node-cron';
import axios from 'axios';

export function setupCronJobs() {
  // Daily at 2 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      await axios.post(`${baseUrl}/api/sync/all`);
      console.log('Daily sync completed');
    } catch (error) {
      console.error('Cron job error:', error);
    }
  });
}