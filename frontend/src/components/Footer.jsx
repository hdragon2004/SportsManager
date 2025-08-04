import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      {/* Company Information */}
      <div className="py-8 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-xl font-bold mb-4 text-white">
            CÔNG TY CỔ PHẦN GIẢI TRÍ VÀ THỂ THAO ĐIỆN TỬ VIỆT NAM
          </h3>
          <div className="text-gray-400 text-sm space-y-2">
            <p>QUYẾT ĐỊNH PHÁT HÀNH TRÒ CHƠI ĐIỆN TỬ G1 TRÊN MẠNG: SỐ 281/QĐ-PTTH&TTĐT NGÀY 26/6/2025.</p>
            <p>ĐỊA CHỈ: TẦNG 6, TÒA NHÀ CAPITAL PLACE, 29 LIỄU GIAI, PHƯỜNG NGỌC HÀ, THÀNH PHỐ HÀ NỘI, VIỆT NAM.</p>
            <p>ĐIỆN THOẠI LIÊN HỆ: 024 7305 3939.</p>
            <p>EMAIL: <a href="mailto:legal@mysport.vn" className="text-blue-400 hover:text-blue-300">LEGAL@MYSPORT.VN</a></p>
          </div>
        </div>
      </div>

      {/* Legal Links */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-4 text-blue-400">
              <a href="#" className="hover:text-blue-300 transition-colors">Điều khoản dịch vụ</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="hover:text-blue-300 transition-colors">Chính sách bảo mật</a>
              <span className="text-gray-600">•</span>
              <a href="#" className="hover:text-blue-300 transition-colors">Chính sách giải quyết tranh chấp</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 