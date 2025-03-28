import LoggerService from '../services/loggerService.js';

const healthCheck = async (req, res) => {
  try {
    LoggerService.info('Health check request received');
    
    // You can add more health checks here (e.g., database connection)
    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      message: 'Server is running'
    };

    LoggerService.info('Health check successful', status);
    res.status(200).json(status);
  } catch (error) {
    LoggerService.error('Health check failed', error);
    res.status(500).json({
      status: 'error',
      message: 'Server health check failed',
      error: error.message
    });
  }
};

export { healthCheck };