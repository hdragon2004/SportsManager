import React, { useState } from 'react';

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const products = [
    {
      id: 1,
      name: 'Áo đấu chính thức',
      price: '299.000đ',
      originalPrice: '399.000đ',
      category: 'Trang phục',
      image: '/product1.jpg',
      badge: 'Giảm 25%'
    },
    {
      id: 2,
      name: 'Quả bóng đá chính thức',
      price: '150.000đ',
      originalPrice: '200.000đ',
      category: 'Thiết bị',
      image: '/product2.jpg',
      badge: 'Giảm 25%'
    },
    {
      id: 3,
      name: 'Giày đá bóng chuyên nghiệp',
      price: '599.000đ',
      originalPrice: '799.000đ',
      category: 'Trang phục',
      image: '/product3.jpg',
      badge: 'Giảm 25%'
    },
    {
      id: 4,
      name: 'Băng tay thể thao',
      price: '50.000đ',
      originalPrice: '80.000đ',
      category: 'Phụ kiện',
      image: '/product4.jpg',
      badge: 'Giảm 25%'
    },
    {
      id: 5,
      name: 'Túi đựng đồ thể thao',
      price: '199.000đ',
      originalPrice: '299.000đ',
      category: 'Phụ kiện',
      image: '/product5.jpg',
      badge: 'Giảm 25%'
    },
    {
      id: 6,
      name: 'Bình nước thể thao',
      price: '89.000đ',
      originalPrice: '120.000đ',
      category: 'Phụ kiện',
      image: '/product6.jpg',
      badge: 'Giảm 25%'
    }
  ];

  const categories = ['Tất cả', 'Trang phục', 'Thiết bị', 'Phụ kiện'];

  const filteredProducts = selectedCategory === 'Tất cả' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cửa hàng thể thao</h1>
          <p className="text-xl text-gray-600">Trang phục và thiết bị thể thao chất lượng cao</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white rounded-lg shadow-md p-2">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center">
                  <div className="text-white text-center">
                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
                {product.badge && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center mb-3">
                  <span className="text-xl font-bold text-green-600">{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through ml-2">{product.originalPrice}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{product.category}</span>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shopping Cart Preview */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng của bạn</h2>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">0 sản phẩm</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">0đ</p>
              </div>
            </div>
            <button className="mt-4 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Xem giỏ hàng
            </button>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Nhận thông báo khuyến mãi</h2>
            <p className="text-gray-600 mb-6">Đăng ký để nhận thông báo về các sản phẩm mới và khuyến mãi đặc biệt</p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="px-6 py-3 bg-green-600 text-white rounded-r-lg hover:bg-green-700 transition-colors">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage; 