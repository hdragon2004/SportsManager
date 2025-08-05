import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MatchSchedule from '../components/MatchSchedule';
import MatchStats from '../components/MatchStats';
import TournamentSocket from '../components/TournamentSocket';
import { getPublicTournamentById } from '../features/tournaments/tournamentAPI';
import axiosClient from '../services/axiosClient';
import { useAuth } from '../contexts/AuthContext';

const TournamentDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [userTeams, setUserTeams] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-900 text-green-300 border-green-700';
      case 'upcoming': return 'bg-blue-900 text-blue-300 border-blue-700';
      case 'completed': return 'bg-gray-700 text-gray-300 border-gray-600';
      case 'registration': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      default: return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang diễn ra';
      case 'upcoming': return 'Sắp diễn ra';
      case 'completed': return 'Đã kết thúc';
      case 'registration': return 'Đang đăng ký';
      default: return 'Không xác định';
    }
  };

  const getMatchStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-900 text-green-300 border-green-700';
      case 'ongoing': return 'bg-blue-900 text-blue-300 border-blue-700';
      case 'scheduled': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
      default: return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };
  
  const getMatchStatusText = (status) => {
     switch (status) {
      case 'completed': return 'Đã kết thúc';
      case 'ongoing': return 'Đang diễn ra';
      case 'scheduled': return 'Đã lên lịch';
      default: return 'Không xác định';
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định';
    const date = new Date(dateString);
    return `lúc ${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', year: 'numeric' })}`;
  };

  // Tính toán thời gian còn lại cho đăng ký
  const calculateTimeLeft = (deadline) => {
    if (!deadline) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const difference = deadlineTime - now;

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  // Kiểm tra trạng thái giải đấu
  const getTournamentPhase = (tournament) => {
    if (!tournament) return 'unknown';
    
    const now = new Date();
    const registrationDeadline = new Date(tournament.signup_deadline || tournament.registration_deadline);
    const startDate = new Date(tournament.start_date);
    const endDate = new Date(tournament.end_date);

    if (now < registrationDeadline) {
      return 'registration';
    } else if (now >= startDate && now <= endDate) {
      return 'active';
    } else if (now > endDate) {
      return 'completed';
    } else {
      return 'upcoming';
    }
  };

  useEffect(() => {
    const fetchTournamentData = async () => {
      setLoading(true);
      try {
        console.log('Fetching tournament data for ID:', id);
        const response = await getPublicTournamentById(id);
        console.log('Tournament response:', response);
        
        if (response.data.success) {
          const tournamentData = response.data.data || {};
          console.log('Tournament data:', tournamentData);
          setTournament(tournamentData);
          setStats(response.data.stats || {});
          setMatches(tournamentData.Matches || []);
        } else {
          console.error('Tournament fetch failed:', response.data);
          setTournament(null);
        }
      } catch (error) {
        console.error('Error fetching tournament data:', error);
        console.error('Error details:', error.response?.data);
        setTournament(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserTeams = async () => {
      if (user) {
        try {
          // Chỉ fetch teams nếu user đã đăng nhập
          const axiosClient = require('../services/axiosClient').default;
          const teamsResponse = await axiosClient.get('/teams');
          if (teamsResponse.data.success) {
            setUserTeams(teamsResponse.data.data || []);
          }
        } catch (error) {
          console.error('Error fetching user teams:', error);
          setUserTeams([]);
        }
      }
    };

    fetchTournamentData();
    fetchUserTeams();
  }, [id, user]);

  // Cập nhật countdown timer
  useEffect(() => {
    if (tournament && (tournament.signup_deadline || tournament.registration_deadline)) {
      const deadline = tournament.signup_deadline || tournament.registration_deadline;
      
      // Kiểm tra trạng thái ban đầu
      const initialTimeLeft = calculateTimeLeft(deadline);
      setTimeLeft(initialTimeLeft);
      
      // Nếu đã hết thời gian ngay từ đầu, không cần set timer
      if (initialTimeLeft.days === 0 && initialTimeLeft.hours === 0 && initialTimeLeft.minutes === 0 && initialTimeLeft.seconds === 0) {
        return;
      }
      
      const timer = setInterval(() => {
        const timeLeft = calculateTimeLeft(deadline);
        setTimeLeft(timeLeft);
        
        // Kiểm tra nếu đã hết thời gian đăng ký
        if (timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [tournament]);

  // Tự động chuyển tab khi giải đấu đang trong thời gian đăng ký
  useEffect(() => {
    if (tournament) {
      const tournamentPhase = getTournamentPhase(tournament);
      if (tournamentPhase === 'registration') {
        setActiveTab('registration');
      } else if (tournamentPhase === 'active') {
        setActiveTab('schedule');
      }
    }
  }, [tournament]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30ddff] mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin giải đấu...</p>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không tìm thấy giải đấu</h2>
          <p className="text-gray-400 mb-4">Giải đấu bạn đang tìm kiếm không tồn tại.</p>
          <Link to="/tournaments" className="bg-[#30ddff] hover:bg-[#00b8d4] text-white px-6 py-2 rounded-lg transition-colors">
            Quay lại danh sách giải đấu
          </Link>
        </div>
      </div>
    );
  }

  const tournamentPhase = getTournamentPhase(tournament);
  const isUpcomingPhase = tournamentPhase === 'upcoming';
  const isActivePhase = tournamentPhase === 'active';

  // Đảm bảo các thuộc tính tồn tại
  const tournamentName = tournament.name || 'Giải đấu không tên';
  const tournamentDescription = tournament.description || 'Không có mô tả';
  const tournamentLocation = tournament.location || 'Chưa xác định';
  const tournamentStartDate = tournament.start_date || new Date();
  const tournamentEndDate = tournament.end_date || new Date();
  const tournamentBannerUrl = tournament.banner_url || null;

  return (
    <>
      <TournamentSocket tournamentId={id} />
      {/* Tournament Header */}
      <section className="relative text-white py-16">
        {/* Background Banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: tournamentBannerUrl 
              ? `url(${tournamentBannerUrl})` 
              : `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%2330ddff;stop-opacity:1" /><stop offset="50%" style="stop-color:%23007bff;stop-opacity:1" /><stop offset="100%" style="stop-color:%236f42c1;stop-opacity:1" /></linearGradient></defs><rect width="100%" height="100%" fill="url(%23grad)"/><g fill="white" opacity="0.1"><circle cx="200" cy="100" r="50"/><circle cx="1000" cy="300" r="80"/><circle cx="400" cy="300" r="40"/><circle cx="800" cy="100" r="60"/></g></svg>')`
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{tournamentName}</h1>
            <p className="text-xl mb-8 text-white/90">{tournamentDescription}</p>
            
            {/* Tournament Details */}
            <div className="flex items-center justify-center space-x-4 mb-6 text-sm">
              <span>Chia Bảng Đấu</span>
              <span className="text-white/50">||</span>
              <span>{tournament.Tournament_Type?.name || 'Bóng Đá'}</span>
              <span className="text-white/50">||</span>
              <span>{tournament.organizer || 'Ban tổ chức'}</span>
              <span className="text-white/50">||</span>
              <span>{tournamentLocation}</span>
            </div>

            {/* Statistics */}
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">{stats.totalTeams || tournament.Registrations?.length || 0}</span>
                <span className="text-sm">Đội</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold">0</span>
                <span className="text-sm">lượt xem</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">❤</span>
              </div>
            </div>

            <span className={`inline-flex px-6 py-3 rounded-full text-sm font-semibold border ${getStatusColor(tournamentPhase)}`}>
              {getStatusText(tournamentPhase)}
            </span>
          </div>
        </div>
      </section>



      {/* Navigation Tabs */}
      <section className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {(isUpcomingPhase ? [
              { id: 'registration', name: 'ĐĂNG KÝ THI ĐẤU' },
              { id: 'registration-list', name: 'DANH SÁCH ĐĂNG KÝ' },
            ] : [
              { id: 'general', name: 'TIN CHUNG' },
              { id: 'teams', name: 'ĐỘI THI ĐẤU' },
              { id: 'schedule', name: 'TRẬN ĐẤU' },
              { id: 'standings', name: 'BẢNG XẾP HẠNG' },
              { id: 'stats', name: 'THỐNG KÊ' }
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#30ddff] text-[#30ddff]'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Content based on active tab */}
          {activeTab === 'registration' && (
            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-8">Đăng ký thi đấu</h3>
              <div className="text-center">
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-white mb-6">Thông tin đăng ký</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-2">Hạn đăng ký:</p>
                      <p className="text-white font-semibold text-lg">
                        {(tournament.signup_deadline || tournament.registration_deadline) ? new Date(tournament.signup_deadline || tournament.registration_deadline).toLocaleDateString('vi-VN') : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-2">Số đội đã đăng ký:</p>
                      <p className="text-white font-semibold text-lg">
                        {stats.totalTeams || tournament.Registrations?.length || 0}/{tournament.max_teams || 0}
                      </p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-2">Số thành viên tối thiểu:</p>
                      <p className="text-white font-semibold text-lg">{tournament.min_players_per_team || 2} người</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                      <p className="text-gray-400 text-sm mb-2">Số thành viên tối đa:</p>
                      <p className="text-white font-semibold text-lg">{tournament.max_players_per_team || 20} người</p>
                    </div>
                  </div>
                </div>
                
                {/* Kiểm tra xem đăng ký có bị đóng do đủ số lượng đội không */}
                {tournament.max_teams && (stats.totalTeams || tournament.Registrations?.length || 0) >= tournament.max_teams ? (
                  <div className="mb-8">
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
                      <div className="flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-red-400 font-semibold text-lg">Đăng ký đã đóng</span>
                      </div>
                      <p className="text-red-300 text-center">
                        Giải đấu đã đủ số lượng đội tham gia ({tournament.max_teams} đội). Đăng ký đã được đóng tự động.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Countdown Timer */}
                    <div className="mb-8">
                      {/* Kiểm tra xem đã hết thời gian đăng ký chưa */}
                      {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0 ? (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6">
                          <div className="flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-red-400 font-semibold text-lg">Hết thời gian đăng ký</span>
                          </div>
                          <p className="text-red-300 text-center">
                            Thời gian đăng ký tham gia giải đấu đã kết thúc. Không thể đăng ký thêm.
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-400 mb-6 text-lg">Thời gian còn lại để đăng ký:</p>
                          <div className="flex justify-center space-x-6">
                            <div className="bg-gray-800 rounded-lg p-6 min-w-[100px] border border-gray-700">
                              <div className="text-3xl font-bold text-[#30ddff]">{timeLeft.days}</div>
                              <div className="text-sm text-gray-400">Ngày</div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-6 min-w-[100px] border border-gray-700">
                              <div className="text-3xl font-bold text-[#30ddff]">{String(timeLeft.hours).padStart(2, '0')}</div>
                              <div className="text-sm text-gray-400">Giờ</div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-6 min-w-[100px] border border-gray-700">
                              <div className="text-3xl font-bold text-[#30ddff]">{String(timeLeft.minutes).padStart(2, '0')}</div>
                              <div className="text-sm text-gray-400">Phút</div>
                            </div>
                            <div className="bg-gray-800 rounded-lg p-6 min-w-[100px] border border-gray-700">
                              <div className="text-3xl font-bold text-[#30ddff]">{String(timeLeft.seconds).padStart(2, '0')}</div>
                              <div className="text-sm text-gray-400">Giây</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Registration Button */}
                    {user && !(timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) && (
                      <>
                        {/* Kiểm tra xem user có đội đã đăng ký giải đấu này chưa */}
                        {(() => {
                          const hasRegistered = tournament.Registrations?.some(registration => 
                            userTeams.some(team => team.id === registration.Team_ID)
                          ) || false;
                          
                          console.log('User teams:', userTeams);
                          console.log('Tournament registrations:', tournament.Registrations);
                          console.log('Has registered:', hasRegistered);
                          
                          return hasRegistered ? (
                            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6">
                              <div className="flex items-center justify-center mb-3">
                                <svg className="w-6 h-6 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="text-yellow-400 font-semibold text-lg">Đã đăng ký</span>
                              </div>
                              <p className="text-yellow-300 text-center">
                                Bạn đã có đội đăng ký tham gia giải đấu này
                              </p>
                            </div>
                          ) : (
                            <Link 
                              to={`/tournaments/${id}/register`}
                              className="inline-block bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-lg text-xl font-bold transition-colors shadow-lg"
                            >
                              Bắt đầu đăng ký
                            </Link>
                          );
                        })()}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {activeTab === 'registration-list' && (
            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-8">Danh sách đăng ký</h3>
              {(tournament.Registrations && tournament.Registrations.length > 0) ? (
                <div className="space-y-4">
                  {tournament.Registrations.map((reg, index) => (
                    <div key={reg.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-750 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="w-10 h-10 bg-[#30ddff] text-white flex items-center justify-center rounded-full font-bold mr-4 text-lg">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-semibold text-white text-lg">{reg.Team?.name || 'Đội chưa xác định'}</p>
                            <p className="text-sm text-gray-400">{reg.Team?.university || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400 mb-1">Đăng ký lúc:</p>
                          <p className="text-sm text-gray-500">
                            {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4 text-lg">Chưa có đội nào đăng ký.</p>
                  <p className="text-sm text-gray-500">Hãy là người đầu tiên đăng ký tham gia!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-8">
              <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-8">Thông tin giải đấu</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <span className="text-sm font-medium text-gray-400 block mb-2">Loại giải:</span>
                    <p className="text-white text-lg">{tournament.Tournament_Type?.name || 'Chưa xác định'}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <span className="text-sm font-medium text-gray-400 block mb-2">Địa điểm:</span>
                    <p className="text-white text-lg">{tournamentLocation}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <span className="text-sm font-medium text-gray-400 block mb-2">Ngày bắt đầu:</span>
                    <p className="text-white text-lg">{formatDate(tournamentStartDate)}</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <span className="text-sm font-medium text-gray-400 block mb-2">Ngày kết thúc:</span>
                    <p className="text-white text-lg">{formatDate(tournamentEndDate)}</p>
                  </div>
                </div>
              </div>

              {stats && (
                <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
                  <MatchStats stats={stats} />
                </div>
              )}

              <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-8">Lịch thi đấu</h3>
                {(matches && matches.length > 0) ? (
                  <MatchSchedule matches={matches.slice(0, 3)} loading={false} />
                ) : (
                  <p className="text-gray-400 text-center py-12 text-lg">Chưa có lịch thi đấu.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-8">Vòng bảng</h3>
              <MatchSchedule matches={matches} loading={false} />
            </div>
          )}

          {activeTab === 'standings' && (
            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-8">Bảng xếp hạng</h3>
              <p className="text-gray-400 text-center py-12 text-lg">Chưa có bảng xếp hạng.</p>
            </div>
          )}

          {activeTab === 'teams' && (
            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-8">Đội thi đấu</h3>
              {(tournament.Registrations && tournament.Registrations.length > 0) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tournament.Registrations.map((reg, index) => (
                    <div key={reg.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:bg-gray-750 transition-colors">
                      <div className="flex items-center">
                        <span className="w-10 h-10 bg-[#30ddff] text-white flex items-center justify-center rounded-full font-bold mr-4 text-lg">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-white text-lg">{reg.Team?.name || 'Đội chưa xác định'}</p>
                          <p className="text-sm text-gray-400">{reg.Team?.university || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12 text-lg">Chưa có đội nào đăng ký.</p>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-8">Thống kê</h3>
              {stats && <MatchStats stats={stats} />}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default TournamentDetailPage;