import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUnreadCount } from '../features/notifications/notificationAPI';

const Header = ({ className = '' }) => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/user/profile');
    setIsUserMenuOpen(false);
  };

  const handleDashboardClick = () => {
    navigate('/admin/dashboard');
    setIsUserMenuOpen(false);
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
  };

  // Lấy số thông báo chưa đọc
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user && user.id) {
        try {
          const response = await getUnreadCount(user.id);
          if (response.data.success) {
            setUnreadCount(response.data.data.count || 0);
          }
        } catch (error) {
          console.error('Error fetching unread count:', error);
          setUnreadCount(0);
        }
      }
    };

    fetchUnreadCount();
    
    // Cập nhật mỗi 30 giây
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  // Hàm kiểm tra trang hiện tại để xác định button nào đang active
  const isActivePage = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`bg-gray-900 shadow-lg border-b border-gray-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section - Left Side */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
              <div className="w-8 h-8 bg-[#30ddff] rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold tracking-wider">MOLEAGUE.VN</h1>
                <span className="text-xs text-gray-400 font-semibold tracking-wider uppercase">SPORTS MANAGEMENT</span>
              </div>
            </Link>
          </div>

          {/* Right Side - Navigation and User Actions */}
          <div className="flex items-center space-x-8">
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`text-white font-semibold uppercase tracking-wide pb-1 transition-colors ${
                  isActivePage('/') 
                    ? 'border-b-2 border-[#30ddff]' 
                    : 'hover:text-[#30ddff]'
                }`}
              >
                Trang chủ
              </Link>
              <Link 
                to="/tournaments" 
                className={`text-white uppercase tracking-wide pb-1 transition-colors ${
                  isActivePage('/tournaments') 
                    ? 'border-b-2 border-[#30ddff]' 
                    : 'hover:text-[#30ddff]'
                }`}
              >
                Giải đấu
              </Link>
              <Link 
                to="/teams" 
                className={`text-white uppercase tracking-wide pb-1 transition-colors ${
                  isActivePage('/teams') 
                    ? 'border-b-2 border-[#30ddff]' 
                    : 'hover:text-[#30ddff]'
                }`}
              >
                Đội thi đấu
              </Link>
              <Link 
                to="/schedule" 
                className={`text-white uppercase tracking-wide pb-1 transition-colors ${
                  isActivePage('/schedule') 
                    ? 'border-b-2 border-[#30ddff]' 
                    : 'hover:text-[#30ddff]'
                }`}
              >
                Lịch thi đấu
              </Link>
              <Link 
                to="/blog" 
                className={`text-white uppercase tracking-wide pb-1 transition-colors ${
                  isActivePage('/blog') 
                    ? 'border-b-2 border-[#30ddff]' 
                    : 'hover:text-[#30ddff]'
                }`}
              >
                Giới thiệu
              </Link>
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-white hover:text-[#30ddff] transition-colors"
                    >
                      <div className="w-8 h-8 bg-[#30ddff] rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <span className="hidden md:block text-sm font-medium">
                        {user.name || 'User'}
                      </span>
                      <svg 
                        className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-700">
                        <button
                          onClick={handleProfileClick}
                          className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-[#30ddff] flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>Hồ sơ người dùng</span>
                        </button>
                        {isAdmin && (
                          <button
                            onClick={handleDashboardClick}
                            className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-[#30ddff] flex items-center space-x-2"
                          >
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            <span>Dashboard</span>
                          </button>
                        )}
                        <div className="border-t border-gray-700 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900 hover:text-red-300 flex items-center space-x-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Notification Bell - Moved to end */}
                  <div className="relative">
                    <button 
                      onClick={handleNotificationClick}
                      className="text-[#30ddff] hover:text-[#00b8d4] transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-white hover:text-[#30ddff] transition-colors font-medium">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="bg-[#30ddff] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#00b8d4] transition-colors">
                    Đăng ký
                  </Link>
                  {/* Notification Bell */}
                  <div className="relative">
                    <button 
                      onClick={handleNotificationClick}
                      className="text-[#30ddff] hover:text-[#00b8d4] transition-colors"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              )}
              <button className="md:hidden text-white hover:text-[#30ddff]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;