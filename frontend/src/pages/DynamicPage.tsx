// src/pages/DynamicPage.tsx
import React, { useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Alert,
  Button,
  Breadcrumbs,
  Link,
  // Loại bỏ Grid
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchAllEndpoints } from '../store/serverSlice';
import DynamicTable from '../components/DynamicTable';
import { splitDataIntoTables, TableData } from '../utils/splitData';
import { excludeFields, COMMON_HIDDEN_FIELDS } from '../utils/dataFilter';

interface DynamicPageProps {
  endpoint: string;
  onBack: () => void;
}

// Số lượng bảng tối đa trên mỗi hàng
const TABLES_PER_ROW = 3;

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

  // Split data into multiple tables
  const tables = useMemo(() => {
    if (!displayData) return [];

    // Use splitDataIntoTables to split complex data into separate tables
    return splitDataIntoTables(displayData, endpoint);
  }, [displayData, endpoint]);

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

        // Refresh all endpoint data after successful update
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

  // LOGIC: Nhóm các bảng thành các hàng (đã sửa lỗi kiểu dữ liệu)
  const tableRows = useMemo(() => {
    return tables.reduce((acc: TableData[][], table: TableData, index) => {
      const rowIndex = Math.floor(index / TABLES_PER_ROW);
      if (!acc[rowIndex]) {
        acc[rowIndex] = [];
      }
      acc[rowIndex].push(table);
      return acc;
    }, [] as TableData[][]);
  }, [tables]);

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

      {/* Content - Display multiple tables using Flexbox */}
      {tables.length > 0 ? (
        <Box
          sx={{
            // Container chính: căn giữa toàn bộ nội dung
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Căn giữa các hàng theo chiều ngang
          }}
        >
          {tableRows.map((row, rowIndex) => (
            // Mỗi hàng: sử dụng Flexbox để đặt 3 bảng
            <Box
              key={rowIndex}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center', // Căn giữa các bảng trong hàng
                width: '100%',
                maxWidth: '1300px', // Giới hạn chiều rộng tối đa (ví dụ 3 bảng nhỏ + khoảng trống)
              }}
            >
              {row.map((table) => (
                <Box
                  key={table.key}
                  sx={{
                    // Thiết lập chiều rộng tương đương 1/3 trừ đi khoảng trống
                    flexGrow: 1,
                  }}
                >
                  <DynamicTable
                    data={table.data}
                    title={table.title}
                    endpoint={table.endpoint}
                    onUpdate={handleUpdateEndpoint}
                  />
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      ) : (
        <Alert severity="info">
          No data available for this endpoint
        </Alert>
      )}
    </Box>
  );
};

export default DynamicPage;