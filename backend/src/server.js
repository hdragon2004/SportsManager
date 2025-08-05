import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import helmet from 'helmet';
import compression from 'compression';
import { AppRoutes } from './routes/app.js';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js';
import { requestLogger, errorLogger } from './middlewares/loggingMiddleware.js';
import { apiLimiter } from './middlewares/rateLimitMiddleware.js';
import { socketManager } from './socket/socketManager.js';
import tournamentNotificationService from './services/tournamentNotificationService.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
socketManager.initialize(server);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

import { env } from './config/environment.js';

// CORS configuration
app.use((req, res, next) => {
  const allowedOrigins = env.ALLOWED_ORIGINS;
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Content-Length, X-Total-Count');
  
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    return res.status(200).json({});
  }
  next();
});

// Rate limiting
app.use('/api', apiLimiter);

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Sports Tournament Management API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Setup routes
AppRoutes(app);

// Error logging middleware
app.use(errorLogger);

// Error handling middleware (phải đặt sau các routes)
app.use(errorHandlingMiddleware);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại'
  });
});



// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Use server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}`);
  
  // Khởi động lịch trình gửi thông báo tự động
  try {
    tournamentNotificationService.scheduleNotifications();
    console.log('✅ Đã khởi động lịch trình gửi thông báo tự động');
  } catch (error) {
    console.error('❌ Lỗi khi khởi động lịch trình thông báo:', error);
  }
});
