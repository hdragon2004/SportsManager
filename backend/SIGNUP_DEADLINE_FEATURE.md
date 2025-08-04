# Tính năng Deadline Đăng ký Giải đấu

## Tổng quan
Tính năng `signup_deadline` cho phép thiết lập thời hạn đăng ký tham gia giải đấu. Sau khi quá hạn này, người dùng không thể đăng ký tham gia giải đấu nữa.

## Thuộc tính mới

### Bảng Tournaments
- **signup_deadline**: `DATETIME` - Thời hạn cuối cùng để đăng ký tham gia giải đấu
  - Có thể `NULL` (không có hạn chót)
  - Định dạng: `YYYY-MM-DD HH:mm:ss`

## Logic xử lý

### 1. Kiểm tra khi tạo Registration
Khi người dùng đăng ký tham gia giải đấu, hệ thống sẽ kiểm tra:

```javascript
// Kiểm tra nếu có deadline và đã quá hạn
if (tournament.signup_deadline && new Date() > new Date(tournament.signup_deadline)) {
  throw new Error(`Đã quá hạn đăng ký tham gia giải đấu. Hạn chót đăng ký là: ${new Date(tournament.signup_deadline).toLocaleDateString('vi-VN')}`);
}
```

### 2. API Response
Nếu quá hạn đăng ký, API sẽ trả về:

```json
{
  "success": false,
  "message": "Đã quá hạn đăng ký tham gia giải đấu. Hạn chót đăng ký là: 15/02/2024"
}
```

## Cập nhật Database

### Migration
Đã thêm cột `signup_deadline` vào bảng `Tournaments`:

```sql
ALTER TABLE Tournaments ADD COLUMN signup_deadline DATETIME NULL COMMENT 'Deadline for tournament registration';
```

### Model
Cập nhật model `Tournament` để bao gồm thuộc tính mới:

```javascript
signup_deadline: DataTypes.DATE
```

## Seed Data
Đã cập nhật seed data với các deadline hợp lý:

- Giải bóng đá sinh viên TP.HCM 2024: 15/02/2024
- Giải bóng đá 7 người mùa hè 2024: 15/05/2024
- Giải futsal sinh viên 2024: 15/04/2024
- Giải chạy bộ TP.HCM 2024: 15/03/2024
- Giải chạy bộ sinh viên 2024: 15/04/2024
- Giải cầu lông sinh viên TP.HCM 2024: 01/04/2024
- Giải cầu lông mùa xuân 2024: 01/03/2024

## API Endpoints

### POST /api/registrations
Khi tạo registration mới, hệ thống sẽ tự động kiểm tra deadline.

**Request Body:**
```json
{
  "Tournament_ID": 1,
  "Team_ID": 1
}
```

**Response khi quá hạn:**
```json
{
  "success": false,
  "message": "Đã quá hạn đăng ký tham gia giải đấu. Hạn chót đăng ký là: 15/02/2024"
}
```

## Frontend Integration

### Hiển thị Deadline
Frontend nên hiển thị deadline đăng ký trong trang chi tiết giải đấu:

```javascript
// Ví dụ hiển thị
const deadline = tournament.signup_deadline ? 
  new Date(tournament.signup_deadline).toLocaleDateString('vi-VN') : 
  'Không có hạn chót';

// Kiểm tra trước khi cho phép đăng ký
const canRegister = !tournament.signup_deadline || new Date() <= new Date(tournament.signup_deadline);
```

### Disable Button khi quá hạn
```javascript
const isDeadlinePassed = tournament.signup_deadline && new Date() > new Date(tournament.signup_deadline);

<button 
  disabled={isDeadlinePassed}
  onClick={handleRegister}
>
  {isDeadlinePassed ? 'Đã quá hạn đăng ký' : 'Đăng ký tham gia'}
</button>
```

## Testing

### Test Cases
1. **Đăng ký trước deadline**: Thành công
2. **Đăng ký sau deadline**: Thất bại với thông báo lỗi
3. **Giải đấu không có deadline**: Đăng ký bình thường
4. **Deadline null**: Đăng ký bình thường

### Test Data
```javascript
// Test case 1: Đăng ký trước deadline
const tournament = {
  id: 1,
  signup_deadline: '2024-12-31T23:59:59.000Z'
};
// Ngày hiện tại: 2024-01-01 -> Có thể đăng ký

// Test case 2: Đăng ký sau deadline
const tournament = {
  id: 1,
  signup_deadline: '2024-01-01T00:00:00.000Z'
};
// Ngày hiện tại: 2024-01-02 -> Không thể đăng ký
```

## Migration Guide

### Để áp dụng tính năng này:

1. **Chạy migration:**
```bash
cd backend
npx sequelize-cli db:migrate
```

2. **Chạy seed data:**
```bash
npx sequelize-cli db:seed:all
```

3. **Cập nhật frontend** để hiển thị và xử lý deadline

4. **Test** các trường hợp đăng ký trước/sau deadline

## Lưu ý
- Deadline được lưu theo múi giờ UTC
- Hiển thị deadline theo múi giờ địa phương
- Có thể set deadline = null để không có hạn chót
- Deadline nên được set trước ngày bắt đầu giải đấu 