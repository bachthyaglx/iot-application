// src/App.tsx
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useAppSelector } from './store/hooks';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import DynamicSidebar from './components/DynamicSidebar';
import DynamicTable from './components/DynamicTable';
import DevicePicture from './components/DevicePicture';
import { excludeFields, COMMON_HIDDEN_FIELDS } from './utils/dataFilter';

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
  const { isLoggedIn } = useAuth();

  const { endpointData, serverInfo } = useAppSelector((state) => state.server);
  const identificationData = endpointData['identification']?.data;
  const pictureData = endpointData['picture']?.data;

  const displayData = identificationData
    ? excludeFields(identificationData, [...COMMON_HIDDEN_FIELDS, 'user'])
    : null;

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
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {!serverInfo && (
          <Alert severity="info" sx={{ mb: 3, width: '100%', maxWidth: '1400px' }}>
            Click the server icon in the header to connect to a server and fetch data.
          </Alert>
        )}

        {serverInfo && !identificationData && (
          <Alert severity="warning" sx={{ mb: 3, width: '100%', maxWidth: '1400px' }}>
            Connected to server but no identification data available.
            Make sure the server has an /identification endpoint.
          </Alert>
        )}

        {displayData ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 10,
              width: '100%',
              maxWidth: '600px',
              justifyContent: 'center',
            }}
          >
            {/* Picture Column - Left */}
            <Box sx={{
              flex: { xs: '1 1 100%', md: '0 0 auto' },
              minWidth: { md: '350px' },
              maxWidth: { md: '350px' },
              mt: 1,
            }}>
              <DevicePicture pictureData={pictureData} />
            </Box>

            {/* Table Column - Right */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 67%' } }}>
              <DynamicTable data={displayData} title="identification" endpoint="identification" />
            </Box>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            No data to display. Please connect to a server first.
          </Typography>
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