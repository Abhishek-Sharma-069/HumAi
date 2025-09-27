import winston from 'winston';

// Create transports array
const transports = [];

// Add console transport for all environments (Vercel logs to console)
transports.push(new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  )
}));

// Only add file transports in non-serverless environments
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  try {
    transports.push(
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    );
  } catch (error) {
    // If file system is not available (like in Vercel), just use console
    console.warn('File logging not available, using console only');
  }
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports
});

class LoggerService {
  static info(message, meta = {}) {
    logger.info(message, meta);
  }

  static error(message, error = null) {
    const meta = error ? { error: error.stack || error.toString() } : {};
    logger.error(message, meta);
  }

  static warn(message, meta = {}) {
    logger.warn(message, meta);
  }

  static debug(message, meta = {}) {
    logger.debug(message, meta);
  }

  static http(message, meta = {}) {
    logger.http(message, meta);
  }
}

export default LoggerService;