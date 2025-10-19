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
  TableHead,
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

// -----------------------------------------------------------
// Helper: Tính toán độ rộng Key tối đa (cho các object lồng nhau)
// -----------------------------------------------------------
const calculateMaxKeyLength = (obj: any, utils: any): number => {
  let maxLength = 0;
  if (!utils.isObject(obj)) return 0;

  const traverse = (current: any) => {
    Object.keys(current).forEach(key => {
      maxLength = Math.max(maxLength, key.length);
      const value = current[key];
      if (utils.isObject(value) && !utils.isArray(value)) {
        traverse(value);
      }
    });
  };
  traverse(obj);
  const minWidth = 100;
  return Math.max(minWidth, maxLength * 8 + 16);
};


// -----------------------------------------------------------
// EditableInput Component (Unchanged)
// -----------------------------------------------------------
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

// -----------------------------------------------------------
// DynamicTable Component
// -----------------------------------------------------------
const DynamicTable: React.FC<DynamicTableProps> = ({ data, title, endpoint, onUpdate }) => {
  const { isLoggedIn } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<any>({});
  const [updating, setUpdating] = useState(false);

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

  // -----------------------------------------------------------
  // Tính toán độ rộng Key tối đa cho Object lồng nhau (Khắc phục lỗi TS Scope)
  // -----------------------------------------------------------
  const maxKeyWidthMap = useMemo(() => {
    const map = new Map<string, string>();
    if (!isObject(data)) return map;

    Object.entries(data).forEach(([outerKey, outerValue]) => {
      if (isObject(outerValue) && !isArray(outerValue)) {
        const maxWidth = calculateMaxKeyLength(outerValue, utils);
        map.set(outerKey, `${maxWidth}px`);
      }
    });
    return map;
  }, [data, isObject, isArray, utils]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    setEditedData(JSON.parse(JSON.stringify(data)));
  }, [data]);

  const setNestedValue = useCallback((obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((acc, key) => {
      const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, arrayKey, index] = arrayMatch;
        if (!acc[arrayKey] || !Array.isArray(acc[arrayKey])) acc[arrayKey] = [];
        if (!acc[arrayKey][parseInt(index)]) acc[arrayKey][parseInt(index)] = {};
        return acc[arrayKey][parseInt(index)];
      }
      if (!acc[key] || typeof acc[key] !== 'object') acc[key] = {};
      return acc[key];
    }, obj);
    target[lastKey] = value;
  }, []);

  const handleFieldChange = useCallback((path: string, value: any) => {
    setEditedData((prev: any) => {
      const newData = JSON.parse(JSON.stringify(prev));
      let typedValue: any = value;
      if (typeof value === 'string') {
        if (value.toLowerCase() === 'true') typedValue = true;
        else if (value.toLowerCase() === 'false') typedValue = false;
        else if (!isNaN(Number(value)) && value.trim() !== '') typedValue = Number(value);
      }
      setNestedValue(newData, path, typedValue);
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

  const getNestedValue = useCallback((obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => {
      const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
      if (arrayMatch) {
        const [, arrayKey, index] = arrayMatch;
        return acc?.[arrayKey]?.[parseInt(index)];
      }
      return acc?.[key];
    }, obj);
  }, []);

  const renderEditableValue = useCallback((path: string, value: any): React.ReactNode => {
    if (!isPrimitive(value)) {
      return (
        <Typography variant="body2" sx={{ fontSize: '0.875rem', whiteSpace: 'normal' }}>
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
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
          title={displayValue}
        >
          {displayValue}
        </Typography>
      );
    }
    if (isArray(value) && !isArrayOfObjects(value)) {
      const displayValue = `[${value.map((item: Primitive) => isPrimitive(item) ? String(item) : JSON.stringify(item)).join(', ')}]`;
      return (
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
          title={displayValue}
        >
          {displayValue}
        </Typography>
      );
    }
    return null;
  }, [isPrimitive, isArray, isArrayOfObjects]);

  // -----------------------------------------------------------
  // RENDER ARRAY OF OBJECTS (Bảng Chi tiết)
  // -----------------------------------------------------------
  const renderArrayOfObjectsTable = useCallback((arr: any[], arrayKey: string): React.ReactNode => {
    if (arr.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={10}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              No data available for {arrayKey}.
            </Typography>
          </TableCell>
        </TableRow>
      );
    }

    const allKeys = Array.from(new Set(arr.flatMap(obj => Object.keys(obj))));

    return (
      <TableContainer component={Box} sx={{ mt: 1, mb: 1 }}>
        <Table size="small" sx={{
          border: '1px solid rgba(224, 224, 224, 1)',
          '& .MuiTableCell-root': {
            borderRight: '1px solid rgba(224, 224, 224, 1)',
            borderBottom: '1px solid rgba(224, 224, 224, 1)',
            '&:last-child': { borderRight: 'none' },
          },
          '& .MuiTableRow-root:last-child .MuiTableCell-root': {
            borderBottom: 'none',
          },
        }}>
          <TableHead>
            <TableRow>
              {allKeys.map(key => (
                <TableCell key={key} sx={{ fontWeight: 'bold', fontSize: '0.875rem', py: 0.5, verticalAlign: 'middle' }}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {arr.map((item, index) => (
              <TableRow key={index}>
                {allKeys.map(key => {
                  const cellPath = `${arrayKey}[${index}].${key}`;
                  const cellValue = item[key];

                  return (
                    <TableCell key={key} sx={{ verticalAlign: 'middle', py: 0.5 }}>
                      {isEditing && isPrimitive(cellValue) ? (
                        renderEditableValue(cellPath, cellValue)
                      ) : (
                        renderSimpleValue(cellValue) || (
                          <Box sx={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(cellValue, null, 2)}
                          </Box>
                        )
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }, [isEditing, isPrimitive, renderEditableValue, renderSimpleValue]);

  /**
   * Hàm render object lồng nhau sử dụng Flexbox để kiểm soát border/width tốt hơn.
   */
  const renderNestedObject = useCallback((obj: any, fullKey: string, isLastParentRow: boolean, keyWidth: string): React.ReactNode => {
    const entries = Object.entries(obj);

    return (
      <Box sx={{ width: '100%', borderLeft: '1px solid rgba(224, 224, 224, 1)' }}>
        {entries.map(([subKey, subValue], index) => {
          const subPath = `${fullKey}.${subKey}`;
          const isLastItem = index === entries.length - 1;
          const nextIsLastParentRow = isLastParentRow && isLastItem;

          if (isObject(subValue) && !isArray(subValue)) {
            // Object lồng nhau -> recursive call
            return (
              <Box
                key={subKey}
                sx={{
                  display: 'flex',
                  // KHẮC PHỤC DOUBLE BORDER: Bỏ border dưới nếu là hàng cuối cùng của toàn bộ cấu trúc lồng nhau (nextIsLastParentRow)
                  borderBottom: nextIsLastParentRow ? 'none' : '1px solid rgba(224, 224, 224, 1)',
                }}
              >
                {/* Key Column */}
                <Box
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    px: 1,
                    py: 0.5,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    width: keyWidth,
                    minWidth: keyWidth,
                    borderRight: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',
                    alignItems: 'center', // Căn giữa dọc
                  }}
                >
                  {subKey}
                </Box>
                {/* Value Column (chứa object lồng) */}
                <Box sx={{ flexGrow: 1, padding: 0 }}>
                  {renderNestedObject(subValue, subPath, nextIsLastParentRow, keyWidth)}
                </Box>
              </Box>
            );
          }

          // Primitive value
          return (
            <Box
              key={subKey}
              sx={{
                display: 'flex',
                // KHẮC PHỤC DOUBLE BORDER: Bỏ border dưới nếu là hàng cuối cùng của toàn bộ cấu trúc lồng nhau (nextIsLastParentRow)
                borderBottom: nextIsLastParentRow ? 'none' : '1px solid rgba(224, 224, 224, 1)',
              }}
            >
              {/* Key Column */}
              <Box
                sx={{
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  px: 1,
                  py: 0.5,
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  width: keyWidth, // Áp dụng width tối đa
                  minWidth: keyWidth,
                  borderRight: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  alignItems: 'center', // Căn giữa dọc
                }}
              >
                {subKey}
              </Box>
              {/* Value Column */}
              <Box
                sx={{
                  flexGrow: 1,
                  px: 1,
                  py: 0.5,
                  display: 'flex',
                  alignItems: 'center', // Căn giữa dọc
                }}
              >
                {isEditing && isPrimitive(subValue) ?
                  renderEditableValue(subPath, subValue) :
                  renderSimpleValue(subValue)
                }
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }, [isObject, isArray, isPrimitive, isEditing, renderEditableValue, renderSimpleValue]);


  const renderObjectRows = useCallback((obj: any): React.ReactNode[] => {
    const rows: React.ReactNode[] = [];
    const displayData = isEditing ? editedData : obj;
    const keys = Object.keys(displayData);
    const totalKeys = keys.length;

    keys.forEach((key, index) => {
      const value = displayData[key];
      const fullKey = key;
      const isLastKey = index === totalKeys - 1;

      const currentKeyWidth = maxKeyWidthMap.get(key) || '100px';

      // TH1: Array of Objects (render bảng riêng)
      if (isArray(value) && isArrayOfObjects(value as any[])) {
        rows.push(
          <TableRow key={fullKey}>
            <TableCell
              colSpan={2}
              sx={{
                fontWeight: 'bold',
                verticalAlign: 'middle',
                textAlign: 'left',
                fontSize: '0.875rem',
                px: 1,
                py: 0.5,
                whiteSpace: 'nowrap',
                borderBottom: isLastKey ? 'none' : '1px solid rgba(224, 224, 224, 1)',
              }}
            >
              {key}
              {renderArrayOfObjectsTable(value as any[], fullKey)}
            </TableCell>
          </TableRow>
        );
      }
      // TH2: Object lồng nhau (Sử dụng Flexbox)
      else if (isObject(value) && !isArray(value)) {
        rows.push(
          <TableRow key={fullKey}>
            <TableCell
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
            <TableCell
              sx={{
                padding: 0,
                borderRight: 'none',
                borderBottom: 'none',
              }}
            >
              {renderNestedObject(value, fullKey, isLastKey, currentKeyWidth)}
            </TableCell>
          </TableRow>
        );
      }
      // TH3: Primitive Value
      else {
        rows.push(
          <TableRow key={fullKey}>
            <TableCell
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
            <TableCell
              sx={{
                px: 1,
                py: 0.5,
                verticalAlign: 'middle',
                // Kiểm soát border dưới: Bỏ nếu là key cuối cùng
                borderBottom: isLastKey ? 'none' : '1px solid rgba(224, 224, 224, 1)',
              }}
            >
              {isEditing && isPrimitive(value) ?
                renderEditableValue(fullKey, value) :
                isPrimitive(value) ?
                  renderSimpleValue(value) :
                  <Box sx={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(value, null, 2)}
                  </Box>
              }
            </TableCell>
          </TableRow>
        );
      }
    });

    return rows;
  }, [isEditing, editedData, isArray, isArrayOfObjects, isObject, isPrimitive, renderEditableValue, renderSimpleValue, renderNestedObject, renderArrayOfObjectsTable, maxKeyWidthMap]);

  const formattedTitle = useMemo(() =>
    title ? title.charAt(0).toUpperCase() + title.slice(1) : null,
    [title]);

  // Logic kiểm tra nếu data là Array of Objects (như PortStatistics)
  const isTopLevelArray = isArray(data) && isArrayOfObjects(data as any[]);

  if (!isObject(data) && !isTopLevelArray) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography color="error">Invalid data: Expected an object or Array of Objects</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  // -----------------------------------------------------------
  // JSX chính
  // -----------------------------------------------------------
  if (isTopLevelArray) {
    return (
      <Box sx={{ position: 'relative', width: '100%' }}>
        {formattedTitle && (
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            {formattedTitle}
          </Typography>
        )}
        {renderArrayOfObjectsTable(data as any[], title || 'Data')}
      </Box>
    );
  }

  // JSX cho Object chính
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
            // Đặt border cho các cell của bảng chính
            '& .MuiTableCell-root': {
              borderRight: '1px solid rgba(224, 224, 224, 1)',
              borderBottom: '1px solid rgba(224, 224, 224, 1)',
              '&:last-child': { borderRight: 'none' },
            },
            // Loại bỏ border dưới cho hàng cuối cùng của bảng chính
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
                  width: '1%',
                }}
              />
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  fontSize: '0.875rem',
                  px: 1,
                  py: 0.5,
                  width: '100%',
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