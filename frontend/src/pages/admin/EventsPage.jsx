import React, { useState, useEffect } from 'react';
import axiosClient from '../../services/axiosClient';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventTypeModal, setShowEventTypeModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingEventType, setEditingEventType] = useState(null);
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'eventTypes'

  // Form states for Tournaments/Events
  const [eventForm, setEventForm] = useState({
    name: '',
    Type_ID: '',
    start_date: '',
    end_date: '',
    location: '',
    max_teams: '',
    description: '',
    rules: '',
    prize: '',
    signup_deadline: '',
    status: 'upcoming'
  });

  // Form states for Tournament Types/Event Types
  const [eventTypeForm, setEventTypeForm] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, eventTypesRes] = await Promise.all([
          axiosClient.get('/tournaments'),
          axiosClient.get('/tournament-types')
        ]);

        setEvents(eventsRes.data.data || []);
        setEventTypes(eventTypesRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setEvents([]);
        setEventTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': case 'ongoing':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'upcoming': case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': case 'ongoing':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã hoàn thành';
      case 'upcoming': case 'scheduled':
        return 'Sắp diễn ra';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };
  
  const getSportIcon = (sportName) => {
    // A simple default icon
    return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
  };

  // Helper to format date for input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  };

  // CRUD Functions for Events
  const handleCreateEvent = () => {
    setEditingEvent(null);
    setEventForm({
      name: '',
      Type_ID: '',
      start_date: '',
      end_date: '',
      location: '',
      max_teams: '',
      description: '',
      rules: '',
      prize: '',
      signup_deadline: '',
      status: 'upcoming'
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      name: event.name,
      Type_ID: event.Type_ID,
      start_date: formatDateForInput(event.start_date),
      end_date: formatDateForInput(event.end_date),
      location: event.location,
      max_teams: event.max_teams,
      description: event.description || '',
      rules: event.rules || '',
      prize: event.prize || '',
      signup_deadline: formatDateForInput(event.signup_deadline),
      status: event.status
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      try {
        await axiosClient.delete(`/tournaments/${id}`);
        setEvents(prev => prev.filter(event => event.id !== id));
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Xóa sự kiện thất bại!');
      }
    }
  };

  const handleSaveEvent = async () => {
    if (!eventForm.name || !eventForm.Type_ID || !eventForm.start_date || !eventForm.end_date) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      if (editingEvent) {
        const response = await axiosClient.put(`/tournaments/${editingEvent.id}`, eventForm);
        setEvents(prev => prev.map(event => event.id === editingEvent.id ? response.data.data : event));
      } else {
        const response = await axiosClient.post('/tournaments', eventForm);
        setEvents(prev => [...prev, response.data.data]);
      }
      setShowEventModal(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Failed to save event:', error.response?.data?.message || error.message);
      alert(`Lưu sự kiện thất bại: ${error.response?.data?.message || 'Lỗi không xác định'}`);
    }
  };

  // CRUD Functions for Event Types
  const handleCreateEventType = () => {
    setEditingEventType(null);
    setEventTypeForm({ name: '', description: '' });
    setShowEventTypeModal(true);
  };

  const handleEditEventType = (eventType) => {
    setEditingEventType(eventType);
    setEventTypeForm({
      name: eventType.name,
      description: eventType.description,
    });
    setShowEventTypeModal(true);
  };

  const handleDeleteEventType = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại sự kiện này?')) {
      try {
        await axiosClient.delete(`/tournament-types/${id}`);
        setEventTypes(prev => prev.filter(type => type.id !== id));
      } catch (error) {
        console.error('Failed to delete event type:', error);
        alert('Xóa loại sự kiện thất bại!');
      }
    }
  };

  const handleSaveEventType = async () => {
    if (!eventTypeForm.name || !eventTypeForm.description) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    try {
      if (editingEventType) {
        const response = await axiosClient.put(`/tournament-types/${editingEventType.id}`, eventTypeForm);
        setEventTypes(prev => prev.map(type => type.id === editingEventType.id ? response.data.data : type));
      } else {
        const response = await axiosClient.post('/tournament-types', eventTypeForm);
        setEventTypes(prev => [...prev, response.data.data]);
      }
      setShowEventTypeModal(false);
      setEditingEventType(null);
    } catch (error) {
      console.error('Failed to save event type:', error);
      alert('Lưu loại sự kiện thất bại!');
    }
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'event') {
      setEventForm(prev => ({ ...prev, [name]: value }));
    } else {
      setEventTypeForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#30ddff] via-blue-600 to-purple-600 px-8 py-12 relative">
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white mb-2">Quản lý sự kiện thể thao</h1>
            <p className="text-blue-100 text-lg">Quản lý tất cả sự kiện thể thao và loại sự kiện trong hệ thống</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="px-8 py-4 bg-gray-800/50">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Sự kiện ({events.length})
            </button>
            <button
              onClick={() => setActiveTab('eventTypes')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'eventTypes'
                  ? 'bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
              }`}
            >
              Loại sự kiện ({eventTypes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'events' ? (
        <>
          <div className="flex justify-end">
            <button
              onClick={handleCreateEvent}
              className="bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white px-6 py-3 rounded-xl hover:from-[#00b8d4] hover:to-[#30ddff] transition-all duration-300 shadow-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Tạo sự kiện mới</span>
            </button>
          </div>
          <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filter === 'all'
                    ? 'bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Tất cả ({events.length})
              </button>
            </div>
          </div>
          <div className="space-y-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getSportIcon(event.Tournament_Type?.name)} />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{event.name}</h3>
                          <p className="text-gray-400">{event.Tournament_Type?.name} • {event.organizer}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-3 ml-6">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white px-4 py-2 rounded-xl hover:from-[#00b8d4] hover:to-[#30ddff] transition-all duration-300 text-sm font-medium"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all duration-300 text-sm font-medium"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              onClick={handleCreateEventType}
              className="bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white px-6 py-3 rounded-xl hover:from-[#00b8d4] hover:to-[#30ddff] transition-all duration-300 shadow-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Tạo loại sự kiện mới</span>
            </button>
          </div>
          <div className="space-y-6">
            {eventTypes.map((eventType) => (
              <div key={eventType.id} className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-2xl overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                         <div className="w-12 h-12 bg-gray-700/50 rounded-xl flex items-center justify-center mr-4">
                           <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getSportIcon(eventType.name)} />
                           </svg>
                         </div>
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-1">{eventType.name}</h3>
                          <p className="text-gray-400">{eventType.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-6">
                      <button
                        onClick={() => handleEditEventType(eventType)}
                        className="bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white px-4 py-2 rounded-xl hover:from-[#00b8d4] hover:to-[#30ddff] transition-all duration-300 text-sm font-medium"
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDeleteEventType(eventType.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all duration-300 text-sm font-medium"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingEvent ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tên sự kiện *</label>
                <input name="name" value={eventForm.name} onChange={(e) => handleInputChange(e, 'event')} placeholder="Tên sự kiện" className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Loại sự kiện *</label>
                <select name="Type_ID" value={eventForm.Type_ID} onChange={(e) => handleInputChange(e, 'event')} className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white">
                    <option value="">Chọn loại sự kiện</option>
                    {eventTypes.map(type => <option key={type.id} value={type.id}>{type.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ngày bắt đầu *</label>
                <input type="date" name="start_date" value={eventForm.start_date} onChange={(e) => handleInputChange(e, 'event')} className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ngày kết thúc *</label>
                <input type="date" name="end_date" value={eventForm.end_date} onChange={(e) => handleInputChange(e, 'event')} className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Địa điểm *</label>
                <input name="location" value={eventForm.location} onChange={(e) => handleInputChange(e, 'event')} placeholder="Địa điểm" className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Số đội tối đa *</label>
                <input type="number" name="max_teams" value={eventForm.max_teams} onChange={(e) => handleInputChange(e, 'event')} placeholder="Số đội tối đa" className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hạn chót đăng ký *</label>
                <input type="date" name="signup_deadline" value={eventForm.signup_deadline} onChange={(e) => handleInputChange(e, 'event')} className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Giải thưởng</label>
                <input name="prize" value={eventForm.prize} onChange={(e) => handleInputChange(e, 'event')} placeholder="Giải thưởng" className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white" />
              </div>
            </div>
            <div className='mt-4'>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả</label>
                <textarea name="description" value={eventForm.description} onChange={(e) => handleInputChange(e, 'event')} placeholder="Mô tả" className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white" rows="3"></textarea>
            </div>
            <div className='mt-4'>
                <label className="block text-sm font-medium text-gray-300 mb-2">Luật lệ</label>
                <textarea name="rules" value={eventForm.rules} onChange={(e) => handleInputChange(e, 'event')} placeholder="Luật lệ" className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white" rows="3"></textarea>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowEventModal(false)} className="px-6 py-3 bg-gray-600 text-white rounded-xl">Hủy</button>
              <button onClick={handleSaveEvent} className="px-6 py-3 bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white rounded-xl">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Event Type Modal */}
      {showEventTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingEventType ? 'Chỉnh sửa loại sự kiện' : 'Tạo loại sự kiện mới'}
            </h2>
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Tên loại sự kiện *</label>
                <input name="name" value={eventTypeForm.name} onChange={(e) => handleInputChange(e, 'eventType')} placeholder="Tên loại sự kiện" className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white" />
                <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả *</label>
                <textarea name="description" value={eventTypeForm.description} onChange={(e) => handleInputChange(e, 'eventType')} placeholder="Mô tả" className="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded-xl text-white" rows="3"></textarea>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setShowEventTypeModal(false)} className="px-6 py-3 bg-gray-600 text-white rounded-xl">Hủy</button>
              <button onClick={handleSaveEventType} className="px-6 py-3 bg-gradient-to-r from-[#30ddff] to-[#00b8d4] text-white rounded-xl">Lưu</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventsPage;