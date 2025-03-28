import React, { useEffect, useState } from 'react';
import HealthCheckService from '../services/healthCheck';

const ConnectionStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    status: 'checking',
    message: 'Checking connection...',
    timestamp: null
  });

  const checkConnection = async () => {
    const status = await HealthCheckService.checkBackendStatus();
    setConnectionStatus(status);
  };

  useEffect(() => {
    checkConnection();
    // Check connection status every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (connectionStatus.status === 'checking') return 'bg-yellow-500';
    return HealthCheckService.isHealthy(connectionStatus) ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-white border border-gray-200">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        <span className="text-sm font-medium text-gray-700">
          {connectionStatus.message}
        </span>
      </div>
      {connectionStatus.timestamp && (
        <p className="text-xs text-gray-500 mt-1">
          Last checked: {new Date(connectionStatus.timestamp).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
};

export default ConnectionStatus;