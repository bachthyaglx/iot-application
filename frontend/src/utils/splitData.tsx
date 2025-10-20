// src/utils/splitData.tsx

export interface TableData {
  key: string;
  data: any;
  title: string;
  endpoint?: string;
}

/**
 * Formats a key into a readable title
 */
export function formatTitle(key: string): string {
  if (key === key.toUpperCase()) {
    return key;
  }

  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Splits complex data into multiple table-ready objects
 * For objects with similar structure (like Ports), groups them together
 */
export function splitDataIntoTables(
  data: any,
  baseEndpoint?: string
): TableData[] {
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

  // Check if this looks like a "Ports" collection (multiple keys with similar nested objects)
  const entries = Object.entries(data);
  const hasMultipleSimilarObjects = entries.length > 1 &&
    entries.every(([_, value]) =>
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value as any).length > 0
    );

  // If it looks like a ports collection, keep the structure intact
  if (hasMultipleSimilarObjects) {
    // Check if all objects have similar structure (same top-level keys)
    const firstObjKeys = Object.keys(entries[0][1] as any).sort();
    const allSimilar = entries.every(([_, value]) => {
      const keys = Object.keys(value as any).sort();
      return keys.length === firstObjKeys.length &&
        keys.every((k, i) => k === firstObjKeys[i]);
    });

    if (allSimilar) {
      // Keep as one table with parent keys
      return [
        {
          key: 'main',
          data,
          title: 'Ports',
          endpoint: baseEndpoint,
        },
      ];
    }
  }

  // Original logic for mixed data
  Object.entries(data).forEach(([key, value]) => {
    const isComplexObject =
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value).length > 0;

    const isArrayOfObjects =
      Array.isArray(value) &&
      value.length > 0 &&
      value.every(item => item !== null && typeof item === 'object');

    if (isComplexObject) {
      tables.push({
        key,
        data: value,
        title: formatTitle(key),
        endpoint: baseEndpoint ? `${baseEndpoint}/${key}` : undefined,
      });
    } else if (isArrayOfObjects) {
      tables.push({
        key,
        data: { [key]: value },
        title: formatTitle(key),
        endpoint: baseEndpoint ? `${baseEndpoint}/${key}` : undefined,
      });
    } else {
      mainData[key] = value;
    }
  });

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

export function splitDataWithConfig(
  data: any,
  config: {
    mainFields?: string[];
    separateTables?: string[];
    excludeFields?: string[];
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
    if (excludeFields.includes(key)) {
      return;
    }

    if (separateTables.includes(key)) {
      const isArrayOfObjects = Array.isArray(value) && value.length > 0;
      tables.push({
        key,
        data: isArrayOfObjects ? { [key]: value } : value,
        title: formatTitle(key)
      });
      return;
    }

    if (mainFields.includes(key)) {
      mainData[key] = value;
      return;
    }

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
        data: { [key]: value },
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

export function mergeTables(tables: TableData[]): any {
  const result: any = {};

  tables.forEach(table => {
    if (table.key === 'main') {
      Object.assign(result, table.data);
    } else {
      const dataKeys = Object.keys(table.data);
      if (dataKeys.length === 1 && dataKeys[0] === table.key && Array.isArray(table.data[table.key])) {
        result[table.key] = table.data[table.key];
      } else {
        result[table.key] = table.data;
      }
    }
  });

  return result;
}