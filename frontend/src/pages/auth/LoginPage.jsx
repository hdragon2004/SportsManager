import React from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import LoginForm from '../../features/auth/LoginForm';

const LoginPage = () => {
  return (
    <AuthLayout 
      title="Đăng nhập" 
      subtitle="Đăng nhập vào tài khoản của bạn"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
