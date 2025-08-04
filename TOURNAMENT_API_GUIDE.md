# Hướng dẫn sử dụng Tournament API

## Tổng quan
API này cung cấp các endpoint để quản lý thông tin giải đấu và các trận đấu liên quan.

## Base URL
```
http://localhost:8000/api
```

## Endpoints

### 1. Lấy tất cả tournaments
**GET** `/tournaments`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Giải đấu mùa xuân 2024",
      "description": "Giải đấu bóng đá sinh viên",
      "start_date": "2024-03-01T00:00:00.000Z",
      "end_date": "2024-04-30T00:00:00.000Z",
      "location": "Sân vận động trường ĐH",
      "max_teams": 16,
      "prize_pool": "50,000,000 VND",
      "status": "upcoming",
      "Tournament_Type": {
        "id": 1,
        "name": "Bóng đá 11 người"
      }
    }
  ]
}
```

### 2. Lấy tournament theo ID (bao gồm matches)
**GET** `/tournaments/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Giải đấu mùa xuân 2024",
    "description": "Giải đấu bóng đá sinh viên",
    "start_date": "2024-03-01T00:00:00.000Z",
    "end_date": "2024-04-30T00:00:00.000Z",
    "location": "Sân vận động trường ĐH",
    "max_teams": 16,
    "prize_pool": "50,000,000 VND",
    "status": "upcoming",
    "Tournament_Type": {
      "id": 1,
      "name": "Bóng đá 11 người"
    },
    "Registrations": [
      {
        "id": 1,
        "points": 9,
        "wins": 3,
        "draws": 0,
        "losses": 0,
        "Team": {
          "id": 1,
          "name": "Đội bóng ĐH Khoa học Tự nhiên",
          "university": "ĐH Khoa học Tự nhiên"
        }
      }
    ],
    "Matches": [
      {
        "id": 1,
        "match_date": "2024-03-15T14:00:00.000Z",
        "location": "Sân A",
        "status": "scheduled",
        "result": null,
        "Round": {
          "id": 1,
          "name": "Vòng bảng"
        },
        "Teams": [
          {
            "id": 1,
            "name": "Đội bóng ĐH Khoa học Tự nhiên",
            "university": "ĐH Khoa học Tự nhiên"
          },
          {
            "id": 2,
            "name": "Đội bóng ĐH Bách khoa",
            "university": "ĐH Bách khoa"
          }
        ]
      }
    ]
  },
  "stats": {
    "totalTeams": 8,
    "totalMatches": 12,
    "completedMatches": 6,
    "upcomingMatches": 4,
    "ongoingMatches": 2
  }
}
```

### 3. Lấy matches của tournament
**GET** `/tournaments/:id/matches`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "match_date": "2024-03-15T14:00:00.000Z",
      "location": "Sân A",
      "status": "scheduled",
      "result": null,
      "Round": {
        "id": 1,
        "name": "Vòng bảng"
      },
      "Teams": [
        {
          "id": 1,
          "name": "Đội bóng ĐH Khoa học Tự nhiên",
          "university": "ĐH Khoa học Tự nhiên"
        },
        {
          "id": 2,
          "name": "Đội bóng ĐH Bách khoa",
          "university": "ĐH Bách khoa"
        }
      ]
    }
  ]
}
```

## Cách sử dụng trong Frontend

### 1. Sử dụng axiosClient
```javascript
import axiosClient from '../services/axiosClient';

// Lấy tất cả tournaments
const getAllTournaments = async () => {
  try {
    const response = await axiosClient.get('/tournaments');
    return response.data;
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    throw error;
  }
};

// Lấy tournament theo ID
const getTournamentById = async (id) => {
  try {
    const response = await axiosClient.get(`/tournaments/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tournament:', error);
    throw error;
  }
};

// Lấy matches của tournament
const getTournamentMatches = async (id) => {
  try {
    const response = await axiosClient.get(`/tournaments/${id}/matches`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tournament matches:', error);
    throw error;
  }
};
```

### 2. Sử dụng trong React Component
```javascript
import React, { useState, useEffect } from 'react';
import { getTournamentById } from '../api/tournamentAPI';

const TournamentDetail = ({ tournamentId }) => {
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        const response = await getTournamentById(tournamentId);
        if (response.success) {
          setTournament(response.data);
          setStats(response.stats);
          setMatches(response.data.Matches || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [tournamentId]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div>
      <h1>{tournament.name}</h1>
      <p>{tournament.description}</p>
      
      {/* Hiển thị thống kê */}
      <div>
        <h2>Thống kê</h2>
        <p>Tổng đội tham gia: {stats.totalTeams}</p>
        <p>Tổng trận đấu: {stats.totalMatches}</p>
        <p>Trận đã hoàn thành: {stats.completedMatches}</p>
        <p>Trận sắp diễn ra: {stats.upcomingMatches}</p>
        <p>Trận đang diễn ra: {stats.ongoingMatches}</p>
      </div>

      {/* Hiển thị danh sách trận đấu */}
      <div>
        <h2>Danh sách trận đấu</h2>
        {matches.map(match => (
          <div key={match.id}>
            <h3>Trận {match.id}</h3>
            <p>Ngày: {new Date(match.match_date).toLocaleDateString('vi-VN')}</p>
            <p>Địa điểm: {match.location}</p>
            <p>Trạng thái: {match.status}</p>
            {match.Teams && match.Teams.length >= 2 && (
              <p>
                {match.Teams[0].name} vs {match.Teams[1].name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

## Status Codes

- **200 OK**: Thành công
- **201 Created**: Tạo mới thành công
- **400 Bad Request**: Dữ liệu không hợp lệ
- **404 Not Found**: Không tìm thấy
- **500 Internal Server Error**: Lỗi server

## Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Testing

Sử dụng file `test-tournament-api.html` để test các API endpoints:

1. Mở file trong trình duyệt
2. Nhập ID tournament cần test
3. Click các nút để test từng endpoint
4. Xem kết quả trả về

## Lưu ý

- API trả về dữ liệu bao gồm cả các relationship (Tournament_Type, Registrations, Matches, Teams)
- Thống kê được tính toán tự động dựa trên dữ liệu matches
- Tất cả dates được trả về dưới dạng ISO string
- Status của tournament và match có thể là: 'upcoming', 'active', 'completed', 'cancelled' 