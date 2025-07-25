import React from 'react';
import { Student } from '../types';
import { User } from 'lucide-react';

interface StudentSuggestionsProps {
  students: Student[];
  registerInput: string;
  selectedStudents: Student[];
  onStudentSelect: (student: Student) => void;
  onStudentRemove: (student: Student) => void;
}

export const StudentSuggestions: React.FC<StudentSuggestionsProps> = ({
  students,
  registerInput,
  selectedStudents,
  onStudentSelect,
  onStudentRemove,
}) => {
  // Filter students based on register input
  const filteredStudents = students.filter((student) => {
    const lastTwoDigits = student.registerNumber.slice(-2);
    const inputDigits = registerInput.split(',').map(s => s.trim());
    return inputDigits.some(input => lastTwoDigits.includes(input) && input.length > 0);
  });

  if (!registerInput.trim() || filteredStudents.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Suggestions</h3>
      
      {/* Selected Students */}
      {selectedStudents.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Students:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedStudents.map((student) => (
              <div
                key={student.registerNumber}
                className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
              >
                <User size={14} />
                <span className="text-sm">
                  {student.registerNumber} - {student.name}
                </span>
                <button
                  onClick={() => onStudentRemove(student)}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Students */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Available Students:</h4>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {filteredStudents
            .filter(student => !selectedStudents.find(s => s.registerNumber === student.registerNumber))
            .map((student) => (
              <button
                key={student.registerNumber}
                onClick={() => onStudentSelect(student)}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <User size={16} className="text-gray-400" />
                <div>
                  <span className="font-medium text-gray-900">{student.registerNumber}</span>
                  <span className="text-gray-600 ml-2">{student.name}</span>
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};