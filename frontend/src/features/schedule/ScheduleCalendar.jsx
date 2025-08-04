import React, { useState, useEffect } from 'react';
import Button from '../../components/Button';

const ScheduleCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // week, month
  const [matches, setMatches] = useState([]);

  // Mock data cho lịch thi đấu
  const mockMatches = [
    {
      id: 1,
      title: 'Bóng đá - Vòng 1',
      team1: 'Đội A',
      team2: 'Đội B',
      date: new Date(2024, 0, 15, 14, 0),
      duration: 90,
      venue: 'Sân vận động chính',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Bóng rổ - Bán kết',
      team1: 'Đội C',
      team2: 'Đội D',
      date: new Date(2024, 0, 16, 16, 30),
      duration: 60,
      venue: 'Nhà thi đấu 1',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Cầu lông - Chung kết',
      team1: 'VĐV Nguyễn Văn A',
      team2: 'VĐV Trần Thị B',
      date: new Date(2024, 0, 17, 9, 0),
      duration: 45,
      venue: 'Sân cầu lông 2',
      status: 'completed'
    }
  ];

  useEffect(() => {
    setMatches(mockMatches);
  }, []);

  const getDaysInWeek = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days = [];
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    for (let i = 0; i < 42; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const getMatchesForDate = (date) => {
    return matches.filter(match => {
      const matchDate = new Date(match.date);
      return matchDate.toDateString() === date.toDateString();
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderWeekView = () => {
    const days = getDaysInWeek(currentDate);
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-8 gap-1 border-b">
          <div className="p-3 font-medium text-gray-500">Giờ</div>
          {days.map((day, index) => (
            <div key={index} className="p-3 text-center">
              <div className={`text-sm font-medium ${
                isToday(day) ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {day.toLocaleDateString('vi-VN', { weekday: 'short' })}
              </div>
              <div className={`text-xs ${
                isToday(day) ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {day.getDate()}/{day.getMonth() + 1}
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-8 gap-1">
          <div className="p-2 text-xs text-gray-500 border-r">08:00</div>
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="p-2 border-r min-h-[60px]">
              {getMatchesForDate(day).map((match) => (
                <div
                  key={match.id}
                  className={`text-xs p-1 mb-1 rounded ${getStatusColor(match.status)}`}
                >
                  <div className="font-medium">{match.title}</div>
                  <div>{formatTime(new Date(match.date))}</div>
                  <div>{match.venue}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-7 gap-1">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
            <div key={day} className="p-3 text-center font-medium text-gray-500 border-b">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const dayMatches = getMatchesForDate(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            
            return (
              <div
                key={index}
                className={`p-2 min-h-[100px] border-r border-b cursor-pointer hover:bg-gray-50 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday(day) ? 'bg-blue-50' : ''} ${isSelected(day) ? 'bg-blue-100' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className={`text-sm font-medium ${
                  isToday(day) ? 'text-blue-600' : ''
                }`}>
                  {day.getDate()}
                </div>
                
                {dayMatches.map((match) => (
                  <div
                    key={match.id}
                    className={`text-xs p-1 mb-1 rounded ${getStatusColor(match.status)}`}
                  >
                    <div className="truncate">{match.title}</div>
                    <div className="text-xs">{formatTime(new Date(match.date))}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek(-1)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {viewMode === 'week' 
              ? `Tuần ${currentDate.getDate()}/${currentDate.getMonth() + 1}`
              : `${currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`
            }
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek(1)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'week' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Tuần
          </Button>
          <Button
            variant={viewMode === 'month' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Tháng
          </Button>
        </div>
      </div>

      {/* Calendar */}
      {viewMode === 'week' ? renderWeekView() : renderMonthView()}

      {/* Selected Date Info */}
      {selectedDate && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Lịch thi đấu ngày {selectedDate.toLocaleDateString('vi-VN')}
          </h3>
          
          {getMatchesForDate(selectedDate).length > 0 ? (
            <div className="space-y-3">
              {getMatchesForDate(selectedDate).map((match) => (
                <div key={match.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{match.title}</h4>
                      <p className="text-sm text-gray-600">
                        {match.team1} vs {match.team2}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatTime(new Date(match.date))} - {match.venue}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(match.status)}`}>
                      {match.status === 'completed' ? 'Hoàn thành' : 
                       match.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã hủy'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Không có lịch thi đấu nào trong ngày này.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar; 