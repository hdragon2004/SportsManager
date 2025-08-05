import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CoachPermissionWidget = () => {
  const { user, isCoach } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Quyền Huấn luyện viên</h3>
            <p className="text-sm text-gray-600">
              {isCoach ? 'Bạn đã có quyền' : 'Xin cấp quyền để quản lý đội bóng'}
            </p>
          </div>
        </div>
        
        {isCoach ? (
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-800 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Đã có quyền</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm font-medium">Chưa có quyền</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {isCoach ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-medium text-green-900">Chúc mừng!</h4>
                <p className="text-sm text-green-700">
                  Bạn đã được cấp quyền huấn luyện viên. Bây giờ bạn có thể:
                </p>
                <ul className="text-sm text-green-700 mt-2 space-y-1">
                  <li>• Quản lý đội bóng</li>
                  <li>• Đăng ký giải đấu</li>
                  <li>• Xem thống kê chi tiết</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-medium text-blue-900">Xin cấp quyền</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Quyền huấn luyện viên cho phép bạn quản lý đội bóng và tham gia các hoạt động huấn luyện.
                </p>
                <Link
                  to="/coach-permission"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Xin cấp quyền ngay
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isCoach && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Thời gian xử lý</span>
            <span className="font-medium">24-48 giờ</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
            <span>Trạng thái</span>
            <span className="font-medium">Miễn phí</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachPermissionWidget; 