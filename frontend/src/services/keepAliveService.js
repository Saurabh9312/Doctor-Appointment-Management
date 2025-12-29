import { keepAliveAPI } from '../api_client/keepAliveAPI';

class KeepAliveService {
  constructor() {
    this.intervalId = null;
    this.isActive = false;
    this.intervalDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
  }

  /**
   * Start the keep-alive service
   */
  start() {
    if (this.isActive) {
      console.warn('Keep-alive service is already running');
      return;
    }

    this.isActive = true;
    console.log('Keep-alive service started, pinging backend every 5 minutes');

    // Ping immediately when starting
    this.ping();

    // Set up the interval
    this.intervalId = setInterval(() => {
      this.ping();
    }, this.intervalDuration);
  }

  /**
   * Stop the keep-alive service
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.isActive = false;
      console.log('Keep-alive service stopped');
    }
  }

  /**
   * Ping the backend to keep it alive
   */
  async ping() {
    try {
      const timestamp = new Date().toISOString();
      const response = await keepAliveAPI.ping({ timestamp });
      
      if (response.status === 'alive') {
        console.log('Keep-alive ping successful:', response.message);
      } else {
        console.warn('Keep-alive ping returned error status:', response);
      }
    } catch (error) {
      console.error('Keep-alive ping failed:', error.message);
    }
  }

  /**
   * Check if the service is currently active
   */
  isActiveService() {
    return this.isActive;
  }
}

// Create a singleton instance
const keepAliveService = new KeepAliveService();
export default keepAliveService;