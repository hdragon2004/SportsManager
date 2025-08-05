import React, { useState, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import axiosClient from '../services/axiosClient';

const ScheduleGenerator = ({ tournamentId, onScheduleGenerated }) => {
  const { user, isAdmin } = useAuth();
  const { socket, isConnected } = useSocket();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [settings, setSettings] = useState({
    fields: 2,
    startDate: new Date().toISOString().split('T')[0],
    maxMatchesPerDay: 4,
    minRestHours: 24
  });

  useEffect(() => {
    if (tournamentId) {
      fetchTeams();
    }
  }, [tournamentId]);

  const fetchTeams = async () => {
    try {
      const response = await axiosClient.get(`/tournaments/${tournamentId}/teams`);
      setTeams(response.data || []);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const generateSchedule = async () => {
    if (!isAdmin) {
      alert('Bạn không có quyền tạo lịch thi đấu');
      return;
    }

    if (teams.length < 2) {
      alert('Cần ít nhất 2 đội để tạo lịch thi đấu');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosClient.post(`/tournaments/${tournamentId}/generate-schedule`, {
        teams: teams.map(team => ({ id: team.id, name: team.name })),
        settings
      });

      if (response.data.success) {
        setSchedule(response.data.data);
        
        // Emit socket event
        if (socket && isConnected) {
          socket.emit('scheduleGenerated', {
            tournamentId,
            schedule: response.data.data
          });
        }

        if (onScheduleGenerated) {
          onScheduleGenerated(response.data.data);
        }

        alert('Tạo lịch thi đấu thành công!');
      } else {
        alert('Có lỗi xảy ra khi tạo lịch thi đấu');
      }
    } catch (error) {
      console.error('Error generating schedule:', error);
      alert('Có lỗi xảy ra khi tạo lịch thi đấu');
    } finally {
      setLoading(false);
    }
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : `Đội ${teamId}`;
  };

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleString('vi-VN');
  };

  if (!isAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Bạn không có quyền tạo lịch thi đấu</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Cài đặt tạo lịch thi đấu</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng sân thi đấu:
            </label>
            <input
              type="number"
              value={settings.fields}
              onChange={(e) => setSettings(prev => ({ ...prev, fields: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="5"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu:
            </label>
            <input
              type="date"
              value={settings.startDate}
              onChange={(e) => setSettings(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số trận tối đa mỗi ngày:
            </label>
            <input
              type="number"
              value={settings.maxMatchesPerDay}
              onChange={(e) => setSettings(prev => ({ ...prev, maxMatchesPerDay: parseInt(e.target.value) }))}
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
              value={settings.minRestHours}
              onChange={(e) => setSettings(prev => ({ ...prev, minRestHours: parseInt(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="12"
              max="48"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button
            onClick={generateSchedule}
            disabled={loading || !isConnected || teams.length < 2}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tạo lịch...' : 'Tạo lịch thi đấu'}
          </button>
        </div>
      </div>

      {/* Teams List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Đội tham gia ({teams.length})</h3>
        </div>
        
        <div className="p-6">
          {teams.length === 0 ? (
            <p className="text-center text-gray-500">Chưa có đội nào tham gia</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team) => (
                <div key={team.id} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold">{team.name}</h4>
                  <p className="text-sm text-gray-600">Huấn luyện viên: {team.User?.name || 'Không có'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generated Schedule */}
      {schedule && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Lịch thi đấu đã tạo</h3>
            <p className="text-sm text-gray-600 mt-1">
              {schedule.totalMatches} trận đấu, {schedule.totalRounds} vòng, 
              dự kiến {schedule.estimatedDuration} ngày
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {schedule.rounds.map((round, roundIndex) => (
                <div key={roundIndex} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold mb-3">Vòng {round.roundNumber}</h4>
                  
                  <div className="space-y-3">
                    {round.matches.map((match, matchIndex) => (
                      <div key={matchIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">
                            {getTeamName(match.team1_id)} vs {getTeamName(match.team2_id)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatDateTime(match.scheduled_time)}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">
                            {match.venue}
                          </div>
                          <div className="text-xs text-gray-500">
                            {match.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {schedule.conflicts && schedule.conflicts.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Xung đột được phát hiện ({schedule.conflicts.length})
                </h4>
                <div className="space-y-2">
                  {schedule.conflicts.map((conflict, index) => (
                    <div key={index} className="text-sm text-yellow-700">
                      • {conflict.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            ? 'Lịch thi đấu sẽ được thông báo realtime cho tất cả người dùng'
            : 'Lịch thi đấu chỉ được cập nhật khi refresh trang'
          }
        </p>
      </div>
    </div>
  );
};

export default ScheduleGenerator; 