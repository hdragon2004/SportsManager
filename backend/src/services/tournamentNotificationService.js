import models from '~/models';
import { createNotification } from './notificationService.js';
import { socketManager } from '../socket/socketManager.js';

/**
 * Service để xử lý thông báo tự động cho các giải đấu
 */
class TournamentNotificationService {
  
  /**
   * Lấy tất cả các trận đấu diễn ra hôm nay
   */
  async getTodayMatches() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    try {
      const matches = await models.Match.findAll({
        where: {
          match_date: {
            [models.Sequelize.Op.between]: [startOfDay, endOfDay]
          }
        },
        include: [
          {
            model: models.Tournament,
            include: [
              {
                model: models.Tournament_Type
              }
            ]
          },
          {
            model: models.Team,
            through: { attributes: [] } // Không lấy thông tin từ bảng trung gian
          }
        ],
        order: [['match_date', 'ASC']]
      });
      
      return matches;
    } catch (error) {
      console.error('Error getting today matches:', error);
      throw error;
    }
  }
  
  /**
   * Lấy tất cả users trong hệ thống
   */
  async getAllUsers() {
    try {
      const users = await models.User.findAll({
        where: {
          is_deleted: false
        },
        attributes: ['id', 'username', 'email']
      });
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }
  
  /**
   * Gửi thông báo cho tất cả users về các giải đấu diễn ra hôm nay
   */
  async sendTodayTournamentsNotification() {
    try {
      const todayMatches = await this.getTodayMatches();
      
      if (todayMatches.length === 0) {
        console.log('Không có trận đấu nào diễn ra hôm nay');
        return {
          success: true,
          message: 'Không có trận đấu nào diễn ra hôm nay',
          matchesCount: 0
        };
      }
      
      // Nhóm các trận đấu theo tournament
      const tournamentsWithMatches = {};
      todayMatches.forEach(match => {
        const tournamentId = match.Tournament_ID;
        if (!tournamentsWithMatches[tournamentId]) {
          tournamentsWithMatches[tournamentId] = {
            tournament: match.Tournament,
            matches: []
          };
        }
        tournamentsWithMatches[tournamentId].matches.push(match);
      });
      
      // Lấy tất cả users
      const allUsers = await this.getAllUsers();
      
      // Tạo thông báo cho từng tournament
      const notifications = [];
      
      for (const [tournamentId, tournamentData] of Object.entries(tournamentsWithMatches)) {
        const tournament = tournamentData.tournament;
        const matches = tournamentData.matches;
        
        // Tạo thông báo cho mỗi user
        for (const user of allUsers) {
          const notificationData = {
            title: `Giải đấu diễn ra hôm nay: ${tournament.name}`,
            message: `Hôm nay có ${matches.length} trận đấu diễn ra trong giải ${tournament.name}. Hãy theo dõi để không bỏ lỡ!`,
            type: 'TODAY_TOURNAMENT',
            User_ID: user.id,
            Tournament_ID: parseInt(tournamentId),
            time_sent: new Date(),
            is_read: false,
            priority: 2 // Ưu tiên cao cho thông báo quan trọng
          };
          
          // Tạo notification trong database
          const notification = await createNotification(notificationData);
          notifications.push(notification);
          
          // Gửi thông báo realtime qua socket
          socketManager.sendNotificationToUser(
            user.id,
            'TODAY_TOURNAMENT_NOTIFICATION',
            {
              notification,
              tournament: {
                id: tournament.id,
                name: tournament.name,
                location: tournament.location
              },
              matches: matches.map(match => ({
                id: match.id,
                match_date: match.match_date,
                location: match.location,
                status: match.status,
                teams: match.Teams
              }))
            }
          );
        }
      }
      
      console.log(`Đã gửi ${notifications.length} thông báo cho ${allUsers.length} users về ${Object.keys(tournamentsWithMatches).length} giải đấu`);
      
      return {
        success: true,
        message: `Đã gửi thông báo thành công`,
        notificationsCount: notifications.length,
        usersCount: allUsers.length,
        tournamentsCount: Object.keys(tournamentsWithMatches).length,
        matchesCount: todayMatches.length
      };
      
    } catch (error) {
      console.error('Error sending today tournaments notification:', error);
      throw error;
    }
  }
  
  /**
   * Gửi thông báo nhắc nhở trước giờ diễn ra trận đấu
   */
  async sendMatchReminderNotification(minutesBefore = 30) {
    try {
      const now = new Date();
      const reminderTime = new Date(now.getTime() + (minutesBefore * 60 * 1000));
      
      const upcomingMatches = await models.Match.findAll({
        where: {
          match_date: {
            [models.Sequelize.Op.between]: [now, reminderTime]
          }
        },
        include: [
          {
            model: models.Tournament
          },
          {
            model: models.Team,
            through: { attributes: [] }
          }
        ],
        order: [['match_date', 'ASC']]
      });
      
      if (upcomingMatches.length === 0) {
        return {
          success: true,
          message: 'Không có trận đấu nào sắp diễn ra',
          matchesCount: 0
        };
      }
      
      const allUsers = await this.getAllUsers();
      const notifications = [];
      
      for (const match of upcomingMatches) {
        const timeUntilMatch = Math.floor((new Date(match.match_date) - now) / (1000 * 60));
        
        for (const user of allUsers) {
          const notificationData = {
            title: `Nhắc nhở: Trận đấu sắp diễn ra`,
            message: `Trận đấu trong giải ${match.Tournament.name} sẽ diễn ra sau ${timeUntilMatch} phút tại ${match.location}`,
            type: 'MATCH_REMINDER',
            User_ID: user.id,
            Tournament_ID: match.Tournament_ID,
            time_sent: new Date(),
            is_read: false,
            priority: 3 // Ưu tiên cao nhất cho nhắc nhở
          };
          
          const notification = await createNotification(notificationData);
          notifications.push(notification);
          
          // Gửi thông báo realtime
          socketManager.sendNotificationToUser(
            user.id,
            'MATCH_REMINDER_NOTIFICATION',
            {
              notification,
              match: {
                id: match.id,
                match_date: match.match_date,
                location: match.location,
                tournament: match.Tournament,
                teams: match.Teams,
                timeUntilMatch
              }
            }
          );
        }
      }
      
      return {
        success: true,
        message: `Đã gửi ${notifications.length} thông báo nhắc nhở`,
        notificationsCount: notifications.length,
        matchesCount: upcomingMatches.length
      };
      
    } catch (error) {
      console.error('Error sending match reminder notification:', error);
      throw error;
    }
  }
  
  /**
   * Lên lịch gửi thông báo tự động
   */
  scheduleNotifications() {
    // Gửi thông báo vào 8:00 sáng mỗi ngày
    const scheduleMorningNotification = () => {
      const now = new Date();
      const morningTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
      
      if (now > morningTime) {
        morningTime.setDate(morningTime.getDate() + 1);
      }
      
      const timeUntilMorning = morningTime.getTime() - now.getTime();
      
      setTimeout(async () => {
        await this.sendTodayTournamentsNotification();
        // Lặp lại mỗi ngày
        setInterval(async () => {
          await this.sendTodayTournamentsNotification();
        }, 24 * 60 * 60 * 1000);
      }, timeUntilMorning);
    };
    
    // Gửi nhắc nhở trận đấu mỗi 30 phút
    const scheduleMatchReminders = () => {
      setInterval(async () => {
        await this.sendMatchReminderNotification(30);
      }, 30 * 60 * 1000); // 30 phút
    };
    
    // Khởi động lịch trình
    scheduleMorningNotification();
    scheduleMatchReminders();
    
    console.log('Đã lên lịch gửi thông báo tự động');
  }
}

export default new TournamentNotificationService(); 