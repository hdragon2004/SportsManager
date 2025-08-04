# API Integration Guide

## Cấu trúc thư mục

```
src/
├── services/
│   └── axios.js          # Cấu hình Axios instance
├── features/
│   ├── auth/
│   │   └── authAPI.js    # Authentication APIs
│   ├── users/
│   │   └── userAPI.js    # User management APIs
│   ├── tournaments/
│   │   └── tournamentAPI.js  # Tournament APIs
│   ├── teams/
│   │   └── teamAPI.js    # Team management APIs
│   ├── matches/
│   │   └── matchAPI.js   # Match APIs
│   ├── registrations/
│   │   └── registrationAPI.js  # Registration APIs
│   ├── notifications/
│   │   └── notificationAPI.js  # Notification APIs
│   ├── statistics/
│   │   └── statisticsAPI.js    # Statistics APIs
│   └── index.js          # Export tất cả APIs
```

## Cách sử dụng

### 1. Import API functions

```javascript
// Import từng file riêng lẻ
import { getAllUsers, createUser } from '../features/users/userAPI';

// Hoặc import tất cả từ index
import { getAllUsers, createTournament } from '../features';
```

### 2. Sử dụng trong component

```javascript
import React, { useState, useEffect } from 'react';
import { getAllUsers, createUser } from '../features/users/userAPI';

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = async (userData) => {
    try {
      const response = await createUser(userData);
      console.log('User created:', response.data);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    // JSX component
  );
};
```

## Cấu hình Axios

### Base URL
- Development: `http://localhost:8000/api`
- Production: Có thể thay đổi trong `src/services/axios.js`

### Headers mặc định
- `Content-Type: application/json`
- `Authorization: Bearer {token}` (tự động thêm từ localStorage)

### Timeout
- 10 giây (10000ms)

### Interceptors
- **Request**: Tự động thêm JWT token
- **Response**: Xử lý lỗi 401 (token hết hạn)

## Error Handling

```javascript
try {
  const response = await getAllUsers();
  // Xử lý success
} catch (error) {
  if (error.response) {
    // Server trả về lỗi
    console.error('Server error:', error.response.data);
  } else if (error.request) {
    // Không thể kết nối server
    console.error('Network error:', error.request);
  } else {
    // Lỗi khác
    console.error('Error:', error.message);
  }
}
```

## Authentication

### Login
```javascript
import { login } from '../features/auth/authAPI';

const handleLogin = async (credentials) => {
  try {
    const response = await login(credentials);
    localStorage.setItem('token', response.data.token);
    // Redirect hoặc update state
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Logout
```javascript
import { logout } from '../features/auth/authAPI';

const handleLogout = async () => {
  try {
    await logout();
    localStorage.removeItem('token');
    // Redirect về login
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

## Thêm API mới

1. Tạo file API mới trong thư mục `features/`
2. Import axiosInstance từ `../../services/axios`
3. Export các functions
4. Thêm vào `features/index.js`

```javascript
// features/newFeature/newFeatureAPI.js
import axiosInstance from '../../services/axios';

export const getNewFeature = () => axiosInstance.get('/new-feature');
export const createNewFeature = (data) => axiosInstance.post('/new-feature', data);
```

## Best Practices

1. **Error Handling**: Luôn wrap API calls trong try-catch
2. **Loading States**: Sử dụng loading state khi gọi API
3. **Fallback Data**: Cung cấp mock data khi API fails
4. **Console Logging**: Log response data để debug
5. **User Feedback**: Hiển thị thông báo lỗi cho user 