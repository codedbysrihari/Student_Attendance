import { useState } from 'react';
import { Student, AttendanceRecord } from '../types';
import { GOOGLE_SHEETS_CONFIG } from '../config/googleSheets';

export const useGoogleSheets = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = (csvText: string): string[][] => {
    const lines = csvText.split('\n');
    const result: string[][] = [];
    
    for (const line of lines) {
      if (line.trim()) {
        // Handle CSV with quoted fields and commas inside quotes
        const row: string[] = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            row.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        row.push(current.trim());
        // Stop if register number or name is empty
        if (!row[0] || !row[1] || !row[0].trim() || !row[1].trim()) {
          break;
        }
        result.push(row);
      }
    }
    
    return result;
  };

  const parseHTML = (htmlText: string): Student[] => {
    const students: Student[] = [];
    try {
      // Create a temporary DOM element to parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const rows = doc.querySelectorAll('tr');
      
      // Skip header rows and process student data
      for (let i = 2; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll('td');
        if (cells.length >= 2 && cells[0].textContent && cells[1].textContent) {
          const regNo = cells[0].textContent.trim();
          const name = cells[1].textContent.trim();
          // Stop if register number or name is empty
          if (!regNo || !name) {
            break;
          }
          if (regNo && name && regNo !== 'Regno' && name !== 'Name') {
            students.push({
              registerNumber: regNo,
              name: name,
              rowIndex: i + 1,
            });
          }
        } else {
          // If not enough cells, treat as end of data
          break;
        }
      }
    } catch (err) {
      console.error('Error parsing HTML:', err);
    }
    return students;
  };

  // Method 1: CSV Export with specific GID
  const fetchViaCSV = async (gid: string): Promise<Student[]> => {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/export?format=csv&gid=${gid}`;
    
    const response = await fetch(csvUrl, {
      mode: 'cors',
      headers: {
        'Accept': 'text/csv',
      }
    });
    
    if (!response.ok) {
      throw new Error(`CSV fetch failed: ${response.status}`);
    }
    
    const csvText = await response.text();
    const rows = parseCSV(csvText);
    const students: Student[] = [];

    // Skip header rows and process student data
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && row[1] && row[0].trim() && row[1].trim()) {
        const regNo = row[0].trim();
        const name = row[1].trim();
        
        if (regNo !== 'Regno' && name !== 'Name') {
          students.push({
            registerNumber: regNo,
            name: name,
            rowIndex: i + 1,
          });
        }
      }
    }

    return students;
  };

  // Method 2: HTML Export
  const fetchViaHTML = async (gid: string): Promise<Student[]> => {
    const htmlUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/export?format=html&gid=${gid}`;
    
    const response = await fetch(htmlUrl, {
      mode: 'cors',
      headers: {
        'Accept': 'text/html',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTML fetch failed: ${response.status}`);
    }
    
    const htmlText = await response.text();
    return parseHTML(htmlText);
  };

  // Method 3: Public view URL
  const fetchViaPublicView = async (): Promise<Student[]> => {
    const publicUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/htmlview`;
    
    const response = await fetch(publicUrl, {
      mode: 'cors',
      headers: {
        'Accept': 'text/html',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Public view fetch failed: ${response.status}`);
    }
    
    const htmlText = await response.text();
    return parseHTML(htmlText);
  };

  // Method 4: Try with CORS proxy
  const fetchViaCORSProxy = async (gid: string): Promise<Student[]> => {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(
      `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEETS_CONFIG.spreadsheetId}/export?format=csv&gid=${gid}`
    )}`;
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`CORS proxy fetch failed: ${response.status}`);
    }
    
    const data = await response.json();
    const csvText = data.contents;
    const rows = parseCSV(csvText);
    const students: Student[] = [];

    // Skip header rows and process student data
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      if (row[0] && row[1] && row[0].trim() && row[1].trim()) {
        const regNo = row[0].trim();
        const name = row[1].trim();
        
        if (regNo !== 'Regno' && name !== 'Name') {
          students.push({
            registerNumber: regNo,
            name: name,
            rowIndex: i + 1,
          });
        }
      }
    }

    return students;
  };

  const getSheetData = async (sheetName: string): Promise<Student[]> => {
    setLoading(true);
    setError(null);
    
    const gid = GOOGLE_SHEETS_CONFIG.SHEET_GIDS[sheetName] || '1900093840';
    const methods = [
      { name: 'CSV Export', fn: () => fetchViaCSV(gid) },
      { name: 'HTML Export', fn: () => fetchViaHTML(gid) },
      { name: 'Public View', fn: () => fetchViaPublicView() },
      { name: 'CORS Proxy', fn: () => fetchViaCORSProxy(gid) },
    ];

    for (const method of methods) {
      try {
        console.log(`Trying method: ${method.name}`);
        const students = await method.fn();
        
        if (students.length > 0) {
          console.log(`Success with ${method.name}: Found ${students.length} students`);
          return students;
        } else {
          console.log(`${method.name}: No students found`);
        }
      } catch (err: any) {
        console.log(`${method.name} failed:`, err.message);
        continue;
      }
    }

    // If all methods fail, try with hardcoded sample data as last resort
    console.log('All methods failed, using sample data');
    const sampleStudents: Student[] = [
      { registerNumber: 'RA241102020001', name: 'SRIHARI K', rowIndex: 3 },
      { registerNumber: 'RA241102020002', name: 'SAGNIK ROY CHOWDHURY', rowIndex: 4 },
      { registerNumber: 'RA241102020003', name: 'NARESH BALAJI R', rowIndex: 5 },
      { registerNumber: 'RA241102020004', name: 'TEJAS S', rowIndex: 6 },
      { registerNumber: 'RA241102020005', name: 'VENGALA VENKATA HARSHA VARDHAN REDDY', rowIndex: 7 },
    ];

    setError('Could not fetch live data from Google Sheets. Using sample data. Please check sheet permissions.');
    return sampleStudents;
  };

  const updateAttendance = async (
    sheetName: string,
    dayColumn: string,
    attendanceRecords: AttendanceRecord[],
    periods: number[]
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('YOUR_WEB_APP_URL', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheetName,
          dayColumn,
          attendanceRecords,
          periods,
        }),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Unknown error');
      }
    } catch (err: any) {
      setError(`Failed to update attendance: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getWeekSheets = async (): Promise<string[]> => {
    try {
      return Object.keys(GOOGLE_SHEETS_CONFIG.SHEET_GIDS);
    } catch (err: any) {
      console.error('Error fetching sheet names:', err);
      setError(`Failed to fetch sheet names: ${err.message || 'Unknown error'}`);
      return ['Week1'];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getSheetData,
    updateAttendance,
    getWeekSheets,
  };
};