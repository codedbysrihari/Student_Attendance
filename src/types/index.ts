export interface Student {
  registerNumber: string;
  name: string;
  rowIndex: number;
}

export interface AttendanceRecord {
  studentId: string;
  status: 'P' | 'A' | 'N';
  periods: number[];
}

export interface WeekData {
  name: string;
  range: string;
  students: Student[];
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  clientId: string;
  apiKey: string;
  discoveryDoc: string;
  scopes: string[];
}

export type AttendanceMode = 'present' | 'absent' | 'noclass';

export interface DateInfo {
  date: Date;
  dayName: string;
  formattedDate: string;
  weekNumber: number;
  columnLetter: string;
}