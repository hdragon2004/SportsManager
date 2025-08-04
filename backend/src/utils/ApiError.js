class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    
    this.name = 'ApiError';
    this.statusCode = statusCode;
    
    // Ghi lại stack trace để dễ dàng debug
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError; 