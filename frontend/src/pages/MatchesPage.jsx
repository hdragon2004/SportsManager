import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import axiosClient from '../services/axiosClient';

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [teams, setTeams] = useState([]);

  const [formData, setFormData] = useState({
    tournament_id: '',
    round_id: '',
    match_date: '',
    location: '',
    status: 'scheduled',
    team1_id: '',
    team2_id: '',
    team1_score: '',
    team2_score: ''
  });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await axiosClient.get('/matches');
        console.log('Matches response:', response);
        console.log('Matches data:', response.data);
        
        // Kiểm tra và lấy dữ liệu matches
        let matchesData = [];
        if (Array.isArray(response.data)) {
          matchesData = response.data;
        } else if (response.data && Array.isArray(response.data.matches)) {
          matchesData = response.data.matches;
        } else if (response.data && Array.isArray(response.data.data)) {
          matchesData = response.data.data;
        } else {
          console.warn('Matches data is not an array:', response.data);
          matchesData = [];
        }
        
        console.log('Processed matches data:', matchesData);
        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setMatches([]);
      }
    };

    const fetchTournaments = async () => {
      try {
        const response = await axiosClient.get('/tournaments');
        console.log('Tournaments response:', response);
        console.log('Tournaments data:', response.data);
        
        // Kiểm tra và lấy dữ liệu tournaments
        let tournamentsData = [];
        if (Array.isArray(response.data)) {
          tournamentsData = response.data;
        } else if (response.data && Array.isArray(response.data.tournaments)) {
          tournamentsData = response.data.tournaments;
        } else if (response.data && Array.isArray(response.data.data)) {
          tournamentsData = response.data.data;
        } else {
          console.warn('Tournaments data is not an array:', response.data);
          tournamentsData = [];
        }
        
        console.log('Processed tournaments data:', tournamentsData);
        setTournaments(tournamentsData);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setTournaments([]);
      }
    };

    const fetchRounds = async () => {
      try {
        // Giả sử có API để lấy rounds
        // const response = await getAllRounds();
        // setRounds(response.data);
        setRounds([
          { id: 1, name: 'Vòng bảng', tournament_id: 1 },
          { id: 2, name: 'Tứ kết', tournament_id: 1 },
          { id: 3, name: 'Bán kết', tournament_id: 1 },
          { id: 4, name: 'Chung kết', tournament_id: 1 },
          { id: 5, name: 'Bán kết', tournament_id: 2 }
        ]);
      } catch (error) {
        console.error('Error fetching rounds:', error);
        setRounds([]);
      }
    };

    const fetchTeams = async () => {
      try {
        const response = await axiosClient.get('/teams');
        setTeams(response.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      }
    };

    fetchMatches();
    fetchTournaments();
    fetchRounds();
    fetchTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMatch) {
        // Update match
                  const response = await axiosClient.put(`/matches/${editingMatch.id}`, formData);
        console.log('Match updated:', response.data);
        setMatches(matches.map(m => 
          m.id === editingMatch.id ? { ...m, ...response.data } : m
        ));
      } else {
        // Create new match
                  const response = await axiosClient.post('/matches', formData);
        console.log('Match created:', response.data);
        setMatches([...matches, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving match:', error);
      alert('Có lỗi xảy ra khi lưu trận đấu');
    }
  };

  const handleEdit = (match) => {
    setEditingMatch(match);
    setFormData({
      tournament_id: match.tournament_id || '',
      round_id: match.round_id || '',
      match_date: match.match_date,
      location: match.location,
      status: match.status,
      team1_id: match.team1_id || '',
      team2_id: match.team2_id || '',
      team1_score: match.team1_score || '',
      team2_score: match.team2_score || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa trận đấu này?')) {
      try {
        await axiosClient.delete(`/matches/${id}`);
        console.log('Match deleted:', id);
        setMatches(matches.filter(m => m.id !== id));
      } catch (error) {
        console.error('Error deleting match:', error);
        alert('Có lỗi xảy ra khi xóa trận đấu');
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMatch(null);
    setFormData({
      tournament_id: '',
      round_id: '',
      match_date: '',
      location: '',
      status: 'scheduled',
      team1_id: '',
      team2_id: '',
      team1_score: '',
      team2_score: ''
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Đã kết thúc';
      case 'ongoing': return 'Đang diễn ra';
      case 'scheduled': return 'Đã lên lịch';
      case 'cancelled': return 'Đã hủy';
      default: return 'Không xác định';
    }
  };

  const filteredRounds = formData.tournament_id 
    ? rounds.filter(r => r.tournament_id == formData.tournament_id)
    : rounds;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý Trận đấu</h1>
            <p className="text-gray-600">Quản lý lịch thi đấu và kết quả trận đấu</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            Thêm Trận đấu
          </Button>
        </div>

        {/* Matches List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Danh sách Trận đấu</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giải đấu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vòng đấu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đội thi đấu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Địa điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kết quả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {matches.map((match) => (
                  <tr key={match.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{match.tournament}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{match.round}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {match.team1} vs {match.team2}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{match.match_date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{match.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(match.status)}`}>
                        {getStatusText(match.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {match.team1_score !== null && match.team2_score !== null 
                          ? `${match.team1_score} - ${match.team2_score}`
                          : 'Chưa có kết quả'
                        }
                      </div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                       <button
                         onClick={() => handleEdit(match)}
                         className="text-blue-600 hover:text-blue-900 mr-4"
                       >
                         Sửa
                       </button>
                       <button
                         onClick={() => handleDelete(match.id)}
                         className="text-red-600 hover:text-red-900"
                       >
                         Xóa
                       </button>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingMatch ? 'Sửa Trận đấu' : 'Thêm Trận đấu'}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giải đấu
                </label>
                <select
                  value={formData.tournament_id}
                  onChange={(e) => setFormData({...formData, tournament_id: e.target.value, round_id: ''})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn giải đấu</option>
                  {tournaments.map(tournament => (
                    <option key={tournament.id} value={tournament.id}>{tournament.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vòng đấu
                </label>
                <select
                  value={formData.round_id}
                  onChange={(e) => setFormData({...formData, round_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn vòng đấu</option>
                  {filteredRounds.map(round => (
                    <option key={round.id} value={round.id}>{round.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đội 1
                </label>
                <select
                  value={formData.team1_id}
                  onChange={(e) => setFormData({...formData, team1_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn đội 1</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đội 2
                </label>
                <select
                  value={formData.team2_id}
                  onChange={(e) => setFormData({...formData, team2_id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Chọn đội 2</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Thời gian thi đấu"
                type="datetime-local"
                value={formData.match_date}
                onChange={(e) => setFormData({...formData, match_date: e.target.value})}
                required
              />

              <Input
                label="Địa điểm"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Điểm đội 1"
                type="number"
                value={formData.team1_score}
                onChange={(e) => setFormData({...formData, team1_score: e.target.value})}
                min="0"
              />

              <Input
                label="Điểm đội 2"
                type="number"
                value={formData.team2_score}
                onChange={(e) => setFormData({...formData, team2_score: e.target.value})}
                min="0"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="scheduled">Đã lên lịch</option>
                  <option value="ongoing">Đang diễn ra</option>
                  <option value="completed">Đã kết thúc</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Hủy
              </Button>
              <Button type="submit">
                {editingMatch ? 'Cập nhật' : 'Thêm'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default MatchesPage; 