# Hệ thống Phân quyền (Authorization System)

## Tổng quan
Hệ thống phân quyền được thiết kế để đảm bảo rằng users chỉ có thể truy cập dữ liệu liên quan đến họ, trong khi admin có thể truy cập tất cả dữ liệu.

## Các loại User

### 1. Admin User
- **Quyền**: Truy cập tất cả dữ liệu trong hệ thống
- **Role**: `admin`
- **Có thể**: Xem, tạo, sửa, xóa tất cả dữ liệu

### 2. Regular User
- **Quyền**: Chỉ truy cập dữ liệu liên quan đến họ
- **Role**: `user` (mặc định)
- **Có thể**: Xem, tạo, sửa, xóa dữ liệu của chính mình

## Phân quyền theo Resource

### 👥 Users
- **Admin**: Xem tất cả users
- **User**: Chỉ xem thông tin của chính mình

### 👥 Teams
- **Admin**: Xem tất cả teams
- **User**: Chỉ xem teams mà họ là thành viên

### 🏆 Tournaments
- **Admin**: Xem tất cả tournaments
- **User**: Chỉ xem tournaments mà họ đăng ký tham gia

### ⚽ Matches
- **Admin**: Xem tất cả matches
- **User**: Chỉ xem matches của tournaments mà họ tham gia

### 📝 Registrations
- **Admin**: Xem tất cả registrations
- **User**: Chỉ xem registrations của teams mà họ là thành viên

### 📋 Notifications
- **Admin**: Xem tất cả notifications
- **User**: Chỉ xem notifications của chính mình

## Middleware Phân quyền

### 1. `checkDataAccess(resourceType)`
Kiểm tra quyền truy cập dữ liệu cụ thể:

```javascript
// Kiểm tra quyền truy cập user data
router.get('/users/:id', authMiddleware, checkDataAccess('user'), userController.getUser);

// Kiểm tra quyền truy cập team data
router.get('/teams/:id', authMiddleware, checkDataAccess('team'), teamController.getTeam);

// Kiểm tra quyền truy cập tournament data
router.get('/tournaments/:id', authMiddleware, checkDataAccess('tournament'), tournamentController.getTournament);
```

### 2. `filterDataByUser(resourceType)`
Lọc dữ liệu theo user đăng nhập:

```javascript
// Lọc users theo quyền
router.get('/users', authMiddleware, filterDataByUser('user'), userController.getAllUsers);

// Lọc teams theo quyền
router.get('/teams', authMiddleware, filterDataByUser('team'), teamController.getAllTeams);

// Lọc tournaments theo quyền
router.get('/tournaments', authMiddleware, filterDataByUser('tournament'), tournamentController.getAllTournaments);
```

## Logic Phân quyền

### User Access Control
```javascript
// User chỉ có thể xem/sửa thông tin của chính mình
if (targetUserId && parseInt(targetUserId) !== userId) {
  return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông tin người dùng khác'));
}
```

### Team Access Control
```javascript
// Kiểm tra xem user có phải là thành viên của team không
const teamMember = await models.Team_Member.findOne({
  where: {
    Team_ID: teamId,
    User_ID: userId
  }
});

if (!teamMember) {
  return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông tin đội này'));
}
```

### Tournament Access Control
```javascript
// Kiểm tra xem user có đăng ký tham gia tournament này không
const registration = await models.Registration.findOne({
  where: {
    Tournament_ID: tournamentId,
    User_ID: userId
  },
  include: [{
    model: models.Team,
    include: [{
      model: models.Team_Member,
      where: { User_ID: userId }
    }]
  }]
});

if (!registration) {
  return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông tin giải đấu này'));
}
```

### Match Access Control
```javascript
// Kiểm tra xem match có thuộc tournament mà user tham gia không
const match = await models.Match.findByPk(matchId, {
  include: [{
    model: models.Tournament,
    include: [{
      model: models.Registration,
      include: [{
        model: models.Team,
        include: [{
          model: models.Team_Member,
          where: { User_ID: userId }
        }]
      }]
    }]
  }]
});

if (!match || !match.Tournament.Registrations.length) {
  return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông tin trận đấu này'));
}
```

### Notification Access Control
```javascript
// Kiểm tra xem notification có thuộc về user không
const notification = await models.Notification.findByPk(notificationId, {
  where: { User_ID: userId }
});

if (!notification) {
  return next(new ApiError(StatusCodes.FORBIDDEN, 'Không có quyền truy cập thông báo này'));
}
```

## Data Filtering trong Controllers

### User Controller
```javascript
export async function getAllUsers(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì lấy tất cả users
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const users = await getUsers();
      res.status(StatusCodes.OK).json({ success: true, data: users });
    } else {
      // User thường chỉ có thể xem thông tin của chính mình
      const user = await getUserById(req.user.userId);
      res.status(StatusCodes.OK).json({ success: true, data: [user] });
    }
  } catch (error) {
    // Error handling
  }
}
```

### Team Controller
```javascript
export async function getAllTeams(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì lấy tất cả teams
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const teams = await getAllTeamsService();
      res.status(StatusCodes.OK).json({ success: true, data: teams });
    } else {
      // User thường chỉ có thể xem teams mà họ là thành viên
      const userTeams = await models.Team.findAll({
        include: [{
          model: models.Team_Member,
          where: { User_ID: req.user.userId },
          include: [{
            model: models.User,
            attributes: ['id', 'name', 'email']
          }]
        }]
      });
      res.status(StatusCodes.OK).json({ success: true, data: userTeams });
    }
  } catch (error) {
    // Error handling
  }
}
```

## Error Responses

### 403 Forbidden
```json
{
  "success": false,
  "message": "Không có quyền truy cập thông tin này"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Không tìm thấy thông tin người dùng"
}
```

## Testing

Sử dụng file `test-authorization.js` để test hệ thống phân quyền:

```bash
cd backend
node test-authorization.js
```

## Security Features

1. **Role-based Access Control (RBAC)**: Phân quyền dựa trên vai trò
2. **Data Isolation**: Cô lập dữ liệu theo user
3. **Middleware Protection**: Bảo vệ ở tầng middleware
4. **Database-level Filtering**: Lọc dữ liệu ở tầng database
5. **Error Handling**: Xử lý lỗi phân quyền an toàn

## Best Practices

1. **Always check permissions**: Luôn kiểm tra quyền trước khi truy cập dữ liệu
2. **Use middleware**: Sử dụng middleware để tái sử dụng logic phân quyền
3. **Filter at database level**: Lọc dữ liệu ở tầng database thay vì application
4. **Log access attempts**: Ghi log các lần truy cập để audit
5. **Regular testing**: Test thường xuyên để đảm bảo phân quyền hoạt động đúng 