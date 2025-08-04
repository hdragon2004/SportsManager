# Cấu hình JWT Token

## Thời hạn Token

JWT token hiện tại được cấu hình với thời hạn **3 ngày** (72 giờ).

### Cấu hình trong code

1. **File cấu hình**: `src/config/environment.js`
   ```javascript
   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '3d',
   ```

2. **Sử dụng trong controllers**: `src/controllers/authController.js`
   ```javascript
   const token = jwt.sign(
     { userId: user.id, email: user.email },
     env.JWT_SECRET,
     { expiresIn: env.JWT_EXPIRES_IN }
   );
   ```

### Cấu hình qua biến môi trường

Tạo file `.env` trong thư mục `backend/` với nội dung:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=3d
```

### Các giá trị thời hạn có thể sử dụng

- `3d` - 3 ngày (hiện tại)
- `7d` - 7 ngày
- `24h` - 24 giờ
- `1h` - 1 giờ
- `30m` - 30 phút

### Ví dụ cấu hình khác

```env
# Token hết hạn sau 7 ngày
JWT_EXPIRES_IN=7d

# Token hết hạn sau 24 giờ
JWT_EXPIRES_IN=24h

# Token hết hạn sau 1 giờ
JWT_EXPIRES_IN=1h
```

## Bảo mật

- **JWT_SECRET**: Nên sử dụng một chuỗi bí mật mạnh, ít nhất 32 ký tự
- **Không commit file .env**: Đảm bảo file `.env` được thêm vào `.gitignore`
- **Rotate secrets**: Thay đổi JWT_SECRET định kỳ để tăng bảo mật

## Kiểm tra token

Để kiểm tra token có hợp lệ hay không, sử dụng endpoint:

```
GET /api/auth/me
Authorization: Bearer <your-token>
```

Nếu token hết hạn, sẽ nhận được lỗi:
```json
{
  "success": false,
  "message": "Token đã hết hạn"
}
``` 