const { Match, Team, Tournament } = require('~/models');

class ScheduleService {
  constructor() {
    this.timeSlots = [
      { start: '08:00', end: '09:30' },
      { start: '10:00', end: '11:30' },
      { start: '14:00', end: '15:30' },
      { start: '16:00', end: '17:30' },
      { start: '19:00', end: '20:30' }
    ];
  }

  /**
   * Tạo lịch thi đấu Round-Robin
   * @param {Array} teams - Danh sách đội tham gia
   * @param {number} fields - Số lượng sân thi đấu
   * @param {Date} startDate - Ngày bắt đầu
   * @returns {Object} Lịch thi đấu đã được tối ưu
   */
  generateSchedule(teams, fields = 2, startDate = new Date()) {
    try {
      if (teams.length < 2) {
        throw new Error('Cần ít nhất 2 đội để tạo lịch thi đấu');
      }

      // Tạo danh sách tất cả các trận đấu có thể
      const allMatches = this.generateAllMatches(teams);
      
      // Phân chia thành các vòng đấu
      const rounds = this.divideIntoRounds(allMatches, fields);
      
      // Gán thời gian và sân cho từng trận đấu
      const scheduledMatches = this.assignTimeAndVenue(rounds, startDate, fields);
      
      // Tối ưu hóa để tránh xung đột
      const optimizedSchedule = this.optimizeSchedule(scheduledMatches);
      
      return {
        success: true,
        data: {
          rounds: optimizedSchedule.rounds,
          conflicts: optimizedSchedule.conflicts,
          totalMatches: allMatches.length,
          totalRounds: optimizedSchedule.rounds.length,
          estimatedDuration: this.calculateDuration(optimizedSchedule.rounds)
        }
      };
    } catch (error) {
      console.error('Error generating schedule:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Tạo tất cả các trận đấu có thể (Round-Robin)
   */
  generateAllMatches(teams) {
    const matches = [];
    const teamIds = teams.map(team => team.id);
    
    // Nếu số đội lẻ, thêm đội "bye"
    if (teamIds.length % 2 !== 0) {
      teamIds.push('bye');
    }
    
    const n = teamIds.length;
    
    // Thuật toán Round-Robin
    for (let round = 0; round < n - 1; round++) {
      const roundMatches = [];
      
      for (let i = 0; i < n / 2; i++) {
        const team1 = teamIds[i];
        const team2 = teamIds[n - 1 - i];
        
        if (team1 !== 'bye' && team2 !== 'bye') {
          roundMatches.push({
            team1_id: team1,
            team2_id: team2,
            round: round + 1
          });
        }
      }
      
      matches.push(...roundMatches);
      
      // Xoay danh sách (trừ đội đầu tiên)
      const temp = teamIds[1];
      for (let i = 1; i < n - 1; i++) {
        teamIds[i] = teamIds[i + 1];
      }
      teamIds[n - 1] = temp;
    }
    
    return matches;
  }

  /**
   * Phân chia trận đấu thành các vòng
   */
  divideIntoRounds(matches, fields) {
    const rounds = [];
    const matchesPerRound = Math.ceil(fields * 2); // 2 trận/sân/khung giờ
    
    for (let i = 0; i < matches.length; i += matchesPerRound) {
      const roundMatches = matches.slice(i, i + matchesPerRound);
      rounds.push({
        roundNumber: Math.floor(i / matchesPerRound) + 1,
        matches: roundMatches
      });
    }
    
    return rounds;
  }

  /**
   * Gán thời gian và sân cho các trận đấu
   */
  assignTimeAndVenue(rounds, startDate, fields) {
    const scheduledRounds = [];
    let currentDate = new Date(startDate);
    let timeSlotIndex = 0;
    
    for (const round of rounds) {
      const scheduledMatches = [];
      let fieldIndex = 0;
      
      for (const match of round.matches) {
        const timeSlot = this.timeSlots[timeSlotIndex % this.timeSlots.length];
        const fieldNumber = (fieldIndex % fields) + 1;
        
        const matchDateTime = new Date(currentDate);
        const [hours, minutes] = timeSlot.start.split(':');
        matchDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        scheduledMatches.push({
          ...match,
          scheduled_time: matchDateTime,
          venue: `Sân ${fieldNumber}`,
          status: 'scheduled'
        });
        
        fieldIndex++;
        
        // Nếu đã hết sân, chuyển sang khung giờ tiếp theo
        if (fieldIndex % fields === 0) {
          timeSlotIndex++;
        }
      }
      
      // Nếu đã hết khung giờ trong ngày, chuyển sang ngày tiếp theo
      if (timeSlotIndex >= this.timeSlots.length) {
        currentDate.setDate(currentDate.getDate() + 1);
        timeSlotIndex = 0;
      }
      
      scheduledRounds.push({
        ...round,
        matches: scheduledMatches
      });
    }
    
    return { rounds: scheduledRounds };
  }

  /**
   * Tối ưu hóa lịch thi đấu để tránh xung đột
   */
  optimizeSchedule(scheduledSchedule) {
    const conflicts = [];
    const optimizedRounds = [];
    
    for (const round of scheduledSchedule.rounds) {
      const optimizedMatches = [];
      
      for (const match of round.matches) {
        // Kiểm tra xung đột thời gian
        const timeConflict = this.checkTimeConflict(match, optimizedMatches);
        
        if (timeConflict) {
          conflicts.push({
            type: 'time_conflict',
            match: match,
            conflictWith: timeConflict
          });
          
          // Điều chỉnh thời gian
          match.scheduled_time = this.adjustTime(match.scheduled_time);
        }
        
        // Kiểm tra xung đột sân
        const venueConflict = this.checkVenueConflict(match, optimizedMatches);
        
        if (venueConflict) {
          conflicts.push({
            type: 'venue_conflict',
            match: match,
            conflictWith: venueConflict
          });
          
          // Điều chỉnh sân
          match.venue = this.adjustVenue(match.venue);
        }
        
        optimizedMatches.push(match);
      }
      
      optimizedRounds.push({
        ...round,
        matches: optimizedMatches
      });
    }
    
    return {
      rounds: optimizedRounds,
      conflicts: conflicts
    };
  }

  /**
   * Kiểm tra xung đột thời gian
   */
  checkTimeConflict(match, existingMatches) {
    const matchTime = new Date(match.scheduled_time);
    
    for (const existingMatch of existingMatches) {
      const existingTime = new Date(existingMatch.scheduled_time);
      const timeDiff = Math.abs(matchTime - existingTime);
      
      // Nếu cách nhau ít hơn 2 giờ
      if (timeDiff < 2 * 60 * 60 * 1000) {
        return existingMatch;
      }
    }
    
    return null;
  }

  /**
   * Kiểm tra xung đột sân
   */
  checkVenueConflict(match, existingMatches) {
    const matchTime = new Date(match.scheduled_time);
    
    for (const existingMatch of existingMatches) {
      const existingTime = new Date(existingMatch.scheduled_time);
      const timeDiff = Math.abs(matchTime - existingTime);
      
      // Nếu cùng sân và cách nhau ít hơn 3 giờ
      if (match.venue === existingMatch.venue && timeDiff < 3 * 60 * 60 * 1000) {
        return existingMatch;
      }
    }
    
    return null;
  }

  /**
   * Điều chỉnh thời gian
   */
  adjustTime(originalTime) {
    const adjustedTime = new Date(originalTime);
    adjustedTime.setHours(adjustedTime.getHours() + 2);
    return adjustedTime;
  }

  /**
   * Điều chỉnh sân
   */
  adjustVenue(originalVenue) {
    const venueNumber = parseInt(originalVenue.split(' ')[1]);
    const newVenueNumber = venueNumber === 1 ? 2 : 1;
    return `Sân ${newVenueNumber}`;
  }

  /**
   * Tính thời gian dự kiến
   */
  calculateDuration(rounds) {
    if (rounds.length === 0) return 0;
    
    const firstMatch = rounds[0].matches[0];
    const lastMatch = rounds[rounds.length - 1].matches[rounds[rounds.length - 1].matches.length - 1];
    
    const startTime = new Date(firstMatch.scheduled_time);
    const endTime = new Date(lastMatch.scheduled_time);
    endTime.setHours(endTime.getHours() + 2); // Thêm 2 giờ cho trận cuối
    
    const durationMs = endTime - startTime;
    const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
    
    return durationDays;
  }

  /**
   * Lưu lịch thi đấu vào database
   */
  async saveScheduleToDatabase(tournamentId, scheduleData) {
    try {
      const matches = [];
      
      for (const round of scheduleData.rounds) {
        for (const match of round.matches) {
          matches.push({
            Tournament_ID: tournamentId,
            Team1_ID: match.team1_id,
            Team2_ID: match.team2_id,
            scheduled_time: match.scheduled_time,
            venue: match.venue,
            status: match.status,
            round: round.roundNumber
          });
        }
      }
      
      // Lưu vào database
      await Match.bulkCreate(matches);
      
      console.log(`Saved ${matches.length} matches to database`);
      return { success: true, matchesCount: matches.length };
    } catch (error) {
      console.error('Error saving schedule to database:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const scheduleService = new ScheduleService();

module.exports = {
  scheduleService
}; 