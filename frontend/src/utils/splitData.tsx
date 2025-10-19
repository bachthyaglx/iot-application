// src/utils/splitData.tsx

export interface TableData {
  key: string;
  data: any;
  title: string;
  endpoint?: string;
}

/**
 * Formats a key into a readable title
 * Examples: 
 * - "MQTT" -> "MQTT"
 * - "UserManagement" -> "User Management"
 * - "ipAddress" -> "Ip Address"
 * - "json_configuration" -> "Json Configuration"
 */
export function formatTitle(key: string): string {
  // If all uppercase, keep as is
  if (key === key.toUpperCase()) {
    return key;
  }

  // Convert camelCase, PascalCase, or snake_case to Title Case
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Splits complex data into multiple table-ready objects
 * Each top-level complex object/array becomes a separate table
 * Primitive values are grouped into a main "Device Information" table
 * 
 * @param data - The input data object to split
 * @param baseEndpoint - Optional base endpoint for API calls (e.g., '/api/device')
 * @returns Array of table configurations
 * 
 * @example
 * const data = {
 *   deviceClass: "Sensor",
 *   manufacturer: "Siemens",
 *   MQTT: { clientMode: "active", ipAddress: "192.168.2.1" },
 *   Ports: { XD1: {...}, XD2: {...} },
 *   PortStatistics: [{ key: "...", description: "..." }],
 *   UserManagement: { Users: [...] }
 * };
 * 
 * const tables = splitDataIntoTables(data, '/api/device');
 */
export function splitDataIntoTables(
  data: any,
  baseEndpoint?: string
): TableData[] {
  // Handle null, undefined, or non-object data
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return [
      {
        key: 'main',
        data,
        title: 'Data',
        endpoint: baseEndpoint,
      },
    ];
  }

  const tables: TableData[] = [];
  const mainData: any = {};

  // Iterate through each top-level property
  Object.entries(data).forEach(([key, value]) => {
    // Check if value is a complex nested object (not empty)
    const isComplexObject =
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value).length > 0;

    // Check if value is an array of objects
    const isArrayOfObjects =
      Array.isArray(value) &&
      value.length > 0 &&
      value.every(item => item !== null && typeof item === 'object');

    if (isComplexObject) {
      // Create a separate table for complex nested objects
      tables.push({
        key,
        data: value,
        title: formatTitle(key),
        endpoint: baseEndpoint ? `${baseEndpoint}/${key}` : undefined,
      });
    } else if (isArrayOfObjects) {
      // Wrap array in an object for DynamicTable compatibility
      // DynamicTable expects an object, so we wrap the array with the key
      tables.push({
        key,
        data: { [key]: value }, // Wrap array: { PortStatistics: [...] }
        title: formatTitle(key),
        endpoint: baseEndpoint ? `${baseEndpoint}/${key}` : undefined,
      });
    } else {
      // Add primitives, simple arrays, and simple values to main table
      mainData[key] = value;
    }
  });

  // Add main table at the beginning if it has data
  if (Object.keys(mainData).length > 0) {
    tables.unshift({
      key: 'main',
      data: mainData,
      title: 'Device Information',
      endpoint: baseEndpoint ? `${baseEndpoint}/main` : undefined,
    });
  }

  return tables;
}

/**
 * Alternative function with custom configuration
 * Allows you to specify which fields should be in separate tables
 * 
 * @param data - The input data object
 * @param config - Configuration object
 * @returns Array of table configurations
 * 
 * @example
 * const tables = splitDataWithConfig(data, {
 *   mainFields: ['deviceClass', 'manufacturer'], // Force these to main table
 *   separateTables: ['Settings'], // Force this to separate table
 *   excludeFields: ['_id', '__v'] // Don't show these fields
 * });
 */
export function splitDataWithConfig(
  data: any,
  config: {
    mainFields?: string[]; // Fields to keep in main table
    separateTables?: string[]; // Fields to force into separate tables
    excludeFields?: string[]; // Fields to exclude completely
  } = {}
): TableData[] {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return [{ key: 'main', data, title: 'Data' }];
  }

  const {
    mainFields = [],
    separateTables = [],
    excludeFields = []
  } = config;

  const tables: TableData[] = [];
  const mainData: any = {};

  Object.entries(data).forEach(([key, value]) => {
    // Skip excluded fields
    if (excludeFields.includes(key)) {
      return;
    }

    // Force certain fields into separate tables
    if (separateTables.includes(key)) {
      const isArrayOfObjects = Array.isArray(value) && value.length > 0;
      tables.push({
        key,
        data: isArrayOfObjects ? { [key]: value } : value,
        title: formatTitle(key)
      });
      return;
    }

    // Force certain fields into main table
    if (mainFields.includes(key)) {
      mainData[key] = value;
      return;
    }

    // Default behavior: complex objects go to separate tables
    const isComplexObject = value && typeof value === 'object' && !Array.isArray(value);
    const isArrayOfObjects = Array.isArray(value) && value.length > 0;

    if (isComplexObject) {
      tables.push({
        key,
        data: value,
        title: formatTitle(key)
      });
    } else if (isArrayOfObjects) {
      tables.push({
        key,
        data: { [key]: value }, // Wrap array in object
        title: formatTitle(key)
      });
    } else {
      mainData[key] = value;
    }
  });

  if (Object.keys(mainData).length > 0) {
    tables.unshift({
      key: 'main',
      data: mainData,
      title: 'Device Information'
    });
  }

  return tables;
}

/**
 * Merges split tables back into original structure
 * Useful when you need to reconstruct the full object after editing individual tables
 * 
 * @param tables - Array of table data objects
 * @returns Merged data object
 * 
 * @example
 * const originalData = mergeTables(tables);
 */
export function mergeTables(tables: TableData[]): any {
  const result: any = {};

  tables.forEach(table => {
    if (table.key === 'main') {
      // Merge main table data directly into result
      Object.assign(result, table.data);
    } else {
      // Check if the data is wrapped (array in object)
      const dataKeys = Object.keys(table.data);
      if (dataKeys.length === 1 && dataKeys[0] === table.key && Array.isArray(table.data[table.key])) {
        // Unwrap: { PortStatistics: [...] } -> PortStatistics: [...]
        result[table.key] = table.data[table.key];
      } else {
        // Normal object
        result[table.key] = table.data;
      }
    }
  });

  return result;
}