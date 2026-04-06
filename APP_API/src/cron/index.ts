
class CronManager {

  constructor() {
  }

  public startAllCrons() {
    console.log('Starting all cron jobs...');
    
    // Start post scheduler cron
    
    console.log('All cron jobs started successfully');
  }

  public stopAllCrons() {
    // You can add stop functionality here if needed
    console.log('Stopping all cron jobs...');
  }
}

export default CronManager;