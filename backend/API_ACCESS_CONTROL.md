# Phân chia Quyền Truy cập API

## Tổng quan
API được phân chia thành 2 loại chính:
1. **Protected APIs**: Cần authentication (JWT token)
2. **Public APIs**: Không cần authentication

## 🔐 Protected APIs (Cần đăng nhập)

### Authentication
- `POST /auth/register` - Đăng ký
- `POST /auth/login` - Đăng nhập
- `POST /auth/change-password` - Đổi mật khẩu

### Users (Chỉ xem dữ liệu của chính mình)
- `GET /users` - Lấy danh sách users (admin: tất cả, user: chỉ bản thân)
- `GET /users/:id` - Lấy thông tin user (chỉ bản thân)
- `PUT /users/:id` - Cập nhật user (chỉ bản thân)
- `DELETE /users/:id` - Xóa user (chỉ bản thân)

### Teams (Chỉ xem teams là thành viên)
- `GET /teams` - Lấy danh sách teams (admin: tất cả, user: chỉ teams thành viên)
- `GET /teams/:id` - Lấy thông tin team (chỉ teams thành viên)
- `POST /teams` - Tạo team mới
- `PUT /teams/:id` - Cập nhật team (chỉ teams thành viên)
- `DELETE /teams/:id` - Xóa team (chỉ teams thành viên)

### Team Members (Chỉ xem teams là thành viên)
- `GET /team-members` - Lấy danh sách team members
- `GET /team-members/:id` - Lấy thông tin team member
- `POST /team-members` - Tạo team member mới
- `PUT /team-members/:id` - Cập nhật team member
- `DELETE /team-members/:id` - Xóa team member
- `GET /teams/:teamId/members` - Lấy members theo team

### Registrations (Chỉ xem registrations của teams thành viên)
- `GET /registrations` - Lấy danh sách registrations (admin: tất cả, user: chỉ teams thành viên)
- `GET /registrations/:id` - Lấy thông tin registration (chỉ teams thành viên)
- `POST /registrations` - Tạo registration mới
- `PUT /registrations/:id` - Cập nhật registration (chỉ teams thành viên)
- `DELETE /registrations/:id` - Xóa registration (chỉ teams thành viên)
- `GET /tournaments/:tournamentId/registrations` - Lấy registrations theo tournament
- `GET /teams/:teamId/registrations` - Lấy registrations theo team

### Notifications (Chỉ xem notifications của chính mình)
- `GET /notifications` - Lấy danh sách notifications (admin: tất cả, user: chỉ bản thân)
- `GET /notifications/:id` - Lấy thông tin notification (chỉ bản thân)
- `POST /notifications` - Tạo notification mới
- `PUT /notifications/:id` - Cập nhật notification (chỉ bản thân)
- `DELETE /notifications/:id` - Xóa notification (chỉ bản thân)
- `GET /users/:userId/notifications` - Lấy notifications theo user (chỉ bản thân)
- `GET /users/:userId/notifications/unread-count` - Lấy số notifications chưa đọc
- `PUT /notifications/:id/read` - Đánh dấu notification đã đọc
- `PUT /users/:userId/notifications/read-all` - Đánh dấu tất cả notifications đã đọc

### Logs (Public nhưng cần token để tạo)
- `GET /logs` - Lấy danh sách logs
- `GET /logs/:id` - Lấy thông tin log
- `POST /logs` - Tạo log mới (cần token)
- `PUT /logs/:id` - Cập nhật log (cần token)
- `DELETE /logs/:id` - Xóa log (cần token)

### Roles (Admin only)
- `GET /roles` - Lấy danh sách roles (cần token)
- `GET /roles/:id` - Lấy thông tin role (cần token)
- `POST /roles` - Tạo role mới (cần token)
- `PUT /roles/:id` - Cập nhật role (cần token)
- `DELETE /roles/:id` - Xóa role (cần token)

### Role Users (Admin only)
- `GET /role-users` - Lấy danh sách role users (cần token)
- `GET /role-users/:id` - Lấy thông tin role user (cần token)
- `POST /role-users` - Tạo role user mới (cần token)
- `PUT /role-users/:id` - Cập nhật role user (cần token)
- `DELETE /role-users/:id` - Xóa role user (cần token)

## 🌐 Public APIs (Không cần đăng nhập)

### Tournaments (Public viewing)
- `GET /tournaments` - Lấy danh sách tournaments
- `GET /tournaments/:id` - Lấy thông tin tournament
- `POST /tournaments` - Tạo tournament mới (cần token)
- `PUT /tournaments/:id` - Cập nhật tournament (cần token)
- `DELETE /tournaments/:id` - Xóa tournament (cần token)

