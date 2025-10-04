import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';

type Primitive = string | number | boolean | null | undefined;

interface DynamicTableProps {
  data: any;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data }) => {
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

  // Tính số cột tối đa cần thiết
  const calculateMaxColumns = (obj: any): number => {
    let maxCols = 2; // Minimum: category + property columns

    Object.values(obj).forEach((value) => {
      if (isArray(value) && isArrayOfObjects(value as any[])) {
        // Array of objects: 1 category + 1 property + array.length value columns
        maxCols = Math.max(maxCols, 1 + 1 + (value as any[]).length);
      } else if (isObject(value) && !isArray(value)) {
        const allValuesAreObjects = Object.values(value as Record<string, unknown>).every(
          (v) => isObject(v) && !isArray(v)
        );
        if (allValuesAreObjects) {
          // Object of objects
          const numSubObjects = Object.keys(value as object).length;
          maxCols = Math.max(maxCols, 1 + 1 + numSubObjects);
        } else {
          // Object thông thường - check nếu có nested objects
          const subEntries = Object.entries(value as Record<string, unknown>);
          let hasNestedObjects = false;

          subEntries.forEach(([_, subValue]) => {
            if (isObject(subValue) && !isArray(subValue)) {
              hasNestedObjects = true;
            }
          });

          // Nếu có nested objects, cần thêm 1 cột cho subproperty
          if (hasNestedObjects) {
            maxCols = Math.max(maxCols, 4); // category + property + subproperty + value
          }
        }
      }
    });

    return maxCols;
  };

  const maxColumns = isObject(data) ? calculateMaxColumns(data) : 2;

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

  const renderCell = (cellValue: any, key?: string | number) => (
    <TableCell
      key={key}
      sx={{
        verticalAlign: 'top',
        px: 1,
        py: 0.5,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
        }}
      >
        {cellValue !== undefined
          ? (isPrimitive(cellValue)
            ? String(cellValue)
            : isArray(cellValue) && !isArrayOfObjects(cellValue)
              ? cellValue.join(', ')
              : JSON.stringify(cellValue))
          : '-'}
      </Typography>
    </TableCell>
  );

  const renderObjectRows = (obj: any, parentKey: string = ''): React.ReactNode[] => {
    const rows: React.ReactNode[] = [];

    Object.entries(obj).forEach(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      // Array of objects - hiển thị dạng transposed table
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
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
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
      // Object (không phải array)
      else if (isObject(value) && !isArray(value)) {
        const allValuesAreObjects = Object.values(value as Record<string, unknown>).every(v => isObject(v) && !isArray(v));

        if (allValuesAreObjects) {
          // Object of objects - render như table với multiple columns
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
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    px: 1,
                    py: 0.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {subKey}
                </TableCell>
                {subObjects.map(([objKey, subObj], objIndex) => (
                  <TableCell
                    key={objKey}
                    colSpan={objIndex === subObjects.length - 1 ? maxColumns - subObjects.length - 1 : 1}
                    sx={{
                      verticalAlign: 'top',
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
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
          // Object thông thường - expand thành nhiều rows
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
                    {nestedIndex === 0 && (
                      <TableCell
                        rowSpan={nestedEntries.length}
                        sx={{
                          fontWeight: 600,
                          verticalAlign: 'middle',
                          fontSize: '0.875rem',
                          px: 1,
                          py: 0.5,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {subKey}
                      </TableCell>
                    )}
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        verticalAlign: 'top',
                        fontSize: '0.875rem',
                        px: 1,
                        py: 0.5,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {nestedKey}
                    </TableCell>
                    <TableCell
                      colSpan={maxColumns - 3}
                      sx={{
                        px: 1,
                        py: 0.5,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: '0.875rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {nestedValue !== undefined
                          ? (isPrimitive(nestedValue)
                            ? String(nestedValue)
                            : JSON.stringify(nestedValue))
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
                      sx={{
                        fontWeight: 'bold',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        px: 1,
                        py: 0.5,
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
                    {subKey}
                  </TableCell>
                  <TableCell
                    colSpan={maxColumns - 2}
                    sx={{
                      px: 1,
                      py: 0.5,
                    }}
                  >
                    {renderSimpleValue(subValue)}
                  </TableCell>
                </TableRow>
              );
            }
          });
        }
      }
      // Primitive values hoặc array of primitives
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
              colSpan={maxColumns - 1}
              sx={{
                px: 1,
                py: 0.5,
              }}
            >
              {renderSimpleValue(value)}
            </TableCell>
          </TableRow>
        );
      }
    });

    return rows;
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
            '&:last-child': {
              borderRight: 'none',
            },
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
            >
            </TableCell>
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
  );
};

export default DynamicTable;