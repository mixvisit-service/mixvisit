/**
 * Gets the type of a value.
 *
 * @param value - The value to get the type for.
 * @returns The type of the value.
 */
export const type = (value: any): string => {
  const matches = Object.prototype.toString.call(value).match(/^\[object (\S+?)\]$/) || [];

  return matches[1]?.toLowerCase() || 'undefined';
};

export const TDef = {
  isString: (value: any) => type(value) === 'string',
  isNumber: (value: any) => type(value) === 'number',
  isNumberFinity: (value: any) => Number.isFinite(value),
  isNegativeInfinity: (value: any) => value === Number.NEGATIVE_INFINITY,
  isPositiveInfinity: (value: any) => value === Number.POSITIVE_INFINITY,
  isNaN: (value: any) => Number.isNaN(value),
  isObject: (value: any) => type(value) === 'object',
  isArray: (value: any) => type(value) === 'array',
  isBoolean: (value: any) => type(value) === 'boolean',
  isSymbol: (value: any) => type(value) === 'symbol',
  isUndefined: (value: any) => type(value) === 'undefined',
  isNull: (value: any) => type(value) === 'null',
  isDate: (value: any) => type(value) === 'date',
  isBigIng: (value: any) => type(value) === 'bigint',
  isMap: (value: any) => type(value) === 'map',
  isSet: (value: any) => type(value) === 'set',
  isWeakMap: (value: any) => type(value) === 'weakmap',
  isWeakSet: (value: any) => type(value) === 'weakset',
  isRegExp: (value: any) => type(value) === 'regexp',
  isFunc: (value: any) => type(value) === 'function',
  isError: (value: any) => type(value) === 'error',
  isNil: (value: any) => TDef.isUndefined(value) || TDef.isNull(value),
};

/**
 * Format a date string as `DD MMM YYYY HH:MM`.
 *
 * @param date - A date string in any format supported by the Date constructor.
 * @returns A string in the format `DD MMM YYYY HH:MM`.
 */
export function formatDate(date: string): string {
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;
  const givenDate = new Date(date);

  const day = String(givenDate.getDate()).padStart(2, '0');
  const month = monthNames[givenDate.getMonth()];
  const year = givenDate.getFullYear();
  const hours = String(givenDate.getHours()).padStart(2, '0');
  const minutes = String(givenDate.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year} ${hours}:${minutes}`;
}

/**
 * Format a date string as a string indicating how many days ago it was.
 *
 * @param date - A date string in any format supported by the Date constructor.
 * @returns A string like 'TODAY', 'YESTERDAY', or a number followed by 'DAYS AGO'.
 */
export function formatDateDifference(date: string): string {
  const today = new Date();
  const givenDate = new Date(date);
  today.setHours(0, 0, 0, 0);
  givenDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - givenDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  switch (diffDays) {
    case 0:
      return 'TODAY';
    case 1:
      return 'YESTERDAY';
    default:
      return `${diffDays} DAYS AGO`;
  }
}
