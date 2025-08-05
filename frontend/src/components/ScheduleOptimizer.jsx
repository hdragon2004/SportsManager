import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../services/axiosClient';

const ScheduleOptimizer = ({ tournamentId }) => {
  const { user, isAdmin } = useAuth();
  const { socket, isConnected } = useSocket();
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [optimizationSettings, setOptimizationSettings] = useState({
    maxMatchesPerDay: 4,
    minRestHours: 24,
    avoidConcurrentMatches: true,
    prioritizeEvenDistribution: true
  });
  const [conflicts, setConflicts] = useState([]);
  const [optimizedSchedule, setOptimizedSchedule] = useState([]);

  useEffect(() => {
    if (tournamentId) {
      fetchData();
    }
  }, [tournamentId]);

  // Listen for realtime schedule updates
  useEffect(() => {
    if (!socket) return;

    socket.on('scheduleOptimized', (data) => {
      console.log('Schedule optimization received:', data);
      updateOptimizedSchedule(data);
    });

    socket.on('scheduleConflict', (data) => {
      console.log('Schedule conflict detected:', data);
      addConflict(data);
    });

    return () => {
      socket.off('scheduleOptimized');
      socket.off('scheduleConflict');
    };
  }, [socket]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch matches
      const matchesResponse = await axiosClient.get(`/tournaments/${tournamentId}/matches`);
      setMatches(matchesResponse.data || []);
      
      // Fetch teams
      const teamsResponse = await axiosClient.get(`/tournaments/${tournamentId}/teams`);
      setTeams(teamsResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOptimizedSchedule = (data) => {
    setOptimizedSchedule(data.schedule);
    setConflicts(data.conflicts || []);
  };

  const addConflict = (conflict) => {
    setConflicts(prev => [conflict, ...prev]);
  };

  const runOptimization = async () => {
    if (!isAdmin) {
      alert('Bạn không có quyền tối ưu hóa lịch thi đấu');
      return;
    }

    try {
      const response = await axiosClient.post(`/tournaments/${tournamentId}/optimize-schedule`, {
        settings: optimizationSettings
      });

      if (response.data.success) {
        // Emit to socket for realtime update
        if (socket) {
          socket.emit('scheduleOptimization', {
            tournamentId,
            settings: optimizationSettings,
            optimizedBy: user.id
          });
        }

        alert('Tối ưu hóa lịch thi đấu thành công!');
      }
    } catch (error) {
      console.error('Error optimizing schedule:', error);
      alert('Có lỗi xảy ra khi tối ưu hóa lịch thi đấu');
    }
  };

  const detectConflicts = () => {
    const conflicts = [];
    
    // Check for team conflicts (same team playing multiple matches on same day)
    const teamMatches = {};
    matches.forEach(match => {
      const date = new Date(match.scheduled_time).toDateString();
      if (!teamMatches[date]) teamMatches[date] = {};
      
      if (!teamMatches[date][match.team1_id]) teamMatches[date][match.team1_id] = [];
      if (!teamMatches[date][match.team2_id]) teamMatches[date][match.team2_id] = [];
      
      teamMatches[date][match.team1_id].push(match);
      teamMatches[date][match.team2_id].push(match);
    });

    Object.keys(teamMatches).forEach(date => {
      Object.keys(teamMatches[date]).forEach(teamId => {
        if (teamMatches[date][teamId].length > 1) {
          conflicts.push({
            type: 'team_conflict',
            date,
            teamId,
            matches: teamMatches[date][teamId],
            message: `Đội ${getTeamName(teamId)} có ${teamMatches[date][teamId].length} trận đấu trong ngày ${date}`
          });
        }
      });
    });

    // Check for venue conflicts
    const venueMatches = {};
    matches.forEach(match => {
      const date = new Date(match.scheduled_time).toDateString();
      const time = new Date(match.scheduled_time).getTime();
      
      if (!venueMatches[date]) venueMatches[date] = {};
      if (!venueMatches[date][match.venue]) venueMatches[date][match.venue] = [];
      
      venueMatches[date][match.venue].push({ ...match, time });
    });

    Object.keys(venueMatches).forEach(date => {
      Object.keys(venueMatches[date]).forEach(venue => {
        const matches = venueMatches[date][venue];
        for (let i = 0; i < matches.length; i++) {
          for (let j = i + 1; j < matches.length; j++) {
            const timeDiff = Math.abs(matches[i].time - matches[j].time);
            if (timeDiff < 3 * 60 * 60 * 1000) { // Less than 3 hours
              conflicts.push({
                type: 'venue_conflict',
                date,
                venue,
                matches: [matches[i], matches[j]],
                message: `Sân ${venue} có 2 trận đấu quá gần nhau vào ngày ${date}`
              });
            }
          }
        }
      });
    });

    setConflicts(conflicts);
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : `Đội ${teamId}`;
  };

  const getConflictColor = (type) => {
    switch (type) {
      case 'team_conflict': return 'bg-red-100 text-red-800';
      case 'venue_conflict': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConflictIcon = (type) => {
    switch (type) {
      case 'team_conflict':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'venue_conflict':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Bạn không có quyền truy cập trang tối ưu hóa lịch thi đấu</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Optimization Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Cài đặt tối ưu hóa</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số trận đấu tối đa mỗi ngày:
            </label>
            <input
              type="number"
              value={optimizationSettings.maxMatchesPerDay}
              onChange={(e) => setOptimizationSettings(prev => ({ 
                ...prev, 
                maxMatchesPerDay: parseInt(e.target.value) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="10"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian nghỉ tối thiểu (giờ):
            </label>
            <input
              type="number"
              value={optimizationSettings.minRestHours}
              onChange={(e) => setOptimizationSettings(prev => ({ 
                ...prev, 
                minRestHours: parseInt(e.target.value) 
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="12"
              max="48"
            />
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={optimizationSettings.avoidConcurrentMatches}
              onChange={(e) => setOptimizationSettings(prev => ({ 
                ...prev, 
                avoidConcurrentMatches: e.target.checked 
              }))}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Tránh trận đấu đồng thời</span>
          </label>
          
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={optimizationSettings.prioritizeEvenDistribution}
              onChange={(e) => setOptimizationSettings(prev => ({ 
                ...prev, 
                prioritizeEvenDistribution: e.target.checked 
              }))}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Phân bố đều các trận đấu</span>
          </label>
        </div>
        
        <div className="mt-4 flex space-x-3">
          <button
            onClick={runOptimization}
            disabled={!isConnected}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnected ? 'Tối ưu hóa lịch thi đấu' : 'Đang kết nối...'}
          </button>
          
          <button
            onClick={detectConflicts}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
          >
            Kiểm tra xung đột
          </button>
        </div>
      </div>

      {/* Conflicts Display */}
      {conflicts.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Xung đột lịch thi đấu</h3>
            <p className="text-sm text-gray-600 mt-1">
              Phát hiện {conflicts.length} xung đột
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {conflicts.map((conflict, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-full ${getConflictColor(conflict.type)}`}>
                      {getConflictIcon(conflict.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        {conflict.message}
                      </h4>
                      <div className="mt-2 space-y-1">
                        {conflict.matches.map((match, matchIndex) => (
                          <div key={matchIndex} className="text-sm text-gray-600">
                            • {getTeamName(match.team1_id)} vs {getTeamName(match.team2_id)} - 
                            {new Date(match.scheduled_time).toLocaleString('vi-VN')}
                            {match.venue && ` - Sân ${match.venue}`}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Optimized Schedule */}
      {optimizedSchedule.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Lịch thi đấu đã tối ưu</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {optimizedSchedule.map((match, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">
                        {getTeamName(match.team1_id)} vs {getTeamName(match.team2_id)}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(match.scheduled_time).toLocaleString('vi-VN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Sân {match.venue}</span>
                      <div className="text-xs text-green-600 mt-1">✓ Đã tối ưu</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Realtime Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium">
            {isConnected ? 'Kết nối realtime hoạt động' : 'Không có kết nối realtime'}
          </span>
        </div>
        <p className="text-xs text-blue-600 mt-1">
          {isConnected 
            ? 'Các thay đổi lịch thi đấu sẽ được cập nhật realtime cho tất cả người dùng'
            : 'Các thay đổi chỉ được cập nhật khi refresh trang'
          }
        </p>
      </div>
    </div>
  );
};

export default ScheduleOptimizer; 