// Example React implementation for socket.io client
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

// Socket.io event types (should match with backend)
const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_TOURNAMENT: 'joinTournament',
  LEAVE_TOURNAMENT: 'leaveTournament',
  
  // Notification events
  NEW_SCHEDULE: 'newSchedule',
  MATCH_RESULT_UPDATED: 'matchResultUpdated',
  REGISTRATION_STATUS: 'registrationStatus',
  
  // Notification received acknowledgment
  NOTIFICATION_RECEIVED: 'notificationReceived'
};

// Socket context to provide socket throughout the app
const SocketContext = React.createContext(null);

export const SocketProvider = ({ children, userId }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Initialize socket connection
  useEffect(() => {
    // Create socket connection
    const socketInstance = io('http://localhost:3000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
    
    // Set up event listeners
    socketInstance.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('Connected to socket server');
      
      // Authenticate with user ID
      if (userId) {
        socketInstance.emit('authenticate', userId);
      }
    });
    
    // Handle disconnection
    socketInstance.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('Disconnected from socket server');
    });
    
    // Save socket instance
    setSocket(socketInstance);
    
    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [userId]);
  
  // Load initial notifications from API
  useEffect(() => {
    if (userId) {
      fetchUserNotifications();
    }
  }, [userId]);
  
  // Set up notification listeners
  useEffect(() => {
    if (!socket) return;
    
    // Listen for new schedule notifications
    socket.on(SOCKET_EVENTS.NEW_SCHEDULE, (data) => {
      console.log('New schedule notification received:', data);
      
      // Add to notifications list
      setNotifications(prev => [data.notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if supported
      showBrowserNotification(
        'New Match Scheduled',
        data.notification.message
      );
      
      // Acknowledge receipt
      socket.emit(SOCKET_EVENTS.NOTIFICATION_RECEIVED, data.notification.id);
    });
    
    // Listen for match result updates
    socket.on(SOCKET_EVENTS.MATCH_RESULT_UPDATED, (data) => {
      console.log('Match result notification received:', data);
      
      // Add to notifications list
      setNotifications(prev => [data.notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if supported
      showBrowserNotification(
        'Match Result Updated',
        data.notification.message
      );
      
      // Acknowledge receipt
      socket.emit(SOCKET_EVENTS.NOTIFICATION_RECEIVED, data.notification.id);
    });
    
    // Listen for registration status updates
    socket.on(SOCKET_EVENTS.REGISTRATION_STATUS, (data) => {
      console.log('Registration status notification received:', data);
      
      // Add to notifications list
      setNotifications(prev => [data.notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show browser notification if supported
      showBrowserNotification(
        data.notification.title,
        data.notification.message
      );
      
      // Acknowledge receipt
      socket.emit(SOCKET_EVENTS.NOTIFICATION_RECEIVED, data.notification.id);
    });
    
    // Cleanup listeners on unmount
    return () => {
      socket.off(SOCKET_EVENTS.NEW_SCHEDULE);
      socket.off(SOCKET_EVENTS.MATCH_RESULT_UPDATED);
      socket.off(SOCKET_EVENTS.REGISTRATION_STATUS);
    };
  }, [socket]);
  
  // Join tournament room
  const joinTournament = (tournamentId) => {
    if (socket && tournamentId) {
      socket.emit(SOCKET_EVENTS.JOIN_TOURNAMENT, tournamentId);
      console.log(`Joined tournament room: ${tournamentId}`);
    }
  };
  
  // Leave tournament room
  const leaveTournament = (tournamentId) => {
    if (socket && tournamentId) {
      socket.emit(SOCKET_EVENTS.LEAVE_TOURNAMENT, tournamentId);
      console.log(`Left tournament room: ${tournamentId}`);
    }
  };
  
  // Fetch user notifications from API
  const fetchUserNotifications = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}/notifications`);
      if (response.data.success) {
        setNotifications(response.data.data);
      }
      
      // Get unread count
      const countResponse = await axios.get(`/api/users/${userId}/notifications/unread-count`);
      if (countResponse.data.success) {
        setUnreadCount(countResponse.data.data.count);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put(`/api/users/${userId}/notifications/read-all`);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  // Helper function to show browser notifications
  const showBrowserNotification = (title, body) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, { body });
          }
        });
      }
    }
  };
  
  // Context value
  const value = {
    socket,
    notifications,
    unreadCount,
    joinTournament,
    leaveTournament,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchUserNotifications
  };
  
  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// Example NotificationList component
export const NotificationList = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();
  
  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h3>Notifications ({unreadCount})</h3>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead}>Mark all as read</button>
        )}
      </div>
      
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-title">{notification.title}</div>
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">
                {new Date(notification.time_sent).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Example TournamentView component that joins a tournament room
export const TournamentView = ({ tournamentId, tournamentName }) => {
  const { joinTournament, leaveTournament } = useSocket();
  
  // Join tournament room on component mount
  useEffect(() => {
    joinTournament(tournamentId);
    
    // Leave room on unmount
    return () => {
      leaveTournament(tournamentId);
    };
  }, [tournamentId]);
  
  return (
    <div className="tournament-view">
      <h2>{tournamentName}</h2>
      {/* Tournament content */}
    </div>
  );
}; 