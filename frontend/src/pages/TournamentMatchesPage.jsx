import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MatchSchedule from '../components/MatchSchedule';
import MatchStats from '../components/MatchStats';
import axiosClient from '../services/axiosClient';

const TournamentMatchesPage = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, ongoing

  // Đảm bảo matches luôn là một mảng
  const matchesSafe = Array.isArray(matches) ? matches : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin tournament
        const tournamentResponse = await axiosClient.get(`/tournaments/${tournamentId}`);
        setTournament(tournamentResponse.data);

        // Lấy danh sách matches
        const matchesResponse = await axiosClient.get(`/tournaments/${tournamentId}/matches`);
        setMatches(matchesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setMatchesLoading(false);
      }
    };

    fetchData();
  }, [tournamentId]);

  const getFilteredMatches = () => {
    if (filter === 'all') return matchesSafe;
    return matchesSafe.filter(match => match.status === filter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-900 text-green-300 border-green-700';
      case 'upcoming': return 'bg-blue-900 text-blue-300 border-blue-700';
      case 'completed': return 'bg-gray-700 text-gray-300 border-gray-600';
      case 'cancelled': return 'bg-red-900 text-red-300 border-red-700';
      case 'ongoing': return 'bg-blue-900 text-blue-300 border-blue-700';
      default: return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang diễn ra';
      case 'upcoming': return 'Sắp diễn ra';
      case 'completed': return 'Đã kết thúc';
      case 'cancelled': return 'Đã hủy';
      case 'scheduled': return 'Đã lên lịch';
      case 'ongoing': return 'Đang diễn ra';
      default: return 'Không xác định';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Chưa xác định';
    return new Date(timeString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const MatchCard = ({ match }) => (
    <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-[#30ddff]/30 transition-all duration-300">
      {/* Match Header */}
      <div className="bg-gradient-to-r from-[#30ddff] to-[#00b8d4] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="text-white font-semibold">Trận đấu #{match.id}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(match.status)}`}>
            {getStatusText(match.status)}
          </span>
        </div>
      </div>

      {/* Match Content */}
      <div className="p-6">
        {/* Teams Section */}
        <div className="flex items-center justify-between mb-6">
          {/* Team 1 */}
          <div className="text-center flex-1">
            <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-gray-600">
              <span className="text-[#30ddff] font-bold text-xl">
                {match.team1?.name?.charAt(0) || 'T1'}
              </span>
            </div>
            <h3 className="font-semibold text-white text-lg mb-1">
              {match.team1?.name || 'Đội 1'}
            </h3>
            <p className="text-gray-400 text-sm">{match.team1?.university || 'N/A'}</p>
          </div>
          
          {/* VS Section */}
          <div className="text-center mx-6">
            <div className="text-3xl font-bold text-[#30ddff] mb-2">VS</div>
            <div className="text-xs text-gray-400">Trận đấu</div>
            {match.result && (
              <div className="mt-2 text-sm font-medium text-white bg-gray-800 px-3 py-1 rounded-full">
                {match.result}
              </div>
            )}
          </div>
          
          {/* Team 2 */}
          <div className="text-center flex-1">
            <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-gray-600">
              <span className="text-[#30ddff] font-bold text-xl">
                {match.team2?.name?.charAt(0) || 'T2'}
              </span>
            </div>
            <h3 className="font-semibold text-white text-lg mb-1">
              {match.team2?.name || 'Đội 2'}
            </h3>
            <p className="text-gray-400 text-sm">{match.team2?.university || 'N/A'}</p>
          </div>
        </div>

        {/* Match Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-gray-400">
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">{formatDate(match.scheduled_time)}</span>
          </div>
          
          <div className="flex items-center text-gray-400">
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{formatTime(match.scheduled_time)}</span>
          </div>
          
          {match.venue && (
            <div className="flex items-center text-gray-400">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">{match.venue}</span>
            </div>
          )}

          {match.round && (
            <div className="flex items-center text-gray-400">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm">Vòng {match.round}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button className="flex-1 bg-[#30ddff] text-white py-2 px-4 rounded-lg hover:bg-[#00b8d4] transition-colors duration-200 font-medium">
            Xem chi tiết
          </button>
          <button className="flex-1 bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium border border-gray-600">
            Cập nhật kết quả
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-black min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30ddff] mx-auto mb-4"></div>
            <p className="text-gray-400">Đang tải thông tin...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="bg-black min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy giải đấu</h2>
            <p className="text-gray-400 mb-4">Giải đấu bạn đang tìm kiếm không tồn tại.</p>
            <Link 
              to="/tournaments"
              className="bg-[#30ddff] hover:bg-[#00b8d4] text-white px-6 py-2 rounded-lg transition-colors"
            >
              Quay lại danh sách giải đấu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const filteredMatches = getFilteredMatches();

  return (
    <div className="bg-black min-h-screen">
      {/* Tournament Header */}
      <section className="relative text-white py-12">
        {/* Background Banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: tournament.banner_url 
              ? `url(${tournament.banner_url})` 
              : `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%2330ddff;stop-opacity:1" /><stop offset="50%" style="stop-color:%23007bff;stop-opacity:1" /><stop offset="100%" style="stop-color:%236f42c1;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(%23grad)"/><g fill="white" opacity="0.1"><circle cx="200" cy="100" r="50"/><circle cx="1000" cy="300" r="80"/><circle cx="400" cy="300" r="40"/><circle cx="800" cy="100" r="60"/></g></svg>')`
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                to={`/tournaments/${tournamentId}`}
                className="text-white/80 hover:text-white transition-colors mb-4 inline-block"
              >
                ← Quay lại chi tiết giải đấu
              </Link>
              <h1 className="text-3xl font-bold mb-2">{tournament.name}</h1>
              <p className="text-lg text-white/90">{tournament.description}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(tournament.status)}`}>
                {getStatusText(tournament.status)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tournament Stats */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Thống kê trận đấu</h3>
            <MatchStats matches={matchesSafe} />
          </div>

          {/* Filters */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Lọc trận đấu</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-[#30ddff] text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                Tất cả ({matchesSafe.length})
              </button>
              <button
                onClick={() => setFilter('scheduled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'scheduled'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                Sắp diễn ra ({matchesSafe.filter(m => m.status === 'scheduled').length})
              </button>
              <button
                onClick={() => setFilter('ongoing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'ongoing'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                Đang diễn ra ({matchesSafe.filter(m => m.status === 'ongoing').length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                Đã hoàn thành ({matchesSafe.filter(m => m.status === 'completed').length})
              </button>
            </div>
          </div>

          {/* Matches Grid */}
          <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Chi tiết trận đấu - {tournament.name}
              </h2>
              <div className="text-sm text-gray-400">
                {formatDate(tournament.start_date)} - {formatDate(tournament.end_date)}
              </div>
            </div>
            
            {filteredMatches.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center border border-gray-600">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Không có trận đấu nào</h3>
                <p className="text-gray-400">Hiện tại không có trận đấu nào phù hợp với bộ lọc của bạn.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TournamentMatchesPage; 