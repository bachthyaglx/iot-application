// src/pages/HomePage.tsx
import React, { useCallback } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchAllEndpoints } from '../store/serverSlice';
import DynamicTable from '../components/DynamicTable';
import DevicePicture from '../components/DevicePicture';
import { excludeFields, COMMON_HIDDEN_FIELDS } from '../utils/dataFilter';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { endpointData, serverInfo, serverUrl } = useAppSelector((state) => state.server);
  const pictureData = endpointData['picture']?.data;

  // Filter GET endpoints (exclude picture)
  const getEndpoints = Object.entries(endpointData).filter(
    ([key, value]) => value.method === 'GET' && key !== 'picture'
  );

  const hasData = getEndpoints.length > 0;

  // Handle update endpoint data
  const handleUpdateEndpoint = useCallback(
    async (endpoint: string, updatedData: any) => {
      if (!serverUrl || !endpoint) {
        alert('Server URL or endpoint not configured');
        return false;
      }

      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${serverUrl}/${endpoint}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error('Failed to update data');

        await dispatch(fetchAllEndpoints()).unwrap();
        return true;
      } catch (error) {
        console.error('Error updating data:', error);
        alert('Failed to update data');
        return false;
      }
    },
    [serverUrl, dispatch]
  );

  return (
    <Box
      sx={{
        p: 5,
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
          Connected to server but no data available. Make sure the server has GET endpoints.
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

            {/* Tables Column - Only identification */}
            <Box
              sx={{
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                width: 'fit-content',
              }}
            >
              {getEndpoints
                .filter(([endpoint]) => endpoint === 'identification')
                .map(([endpoint, value]) => {
                  const displayData =
                    endpoint === 'identification' && value.data
                      ? excludeFields(value.data, [...COMMON_HIDDEN_FIELDS, 'user'])
                      : value.data;

                  return (
                    <DynamicTable
                      key={endpoint}
                      data={displayData}
                      title={endpoint}
                      endpoint={endpoint}
                      onUpdate={handleUpdateEndpoint}
                    />
                  );
                })}
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            No data to display. Please connect to a server first.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;