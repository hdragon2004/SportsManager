import React, { useState, useEffect } from 'react';
import axiosClient from '../services/axiosClient';
import { Link } from 'react-router-dom';

const SchedulePage = () => {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        
        // Fetch matches
        const matchesResponse = await axiosClient.get('/matches');
        let matchesData = [];
        if (Array.isArray(matchesResponse.data)) {
          matchesData = matchesResponse.data;
        } else if (matchesResponse.data && Array.isArray(matchesResponse.data.matches)) {
          matchesData = matchesResponse.data.matches;
        } else if (matchesResponse.data && Array.isArray(matchesResponse.data.data)) {
          matchesData = matchesResponse.data.data;
        }
        setMatches(matchesData);

        // Fetch tournaments
        const tournamentsResponse = await axiosClient.get('/tournaments');
        let tournamentsData = [];
        if (Array.isArray(tournamentsResponse.data)) {
          tournamentsData = tournamentsResponse.data;
        } else if (tournamentsResponse.data && Array.isArray(tournamentsResponse.data.tournaments)) {
          tournamentsData = tournamentsResponse.data.tournaments;
        } else if (tournamentsResponse.data && Array.isArray(tournamentsResponse.data.data)) {
          tournamentsData = tournamentsResponse.data.data;
        }
        setTournaments(tournamentsData);
      } catch (error) {
        console.error('Error fetching schedule data:', error);
        setMatches([]);
        setTournaments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  // Filter matches based on status
  const filteredMatches = matches.filter(match => {
    // Loại bỏ các trận đấu thuộc giải đấu đã kết thúc
    if (match.tournament?.status === 'completed') return false;
    
    // Loại bỏ các trận đấu đã kết thúc
    if (match.status === 'completed') return false;
    
    if (filterStatus === 'all') return true;
    if (filterStatus === 'upcoming') return match.status === 'upcoming';
    if (filterStatus === 'ongoing') return match.status === 'ongoing';
    return true;
  });

  // Lọc các giải đấu không hiển thị giải đấu đã kết thúc
  const activeTournaments = tournaments.filter(tournament => tournament.status !== 'completed');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-900 text-blue-300 border-blue-700';
      case 'ongoing':
        return 'bg-green-900 text-green-300 border-green-700';
      case 'completed':
        return 'bg-gray-700 text-gray-300 border-gray-600';
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'ongoing':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã kết thúc';
      default:
        return 'Không xác định';
    }
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#30ddff] mx-auto"></div>
            <p className="mt-4 text-gray-400 text-lg">Đang tải lịch thi đấu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Lịch Thi Đấu</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Theo dõi các trận đấu đang diễn ra và sắp diễn ra trong các giải đấu
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 mb-8 border border-gray-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-300 font-medium">Trạng thái:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-[#30ddff] focus:border-[#30ddff]"
              >
                <option value="all">Tất cả</option>
                <option value="upcoming">Sắp diễn ra</option>
                <option value="ongoing">Đang diễn ra</option>
              </select>
            </div>
            
            <div className="text-sm text-gray-400">
              Tổng cộng: <span className="font-semibold text-[#30ddff]">{filteredMatches.length}</span> trận đấu
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMatches.length > 0 ? (
            filteredMatches.map((match) => (
              <div key={match.id} className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-[#30ddff]/30">
                {/* Match Header */}
                <div className="bg-gradient-to-r from-[#30ddff] to-[#00b8d4] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold">
                      {match.tournament?.name || 'Giải đấu'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(match.status)}`}>
                      {getStatusText(match.status)}
                    </span>
                  </div>
                </div>

                {/* Match Content */}
                <div className="p-6">
                  {/* Teams */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center flex-1">
                      <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center border border-gray-600">
                        <span className="text-[#30ddff] font-bold text-lg">
                          {match.team1?.name?.charAt(0) || 'T1'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white text-sm">
                        {match.team1?.name || 'Đội 1'}
                      </h3>
                    </div>
                    
                    <div className="text-center mx-4">
                      <div className="text-2xl font-bold text-[#30ddff]">VS</div>
                      <div className="text-xs text-gray-400">Trận đấu</div>
                    </div>
                    
                    <div className="text-center flex-1">
                      <div className="w-16 h-16 bg-gray-800 rounded-full mx-auto mb-3 flex items-center justify-center border border-gray-600">
                        <span className="text-[#30ddff] font-bold text-lg">
                          {match.team2?.name?.charAt(0) || 'T2'}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white text-sm">
                        {match.team2?.name || 'Đội 2'}
                      </h3>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{formatDate(match.scheduled_time)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{formatTime(match.scheduled_time)}</span>
                    </div>
                    
                    {match.venue && (
                      <div className="flex items-center text-gray-400">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{match.venue}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-6">
                    <Link 
                      to={`/tournaments/${match.tournament?.id}/matches`}
                      className="block w-full bg-[#30ddff] text-white py-2 px-4 rounded-lg hover:bg-[#00b8d4] transition-colors duration-200 font-medium text-center"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center border border-gray-600">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Không có trận đấu nào</h3>
              <p className="text-gray-400">Hiện tại không có trận đấu nào phù hợp với bộ lọc của bạn.</p>
            </div>
          )}
        </div>

        {/* Upcoming Tournaments Section */}
        {activeTournaments.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Giải đấu sắp diễn ra</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeTournaments.slice(0, 6).map((tournament) => (
                <div key={tournament.id} className="bg-gray-900 rounded-xl shadow-md p-4 hover:shadow-lg transition-all duration-200 border border-gray-700 hover:border-[#30ddff]/30">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">{tournament.name}</h3>
                    <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full border border-green-700">
                      Sắp diễn ra
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{tournament.description}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(tournament.start_date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchedulePage; 