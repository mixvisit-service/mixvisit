import type { ClientData } from '@mix-visit/lite';
import { VisitStatus } from './enums';

export type VisitorData = {
  visitorID: string;
  location: LocationData;
};

export type VisitorStorageData = VisitorData & {
  time: string;
};

export type VisitData = {
  country: string;
  city: string;
  lat: number;
  lng: number;
  time: string;
  when: string;
  visitStatus: (typeof VisitStatus)[keyof typeof VisitStatus];
  isIncognito: null;
};

export type VisitorInfo = {
  personalId: string;
  ip: string;
  location: string;
  ipAddress: number;
  geolocations: number;
  visitCounter: number;
  isIncognito: null;
  incognitoCounter: null;
};

export type LocationData = {
  ip: string;
  asn: number;
  org: string;
  city: string;
  country: string;
  countryName: string;
  continent: string;
  latitude: string;
  longitude: string;
  region: string;
  timezone: string;
  languages: string;
};

export type LocationDataRaw = {
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
  regionCode: string;
  timezone: {
    name: string;
  };
  languages: string;
};

export type GroupedError = {
  code: string;
  message: string;
  params: string[];
};

export type MixVisitResult = {
  fingerprintHash: string | null;
  loadTime: number | null;
  data: ClientData | null;
};
