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
// THUẬT TOÁN LINH HOẠT: Tính toán độ rộng theo độ dài ký tự
// -----------------------------------------------------------

interface Utils {
  isObject: (value: any) => boolean;
  isArray: (value: any) => boolean;
}

/**
 * Thuật toán tính độ dài ký tự tối đa của Key (cột bên trái) trong một Object.
 */
const getMaxKeyLengthMap = (obj: any, utils: Utils, currentPath: string = 'root', map: Map<string, number> = new Map()): Map<string, number> => {
  if (!utils.isObject(obj)) return map;

  let maxLength = 0;

  Object.keys(obj).forEach(key => {
    maxLength = Math.max(maxLength, key.length);
    const value = obj[key];

    if (utils.isObject(value) && !utils.isArray(value)) {
      getMaxKeyLengthMap(value, utils, key, map);
    }
  });

  if (maxLength > 0) {
    map.set(currentPath, maxLength);
  }

  return map;
};

/**
 * Chuyển đổi độ dài ký tự tối đa thành chuỗi CSS minWidth linh hoạt.
 */
const getKeyWidthCss = (length: number): string => {
  const paddingChars = 2; // Giữ padding char nhỏ (tổng 8px padding ngoài)
  const minWidthChars = 5;

  const finalLength = Math.max(length + paddingChars, minWidthChars);

  return `calc(${finalLength}ch + 8px)`;
};