### Matches (Public viewing)
- `GET /matches` - Lấy danh sách matches
- `GET /matches/:id` - Lấy thông tin match
- `POST /matches` - Tạo match mới (cần token)
- `PUT /matches/:id` - Cập nhật match (cần token)
- `DELETE /matches/:id` - Xóa match (cần token)
- `GET /tournaments/:tournamentId/matches` - Lấy matches theo tournament
- `GET /rounds/:roundId/matches` - Lấy matches theo round

### Rounds (Public viewing)
- `GET /rounds` - Lấy danh sách rounds
- `GET /rounds/:id` - Lấy thông tin round
- `POST /rounds` - Tạo round mới (cần token)
- `PUT /rounds/:id` - Cập nhật round (cần token)
- `DELETE /rounds/:id` - Xóa round (cần token)
- `GET /tournaments/:tournamentId/rounds` - Lấy rounds theo tournament

### Groups (Public viewing)
- `GET /groups` - Lấy danh sách groups
- `GET /groups/:id` - Lấy thông tin group
- `POST /groups` - Tạo group mới (cần token)
- `PUT /groups/:id` - Cập nhật group (cần token)
- `DELETE /groups/:id` - Xóa group (cần token)
- `GET /tournaments/:tournamentId/groups` - Lấy groups theo tournament

### Contracts (Public viewing)
- `GET /contracts` - Lấy danh sách contracts
- `GET /contracts/:id` - Lấy thông tin contract
- `POST /contracts` - Tạo contract mới (cần token)
- `PUT /contracts/:id` - Cập nhật contract (cần token)
- `DELETE /contracts/:id` - Xóa contract (cần token)
- `POST /contracts/:id/subtract` - Trừ lương (cần token)

### Tournament Types (Public viewing)
- `GET /tournament-types` - Lấy danh sách tournament types
- `GET /tournament-types/:id` - Lấy thông tin tournament type
- `POST /tournament-types` - Tạo tournament type mới (cần token)
- `PUT /tournament-types/:id` - Cập nhật tournament type (cần token)
- `DELETE /tournament-types/:id` - Xóa tournament type (cần token)

## Phân quyền theo Role

### Admin User
- **Quyền**: Truy cập tất cả dữ liệu
- **Có thể**: Xem, tạo, sửa, xóa tất cả dữ liệu
- **Protected APIs**: Tất cả
- **Public APIs**: Tất cả

### Regular User
- **Quyền**: Chỉ truy cập dữ liệu liên quan
- **Users**: Chỉ thông tin của chính mình
- **Teams**: Chỉ teams là thành viên
- **Registrations**: Chỉ registrations của teams thành viên
- **Notifications**: Chỉ notifications của chính mình
- **Protected APIs**: Có giới hạn
- **Public APIs**: Tất cả

### Guest User (Không đăng nhập)
- **Quyền**: Chỉ xem dữ liệu public
- **Public APIs**: Tất cả GET requests
- **Protected APIs**: Không thể truy cập

## Middleware Sử dụng

### Protected APIs
```javascript
// Cần authentication
router.get('/users', authMiddleware, filterDataByUser('user'), userController.getAllUsers);
router.get('/teams', authMiddleware, filterDataByUser('team'), teamController.getAllTeams);
router.get('/notifications', authMiddleware, filterDataByUser('notification'), notificationController.getAllNotifications);
```

### Public APIs
```javascript
// Không cần authentication
router.get('/tournaments', tournamentController.getAllTournaments);
router.get('/matches', matchController.getAllMatches);
router.get('/rounds', roundController.getAllRounds);
```

## Error Responses

### 401 Unauthorized (Chưa đăng nhập)
```json
{
  "success": false,
  "message": "Access token không được cung cấp"
}
```

### 403 Forbidden (Không có quyền)
```json
{
  "success": false,
  "message": "Không có quyền truy cập thông tin này"
}
```

## Testing

### Test Protected APIs
```bash
# Đăng nhập để lấy token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Sử dụng token để truy cập protected API
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer <token>"
```

### Test Public APIs
```bash
# Không cần token
curl -X GET http://localhost:8000/api/tournaments
curl -X GET http://localhost:8000/api/matches
```

## Security Considerations

1. **Public APIs**: Chỉ cho phép GET requests, không cho phép thay đổi dữ liệu
2. **Protected APIs**: Yêu cầu JWT token và kiểm tra quyền truy cập
3. **Data Filtering**: Lọc dữ liệu theo user đăng nhập
4. **Role-based Access**: Phân quyền dựa trên vai trò
5. **Error Handling**: Xử lý lỗi an toàn không tiết lộ thông tin nhạy cảm 