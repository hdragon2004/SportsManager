const { socketManager } = require('./socketManager');
const { createNotification } = require('~/services/notificationService');
const { env } = require('../config/environment.js');

// Tournament Events
const TOURNAMENT_EVENTS = {
  NEW_REGISTRATION: 'newRegistration',
  TOURNAMENT_CREATED: 'tournamentCreated',
  TOURNAMENT_STARTED: 'tournamentStarted',
  SCHEDULE_GENERATED: 'scheduleGenerated',
  MATCH_UPDATED: 'matchUpdated'
};

class TournamentEvents {
  constructor() {
    this.socketManager = socketManager;
  }

  // 1. Khi HUẤN LUYỆN VIÊN đăng ký đội tham gia giải đấu
  async emitNewRegistration(registrationData) {
    const { tournamentId, teamName, coachName, registrationId } = registrationData;
    
    try {
      // Tạo notification cho admin
      const notification = {
        title: 'Đăng ký đội mới',
        message: `Đội ${teamName} của huấn luyện viên ${coachName} đã đăng ký tham gia giải đấu`,
        type: 'NEW_REGISTRATION',
        Tournament_ID: tournamentId,
        time_sent: new Date(),
        is_read: false
      };

      // Gửi thông báo đến tất cả admin
      const adminUsers = await this.getUsersByRole('admin');
      
      for (const admin of adminUsers) {
        // Tạo notification trong database
        await createNotification({
          ...notification,
          User_ID: admin.id
        });

        // Gửi socket event
        this.socketManager.sendNotificationToUser(
          admin.id,
          TOURNAMENT_EVENTS.NEW_REGISTRATION,
          {
            notification,
            registration: registrationData
          }
        );
      }

      console.log(`Emitted new registration event to ${adminUsers.length} admins`);
    } catch (error) {
      console.error('Error emitting new registration event:', error);
    }
  }

  // 2. Khi ADMIN tạo giải đấu mới
  async emitTournamentCreated(tournamentData) {
    const { tournamentId, tournamentName, createdBy } = tournamentData;
    
    try {
      // Tạo notification cho tất cả user không phải admin
      const nonAdminUsers = await this.getUsersByRole(['coach', 'user']);
      
      const notification = {
        title: 'Giải đấu mới',
        message: `Giải đấu "${tournamentName}" đã được tạo và sẵn sàng đăng ký`,
        type: 'TOURNAMENT_CREATED',
        Tournament_ID: tournamentId,
        time_sent: new Date(),
        is_read: false
      };

      for (const user of nonAdminUsers) {
        // Tạo notification trong database
        await createNotification({
          ...notification,
          User_ID: user.id
        });

        // Gửi socket event
        this.socketManager.sendNotificationToUser(
          user.id,
          TOURNAMENT_EVENTS.TOURNAMENT_CREATED,
          {
            notification,
            tournament: tournamentData
          }
        );
      }

      console.log(`Emitted tournament created event to ${nonAdminUsers.length} users`);
    } catch (error) {
      console.error('Error emitting tournament created event:', error);
    }
  }

  // 3. Khi giải đấu bắt đầu (tự động)
  async emitTournamentStarted(tournamentData) {
    const { tournamentId, tournamentName } = tournamentData;
    
    try {
      // Lấy tất cả user đã đăng ký tham gia giải đấu
      const participants = await this.getTournamentParticipants(tournamentId);
      
      const notification = {
        title: 'Giải đấu đã bắt đầu',
        message: `Giải đấu "${tournamentName}" đã chính thức bắt đầu!`,
        type: 'TOURNAMENT_STARTED',
        Tournament_ID: tournamentId,
        time_sent: new Date(),
        is_read: false
      };

      for (const participant of participants) {
        // Tạo notification trong database
        await createNotification({
          ...notification,
          User_ID: participant.User_ID
        });

        // Gửi socket event
        this.socketManager.sendNotificationToUser(
          participant.User_ID,
          TOURNAMENT_EVENTS.TOURNAMENT_STARTED,
          {
            notification,
            tournament: tournamentData
          }
        );
      }

      console.log(`Emitted tournament started event to ${participants.length} participants`);
    } catch (error) {
      console.error('Error emitting tournament started event:', error);
    }
  }

  // 4. Khi lịch thi đấu được tạo
  async emitScheduleGenerated(tournamentId, scheduleData) {
    try {
      // Gửi thông báo đến tất cả user trong tournament
      const participants = await this.getTournamentParticipants(tournamentId);
      
      const notification = {
        title: 'Lịch thi đấu đã được tạo',
        message: `Lịch thi đấu cho giải đấu đã được tạo và sẵn sàng xem`,
        type: 'SCHEDULE_GENERATED',
        Tournament_ID: tournamentId,
        time_sent: new Date(),
        is_read: false
      };

      for (const participant of participants) {
        // Tạo notification trong database
        await createNotification({
          ...notification,
          User_ID: participant.User_ID
        });

        // Gửi socket event
        this.socketManager.sendNotificationToUser(
          participant.User_ID,
          TOURNAMENT_EVENTS.SCHEDULE_GENERATED,
          {
            notification,
            schedule: scheduleData
          }
        );
      }

      console.log(`Emitted schedule generated event to ${participants.length} participants`);
    } catch (error) {
      console.error('Error emitting schedule generated event:', error);
    }
  }

  // Helper functions
  async getUsersByRole(roles) {
    // Import models
    const { User, Role, Role_User } = require('~/models');
    
    try {
      const roleArray = Array.isArray(roles) ? roles : [roles];
      
      const users = await User.findAll({
        include: [{
          model: Role,
          through: Role_User,
          where: {
            name: roleArray
          }
        }]
      });

      return users;
    } catch (error) {
      console.error('Error getting users by role:', error);
      return [];
    }
  }

  async getTournamentParticipants(tournamentId) {
    // Import models
    const { Registration } = require('~/models');
    
    try {
      const participants = await Registration.findAll({
        where: {
          Tournament_ID: tournamentId,
          status: 'approved'
        }
      });

      return participants;
    } catch (error) {
      console.error('Error getting tournament participants:', error);
      return [];
    }
  }
}

// Create singleton instance
const tournamentEvents = new TournamentEvents();

module.exports = {
  tournamentEvents,
  TournamentEvents,
  TOURNAMENT_EVENTS
}; 