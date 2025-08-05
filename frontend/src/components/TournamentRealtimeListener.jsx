import React, { useEffect, useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import Toast from './Toast';

const TournamentRealtimeListener = () => {
  const { socket, isConnected } = useSocket();
  const { user, isAdmin, isCoach } = useAuth();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // 1. Lắng nghe sự kiện đăng ký mới (chỉ admin)
    socket.on('newRegistration', (data) => {
      if (isAdmin) {
        console.log('New registration received:', data);
        setToast({
          message: data.notification.message,
          type: 'info',
          duration: 5000
        });
      }
    });

    // 2. Lắng nghe sự kiện giải đấu mới (tất cả user không phải admin)
    socket.on('tournamentCreated', (data) => {
      if (!isAdmin) {
        console.log('New tournament created:', data);
        setToast({
          message: data.notification.message,
          type: 'success',
          duration: 5000
        });
      }
    });

    // 3. Lắng nghe sự kiện giải đấu bắt đầu
    socket.on('tournamentStarted', (data) => {
      console.log('Tournament started:', data);
      setToast({
        message: data.notification.message,
        type: 'warning',
        duration: 8000
      });
    });

    // 4. Lắng nghe sự kiện lịch thi đấu được tạo
    socket.on('scheduleGenerated', (data) => {
      console.log('Schedule generated:', data);
      setToast({
        message: data.notification.message,
        type: 'info',
        duration: 6000
      });
    });

    // 5. Lắng nghe sự kiện cập nhật trận đấu
    socket.on('matchUpdated', (data) => {
      console.log('Match updated:', data);
      setToast({
        message: data.notification.message,
        type: 'info',
        duration: 4000
      });
    });

    return () => {
      socket.off('newRegistration');
      socket.off('tournamentCreated');
      socket.off('tournamentStarted');
      socket.off('scheduleGenerated');
      socket.off('matchUpdated');
    };
  }, [socket, isConnected, isAdmin]);

  const handleToastClose = () => {
    setToast(null);
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={handleToastClose}
        />
      )}
    </>
  );
};

export default TournamentRealtimeListener; 