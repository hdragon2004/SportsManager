import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import Toast from './Toast';

const TodayTournamentNotification = () => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');

  useEffect(() => {
    if (!socket || !user) return;

    // Lắng nghe thông báo về giải đấu hôm nay
    const handleTodayTournamentNotification = (data) => {
      console.log('Nhận thông báo giải đấu hôm nay:', data);
      
      const newNotification = {
        id: Date.now(),
        ...data.notification,
        tournament: data.tournament,
        matches: data.matches,
        timestamp: new Date()
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Hiển thị toast
      setToastMessage(data.notification.message);
      setToastType('info');
      setShowToast(true);
      
      // Tự động ẩn toast sau 5 giây
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    };

    // Lắng nghe thông báo nhắc nhở trận đấu
    const handleMatchReminderNotification = (data) => {
      console.log('Nhận thông báo nhắc nhở trận đấu:', data);
      
      const newNotification = {
        id: Date.now(),
        ...data.notification,
        match: data.match,
        timestamp: new Date()
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Hiển thị toast với ưu tiên cao hơn
      setToastMessage(data.notification.message);
      setToastType('warning');
      setShowToast(true);
      
      // Tự động ẩn toast sau 8 giây cho thông báo quan trọng
      setTimeout(() => {
        setShowToast(false);
      }, 8000);
    };

    // Đăng ký lắng nghe events
    socket.on('TODAY_TOURNAMENT_NOTIFICATION', handleTodayTournamentNotification);
    socket.on('MATCH_REMINDER_NOTIFICATION', handleMatchReminderNotification);

    // Cleanup khi component unmount
    return () => {
      socket.off('TODAY_TOURNAMENT_NOTIFICATION', handleTodayTournamentNotification);
      socket.off('MATCH_REMINDER_NOTIFICATION', handleMatchReminderNotification);
    };
  }, [socket, user]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'TODAY_TOURNAMENT':
        return '🏆';
      case 'MATCH_REMINDER':
        return '⚽';
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'TODAY_TOURNAMENT':
        return 'bg-blue-50 border-blue-200';
      case 'MATCH_REMINDER':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, is_read: true }
          : notif
      )
    );
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {/* Toast notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
      
      {/* Notification list */}
      {notifications.slice(0, 3).map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg transition-all duration-300 ${
            getNotificationColor(notification.type)
          } ${notification.is_read ? 'opacity-75' : ''}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {notification.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  {notification.message}
                </p>
                
                {/* Tournament info */}
                {notification.tournament && (
                  <div className="bg-white rounded p-2 mb-2">
                    <p className="text-xs font-medium text-gray-700">
                      Giải: {notification.tournament.name}
                    </p>
                    {notification.tournament.location && (
                      <p className="text-xs text-gray-500">
                        Địa điểm: {notification.tournament.location}
                      </p>
                    )}
                  </div>
                )}
                
                {/* Match info */}
                {notification.matches && notification.matches.length > 0 && (
                  <div className="bg-white rounded p-2 mb-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      Các trận đấu hôm nay:
                    </p>
                    {notification.matches.slice(0, 2).map((match, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        • {formatTime(match.match_date)} - {match.location}
                        {match.teams && match.teams.length > 0 && (
                          <span className="ml-1">
                            ({match.teams.map(team => team.name).join(' vs ')})
                          </span>
                        )}
                      </div>
                    ))}
                    {notification.matches.length > 2 && (
                      <p className="text-xs text-gray-500">
                        Và {notification.matches.length - 2} trận đấu khác...
                      </p>
                    )}
                  </div>
                )}
                
                {/* Match reminder info */}
                {notification.match && (
                  <div className="bg-white rounded p-2 mb-2">
                    <p className="text-xs font-medium text-gray-700">
                      Trận đấu: {notification.match.tournament?.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Thời gian: {formatTime(notification.match.match_date)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Địa điểm: {notification.match.location}
                    </p>
                    {notification.match.timeUntilMatch && (
                      <p className="text-xs text-orange-600 font-medium">
                        Còn {notification.match.timeUntilMatch} phút
                      </p>
                    )}
                  </div>
                )}
                
                <p className="text-xs text-gray-400">
                  {formatDate(notification.timestamp)}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-1">
              {!notification.is_read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Đánh dấu đã đọc
                </button>
              )}
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-xs text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Show more button if there are more notifications */}
      {notifications.length > 3 && (
        <div className="text-center">
          <button className="text-xs text-blue-600 hover:text-blue-800">
            Xem thêm {notifications.length - 3} thông báo
          </button>
        </div>
      )}
    </div>
  );
};

export default TodayTournamentNotification; 