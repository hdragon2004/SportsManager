import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/utils/ApiError';

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      // SỬA LẠI DÒNG NÀY: Thay vì "throw", chúng ta dùng "next()" để chuyển lỗi 
      // cho middleware xử lý lỗi tập trung một cách an toàn.
      // Thêm "return" để đảm bảo không có mã nào khác chạy sau đó.
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Access token không được cung cấp'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-here');
    req.user = decoded; // Gắn thông tin user đã giải mã vào request
    next(); // Chuyển sang middleware hoặc controller tiếp theo nếu thành công
  } catch (error) {
    // Bắt các lỗi từ jwt.verify (token sai, hết hạn) và chuyển đi
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token không hợp lệ'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(StatusCodes.UNAUTHORIZED, 'Token đã hết hạn'));
    } else {
      next(error);
    }
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    // Middleware này cần chạy sau authMiddleware, nên req.user sẽ tồn tại
    if (!req.user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Yêu cầu đăng nhập'));
    }

    // Giả sử vai trò được lưu trong token là `req.user.role`
    // Cần đảm bảo khi tạo token, bạn đã thêm thông tin vai trò vào payload
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập'));
    }

    next();
  };
};