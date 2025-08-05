# Test Chuông Thông Báo (Notification Bell)

## Mục tiêu
Kiểm tra xem chuông thông báo trong header có hiển thị chấm đỏ đúng cách khi có thông báo chưa đọc, ngay cả khi user đang ở trong trang notifications.

## Các trường hợp test

### 1. Test khi có thông báo chưa đọc
**Bước thực hiện:**
1. Đăng nhập với tài khoản user
2. Admin tạo một giải đấu mới (hoặc có thông báo khác)
3. Kiểm tra chuông thông báo trong header
4. Vào trang `/notifications`
5. Kiểm tra chuông thông báo vẫn hiển thị chấm đỏ

**Kết quả mong đợi:**
- Chuông thông báo hiển thị chấm đỏ với số lượng thông báo chưa đọc
- Chấm đỏ vẫn hiển thị khi ở trong trang notifications
- Số lượng chấm đỏ giảm khi user mark as read

### 2. Test khi mark as read
**Bước thực hiện:**
1. Đăng nhập với tài khoản user có thông báo chưa đọc
2. Vào trang `/notifications`
3. Click "Đánh dấu đã đọc" cho một thông báo
4. Kiểm tra chuông thông báo

**Kết quả mong đợi:**
- Số lượng chấm đỏ giảm 1
- Chuông thông báo vẫn hiển thị nếu còn thông báo chưa đọc khác

### 3. Test khi mark all as read
**Bước thực hiện:**
1. Đăng nhập với tài khoản user có nhiều thông báo chưa đọc
2. Vào trang `/notifications`
3. Click "Đánh dấu tất cả đã đọc"
4. Kiểm tra chuông thông báo

**Kết quả mong đợi:**
- Chấm đỏ biến mất hoàn toàn
- Chuông thông báo không còn hiển thị số lượng

### 4. Test khi xóa thông báo
**Bước thực hiện:**
1. Đăng nhập với tài khoản user có thông báo chưa đọc
2. Vào trang `/notifications`
3. Xóa một thông báo chưa đọc
4. Kiểm tra chuông thông báo

**Kết quả mong đợi:**
- Số lượng chấm đỏ giảm 1 nếu thông báo bị xóa chưa đọc
- Số lượng không thay đổi nếu thông báo đã đọc

### 5. Test realtime notification
**Bước thực hiện:**
1. Đăng nhập với tài khoản user
2. Mở trang notifications
3. Admin tạo giải đấu mới (hoặc có thông báo realtime)
4. Kiểm tra chuông thông báo

**Kết quả mong đợi:**
- Chấm đỏ xuất hiện ngay lập tức
- Số lượng thông báo chưa đọc tăng lên

## Các thay đổi đã thực hiện

### SocketContext.jsx
1. **Cải thiện fetchUserNotifications**: 
   - Thêm logging để debug
   - Xử lý response data tốt hơn
   - Không reset unreadCount khi có lỗi

2. **Thêm useEffect theo dõi notifications**:
   - Tự động cập nhật unreadCount khi notifications thay đổi
   - Đảm bảo unreadCount luôn chính xác

3. **Export setUnreadCount**:
   - Cho phép components khác cập nhật unreadCount
   - Đảm bảo tính nhất quán

### NotificationList.jsx
1. **Cập nhật handleMarkAsRead**:
   - Gọi setUnreadCount để giảm số lượng
   - Đảm bảo UI và state đồng bộ

2. **Cập nhật handleMarkAllAsRead**:
   - Reset unreadCount về 0
   - Cập nhật tất cả notifications thành đã đọc

3. **Cập nhật deleteNotification**:
   - Kiểm tra notification bị xóa có chưa đọc không
   - Giảm unreadCount nếu cần

4. **Thêm useEffect theo dõi notifications**:
   - Tự động cập nhật unreadCount khi notifications thay đổi
   - Đảm bảo tính chính xác

## Lưu ý quan trọng

1. **Tính nhất quán**: unreadCount luôn được cập nhật khi có thay đổi trong notifications
2. **Realtime**: Chuông thông báo cập nhật ngay lập tức khi có thông báo mới
3. **Error Handling**: Không reset unreadCount khi có lỗi để tránh mất dữ liệu
4. **Performance**: Chỉ cập nhật khi cần thiết

## Troubleshooting

### Chấm đỏ không hiển thị
1. Kiểm tra unreadCount trong SocketContext
2. Kiểm tra console log để debug
3. Kiểm tra notifications có is_read = false không

### Chấm đỏ không giảm khi mark as read
1. Kiểm tra API mark as read có thành công không
2. Kiểm tra setUnreadCount có được gọi không
3. Kiểm tra logic tính toán unreadCount

### Chấm đỏ biến mất khi vào trang notifications
1. Kiểm tra useEffect theo dõi notifications
2. Kiểm tra fetchUserNotifications có gọi đúng không
3. Kiểm tra response format từ API

### Số lượng không chính xác
1. Kiểm tra logic filter notifications chưa đọc
2. Kiểm tra cả is_read và read field
3. Kiểm tra console log để debug 