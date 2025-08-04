import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';

const StatisticsPage = () => {
  const [stats, setStats] = useState({
    totalTournaments: 0,
    activeTournaments: 0,
    totalTeams: 0,
    totalUsers: 0,
    totalMatches: 0,
    completedMatches: 0,
    totalRegistrations: 0,
    pendingRegistrations: 0
  });

  const [recentMatches, setRecentMatches] = useState([]);
  const [topTeams, setTopTeams] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axiosClient.get('/statistics/dashboard');
        console.log('Dashboard stats response:', response);
        console.log('Dashboard stats data:', response.data);
        
        // Kiểm tra và lấy dữ liệu stats
        let statsData = {};
        if (response.data && typeof response.data === 'object') {
          statsData = response.data;
        } else if (response.data && response.data.data) {
          statsData = response.data.data;
        } else {
          console.warn('Stats data is not an object:', response.data);
          statsData = {};
        }
        
        console.log('Processed stats data:', statsData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats({
          totalTournaments: 0,
          activeTournaments: 0,
          totalTeams: 0,
          totalUsers: 0,
          totalMatches: 0,
          completedMatches: 0,
          totalRegistrations: 0,
          pendingRegistrations: 0
        });
      }
    };

    const fetchRecentMatches = async () => {
      try {
        const response = await axiosClient.get('/statistics/recent-matches?limit=5');
        console.log('Recent matches response:', response);
        console.log('Recent matches data:', response.data);
        
        // Kiểm tra và lấy dữ liệu recent matches
        let matchesData = [];
        if (Array.isArray(response.data)) {
          matchesData = response.data;
        } else if (response.data && Array.isArray(response.data.matches)) {
          matchesData = response.data.matches;
        } else if (response.data && Array.isArray(response.data.data)) {
          matchesData = response.data.data;
        } else {
          console.warn('Recent matches data is not an array:', response.data);
          matchesData = [];
        }
        
        console.log('Processed recent matches data:', matchesData);
        setRecentMatches(matchesData);
      } catch (error) {
        console.error('Error fetching recent matches:', error);
        setRecentMatches([]);
      }
    };

    const fetchTopTeams = async () => {
      try {
        const response = await axiosClient.get('/statistics/top-teams?limit=5');
        console.log('Top teams response:', response);
        console.log('Top teams data:', response.data);
        
        // Kiểm tra và lấy dữ liệu top teams
        let teamsData = [];
        if (Array.isArray(response.data)) {
          teamsData = response.data;
        } else if (response.data && Array.isArray(response.data.teams)) {
          teamsData = response.data.teams;
        } else if (response.data && Array.isArray(response.data.data)) {
          teamsData = response.data.data;
        } else {
          console.warn('Top teams data is not an array:', response.data);
          teamsData = [];
        }
        
        console.log('Processed top teams data:', teamsData);
        setTopTeams(teamsData);
      } catch (error) {
        console.error('Error fetching top teams:', error);
        setTopTeams([]);
      }
    };

    fetchDashboardStats();
    fetchRecentMatches();
    fetchTopTeams();
  }, []);

  const calculatePercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thống kê Tổng quan</h1>
          <p className="text-gray-600">Tổng quan về hoạt động của hệ thống</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng giải đấu</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTournaments}</p>
                <p className="text-xs text-gray-500">{stats.activeTournaments} đang diễn ra</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng đội</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTeams}</p>
                <p className="text-xs text-gray-500">Đã đăng ký</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500">Đã đăng ký</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng trận đấu</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalMatches}</p>
                <p className="text-xs text-gray-500">{stats.completedMatches} đã hoàn thành</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Match Completion Rate */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tỷ lệ hoàn thành trận đấu</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Đã hoàn thành</span>
                  <span>{calculatePercentage(stats.completedMatches, stats.totalMatches)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${calculatePercentage(stats.completedMatches, stats.totalMatches)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {stats.completedMatches} / {stats.totalMatches} trận đấu
              </div>
            </div>
          </div>

          {/* Registration Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Trạng thái đăng ký</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Đã duyệt</span>
                  <span>{calculatePercentage(stats.totalRegistrations - stats.pendingRegistrations, stats.totalRegistrations)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${calculatePercentage(stats.totalRegistrations - stats.pendingRegistrations, stats.totalRegistrations)}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {stats.totalRegistrations - stats.pendingRegistrations} / {stats.totalRegistrations} đăng ký
              </div>
            </div>
          </div>
        </div>

        {/* Recent Matches and Top Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Matches */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Trận đấu gần đây</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{match.tournament}</div>
                      <div className="text-sm text-gray-600">{match.team1} vs {match.team2}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{match.score}</div>
                      <div className="text-xs text-gray-500">{match.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Teams */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Top 5 Đội mạnh nhất</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topTeams.map((team, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{team.name}</div>
                        <div className="text-xs text-gray-500">{team.wins}W - {team.losses}L</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">{team.points} điểm</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Thêm giải đấu</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Tạo trận đấu</span>
            </button>
            <button className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Duyệt đăng ký</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StatisticsPage; 