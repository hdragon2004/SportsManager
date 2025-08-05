# Realtime Setup Guide - Frontend

## Tổng quan

Frontend đã được tích hợp hoàn toàn với Socket.io để hỗ trợ realtime notifications và updates.

## Các tính năng đã tích hợp

### 1. SocketProvider Context
- **File**: `src/contexts/SocketContext.jsx`
- **Chức năng**: Quản lý socket connection và notifications
- **Tính năng**:
  - Tự động kết nối socket khi user đăng nhập
  - Quản lý notifications realtime
  - Join/leave tournament rooms
  - Mark notifications as read

### 2. Socket Status Indicator
- **File**: `src/components/SocketStatus.jsx`
- **Chức năng**: Hiển thị trạng thái kết nối socket
- **Vị trí**: Header (chỉ hiển thị khi user đã đăng nhập)

### 3. Realtime Notifications
- **File**: `src/components/RealtimeNotification.jsx`
- **Chức năng**: Hiển thị thông báo realtime popup
- **Tính năng**:
  - Auto-hide sau 5 giây
  - Hiển thị icon theo loại notification
  - Màu sắc khác nhau cho từng loại

### 4. Tournament Socket Integration
- **File**: `src/components/TournamentSocket.jsx`
- **Chức năng**: Tự động join/leave tournament room
- **Sử dụng**: Trong TournamentDetailPage

### 5. Updated NotificationList
- **File**: `src/features/notifications/NotificationList.jsx`
- **Thay đổi**: Sử dụng socket context thay vì mock WebSocket
- **Tính năng**: Realtime updates cho notifications

## Cách sử dụng

### 1. Trong Component
```jsx
import { useSocket } from '../contexts/SocketContext';

function MyComponent() {
  const { 
    socket, 
    notifications, 
    unreadCount, 
    isConnected,
    joinTournament, 
    leaveTournament,
    markAsRead 
  } = useSocket();

  // Sử dụng các function và state
}
```

### 2. Join Tournament Room
```jsx
import TournamentSocket from '../components/TournamentSocket';

function TournamentPage({ tournamentId }) {
  return (
    <>
      <TournamentSocket tournamentId={tournamentId} />
      {/* Rest of component */}
    </>
  );
}
```

### 3. Hiển thị Socket Status
```jsx
import SocketStatus from '../components/SocketStatus';

function Header() {
  return (
    <header>
      <SocketStatus />
      {/* Rest of header */}
    </header>
  );
}
```

## Các loại Notifications

### 1. NEW_SCHEDULE
- **Trigger**: Khi có lịch thi đấu mới
- **Icon**: Calendar
- **Color**: Blue

### 2. MATCH_RESULT
- **Trigger**: Khi có kết quả trận đấu mới
- **Icon**: Chart bar
- **Color**: Green

### 3. REGISTRATION_STATUS
- **Trigger**: Khi trạng thái đăng ký thay đổi
- **Icon**: Check circle
- **Color**: Yellow

## Cấu hình

### 1. Socket URL
- **Development**: `http://localhost:8000`
- **Production**: Cần cập nhật trong `SocketContext.jsx`

### 2. Reconnection Settings
```javascript
{
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'],
  withCredentials: true
}
```

### 3. Browser Notifications
- Tự động yêu cầu quyền khi có notification mới
- Hỗ trợ tất cả các loại notification

## Testing

### 1. Test Socket Connection
1. Đăng nhập vào app
2. Kiểm tra SocketStatus component trong header
3. Nên hiển thị "Realtime" với dot màu xanh

### 2. Test Notifications
1. Tạo match mới từ admin panel
2. Cập nhật kết quả trận đấu
3. Thay đổi trạng thái đăng ký
4. Kiểm tra realtime notifications

### 3. Test Tournament Rooms
1. Vào trang chi tiết tournament
2. Kiểm tra console log: "Joined tournament room: [id]"
3. Rời khỏi trang, kiểm tra: "Left tournament room: [id]"

## Troubleshooting

### 1. Socket không kết nối
- Kiểm tra backend có chạy trên port 8000 không
- Kiểm tra CORS settings trong backend
- Kiểm tra console errors

### 2. Notifications không hiển thị
- Kiểm tra user đã đăng nhập chưa
- Kiểm tra socket connection status
- Kiểm tra browser notifications permission

### 3. Tournament rooms không hoạt động
- Kiểm tra tournamentId có đúng không
- Kiểm tra console logs
- Kiểm tra backend socket events

## Dependencies

```json
{
  "socket.io-client": "^4.8.1"
}
```

## Files đã tạo/cập nhật

### Tạo mới:
- `src/contexts/SocketContext.jsx`
- `src/components/SocketStatus.jsx`
- `src/components/RealtimeNotification.jsx`
- `src/components/TournamentSocket.jsx`

### Cập nhật:
- `src/main.jsx` - Thêm SocketProvider
- `src/App.jsx` - Thêm RealtimeNotification
- `src/components/Header.jsx` - Sử dụng socket context
- `src/features/notifications/NotificationList.jsx` - Sử dụng socket context
- `src/pages/TournamentDetailPage.jsx` - Thêm TournamentSocket 