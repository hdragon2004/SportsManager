import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import axiosClient from '../services/axiosClient';

const TournamentsPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const [tournamentTypes, setTournamentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    sport: '',
    format: '',
    status: '',
    sort: ''
  });

  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    name: '', type_id: '', start_date: '', end_date: '', location: '',
    rules: '', prize: '', max_teams: '', banner_url: '', status: 'upcoming'
  });

  useEffect(() => {
    const fetchTournaments = async () => {
      setLoading(true);
      try {
        const statusFilter = searchParams.get('status');
        const response = await axiosClient.get('/tournaments', {
          params: statusFilter ? { status: statusFilter } : {}
        });
        const tournamentsData = response.data?.data || [];
        setTournaments(tournamentsData);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setTournaments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTournaments();
  }, [searchParams]);

  useEffect(() => {
    const fetchTournamentTypes = async () => {
      try {
        setTournamentTypes([
          { id: 1, name: 'Single Elimination', description: 'Loại trực tiếp' },
          { id: 2, name: 'Round Robin', description: 'Vòng tròn' },
          { id: 3, name: 'Double Elimination', description: 'Loại trực tiếp kép' }
        ]);
      } catch (error) {
        console.error('Error fetching tournament types:', error);
      }
    };
    fetchTournamentTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTournament) {
        const response = await axiosClient.put(`/tournaments/${editingTournament.id}`, formData);
        setTournaments(tournaments.map(t =>
          t.id === editingTournament.id ? { ...t, ...response.data.data } : t
        ));
      } else {
        const response = await axiosClient.post('/tournaments', formData);
        setTournaments([...tournaments, response.data.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving tournament:', error);
      alert('Có lỗi xảy ra khi lưu giải đấu');
    }
  };

  const handleEdit = (tournament) => {
    setEditingTournament(tournament);
    setFormData({
      name: tournament.name,
      type_id: tournament.type_id || '',
      start_date: tournament.start_date.split(' ')[0],
      end_date: tournament.end_date.split(' ')[0],
      location: tournament.location,
      rules: tournament.rules || '',
      prize: tournament.prize || '',
      max_teams: tournament.max_teams,
      banner_url: tournament.banner_url || '',
      status: tournament.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa giải đấu này?')) {
      try {
        await axiosClient.delete(`/tournaments/${id}`);
        setTournaments(tournaments.filter(t => t.id !== id));
      } catch (error) {
        console.error('Error deleting tournament:', error);
        alert('Có lỗi xảy ra khi xóa giải đấu');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTournament(null);
    setFormData({
      name: '', type_id: '', start_date: '', end_date: '', location: '',
      rules: '', prize: '', max_teams: '', banner_url: '', status: 'upcoming'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-900 text-green-300 border-green-700';
      case 'upcoming': return 'bg-blue-900 text-blue-300 border-blue-700';
      case 'completed': return 'bg-gray-700 text-gray-300 border-gray-600';
      default: return 'bg-gray-700 text-gray-300 border-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Đang diễn ra';
      case 'upcoming': return 'Sắp diễn ra';
      case 'completed': return 'Đã kết thúc';
      default: return status;
    }
  };

  const filteredTournaments = tournaments.filter(tournament => {
    // Loại bỏ các giải đấu đã kết thúc
    if (tournament.status === 'completed') return false;
    
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = !filters.sport || tournament.Tournament_Type?.name === filters.sport;
    const matchesFormat = !filters.format || tournament.Tournament_Type?.name === filters.format;
    const matchesStatus = !filters.status || tournament.status === filters.status;
    
    return matchesSearch && matchesSport && matchesFormat && matchesStatus;
  });

  const TournamentCard = ({ tournament }) => (
    <Link 
      to={`/tournaments/${tournament.id}`}
      className="block bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-[#30ddff]/30 hover:scale-105 cursor-pointer group"
    >
      {/* Banner Section */}
      <div className="relative h-48 bg-gradient-to-br from-[#30ddff] via-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        {/* Tournament Info Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          {/* Top Section - Title and Favorite */}
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-white leading-tight group-hover:text-[#30ddff] transition-colors">
              {tournament.name}
            </h3>
            <button className="text-white hover:text-[#30ddff] transition-colors opacity-0 group-hover:opacity-100">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Bottom Section - Details and Stats */}
          <div className="space-y-3">
            {/* Tournament Details */}
            <div className="text-sm text-white/90">
              Chia Bảng Đấu || Bóng Đá Sân 7 || BTC GIẢI ĐẤU || {tournament.location}
            </div>

            {/* Stats and Progress */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  <span className="text-sm text-white/70">20</span>
                </div>
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-white/70">36</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-xs text-white/70">16/48</div>
                <div className="w-20 h-2 bg-white/20 rounded-full">
                  <div className="w-1/3 h-full bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="p-4">
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(tournament.status)}`}>
          {getStatusText(tournament.status)}
        </span>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="space-y-6 p-6">
      {/* Search and Filter Bar */}
      <div className="space-y-6">
        {/* Modern Search Section */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <div className="w-6 h-6 bg-gradient-to-r from-[#30ddff] to-[#00b8d4] rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm giải đấu, đội bóng, địa điểm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-20 pr-6 py-5 bg-gray-800/80 backdrop-blur-xl rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#30ddff] focus:bg-gray-800 transition-all duration-300 border border-gray-600 text-lg"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-6">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>⌘K</span>
              <div className="w-px h-4 bg-gray-600"></div>
              <span>{filteredTournaments.length} kết quả</span>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="flex items-center justify-between">
          {/* Filter Pills */}
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <select
                value={filters.sport}
                onChange={(e) => setFilters({...filters, sport: e.target.value})}
                className="appearance-none bg-gray-800/80 backdrop-blur-xl border border-gray-600 rounded-xl px-5 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#30ddff] focus:bg-gray-800 transition-all duration-300 cursor-pointer hover:bg-gray-700/80 text-sm font-medium"
              >
                <option value="">🏈 Môn Thi Đấu</option>
                <option value="Bóng Đá">⚽ Bóng Đá</option>
                <option value="Bóng Rổ">🏀 Bóng Rổ</option>
                <option value="Cầu Lông">🏸 Cầu Lông</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative group">
              <select
                value={filters.format}
                onChange={(e) => setFilters({...filters, format: e.target.value})}
                className="appearance-none bg-gray-800/80 backdrop-blur-xl border border-gray-600 rounded-xl px-5 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#30ddff] focus:bg-gray-800 transition-all duration-300 cursor-pointer hover:bg-gray-700/80 text-sm font-medium"
              >
                <option value="">📋 Hình Thức</option>
                <option value="Single Elimination">🏆 Loại trực tiếp</option>
                <option value="Round Robin">🔄 Vòng tròn</option>
                <option value="Double Elimination">⚔️ Loại trực tiếp kép</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative group">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="appearance-none bg-gray-800/80 backdrop-blur-xl border border-gray-600 rounded-xl px-5 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#30ddff] focus:bg-gray-800 transition-all duration-300 cursor-pointer hover:bg-gray-700/80 text-sm font-medium"
              >
                <option value="">📊 Trạng Thái</option>
                <option value="upcoming">⏰ Sắp diễn ra</option>
                <option value="active">🔥 Đang diễn ra</option>
                <option value="completed">✅ Đã kết thúc</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative group">
              <select
                value={filters.sort}
                onChange={(e) => setFilters({...filters, sort: e.target.value})}
                className="appearance-none bg-gray-800/80 backdrop-blur-xl border border-gray-600 rounded-xl px-5 py-3 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-[#30ddff] focus:bg-gray-800 transition-all duration-300 cursor-pointer hover:bg-gray-700/80 text-sm font-medium"
              >
                <option value="">📈 Sắp Xếp</option>
                <option value="name">🔤 Tên A-Z</option>
                <option value="date">📅 Ngày tạo</option>
                <option value="status">🏷️ Trạng thái</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-800/80 backdrop-blur-xl border border-gray-600 rounded-2xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-xl transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white shadow-lg scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/80'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-xl transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white shadow-lg scale-105' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/80'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Tournament Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#30ddff]"></div>
          <p className="mt-2 text-gray-400">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredTournaments.length > 0 ? (
            filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-300">Không có giải đấu nào</h3>
                <p className="mt-1 text-sm text-gray-400">Không tìm thấy giải đấu nào phù hợp với bộ lọc hiện tại.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTournament ? 'Sửa Giải đấu' : 'Thêm Giải đấu'}>
        {/* Form content sẽ được thêm sau */}
      </Modal>
      </div>
    </div>
  );
};

export default TournamentsPage;