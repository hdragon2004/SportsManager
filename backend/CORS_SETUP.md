# CORS Configuration Guide

## Tổng quan

Backend đã được cấu hình CORS đầy đủ để frontend có thể truy cập API một cách an toàn.

## Cấu hình hiện tại

### HTTP API CORS
- **Origin**: Linh hoạt theo biến môi trường `ALLOWED_ORIGINS`
- **Credentials**: Hỗ trợ cookies và authentication headers
- **Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Headers**: Authorization, Content-Type, X-API-Key, etc.

### Socket.io CORS
- **Origin**: Theo biến môi trường `SOCKET_CORS_ORIGIN`
- **Credentials**: Hỗ trợ authentication
- **Methods**: GET, POST
- **Headers**: Authorization, Content-Type

## Cấu hình cho Frontend

### React.js

```javascript
// API calls với axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Thêm token vào requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Socket.io connection
import io from 'socket.io-client';

const socket = io('http://localhost:8000', {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

// Authenticate socket
socket.emit('authenticate', userId);
```

### Flutter

```dart
// HTTP requests với http package
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:8000/api';
  
  static Future<http.Response> get(String endpoint, {String? token}) async {
    return await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
  }
  
  static Future<http.Response> post(String endpoint, Map<String, dynamic> data, {String? token}) async {
    return await http.post(
      Uri.parse('$baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode(data),
    );
  }
}

// Socket.io với socket_io_client
import 'package:socket_io_client/socket_io_client.dart' as IO;

class SocketService {
  late IO.Socket socket;
  
  void connect(String userId) {
    socket = IO.io('http://localhost:8000', <String, dynamic>{
      'transports': ['websocket', 'polling'],
      'autoConnect': false,
    });
    
    socket.connect();
    socket.emit('authenticate', userId);
  }
}
```

## Environment Variables

Tạo file `.env` trong thư mục `backend/`:

```env
# Development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:8080
SOCKET_CORS_ORIGIN=http://localhost:3000

# Production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
SOCKET_CORS_ORIGIN=https://yourdomain.com
```

## Testing CORS

### Test với cURL

```bash
# Test preflight request
curl -X OPTIONS http://localhost:8000/api/users \
  -H "Origin: http://localhost:8000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v

# Test actual request
curl -X GET http://localhost:8000/api/users \
  -H "Origin: http://localhost:8000" \
  -H "Authorization: Bearer your-token" \
  -v
```

### Test với Browser Console

```javascript
// Test API call
fetch('http://localhost:8000/api/users', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));

// Test Socket.io
const socket = io('http://localhost:8000', {
  withCredentials: true
});
socket.emit('authenticate', 'user-id');
```

## Troubleshooting

### Lỗi thường gặp

1. **CORS Error**: Kiểm tra `ALLOWED_ORIGINS` có bao gồm frontend URL
2. **Credentials Error**: Đảm bảo `withCredentials: true` ở frontend
3. **Socket Connection Error**: Kiểm tra `SOCKET_CORS_ORIGIN`
4. **Authorization Error**: Đảm bảo token được gửi đúng format

### Debug Steps

1. Kiểm tra Network tab trong DevTools
2. Xem CORS headers trong response
3. Kiểm tra console logs của backend
4. Verify environment variables

## Security Considerations

- **Development**: Có thể sử dụng `*` cho origin
- **Production**: Chỉ cho phép specific domains
- **Credentials**: Luôn sử dụng `withCredentials: true` khi cần authentication
- **HTTPS**: Sử dụng HTTPS trong production 