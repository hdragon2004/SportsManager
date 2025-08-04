import React, { useState } from 'react';
import Button from '../../components/Button';

const ScheduleFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    sport: 'all',
    venue: 'all',
    status: 'all',
    dateRange: 'all'
  });

  const sports = [
    { value: 'all', label: 'Tất cả môn thể thao' },
    { value: 'football', label: 'Bóng đá' },
    { value: 'basketball', label: 'Bóng rổ' },
    { value: 'badminton', label: 'Cầu lông' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'swimming', label: 'Bơi lội' }
  ];

  const venues = [
    { value: 'all', label: 'Tất cả địa điểm' },
    { value: 'main-stadium', label: 'Sân vận động chính' },
    { value: 'gym-1', label: 'Nhà thi đấu 1' },
    { value: 'gym-2', label: 'Nhà thi đấu 2' },
    { value: 'swimming-pool', label: 'Bể bơi' },
    { value: 'badminton-court', label: 'Sân cầu lông' }
  ];

  const statuses = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'upcoming', label: 'Sắp diễn ra' },
    { value: 'ongoing', label: 'Đang diễn ra' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const dateRanges = [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'tomorrow', label: 'Ngày mai' },
    { value: 'this-week', label: 'Tuần này' },
    { value: 'this-month', label: 'Tháng này' }
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      sport: 'all',
      venue: 'all',
      status: 'all',
      dateRange: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Bộ lọc</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
        >
          Xóa bộ lọc
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sport Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Môn thể thao
          </label>
          <select
            value={filters.sport}
            onChange={(e) => handleFilterChange('sport', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {sports.map((sport) => (
              <option key={sport.value} value={sport.value}>
                {sport.label}
              </option>
            ))}
          </select>
        </div>

        {/* Venue Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Địa điểm
          </label>
          <select
            value={filters.venue}
            onChange={(e) => handleFilterChange('venue', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {venues.map((venue) => (
              <option key={venue.value} value={venue.value}>
                {venue.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thời gian
          </label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (value === 'all') return null;
            
            const getLabel = (filterType, filterValue) => {
              switch (filterType) {
                case 'sport':
                  return sports.find(s => s.value === filterValue)?.label;
                case 'venue':
                  return venues.find(v => v.value === filterValue)?.label;
                case 'status':
                  return statuses.find(s => s.value === filterValue)?.label;
                case 'dateRange':
                  return dateRanges.find(d => d.value === filterValue)?.label;
                default:
                  return filterValue;
              }
            };

            return (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {getLabel(key, value)}
                <button
                  onClick={() => handleFilterChange(key, 'all')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleFilters; 