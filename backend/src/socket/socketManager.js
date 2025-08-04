const socketIO = require('socket.io');
const { createNotification } = require('~/services/notificationService');
const { env } = require('../config/environment.js');

// Socket.io event types
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

class SocketManager {
  constructor() {
    this.io = null;
    this.userSocketMap = new Map(); // Maps userId to socketId
    this.tournamentRooms = new Map(); // Maps tournamentId to array of connected users
  }

  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin: env.SOCKET_CORS_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Authorization', 'Content-Type']
      }
    });

    this.setupEventHandlers();
    
    return this.io;
  }

  setupEventHandlers() {
    this.io.on(SOCKET_EVENTS.CONNECT, (socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      // Authenticate user and store socket mapping
      socket.on('authenticate', (userId) => {
        if (userId) {
          this.userSocketMap.set(userId.toString(), socket.id);
          console.log(`User ${userId} authenticated with socket ${socket.id}`);
        }
      });
      
      // Join tournament room
      socket.on(SOCKET_EVENTS.JOIN_TOURNAMENT, (tournamentId) => {
        if (tournamentId) {
          const roomName = `tournament_${tournamentId}`;
          socket.join(roomName);
          
          // Track users in tournament rooms
          if (!this.tournamentRooms.has(tournamentId)) {
            this.tournamentRooms.set(tournamentId, new Set());
          }
          
          // Get userId from socket data if available
          const userId = this.getUserIdFromSocket(socket.id);
          if (userId) {
            this.tournamentRooms.get(tournamentId).add(userId);
          }
          
          console.log(`Socket ${socket.id} joined room ${roomName}`);
        }
      });
      
      // Leave tournament room
      socket.on(SOCKET_EVENTS.LEAVE_TOURNAMENT, (tournamentId) => {
        if (tournamentId) {
          const roomName = `tournament_${tournamentId}`;
          socket.leave(roomName);
          
          // Remove user from tournament room tracking
          const userId = this.getUserIdFromSocket(socket.id);
          if (userId && this.tournamentRooms.has(tournamentId)) {
            this.tournamentRooms.get(tournamentId).delete(userId);
          }
          
          console.log(`Socket ${socket.id} left room ${roomName}`);
        }
      });
      
      // Handle notification received acknowledgment
      socket.on(SOCKET_EVENTS.NOTIFICATION_RECEIVED, (notificationId) => {
        console.log(`Notification ${notificationId} received by client`);
        // Could implement additional logic here if needed
      });
      
      // Handle disconnect
      socket.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log(`Client disconnected: ${socket.id}`);
        
        // Remove user from socket map
        for (const [userId, socketId] of this.userSocketMap.entries()) {
          if (socketId === socket.id) {
            this.userSocketMap.delete(userId);
            
            // Remove user from all tournament rooms
            for (const [tournamentId, users] of this.tournamentRooms.entries()) {
              if (users.has(userId)) {
                users.delete(userId);
              }
            }
            
            break;
          }
        }
      });
    });
  }
  
  // Helper method to get userId from socketId
  getUserIdFromSocket(socketId) {
    for (const [userId, id] of this.userSocketMap.entries()) {
      if (id === socketId) {
        return userId;
      }
    }
    return null;
  }
  
  // Send notification to a specific user
  sendNotificationToUser(userId, notificationType, notificationData) {
    const socketId = this.userSocketMap.get(userId.toString());
    
    if (socketId) {
      this.io.to(socketId).emit(notificationType, notificationData);
      return true;
    }
    
    return false;
  }
  
  // Send notification to all users in a tournament room
  sendNotificationToTournament(tournamentId, notificationType, notificationData) {
    const roomName = `tournament_${tournamentId}`;
    this.io.to(roomName).emit(notificationType, notificationData);
  }
  
  // Create and send new schedule notification
  async sendNewScheduleNotification(tournamentId, matchId, matchData) {
    const notification = {
      title: 'New Match Scheduled',
      message: `A new match has been scheduled in tournament: ${matchData.tournamentName}`,
      type: 'NEW_SCHEDULE',
      Tournament_ID: tournamentId,
      time_sent: new Date(),
      is_read: false
    };
    
    // Send to all users in the tournament room
    this.sendNotificationToTournament(
      tournamentId, 
      SOCKET_EVENTS.NEW_SCHEDULE, 
      {
        notification,
        matchData
      }
    );
    
    // Create notifications in database for all users in the tournament
    if (this.tournamentRooms.has(tournamentId)) {
      const users = this.tournamentRooms.get(tournamentId);
      for (const userId of users) {
        await createNotification({
          ...notification,
          User_ID: userId
        });
      }
    }
  }
  
  // Create and send match result updated notification
  async sendMatchResultNotification(tournamentId, matchId, matchData) {
    const notification = {
      title: 'Match Result Updated',
      message: `Results have been updated for match in tournament: ${matchData.tournamentName}`,
      type: 'MATCH_RESULT',
      Tournament_ID: tournamentId,
      time_sent: new Date(),
      is_read: false
    };
    
    // Send to all users in the tournament room
    this.sendNotificationToTournament(
      tournamentId, 
      SOCKET_EVENTS.MATCH_RESULT_UPDATED, 
      {
        notification,
        matchData
      }
    );
    
    // Create notifications in database for all users in the tournament
    if (this.tournamentRooms.has(tournamentId)) {
      const users = this.tournamentRooms.get(tournamentId);
      for (const userId of users) {
        await createNotification({
          ...notification,
          User_ID: userId
        });
      }
    }
  }
  
  // Create and send registration status notification
  async sendRegistrationStatusNotification(userId, tournamentId, teamId, status, tournamentName, teamName) {
    const isApproved = status === 'approved';
    
    const notification = {
      title: `Registration ${isApproved ? 'Approved' : 'Rejected'}`,
      message: `Your team ${teamName} has been ${isApproved ? 'approved' : 'rejected'} for tournament: ${tournamentName}`,
      type: 'REGISTRATION_STATUS',
      User_ID: userId,
      Tournament_ID: tournamentId,
      time_sent: new Date(),
      is_read: false
    };
    
    // Create notification in database
    const createdNotification = await createNotification(notification);
    
    // Send to specific user
    this.sendNotificationToUser(
      userId, 
      SOCKET_EVENTS.REGISTRATION_STATUS, 
      {
        notification: createdNotification,
        registrationData: {
          tournamentId,
          teamId,
          status,
          tournamentName,
          teamName
        }
      }
    );
  }
}

// Create singleton instance
const socketManager = new SocketManager();

module.exports = {
  socketManager,
  SOCKET_EVENTS
}; 