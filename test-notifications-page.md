# Test Trang Notifications

## Mục tiêu
Kiểm tra xem trang NotificationsPage chỉ hiển thị thông báo của user đang đăng nhập.

## Các trường hợp test

### 1. Test khi chưa đăng nhập
**Bước thực hiện:**
1. Truy cập `/notifications` khi chưa đăng nhập
2. Kiểm tra hiển thị thông báo "Bạn cần đăng nhập để xem thông báo"

**Kết quả mong đợi:**
- Hiển thị trang lỗi với thông báo yêu cầu đăng nhập
- Không hiển thị danh sách thông báo

### 2. Test khi đã đăng nhập nhưng chưa có thông báo
**Bước thực hiện:**
1. Đăng nhập với tài khoản user
2. Truy cập `/notifications`
3. Kiểm tra hiển thị

**Kết quả mong đợi:**
- Hiển thị tiêu đề "Thông báo của tôi"
- Hiển thị thông báo "Bạn chưa có thông báo nào"
- Hiển thị danh sách các loại thông báo sẽ nhận được

### 3. Test khi có thông báo
**Bước thực hiện:**
1. Đăng nhập với tài khoản user
2. Admin tạo một giải đấu mới (hoặc có thông báo khác)
3. Truy cập `/notifications`
4. Kiểm tra hiển thị thông báo

**Kết quả mong đợi:**
- Hiển thị danh sách thông báo của user
- Chỉ hiển thị thông báo của user đang đăng nhập
- Không hiển thị thông báo của user khác

### 4. Test API endpoint
**Bước thực hiện:**
```bash
# Test khi chưa đăng nhập
curl -X GET http://localhost:8000/api/notifications

# Test khi đã đăng nhập
curl -X GET http://localhost:8000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Kết quả mong đợi:**
- Khi chưa đăng nhập: Trả về 401 với thông báo "Bạn cần đăng nhập để xem thông báo"
- Khi đã đăng nhập: Trả về danh sách thông báo của user đó

## Các thay đổi đã thực hiện

### Backend
1. **notificationController.js**: Cập nhật `getAllNotificationsController` để chỉ trả về thông báo của user đang đăng nhập
2. **notificationService.js**: Đã có sẵn `getNotificationsByUserId` để lấy thông báo theo User_ID

### Frontend
1. **NotificationsPage.jsx**: 
   - Thêm kiểm tra user đã đăng nhập chưa
   - Hiển thị thông báo lỗi nếu chưa đăng nhập
   - Hiển thị thông tin user và số thông báo chưa đọc
   - Cập nhật tiêu đề thành "Thông báo của tôi"

2. **NotificationList.jsx**:
   - Cập nhật logic fetch để chỉ gọi API khi user đã đăng nhập
   - Xử lý lỗi authentication (401)
   - Cập nhật thông báo khi không có notification
   - Thêm danh sách các loại thông báo sẽ nhận được

## Lưu ý quan trọng

1. **Bảo mật**: API `/notifications` giờ chỉ trả về thông báo của user đang đăng nhập
2. **User Experience**: Hiển thị thông báo rõ ràng khi chưa đăng nhập hoặc chưa có thông báo
3. **Performance**: Chỉ fetch notifications khi user đã đăng nhập
4. **Error Handling**: Xử lý đúng các trường hợp lỗi authentication

## Troubleshooting

### Thông báo không hiển thị
1. Kiểm tra user đã đăng nhập chưa
2. Kiểm tra token authentication
3. Kiểm tra console log trong browser
4. Kiểm tra server logs

### API trả về lỗi 401
1. Kiểm tra token có hợp lệ không
2. Kiểm tra middleware authentication
3. Kiểm tra req.user có tồn tại không

### Không có thông báo nào
1. Kiểm tra có thông báo nào được tạo cho user này không
2. Kiểm tra User_ID trong database
3. Kiểm tra is_deleted = false 