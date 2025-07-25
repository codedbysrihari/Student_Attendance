import { format, getWeek, getISODay } from 'date-fns';
import { DateInfo } from '../types';
import { DAY_COLUMNS } from '../config/googleSheets';

export const getCurrentDateInfo = (): DateInfo => {
  const now = new Date();
  const dayOfWeek = getISODay(now); // 1 = Monday, 7 = Sunday
  const weekNumber = 1; // Default to Week 1, can be adjusted based on your needs
  
  return {
    date: now,
    dayName: format(now, 'EEEE'),
    formattedDate: format(now, 'dd/MM/yyyy'),
    weekNumber,
    columnLetter: DAY_COLUMNS[dayOfWeek] || 'C',
  };
};

export const formatDateDisplay = (date: Date): string => {
  return `${format(date, 'EEEE')} - ${format(date, 'dd/MM/yyyy')}`;
};

export const getWeekSheetName = (weekNumber: number): string => {
  return `Week ${weekNumber}`;
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};