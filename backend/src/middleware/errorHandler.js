/**
 * Bayora Backend - Centralized Error Handler Middleware
 * Suppresses internal stack traces, prevents database credential leaks,
 * and standardizes error responses.
 */

function errorHandler(err, req, res, next) {
  // Log full error internally for server diagnostic
  console.error('[Error] Server exception caught:', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  const statusCode = err.statusCode || err.status || 500;
  
  // Never expose raw database or internal exception messages in production
  let clientMessage = 'An unexpected internal error occurred';
  if (statusCode < 500 && err.message) {
    clientMessage = err.message;
  }

  res.status(statusCode).json({
    error: clientMessage
  });
}

module.exports = {
  errorHandler
};
