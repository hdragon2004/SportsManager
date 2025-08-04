import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

// Rate limiter cho API chung
export const apiLimiter = rateLimit({
  windowMs: 10 * 1000, // 15 phút
  max: 100, // Giới hạn 100 requests mỗi IP trong 15 phút
  message: {
    success: false,
    message: 'Quá nhiều requests từ IP này, vui lòng thử lại sau 15 phút',
    statusCode: StatusCodes.TOO_MANY_REQUESTS
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho authentication
export const authLimiter = rateLimit({
  windowMs: 10 * 1000, // 15 phút
  max: 5, // Giới hạn 5 lần đăng nhập thất bại
  message: {
    success: false,
    message: 'Quá nhiều lần đăng nhập thất bại, vui lòng thử lại sau 15 phút',
    statusCode: StatusCodes.TOO_MANY_REQUESTS
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho tạo user
export const createUserLimiter = rateLimit({
  windowMs: 10 * 1000, // 1 giờ
  max: 3, // Giới hạn 3 lần tạo user mỗi IP trong 1 giờ
  message: {
    success: false,
    message: 'Quá nhiều lần tạo tài khoản, vui lòng thử lại sau 1 giờ',
    statusCode: StatusCodes.TOO_MANY_REQUESTS
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 