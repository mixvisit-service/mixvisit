/* eslint-disable no-param-reassign */
import { fetcher, hasProperty } from '../utils/helpers';

type LocationDataRaw = {
  ip: string;
  asn: number;
  org: string;
  city: string;
  country: string;
  countryName: string;
  continent: string;
  latitude: string;
  longitude: string;
  airport: string;
  region: string;
  isEu: boolean;
  metroCode: string;
  regionCode: string;
  timezone: {
    name: string;
  },
  languages: string;
};

type LocationData = Omit<LocationDataRaw, 'timezone' | 'metroCode' | 'regionCode' | 'isEu' | 'airport'> & { timezone: string; };

export async function getLocation(): Promise<LocationData | null> {
  try {
    const location = await fetcher<LocationDataRaw>('https://ipgeo.myip.link/');
    if (!location) {
      return null;
    }

    return Object.entries(location).reduce((result, [key, value]) => {
      if (!['isEu', 'metroCode', 'regionCode', 'airport'].includes(key)) {
        const isTimezoneField = key === 'timezone' && typeof value === 'object' && hasProperty(value, 'name');
        result[key] = isTimezoneField ? value.name : value;
      }

      return result;
    }, {} as LocationData);
  } catch (err) {
    console.error(err);

    return null;
  }
}
