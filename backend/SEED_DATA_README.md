# Hướng dẫn sử dụng Seed Data

## Tổng quan
File seed data được tạo để populate database với dữ liệu mẫu để test API và frontend.

## Cấu trúc dữ liệu

### 1. Users (5 users)
- **Admin**: admin@example.com / 123456
- **Users**: user1@example.com, user2@example.com, user3@example.com, user4@example.com / 123456

### 2. Roles (3 roles)
- admin: Administrator
- user: Regular user  
- coach: Coach

### 3. Tournament Types (5 types)
- Bóng đá 11 người
- Bóng đá 7 người
- Bóng đá 5 người (Futsal)
- Bóng rổ
- Cầu lông

### 4. Teams (6 teams)
- Đội bóng ĐH Khoa học Tự nhiên (HUS)
- Đội bóng ĐH Bách khoa (HCMUT)
- Đội bóng ĐH Kinh tế (UEH)
- Đội bóng ĐH Y Dược (UMP)
- Đội bóng ĐH Sư phạm (HCMUE)
- Đội bóng ĐH Ngoại thương (FTU)

### 5. Tournaments (3 tournaments)
- **Giải đấu mùa xuân 2024**: Bóng đá 11 người, 16 đội
- **Giải đấu hè 2024**: Bóng đá 7 người, 8 đội
- **Giải đấu futsal 2024**: Bóng đá 5 người, 12 đội

### 6. Rounds (7 rounds)
- Vòng bảng, Tứ kết, Bán kết, Chung kết cho tournament 1
- Vòng bảng, Bán kết, Chung kết cho tournament 2

### 7. Registrations (6 registrations)
- 6 đội đã đăng ký tham gia tournament 1
- Có thống kê điểm, thắng, hòa, thua, bàn thắng, bàn thua

### 8. Matches (9 matches)
- 4 trận vòng bảng
- 2 trận tứ kết
- 2 trận bán kết
- 1 trận chung kết

### 9. Match_Teams (12 relationships)
- Liên kết giữa matches và teams

### 10. Groups (2 groups)
- Bảng A và Bảng B cho tournament 1

### 11. Notifications (3 notifications)
- Thông báo trận đấu mới
- Thông báo đăng ký thành công

### 12. Logs (2 logs)
- Log tạo tournament
- Log tạo match

## Cách sử dụng

### 1. Chạy migration trước
```bash
cd backend
npm run migrate
```

### 2. Chạy seed data
```bash
cd backend
npm run seed
```

### 3. Hoặc chạy trực tiếp
```bash
cd backend
node src/seeders/seed-database.js
```

## Kết quả sau khi seed

### Thông tin đăng nhập test:
- **Email**: admin@example.com
- **Password**: 123456

### API endpoints để test:

#### Users
- GET `/api/users` - Lấy tất cả users
- GET `/api/users/1` - Lấy user theo ID
- POST `/api/users` - Tạo user mới

#### Tournaments
- GET `/api/tournaments` - Lấy tất cả tournaments
- GET `/api/tournaments/1` - Lấy tournament detail với matches
- GET `/api/tournaments/1/matches` - Lấy matches của tournament
- POST `/api/tournaments` - Tạo tournament mới

#### Teams
- GET `/api/teams` - Lấy tất cả teams
- GET `/api/teams/1` - Lấy team theo ID
- POST `/api/teams` - Tạo team mới

#### Matches
- GET `/api/matches` - Lấy tất cả matches
- GET `/api/matches/1` - Lấy match theo ID
- POST `/api/matches` - Tạo match mới

#### Registrations
- GET `/api/registrations` - Lấy tất cả registrations
- GET `/api/tournaments/1/registrations` - Lấy registrations của tournament

## Dữ liệu mẫu chi tiết

### Tournament 1 - Giải đấu mùa xuân 2024
- **ID**: 1
- **Loại**: Bóng đá 11 người
- **Thời gian**: 01/03/2024 - 30/04/2024
- **Địa điểm**: Sân vận động trường ĐH Khoa học Tự nhiên
- **Giải thưởng**: 50,000,000 VND
- **Số đội tối đa**: 16
- **Trạng thái**: upcoming

### Teams tham gia tournament 1:
1. **ĐH KHTN**: 9 điểm (3W-0D-0L, 8-2)
2. **ĐH Bách khoa**: 6 điểm (2W-0D-1L, 5-3)
3. **ĐH Kinh tế**: 4 điểm (1W-1D-1L, 4-4)
4. **ĐH Y Dược**: 3 điểm (1W-0D-2L, 3-5)
5. **ĐH Sư phạm**: 1 điểm (0W-1D-2L, 2-6)
6. **ĐH Ngoại thương**: 0 điểm (0W-0D-3L, 1-7)

### Matches trong tournament 1:
1. **Trận 1**: ĐH KHTN vs ĐH Bách khoa (15/03/2024, Sân A)
2. **Trận 2**: ĐH Kinh tế vs ĐH Y Dược (16/03/2024, Sân B)
3. **Trận 3**: ĐH KHTN vs ĐH Kinh tế (17/03/2024, Sân A)
4. **Trận 4**: ĐH Bách khoa vs ĐH Y Dược (18/03/2024, Sân B)
5. **Tứ kết 1**: ĐH KHTN vs ĐH Kinh tế (01/04/2024, Sân A)
6. **Tứ kết 2**: ĐH Bách khoa vs ĐH Y Dược (02/04/2024, Sân B)
7. **Bán kết 1**: (15/04/2024, Sân A)
8. **Bán kết 2**: (16/04/2024, Sân B)
9. **Chung kết**: (30/04/2024, Sân chính)

## Lưu ý

1. **Password**: Tất cả users có password là `123456`
2. **Relationships**: Dữ liệu đã được thiết lập đúng relationships
3. **Timestamps**: Tất cả records có createdAt và updatedAt
4. **Status**: Tournament status là 'upcoming', match status là 'scheduled'
5. **Approval**: Tất cả registrations có approval_status là 'approved'

## Troubleshooting

### Lỗi thường gặp:
1. **Database chưa được tạo**: Chạy migration trước
2. **Duplicate key error**: Seed script có ignoreDuplicates
3. **Foreign key constraint**: Đảm bảo thứ tự seed đúng

### Reset database:
```bash
# Xóa và tạo lại database
npx sequelize-cli db:drop
npx sequelize-cli db:create
npm run migrate
npm run seed
``` 