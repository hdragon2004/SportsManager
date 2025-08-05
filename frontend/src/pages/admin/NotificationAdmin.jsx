import React, { useState, useEffect } from 'react';
import axiosClient from '../../services/axiosClient';

const NotificationAdmin = () => {
  const [todayMatches, setTodayMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchTodayMatches();
  }, []);

  const fetchTodayMatches = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/api/notifications/today-matches');
      setTodayMatches(response.data.data || []);
    } catch (error) {
      console.error('Error fetching today matches:', error);
      showMessage('Lỗi khi lấy thông tin trận đấu hôm nay', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sendTodayTournamentsNotification = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.post('/api/notifications/send-today-tournaments');
      
      if (response.data.success) {
        showMessage('Đã gửi thông báo thành công!', 'success');
        fetchTodayMatches(); // Refresh data
      } else {
        showMessage('Có lỗi xảy ra khi gửi thông báo', 'error');
      }
    } catch (error) {
      console.error('Error sending today tournaments notification:', error);
      showMessage('Lỗi khi gửi thông báo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const sendMatchReminderNotification = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.post('/api/notifications/send-match-reminder', {
        minutesBefore: 30
      });
      
      if (response.data.success) {
        showMessage('Đã gửi thông báo nhắc nhở thành công!', 'success');
      } else {
        showMessage('Có lỗi xảy ra khi gửi thông báo nhắc nhở', 'error');
      }
    } catch (error) {
      console.error('Error sending match reminder notification:', error);
      showMessage('Lỗi khi gửi thông báo nhắc nhở', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startNotificationSchedule = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.post('/api/notifications/start-schedule');
      
      if (response.data.success) {
        showMessage('Đã khởi động lịch trình gửi thông báo tự động!', 'success');
      } else {
        showMessage('Có lỗi xảy ra khi khởi động lịch trình', 'error');
      }
    } catch (error) {
      console.error('Error starting notification schedule:', error);
      showMessage('Lỗi khi khởi động lịch trình thông báo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Quản lý Thông báo Tự động
        </h1>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={sendTodayTournamentsNotification}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Đang gửi...' : 'Gửi thông báo giải đấu hôm nay'}
          </button>

          <button
            onClick={sendMatchReminderNotification}
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Đang gửi...' : 'Gửi nhắc nhở trận đấu'}
          </button>

          <button
            onClick={startNotificationSchedule}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Đang khởi động...' : 'Khởi động lịch trình tự động'}
          </button>
        </div>

        {/* Today's Matches */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Trận đấu hôm nay ({formatDate(new Date())})
            </h2>
            <button
              onClick={fetchTodayMatches}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {loading ? 'Đang tải...' : 'Làm mới'}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang tải thông tin trận đấu...</p>
            </div>
          ) : todayMatches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Không có trận đấu nào diễn ra hôm nay</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayMatches.map((match) => (
                <div key={match.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {match.Tournament?.name}
                      </h3>
                      <p className="text-gray-600">
                        Thời gian: {formatTime(match.match_date)}
                      </p>
                      <p className="text-gray-600">
                        Địa điểm: {match.location}
                      </p>
                      <p className="text-gray-600">
                        Trạng thái: {match.status}
                      </p>
                      
                      {/* Teams */}
                      {match.Teams && match.Teams.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Các đội tham gia:</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {match.Teams.map((team, index) => (
                              <span
                                key={team.id}
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                              >
                                {team.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        match.status === 'scheduled' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : match.status === 'in_progress'
                          ? 'bg-green-100 text-green-800'
                          : match.status === 'completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {match.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Information Panel */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Thông tin về Hệ thống Thông báo Tự động
          </h3>
          <div className="space-y-3 text-blue-800">
            <p>
              <strong>• Gửi thông báo giải đấu hôm nay:</strong> Gửi thông báo cho tất cả users về các giải đấu diễn ra hôm nay
            </p>
            <p>
              <strong>• Gửi nhắc nhở trận đấu:</strong> Gửi thông báo nhắc nhở cho các trận đấu sắp diễn ra trong 30 phút tới
            </p>
            <p>
              <strong>• Khởi động lịch trình tự động:</strong> Bật chế độ tự động gửi thông báo vào 8:00 sáng mỗi ngày và nhắc nhở mỗi 30 phút
            </p>
            <p>
              <strong>• Lưu ý:</strong> Hệ thống sẽ tự động gửi thông báo qua cả database và realtime socket
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationAdmin; 