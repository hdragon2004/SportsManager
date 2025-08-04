import React from 'react';
import AuthLayout from '../../layouts/AuthLayout';
import RegisterForm from '../../features/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <AuthLayout 
      title="Đăng ký" 
      subtitle="Tạo tài khoản mới để tham gia thi đấu"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage; 