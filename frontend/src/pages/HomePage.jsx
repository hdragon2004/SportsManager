import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../services/axiosClient';
import { HeroBanner } from '../components';

// TÁCH HÀM ĐỊNH DẠNG NGÀY RA NGOÀI ĐỂ TÁI SỬ DỤNG VÀ GIÚP MÃ SẠCH SẼ HƠN
// Hàm này sẽ chuyển '2024-03-01T00:00:00.000Z' thành '01/03/2024'
const formatDate = (dateString) => {
  if (!dateString) {
    return 'Chưa xác định';
  }
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng trong JavaScript bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const HomePage = () => {
  const [featuredTournaments, setFeaturedTournaments] = useState([]);
  const [stats, setStats] = useState([
    { number: '55.171', label: 'Giải đấu' },
    { number: '295.903', label: 'Đội thi đấu' },
    { number: '1.545.557', label: 'Vận động viên' },
    { number: '1.839.701', label: 'Trận đấu' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tạm thời bỏ qua API call để tránh lỗi
    setLoading(false);
    setFeaturedTournaments([
      {
        id: 1,
        name: 'Giải bóng đá sinh viên TP.HCM 2024',
        image: '/tournament1.jpg',
        status: 'Đang diễn ra',
        teams: 16,
        startDate: '01/03/2024',
        endDate: '30/05/2024'
      },
      {
        id: 2,
        name: 'Giải cầu lông mùa xuân 2024',
        image: '/tournament2.jpg',
        status: 'Đang diễn ra',
        teams: 24,
        startDate: '15/03/2024',
        endDate: '20/04/2024'
      },
      {
        id: 3,
        name: 'Giải bóng rổ sinh viên 2024',
        image: '/tournament3.jpg',
        status: 'Đang diễn ra',
        teams: 12,
        startDate: '01/04/2024',
        endDate: '30/06/2024'
      }
    ]);
    setStats([
      { number: '3', label: 'Giải đấu đang diễn ra' },
      { number: '52', label: 'Đội tham gia' },
      { number: '156', label: 'Vận động viên' },
      { number: '45', label: 'Trận đấu/tháng' }
    ]);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#30ddff] mx-auto"></div>
          <p className="mt-4 text-gray-300">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Banner Section */}
      <HeroBanner stats={stats} />

      {/* Tournament Formats Section */}
      <section className="py-16 bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Hỗ trợ nhiều thể thức thi đấu</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Myleague giúp người dùng tạo ra các giải đấu có thể thức giống như với các giải đấu nổi tiếng thế giới như Champions League, World Cup, NBA, Laliga, ATP Cup ...
            </p>
          </div>

          {/* Sports Images */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {[
              { name: 'Esports Arena', bg: 'bg-gradient-to-br from-blue-500 to-purple-600' },
              { name: 'Basketball Court', bg: 'bg-gradient-to-br from-orange-500 to-red-600' },
              { name: 'Football Stadium', bg: 'bg-gradient-to-br from-green-500 to-blue-600' },
              { name: 'Gaming Setup', bg: 'bg-gradient-to-br from-purple-500 to-pink-600' },
              { name: 'Billiards Table', bg: 'bg-gradient-to-br from-green-600 to-green-800' },
              { name: 'Chess Board', bg: 'bg-gradient-to-br from-red-600 to-red-800' }
            ].map((sport, index) => (
              <div key={index} className={`${sport.bg} rounded-lg aspect-square flex items-center justify-center`}>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">{sport.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tournament Format Icons */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: '⚔️', label: 'Loại trực tiếp', desc: 'Knockout / Single Elimination' },
              { icon: '🔄', label: 'Đấu vòng tròn', desc: 'Round Robin' },
              { icon: '📊', label: 'Chia bảng đấu', desc: 'Group Stage / Seeding' },
              { icon: '🌳', label: 'Nhánh thắng - Nhánh thua', desc: 'Double Elimination' },
              { icon: '🔀', label: 'Thể thức hỗn hợp', desc: 'Hybrid Format' },
              { icon: '🇨🇭', label: 'Hệ thụy sỹ', desc: 'Swiss System' }
            ].map((format, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-3 border border-white border-opacity-20">
                  <span className="text-2xl">{format.icon}</span>
                </div>
                <h3 className="font-semibold mb-1">{format.label}</h3>
                <p className="text-sm text-gray-400">{format.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#30ddff] bg-opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#30ddff] bg-opacity-10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Lợi ích Myleague.vn mang lại</h2>
            <p className="text-xl text-gray-300">Số hóa thể thao là xu hướng phát triển tất yếu!</p>
          </div>

          {/* Central Trophy */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <div className="w-24 h-24 bg-[#30ddff] rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="absolute inset-0 w-24 h-24 border-2 border-white border-opacity-30 rounded-full animate-ping"></div>
              <div className="absolute inset-0 w-24 h-24 border-2 border-white border-opacity-20 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute inset-0 w-24 h-24 border-2 border-white border-opacity-10 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '⏰',
                title: 'Thời gian',
                description: 'Tiết kiệm đến 90% thời gian cho các công việc truyền thống như gọi điện, email, họp, lên lịch, cập nhật kết quả/xếp hạng.'
              },
              {
                icon: '📄',
                title: 'Tài nguyên giấy',
                description: 'Tổ chức giải đấu mà không cần in ấn hay lãng phí giấy, góp phần bảo vệ môi trường.'
              },
              {
                icon: '🌐',
                title: 'Sự tiện lợi',
                description: 'Thông tin luôn có thể truy cập qua máy tính, smartphone, tablet với báo cáo và thống kê hoàn toàn tự động.'
              },
              {
                icon: '💾',
                title: 'Khả năng lưu trữ',
                description: 'Thông tin giải đấu được lưu trữ để kỷ niệm, tra cứu hoặc tái sử dụng, dễ dàng tương tác, bình luận và chia sẻ dữ liệu.'
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#30ddff] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{benefit.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Reviews & Social Sharing Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* User Reviews - 3 columns */}
            <div className="lg:col-span-3 bg-gray-900 rounded-lg p-8 text-white">
              <div className="flex items-center mb-8">
                <div className="w-8 h-2 bg-[#30ddff] rounded mr-4"></div>
                <h2 className="text-2xl font-bold">Người dùng chia sẻ</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'FB: Lang Thang',
                    avatar: '👨‍💼',
                    rating: 5,
                    review: 'Hệ thống rất chuyên nghiệp, hiệu quả và ban quản trị hỗ trợ rất tốt.'
                  },
                  {
                    name: 'FB: Thuân Lê',
                    avatar: '👨‍💻',
                    rating: 5,
                    review: 'Phần mềm đơn giản, dễ sử dụng. Ban quản lý thân thiện và phản hồi nhanh. Mong có thêm nhiều tính năng.'
                  },
                  {
                    name: 'FB: Quang Ho Minh',
                    avatar: '👨‍🎓',
                    rating: 5,
                    review: 'Rất hài lòng với phần mềm quản lý giải đấu và tự hào đây là website Việt Nam.'
                  }
                ].map((user, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                      {user.avatar}
                    </div>
                    <div className="flex justify-center mb-3">
                      {[...Array(user.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm mb-3 leading-relaxed">{user.review}</p>
                    <p className="text-[#30ddff] text-sm font-medium">{user.name}</p>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <a href="#" className="text-white hover:text-[#30ddff] transition-colors">
                  Xem thêm →
                </a>
              </div>
            </div>

            {/* Social Sharing - 2 columns */}
            <div className="lg:col-span-2 bg-[#30ddff] rounded-lg p-8 text-white">
              <div className="flex items-center mb-8">
                <div className="w-8 h-2 bg-white rounded mr-4"></div>
                <h2 className="text-2xl font-bold">Chia sẻ với bạn bè</h2>
              </div>
              
              <p className="mb-8 leading-relaxed">
                Hãy chia sẻ những giải đấu hấp dẫn qua các mạng xã hội trên internet để thảo luận với những người cùng quan tâm.
              </p>
              
              <div className="space-y-4">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>
                    <div className="text-sm">10K</div>
                    <div>Thích</div>
                  </span>
                </button>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  <span>Chia sẻ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;