// -----------------------------------------------------------
// EditableInput Component (Không đổi)
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

  const formattedTitle = useMemo(() =>
    title ? title.charAt(0).toUpperCase() + title.slice(1) : null,
    [title]);

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

  const maxKeyLengthMap = useMemo(() => {
    return getMaxKeyLengthMap(data, utils);
  }, [data, utils]);

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

  /**
   * Hàm render object lồng nhau sử dụng Flexbox
   */
  const renderNestedObject = useCallback((obj: any, fullKey: string, isLastParentRow: boolean, currentParentKey: string): React.ReactNode => {
    const entries = Object.entries(obj);

    const maxLength = maxKeyLengthMap.get(currentParentKey) || 12; // Mặc định 12 ký tự
    const finalKeyWidth = getKeyWidthCss(maxLength);

    // Padding chuẩn cho Box lồng nhau
    const pxValue = 1;

    return (
      <Box
        sx={{
          width: '100%',
          // SỬA ĐỔI: Loại bỏ viền trái thừa ở đây (đã có viền phải của TableCell cha)
          // borderLeft: '1px solid rgba(224, 224, 224, 1)', 
        }}
      >
        {entries.map(([subKey, subValue], index) => {
          const subPath = `${fullKey}.${subKey}`;
          const isLastItem = index === entries.length - 1;
          const nextIsLastParentRow = isLastParentRow && isLastItem;

          const isContentValue = subKey === 'content';
          const isNested = isObject(subValue) && !isArray(subValue);

          // Cột Key
          const keyBox = (
            <Box
              sx={{
                fontWeight: 500,
                fontSize: '0.875rem',
                px: pxValue,
                py: 0.5,
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                flex: `0 0 ${finalKeyWidth}`,
                minWidth: finalKeyWidth,
                maxWidth: '300px',
                // SỬA ĐỔI: Viền dọc giữa Key và Value Box
                borderRight: '1px solid rgba(224, 224, 224, 1)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {subKey}
            </Box>
          );

          // Cột Value
          const valueBox = isNested ? (
            <Box sx={{ flexGrow: 1, padding: 0 }}>
              {renderNestedObject(subValue, subPath, nextIsLastParentRow, subKey)}
            </Box>
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                flexShrink: 1,
                minWidth: isContentValue ? '200px' : '100px',
                wordBreak: isContentValue ? 'break-all' : 'break-word',
                px: pxValue,
                py: 0.5,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {isEditing && isPrimitive(subValue) ?
                renderEditableValue(subPath, subValue) :
                renderSimpleValue(subValue) || (
                  <Box sx={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(subValue, null, 2)}
                  </Box>
                )
              }
            </Box>
          );

          return (
            <Box
              key={subKey}
              sx={{
                display: 'flex',
                width: '100%',
                // SỬA ĐỔI: Quản lý viền dưới
                borderBottom: nextIsLastParentRow ? 'none' : '1px solid rgba(224, 224, 224, 1)',
              }}
            >
              {keyBox}
              {valueBox}
            </Box>
          );
        })}
      </Box>
    );
  }, [isObject, isArray, isPrimitive, isEditing, renderEditableValue, renderSimpleValue, maxKeyLengthMap]);


  const renderObjectRows = useCallback((obj: any): React.ReactNode[] => {
    const rows: React.ReactNode[] = [];
    const displayData = isEditing ? editedData : obj;
    const keys = Object.keys(displayData);
    const totalKeys = keys.length;

    const isPortsCollection = formattedTitle === 'Ports';
    const rootKeyWidth = getKeyWidthCss(maxKeyLengthMap.get('root') || 10);

    const tableCellPxValue = 1;

    // ----------------------------------------------------------
    // TÍNH TOÁN CỘT WIDTH CHO TRƯỜNG HỢP KHÔNG PHẢI PORTS/ARRAY (Mặc định là Root Key Width)
    // ----------------------------------------------------------
    const defaultKeyWidth = rootKeyWidth;

    keys.forEach((key, index) => {
      const value = displayData[key];
      const fullKey = key;
      const isLastKey = index === totalKeys - 1;

      // ----------------------------------------------------------
      // TRƯỜNG HỢP 1: PORTS COLLECTION (Xử lý 3 cột)
      // ----------------------------------------------------------
      if (isPortsCollection) {
        // --- (Logic này KHÔNG được lặp lại trong forEach keys nếu isPortsCollection là true)
        // Vì logic Ports Collection nên xử lý TOÀN BỘ dữ liệu. 
        // Logic này chỉ cần chạy MỘT LẦN cho toàn bộ `data` nếu `isPortsCollection` là true.
        // Tuy nhiên, vì cấu trúc code hiện tại lặp qua `keys` của data, ta sẽ giữ lại
        // và đảm bảo nó xử lý tất cả các port.

        // Ta chỉ cần xử lý Ports Collection trong vòng lặp đầu tiên nếu nó được kích hoạt
        if (index === 0) {
          keys.forEach((parentKey, parentIndex) => {
            const parentValue = displayData[parentKey];
            if (!isObject(parentValue) || isArray(parentValue)) return;

            const childEntries = Object.entries(parentValue);
            const isLastParent = parentIndex === totalKeys - 1;

            childEntries.forEach(([childKey, childValue], childIndex) => {
              const isFirstChild = childIndex === 0;
              const isLastChild = childIndex === childEntries.length - 1;
              const fullPath = `${parentKey}.${childKey}`;

              const attributeKeyWidth = getKeyWidthCss(maxKeyLengthMap.get(parentKey) || 12);

              rows.push(
                <TableRow key={fullPath}>
                  {/* CỘT 1: Port Name (Parent Key) */}
                  {isFirstChild && (
                    <TableCell
                      rowSpan={childEntries.length}
                      sx={{
                        fontWeight: 'bold',
                        verticalAlign: 'middle',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        px: tableCellPxValue,
                        py: 0.5,
                        whiteSpace: 'nowrap',
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                        minWidth: '100px',
                      }}
                    >
                      {parentKey}
                    </TableCell>
                  )}

                  {/* CỘT 2: Attribute Key (Child Key) */}
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      verticalAlign: 'middle',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      px: tableCellPxValue,
                      py: 0.5,
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      minWidth: attributeKeyWidth,
                      maxWidth: '300px',
                      borderRight: '1px solid rgba(224, 224, 224, 1)',
                    }}
                  >
                    {childKey}
                  </TableCell>

                  {/* CỘT 3: Value */}
                  <TableCell
                    sx={{
                      px: 0, // Padding 0 vì nội dung lồng nhau đã có padding
                      py: 0,
                      verticalAlign: 'middle',
                      // Viền dưới: Chỉ áp dụng cho hàng cuối cùng của toàn bộ bảng
                      borderBottom: (isLastParent && isLastChild) ? 'none' : '1px solid rgba(224, 224, 224, 1)',
                      width: '100%',
                    }}
                  >
                    {isObject(childValue) && !isArray(childValue) ? (
                      renderNestedObject(childValue, fullPath, isLastParent && isLastChild, childKey)
                    ) : isEditing && isPrimitive(childValue) ? (
                      <Box sx={{ px: tableCellPxValue, py: 0.5 }}>
                        {renderEditableValue(fullPath, childValue)}
                      </Box>
                    ) : (
                      <Box sx={{ px: tableCellPxValue, py: 0.5 }}>
                        {renderSimpleValue(childValue) || (
                          <Box sx={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                            {JSON.stringify(childValue, null, 2)}
                          </Box>
                        )}
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              );
            });
          });
          return rows;
        }
        // Vì logic Ports Collection đã return rows ở đây, không cần quan tâm đến các trường hợp khác.
        // Ta chỉ cần return rows cuối cùng.
        return rows;
      }

      // ----------------------------------------------------------
      // TRƯỜNG HỢP 2 & 3: ARRAY OF OBJECTS, OBJECT LỒNG, PRIMITIVE
      // ----------------------------------------------------------

      if (isArray(value) && isArrayOfObjects(value as any[])) {
        // [Logic Array of Objects]
        const arr = value as any[];
        if (arr.length === 0) {
          rows.push(
            <TableRow key={fullKey}>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem', px: tableCellPxValue, py: 0.5, verticalAlign: 'middle', textAlign: 'left' }}>
                {key}
              </TableCell>
              <TableCell colSpan={100}>
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  No data available.
                </Typography>
              </TableCell>
            </TableRow>
          );
        } else {
          const allKeys = Array.from(new Set(arr.flatMap(obj => Object.keys(obj))));
          rows.push(
            <TableRow key={`${fullKey}-header`}>
              <TableCell rowSpan={arr.length + 1} sx={{ fontWeight: 'bold', fontSize: '0.875rem', px: tableCellPxValue, py: 0.5, verticalAlign: 'middle', textAlign: 'left', borderRight: '1px solid rgba(224, 224, 224, 1)', }}>
                {key}
              </TableCell>
              {allKeys.map(objKey => (<TableCell key={objKey} sx={{ fontWeight: 'bold', fontSize: '0.875rem', px: tableCellPxValue, py: 0.5, verticalAlign: 'middle', borderRight: '1px solid rgba(224, 224, 224, 1)', '&:last-child': { borderRight: 'none' } }}>
                {objKey.charAt(0).toUpperCase() + objKey.slice(1)}
              </TableCell>))}
            </TableRow>
          );
          arr.forEach((item, itemIndex) => {
            rows.push(
              <TableRow key={`${fullKey}-${itemIndex}`}>
                {allKeys.map(objKey => {
                  const cellPath = `${fullKey}[${itemIndex}].${objKey}`;
                  const cellValue = item[objKey];
                  return (
                    <TableCell key={objKey} sx={{ px: tableCellPxValue, py: 0.5, verticalAlign: 'middle', borderRight: '1px solid rgba(224, 224, 224, 1)', '&:last-child': { borderRight: 'none' } }}>
                      {isEditing && isPrimitive(cellValue) ? renderEditableValue(cellPath, cellValue) : renderSimpleValue(cellValue) || (<Box sx={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>{JSON.stringify(cellValue, null, 2)}</Box>)}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          });
        }
      }
      else {
        // Object lồng nhau hoặc Primitive
        rows.push(
          <TableRow key={fullKey}>
            <TableCell
              sx={{
                fontWeight: 'bold',
                verticalAlign: 'middle',
                textAlign: 'left',
                fontSize: '0.875rem',
                px: tableCellPxValue,
                py: 0.5,
                whiteSpace: 'nowrap',
                minWidth: defaultKeyWidth, // Áp dụng width
              }}
            >
              {key}
            </TableCell>
            <TableCell
              sx={{
                padding: isObject(value) && !isArray(value) ? 0 : `${tableCellPxValue * 4}px ${tableCellPxValue * 4}px`, // Padding cho Primitive: 4px*4px
                borderRight: 'none',
                borderBottom: isObject(value) && !isArray(value) ? 'none' : (isLastKey ? 'none' : '1px solid rgba(224, 224, 224, 1)'),
                width: '100%',
              }}
            >
              {isObject(value) && !isArray(value) ? (
                // Object lồng nhau -> Dùng renderNestedObject
                renderNestedObject(value, fullKey, isLastKey, key)
              ) : (
                // Primitive hoặc Array of Primitives -> Render trực tiếp
                <Box sx={{ px: 0, py: 0 }}> {/* Đã có padding ở TableCell cha */}
                  {isEditing && isPrimitive(value) ?
                    renderEditableValue(fullKey, value) :
                    renderSimpleValue(value) || (
                      <Box sx={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                        {JSON.stringify(value, null, 2)}
                      </Box>
                    )
                  }
                </Box>
              )}
            </TableCell>
          </TableRow>
        );
      }
    });

    return rows;
  }, [isEditing, editedData, formattedTitle, isArray, isArrayOfObjects, isObject, isPrimitive, renderEditableValue, renderSimpleValue, renderNestedObject, maxKeyLengthMap]);

  // Logic kiểm tra nếu data là Array of Objects (như PortStatistics)
  const isTopLevelArray = isArray(data) && isArrayOfObjects(data as any[]);
  // Logic kiểm tra Ports Collection (dùng title đã được chuẩn hóa)
  const isPortsCollection = formattedTitle === 'Ports';

  const rootKeyWidthCss = getKeyWidthCss(maxKeyLengthMap.get('root') || 10);
  const tableCellPxValue = 1; // Giá trị px chuẩn

  // ... (Phần JSX còn lại không đổi)

  return (
    <Box sx={{ position: 'relative', width: 'fit-content', maxWidth: '100%' }}>
      {isLoggedIn && !isEditing && formattedTitle && (
        <Box sx={{ mb: 1, position: 'relative', display: 'flex', alignItems: 'center', minHeight: '32px' }}>
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
        </Box>
      )}

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
          }}
        >
          <TableHead>
            <TableRow>
              {isPortsCollection && (
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontSize: '0.875rem',
                    px: tableCellPxValue,
                    py: 0.5,
                    borderRight: '1px solid rgba(224, 224, 224, 1)',
                    minWidth: rootKeyWidthCss, // Áp dụng width root
                  }}
                >
                  Port Name
                </TableCell>
              )}
              <TableCell
                colSpan={isPortsCollection ? 2 : 100}
                sx={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  fontSize: '0.875rem',
                  px: tableCellPxValue,
                  py: 0.5,
                }}
              >
                {formattedTitle || 'Data'}
              </TableCell>
            </TableRow>
            {isPortsCollection && (
              <TableRow>
                {/* Cell trống cho cột Port Name */}
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontSize: '0.875rem',
                    px: tableCellPxValue,
                    py: 0.5,
                  }}
                >
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontSize: '0.875rem',
                    px: tableCellPxValue,
                    py: 0.5,
                    borderRight: '1px solid rgba(224, 224, 224, 1)',
                    minWidth: getKeyWidthCss(maxKeyLengthMap.get('root') || 12), // Áp dụng width Attribute (Key cấp 2)
                    maxWidth: '300px',
                  }}
                >
                  Attribute
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    fontSize: '0.875rem',
                    px: tableCellPxValue,
                    py: 0.5,
                  }}
                >
                  Value
                </TableCell>
              </TableRow>
            )}
          </TableHead>
          <TableBody>
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

// Export không dùng memo để tránh lỗi TypeScript
export default DynamicTable;