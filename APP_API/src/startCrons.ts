import CronManager from './cron';

// Initialize and start all cron jobs
const cronManager = new CronManager();

// Start all cron jobs when the application starts
cronManager.startAllCrons();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT, stopping cron jobs...');
  cronManager.stopAllCrons();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, stopping cron jobs...');
  cronManager.stopAllCrons();
  process.exit(0);
});

export { cronManager };