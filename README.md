<<<<<<< HEAD
# Student_Attendance
=======
# Student Attendance Management System

A modern React application for managing daily student attendance with Google Sheets integration.

## Features

- **Google OAuth2 Authentication**: Secure sign-in with Google accounts
- **Automatic Date Detection**: Displays current date and auto-selects appropriate week
- **Smart Register Number Input**: Auto-complete with last 2 digits of register numbers
- **Multiple Attendance Modes**: Present, Absent, No Class
- **Bulk Period Selection**: Mark attendance for multiple class periods (1-8)
- **Real-time Google Sheets Integration**: Direct read/write to your Google Sheets
- **Mobile Responsive**: Optimized for tablet usage in classrooms

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API" and enable it
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Configure the consent screen if needed
   - Choose "Web application" as the application type
   - Add your domain to "Authorized JavaScript origins" (e.g., `http://localhost:5173` for development)
   - Copy the Client ID

5. Create an API Key:
   - Click "Create Credentials" → "API key"
   - Restrict the key to Google Sheets API for security
   - Copy the API key

### 2. Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Google credentials:
   ```
   VITE_GOOGLE_CLIENT_ID=your_client_id_here
   VITE_GOOGLE_API_KEY=your_api_key_here
   ```

### 3. Google Sheets Structure

Your Google Sheet should have the following structure:
- **Column A**: Register Numbers
- **Column B**: Student Names
- **Columns C onwards**: Days of the week (Monday, Tuesday, etc.)
- **Sheet tabs**: "Week 1", "Week 2", etc.

Each cell can contain:
- **P**: Present
- **A**: Absent
- **N**: No Class

### 4. Installation and Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. **Sign In**: Click "Sign in with Google" and authorize the application
2. **Select Date**: The current date is auto-selected, but you can change it manually
3. **Choose Week**: The appropriate week sheet is auto-selected based on the date
4. **Select Attendance Mode**:
   - **Present**: Selected students marked as Present (P), others as Absent (A)
   - **Absent**: Selected students marked as Absent (A), others as Present (P)
   - **No Class**: All students marked as No Class (N)
5. **Enter Register Numbers**: For Present/Absent modes, enter the last 2 digits of register numbers
6. **Select Periods**: Choose which class periods (1-8) to mark attendance for
7. **Upload**: Click "Upload Attendance" to save to Google Sheets

## Key Features

- **Auto-completion**: Type last 2 digits of register numbers for quick student selection
- **Bulk Operations**: Select multiple students and periods at once
- **Date Validation**: Warns when marking attendance for non-current dates
- **Error Handling**: Clear error messages and success confirmations
- **Responsive Design**: Works well on tablets and mobile devices

## Security

- Uses Google OAuth2 for secure authentication
- API keys are stored as environment variables
- Read/write permissions limited to specified Google Sheets
- No sensitive data stored locally

## Support

For issues with Google API setup, refer to the [Google Sheets API documentation](https://developers.google.com/sheets/api).
>>>>>>> 0a88961 (Initial commit of my project)
