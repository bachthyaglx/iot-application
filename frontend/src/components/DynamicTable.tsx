// src/components/DynamicTable.tsx
import React, { useState, useCallback, useMemo, memo } from 'react';
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';

type Primitive = string | number | boolean | null | undefined;

interface DynamicTableProps {
  data: any;
  title?: string;
  endpoint?: string;
  onUpdate: (endpoint: string, updatedData: any) => Promise<boolean>;
}

// Memoized EditableInput component
const EditableInput = memo<{
  fieldKey: string;
  value: any;
  currentValue: any;
  onChange: (key: string, value: any) => void;
}>(({ fieldKey, value, currentValue, onChange }) => {
  const displayValue = currentValue === null ? '' : String(currentValue);
  const originalDisplayValue = value === null ? 'null' : value === undefined ? 'undefined' : String(value);

  return (
    <Box sx={{ position: 'relative', display: 'block', width: '100%' }}>
      {/* Invisible text to maintain height */}
      <Box
        sx={{
          fontSize: '0.875rem',
          lineHeight: '1.43',
          padding: '2px 4px',
          minHeight: '20px',
          border: '1px solid transparent',
          boxSizing: 'border-box',
          whiteSpace: 'nowrap',
          visibility: 'hidden',
        }}
      >
        {originalDisplayValue}
      </Box>
      {/* Actual input - positioned absolutely to overlay the invisible box */}
      <input
        type="text"
        value={displayValue}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          fontSize: '0.875rem',
          lineHeight: '1.43',
          padding: '2px 4px',
          minHeight: '20px',
          width: '100%',
          height: '100%',
          border: '1px solid #ccc',
          outline: 'none',
          background: '#fff',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
      />
    </Box>
  );
});

EditableInput.displayName = 'EditableInput';

