import React, { useState, useEffect } from 'react';
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import { useGoogleSheets } from './hooks/useGoogleSheets';
import { getCurrentDateInfo, getWeekSheetName, isToday } from './utils/dateUtils';
import { DateSelector } from './components/DateSelector';
import { AttendanceControls } from './components/AttendanceControls';
import { StudentSuggestions } from './components/StudentSuggestions';
import { Student, AttendanceMode, DateInfo, AttendanceRecord } from './types';

function App() {
  const { loading: sheetsLoading, error, getSheetData, updateAttendance, getWeekSheets } = useGoogleSheets();

  // State management
  const [currentDateInfo, setCurrentDateInfo] = useState<DateInfo>(getCurrentDateInfo());
  const [weekSheets, setWeekSheets] = useState<string[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceMode, setAttendanceMode] = useState<AttendanceMode>('present');
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [registerInput, setRegisterInput] = useState<string>('');
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    loadWeekSheets();
  }, []);

  // Load students when week sheet changes
  useEffect(() => {
    if (selectedWeek) {
      loadStudents();
    }
  }, [selectedWeek]);

  // Auto-select week based on current date
  useEffect(() => {
    if (weekSheets.length > 0) {
      const weekName = getWeekSheetName(currentDateInfo.weekNumber);
      const matchingWeek = weekSheets.find(sheet => sheet === weekName) || weekSheets[0];
      setSelectedWeek(matchingWeek);
    }
  }, [weekSheets, currentDateInfo.weekNumber]);

  // Reset uploadSuccess when user changes selection
  useEffect(() => {
    setUploadSuccess(false);
  }, [selectedStudents, selectedPeriods, attendanceMode]);

  const loadWeekSheets = async () => {
    try {
      const sheets = await getWeekSheets();
      setWeekSheets(sheets);
    } catch (err) {
      console.error('Failed to load week sheets:', err);
    }
  };

  const loadStudents = async () => {
    try {
      const studentData = await getSheetData(selectedWeek);
      setStudents(studentData);
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  const handleDateChange = (date: Date) => {
    const newDateInfo = {
      ...getCurrentDateInfo(),
      date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
      formattedDate: date.toLocaleDateString('en-GB'),
    };
    setCurrentDateInfo(newDateInfo);
  };

  const handleStudentSelect = (student: Student) => {
    if (!selectedStudents.find(s => s.registerNumber === student.registerNumber)) {
      setSelectedStudents([...selectedStudents, student]);
    }
  };

  const handleStudentRemove = (student: Student) => {
    setSelectedStudents(selectedStudents.filter(s => s.registerNumber !== student.registerNumber));
  };

  const handleUploadAttendance = async () => {
    setUploadSuccess(false); // Reset before upload
    if (!selectedWeek || selectedPeriods.length === 0) {
      return;
    }

    try {
      let attendanceRecords: AttendanceRecord[] = [];

      if (attendanceMode === 'noclass') {
        // Mark all students as "N"
        attendanceRecords = students.map(student => ({
          studentId: student.rowIndex.toString(),
          status: 'N' as const,
          periods: selectedPeriods,
        }));
      } else {
        // Handle present/absent logic
        attendanceRecords = students.map(student => {
          const isSelected = selectedStudents.find(s => s.registerNumber === student.registerNumber);
          let status: 'P' | 'A';

          if (attendanceMode === 'present') {
            // Selected students get "P", others get "A"
            status = isSelected ? 'P' : 'A';
          } else {
            // attendanceMode === 'absent'
            // Selected students get "A", others get "P"
            status = isSelected ? 'A' : 'P';
          }

          return {
            studentId: student.rowIndex.toString(),
            status,
            periods: selectedPeriods,
          };
        });
      }

      await updateAttendance(
        selectedWeek,
        currentDateInfo.columnLetter,
        attendanceRecords,
        selectedPeriods
      );

      setSuccessMessage(`Attendance updated successfully for ${selectedPeriods.length} period(s)!`);
      setUploadSuccess(true); // Set to true on success
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Reset form
      setRegisterInput('');
      setSelectedStudents([]);
      setSelectedPeriods([]);
    } catch (err) {
      setUploadSuccess(false);
      console.error('Failed to upload attendance:', err);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <h1 className="text-xl font-semibold text-gray-900">
                Student Attendance System
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-800">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Date Selection */}
        <DateSelector
          currentDateInfo={currentDateInfo}
          onDateChange={handleDateChange}
          weekSheets={weekSheets}
          selectedWeek={selectedWeek}
          onWeekChange={setSelectedWeek}
        />

        {/* Attendance Controls */}
        <AttendanceControls
          attendanceMode={attendanceMode}
          onAttendanceModeChange={setAttendanceMode}
          selectedPeriods={selectedPeriods}
          onPeriodsChange={setSelectedPeriods}
          registerInput={registerInput}
          onRegisterInputChange={setRegisterInput}
          onUpload={handleUploadAttendance}
          loading={sheetsLoading}
          uploadSuccess={uploadSuccess}
        />

        {/* Student Suggestions */}
        {attendanceMode !== 'noclass' && (
          <StudentSuggestions
            students={students}
            registerInput={registerInput}
            selectedStudents={selectedStudents}
            onStudentSelect={handleStudentSelect}
            onStudentRemove={handleStudentRemove}
          />
        )}

        {/* Loading Indicator */}
        {sheetsLoading && (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;