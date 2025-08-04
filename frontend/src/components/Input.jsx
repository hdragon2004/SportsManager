import React from 'react';

const Input = ({ 
  label, 
  error, 
  type = 'text', 
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          text-gray-900  /* <--- THÊM DÒNG NÀY ĐỂ ĐẢM BẢO CHỮ CÓ MÀU TỐI */
          placeholder-gray-400 /* Thêm màu cho chữ placeholder cho đẹp hơn */
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-300' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input; 