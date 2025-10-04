// src/App.tsx
import { ThemeProvider, createTheme, CssBaseline, Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import DynamicSidebar from './components/DynamicSidebar';
import DynamicTable from './components/DynamicTable';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000ff', // Background cho toàn bộ app
      paper: '#212126ff', // Background cho các component như Card, Paper
    },
    primary: {
      main: '#1976d2',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#13471eff', // Background riêng cho Header (AppBar)
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#13471eff', // Background riêng cho Sidebar (Drawer)
        },
      },
    },
  },
});

const sampleData = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  address: {
    street: '123 Main St',
    city: 'New York',
    country: 'USA',
    coordinates: {
      lat: 40.7128,
      lng: -74.0060,
    },
  },
  hobbies: ['reading', 'coding', 'gaming'],
  education: [
    {
      degree: 'Bachelor',
      field: 'Electronics & Electrical Engineering',
      university: 'HCMUT',
      year: 2012,
    },
    {
      degree: 'Bachelor',
      field: 'Computer Science',
      university: 'MIT',
      year: 2015,
    },
    {
      degree: 'Master',
      field: 'Computer Science',
      university: 'MIT',
      year: 2015,
    },
    {
      degree: 'PhD',
      field: 'Computer Science',
      university: 'MIT',
      year: 2015,
    },
  ],
  projects: {
    personal: {
      name: 'Portfolio Website',
      tech: ['React', 'TypeScript', 'MUI'],
      status: 'completed',
    },
    work: {
      name: 'E-commerce Platform',
      tech: ['Next.js', 'Node.js', 'MongoDB'],
      status: 'in-progress',
    },
  },
  active: true,
  balance: null,
};

const SIDEBAR_WIDTH = 240;

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  return (
    <>
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={isLoggedIn && sidebarOpen}
        sidebarWidth={SIDEBAR_WIDTH}
      />
      {isLoggedIn && (
        <DynamicSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          width={SIDEBAR_WIDTH}
        />
      )}
      <Box
        sx={{
          p: 5,
          ml: isLoggedIn && sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <Typography variant="h4">Welcome to the App!</Typography>
        <DynamicTable data={sampleData} />
      </Box>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}