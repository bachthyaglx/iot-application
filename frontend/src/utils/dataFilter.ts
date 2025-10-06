/**
 * Remoove specified fields from an object
 */
export const excludeFields = <T extends Record<string, any>>(
  data: T,
  fieldsToExclude: string[]
): Partial<T> => {
  if (!data || typeof data !== 'object') return data;

  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !fieldsToExclude.includes(key))
  ) as Partial<T>;
};

/**
 * Only keep specified fields in an object
 */
export const includeFields = <T extends Record<string, any>>(
  data: T,
  fieldsToInclude: string[]
): Partial<T> => {
  if (!data || typeof data !== 'object') return data;

  return Object.fromEntries(
    Object.entries(data).filter(([key]) => fieldsToInclude.includes(key))
  ) as Partial<T>;
};

// List of common fields to exclude
export const COMMON_HIDDEN_FIELDS = ['id', '_id', '__v', 'password', 'token'];