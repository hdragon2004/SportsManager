# API Documentation - Sports Tournament Management

## Base URL
```
http://localhost:8000/api
```

## Authentication
Tất cả API endpoints (trừ đăng ký/đăng nhập) yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Đăng ký tài khoản mới
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "confirm_password": "password123",
  "phone": "0123456789"
}
```

#### POST /auth/login
Đăng nhập
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Users

#### GET /users
Lấy danh sách tất cả users
- **Headers**: `Authorization: Bearer <token>`
- **Query params**: 
  - `page`: Số trang (default: 1)
  - `limit`: Số items mỗi trang (default: 10)
  - `search`: Tìm kiếm theo tên hoặc email

#### GET /users/:id
Lấy thông tin user theo ID
- **Headers**: `Authorization: Bearer <token>`

#### POST /users
Tạo user mới
- **Headers**: `Authorization: Bearer <token>`
- **Body**: 
```json
{
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0123456789"
}
```

#### PUT /users/:id
Cập nhật thông tin user
- **Headers**: `Authorization: Bearer <token>`
- **Body**: 
```json
{
  "name": "Nguyễn Văn B",
  "email": "newemail@example.com",
  "phone": "0987654321"
}
```

#### DELETE /users/:id
Xóa user
- **Headers**: `Authorization: Bearer <token>`

### Tournaments

#### GET /tournaments
Lấy danh sách tournaments
- **Query params**:
  - `status`: active, inactive, all
  - `type`: tournament type ID
  - `page`: Số trang
  - `limit`: Số items mỗi trang

#### POST /tournaments
Tạo tournament mới
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "name": "Giải bóng đá sinh viên 2024",
  "description": "Giải đấu bóng đá dành cho sinh viên",
  "start_date": "2024-03-01T00:00:00.000Z",
  "end_date": "2024-03-15T00:00:00.000Z",
  "signup_deadline": "2024-02-25T00:00:00.000Z",
  "max_teams": 16,
  "Tournament_Type_ID": 1
}
```

### Teams

#### GET /teams
Lấy danh sách teams
- **Query params**:
  - `tournament_id`: Lọc theo tournament
  - `user_id`: Lọc theo user tạo team

#### POST /teams
Tạo team mới
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "name": "Team A",
  "description": "Mô tả team",
  "User_ID": 1
}
```

### Matches

#### GET /matches
Lấy danh sách matches
- **Query params**:
  - `tournament_id`: Lọc theo tournament
  - `round_id`: Lọc theo round
  - `status`: scheduled, in_progress, completed

#### POST /matches
Tạo match mới
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "Tournament_ID": 1,
  "Round_ID": 1,
  "Team1_ID": 1,
  "Team2_ID": 2,
  "match_date": "2024-03-01T14:00:00.000Z",
  "venue": "Sân vận động A"
}
```

### Notifications

#### GET /notifications
Lấy danh sách notifications của user hiện tại
- **Headers**: `Authorization: Bearer <token>`

#### PUT /notifications/:id/read
Đánh dấu notification đã đọc
- **Headers**: `Authorization: Bearer <token>`

#### GET /users/:userId/notifications/unread-count
Lấy số notification chưa đọc
- **Headers**: `Authorization: Bearer <token>`

## Socket.io Events

### Client to Server
- `authenticate`: Xác thực user với socket
- `joinTournament`: Tham gia room tournament
- `leaveTournament`: Rời room tournament
- `notificationReceived`: Xác nhận đã nhận notification

### Server to Client
- `newSchedule`: Thông báo lịch đấu mới
- `matchResultUpdated`: Thông báo kết quả trận đấu
- `registrationStatus`: Thông báo trạng thái đăng ký

## Error Responses

Tất cả API trả về lỗi theo format:
```json
{
  "success": false,
  "message": "Mô tả lỗi",
  "statusCode": 400
}
```

## Success Responses

Tất cả API thành công trả về format:
```json
{
  "success": true,
  "data": {...},
  "message": "Thông báo thành công"
}
```

## Rate Limiting

- API chung: 100 requests/15 phút
- Authentication: 5 requests/15 phút
- Tạo user: 3 requests/giờ

## Status Codes

- `200`: Thành công
- `201`: Tạo thành công
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `429`: Too Many Requests
- `500`: Internal Server Error 