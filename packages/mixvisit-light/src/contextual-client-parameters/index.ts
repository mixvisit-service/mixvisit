import { getBatteryData } from './battery';
import { getGeolocation } from './geolocation';
import { getLocation } from './location';
import { getMemoryInfo } from './memory';
import { getNetworkData } from './network';
import { getPerformanceData } from './performance';

export type ContextualClientParameters = typeof contextualClientParameters;

export const contextualClientParameters = {
  location: getLocation,
  geolocation: getGeolocation,
  memory: getMemoryInfo,
  performance: getPerformanceData,
  networkInfo: getNetworkData,
  batteryInfo: getBatteryData,
};
