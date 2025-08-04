# Axios Client Configuration

## Tổng quan

File `axiosClient.js` cung cấp cấu hình axios chung cho toàn bộ ứng dụng frontend.

## Cấu hình

### Base Configuration
- **baseURL**: `http://localhost:8000/api`
- **Content-Type**: `application/json`
- **Timeout**: 10 giây

### Request Interceptor
Tự động thêm `Authorization` header với Bearer token từ localStorage:
```javascript
Authorization: Bearer <token>
```

### Response Interceptor
Xử lý lỗi chung:
- **401 Unauthorized**: Tự động logout và redirect về `/login`
- **403 Forbidden**: Log lỗi access denied
- **500 Server Error**: Log lỗi server

## Cách sử dụng

### 1. Import axiosClient
```javascript
import axiosClient from '../services/axiosClient';
```

### 2. Gọi API cơ bản
```javascript
// GET request
const response = await axiosClient.get('/tournaments');

// POST request
const response = await axiosClient.post('/tournaments', data);

// PUT request
const response = await axiosClient.put('/tournaments/1', data);

// DELETE request
const response = await axiosClient.delete('/tournaments/1');
```

### 3. Gọi API với query parameters
```javascript
const response = await axiosClient.get('/tournaments', {
  params: {
    status: 'active',
    limit: 10,
    page: 1
  }
});
```

### 4. Gọi API với custom headers
```javascript
const response = await axiosClient.get('/tournaments', {
  headers: {
    'Custom-Header': 'value'
  }
});
```

## Ví dụ thực tế

Xem file `features/tournaments/pages/HomePage.jsx` để tham khảo cách sử dụng trong component React.

## Lưu ý

1. **Token Management**: Token sẽ tự động được thêm vào header nếu có trong localStorage
2. **Error Handling**: Các lỗi HTTP sẽ được xử lý tự động
3. **Loading States**: Nên sử dụng loading state khi gọi API
4. **Data Processing**: Luôn kiểm tra cấu trúc dữ liệu trả về từ API

## Cấu trúc thư mục đề xuất

```
src/
├── services/
│   ├── axiosClient.js
│   └── README.md
├── features/
│   ├── tournaments/
│   │   ├── api/
│   │   │   └── tournamentApi.js
│   │   └── pages/
│   │       └── HomePage.jsx
│   ├── users/
│   │   ├── api/
│   │   │   └── userApi.js
│   │   └── pages/
│   └── ...
└── ...
``` 