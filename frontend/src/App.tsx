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
  const pictureData = endpointData['picture']?.data;

  // Filter GET endpoints (exclude picture)
  const getEndpoints = Object.entries(endpointData).filter(
    ([key, value]) => value.method === 'GET' && key !== 'picture'
  );

  const hasData = getEndpoints.length > 0;

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
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {!serverInfo && (
          <Alert severity="info" sx={{ mb: 3, width: '100%', maxWidth: '1400px' }}>
            Click the server icon in the header to connect to a server and fetch data.
          </Alert>
        )}

        {serverInfo && !hasData && (
          <Alert severity="warning" sx={{ mb: 3, width: '100%', maxWidth: '1400px' }}>
            Connected to server but no data available.
            Make sure the server has GET endpoints.
          </Alert>
        )}

        {hasData ? (
          <Box
            sx={{
              width: '100%',
              maxWidth: '1400px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4,
                alignItems: 'flex-start',
                width: 'fit-content',
              }}
            >
              {/* Picture Column - Always show if available */}
              {pictureData && (
                <Box
                  sx={{
                    flex: '0 0 auto',
                    width: { xs: '100%', md: '350px' },
                  }}
                >
                  <DevicePicture pictureData={pictureData} />
                </Box>
              )}

              {/* Tables Column */}
              <Box
                sx={{
                  flex: '0 0 auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  width: 'fit-content',
                }}
              >
                {getEndpoints.map(([endpoint, value]) => {
                  const displayData = endpoint === 'identification' && value.data
                    ? excludeFields(value.data, [...COMMON_HIDDEN_FIELDS, 'user'])
                    : value.data;

                  return (
                    <DynamicTable
                      key={endpoint}
                      data={displayData}
                      title={endpoint}
                      endpoint={endpoint}
                    />
                  );
                })}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <Typography variant="body1" color="text.secondary">
              No data to display. Please connect to a server first.
            </Typography>
          </Box>
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