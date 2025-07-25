// Direct Google Sheets connection configuration
export const GOOGLE_SHEETS_CONFIG = {
  spreadsheetId: '16ixt4P843z3g-VpS6CZIQSC6x-PLojav9Vi5mmzWWAA',
  SHEET_GIDS: {
    'Week1': '1900093840',
    'Week 1': '1900093840',
  }
};

// Date column mapping based on your sheet structure
// Monday starts at column C, Tuesday at column L, Wednesday at column U, etc.
export const DAY_COLUMNS: Record<number, string> = {
  1: 'C', // Monday - starts at column C
  2: 'L', // Tuesday - starts at column L  
  3: 'U', // Wednesday - starts at column U
  4: 'AD', // Thursday - starts at column AD
  5: 'AM', // Friday - starts at column AM
  6: 'AV', // Saturday - starts at column AV
  0: 'BE'  // Sunday - starts at column BE
};

export const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];