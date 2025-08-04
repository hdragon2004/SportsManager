import React from 'react';

const MatchSchedule = ({ matches, loading }) => {
  // Đảm bảo matches luôn là một mảng
  const matchesSafe = Array.isArray(matches) ? matches : [];
  
  const getMatchStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Đã kết thúc';
      case 'ongoing': return 'Đang diễn ra';
      case 'scheduled': return 'Đã lên lịch';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'ongoing':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'scheduled':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Đang tải lịch thi đấu...</span>
      </div>
    );
  }

  if (!matchesSafe || matchesSafe.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có lịch thi đấu</h3>
        <p className="text-gray-500">Lịch thi đấu sẽ được cập nhật sớm nhất.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matchesSafe.map((match, index) => (
        <div key={match.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
          {/* Header với ngày và trạng thái */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(match.status)}
                <span className="text-sm font-medium text-gray-500">
                  {formatDate(match.match_date)}
                </span>
              </div>
              <span className="text-sm text-gray-400">
                {formatTime(match.match_date)}
              </span>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getMatchStatusColor(match.status)}`}>
              {getMatchStatusText(match.status)}
            </span>
          </div>
          
          {/* Thông tin trận đấu */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Đội 1 */}
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {match.Teams && match.Teams.length >= 1 ? match.Teams[0]?.name : 'TBD'}
              </div>
              <div className="text-sm text-gray-500">
                {match.Teams && match.Teams.length >= 1 ? match.Teams[0]?.university : 'N/A'}
              </div>
            </div>
            
            {/* VS */}
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">VS</div>
              <div className="text-sm text-gray-500">
                {match.Round?.name || 'Vòng đấu'}
              </div>
            </div>
            
            {/* Đội 2 */}
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {match.Teams && match.Teams.length >= 2 ? match.Teams[1]?.name : 'TBD'}
              </div>
              <div className="text-sm text-gray-500">
                {match.Teams && match.Teams.length >= 2 ? match.Teams[1]?.university : 'N/A'}
              </div>
            </div>
          </div>
          
          {/* Kết quả */}
          {match.result && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <span className="text-lg font-bold text-gray-900">Kết quả: {match.result}</span>
              </div>
            </div>
          )}
          
          {/* Thông tin bổ sung */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Địa điểm:</span>
                <span className="ml-2 text-gray-900">{match.location || 'Chưa xác định'}</span>
              </div>
              {match.description && (
                <div>
                  <span className="font-medium text-gray-500">Ghi chú:</span>
                  <span className="ml-2 text-gray-900">{match.description}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchSchedule; 