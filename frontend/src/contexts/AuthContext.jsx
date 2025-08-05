import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../features/auth/authAPI';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Gọi API để lấy thông tin user hiện tại với roles
          const response = await getCurrentUser();
          const userData = response.data.user;
          
          setUser(userData);
          console.log('User data from API:', userData);
          console.log('User roles:', userData.Roles);
          
          // Kiểm tra role admin
          if (userData.Roles && userData.Roles.some(role => role.name === 'admin')) {
            console.log('User is admin');
            setIsAdmin(true);
          } else {
            console.log('User is not admin');
            setIsAdmin(false);
          }
          
          // Kiểm tra role coach
          if (userData.Roles && userData.Roles.some(role => role.name === 'coach')) {
            console.log('User is coach');
            setIsCoach(true);
          } else {
            console.log('User is not coach');
            setIsCoach(false);
          }
          
          // Cập nhật localStorage với thông tin mới
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Error fetching current user:', error);
          // Nếu token không hợp lệ, xóa khỏi localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    
    // Kiểm tra role admin
    if (userData.Roles && userData.Roles.some(role => role.name === 'admin')) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    
    // Kiểm tra role coach
    if (userData.Roles && userData.Roles.some(role => role.name === 'coach')) {
      setIsCoach(true);
    } else {
      setIsCoach(false);
    }
    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setIsCoach(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // THÊM HÀM NÀY ĐỂ CẬP NHẬT USER STATE VÀ LOCALSTORAGE
  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData };
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const value = {
    user,
    isAdmin,
    isCoach,
    loading,
    login,
    logout,
    updateUser // Đưa hàm mới vào context value
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};