const DynamicTable: React.FC<DynamicTableProps> = ({ data, title, endpoint, onUpdate }) => {
  const { isLoggedIn } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [updating, setUpdating] = useState(false);

  // Memoized utility functions
  const utils = useMemo(() => ({
    isObject: (value: any): boolean => {
      return value !== null && typeof value === 'object' && !Array.isArray(value);
    },
    isArray: (value: any): boolean => {
      return Array.isArray(value);
    },
    isPrimitive: (value: any): boolean => {
      return value === null || value === undefined ||
        typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
    },
    isArrayOfObjects: (arr: any[]): boolean => {
      return arr.length > 0 && arr.every(item =>
        item !== null && typeof item === 'object' && !Array.isArray(item)
      );
    },
  }), []);

  const { isObject, isArray, isPrimitive, isArrayOfObjects } = utils;

  // Memoized max columns calculation
  const maxColumns = useMemo(() => {
    if (!isObject(data)) return 2;

    let maxCols = 2;
    Object.values(data).forEach((value) => {
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
  }, [data, isObject, isArray, isArrayOfObjects]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setEditedData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  // Helper function to set nested value by path
  const setNestedValue = useCallback((obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((acc, key) => {
      // Handle array indices
      const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, arrayKey, index] = arrayMatch;
        return acc[arrayKey][parseInt(index)];
      }
      return acc[key];
    }, obj);
    target[lastKey] = value;
  }, []);

  const handleFieldChange = useCallback((path: string, value: any) => {
    setEditedData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      setNestedValue(newData, path, value);
      return newData;
    });
  }, [setNestedValue]);

  const handleConfirm = useCallback(async () => {
    if (!endpoint || !onUpdate) {
      alert('Update function not configured');
      return;
    }

    setUpdating(true);
    try {
      const success = await onUpdate(endpoint, editedData);
      if (success) {
        setIsEditing(false);
      }
    } finally {
      setUpdating(false);
    }
  }, [endpoint, editedData, onUpdate]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditedData({});
  }, []);

  // Helper to get nested value by path
  const getNestedValue = useCallback((obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => {
      const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, arrayKey, index] = arrayMatch;
        return acc[arrayKey]?.[parseInt(index)];
      }
      return acc?.[key];
    }, obj);
  }, []);

  const renderEditableValue = useCallback((path: string, value: any): React.ReactNode => {
    if (!isPrimitive(value)) {
      return (
        <Typography variant="body2" sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          {String(value)}
        </Typography>
      );
    }

    const currentValue = getNestedValue(editedData, path) ?? value;
    return (
      <EditableInput
        fieldKey={path}
        value={value}
        currentValue={currentValue}
        onChange={handleFieldChange}
      />
    );
  }, [editedData, handleFieldChange, isPrimitive, getNestedValue]);

  const renderSimpleValue = useCallback((value: any): React.ReactNode => {
    if (isPrimitive(value)) {
      const displayValue = value === null ? 'null' : value === undefined ? 'undefined' : String(value);
      return (
        <Box
          sx={{
            position: 'relative',
            minWidth: 'max-content',
            display: 'inline-block'
          }}
        >
          <Box
            sx={{
              fontSize: '0.875rem',
              lineHeight: '1.43',
              padding: '2px 4px',
              minHeight: '20px',
              border: '1px solid transparent',
              boxSizing: 'border-box',
              whiteSpace: 'nowrap',
            }}
          >
            {displayValue}
          </Box>
        </Box>
      );
    }
    if (isArray(value) && !isArrayOfObjects(value)) {
      const displayValue = value.map((item: Primitive) => isPrimitive(item) ? String(item) : JSON.stringify(item)).join(', ');
      return (
        <Box
          sx={{
            position: 'relative',
            minWidth: 'max-content',
            display: 'inline-block'
          }}
        >
          <Box
            sx={{
              fontSize: '0.875rem',
              lineHeight: '1.43',
              padding: '2px 4px',
              minHeight: '20px',
              border: '1px solid transparent',
              boxSizing: 'border-box',
              whiteSpace: 'nowrap',
            }}
          >
            {displayValue}
          </Box>
        </Box>
      );
    }
    return null;
  }, [isPrimitive, isArray, isArrayOfObjects]);

  const renderObjectRows = useCallback((obj: any, parentKey: string = ''): React.ReactNode[] => {
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
              {arr.map((item, idx) => {
                const cellValue = item[propKey];
                const cellPath = `${fullKey}[${idx}].${propKey}`;

                return (
                  <TableCell
                    key={idx}
                    colSpan={idx === arr.length - 1 ? maxColumns - arr.length - 1 : 1}
                    sx={{
                      verticalAlign: 'top',
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    {isEditing && isPrimitive(cellValue) ? (
                      renderEditableValue(cellPath, cellValue)
                    ) : (
                      <Typography variant="body2" sx={{ fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                        {cellValue !== undefined
                          ? (isPrimitive(cellValue)
                            ? String(cellValue)
                            : isArray(cellValue) && !isArrayOfObjects(cellValue)
                              ? cellValue.join(', ')
                              : JSON.stringify(cellValue))
                          : '-'}
                      </Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        });
      }
      else if (isObject(value) && !isArray(value)) {
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
            <TableCell sx={{ px: 1, py: 0.5, whiteSpace: 'nowrap', width: isEditing ? '100%' : 'auto' }}>
              {isEditing && isPrimitive(value) ? renderEditableValue(fullKey, value) : renderSimpleValue(value)}
            </TableCell>
          </TableRow>
        );
      }
    });

    return rows;
  }, [isEditing, editedData, isArray, isArrayOfObjects, isObject, isPrimitive, maxColumns, renderEditableValue, renderSimpleValue]);

  const formattedTitle = useMemo(() =>
    title ? title.charAt(0).toUpperCase() + title.slice(1) : null,
    [title]);

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
      <Box sx={{ mb: 1, position: 'relative', display: 'flex', alignItems: 'center', minHeight: '32px' }}>
        {formattedTitle && (
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0 }}>
            {formattedTitle}
          </Typography>
        )}
        {isLoggedIn && !isEditing && (
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

export default memo(DynamicTable);