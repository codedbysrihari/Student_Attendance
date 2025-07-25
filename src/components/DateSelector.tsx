import React from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import { DateInfo } from '../types';
import { formatDateDisplay, isToday } from '../utils/dateUtils';

interface DateSelectorProps {
  currentDateInfo: DateInfo;
  onDateChange: (date: Date) => void;
  weekSheets: string[];
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  currentDateInfo,
  onDateChange,
  weekSheets,
  selectedWeek,
  onWeekChange,
}) => {
  const isTodaySelected = isToday(currentDateInfo.date);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Calendar className="text-blue-500" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {formatDateDisplay(currentDateInfo.date)}
            </h2>
            {!isTodaySelected && (
              <div className="flex items-center space-x-2 mt-1">
                <AlertTriangle size={16} className="text-orange-500" />
                <span className="text-sm text-orange-600">
                  Warning: Selected date is not today
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date
            </label>
            <input
              type="date"
              value={currentDateInfo.date.toISOString().split('T')[0]}
              onChange={(e) => onDateChange(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Week Sheet
            </label>
            <select
              value={selectedWeek}
              onChange={(e) => onWeekChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {weekSheets.map((week) => (
                <option key={week} value={week}>
                  {week}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};