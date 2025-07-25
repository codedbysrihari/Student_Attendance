import React from 'react';
import { Users, UserX, BookX } from 'lucide-react';
import { AttendanceMode } from '../types';
import { PERIODS } from '../config/googleSheets';

interface AttendanceControlsProps {
  attendanceMode: AttendanceMode;
  onAttendanceModeChange: (mode: AttendanceMode) => void;
  selectedPeriods: number[];
  onPeriodsChange: (periods: number[]) => void;
  registerInput: string;
  onRegisterInputChange: (value: string) => void;
  onUpload: () => void;
  loading: boolean;
  uploadSuccess: boolean;
}

export const AttendanceControls: React.FC<AttendanceControlsProps> = ({
  attendanceMode,
  onAttendanceModeChange,
  selectedPeriods,
  onPeriodsChange,
  registerInput,
  onRegisterInputChange,
  onUpload,
  loading,
  uploadSuccess,
}) => {
  const attendanceModes = [
    { id: 'present' as AttendanceMode, label: 'Present', icon: Users, color: 'green' },
    { id: 'absent' as AttendanceMode, label: 'Absent', icon: UserX, color: 'red' },
    { id: 'noclass' as AttendanceMode, label: 'No Class', icon: BookX, color: 'gray' },
  ];

  const handlePeriodToggle = (period: number) => {
    if (selectedPeriods.includes(period)) {
      onPeriodsChange(selectedPeriods.filter(p => p !== period));
    } else {
      onPeriodsChange([...selectedPeriods, period]);
    }
  };

  const selectAllPeriods = () => {
    onPeriodsChange(PERIODS);
  };

  const clearAllPeriods = () => {
    onPeriodsChange([]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Controls</h3>
      
      {/* Attendance Mode Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Attendance Mode
        </label>
        <div className="grid grid-cols-3 gap-3">
          {attendanceModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = attendanceMode === mode.id;
            
            return (
              <button
                key={mode.id}
                onClick={() => onAttendanceModeChange(mode.id)}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                  isSelected
                    ? mode.color === 'green'
                      ? 'bg-green-50 border-green-500 text-green-700'
                      : mode.color === 'red'
                      ? 'bg-red-50 border-red-500 text-red-700'
                      : 'bg-gray-50 border-gray-500 text-gray-700'
                    : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Register Number Input (only for Present/Absent) */}
      {attendanceMode !== 'noclass' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Register Numbers (Last 2 digits, comma-separated)
          </label>
          <input
            type="text"
            value={registerInput}
            onChange={(e) => onRegisterInputChange(e.target.value)}
            placeholder="e.g., 01, 05, 12"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter the last 2 digits of register numbers, separated by commas
          </p>
        </div>
      )}

      {/* Period Selection */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Class Periods
          </label>
          <div className="space-x-2">
            <button
              onClick={selectAllPeriods}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Select All
            </button>
            <button
              onClick={clearAllPeriods}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-8 gap-2">
          {PERIODS.map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodToggle(period)}
              className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriods.includes(period)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={loading || selectedPeriods.length === 0}
        className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
          loading || selectedPeriods.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        {uploadSuccess ? (
          'Submit'
        ) : loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Uploading...</span>
          </div>
        ) : (
          'Upload Attendance'
        )}
      </button>
    </div>
  );
};