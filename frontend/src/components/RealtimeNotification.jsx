import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

const RealtimeNotification = () => {
  const { notifications } = useSocket();
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      if (!latestNotification.is_read) {
        setCurrentNotification(latestNotification);
        setShowNotification(true);
        
        // Auto hide after 5 seconds
        const timer = setTimeout(() => {
          setShowNotification(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  if (!showNotification || !currentNotification) {
    return null;
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'NEW_SCHEDULE':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'MATCH_RESULT':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'REGISTRATION_STATUS':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'TOURNAMENT_CREATED':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'TOURNAMENT_STARTED':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4H20c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4.19C3.65 20 3.2 19.6 3.1 19.1L1.1 9.1C1 8.5 1.5 8 2.1 8h3.8c.6 0 1.1.5 1 1.1L6.9 19H20V6H4.19z" />
          </svg>
        );
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'NEW_SCHEDULE':
        return 'bg-blue-500';
      case 'MATCH_RESULT':
        return 'bg-green-500';
      case 'REGISTRATION_STATUS':
        return 'bg-yellow-500';
      case 'TOURNAMENT_CREATED':
        return 'bg-purple-500';
      case 'TOURNAMENT_STARTED':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`${getNotificationColor(currentNotification.type)} text-white rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out ${showNotification ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getNotificationIcon(currentNotification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold mb-1">
              {currentNotification.title}
            </h4>
            <p className="text-sm opacity-90">
              {currentNotification.message}
            </p>
            <p className="text-xs opacity-75 mt-2">
              {new Date(currentNotification.time_sent).toLocaleString('vi-VN')}
            </p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="flex-shrink-0 text-white opacity-70 hover:opacity-100"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealtimeNotification; 