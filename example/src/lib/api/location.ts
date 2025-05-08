/* eslint-disable no-param-reassign */

import { TDef } from '@utils/common';
import { fetchJSON } from '@utils/fetch';

import type { LocationDataRaw, LocationData } from '$lib/types';

/**
 * Gets the location data of the visitor.
 *
 * @returns The location data in the object format or null if the data can't be retrieved.
 */
export const getLocationData = async (): Promise<LocationData | null> => {
  try {
    const location = await fetchJSON<LocationDataRaw>('https://ipgeo.iphey.com/');
    if (!location) {
      return null;
    }

    return Object.keys(location).reduce((result, key) => {
      if (['isEu', 'metroCode', 'regionCode', 'airport'].includes(key)) {
        return result;
      }

      if (key === 'timezone' && location[key]?.name) {
        result[key] = location[key].name;

        return result;
      }

      if (!TDef.isUndefined(location[key as keyof LocationDataRaw])) {
        (result as any)[key] = location[key as keyof LocationData];
      }

      return result;
    }, {} as LocationData);
  } catch (err) {
    console.error('Error in getLocationData(): ', err);

    return null;
  }
};
