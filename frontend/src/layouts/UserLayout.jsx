import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const UserLayout = ({ children }) => {
  const { user, isAdmin, isCoach, isModerator, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  // Menu cơ bản cho tất cả user
  const basicNavigation = [
    { 
      name: 'Hồ sơ', 
      href: '/user/profile', 
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' 
    },
  ];

  // Menu đặc biệt cho admin, moderator hoặc coach
  const specialNavigation = [   
    { 
        name: 'Thành viên', 
        href: '/user/my-member-teams', 
        icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' 
      },
    { 
      name: 'Đội của tôi', 
      href: '/user/my-teams', 
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' 
    },
    { 
      name: 'Lịch sử', 
      href: '/user/history', 
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' 
    },
    { 
      name: 'Phiếu đăng ký', 
      href: '/user/registrations', 
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' 
    },
  ];

  // Kết hợp menu dựa trên role
  const navigation = [
    ...basicNavigation,
    ...(isAdmin || isModerator || isCoach ? specialNavigation : [])
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="fixed w-64 bg-gray-800/90 backdrop-blur-xl border-r border-gray-700 min-h-screen z-50">
          {/* Navigation */}
          <nav className="mt-6 px-3">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                               (item.href !== '/user/dashboard' && location.pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    } group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300`}
                  >
                    <svg
                      className={`${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      } mr-3 flex-shrink-0 h-5 w-5`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>


        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 bg-gray-900">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
