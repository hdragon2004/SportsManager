import React, { useState } from 'react';
import { requestCoachRole } from '../features/permissions/permissionAPI';

const RequestPermissionForm = () => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setMessage('Vui lòng nhập lý do xin quyền');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      const response = await requestCoachRole(reason);
      
      if (response.data.success) {
        setMessage('Yêu cầu xin quyền huấn luyện viên đã được gửi thành công!');
        setMessageType('success');
        setReason('');
      } else {
        setMessage(response.data.message || 'Có lỗi xảy ra khi gửi yêu cầu');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Error requesting coach role:', error);
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-2">Xin quyền Huấn luyện viên</h3>
        <p className="text-gray-400">
          Gửi yêu cầu để được cấp quyền huấn luyện viên. Yêu cầu của bạn sẽ được admin xem xét và phản hồi.
        </p>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-xl ${
          messageType === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
            : 'bg-red-500/20 border border-red-500/30 text-red-300'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
            Lý do xin quyền *
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            rows="4"
            placeholder="Vui lòng mô tả lý do bạn muốn được cấp quyền huấn luyện viên..."
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white px-6 py-3 rounded-xl hover:from-[#00b8d4] hover:to-[#30ddff] transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang gửi yêu cầu...
            </div>
          ) : (
            'Gửi yêu cầu'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <h4 className="text-sm font-medium text-blue-300 mb-2">Lưu ý:</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Yêu cầu sẽ được admin xem xét trong thời gian sớm nhất</li>
          <li>• Bạn sẽ nhận được thông báo khi yêu cầu được xử lý</li>
          <li>• Nếu đã có yêu cầu đang chờ xử lý, bạn không thể gửi yêu cầu mới</li>
          <li>• Quyền huấn luyện viên cho phép bạn quản lý đội bóng và tham gia các hoạt động huấn luyện</li>
        </ul>
      </div>
    </div>
  );
};

export default RequestPermissionForm; 