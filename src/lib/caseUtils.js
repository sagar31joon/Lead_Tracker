/**
 * Convert a camelCase string to snake_case.
 * e.g. "companyName" → "company_name"
 */
function camelToSnakeStr(str) {
    return str.replace(/([A-Z0-9])/g, '_$1').toLowerCase();
}

/**
 * Convert a snake_case string to camelCase.
 * e.g. "company_name" → "companyName"
 */
function snakeToCamelStr(str) {
    return str.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

/**
 * Convert all keys of an object from camelCase to snake_case.
 */
export function toSnakeCase(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[camelToSnakeStr(key)] = value;
    }
    return result;
}

/**
 * Convert all keys of an object from snake_case to camelCase.
 */
export function toCamelCase(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        result[snakeToCamelStr(key)] = value;
    }
    return result;
}
