# Tính năng Xin cấp quyền Huấn luyện viên

## Tổng quan

Tính năng này cho phép người dùng xin cấp quyền huấn luyện viên để có thể quản lý đội bóng và tham gia các hoạt động huấn luyện. Admin có thể duyệt hoặc từ chối các yêu cầu này.

## Chức năng chính

### 1. Cho User
- **Xin cấp quyền**: Gửi yêu cầu xin quyền huấn luyện viên với lý do
- **Xem lịch sử**: Theo dõi trạng thái các yêu cầu đã gửi
- **Thông báo**: Nhận thông báo khi yêu cầu được xử lý

### 2. Cho Admin
- **Quản lý yêu cầu**: Xem danh sách tất cả yêu cầu xin quyền
- **Duyệt/Từ chối**: Xử lý yêu cầu với ghi chú
- **Thông báo**: Tự động gửi thông báo cho user khi xử lý

## Cấu trúc Database

### Bảng Role_User
```sql
- id: Primary Key
- User_ID: Foreign Key đến User
- Role_ID: Foreign Key đến Role (4 = Coach)
- status: 'pending', 'approved', 'rejected'
- reason: Lý do xin quyền
- adminNote: Ghi chú của admin
- requestDate: Ngày gửi yêu cầu
- processedDate: Ngày xử lý
```

## API Endpoints

### Backend Routes
```javascript
// User xin quyền
POST /api/request-coach-role
Body: { reason: string }

// Admin lấy danh sách yêu cầu
GET /api/coach-role-requests

// Admin xử lý yêu cầu
PUT /api/coach-role-requests/:id/process
Body: { status: 'approved'|'rejected', adminNote?: string }
```

### Frontend API
```javascript
// permissionAPI.js
requestCoachRole(reason)
getCoachRoleRequests()
processCoachRoleRequest(id, data)
```

## Các trang và Component

### 1. Trang User
- **CoachPermissionPage**: Trang chính cho user xin quyền
- **RequestPermissionForm**: Form gửi yêu cầu
- **CoachPermissionNav**: Component navigation

### 2. Trang Admin
- **CoachPermissionAdmin**: Trang quản lý yêu cầu cho admin

### 3. Routes
```javascript
// User route
/coach-permission

// Admin route
/admin/coach-permissions
```

## Quy trình hoạt động

### 1. User gửi yêu cầu
1. User truy cập `/coach-permission`
2. Điền form với lý do xin quyền
3. Hệ thống tạo record trong `Role_User` với status = 'pending'

### 2. Admin xử lý
1. Admin truy cập `/admin/coach-permissions`
2. Xem danh sách yêu cầu đang chờ
3. Duyệt hoặc từ chối với ghi chú
4. Hệ thống cập nhật status và tạo notification

### 3. User nhận thông báo
1. User nhận notification về kết quả
2. Nếu được duyệt, user có quyền coach
3. Nếu bị từ chối, user có thể xem lý do

## Tính năng bảo mật

### 1. Phân quyền
- Chỉ user đã đăng nhập mới có thể xin quyền
- Chỉ admin mới có thể xử lý yêu cầu
- User chỉ có thể xem yêu cầu của chính mình

### 2. Validation
- Kiểm tra user chưa có quyền coach
- Kiểm tra không có yêu cầu pending
- Kiểm tra quyền admin khi xử lý

## Realtime Features

### 1. Socket Events
```javascript
// Khi admin xử lý yêu cầu
socket.emit('permissionUpdate', data)

// Khi có cập nhật
socket.on('permissionUpdate', data)
```

### 2. Notifications
- Tự động tạo notification khi yêu cầu được xử lý
- User nhận thông báo realtime

## Hướng dẫn sử dụng

### Cho User
1. Đăng nhập vào hệ thống
2. Truy cập `/coach-permission`
3. Điền form xin quyền với lý do
4. Chờ admin xử lý
5. Kiểm tra thông báo và lịch sử yêu cầu

### Cho Admin
1. Đăng nhập với tài khoản admin
2. Truy cập `/admin/coach-permissions`
3. Xem danh sách yêu cầu đang chờ
4. Duyệt hoặc từ chối với ghi chú
5. Hệ thống tự động thông báo cho user

## Cấu hình

### 1. Role ID
- Coach role có ID = 4
- Có thể thay đổi trong database

### 2. Notification Types
- `permission_approved`: Khi yêu cầu được duyệt
- `permission_rejected`: Khi yêu cầu bị từ chối

## Troubleshooting

### 1. Lỗi thường gặp
- User đã có quyền coach: Hiển thị thông báo đã có quyền
- Có yêu cầu pending: Không cho phép gửi yêu cầu mới
- Không có quyền admin: Hiển thị lỗi 403

### 2. Debug
- Kiểm tra console log
- Kiểm tra database records
- Kiểm tra socket connection

## Tương lai

### 1. Tính năng có thể thêm
- Email notification
- SMS notification
- Auto-approve cho user có uy tín cao
- Batch processing cho nhiều yêu cầu

### 2. Cải tiến
- UI/UX optimization
- Performance optimization
- Mobile responsive
- Multi-language support 