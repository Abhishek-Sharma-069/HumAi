import { env } from '../config/env.js';

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  // Get the status code, default to 500 if not set
  const statusCode = err.statusCode || 500;
  
  // Prepare error response
  const errorResponse = {
    message: err.message || 'Internal Server Error',
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    code: err.code,
  };

  // Log error in development
  if (env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Not Found Handler
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// Custom Error Class
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export { errorHandler, notFound, AppError };