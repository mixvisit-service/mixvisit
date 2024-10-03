import { getBatteryData } from './battery';
import { isDevToolsOpened } from './devToolsDetector';
import { getGeolocation } from './geolocation';
import { getLocation } from './location';
import { getMemoryInfo } from './memory';
import { getNetworkData } from './network';
import { getPerformanceData } from './performance';
import { getScreenData } from './screen';

export type ContextualClientParameters = typeof contextualClientParameters;

export const contextualClientParameters = {
  devToolsOpen: isDevToolsOpened,
  screen: getScreenData,
  location: getLocation,
  geolocation: getGeolocation,
  memory: getMemoryInfo,
  performance: getPerformanceData,
  networkInfo: getNetworkData,
  batteryInfo: getBatteryData,
};
