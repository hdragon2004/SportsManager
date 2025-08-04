import React, { useState } from 'react';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  
  const blogPosts = [
    {
      id: 1,
      title: 'Cách tổ chức giải đấu bóng đá chuyên nghiệp',
      excerpt: 'Hướng dẫn chi tiết cách tổ chức một giải đấu bóng đá từ A đến Z, bao gồm lập kế hoạch, đăng ký đội, lập lịch thi đấu và quản lý kết quả.',
      author: 'Admin',
      date: '15/01/2024',
      category: 'Hướng dẫn',
      readTime: '5 phút',
      views: 1240,
      featured: true
    },
    {
      id: 2,
      title: 'Top 10 lỗi thường gặp khi quản lý đội bóng',
      excerpt: 'Những lỗi phổ biến mà các quản lý đội bóng thường mắc phải và cách khắc phục hiệu quả.',
      author: 'Chuyên gia thể thao',
      date: '12/01/2024',
      category: 'Kinh nghiệm',
      readTime: '8 phút',
      views: 856
    },
    {
      id: 3,
      title: 'Công nghệ AI trong quản lý giải đấu thể thao',
      excerpt: 'Khám phá cách trí tuệ nhân tạo đang thay đổi cách tổ chức và quản lý các giải đấu thể thao hiện đại.',
      author: 'Tech Expert',
      date: '10/01/2024',
      category: 'Công nghệ',
      readTime: '12 phút',
      views: 2103
    },
    {
      id: 4,
      title: 'Chiến thuật xây dựng đội hình mạnh',
      excerpt: 'Bí quyết xây dựng đội hình thi đấu hiệu quả dựa trên phân tích dữ liệu và kinh nghiệm thực tế.',
      author: 'Huấn luyện viên',
      date: '08/01/2024',
      category: 'Chiến thuật',
      readTime: '6 phút',
      views: 945
    },
    {
      id: 5,
      title: 'Quản lý tài chính trong thể thao chuyên nghiệp',
      excerpt: 'Cách quản lý ngân sách và tài chính hiệu quả cho các câu lạc bộ và giải đấu thể thao.',
      author: 'Chuyên gia tài chính',
      date: '05/01/2024',
      category: 'Quản lý',
      readTime: '10 phút',
      views: 678
    },
    {
      id: 6,
      title: 'Công nghệ VAR và tác động đến bóng đá hiện đại',
      excerpt: 'Phân tích tác động của công nghệ VAR đối với bóng đá và cách áp dụng vào các giải đấu.',
      author: 'Trọng tài quốc tế',
      date: '03/01/2024',
      category: 'Công nghệ',
      readTime: '7 phút',
      views: 1532
    }
  ];

  const categories = ['Tất cả', 'Hướng dẫn', 'Kinh nghiệm', 'Công nghệ', 'Chiến thuật', 'Quản lý'];

  const filteredPosts = selectedCategory === 'Tất cả' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Hướng dẫn': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Kinh nghiệm': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Công nghệ': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Chiến thuật': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Quản lý': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="space-y-8 p-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Blog thể thao</h1>
          <p className="text-xl text-gray-300">Chia sẻ kiến thức và kinh nghiệm về quản lý thể thao</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center">
          <div className="flex space-x-2 bg-gray-800/80 backdrop-blur-xl border border-gray-600 rounded-2xl p-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white shadow-lg scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden hover:border-[#30ddff]/30 transition-all duration-300">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="h-64 md:h-full bg-gradient-to-br from-[#30ddff] via-blue-600 to-purple-600 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                    <div className="text-white text-center relative z-10">
                      <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <h3 className="text-xl font-semibold">Bài viết nổi bật</h3>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <span className={`border px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(featuredPost.category)}`}>
                      {featuredPost.category}
                    </span>
                    <span className="text-gray-400 text-sm ml-4">{featuredPost.date}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-300 mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">Bởi {featuredPost.author}</span>
                      <div className="flex items-center space-x-2 text-gray-400 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    <button className="text-[#30ddff] hover:text-[#00b8d4] font-medium transition-colors">
                      Đọc thêm →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularPosts.map((post) => (
            <div key={post.id} className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden hover:border-[#30ddff]/30 hover:shadow-xl transition-all duration-300 group">
              <div className="h-48 bg-gradient-to-br from-[#30ddff] via-blue-600 to-purple-600 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-black bg-opacity-30"></div>
                <div className="text-white text-center relative z-10">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`border px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-sm">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#30ddff] transition-colors">{post.title}</h3>
                <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400">Bởi {post.author}</span>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <button className="text-[#30ddff] hover:text-[#00b8d4] font-medium transition-colors">
                    Đọc thêm →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Đăng ký nhận tin tức</h2>
            <p className="text-gray-300 mb-6">Nhận những bài viết mới nhất về quản lý thể thao qua email</p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-l-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#30ddff] focus:border-[#30ddff]"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white rounded-r-xl hover:from-[#00b8d4] hover:to-[#30ddff] transition-all duration-300">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage; 