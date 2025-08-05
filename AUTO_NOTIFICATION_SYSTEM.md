# Hệ thống Thông báo Tự động cho Giải đấu

## Tổng quan

Hệ thống thông báo tự động được thiết kế để gửi thông báo realtime đến tất cả users khi có giải đấu diễn ra hôm nay. Hệ thống bao gồm:

1. **Thông báo giải đấu hôm nay**: Gửi vào 8:00 sáng mỗi ngày
2. **Nhắc nhở trận đấu**: Gửi 30 phút trước khi trận đấu diễn ra
3. **Thông báo realtime**: Hiển thị ngay lập tức trên frontend

## Tính năng chính

### 1. Thông báo Tự động
- **Thời gian**: 8:00 sáng mỗi ngày
- **Đối tượng**: Tất cả users trong hệ thống
- **Nội dung**: Thông tin về các giải đấu và trận đấu diễn ra hôm nay
- **Phương thức**: Database + Socket.io realtime

### 2. Nhắc nhở Trận đấu
- **Thời gian**: 30 phút trước trận đấu
- **Tần suất**: Kiểm tra mỗi 30 phút
- **Nội dung**: Thông tin chi tiết về trận đấu sắp diễn ra
- **Ưu tiên**: Cao nhất (priority: 3)

### 3. Giao diện Quản lý
- Trang admin để quản lý thông báo
- Nút gửi thông báo thủ công
- Xem danh sách trận đấu hôm nay
- Khởi động/dừng lịch trình tự động

## Cấu trúc Code

### Backend

#### 1. Service (`tournamentNotificationService.js`)
```javascript
// Các phương thức chính:
- getTodayMatches() // Lấy trận đấu hôm nay
- getAllUsers() // Lấy tất cả users
- sendTodayTournamentsNotification() // Gửi thông báo giải đấu hôm nay
- sendMatchReminderNotification() // Gửi nhắc nhở trận đấu
- scheduleNotifications() // Lên lịch gửi thông báo tự động
```

#### 2. Controller (`notificationController.js`)
```javascript
// Các endpoint mới:
- POST /api/notifications/send-today-tournaments
- POST /api/notifications/send-match-reminder
- POST /api/notifications/start-schedule
- GET /api/notifications/today-matches
```

#### 3. Socket Events
```javascript
// Events mới:
- TODAY_TOURNAMENT_NOTIFICATION
- MATCH_REMINDER_NOTIFICATION
```

### Frontend

#### 1. Component (`TodayTournamentNotification.jsx`)
- Hiển thị thông báo realtime
- Toast notifications
- Quản lý trạng thái đã đọc/chưa đọc
- Giao diện đẹp với Tailwind CSS

#### 2. Admin Page (`NotificationAdmin.jsx`)
- Giao diện quản lý thông báo
- Nút gửi thông báo thủ công
- Xem danh sách trận đấu hôm nay
- Thông tin về hệ thống

## Cách sử dụng

### 1. Khởi động Hệ thống
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run dev
```

### 2. Truy cập Trang Admin
- Đăng nhập với tài khoản admin
- Truy cập: `/admin/notifications`
- Sử dụng các nút để quản lý thông báo

### 3. API Endpoints

#### Gửi thông báo giải đấu hôm nay
```bash
POST /api/notifications/send-today-tournaments
Authorization: Bearer <token>
```

#### Gửi nhắc nhở trận đấu
```bash
POST /api/notifications/send-match-reminder
Authorization: Bearer <token>
Body: { "minutesBefore": 30 }
```

#### Khởi động lịch trình tự động
```bash
POST /api/notifications/start-schedule
Authorization: Bearer <token>
```

#### Xem trận đấu hôm nay
```bash
GET /api/notifications/today-matches
Authorization: Bearer <token>
```

### 4. Socket Events

#### Lắng nghe thông báo
```javascript
// Frontend
socket.on('TODAY_TOURNAMENT_NOTIFICATION', (data) => {
  console.log('Thông báo giải đấu hôm nay:', data);
});

socket.on('MATCH_REMINDER_NOTIFICATION', (data) => {
  console.log('Nhắc nhở trận đấu:', data);
});
```

## Cấu hình

### 1. Thời gian gửi thông báo
```javascript
// Trong tournamentNotificationService.js
scheduleNotifications() {
  // Gửi thông báo vào 8:00 sáng mỗi ngày
  const morningTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
  
  // Gửi nhắc nhở mỗi 30 phút
  setInterval(async () => {
    await this.sendMatchReminderNotification(30);
  }, 30 * 60 * 1000);
}
```

### 2. Nội dung thông báo
```javascript
// Thông báo giải đấu hôm nay
const notificationData = {
  title: `Giải đấu diễn ra hôm nay: ${tournament.name}`,
  message: `Hôm nay có ${matches.length} trận đấu diễn ra trong giải ${tournament.name}. Hãy theo dõi để không bỏ lỡ!`,
  type: 'TODAY_TOURNAMENT',
  priority: 2
};

// Nhắc nhở trận đấu
const notificationData = {
  title: `Nhắc nhở: Trận đấu sắp diễn ra`,
  message: `Trận đấu trong giải ${match.Tournament.name} sẽ diễn ra sau ${timeUntilMatch} phút tại ${match.location}`,
  type: 'MATCH_REMINDER',
  priority: 3
};
```

## Database Schema

### Bảng Notifications
```sql
CREATE TABLE Notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  User_ID INT,
  Tournament_ID INT,
  time_sent DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE,
  priority INT DEFAULT 1,
  is_deleted BOOLEAN DEFAULT FALSE
);
```

## Troubleshooting

### 1. Thông báo không gửi được
- Kiểm tra kết nối database
- Kiểm tra quyền admin
- Xem log server để debug

### 2. Socket không hoạt động
- Kiểm tra kết nối Socket.io
- Kiểm tra CORS configuration
- Xem console browser để debug

### 3. Lịch trình không chạy
- Kiểm tra server có chạy liên tục không
- Kiểm tra timezone server
- Xem log để debug

## Monitoring

### 1. Logs
```javascript
// Server logs
console.log(`Đã gửi ${notifications.length} thông báo cho ${allUsers.length} users`);
console.log('✅ Đã khởi động lịch trình gửi thông báo tự động');
```

### 2. Metrics
- Số lượng thông báo gửi thành công
- Số lượng users nhận thông báo
- Thời gian gửi thông báo
- Tỷ lệ thành công/thất bại

## Bảo mật

### 1. Authentication
- Tất cả API endpoints yêu cầu JWT token
- Chỉ admin có thể gửi thông báo thủ công

### 2. Rate Limiting
- Giới hạn số lượng request
- Tránh spam thông báo

### 3. Data Validation
- Validate dữ liệu đầu vào
- Sanitize nội dung thông báo

## Tương lai

### 1. Tính năng mới
- Thông báo theo timezone
- Tùy chỉnh nội dung thông báo
- Thống kê chi tiết
- Push notification cho mobile

### 2. Cải tiến
- Tối ưu performance
- Caching thông báo
- Queue system cho thông báo lớn
- Multi-language support 