import { FPClient, type DescriptorsRes } from '@mix-visit/web';
import type { Marker } from 'leaflet';

export const type = (value: any): string => {
  const matches = Object.prototype.toString.call(value)
    .match(/^\[object (\S+?)\]$/) || [];

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

export async function fetchJSON<T>(request: string): Promise<T | null> {
  try {
    const response = await fetch(request);
    const contentType = response.headers.get('content-type');
    if (!(contentType && contentType.includes('application/json'))) {
      throw new TypeError("Oops, we haven't got JSON!");
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);

    return null;
  }
}

type FPInfoRes = {
  fingerprintHash: string | null;
  loadTime: number | null;
  data: Record<string, any>;
};

export async function getFPData(): Promise<FPInfoRes> {
  const fpClient = new FPClient();
  await fpClient.load();

  const data: DescriptorsRes = fpClient.get();
  const { fingerprintHash, loadTime } = fpClient;

  return {
    fingerprintHash,
    loadTime,
    data,
  };
}

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

export function formatDateDifference(date: string): string {
  const today = new Date();
  const givenDate = new Date(date);
  today.setHours(0, 0, 0, 0);
  givenDate.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - givenDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'TODAY';
  }

  if (diffDays === 1) {
    return 'YESTERDAY';
  }

  return `${diffDays} DAYS AGO`;
}

export function bindMarkerPopup(data: { marker: Marker<any>; country: string; city: string }): void {
  const { marker, country, city } = data || {};
  if (!marker) {
    return;
  }

  marker.closePopup();

  if (!(country && city)) {
    marker.unbindPopup();

    return;
  }

  const infoArr = [city, country].filter((el) => el);
  const locationInfo = infoArr.length ? `<b>${infoArr.join(', ')}</b>` : '';
  if (locationInfo) {
    marker.bindPopup(locationInfo);
  }
}
