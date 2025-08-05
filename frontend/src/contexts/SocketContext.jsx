import React, { useEffect, useState, createContext, useContext } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import axiosClient from '../services/axiosClient';

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
  TODAY_TOURNAMENT_NOTIFICATION: 'todayTournamentNotification',
  MATCH_REMINDER_NOTIFICATION: 'matchReminderNotification',
  TOURNAMENT_CREATED: 'tournamentCreated',
  TOURNAMENT_STARTED: 'tournamentStarted',
  
  // Notification received acknowledgment
  NOTIFICATION_RECEIVED: 'notificationReceived'
};

// Socket context to provide socket throughout the app
const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  // Initialize socket connection
  useEffect(() => {
    if (!user) return;

    // Create socket connection
    const socketInstance = io('http://localhost:8000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
      withCredentials: true
    });
    
    // Set up event listeners
    socketInstance.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('Connected to socket server');
      setIsConnected(true);
      
      // Authenticate with user ID
      if (user.id) {
        socketInstance.emit('authenticate', user.id);
        console.log('Authenticated with user ID:', user.id);
      }
    });
    
    // Handle disconnection
    socketInstance.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });
    
    // Save socket instance
    setSocket(socketInstance);
    
    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [user]);
  
  // Load initial notifications from API
  useEffect(() => {
    if (user) {
      fetchUserNotifications();
    }
  }, [user]);

  // Update unread count when notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      const unread = notifications.filter(notification => 
        !notification.is_read && !notification.read
      ).length;
      console.log('Updating unread count from notifications:', unread);
      setUnreadCount(unread);
    }
  }, [notifications]);
  
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
    
    // Listen for today tournament notifications
    socket.on(SOCKET_EVENTS.TODAY_TOURNAMENT_NOTIFICATION, (data) => {
      console.log('Today tournament notification received:', data);
      
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
    
    // Listen for match reminder notifications
    socket.on(SOCKET_EVENTS.MATCH_REMINDER_NOTIFICATION, (data) => {
      console.log('Match reminder notification received:', data);
      
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
    
    // Listen for tournament created notifications
    socket.on(SOCKET_EVENTS.TOURNAMENT_CREATED, (data) => {
      console.log('Tournament created notification received:', data);
      
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
    
    // Listen for tournament started notifications
    socket.on(SOCKET_EVENTS.TOURNAMENT_STARTED, (data) => {
      console.log('Tournament started notification received:', data);
      
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
      socket.off(SOCKET_EVENTS.TODAY_TOURNAMENT_NOTIFICATION);
      socket.off(SOCKET_EVENTS.MATCH_REMINDER_NOTIFICATION);
      socket.off(SOCKET_EVENTS.TOURNAMENT_CREATED);
      socket.off(SOCKET_EVENTS.TOURNAMENT_STARTED);
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
      const response = await axiosClient.get('/notifications');
      console.log('Fetching notifications response:', response.data);
      
      let notificationsData = [];
      if (Array.isArray(response.data)) {
        notificationsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        notificationsData = response.data.data;
      }
      
      setNotifications(notificationsData);
        
      // Calculate unread count - kiểm tra cả is_read và read
      const unread = notificationsData.filter(notification => 
        !notification.is_read && !notification.read
      ).length;
      
      console.log('Calculated unread count:', unread);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Không reset unreadCount khi có lỗi để tránh mất dữ liệu
    }
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      // Gọi API để lưu vào database
      const response = await axiosClient.put(`/notifications/${notificationId}/read`);
      
      if (response.data.success) {
        // Chỉ cập nhật local state sau khi API thành công
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, is_read: true, read: true } 
              : notification
          )
        );
        
        setUnreadCount(prev => Math.max(0, prev - 1));
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error; // Re-throw để component có thể xử lý
    }
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // Gọi API để lưu vào database
      const response = await axiosClient.put(`/users/${user.id}/notifications/read-all`);
      
      if (response.data.success) {
        // Chỉ cập nhật local state sau khi API thành công
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, is_read: true, read: true }))
        );
        
        setUnreadCount(0);
      } else {
        throw new Error(response.data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error; // Re-throw để component có thể xử lý
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
    setUnreadCount,
    isConnected,
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
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}; 