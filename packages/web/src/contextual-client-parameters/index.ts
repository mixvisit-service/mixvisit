import { getGeolocation } from './geolocation';
import { getLocation } from './location';

export type ContextualClientParameters = typeof contextualClientParameters;

export const contextualClientParameters = {
  location: getLocation,
  geolocation: getGeolocation,
};
