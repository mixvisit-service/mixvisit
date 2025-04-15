export type VisitorData = {
  visitorID: string;
  location: LocationData;
};

export type VisitorStorageData = VisitorData & {
  time: string;
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
  },
  languages: string;
};

export type GroupedError = {
  code: string;
  message: string;
  params: string[];
};
