# Tính năng Lịch Thi Đấu - Tournament Matches

## Tổng quan

Tính năng này cho phép hiển thị lịch thi đấu chi tiết cho từng giải đấu, bao gồm:
- Hiển thị thông tin chi tiết giải đấu
- Lịch các trận đấu với thông tin đầy đủ
- Bộ lọc trận đấu theo trạng thái
- Thống kê trận đấu

## Các trang và component

### 1. TournamentDetailPage (`/tournaments/:id`)
- Hiển thị thông tin chi tiết giải đấu
- Lịch thi đấu rút gọn (3 trận đầu tiên)
- Link đến trang lịch thi đấu chi tiết

### 2. TournamentMatchesPage (`/tournaments/:tournamentId/matches`)
- Trang lịch thi đấu chi tiết
- Bộ lọc trận đấu theo trạng thái
- Thống kê trận đấu
- Hiển thị đầy đủ lịch thi đấu

### 3. MatchSchedule Component
- Component hiển thị danh sách trận đấu
- Hỗ trợ loading state
- Hiển thị thông tin trận đấu đẹp mắt
- Icons cho từng trạng thái

### 4. MatchStats Component
- Hiển thị thống kê trận đấu
- Phần trăm theo trạng thái
- Giao diện responsive

## API Endpoints

### Lấy thông tin tournament
```
GET /tournaments/:id
```

### Lấy danh sách matches của tournament
```
GET /tournaments/:tournamentId/matches
```

## Cách sử dụng

### 1. Từ trang danh sách giải đấu
1. Click vào một giải đấu
2. Chuyển đến trang chi tiết giải đấu
3. Xem lịch thi đấu rút gọn
4. Click "Xem chi tiết" để xem đầy đủ

### 2. Từ trang chi tiết giải đấu
1. Xem thông tin tổng quan
2. Click "Xem chi tiết" trong phần lịch thi đấu
3. Chuyển đến trang lịch thi đấu chi tiết
4. Sử dụng bộ lọc để xem trận đấu theo trạng thái

## Tính năng

### Bộ lọc trận đấu
- **Tất cả**: Hiển thị tất cả trận đấu
- **Sắp diễn ra**: Chỉ hiển thị trận đã lên lịch
- **Đang diễn ra**: Chỉ hiển thị trận đang diễn ra
- **Đã hoàn thành**: Chỉ hiển thị trận đã kết thúc

### Thống kê
- Tổng số trận đấu
- Số trận đã hoàn thành
- Số trận đang diễn ra
- Số trận sắp diễn ra
- Số trận đã hủy
- Phần trăm theo từng trạng thái

### Thông tin trận đấu
- Tên hai đội thi đấu
- Thời gian và địa điểm
- Trạng thái trận đấu
- Kết quả (nếu có)
- Vòng đấu
- Ghi chú bổ sung

## Responsive Design

- Mobile: Hiển thị 1 cột
- Tablet: Hiển thị 2-3 cột
- Desktop: Hiển thị đầy đủ layout

## Error Handling

- Loading states cho tất cả API calls
- Error states khi không tìm thấy tournament
- Empty states khi không có trận đấu
- Graceful degradation khi dữ liệu không đầy đủ

## Performance

- Lazy loading cho danh sách trận đấu
- Pagination cho danh sách lớn (có thể mở rộng)
- Optimized re-renders với React hooks
- Efficient filtering và sorting 