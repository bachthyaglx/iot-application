// src/App.tsx
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import DynamicSidebar from './components/DynamicSidebar';
import HomePage from './pages/HomePage';
import DynamicPage from './pages/DynamicPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000ff',
      paper: '#212126ff',
    },
    primary: {
      main: '#1976d2',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#13471eff',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#13471eff',
        },
      },
    },
  },
});

const SIDEBAR_WIDTH = 240;

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentEndpoint, setCurrentEndpoint] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  // Auto-open sidebar when logged in (desktop only)
  useEffect(() => {
    if (isLoggedIn) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
      setCurrentEndpoint(null); // Reset to home when logout
    }
  }, [isLoggedIn]);

  const handleEndpointSelect = (endpoint: string) => {
    setCurrentEndpoint(endpoint);
  };

  const handleBackToHome = () => {
    setCurrentEndpoint(null);
  };

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
          currentEndpoint={currentEndpoint}
          onEndpointSelect={handleEndpointSelect}
        />
      )}
      <Box
        sx={{
          ml: isLoggedIn && sidebarOpen ? { xs: 0, md: `${SIDEBAR_WIDTH}px` } : 0,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {currentEndpoint ? (
          <DynamicPage
            endpoint={currentEndpoint}
            onBack={handleBackToHome}
          />
        ) : (
          <HomePage />
        )}
      </Box>
    </>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}