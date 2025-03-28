import api from './api';

class HealthCheckService {
  static async checkBackendStatus() {
    try {
      const response = await api.get('/health/check');
      return {
        isConnected: true,
        status: response.data.status,
        message: response.data.message,
        timestamp: response.data.timestamp
      };
    } catch (error) {
      console.error('Backend connection check failed:', error);
      return {
        isConnected: false,
        status: 'error',
        message: error.response?.data?.message || 'Unable to connect to the server',
        timestamp: new Date().toISOString()
      };
    }
  }

  static isHealthy(status) {
    return status?.isConnected && status?.status === 'healthy';
  }
}

export default HealthCheckService;