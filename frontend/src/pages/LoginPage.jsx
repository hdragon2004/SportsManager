import React from 'react';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../features/auth/LoginForm';

const LoginPage = () => {
  return (
    <AuthLayout 
      title="Đăng nhập" 
      subtitle="Đăng nhập vào hệ thống quản lý thi đấu thể thao"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage; 