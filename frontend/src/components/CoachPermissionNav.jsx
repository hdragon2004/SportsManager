import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CoachPermissionNav = () => {
  const { user, isCoach, isAdmin } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold">Quyền Huấn luyện viên</h3>
            <p className="text-sm opacity-90">
              {isCoach 
                ? 'Bạn đã có quyền huấn luyện viên'
                : 'Xin cấp quyền để quản lý đội bóng'
              }
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isCoach ? (
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm">Đã có quyền</span>
            </div>
          ) : (
            <Link
              to="/coach-permission"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              Xin cấp quyền
            </Link>
          )}
          
          {isAdmin && (
            <Link
              to="/admin/coach-permissions"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              Quản lý yêu cầu
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachPermissionNav; 