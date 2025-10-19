// src/pages/DynamicPage.tsx
import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Alert,
  Button,
  Breadcrumbs,
  Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchAllEndpoints } from '../store/serverSlice';
import DynamicTable from '../components/DynamicTable';
import { excludeFields, COMMON_HIDDEN_FIELDS } from '../utils/dataFilter';

interface DynamicPageProps {
  endpoint: string;
  onBack: () => void;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ endpoint, onBack }) => {
  const dispatch = useAppDispatch();
  const { endpointData, serverUrl, serverInfo } = useAppSelector((state) => state.server);

  const currentEndpointData = useMemo(() => {
    return endpointData[endpoint];
  }, [endpointData, endpoint]);

  // Apply data filtering to exclude common hidden fields
  const displayData = useMemo(() => {
    if (!currentEndpointData?.data) return null;

    // Apply common hidden fields filter
    return excludeFields(currentEndpointData.data, COMMON_HIDDEN_FIELDS);
  }, [currentEndpointData]);

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

  // Early return AFTER all hooks
  if (!currentEndpointData) {
    return (
      <Box
        sx={{
          p: 5,
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>
        <Alert severity="error">
          Endpoint "{endpoint}" not found or no data available.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 5,
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={onBack}
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </Link>
        <Typography color="text.primary">
          {endpoint.charAt(0).toUpperCase() + endpoint.slice(1)}
        </Typography>
      </Breadcrumbs>

      {/* Content */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        {displayData ? (
          <DynamicTable
            data={displayData}
            title={endpoint}
            endpoint={endpoint}
            onUpdate={handleUpdateEndpoint}
          />
        ) : (
          <Alert severity="info">
            No data available for this endpoint
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default DynamicPage;