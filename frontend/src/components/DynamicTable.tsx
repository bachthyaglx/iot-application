// src/components/DynamicTable.tsx
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
  Stack,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchAllEndpoints } from '../store/serverSlice';

type Primitive = string | number | boolean | null | undefined;

interface DynamicTableProps {
  data: any;
  title?: string;
  endpoint?: string;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, title, endpoint }) => {
  const dispatch = useAppDispatch();
  const { serverUrl } = useAppSelector((state) => state.server);
  const isAuthenticated = localStorage.getItem('authToken') !== null;

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [updating, setUpdating] = useState(false);

  const isObject = (value: any): boolean => {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  };

  const isArray = (value: any): boolean => {
    return Array.isArray(value);
  };

  const isPrimitive = (value: any): boolean => {
    return !isObject(value) && !isArray(value);
  };

  const isArrayOfObjects = (arr: any[]): boolean => {
    return arr.length > 0 && arr.every(item => isObject(item));
  };

  const calculateMaxColumns = (obj: any): number => {
    let maxCols = 2;
    Object.values(obj).forEach((value) => {
      if (isArray(value) && isArrayOfObjects(value as any[])) {
        maxCols = Math.max(maxCols, 1 + 1 + (value as any[]).length);
      } else if (isObject(value) && !isArray(value)) {
        const allValuesAreObjects = Object.values(value as Record<string, unknown>).every(
          (v) => isObject(v) && !isArray(v)
        );
        if (allValuesAreObjects) {
          const numSubObjects = Object.keys(value as object).length;
          maxCols = Math.max(maxCols, 1 + 1 + numSubObjects);
        } else {
          const subEntries = Object.entries(value as Record<string, unknown>);
          let hasNestedObjects = false;
          subEntries.forEach(([_, subValue]) => {
            if (isObject(subValue) && !isArray(subValue)) {
              hasNestedObjects = true;
            }
          });
          if (hasNestedObjects) {
            maxCols = Math.max(maxCols, 4);
          }
        }
      }
    });
    return maxCols;
  };

  const maxColumns = isObject(data) ? calculateMaxColumns(data) : 2;

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData(JSON.parse(JSON.stringify(data)));
  };

  const handleFieldChange = (key: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleConfirm = async () => {
    if (!serverUrl || !endpoint) {
      alert('Server URL or endpoint not configured');
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${serverUrl}/${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update data');
      }

      await dispatch(fetchAllEndpoints()).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Failed to update data');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const renderEditableValue = (key: string, value: any): React.ReactNode => {
    if (isPrimitive(value)) {
      const currentValue = editedData[key] !== undefined ? editedData[key] : value;
      return (
        <TextField
          size="small"
          value={currentValue === null ? '' : currentValue}
          onChange={(e) => handleFieldChange(key, e.target.value)}
          sx={{
            fontSize: '0.875rem',
            '& .MuiInputBase-input': {
              fontSize: '0.875rem',
              py: 0.5,
            },
            width: '160px', // hoặc một giá trị cố định hợp lý
          }}
        />
      );
    }
    return (
      <Typography variant="body2" sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
        {String(value)}
      </Typography>
    );
  };

  const renderSimpleValue = (value: any): React.ReactNode => {
    if (isPrimitive(value)) {
      return (
        <Typography variant="body2" sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          {value === null ? 'null' : value === undefined ? 'undefined' : String(value)}
        </Typography>
      );
    }
    if (isArray(value) && !isArrayOfObjects(value)) {
      return (
        <Typography variant="body2" sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          {value.map((item: Primitive) => isPrimitive(item) ? String(item) : JSON.stringify(item)).join(', ')}
        </Typography>
      );
    }
    return null;
  };

  const renderObjectRows = (obj: any, parentKey: string = ''): React.ReactNode[] => {
    const rows: React.ReactNode[] = [];
    const displayData = isEditing ? editedData : obj;

    Object.entries(displayData).forEach(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (isArray(value) && isArrayOfObjects(value as any[])) {
        const arr = value as any[];
        const allKeys = Array.from(new Set(arr.flatMap(obj => Object.keys(obj))));

        allKeys.forEach((propKey, index) => {
          rows.push(
            <TableRow key={`${fullKey}.${propKey}`}>
              {index === 0 && (
                <TableCell
                  rowSpan={allKeys.length}
                  sx={{
                    fontWeight: 'bold',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    px: 1,
                    py: 0.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {key}
                </TableCell>
              )}
              <TableCell
                sx={{
                  fontWeight: 600,
                  verticalAlign: 'top',
                  fontSize: '0.875rem',
                  px: 1,
                  py: 0.5,
                  whiteSpace: 'nowrap',
                }}
              >
                {propKey}
              </TableCell>
              {arr.map((item, idx) => (
                <TableCell
                  key={idx}
                  colSpan={idx === arr.length - 1 ? maxColumns - arr.length - 1 : 1}
                  sx={{
                    verticalAlign: 'top',
                    px: 1,
                    py: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                    {(() => {
                      const cellValue = item[propKey];
                      return cellValue !== undefined
                        ? (isPrimitive(cellValue)
                          ? String(cellValue)
                          : isArray(cellValue) && !isArrayOfObjects(cellValue)
                            ? cellValue.join(', ')
                            : JSON.stringify(cellValue))
                        : '-';
                    })()}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          );
        });
      }
      else if (isObject(value) && !isArray(value)) {
        // Skip nested objects in edit mode for simplicity
        if (!isEditing) {
          const allValuesAreObjects = Object.values(value as Record<string, unknown>).every(v => isObject(v) && !isArray(v));

          if (allValuesAreObjects) {
            const subObjects = Object.entries(value as Record<string, any>);
            const allSubKeys = Array.from(
              new Set(
                subObjects.flatMap(([_, subObj]) =>
                  isObject(subObj) ? Object.keys(subObj as object) : []
                )
              )
            );

            allSubKeys.forEach((subKey, index) => {
              rows.push(
                <TableRow key={`${fullKey}.${subKey}`}>
                  {index === 0 && (
                    <TableCell
                      rowSpan={allSubKeys.length}
                      sx={{
                        fontWeight: 'bold',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        px: 1,
                        py: 0.5,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {key}
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem', px: 1, py: 0.5, whiteSpace: 'nowrap' }}>
                    {subKey}
                  </TableCell>
                  {subObjects.map(([objKey, subObj], objIndex) => (
                    <TableCell
                      key={objKey}
                      colSpan={objIndex === subObjects.length - 1 ? maxColumns - subObjects.length - 1 : 1}
                      sx={{ verticalAlign: 'top', px: 1, py: 0.5 }}
                    >
                      <Typography variant="body2" sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                        {(() => {
                          const cellValue = (subObj as Record<string, any>)[subKey];
                          return cellValue !== undefined
                            ? (isPrimitive(cellValue)
                              ? String(cellValue)
                              : isArray(cellValue) && !isArrayOfObjects(cellValue)
                                ? cellValue.join(', ')
                                : JSON.stringify(cellValue))
                            : '-';
                        })()}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              );
            });
          } else {
            const subEntries = Object.entries(value as Record<string, unknown>);

            subEntries.forEach(([subKey, subValue], index) => {
              if (isObject(subValue) && !isArray(subValue)) {
                const nestedEntries = Object.entries(subValue as Record<string, unknown>);

                nestedEntries.forEach(([nestedKey, nestedValue], nestedIndex) => {
                  rows.push(
                    <TableRow key={`${fullKey}.${subKey}.${nestedKey}`}>
                      {index === 0 && nestedIndex === 0 && (
                        <TableCell
                          rowSpan={subEntries.reduce((acc, [_, v]) => {
                            if (isObject(v) && !isArray(v)) {
                              return acc + Object.keys(v as object).length;
                            }
                            return acc + 1;
                          }, 0)}
                          sx={{ fontWeight: 'bold', verticalAlign: 'middle', textAlign: 'center', fontSize: '0.875rem', px: 1, py: 0.5, whiteSpace: 'nowrap' }}
                        >
                          {key}
                        </TableCell>
                      )}
                      {nestedIndex === 0 && (
                        <TableCell rowSpan={nestedEntries.length} sx={{ fontWeight: 600, verticalAlign: 'middle', fontSize: '0.875rem', px: 1, py: 0.5, whiteSpace: 'nowrap' }}>
                          {subKey}
                        </TableCell>
                      )}
                      <TableCell sx={{ fontWeight: 500, verticalAlign: 'top', fontSize: '0.875rem', px: 1, py: 0.5, whiteSpace: 'nowrap' }}>
                        {nestedKey}
                      </TableCell>
                      <TableCell colSpan={maxColumns - 3} sx={{ px: 1, py: 0.5 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                          {nestedValue !== undefined
                            ? (isPrimitive(nestedValue) ? String(nestedValue) : JSON.stringify(nestedValue))
                            : '-'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                });
              } else {
                rows.push(
                  <TableRow key={`${fullKey}.${subKey}`}>
                    {index === 0 && (
                      <TableCell
                        rowSpan={subEntries.reduce((acc, [_, v]) => {
                          if (isObject(v) && !isArray(v)) {
                            return acc + Object.keys(v as object).length;
                          }
                          return acc + 1;
                        }, 0)}
                        sx={{ fontWeight: 'bold', verticalAlign: 'middle', textAlign: 'center', fontSize: '0.875rem', px: 1, py: 0.5 }}
                      >
                        {key}
                      </TableCell>
                    )}
                    <TableCell sx={{ fontWeight: 600, verticalAlign: 'top', fontSize: '0.875rem', px: 1, py: 0.5, whiteSpace: 'nowrap' }}>
                      {subKey}
                    </TableCell>
                    <TableCell colSpan={maxColumns - 2} sx={{ px: 1, py: 0.5 }}>
                      {renderSimpleValue(subValue)}
                    </TableCell>
                  </TableRow>
                );
              }
            });
          }
        }
      }
      else {
        rows.push(
          <TableRow key={fullKey}>
            <TableCell sx={{ fontWeight: 'bold', verticalAlign: 'middle', textAlign: 'left', fontSize: '0.875rem', px: 1, py: 0.5, whiteSpace: 'nowrap' }}>
              {key}
            </TableCell>
            <TableCell sx={{ px: 1, py: 0.5 }}>
              {isEditing && isPrimitive(value) ? renderEditableValue(key, value) : renderSimpleValue(value)}
            </TableCell>
          </TableRow>
        );
      }
    });

    return rows;
  };

  const formatTitle = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (!isObject(data)) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography color="error">Invalid data: Expected an object</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: 'fit-content', maxWidth: '100%' }}>
      {/* Table Header with title */}
      <Box sx={{ mb: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
        {title && (
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0 }}>
            {formatTitle(title)}
          </Typography>
        )}
        {isAuthenticated && !isEditing && (
          <IconButton
            onClick={handleEditClick}
            size="small"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          width: 'fit-content',
          maxWidth: '100%',
          overflowX: 'auto',
          boxShadow: 2,
          border: '1px solid rgba(224, 224, 224, 1)',
        }}
      >
        <Table
          size="small"
          sx={{
            tableLayout: 'auto',
            width: '100%',
            '& .MuiTableCell-root': {
              borderRight: '1px solid rgba(224, 224, 224, 1)',
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
              '&:last-child': { borderRight: 'none' },
            },
            '& .MuiTableRow-root:last-child .MuiTableCell-root': {
              borderBottom: 'none',
            },
          }}
        >
          <TableBody>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  px: 1,
                  py: 0.5,
                }}
              />
              <TableCell
                colSpan={maxColumns - 1}
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  fontSize: '0.875rem',
                  px: 1,
                  py: 0.5,
                }}
              >
                Data
              </TableCell>
            </TableRow>
            {renderObjectRows(data)}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Cancel / Confirm buttons */}
      {isEditing && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 2,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={handleCancel} disabled={updating}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleConfirm} disabled={updating}>
              {updating ? 'Updating...' : 'Confirm'}
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default DynamicTable;