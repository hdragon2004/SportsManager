import React from 'react';
// Đã xóa Header và Footer khỏi đây để tránh lỗi lặp lại

const AboutPage = () => {
  // Component Page chỉ cần trả về nội dung của nó.
  // Layout cha sẽ tự động thêm Header và Footer.
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Về MYSPORT</h1>
          <p className="text-xl text-gray-200">
            Hệ thống quản lý giải đấu thể thao thời gian thực hàng đầu Việt Nam
          </p>
        </div>
      </section>

      {/* SỬA LẠI: Thêm màu nền 'bg-gray-50' cho section này */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Sứ mệnh của chúng tôi</h2>
              <p className="text-gray-600 mb-6">
                MYSPORT được thành lập với sứ mệnh mang lại giải pháp quản lý giải đấu thể thao 
                hiện đại và hiệu quả cho các tổ chức thể thao tại Việt Nam. Chúng tôi tin rằng 
                công nghệ có thể giúp nâng cao chất lượng và trải nghiệm của các sự kiện thể thao.
              </p>
              <p className="text-gray-600 mb-6">
                Với hệ thống quản lý thời gian thực, chúng tôi giúp các tổ chức thể thao 
                tối ưu hóa quy trình tổ chức, quản lý đăng ký, và cập nhật thông tin một cách 
                nhanh chóng và chính xác.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">2020</div>
                  <div className="text-gray-600">Năm thành lập</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
                  <div className="text-gray-600">Đối tác tin cậy</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tại sao chọn MYSPORT?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Công nghệ hiện đại</h4>
                    <p className="text-gray-600">Sử dụng WebSocket để cập nhật thông tin realtime</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dễ sử dụng</h4>
                    <p className="text-gray-600">Giao diện thân thiện, dễ dàng thao tác</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Bảo mật cao</h4>
                    <p className="text-gray-600">Hệ thống bảo mật đa lớp, bảo vệ dữ liệu</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Hỗ trợ 24/7</h4>
                    <p className="text-gray-600">Đội ngũ hỗ trợ chuyên nghiệp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section (giữ nguyên vì đã có bg-white) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Đội ngũ phát triển</h2>
            <p className="text-gray-600">Những con người đứng sau hệ thống MYSPORT</p>
          </div>
          {/* ... nội dung đội ngũ ... */}
        </div>
      </section>

      {/* Contact Section (giữ nguyên vì đã có bg-gray-50) */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Liên hệ với chúng tôi</h2>
            <p className="text-gray-600">Hãy liên hệ để được tư vấn và hỗ trợ</p>
          </div>
          {/* ... nội dung liên hệ ... */}
        </div>
      </section>
    </>
  );
};

export default AboutPage;