import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import { useAuth } from '../contexts/AuthContext';
import { getAllTeams } from '../features/teams/teamAPI';

const RegistrationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [userTeams, setUserTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    teamId: '',
    note: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Kiểm tra quyền đăng ký
  const canRegister = () => {
    if (!tournament) return false;
    
    // Kiểm tra deadline
    if (tournament.signup_deadline && new Date() > new Date(tournament.signup_deadline)) {
      return false;
    }
    
    // Kiểm tra số lượng đội đã đăng ký
    if (tournament.max_teams && (tournament.Registrations?.length || 0) >= tournament.max_teams) {
      return false;
    }
    
    return true;
  };

  const hasTeamRegistered = () => {
    if (!tournament || !userTeams.length) return false;
    
    // Kiểm tra xem có đội nào của user đã đăng ký giải đấu này chưa
    return tournament.Registrations?.some(registration => 
      userTeams.some(team => team.id === registration.Team_ID)
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Lấy thông tin tournament
        console.log('RegistrationPage - Fetching tournament with ID:', id);
        const tournamentResponse = await axiosClient.get(`/tournaments/${id}`);
        console.log('RegistrationPage - Tournament response:', tournamentResponse.data);
        
        if (tournamentResponse.data.success) {
          setTournament(tournamentResponse.data.data);
        } else {
          console.log('RegistrationPage - Tournament fetch failed, redirecting');
          navigate('/tournaments');
          return;
        }

        // Lấy danh sách teams của user
        console.log('RegistrationPage - Fetching user teams');
        try {
          const teamsResponse = await getAllTeams();
          console.log('RegistrationPage - Teams response:', teamsResponse.data);
          
          if (teamsResponse.data.success) {
            setUserTeams(teamsResponse.data.data);
            console.log('RegistrationPage - Set user teams:', teamsResponse.data.data);
          } else {
            console.log('RegistrationPage - Teams fetch failed:', teamsResponse.data.message);
          }
        } catch (teamsError) {
          console.error('RegistrationPage - Error fetching teams:', teamsError);
          // Không redirect nếu chỉ lỗi lấy teams
        }
      } catch (error) {
        console.error('RegistrationPage - Error fetching data:', error);
        navigate('/tournaments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    // Kiểm tra quyền khi component mount
    console.log('RegistrationPage - useEffect check - Loading:', loading);
    console.log('RegistrationPage - useEffect check - User:', user);
    
    if (!loading) {
      if (!user) {
        console.log('RegistrationPage - No user, redirecting to tournaments');
        navigate('/tournaments');
        return;
      }
      
      const canRegisterResult = canRegister();
      console.log('RegistrationPage - Can register result:', canRegisterResult);
      
      if (!canRegisterResult) {
        console.log('RegistrationPage - User cannot register, redirecting to tournaments');
        navigate('/tournaments');
        return;
      }
      
      console.log('RegistrationPage - User can register, staying on page');
    }
  }, [loading, navigate, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi khi user bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.teamId) {
      newErrors.teamId = 'Vui lòng chọn đội bóng';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const response = await axiosClient.post(`/registrations`, {
        Tournament_ID: parseInt(id),
        Team_ID: parseInt(formData.teamId),
        note: formData.note,
        time: new Date().toISOString()
      });

      if (response.data.success) {
        alert('Đăng ký thành công! Đội bóng của bạn đã được gửi để xét duyệt.');
        navigate(`/tournaments/${id}`);
      } else {
        setErrors({ submit: response.data.message || 'Đăng ký thất bại' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Có lỗi xảy ra khi đăng ký' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#30ddff] mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!canRegister()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Đăng ký đã đóng</h2>
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-400 font-semibold text-lg">Không thể đăng ký</span>
            </div>
            <div className="text-red-300 text-sm space-y-2">
              {tournament?.signup_deadline && new Date() > new Date(tournament.signup_deadline) && (
                <p>• Đã quá hạn đăng ký (Hạn chót: {new Date(tournament.signup_deadline).toLocaleDateString('vi-VN')})</p>
              )}
              {tournament?.max_teams && (tournament.Registrations?.length || 0) >= tournament.max_teams && (
                <p>• Giải đấu đã đủ số lượng đội tham gia ({tournament.max_teams} đội)</p>
              )}
            </div>
          </div>
          <Link to="/tournaments" className="bg-[#30ddff] hover:bg-[#00b8d4] text-white px-6 py-2 rounded-lg transition-colors">
            Quay lại danh sách giải đấu
          </Link>
        </div>
      </div>
    );
  }

  // Kiểm tra xem đội đã đăng ký giải đấu này chưa
  if (hasTeamRegistered()) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Đã đăng ký</h2>
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-yellow-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-yellow-400 font-semibold text-lg">Đội đã đăng ký</span>
            </div>
            <div className="text-yellow-300 text-sm space-y-2">
              <p>• Một trong các đội của bạn đã đăng ký tham gia giải đấu này</p>
              <p>• Không thể đăng ký lại với cùng một giải đấu</p>
            </div>
          </div>
          <Link to="/tournaments" className="bg-[#30ddff] hover:bg-[#00b8d4] text-white px-6 py-2 rounded-lg transition-colors">
            Quay lại danh sách giải đấu
          </Link>
        </div>
      </div>
    );
  }

  if (userTeams.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Không có đội bóng</h2>
          <p className="text-gray-400 mb-4">Bạn cần tạo đội bóng trước khi đăng ký tham gia giải đấu.</p>
          <div className="space-x-4">
            <Link to="/teams/create" className="bg-[#30ddff] hover:bg-[#00b8d4] text-white px-6 py-2 rounded-lg transition-colors">
              Tạo đội bóng mới
            </Link>
            <Link to="/tournaments" className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors">
              Quay lại danh sách giải đấu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Đăng ký tham gia giải đấu</h1>
          <p className="text-gray-400">{tournament?.name}</p>
        </div>

        {/* Tournament Info */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Thông tin giải đấu</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <p><span className="font-medium">Thời gian:</span> {new Date(tournament?.start_date).toLocaleDateString('vi-VN')} - {new Date(tournament?.end_date).toLocaleDateString('vi-VN')}</p>
              <p><span className="font-medium">Địa điểm:</span> {tournament?.location}</p>
            </div>
            <div>
              <p><span className="font-medium">Hạn đăng ký:</span> {tournament?.signup_deadline ? new Date(tournament.signup_deadline).toLocaleDateString('vi-VN') : 'Không giới hạn'}</p>
              <p><span className="font-medium">Số đội tối đa:</span> {tournament?.max_teams || 'Không giới hạn'}</p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Selection */}
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Chọn đội bóng</h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Đội bóng của bạn *
                </label>
                <select
                  name="teamId"
                  value={formData.teamId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#30ddff] ${
                    errors.teamId ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">Chọn đội bóng</option>
                  {userTeams
                    .filter(team => {
                      // Lọc ra các đội chưa đăng ký giải đấu này
                      return !tournament.Registrations?.some(registration => 
                        registration.Team_ID === team.id
                      );
                    })
                    .map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name} - {team.description || 'Không có mô tả'}
                      </option>
                    ))}
                </select>
                {errors.teamId && (
                  <p className="text-red-500 text-sm mt-1">{errors.teamId}</p>
                )}
                
                {/* Hiển thị thông báo về các đội đã đăng ký */}
                {userTeams.some(team => 
                  tournament.Registrations?.some(registration => 
                    registration.Team_ID === team.id
                  )
                ) && (
                  <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center mb-2">
                      <svg className="w-4 h-4 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-yellow-400 text-sm font-medium">Đội đã đăng ký</span>
                    </div>
                    <p className="text-yellow-300 text-xs">
                      Một số đội của bạn đã đăng ký giải đấu này và không hiển thị trong danh sách.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#30ddff]"
                placeholder="Ghi chú thêm về việc đăng ký tham gia..."
              />
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link
                to={`/tournaments/${id}`}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang đăng ký...' : 'Hoàn tất đăng ký'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
